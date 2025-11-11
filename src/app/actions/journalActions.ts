"use server";

import { getCurrentUser } from "@/lib/auth";
import {
   createMemoryEntry,
   createSession,
   endSession,
   getRecentMemories,
   getSessionWithMessages,
   getUserSessions,
   validateSessionOwner,
   getLatestRollingSummary,
   saveRollingSummary,
   getSessionMessagesForSummary,
} from "@/lib/services/journalService";
import {
   CORE_SYSTEM_PROMPT,
   CRISIS_RESPONSE_ADDITION,
   buildCurhatPayload,
   splitCoachOutput,
} from "@/lib/services/promptService";
import { generateRollingSummary } from "@/lib/services/rollingSummaryService";
import { streamText } from "ai";
import { gemini } from "../lib/ai";

/**
 * [WHAT] Send a message in a journal session dengan STREAMING
 * Returns UIMessageStream dengan TEXT streaming + JSON metadata as data parts
 */
export async function sendJournalMessageStreaming(
  sessionId: string,
  userText: string,
) {
  // 1. [WHAT] Authentication
  const user = await getCurrentUser();

  // 2. [WHAT] Authorization - validate session ownership
  const isValidOwner = await validateSessionOwner(sessionId, user.id);
  if (!isValidOwner) {
    throw new Error("Forbidden: Session does not belong to user");
  }

  // 3. [WHAT] Save user message
  await createMemoryEntry({
    userId: user.id,
    sessionId: sessionId,
    role: "user",
    text: userText,
  });

  // 4. [WHAT] Get RAG context - ROLLING SUMMARY STRATEGY
  // Strategy: Load previous summary + recent conversation (no search needed!)
  
  console.log("=== STARTING RAG WITH ROLLING SUMMARY ===");
  
  // 4a. Get recent conversation history (last 10 messages for current context)
  const recentMessages = await getRecentMemories(user.id, 10);
  
  // 4b. ⭐ ROLLING SUMMARY: Load previous summary for historical context
  const previousSummary = await getLatestRollingSummary(user.id);
  
  // 4c. Build memory_context with both recent + summary
  let dailySummaryText: string | null = null;
  let salientFacts: string[] = [];
  let safetyNote: string | null = null;
  
  if (previousSummary) {
    // Format summary as structured context
    dailySummaryText = previousSummary.dailySummary;
    salientFacts = previousSummary.keyPoints;
    
    if (previousSummary.safetyFlag) {
      safetyNote = "⚠️ Terdapat indikasi yang memerlukan perhatian khusus pada percakapan sebelumnya.";
    }
    
    console.log("=== LOADED PREVIOUS SUMMARY ===");
    console.log("Daily summary:", dailySummaryText.substring(0, 100) + "...");
    console.log("Key facts:", salientFacts.length);
    console.log("Safety flag:", previousSummary.safetyFlag);
  } else {
    console.log("=== NO PREVIOUS SUMMARY ===");
    console.log("This might be the first conversation or summary hasn't been generated yet.");
  }

  // 5. [WHAT] Build memory_context untuk injection
  const memoryContext = {
    recent_turns: recentMessages.map((m) => ({
      role: m.role,
      text: m.text,
    })),
    daily_summary: dailySummaryText,
    salient_facts: salientFacts,
    safety_note: safetyNote,
  };

  // DEBUG: Log comprehensive retrieval info
  console.log("\n=== RETRIEVAL RESULTS ===");
  console.log("User ID:", user.id);
  console.log("Recent messages loaded:", recentMessages.length);
  console.log("Has previous summary:", !!previousSummary);
  console.log("Salient facts count:", salientFacts.length);
  
  console.log("\n=== MEMORY CONTEXT ===");
  console.log("Memory context:", JSON.stringify(memoryContext, null, 2));

  // 6. [WHAT] Build payload PERSIS seperti model.py
  const payload = buildCurhatPayload(userText, {
    profile: {
      age_group: "mahasiswa",
      language: "id",
      context: "akademik",
    },
    moodEmoji: "normal",
    memoryContext,
    opening: false,
  });

  // DEBUG: Log full payload
  console.log("=== PAYLOAD DEBUG ===");
  console.log(payload);

  // 7. [WHAT] Generate response (non-streaming for simplicity)
  const result = streamText({
    model: gemini("gemini-2.0-flash"),
    system: CORE_SYSTEM_PROMPT,
    prompt: payload,
  });

  // Wait for complete response
  const fullText = await result.text;

  // Parse to separate coach reply from JSON metadata
  const { coachReply, metadata } = splitCoachOutput(fullText);

  // Add crisis resources if needed
  let finalReply = coachReply;
  if (metadata) {
    if (
      metadata.analysis.risk_flag === "high" ||
      metadata.analysis.risk_flag === "critical"
    ) {
      finalReply += CRISIS_RESPONSE_ADDITION;
    }
  }

  // Save to DB
  await createMemoryEntry({
    userId: user.id,
    sessionId: sessionId,
    role: "assistant",
    text: finalReply,
  });

  // Return as JSON (non-streaming)
  return Response.json({
    message: {
      id: crypto.randomUUID(),
      role: "assistant",
      content: finalReply,
    },
    metadata: metadata || null,
  });
}

