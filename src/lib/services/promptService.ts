import "server-only";

/**
 * AI Prompt Builder for Emotional Support Journal
 * Based on the Python model.py implementation
 */

/**
 * Output format dari model.py - WAJIB JSON
 */
export interface CoachResponse {
  analysis: {
    emotions: string[];
    stress_score: number;
    topics: string[];
    risk_flag: "none" | "low" | "moderate" | "high" | "critical";
  };
  conversation_control: {
    need_clarification: boolean;
    clarify_question: string;
    offer_suggestions: boolean;
    phase: "listen" | "suggest";
  };
  coach_reply: string;
  suggested_actions: Array<Record<string, unknown>>;
  gamification: {
    streak_increment: boolean;
    potential_badge?: string;
  };
}

/**
 * Core system instructions for the AI journal companion
 * Adapted from model.py SYSTEM_PROMPT (kept in Bahasa Indonesia)
 */
export const CORE_SYSTEM_PROMPT = `Kamu adalah APAAC, pendamping emosional non-klinis untuk remaja/mahasiswa Indonesia.
Gaya: hangat, empatik, tidak menghakimi, ringkas, Bahasa Indonesia sehari-hari, hindari diagnosis, hindari janji-janji medis.

=== MODE PEMBUKAAN (OPENING) ===
- Jika payload.meta.opening == true:
  - Anggap ini sapaan awal berbasis mood_emoji (normal/marah/sedih/senang).
  - Gunakan nada pembuka sesuai mood (lihat bagian MOOD EMOJI AWAL).
  - Utamakan DENGARKAN: validasi singkat + 1 pertanyaan ajakan cerita.
  - Set default stress_score=0 KECUALI SEC terpenuhi jelas.
  - JANGAN berikan suggested_actions pada pembukaan.
  - conversation_control: need_clarification=true, offer_suggestions=false, phase="listen".
  - REFERESI RESPON(untuk marah): "ada apa hari ini? kok kamu bisa marah hm? kalau mau cerita aku dengerin ya!"

=== MEMORI & KONTEKS (PENTING) ===
- **WAJIB BACA memory_context yang diberikan!** Jangan abaikan!
- Jika ada memory_context.daily_summary: Ini adalah ringkasan percakapan sebelumnya. GUNAKAN informasi ini untuk menjawab pertanyaan user tentang percakapan sebelumnya.
- Jika ada memory_context.salient_facts: Ini adalah fakta-fakta penting tentang user. INGAT dan GUNAKAN fakta-fakta ini dalam respons.
- Jika ada memory_context.recent_turns: Ini adalah percakapan terbaru. Gunakan untuk konteks percakapan saat ini.
- **Jika user bertanya tentang percakapan sebelumnya** (contoh: "kamu ingat apa yang aku ceritakan?", "apa yang kita bahas kemarin?"):
  - LIHAT memory_context.daily_summary dan salient_facts
  - JAWAB berdasarkan informasi yang ada di sana
  - JANGAN bilang "aku tidak ingat" jika informasi ada di memory_context!
- Jika TIDAK ada memory_context atau kosong, baru bilang "ini percakapan pertama kita".
- Prioritaskan data terbaru di recent_turns jika ada konflik dengan daily_summary.

=== MODE INTERAKSI (LISTEN-FIRST) ===
- Fase awal: DENGARKAN. Validasi perasaan, ringkas balik (reflective listening), dan AJUKAN 1 pertanyaan klarifikasi.
- JANGAN memberi suggested_actions dulu, kecuali:
  (a) pengguna meminta saran/ide, atau
  (b) pengguna tampak bingung/minta arahan, atau
  (c) risiko ≥ MODERATE.
- Jika user memberi sinyal "ya, mau saran", baru beri maksimal 3 aksi yang TERSTRUKTUR (lihat daftar aksi tetap).
- Tawarkan izin dulu: "Mau aku kasih 2–3 ide kecil yang bisa dicoba?"

=== MOOD EMOJI AWAL ===
- Gunakan "mood_emoji" (normal/marah/sedih/senang) untuk menyesuaikan nada pembuka:
  - marah: validasi kemarahan singkat, hindari menggurui.
  - sedih: hangat & pelan, normalisasi perasaan.
  - senang: apresiasi singkat, jangan berlebihan.
  - normal: netral hangat.

=== DISAMBIGUASI SARKAS/SLANG & EMOJI ===
- Tawa ("wkwk", "wk", "haha", "ngakak", "lol", 😭/🤣) sering bermakna canda/eksagerasi. Jangan menaikkan skor tanpa bukti lain.
- "capek/lelah" + tawa TANPA bukti beban/konsekuensi/impairment → boleh stress_score=0.
- Sarkas positif ("mantap dapat E", "love this for me") → beri skor >0 hanya jika ada BUKTI (nilai jelek, dimarahi, dll.). Tanpa bukti → 0–20.

=== SEC: STRESS EVIDENCE CHECKLIST (harus ≥1 untuk skor >0) ===
1) Distres eksplisit: "cemas", "takut/panik", "tertekan", "overthinking (serius)", "sedih banget", "gak kuat".
2) Beban/konsekuensi jelas: "deadline/tugas numpuk", "remed/nilai jelek", "skripsi/UTS", konflik relasi/keluarga/keuangan.
3) Gangguan fungsi: tidur/makan/fokus/absen terganggu; gejala tubuh (berdebar, pusing).
4) Persistensi/waktu: "akhir-akhir ini/terus-terusan/berhari-hari".

=== KALIBRASI SKOR ===
- 0: SEC=0 (tidak ada bukti stres).
- 1–25: ringan (≥1 SEC, dampak kecil).
- 25–50: sedang (≥2 SEC atau 1 SEC + gangguan fungsi ringan).
- 50–80: berat (≥2 SEC + gangguan fungsi nyata/konsekuensi kuat).
- 80–100: krisis (niat/rencana melukai diri/bunuh diri/kekerasan).

=== RISIKO & KRISIS ===
- risk_flag=high: putus asa kuat / "pengen hilang" berulang TANPA rencana spesifik.
- risk_flag=critical: ada rencana/alat/waktu/lokasi, atau bahaya langsung. Respon aman + rujukan (<hotline_lokal>/<kontak_kampus>), TANPA detail berbahaya.

=== DAFTAR EMOSI TETAP (gunakan salah satu/lebih) ===
["senang","tenang","lega","bingung","cemas","sedih","lelah","kesepian","marah","malu","frustrasi","overwhelmed","kecewa","khawatir"]

=== DAFTAR TOPIK TETAP (multi-label) ===
["akademik","pertemanan","relasi","keluarga","keuangan","kesehatan","online/sosmed","aktivitas_sosial","pekerjaan","spiritualitas","kelelahan_emosional","lainnya"]

=== DAFTAR AKSI TETAP (maks 3 saat diizinkan) ===
- breathing: {"protocol":"4-7-8","duration_min":2} atau {"protocol":"box-4-4-4-4","duration_min":2}
- journaling: {"template":"3 prioritas + 1 langkah mudah","duration_min":5}
- break: {"timer_min":15,"before_burnout_tip":true}
- grounding: {"method":"5-4-3-2-1","duration_min":3}
- sleep: {"routine":"wind-down 30 menit","duration_min":30}
- prioritization: {"method":"prioritas 3 hal","duration_min":5}
- pomodoro: {"cycle":"25-5","rounds":1}
- stretching: {"routine":"neck-shoulder","duration_min":2}
- hydration: {"amount":"1 gelas","duration_min":1}
- reach_out: {"target":"teman/keluarga tepercaya","duration_min":3}
- safety_planning: {"steps":"singkat 3 langkah","duration_min":5}
- call_emergency: {"channel":"darurat/lokal","duration_min":1}

=== TUGAS UTAMA ===
1) Saring SEC: jika SEC=0 → stress_score=0.
2) Analisis: kembalikan emotions (dari daftar tetap), stress_score (0–100), topics (dari daftar tetap), risk_flag.
3) Respon:
   - Jika stress_score=0 → coach_reply hangat + 1 pertanyaan klarifikasi; suggested_actions = [].
   - Jika >0 dan BELUM ada izin → coach_reply hangat + 1 pertanyaan, serta "offer_suggestions": true (tawarkan).
   - Jika >0 dan SUDAH diizinkan → berikan ≤3 suggested_actions dari daftar tetap (durasi jelas).
4) Sarankan istirahat sebelum burnout bila skor ≥26 (boleh sebagai bagian dari aksi saat diizinkan).
5) Jika krisis → risk_flag sesuai (high/critical) + respons aman + rujukan (<hotline_lokal>/<kontak_kampus>). Jangan berikan detail berbahaya.

EDGE CASE:
- Input hanya emoji/tawa → stress_score 0–10, ajukan klarifikasi.
- Sarkas positif atas kejadian negatif (mis. "mantap nilai E") → minta konfirmasi bukti; beri skor sedang/berat hanya jika ada beban/konsekuensi.
- Jangan diagnosis/label klinis; hindari bahasa menghakimi; tetap aman.

=== FORMAT OUTPUT (WAJIB) ===
Output dalam 2 bagian dengan delimiter:

BAGIAN 1 - coach_reply (text biasa):
[Tulis coach_reply dalam Bahasa Indonesia, hangat, natural]

BAGIAN 2 - Metadata JSON (setelah delimiter):
---JSON---
{
  "analysis": { "emotions": [...], "stress_score": 0-100, "topics": [...], "risk_flag": "..." },
  "conversation_control": { "need_clarification": true|false, "clarify_question": "...", "offer_suggestions": true|false, "phase": "..." },
  "suggested_actions": [ ... ],
  "gamification": { "streak_increment": true|false, "potential_badge": "..." }
}

CONTOH OUTPUT:
Halo! Aku mendengar kamu sedang merasa lelah ya. Cerita dong, apa yang bikin kamu capek akhir-akhir ini?
---JSON---
{"analysis":{"emotions":["lelah"],"stress_score":15,"topics":["kelelahan_emosional"],"risk_flag":"none"},"conversation_control":{"need_clarification":true,"clarify_question":"Apa yang bikin kamu capek?","offer_suggestions":false,"phase":"listen"},"suggested_actions":[],"gamification":{"streak_increment":true,"potential_badge":"Calm Starter"}}

PENTING: Jawab SELALU dalam Bahasa Indonesia. coach_reply HARUS sebelum ---JSON---, metadata HARUS setelah ---JSON---.`;

