import "server-only";
import { db } from "@/lib/db/db";
import {
  memory,
  reflectionSession,
  rollingSummary,
} from "@/lib/db/schema/schema";
import { eq, desc, sql, and, isNull, asc } from "drizzle-orm";
import { getEmbedding } from "./embeddingService";
import type { RollingSummary } from "./rollingSummaryService";

/**
 * Type definitions for abstraction (separating "what" from "how")
 */
export type MemoryMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: Date;
};

export type CreateMemoryDto = {
  userId: string;
  sessionId: string;
  role: "user" | "assistant";
  text: string;
};

export type ReflectionSessionData = {
  id: string;
  userId: string;
  topic: string | null;
  startedAt: Date;
  endedAt: Date | null;
  moodAtStart: string | null;
  moodAtEnd: string | null;
};

/**
 * [HOW] Create a memory entry in the database
 * Stores the message and generates its embedding asynchronously
 */
export async function createMemoryEntry(
  data: CreateMemoryDto,
): Promise<MemoryMessage> {
  // Insert memory without embedding first for fast response
  const [newMemory] = await db
    .insert(memory)
    .values({
      userId: data.userId,
      sessionId: data.sessionId,
      role: data.role,
      text: data.text,
    })
    .returning();

  // Generate and update embedding asynchronously (don't wait)
  generateAndStoreEmbedding(newMemory.id, data.text).catch((error) => {
    console.error("Failed to generate embedding:", error);
  });

  return {
    id: newMemory.id,
    role: newMemory.role as "user" | "assistant",
    text: newMemory.text,
    createdAt: newMemory.createdAt,
  };
}

/**
 * [HOW] Generate and store embedding for a memory entry
 * This runs asynchronously to avoid blocking the main flow
 */
async function generateAndStoreEmbedding(
  memoryId: string,
  text: string,
): Promise<void> {
  const embedding = await getEmbedding(text);

  await db
    .update(memory)
    .set({ embedding: embedding })
    .where(eq(memory.id, memoryId));
}

/**
 * Get recent conversation history (temporal retrieval)
 * @param userId - The user ID
 * @param limit - Maximum number of results to return
 * @returns Array of recent messages ordered by time (newest first)
 */
export async function getRecentMemories(
  userId: string,
  limit = 10,
): Promise<MemoryMessage[]> {
  const results = await db
    .select({
      id: memory.id,
      role: memory.role,
      text: memory.text,
      createdAt: memory.createdAt,
    })
    .from(memory)
    .where(eq(memory.userId, userId))
    .orderBy(desc(memory.createdAt))
    .limit(limit);

  return results.map((r) => ({
    id: r.id,
    role: r.role as "user" | "assistant",
    text: r.text,
    createdAt: r.createdAt,
  }));
}

/**
 * Find relevant memories using vector similarity search
 * @param userId - The user ID
 * @param queryVector - The embedding vector of the query
 * @param limit - Maximum number of results to return
 * @returns Array of similar messages
 */
export async function findRelevantMemories(
  userId: string,
  queryVector: number[],
  limit = 5,
): Promise<MemoryMessage[]> {
  console.log("=== RAG RETRIEVAL DEBUG ===");
  console.log("User ID:", userId);
  console.log("Query vector length:", queryVector.length);
  console.log("Limit:", limit);

  const results = await db
    .select({
      id: memory.id,
      role: memory.role,
      text: memory.text,
      createdAt: memory.createdAt,
      distance: sql<number>`${memory.embedding} <=> ${JSON.stringify(queryVector)}::vector`,
    })
    .from(memory)
    .where(eq(memory.userId, userId))
    .orderBy(
      sql`${memory.embedding} <=> ${JSON.stringify(queryVector)}::vector`,
    )
    .limit(limit);

  console.log("Found results:", results.length);
  results.forEach((r, i) => {
    console.log(`\nResult ${i + 1}:`);
    console.log("  Role:", r.role);
    console.log("  Distance:", r.distance);
    console.log("  Created:", r.createdAt);
    console.log("  Text:", r.text.substring(0, 100) + "...");
  });

  return results.map((r) => ({
    id: r.id,
    role: r.role as "user" | "assistant",
    text: r.text,
    createdAt: r.createdAt,
  }));
}

/**
 * [HOW] Validate that a session belongs to a user
 * Used for authorization checks
 */
export async function validateSessionOwner(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  const result = await db
    .select({ userId: reflectionSession.userId })
    .from(reflectionSession)
    .where(eq(reflectionSession.id, sessionId))
    .limit(1);

  return result.length > 0 && result[0].userId === userId;
}

/**
 * [HOW] Get all messages from a specific session
 */
export async function getMessagesBySession(
  sessionId: string,
): Promise<MemoryMessage[]> {
  const messages = await db
    .select({
      id: memory.id,
      role: memory.role,
      text: memory.text,
      createdAt: memory.createdAt,
    })
    .from(memory)
    .where(eq(memory.sessionId, sessionId))
    .orderBy(memory.createdAt);

  return messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    text: m.text,
    createdAt: m.createdAt,
  }));
}

/**
 * [HOW] Create a new reflection session
 */
