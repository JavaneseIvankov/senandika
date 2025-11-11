// Removed unused import

/**
 * Custom message type for APAAC chat
 * Extends UIMessage dengan data parts untuk structured metadata
 */
/**
 * Custom message type for APAAC chat (simplified, non-streaming)
 */
export interface ApaacMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  metadata?: {
    analysis?: {
      emotions: string[];
      stress_score: number;
      topics: string[];
      risk_flag: "none" | "low" | "moderate" | "high" | "critical";
    };
    suggested_actions?: Array<Record<string, unknown>>;
    gamification?: {
      streak_increment: boolean;
      potential_badge?: string;
    };
    conversation_control?: {
      need_clarification: boolean;
      clarify_question: string;
      offer_suggestions: boolean;
      phase: "listen" | "suggest";
    };
  };
}
