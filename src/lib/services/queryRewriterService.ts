import "server-only";
import { generateText } from "ai";
import { gemini } from "@/app/lib/ai";

/**
 * Query Rewriter for RAG System
 *
 * Problem: When users ask ambiguous questions like "Kamu inget nama aku?",
 * embedding that question directly leads to finding similar QUESTIONS, not ANSWERS.
 *
 * Solution: Rewrite the question into a self-contained search query that will
 * match the STATEMENTS/FACTS the user previously shared.
 *
 * Example:
 *   Input: "Kamu inget nama aku?"
 *   Context: [user: "Nama saya Arundaya"]
 *   Output: "Nama user Arundaya identitas perkenalan"
 *
 * This rewritten query will match memories where the user STATED their name,
 * not where they ASKED about it.
 */

export type ConversationTurn = {
  role: "user" | "assistant";
  text: string;
};

/**
 * Rewrite user query into a self-contained, context-aware search query
 * for better RAG retrieval accuracy
 *
 * @param userQuery - The raw user question/query
 * @param conversationHistory - Recent conversation turns for context
 * @returns Rewritten query optimized for semantic search
 */
export async function rewriteQueryForSearch(
  userQuery: string,
  conversationHistory: ConversationTurn[],
): Promise<string> {
  // Build context from recent conversation (last 5 turns max)
  const historyContext = conversationHistory
    .slice(-5)
    .map((m) => `${m.role}: ${m.text}`)
    .join("\n");

  const prompt = `Kamu adalah query rewriter untuk sistem RAG (Retrieval-Augmented Generation).

TUGAS: Transform pertanyaan user menjadi search query yang self-contained untuk menemukan percakapan relevan di masa lalu.

ATURAN KRITIS:
1. Jika query ambiguous (pakai "dia", "itu", "kemarin", dll), expand dengan konteks dari history
2. Fokus pada APA yang user tanyakan, bukan BAGAIMANA mereka bertanya
3. Generate query yang akan match PERNYATAAN/FAKTA user sebelumnya, BUKAN pertanyaan yang mereka tanyakan
4. Tetap pakai Bahasa Indonesia jika query original Bahasa Indonesia
5. JANGAN tambah informasi yang tidak ada di conversation history
6. Jika tidak perlu konteks tambahan, return query original
7. Fokus pada KEYWORDS dan TOPIK utama, bukan kalimat lengkap

STRATEGI:
- Ubah pertanyaan → pernyataan
- Extract keywords/topik utama
- Hapus kata tanya (apa, bagaimana, kenapa, dll)
- Tambah konteks jika ada pronoun ambiguous

CONTOH:

Query: "Kamu inget nama aku?"
History: [user: "Nama saya Arundaya"]
Rewritten: "nama Arundaya identitas perkenalan"

Query: "Gimana update tentang kemarin?"
History: [user: "Aku stress mau kuis jarkom besok"]
Rewritten: "stress kuis jarkom kuliah jaringan komputer"

Query: "Dia kemana?"
History: [user: "Budi pergi ke Jakarta kemarin"]
Rewritten: "Budi pergi Jakarta lokasi kemarin"

Query: "Aku suka makan apa?"
History: [user: "Makanan kesukaan aku rendang"]
Rewritten: "makanan kesukaan rendang preferensi kuliner"

Query: "Ceritain dong tentang hobi ku"
History: [user: "Hobi aku coding sama main game"]
Rewritten: "hobi coding main game aktivitas kesukaan"

Sekarang rewrite query ini:

Conversation History:
${historyContext || "No previous conversation"}

User Query: ${userQuery}

Rewritten Query (satu baris, keywords saja, tanpa penjelasan):`;

  try {
    const { text } = await generateText({
      model: gemini("gemini-2.0-flash"),
      prompt,
      temperature: 0.3, // Low temperature for consistency
    });

    const rewritten = text.trim();

    // Fallback: if rewriting fails or returns empty, use original
    if (!rewritten || rewritten.length === 0) {
      console.warn("Query rewriting returned empty, using original");
      return userQuery;
    }

    console.log("=== QUERY REWRITING ===");
    console.log("Original:", userQuery);
    console.log("Rewritten:", rewritten);
    console.log("History turns used:", conversationHistory.length);

    return rewritten;
  } catch (error) {
    console.error("❌ Query rewriting failed, using original:", error);
    // Graceful fallback to original query
    return userQuery;
  }
}

/**
 * Helper function to extract recent conversation for rewriting context
 * Returns last N messages in chronological order
 */
export function prepareHistoryForRewriting(
  messages: Array<{ role: "user" | "assistant"; text: string }>,
  limit = 5,
): ConversationTurn[] {
  return messages.slice(-limit).map((m) => ({
    role: m.role,
    text: m.text,
  }));
}
