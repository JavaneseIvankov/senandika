import "server-only";
import { db } from "@/lib/db/db";
import {
  gamificationStat,
  badge,
  userBadge,
  reflectionSession,
  memory,
} from "@/lib/db/schema/schema";
import { eq, sql, and, desc } from "drizzle-orm";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AchievementContext {
  userId: string;

  // === Counts & Milestones ===
  counts: {
    totalSessions: number;
    completedSessions: number;
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
  };

  // === Streak & Activity ===
  activity: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date | null;
    totalActiveDays: number;
  };

  // === Time Patterns ===
  timePatterns: {
    nightSessions: number; // 22:00-02:00
    morningSessions: number; // 05:00-08:00
    weekendSessions: number; // Saturday/Sunday
    averageSessionDuration: number; // in minutes
  };

  // === Emotional Patterns ===
  emotionalPatterns: {
    uniqueEmotionsTracked: number;
    dominantEmotions: string[]; // Top 3 most frequent
    highStressSessionsCompleted: number; // stress_score >= 50
    calmSessionsStreak: number; // consecutive stress_score < 30
    totalTopicsExplored: number;
    dominantTopics: string[]; // Top 3 most frequent
  };

  // === Growth Metrics ===
  growth: {
    averageStressScore: number;
    stressTrend: "improving" | "stable" | "worsening"; // Last 7 days vs previous 7
    completedActions: number; // User completed suggested actions
    reflectionDepth: number; // Avg messages per session
  };

  // === Current Stats ===
  stats: {
    xp: number;
    level: number;
    earnedBadges: string[]; // Badge codes user already has
  };

  // === Trigger Context ===
  trigger: {
    type: "message_sent" | "session_ended" | "daily_check";
    sessionId?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface GamificationReward {
  xpGained: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
  streakDays: number;
  streakBroken?: boolean;
  badgesEarned: string[];
}

export interface UserStats {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: Date | null;
}

export interface BadgeInfo {
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  earnedAt?: Date;
}

// ============================================================================
// XP REWARDS & MULTIPLIERS
// ============================================================================

export const XP_REWARDS = {
  // Message-based
  SEND_MESSAGE: 5, // Per message sent
  FIRST_MESSAGE_OF_DAY: 20, // First message each day

  // Session-based
  COMPLETE_SESSION: 50, // End session properly
  LONG_SESSION: 30, // Session > 10 messages
  DEEP_REFLECTION: 40, // High stress score addressed

  // Streak-based
  STREAK_3_DAYS: 50,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
} as const;

export const XP_MULTIPLIERS = {
  STREAK_BONUS: (streakDays: number): number => {
    if (streakDays >= 30) return 2.0;
    if (streakDays >= 14) return 1.5;
    if (streakDays >= 7) return 1.25;
    return 1.0;
  },

  WEEKEND_BONUS: 1.2, // Weekend activities
  NIGHT_OWL: 1.1, // Late night reflections (22:00-02:00)
  EARLY_BIRD: 1.1, // Early morning (05:00-08:00)
} as const;

// ============================================================================
// BADGE CHECKER REGISTRY
// ============================================================================

type BadgeChecker = (context: AchievementContext) => boolean;

export const BADGE_CHECKERS: Record<string, BadgeChecker> = {
  // === Milestone Badges ===
  first_step: (ctx) => ctx.counts.totalSessions >= 1,
  getting_started: (ctx) => ctx.counts.totalSessions >= 5,
  journaling_habit: (ctx) => ctx.counts.totalSessions >= 10,
  reflection_pro: (ctx) => ctx.counts.totalSessions >= 50,
  master_reflector: (ctx) => ctx.counts.totalSessions >= 100,

  chatty: (ctx) => ctx.counts.userMessages >= 50,
  conversationalist: (ctx) => ctx.counts.userMessages >= 200,
  storyteller: (ctx) => ctx.counts.userMessages >= 500,

  // === Streak Badges ===
  consistent_starter: (ctx) => ctx.activity.currentStreak >= 3,
  week_warrior: (ctx) => ctx.activity.currentStreak >= 7,
  fortnight_fighter: (ctx) => ctx.activity.currentStreak >= 14,
  monthly_master: (ctx) => ctx.activity.currentStreak >= 30,
  centurion: (ctx) => ctx.activity.currentStreak >= 100,
  year_champion: (ctx) => ctx.activity.currentStreak >= 365,

  // === Time Pattern Badges ===
  night_owl: (ctx) => ctx.timePatterns.nightSessions >= 10,
  early_bird: (ctx) => ctx.timePatterns.morningSessions >= 10,
  weekend_warrior: (ctx) => ctx.timePatterns.weekendSessions >= 5,

  // === Emotional Growth Badges ===
  stress_manager: (ctx) =>
    ctx.emotionalPatterns.highStressSessionsCompleted >= 10,
  emotion_explorer: (ctx) => ctx.emotionalPatterns.uniqueEmotionsTracked >= 15,

  // === Special Badges ===
  breakthrough_moment: (ctx) =>
    ctx.growth.stressTrend === "improving" && ctx.counts.completedSessions >= 5,
};

// ============================================================================
// LEVEL CALCULATION
// ============================================================================

/**
 * Calculate level from total XP
 * Uses exponential curve: level = sqrt(xp / 100) + 1
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * currentLevel * 100;
}

/**
 * Get XP required for current level (for progress bar)
 */
export function getXPForCurrentLevel(currentLevel: number): number {
  if (currentLevel <= 1) return 0;
  return (currentLevel - 1) * (currentLevel - 1) * 100;
}

// ============================================================================
// STREAK MANAGEMENT
// ============================================================================

/**
 * Check if streak is still valid
 */
export function isStreakValid(
  lastActiveDate: Date | null,
  currentDate: Date,
): boolean {
  if (!lastActiveDate) return false;

  // Get start of day in Asia/Jakarta timezone
  const lastDay = new Date(lastActiveDate);
  lastDay.setHours(0, 0, 0, 0);

  const currentDay = new Date(currentDate);
  currentDay.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (currentDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Same day = continue current streak
  if (diffDays === 0) return true;

  // Next day = valid streak continuation
  if (diffDays === 1) return true;

  // Gap > 1 day = streak broken
  return false;
}

/**
 * Update user streak
 */
export async function updateStreak(
  userId: string,
  currentDate: Date,
): Promise<{
  streakDays: number;
  streakBroken: boolean;
  milestoneXP: number;
  milestoneBadge?: string;
}> {
  // Get current stats
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  // Initialize stats if not exists
  if (!stats) {
    await db.insert(gamificationStat).values({
      userId,
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: currentDate,
    });

    return {
      streakDays: 1,
      streakBroken: false,
      milestoneXP: 0,
    };
  }

  // Check if same day (no change needed)
  const lastDay = stats.lastActiveDate
    ? new Date(stats.lastActiveDate).setHours(0, 0, 0, 0)
    : 0;
  const currentDay = new Date(currentDate).setHours(0, 0, 0, 0);

  if (lastDay === currentDay) {
    // Same day, no change
    return {
      streakDays: stats.streakDays,
      streakBroken: false,
      milestoneXP: 0,
    };
  }

  // Check if streak is valid
  const validStreak = isStreakValid(stats.lastActiveDate, currentDate);
  let newStreakDays: number;
  let streakBroken = false;

  if (validStreak) {
    // Continue streak
    newStreakDays = stats.streakDays + 1;
  } else {
    // Streak broken, reset to 1
    newStreakDays = 1;
    streakBroken = true;
  }

  // Check for streak milestones
  let milestoneXP = 0;
  let milestoneBadge: string | undefined;

  if (newStreakDays === 3) {
    milestoneXP = XP_REWARDS.STREAK_3_DAYS;
    milestoneBadge = "consistent_starter";
  } else if (newStreakDays === 7) {
    milestoneXP = XP_REWARDS.STREAK_7_DAYS;
    milestoneBadge = "week_warrior";
  } else if (newStreakDays === 30) {
    milestoneXP = XP_REWARDS.STREAK_30_DAYS;
    milestoneBadge = "monthly_master";
  }

  // Update stats
  await db
    .update(gamificationStat)
    .set({
      streakDays: newStreakDays,
      lastActiveDate: currentDate,
    })
    .where(eq(gamificationStat.userId, userId));

  return {
    streakDays: newStreakDays,
    streakBroken,
    milestoneXP,
    milestoneBadge,
  };
}

// ============================================================================
// XP MANAGEMENT
// ============================================================================

/**
 * Award XP to user and update level
 */
export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
): Promise<{
  xp: number;
  level: number;
  leveledUp: boolean;
}> {
  // Get current stats
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  // Initialize if not exists
  if (!stats) {
    await db.insert(gamificationStat).values({
      userId,
      xp: amount,
      level: calculateLevel(amount),
      streakDays: 0,
      lastActiveDate: new Date(),
    });

    return {
      xp: amount,
      level: calculateLevel(amount),
      leveledUp: false,
    };
  }

  const oldLevel = stats.level;
  const newXP = stats.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  // Update stats
  await db
    .update(gamificationStat)
    .set({
      xp: newXP,
      level: newLevel,
    })
    .where(eq(gamificationStat.userId, userId));

  console.log(
    `[GAMIFICATION] Awarded ${amount} XP to ${userId} for: ${reason}`,
  );
  if (leveledUp) {
    console.log(
      `[GAMIFICATION] Level up! ${userId}: ${oldLevel} → ${newLevel}`,
    );
  }

  return {
    xp: newXP,
    level: newLevel,
    leveledUp,
  };
}

// ============================================================================
// ACHIEVEMENT CONTEXT BUILDER
// ============================================================================

async function getSessionStats(userId: string) {
  const result = await db
    .select({
      total: sql<number>`count(*)::int`,
      completed: sql<number>`count(*) filter (where ${reflectionSession.endedAt} is not null)::int`,
    })
    .from(reflectionSession)
    .where(eq(reflectionSession.userId, userId))
    .then((rows) => rows[0]);

  return {
    total: result?.total ?? 0,
    completed: result?.completed ?? 0,
  };
}

async function getMessageStats(userId: string) {
  const result = await db
    .select({
      total: sql<number>`count(*)::int`,
      user: sql<number>`count(*) filter (where ${memory.role} = 'user')::int`,
      ai: sql<number>`count(*) filter (where ${memory.role} = 'assistant')::int`,
    })
    .from(memory)
    .where(eq(memory.userId, userId))
    .then((rows) => rows[0]);

  return {
    total: result?.total ?? 0,
    user: result?.user ?? 0,
    ai: result?.ai ?? 0,
  };
}

async function getActivityStats(userId: string) {
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  // Calculate total active days
  const activeDaysResult = await db
    .select({
      days: sql<number>`count(distinct date_trunc('day', ${memory.createdAt}))::int`,
    })
    .from(memory)
    .where(eq(memory.userId, userId))
    .then((rows) => rows[0]);

  return {
    currentStreak: stats?.streakDays ?? 0,
    longestStreak: stats?.streakDays ?? 0,
    lastActiveDate: stats?.lastActiveDate ?? null,
    totalActiveDays: activeDaysResult?.days ?? 0,
  };
}

async function getTimePatterns(userId: string) {
  const patterns = await db
    .select({
      nightSessions: sql<number>`
        count(*) filter (
          where extract(hour from ${reflectionSession.startedAt}) >= 22 
             or extract(hour from ${reflectionSession.startedAt}) <= 2
        )::int
      `,
      morningSessions: sql<number>`
        count(*) filter (
          where extract(hour from ${reflectionSession.startedAt}) >= 5 
            and extract(hour from ${reflectionSession.startedAt}) <= 8
        )::int
      `,
      weekendSessions: sql<number>`
        count(*) filter (
          where extract(dow from ${reflectionSession.startedAt}) in (0, 6)
        )::int
      `,
      avgDuration: sql<number>`
        coalesce(
          avg(extract(epoch from (${reflectionSession.endedAt} - ${reflectionSession.startedAt})) / 60)
          filter (where ${reflectionSession.endedAt} is not null),
          0
        )::int
      `,
    })
    .from(reflectionSession)
    .where(eq(reflectionSession.userId, userId))
    .then((rows) => rows[0]);

  return {
    nightSessions: patterns?.nightSessions ?? 0,
    morningSessions: patterns?.morningSessions ?? 0,
    weekendSessions: patterns?.weekendSessions ?? 0,
    averageSessionDuration: patterns?.avgDuration ?? 0,
  };
}

async function getEmotionalPatterns(userId: string) {
  // Extract emotions and topics from memory.meta JSON
  const result = await db.execute<{
    unique_emotions: string;
    high_stress_count: string;
    unique_topics: string;
  }>(sql`
    with emotion_data as (
      select 
        jsonb_array_elements_text(meta->'analysis'->'emotions') as emotion,
        (meta->'analysis'->>'stress_score')::int as stress_score,
        jsonb_array_elements_text(meta->'analysis'->'topics') as topic
      from ${memory}
      where ${memory.userId} = ${userId}
        and ${memory.role} = 'assistant'
        and meta is not null
    )
    select
      count(distinct emotion)::text as unique_emotions,
      count(*) filter (where stress_score >= 50)::text as high_stress_count,
      count(distinct topic)::text as unique_topics
    from emotion_data
  `);

  const data = result.rows[0];

  return {
    uniqueEmotionsTracked: data ? Number.parseInt(data.unique_emotions) : 0,
    dominantEmotions: [],
    highStressSessionsCompleted: data
      ? Number.parseInt(data.high_stress_count)
      : 0,
    calmSessionsStreak: 0,
    totalTopicsExplored: data ? Number.parseInt(data.unique_topics) : 0,
    dominantTopics: [],
  };
}

async function getGrowthMetrics(userId: string) {
  // Calculate stress trend
  const trendResult = await db.execute<{
    recent_avg: string;
    previous_avg: string;
  }>(sql`
    with recent_stress as (
      select 
        (meta->'analysis'->>'stress_score')::int as stress,
        ${memory.createdAt}
      from ${memory}
      where ${memory.userId} = ${userId}
        and ${memory.role} = 'assistant'
        and ${memory.createdAt} >= current_date - interval '14 days'
        and (meta->'analysis'->>'stress_score') is not null
    ),
    period_avg as (
      select
        case 
          when created_at >= current_date - interval '7 days' 
          then 'recent' 
          else 'previous' 
        end as period,
        avg(stress) as avg_stress
      from recent_stress
      group by period
    )
    select
      coalesce(max(case when period = 'recent' then avg_stress end), 50)::text as recent_avg,
      coalesce(max(case when period = 'previous' then avg_stress end), 50)::text as previous_avg
    from period_avg
  `);

  const trend = trendResult.rows[0];
  const recentAvg = trend ? Number.parseFloat(trend.recent_avg) : 50;
  const previousAvg = trend ? Number.parseFloat(trend.previous_avg) : 50;

  const stressTrend: "improving" | "stable" | "worsening" =
    recentAvg < previousAvg - 10
      ? "improving"
      : recentAvg > previousAvg + 10
        ? "worsening"
        : "stable";

  // Average messages per session
  const depthResult = await db.execute<{ avg_messages: string }>(sql`
    with session_messages as (
      select 
        ${memory.sessionId},
        count(*) as message_count
      from ${memory}
      where ${memory.userId} = ${userId}
      group by ${memory.sessionId}
    )
    select coalesce(avg(message_count), 0)::text as avg_messages
    from session_messages
  `);

  const reflectionDepth = depthResult.rows[0]
    ? Number.parseFloat(depthResult.rows[0].avg_messages)
    : 0;

  return {
    averageStressScore: (recentAvg + previousAvg) / 2,
    stressTrend,
    completedActions: 0,
    reflectionDepth: Math.round(reflectionDepth),
  };
}

async function getCurrentStats(userId: string) {
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  const badgesResult = await db
    .select({ code: badge.code })
    .from(userBadge)
    .innerJoin(badge, eq(userBadge.badgeId, badge.id))
    .where(eq(userBadge.userId, userId));

  return {
    xp: stats?.xp ?? 0,
    level: stats?.level ?? 1,
    earnedBadges: badgesResult.map((b) => b.code),
  };
}

/**
 * Build comprehensive achievement context
 */
export async function buildAchievementContext(
  userId: string,
  trigger: AchievementContext["trigger"],
): Promise<AchievementContext> {
  // Parallel queries for performance
  const [
    sessionStats,
    messageStats,
    activityStats,
    timePatterns,
    emotionalData,
    growthMetrics,
    currentStats,
  ] = await Promise.all([
    getSessionStats(userId),
    getMessageStats(userId),
    getActivityStats(userId),
    getTimePatterns(userId),
    getEmotionalPatterns(userId),
    getGrowthMetrics(userId),
    getCurrentStats(userId),
  ]);

  return {
    userId,
    counts: {
      totalSessions: sessionStats.total,
      completedSessions: sessionStats.completed,
      totalMessages: messageStats.total,
      userMessages: messageStats.user,
      aiMessages: messageStats.ai,
    },
    activity: activityStats,
    timePatterns,
    emotionalPatterns: emotionalData,
    growth: growthMetrics,
    stats: currentStats,
    trigger,
  };
}

// ============================================================================
// BADGE MANAGEMENT
// ============================================================================

/**
 * Check badge eligibility using pre-built context
 */
export async function checkBadgeEligibility(
  userId: string,
  trigger: AchievementContext["trigger"],
): Promise<string[]> {
  // Build comprehensive context
  const context = await buildAchievementContext(userId, trigger);

  // Check all badges using pure functions
  const eligibleBadges: string[] = [];

  for (const [badgeCode, checker] of Object.entries(BADGE_CHECKERS)) {
    // Skip if user already has this badge
    if (context.stats.earnedBadges.includes(badgeCode)) {
      continue;
    }

    // Run checker function
    if (checker(context)) {
      eligibleBadges.push(badgeCode);
    }
  }

  return eligibleBadges;
}

/**
 * Award badge to user
 */
export async function awardBadge(
  userId: string,
  badgeCode: string,
): Promise<boolean> {
  try {
    // Get badge ID
    const badgeData = await db
      .select()
      .from(badge)
      .where(eq(badge.code, badgeCode))
      .then((rows) => rows[0]);

    if (!badgeData) {
      console.error(`[GAMIFICATION] Badge not found: ${badgeCode}`);
      return false;
    }

    // Check if user already has this badge
    const existing = await db
      .select()
      .from(userBadge)
      .where(
        and(eq(userBadge.userId, userId), eq(userBadge.badgeId, badgeData.id)),
      )
      .then((rows) => rows[0]);

    if (existing) {
      return false; // Already has badge
    }

    // Award badge
    await db.insert(userBadge).values({
      userId,
      badgeId: badgeData.id,
      earnedAt: new Date(),
    });

    console.log(`[GAMIFICATION] Badge awarded: ${badgeCode} to ${userId}`);
    return true;
  } catch (error) {
    console.error(`[GAMIFICATION] Error awarding badge ${badgeCode}:`, error);
    return false;
  }
}

/**
 * Get user badges with details
 */
export async function getUserBadges(userId: string): Promise<BadgeInfo[]> {
  const badges = await db
    .select({
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAt: userBadge.earnedAt,
    })
    .from(userBadge)
    .innerJoin(badge, eq(userBadge.badgeId, badge.id))
    .where(eq(userBadge.userId, userId))
    .orderBy(desc(userBadge.earnedAt));

  return badges;
}

// ============================================================================
// MAIN REWARD PROCESSING FUNCTIONS
// ============================================================================

/**
 * Process gamification rewards for sending a message
 */
export async function processMessageReward(
  userId: string,
  sessionId: string,
  isFirstMessageOfDay: boolean,
): Promise<GamificationReward> {
  // Base XP for message
  let xpToAward = XP_REWARDS.SEND_MESSAGE;

  // Bonus for first message of day
  if (isFirstMessageOfDay) {
    xpToAward += XP_REWARDS.FIRST_MESSAGE_OF_DAY;

    // Update streak
    const streakUpdate = await updateStreak(userId, new Date());

    // Add streak milestone XP if applicable
    if (streakUpdate.milestoneXP > 0) {
      xpToAward += streakUpdate.milestoneXP;
    }

    // Award XP
    const xpResult = await awardXP(
      userId,
      xpToAward,
      "Message sent (first of day)",
    );

    // Check badges
    const eligibleBadges = await checkBadgeEligibility(userId, {
      type: "message_sent",
      sessionId,
    });

    // Award eligible badges
    const badgesEarned: string[] = [];
    for (const badgeCode of eligibleBadges) {
      const awarded = await awardBadge(userId, badgeCode);
      if (awarded) {
        badgesEarned.push(badgeCode);
      }
    }

    return {
      xpGained: xpToAward,
      totalXP: xpResult.xp,
      level: xpResult.level,
      leveledUp: xpResult.leveledUp,
      streakDays: streakUpdate.streakDays,
      streakBroken: streakUpdate.streakBroken,
      badgesEarned,
    };
  }

  // Not first message of day - just award base XP
  const xpResult = await awardXP(userId, xpToAward, "Message sent");

  // Get current streak
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  return {
    xpGained: xpToAward,
    totalXP: xpResult.xp,
    level: xpResult.level,
    leveledUp: xpResult.leveledUp,
    streakDays: stats?.streakDays ?? 0,
    badgesEarned: [],
  };
}

/**
 * Process gamification rewards for ending a session
 */
export async function processSessionReward(
  userId: string,
  sessionId: string,
  metadata: {
    messageCount: number;
    stressScore?: number;
  },
): Promise<GamificationReward> {
  let xpToAward = XP_REWARDS.COMPLETE_SESSION;

  // Bonus for long session
  if (metadata.messageCount > 10) {
    xpToAward += XP_REWARDS.LONG_SESSION;
  }

  // Bonus for deep reflection (high stress addressed)
  if (metadata.stressScore && metadata.stressScore >= 50) {
    xpToAward += XP_REWARDS.DEEP_REFLECTION;
  }

  // Award XP
  const xpResult = await awardXP(userId, xpToAward, "Session completed");

  // Check badges
  const eligibleBadges = await checkBadgeEligibility(userId, {
    type: "session_ended",
    sessionId,
    metadata,
  });

  // Award eligible badges
  const badgesEarned: string[] = [];
  for (const badgeCode of eligibleBadges) {
    const awarded = await awardBadge(userId, badgeCode);
    if (awarded) {
      badgesEarned.push(badgeCode);
    }
  }

  // Get current streak
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  return {
    xpGained: xpToAward,
    totalXP: xpResult.xp,
    level: xpResult.level,
    leveledUp: xpResult.leveledUp,
    streakDays: stats?.streakDays ?? 0,
    badgesEarned,
  };
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .then((rows) => rows[0]);

  if (!stats) return null;

  return {
    userId: stats.userId,
    xp: stats.xp,
    level: stats.level,
    streakDays: stats.streakDays,
    lastActiveDate: stats.lastActiveDate,
  };
}