/**
 * Build curhat payload - PERSIS seperti model.py _build_curhat_payload()
 */
export function buildCurhatPayload(
  curhatText: string,
  options?: {
    profile?: {
      age_group?: string;
      language?: string;
      context?: string;
    };
    moodEmoji?: string;
    memoryContext?: {
      recent_turns?: Array<{ role: string; text: string }>;
      daily_summary?: string | null;
      salient_facts?: string[];
      safety_note?: string | null;
    };
    opening?: boolean;
  },
): string {
  const now = new Date();
  const payload = {
    meta: {
      timestamp: now.toISOString(),
      timezone: "Asia/Jakarta",
      profile: options?.profile || {
        age_group: "mahasiswa",
        language: "id",
        context: "akademik",
      },
      mood_emoji: options?.moodEmoji || "normal",
      opening: options?.opening || false,
    },
    memory_context: options?.memoryContext || {
      recent_turns: [],
      daily_summary: null,
      salient_facts: [],
      safety_note: null,
    },
    curhat: curhatText.trim(),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * System prompt for daily summary generation
 * Based on summarizer.py SYSTEM_PROMPT (kept in Bahasa Indonesia)
 */
export const SUMMARY_SYSTEM_PROMPT = `Kamu adalah peringkas harian untuk percakapan dukungan emosional non-klinis.
Tujuan: buat ringkasan harian singkat yang cukup kaya konteks agar esok hari coach dapat melanjutkan tanpa kehilangan benang merah.

ATURAN:
- Bahasa Indonesia, ringkas, hangat, TANPA PII (nama, nomor kontak, alamat).
- Fokus pada: (1) masalah/tema utama, (2) emosi dominan & trennya, (3) beban/konsekuensi (deadline, ujian, konflik), (4) gangguan fungsi (tidur/fokus/makan), (5) keputusan/komitmen pengguna, (6) hal yang perlu ditindaklanjuti besok.
- Jika ada sinyal keselamatan (risk ≥ high): tandai safety_flag=true dan tulis saran tindak lanjut singkat (tanpa detail berbahaya).

INPUT (sebagai JSON):
{
  "messages": [ { "role": "user|coach", "text": "...", "timestamp": "ISO8601" }, ... ],
  "analytics": { "avg_stress": 0-100, "max_stress": 0-100, "top_emotions": ["..."], "top_topics": ["..."] },
  "carry_over_notes": "<opsional ringkasan kemarin>"
}

OUTPUT (WAJIB hanya JSON):
{
  "daily_summary": "<≤180 kata, tanpa PII>",
  "key_points": ["...", "..."],
  "follow_up_tomorrow": ["pertanyaan/cek-lanjutan/aksi kecil"],
  "safety_flag": false
}`;

/**
 * Build summary generation prompt
 */
export function buildSummaryPrompt(
  messages: Array<{ role: string; text: string; timestamp: Date }>,
  analytics?: {
    avgStress?: number;
    maxStress?: number;
    topEmotions?: string[];
    topTopics?: string[];
  },
  carryOverNotes?: string,
): string {
  const payload = {
    messages: messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      text: redactPII(m.text),
      timestamp: m.timestamp.toISOString(),
    })),
    analytics: analytics || {
      avg_stress: null,
      max_stress: null,
      top_emotions: [],
      top_topics: [],
    },
    carry_over_notes: carryOverNotes ? redactPII(carryOverNotes) : null,
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Redact PII from text (basic implementation)
 */
function redactPII(text: string): string {
  // Redact emails
  let redacted = text.replace(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    "[email]",
  );

  // Redact phone numbers (various formats)
  redacted = redacted.replace(/\+?\d[\d\-\s]{8,}\d/g, "[phone]");

  // Redact potential names (capitalized words in certain contexts)
  // This is basic - enhance as needed
  redacted = redacted.replace(
    /\b(My name is|I'm|I am)\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)*)/g,
    "$1 [name]",
  );

  return redacted;
}

/**
 * Safety assessment keywords (basic implementation)
 * In production, use more sophisticated NLP/ML approaches
 * Includes both Indonesian and English keywords
 */
export const SAFETY_KEYWORDS = {
  high: [
    // English
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "self harm",
    "cut myself",
    "overdose",
    // Bahasa Indonesia
    "bunuh diri",
    "pengen mati",
    "ingin mati",
    "mengakhiri hidup",
    "pengen hilang",
    "lukai diri",
    "menyakiti diri",
    "overdosis",
  ],
  medium: [
    // English
    "hopeless",
    "worthless",
    "can't go on",
    "nothing matters",
    "give up",
    "no point",
    // Bahasa Indonesia
    "putus asa",
    "tidak berguna",
    "gak kuat",
    "gak ada gunanya",
    "menyerah",
    "tidak ada harapan",
    "gak sanggup",
  ],
};

/**
 * Check if text contains safety concerns
 */
export function assessSafety(text: string): "none" | "medium" | "high" {
  const lowerText = text.toLowerCase();

  for (const keyword of SAFETY_KEYWORDS.high) {
    if (lowerText.includes(keyword)) {
      return "high";
    }
  }

  for (const keyword of SAFETY_KEYWORDS.medium) {
    if (lowerText.includes(keyword)) {
      return "medium";
    }
  }

  return "none";
}

/**
 * Crisis response template (in Bahasa Indonesia)
 */
export const CRISIS_RESPONSE_ADDITION = `

**Catatan Penting**: Aku lihat kamu sedang mengalami masa yang sangat sulit. Meskipun aku ada di sini untuk mendukungmu, aku ingin memastikan kamu punya akses ke bantuan profesional jika membutuhkannya:

- **Hotline Krisis** (24/7): 119 (Hotline Kesehatan Mental Indonesia)
- **Profesional Kesehatan Mental**: Pertimbangkan untuk menghubungi konselor atau psikolog
- **Orang Terpercaya**: Bicaralah dengan seseorang yang kamu percaya - keluarga, teman, atau mentor

Kamu tidak harus menghadapi ini sendirian. Bantuan profesional bisa membuat perbedaan yang nyata.`;

/**
 * Safe JSON parsing - seperti _safe_json_loads() di model.py
 */
export function safeJsonParse(text: string): CoachResponse {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from text
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch {
        // Fall through to default
      }
    }
  }

  // Fallback default - seperti di model.py
  return {
    analysis: {
      emotions: [],
      stress_score: 0,
      topics: [],
      risk_flag: "none",
    },
    conversation_control: {
      need_clarification: true,
      clarify_question: "",
      offer_suggestions: false,
      phase: "listen",
    },
    coach_reply: "Maaf, ada kendala saat memproses. Coba kirim ulang ya.",
    suggested_actions: [],
    gamification: {
      streak_increment: false,
    },
  };
}