export async function createSession(
  userId: string,
  moodAtStart: string | null = null,
): Promise<ReflectionSessionData> {
  const [session] = await db
    .insert(reflectionSession)
    .values({
      userId,
      moodAtStart,
    })
    .returning();

  return {
    id: session.id,
    userId: session.userId,
    topic: session.topic,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    moodAtStart: session.moodAtStart,
    moodAtEnd: session.moodAtEnd,
  };
}

/**
 * [HOW] End a reflection session
 */
export async function endSession(
  sessionId: string,
  moodAtEnd: string | null = null,
): Promise<void> {
  await db
    .update(reflectionSession)
    .set({
      endedAt: new Date(),
      moodAtEnd,
    })
    .where(eq(reflectionSession.id, sessionId));
}

/**
 * [HOW] Get active (unended) session for user
 * Returns the most recent session where endedAt is null
 */
export async function getActiveSession(
  userId: string,
): Promise<ReflectionSessionData | null> {
  const [session] = await db
    .select()
    .from(reflectionSession)
    .where(
      and(
        eq(reflectionSession.userId, userId),
        isNull(reflectionSession.endedAt),
      ),
    )
    .orderBy(desc(reflectionSession.startedAt))
    .limit(1);

  if (!session) return null;

  return {
    id: session.id,
    userId: session.userId,
    topic: session.topic,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    moodAtStart: session.moodAtStart,
    moodAtEnd: session.moodAtEnd,
  };
}

/**
 * [HOW] Get all sessions for a user
 */
export async function getUserSessions(
  userId: string,
): Promise<ReflectionSessionData[]> {
  const sessions = await db
    .select()
    .from(reflectionSession)
    .where(eq(reflectionSession.userId, userId))
    .orderBy(desc(reflectionSession.startedAt));

  return sessions.map((s) => ({
    id: s.id,
    userId: s.userId,
    topic: s.topic,
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    moodAtStart: s.moodAtStart,
    moodAtEnd: s.moodAtEnd,
  }));
}

/**
 * [HOW] Get a specific session with its messages
 */
export async function getSessionWithMessages(sessionId: string): Promise<{
  session: ReflectionSessionData;
  messages: MemoryMessage[];
} | null> {
  const [session] = await db
    .select()
    .from(reflectionSession)
    .where(eq(reflectionSession.id, sessionId))
    .limit(1);

  if (!session) {
    return null;
  }

  const messages = await getMessagesBySession(sessionId);

  return {
    session: {
      id: session.id,
      userId: session.userId,
      topic: session.topic,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      moodAtStart: session.moodAtStart,
      moodAtEnd: session.moodAtEnd,
    },
    messages,
  };
}

/**
 * Get session messages as ConversationMessage format (for rolling summary)
 */
export async function getSessionMessagesForSummary(
  sessionId: string,
): Promise<
  Array<{ role: "user" | "assistant"; text: string; timestamp: Date }>
> {
  const messages = await getMessagesBySession(sessionId);

  return messages.map((m) => ({
    role: m.role,
    text: m.text,
    timestamp: m.createdAt,
  }));
}

/**
 * Save or update rolling summary for a session
 */
export async function saveRollingSummary(
  userId: string,
  sessionId: string,
  summary: RollingSummary,
): Promise<void> {
  // Check if summary exists for this session
  const existing = await db
    .select()
    .from(rollingSummary)
    .where(eq(rollingSummary.sessionId, sessionId))
    .limit(1);

  if (existing.length > 0) {
    // Update existing summary
    await db
      .update(rollingSummary)
      .set({
        dailySummary: summary.dailySummary,
        keyPoints: summary.keyPoints,
        followUpTomorrow: summary.followUpTomorrow,
        safetyFlag: summary.safetyFlag,
        updatedAt: new Date(),
      })
      .where(eq(rollingSummary.sessionId, sessionId));
  } else {
    // Insert new summary
    await db.insert(rollingSummary).values({
      userId,
      sessionId,
      dailySummary: summary.dailySummary,
      keyPoints: summary.keyPoints,
      followUpTomorrow: summary.followUpTomorrow,
      safetyFlag: summary.safetyFlag,
    });
  }
}

/**
 * Get the most recent rolling summary for a user
 * This provides context from previous conversations
 */
export async function getLatestRollingSummary(
  userId: string,
): Promise<RollingSummary | null> {
  const results = await db
    .select()
    .from(rollingSummary)
    .where(eq(rollingSummary.userId, userId))
    .orderBy(desc(rollingSummary.updatedAt))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  const summary = results[0];
  return {
    dailySummary: summary.dailySummary,
    keyPoints: summary.keyPoints as string[],
    followUpTomorrow: summary.followUpTomorrow as string[],
    safetyFlag: summary.safetyFlag,
  };
}

/**
 * Get rolling summary for a specific session
 */
export async function getSessionRollingSummary(
  sessionId: string,
): Promise<RollingSummary | null> {
  const results = await db
    .select()
    .from(rollingSummary)
    .where(eq(rollingSummary.sessionId, sessionId))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  const summary = results[0];
  return {
    dailySummary: summary.dailySummary,
    keyPoints: summary.keyPoints as string[],
    followUpTomorrow: summary.followUpTomorrow as string[],
    safetyFlag: summary.safetyFlag,
  };
}
