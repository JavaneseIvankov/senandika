import { sendJournalMessageStreaming } from "@/app/actions/journalActions";

/**
 * [WHAT] POST /api/chat - Non-streaming JSON chat
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { sessionId, message } = body;

  if (!sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return Response.json(
      { error: "Missing or invalid message" },
      { status: 400 },
    );
  }

  return sendJournalMessageStreaming(sessionId, message.trim());
}