/**
 * [WHAT] Start a new journal session
 */
export async function startJournalSession(moodAtStart: string | null = null) {
  const user = await getCurrentUser();

  const session = await createSession(user.id, moodAtStart);
  return session;
}

/**
 * [WHAT] End a journal session and generate rolling summary
 */
export async function endJournalSession(
  sessionId: string,
  moodAtEnd: string | null = null,
) {
  const user = await getCurrentUser();

  // Validate ownership
  const isValidOwner = await validateSessionOwner(sessionId, user.id);
  if (!isValidOwner) {
    throw new Error("Forbidden: Session does not belong to user");
  }

  // End the session
  await endSession(sessionId, moodAtEnd);

  // ⭐ GENERATE ROLLING SUMMARY after session ends
  console.log("=== GENERATING ROLLING SUMMARY FOR SESSION ===");
  console.log("Session ID:", sessionId);
  
  try {
    // Get all messages from this session
    const sessionMessages = await getSessionMessagesForSummary(sessionId);
    
    if (sessionMessages.length > 0) {
      // Get previous summary for carry-over notes
      const previousSummary = await getLatestRollingSummary(user.id);
      const carryOverNotes = previousSummary?.dailySummary;
      
      // Generate new rolling summary
      const newSummary = await generateRollingSummary(
        sessionMessages,
        undefined, // TODO: Add analytics if available
        carryOverNotes,
      );
      
      // Save the summary
      await saveRollingSummary(user.id, sessionId, newSummary);
      
      console.log("=== ROLLING SUMMARY SAVED ===");
      console.log("Summary length:", newSummary.dailySummary.length);
      console.log("Key points:", newSummary.keyPoints.length);
      console.log("Safety flag:", newSummary.safetyFlag);
    } else {
      console.log("=== NO MESSAGES TO SUMMARIZE ===");
    }
  } catch (error) {
    console.error("Error generating rolling summary:", error);
    // Don't fail the session end if summary generation fails
  }

  return { success: true };
}

/**
 * [WHAT] Get all journal sessions for the current user
 */
export async function getJournalSessions() {
  const user = await getCurrentUser();
  return await getUserSessions(user.id);
}

/**
 * [WHAT] Get a specific journal session with all its messages
 */
export async function getJournalSessionDetails(sessionId: string) {
  const user = await getCurrentUser();

  // Validate ownership
  const isValidOwner = await validateSessionOwner(sessionId, user.id);
  if (!isValidOwner) {
    throw new Error("Forbidden: Session does not belong to user");
  }

  const data = await getSessionWithMessages(sessionId);
  if (!data) {
    throw new Error("Session not found");
  }

  return data;
}
