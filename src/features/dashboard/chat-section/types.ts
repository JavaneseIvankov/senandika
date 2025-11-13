import type { CoachResponse } from "@/lib/services/promptService";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string
  metadata?: CoachResponse | null;
};

export type SessionInfo = {
  id: string;
  startedAt: string; // ISO string
  endedAt: string | null;
};

// Component Props
export interface ChatCardProps {
  className?: string;
  maxHeight?: string;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onMessageSent?: (message: string) => void;
}

export interface ChatHeaderProps {
  session: SessionInfo | null;
  messageCount: number;
}

export interface ChatBubbleProps {
  message: Message;
  className?: string;
  onEndSession?: () => void;
}

export interface ChatLoadingProps {
  className?: string;
}

export interface ChatEmptyStateProps {
  hasSession: boolean;
  className?: string;
}

export interface ChatErrorDisplayProps {
  error: string;
  onDismiss: () => void;
  className?: string;
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  hasSession: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  maxHeight?: string;
  className?: string;
  onEndSession?: () => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
  placeholder?: string;
  className?: string;
}
