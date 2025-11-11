import "server-only";
import { embed } from "ai";
import { gemini } from "@/app/lib/ai";

/**
 * Generate embedding vector for a text using Google's text-embedding-004 model
 * Returns a 768-dimensional vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: gemini.textEmbedding("text-embedding-004"),
    value: text,
  });

  // DEBUG: Log embedding dimension
  console.log("Embedding dimension:", embedding.length);

  return embedding;
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(texts.map((text) => getEmbedding(text)));
  return embeddings;
}
