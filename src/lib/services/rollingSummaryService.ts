import "server-only";
import { resilientGenerateText } from "@/lib/ai/resilientAI";

/**
 * Rolling Summary Service for RAG System
 *
 * Problem: Query rewriting masih terlalu slow dan tidak reliable.
 * Solution: Store structured daily summaries that capture key facts about user.
 *
 * Approach: After each conversation, generate a rolling summary that includes:
 * - Personal info (name, preferences, etc.)
 * - Recent topics and concerns
 * - Emotional state and trends
 * - Follow-up items
 *
 * This summary is injected directly into context (no search needed!)
 */

export type ConversationMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

export type Analytics = {
  avgStress?: number;
  maxStress?: number;
  topEmotions?: string[];
  topTopics?: string[];
};

export type RollingSummary = {
  dailySummary: string;
  keyPoints: string[];
  followUpTomorrow: string[];
  safetyFlag: boolean;
};

/**
 * System prompt for rolling summary generation
 * Translated from Python summarizer.py
 */
const SYSTEM_PROMPT = `
Kamu adalah peringkas harian untuk percakapan dukungan emosional non-klinis.
Tujuan: buat ringkasan harian singkat yang cukup kaya konteks agar esok hari coach dapat melanjutkan tanpa kehilangan benang merah.

ATURAN:
- Bahasa Indonesia, ringkas, hangat, TANPA PII (nama, nomor kontak, alamat).
- Fokus pada: (1) masalah/tema utama, (2) emosi dominan & trennya, (3) beban/konsekuensi (deadline, ujian, konflik), (4) gangguan fungsi (tidur/fokus/makan), (5) keputusan/komitmen pengguna, (6) hal yang perlu ditindaklanjuti besok.
- Jika ada sinyal keselamatan (risk ≥ high): tandai safety_flag=true dan tulis saran tindak lanjut singkat (tanpa detail berbahaya).

INPUT (sebagai JSON):
{
  "messages": [ { "role": "user|assistant", "text": "...", "timestamp": "ISO8601" }, ... ],
  "analytics": { "avg_stress": 0-100, "max_stress": 0-100, "top_emotions": ["..."], "top_topics": ["..."] },
  "carry_over_notes": "<opsional ringkasan kemarin>"
}

OUTPUT (WAJIB hanya JSON):
{
  "daily_summary": "<≤180 kata, tanpa PII>",
  "key_points": ["...", "..."],
  "follow_up_tomorrow": ["pertanyaan/cek-lanjutan/aksi kecil"],
  "safety_flag": false
}
`.trim();

/**
 * Generate rolling summary from conversation messages
 *
 * @param messages - Conversation messages to summarize
 * @param analytics - Optional analytics data (stress, emotions, topics)
 * @param carryOverNotes - Optional previous summary to maintain continuity
 * @returns Rolling summary with key points and follow-ups
 */
export async function generateRollingSummary(
  messages: ConversationMessage[],
  analytics?: Analytics,
  carryOverNotes?: string,
): Promise<RollingSummary> {
  // Normalize and redact PII
  const normalizedMessages = messages.map((m) => ({
    role: m.role,
    text: redactPII(m.text),
    timestamp: m.timestamp.toISOString(),
  }));

  // Sort by timestamp
  normalizedMessages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // Build payload
  const payload = {
    messages: normalizedMessages,
    analytics: analytics || {
      avg_stress: null,
      max_stress: null,
      top_emotions: [],
      top_topics: [],
    },
    carry_over_notes: carryOverNotes ? redactPII(carryOverNotes) : null,
  };

  console.log("=== ROLLING SUMMARY GENERATION ===");
  console.log("Message count:", messages.length);
  console.log("Has carry-over notes:", !!carryOverNotes);

  try {
    // Use resilient AI with automatic fallback (2.5 Flash → 2.0 Flash)
    const { text } = await resilientGenerateText({
      system: SYSTEM_PROMPT,
      prompt: JSON.stringify(payload, null, 2),
      temperature: 0.3, // Low temperature for consistency
    });

    console.log("Raw summary output:", text.substring(0, 200));

    // Parse JSON response
    const parsed = safeJsonParse(text);

    // Validate and trim to 180 words
    const summary: RollingSummary = {
      dailySummary: trimToWords(
        typeof parsed.daily_summary === "string" ? parsed.daily_summary : "",
        180,
      ),
      keyPoints: Array.isArray(parsed.key_points) ? parsed.key_points : [],
      followUpTomorrow: Array.isArray(parsed.follow_up_tomorrow)
        ? parsed.follow_up_tomorrow
        : [],
      safetyFlag: Boolean(parsed.safety_flag),
    };

    console.log("=== SUMMARY GENERATED ===");
    console.log(
      "Daily summary length:",
      summary.dailySummary.split(" ").length,
      "words",
    );
    console.log("Key points:", summary.keyPoints.length);
    console.log("Follow-ups:", summary.followUpTomorrow.length);
    console.log("Safety flag:", summary.safetyFlag);

    return summary;
  } catch (error) {
    console.error("Error generating rolling summary:", error);

    // Return fallback summary
    return {
      dailySummary: "Ringkasan tidak tersedia karena kendala sistem.",
      keyPoints: [],
      followUpTomorrow: [],
      safetyFlag: false,
    };
  }
}

/**
 * Redact PII (Personal Identifiable Information) from text
 * Removes email addresses and phone numbers
 */
function redactPII(text: string): string {
  let redacted = text;

  // Redact email addresses
  redacted = redacted.replace(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    "[email]",
  );

  // Redact phone numbers (various formats)
  redacted = redacted.replace(/\+?\d[\d\-\s]{8,}\d/g, "[nomor]");

  return redacted;
}

/**
 * Trim text to maximum word count
 */
function trimToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Safely parse JSON, extracting JSON even if wrapped in markdown or other text
 */
function safeJsonParse(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from text
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } catch {
        // Fallback
      }
    }

    // Return minimal fallback structure
    return {
      daily_summary: "Ringkasan tidak tersedia karena kendala parsing.",
      key_points: [],
      follow_up_tomorrow: [],
      safety_flag: false,
    };
  }
}

/**
 * Format rolling summary for injection into AI context
 * Creates a concise, structured representation for the AI
 */
export function formatSummaryForContext(summary: RollingSummary): string {
  const parts: string[] = [];

  parts.push("=== RINGKASAN PERCAKAPAN SEBELUMNYA ===");
  parts.push("");
  parts.push(summary.dailySummary);
  parts.push("");

  if (summary.keyPoints.length > 0) {
    parts.push("POIN PENTING:");
    summary.keyPoints.forEach((point, i) => {
      parts.push(`${i + 1}. ${point}`);
    });
    parts.push("");
  }

  if (summary.followUpTomorrow.length > 0) {
    parts.push("HAL YANG PERLU DITINDAKLANJUTI:");
    summary.followUpTomorrow.forEach((item, i) => {
      parts.push(`${i + 1}. ${item}`);
    });
    parts.push("");
  }

  if (summary.safetyFlag) {
    parts.push("⚠️ PERHATIAN: Ada indikasi yang memerlukan perhatian khusus.");
    parts.push("");
  }

  parts.push("=== AKHIR RINGKASAN ===");

  return parts.join("\n");
}
