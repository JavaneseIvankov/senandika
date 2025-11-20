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
  moodAtStart?: string | null;
  moodAtEnd?: string | null;
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

// Session End Related Types
export interface SessionStats {
  startedAt: string;
  endedAt: string;
  duration: string; // formatted like "23 menit"
  messageCount: number;
  moodAtStart: string | null;
  moodAtEnd: string | null;
  averageStressScore?: number; // if available
}

export interface GamificationReward {
  xpGained: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
  streakDays: number;
  badgesEarned: string[];
}

// Session End Component Props
export interface SessionEndOverlayProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface SessionSummaryCardProps {
  stats: SessionStats;
  gamificationReward: GamificationReward | null;
  onStartNewSession: () => void;
  onViewHistory?: () => void;
  onClose?: () => void;
  className?: string;
}

export interface SessionEndHeaderProps {
  className?: string;
}

export interface SessionStatsGridProps {
  stats: SessionStats;
  className?: string;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export interface GamificationRewardsSectionProps {
  reward: GamificationReward;
  className?: string;
}

export interface XPProgressBarProps {
  level: number;
  xpGained: number;
  totalXP: number;
  className?: string;
}

export interface LevelUpBadgeProps {
  level: number;
  className?: string;
}

export interface BadgesListProps {
  badges: string[];
  className?: string;
}

export interface BadgeItemProps {
  name: string;
  className?: string;
}

export interface StreakDisplayProps {
  streakDays: number;
  className?: string;
}

export interface SessionEndActionsProps {
  onStartNewSession: () => void;
  onViewHistory?: () => void;
  onClose?: () => void;
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
  onScroll?: () => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
  placeholder?: string;
  className?: string;
  showSummaryButton?: boolean;
  onToggleSummary?: () => void;
}
