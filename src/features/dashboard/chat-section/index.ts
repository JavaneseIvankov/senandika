
// Main component
export * as ChatCard from "./components/chat-card";

// Hook
export { useJournalChat } from "./use-journal-chat";
export type { UseJournalChatReturn } from "./use-journal-chat";

// Types
export type {
  Message,
  SessionInfo,
  ChatCardProps,
  ChatHeaderProps,
  ChatBubbleProps,
  ChatLoadingProps,
  ChatEmptyStateProps,
  ChatErrorDisplayProps,
  ChatMessagesProps,
  ChatInputProps,
} from "./types";

// Individual components (for custom layouts)
export { ChatHeader } from "./components/chat-header";
export { ChatMessages } from "./components/chat-messages";
export { ChatBubble } from "./components/chat-bubble";
export { ChatInput } from "./components/chat-input";
export { ChatLoading } from "./components/chat-loading";
export { ChatEmptyState } from "./components/chat-empty-state";
export { ChatErrorDisplay } from "./components/chat-error-display";
