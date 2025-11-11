import { sendJournalMessageStreaming } from "@/app/actions/journalActions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const { message } = await request.json();

  return await sendJournalMessageStreaming(sessionId, message);
}