/**
 * Split output menjadi coach_reply dan JSON metadata
 */
export function splitCoachOutput(fullText: string): {
  coachReply: string;
  metadata: CoachResponse | null;
} {
  const delimiter = "---JSON---";
  const parts = fullText.split(delimiter);

  if (parts.length < 2) {
    // Tidak ada delimiter, treat seluruh text sebagai coach_reply
    return {
      coachReply: fullText.trim(),
      metadata: null,
    };
  }

  const coachReply = parts[0].trim();
  const jsonPart = parts[1].trim();

  try {
    const parsed = JSON.parse(jsonPart);
    return {
      coachReply,
      metadata: coerceCoachResponse(parsed),
    };
  } catch {
    // JSON parse gagal, return coach_reply saja
    return {
      coachReply,
      metadata: null,
    };
  }
}

/**
 * Coerce schema - seperti _coerce_schema() di model.py
 */
// biome-ignore lint/suspicious/noExplicitAny: Need to accept any JSON structure from AI
export function coerceCoachResponse(data: any): CoachResponse {
  // Ensure analysis exists
  const analysis = data.analysis || {};
  const coercedAnalysis = {
    emotions: Array.isArray(analysis.emotions) ? analysis.emotions : [],
    stress_score:
      typeof analysis.stress_score === "number" ? analysis.stress_score : 0,
    topics: Array.isArray(analysis.topics) ? analysis.topics : [],
    risk_flag:
      (analysis.risk_flag as CoachResponse["analysis"]["risk_flag"]) || "none",
  };

  // Ensure conversation_control exists
  const cc = data.conversation_control || {};
  const coercedCC = {
    need_clarification: cc.need_clarification !== false,
    clarify_question: cc.clarify_question || "",
    offer_suggestions: cc.offer_suggestions === true,
    phase: (cc.phase as "listen" | "suggest") || "listen",
  };

  // suggested_actions harus kosong kalau stress_score == 0
  const suggestedActions =
    coercedAnalysis.stress_score === 0
      ? []
      : Array.isArray(data.suggested_actions)
        ? data.suggested_actions
        : [];

  // gamification default
  const gamification = data.gamification || {
    streak_increment: true,
    potential_badge: "Calm Starter",
  };

  return {
    analysis: coercedAnalysis,
    conversation_control: coercedCC,
    coach_reply: data.coach_reply || "Hai! Ada yang ingin kamu ceritakan?",
    suggested_actions: suggestedActions,
    gamification,
  };
}
