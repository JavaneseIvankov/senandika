/**
 * Gamification Events System
 *
 * Custom browser events for real-time gamification updates across components.
 * This allows decoupled components to react to gamification changes without polling.
 */

// Event type constants
export const GAMIFICATION_EVENTS = {
  STATS_UPDATED: "gamification:stats-updated",
  LEVEL_UP: "gamification:level-up",
  BADGE_EARNED: "gamification:badge-earned",
  STREAK_UPDATED: "gamification:streak-updated",
  XP_GAINED: "gamification:xp-gained",
} as const;

// Event detail types
export interface GamificationEventDetail {
  type?: keyof typeof GAMIFICATION_EVENTS;
  timestamp?: string;
  data?: {
    level?: number;
    xpGained?: number;
    totalXP?: number;
    badge?: string;
    streakDays?: number;
    [key: string]: unknown;
  };
}

/**
 * Emit a gamification stats update event
 * This triggers all listening components to refetch their data
 *
 * @param detail - Optional event detail data
 */
export function emitGamificationUpdate(detail?: GamificationEventDetail): void {
  if (typeof window === "undefined") return; // Guard for SSR

  const event = new CustomEvent(GAMIFICATION_EVENTS.STATS_UPDATED, {
    detail: {
      ...detail,
      timestamp: detail?.timestamp ?? new Date().toISOString(),
    },
  });

  window.dispatchEvent(event);
}

/**
 * Emit a level up event
 * @param level - New level achieved
 * @param totalXP - Total XP after level up
 */
export function emitLevelUp(level: number, totalXP: number): void {
  if (typeof window === "undefined") return;

  const event = new CustomEvent(GAMIFICATION_EVENTS.LEVEL_UP, {
    detail: {
      type: "LEVEL_UP",
      timestamp: new Date().toISOString(),
      data: { level, totalXP },
    },
  });

  window.dispatchEvent(event);

  // Also emit general stats update
  emitGamificationUpdate({ type: "LEVEL_UP", data: { level, totalXP } });
}

/**
 * Emit a badge earned event
 * @param badge - Badge code/name earned
 */
export function emitBadgeEarned(badge: string): void {
  if (typeof window === "undefined") return;

  const event = new CustomEvent(GAMIFICATION_EVENTS.BADGE_EARNED, {
    detail: {
      type: "BADGE_EARNED",
      timestamp: new Date().toISOString(),
      data: { badge },
    },
  });

  window.dispatchEvent(event);

  // Also emit general stats update
  emitGamificationUpdate({ type: "BADGE_EARNED", data: { badge } });
}

/**
 * Emit XP gained event
 * @param xpGained - Amount of XP gained
 * @param totalXP - Total XP after gain
 */
export function emitXPGained(xpGained: number, totalXP: number): void {
  if (typeof window === "undefined") return;

  const event = new CustomEvent(GAMIFICATION_EVENTS.XP_GAINED, {
    detail: {
      type: "XP_GAINED",
      timestamp: new Date().toISOString(),
      data: { xpGained, totalXP },
    },
  });

  window.dispatchEvent(event);

  // Also emit general stats update
  emitGamificationUpdate({ type: "XP_GAINED", data: { xpGained, totalXP } });
}

/**
 * Emit streak updated event
 * @param streakDays - Current streak in days
 */
export function emitStreakUpdated(streakDays: number): void {
  if (typeof window === "undefined") return;

  const event = new CustomEvent(GAMIFICATION_EVENTS.STREAK_UPDATED, {
    detail: {
      type: "STREAK_UPDATED",
      timestamp: new Date().toISOString(),
      data: { streakDays },
    },
  });

  window.dispatchEvent(event);

  // Also emit general stats update
  emitGamificationUpdate({ type: "STREAK_UPDATED", data: { streakDays } });
}

/**
 * Hook helper to listen to gamification events
 * Usage: const cleanup = addGamificationListener(() => { refetchData(); });
 *
 * @param callback - Function to call when event occurs
 * @returns Cleanup function to remove listener
 */
export function addGamificationListener(
  callback: (event: CustomEvent<GamificationEventDetail>) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    callback(event as CustomEvent<GamificationEventDetail>);
  };

  window.addEventListener(GAMIFICATION_EVENTS.STATS_UPDATED, handler);

  return () => {
    window.removeEventListener(GAMIFICATION_EVENTS.STATS_UPDATED, handler);
  };
}
