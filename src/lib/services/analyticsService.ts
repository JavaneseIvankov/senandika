/**
 * Analytics Service
 *
 * Purpose: Calculate and aggregate user analytics data
 * - Session statistics (total, duration, activity patterns)
 * - Mood trends (improvement rate, stress scores, emotions)
 * - Gamification summary (reuses existing gamification service)
 * - AI-generated summary insights (human-readable)
 */

import { db } from "@/lib/db/db";
import {
  reflectionSession,
  memory,
  gamificationStat,
  userBadge,
  badge,
  analyticsCache,
} from "@/lib/db/schema/schema";
import { eq, and, between, desc, lt } from "drizzle-orm";
import { resilientGenerateObject } from "@/lib/ai/resilientAI";
import { z } from "zod";

// =====================================
// 📊 Type Definitions
// =====================================

export interface UserAnalytics {
  timeRange: {
    start: Date;
    end: Date;
    days: number;
  };
  sessionStats: SessionStats;
  moodTrends: MoodTrends;
  gamificationSummary: GamificationSummary;
  summaryInsights: SummaryInsights;
}

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  averageDuration: number; // in minutes
  totalReflectionTime: number; // in minutes
  mostActiveDay: string; // "Monday", "Tuesday", etc.
  mostActiveTimeOfDay: string; // "morning", "afternoon", "evening", "night"
}

export interface MoodTrends {
  moodImprovementRate: number; // percentage (0-100)
  averageStressScore: number; // 0-100
  stressScoreTrend: "improving" | "stable" | "worsening";
  topEmotions: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
  moodDistribution: {
    improved: number; // count where moodEnd > moodStart
    worsened: number; // count where moodEnd < moodStart
    unchanged: number; // count where moodEnd = moodStart
  };
}

export interface GamificationSummary {
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  recentBadges: {
    code: string;
    name: string;
    earnedAt: Date;
  }[];
}

export interface SummaryInsights {
  mainInsight: string; // Primary insight (1-2 sentences)
  bulletPoints: string[]; // 3-5 actionable insights
  encouragement: string; // Motivational message
  nextSteps: string[]; // Suggested actions (0-2 items)
}

// =====================================
// 🛠️ Helper Functions
// =====================================

/**
 * Get day of week name from number (0-6)
 */
function getDayName(dayNumber: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber] || "Unknown";
}

/**
 * Get time of day category from hour (0-23)
 */
function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Determine stress trend from historical data
 */
function calculateStressTrend(
  currentAverage: number,
  previousAverage: number | null,
): "improving" | "stable" | "worsening" {
  if (!previousAverage) return "stable";

  const difference = currentAverage - previousAverage;

  // Improving if stress decreased by more than 5 points
  if (difference <= -5) return "improving";

  // Worsening if stress increased by more than 5 points
  if (difference >= 5) return "worsening";

  return "stable";
}

// =====================================
// 📈 Session Statistics
// =====================================

/**
 * Calculate session statistics for a given time period
 */
export async function calculateSessionStats(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<SessionStats> {
  console.log("=== CALCULATING SESSION STATS ===");
  console.log("User ID:", userId);
  console.log(
    "Date range:",
    startDate.toISOString(),
    "to",
    endDate.toISOString(),
  );

  // Query all sessions in date range
  const sessions = await db
    .select({
      id: reflectionSession.id,
      startedAt: reflectionSession.startedAt,
      endedAt: reflectionSession.endedAt,
    })
    .from(reflectionSession)
    .where(
      and(
        eq(reflectionSession.userId, userId),
        between(reflectionSession.startedAt, startDate, endDate),
      ),
    );

  console.log("Total sessions found:", sessions.length);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s: { endedAt: Date | null }) => s.endedAt !== null,
  ).length;

  // Calculate average duration (only for completed sessions)
  let averageDuration = 0;
  let totalReflectionTime = 0;

  const completedSessionsWithDuration = sessions.filter(
    (s: { endedAt: Date | null }) => s.endedAt !== null,
  );

  if (completedSessionsWithDuration.length > 0) {
    const durations = completedSessionsWithDuration.map(
      (s: { startedAt: Date; endedAt: Date | null }) => {
        const endTime = s.endedAt ? s.endedAt.getTime() : Date.now();
        const duration = endTime - s.startedAt.getTime();
        return duration / (1000 * 60); // Convert to minutes
      },
    );

    totalReflectionTime = durations.reduce(
      (sum: number, d: number) => sum + d,
      0,
    );
    averageDuration = totalReflectionTime / durations.length;
  }

  // Find most active day of week
  const dayCount = new Map<number, number>();
  for (const session of sessions) {
    const day = session.startedAt.getDay();
    dayCount.set(day, (dayCount.get(day) || 0) + 1);
  }

  let mostActiveDayNumber = 0;
  let maxDayCount = 0;
  for (const [day, count] of dayCount.entries()) {
    if (count > maxDayCount) {
      maxDayCount = count;
      mostActiveDayNumber = day;
    }
  }

  const mostActiveDay =
    sessions.length > 0 ? getDayName(mostActiveDayNumber) : "No data";

  // Find most active time of day
  const timeCount = new Map<string, number>();
  for (const session of sessions) {
    const hour = session.startedAt.getHours();
    const timeOfDay = getTimeOfDay(hour);
    timeCount.set(timeOfDay, (timeCount.get(timeOfDay) || 0) + 1);
  }

  let mostActiveTimeOfDay = "No data";
  let maxTimeCount = 0;
  for (const [time, count] of timeCount.entries()) {
    if (count > maxTimeCount) {
      maxTimeCount = count;
      mostActiveTimeOfDay = time;
    }
  }

  console.log("=== SESSION STATS CALCULATED ===");
  console.log("Total sessions:", totalSessions);
  console.log("Completed sessions:", completedSessions);
  console.log("Average duration:", averageDuration.toFixed(2), "minutes");
  console.log("Most active day:", mostActiveDay);
  console.log("Most active time:", mostActiveTimeOfDay);

  return {
    totalSessions,
    completedSessions,
    averageDuration: Math.round(averageDuration * 10) / 10, // Round to 1 decimal
    totalReflectionTime: Math.round(totalReflectionTime),
    mostActiveDay,
    mostActiveTimeOfDay,
  };
}

// =====================================
// 😊 Mood Trends Analysis
// =====================================

/**
 * Analyze mood trends from session data and memory metadata
 */
export async function analyzeMoodTrends(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<MoodTrends> {
  console.log("=== ANALYZING MOOD TRENDS ===");

  // 1. Calculate mood improvement from sessions
  const sessions = await db
    .select({
      moodAtStart: reflectionSession.moodAtStart,
      moodAtEnd: reflectionSession.moodAtEnd,
    })
    .from(reflectionSession)
    .where(
      and(
        eq(reflectionSession.userId, userId),
        between(reflectionSession.startedAt, startDate, endDate),
      ),
    );

  // Define mood values for comparison
  const moodValues: Record<string, number> = {
    marah: 1,
    sedih: 2,
    normal: 3,
    senang: 4,
  };

  let improved = 0;
  let worsened = 0;
  let unchanged = 0;

  for (const session of sessions) {
    if (session.moodAtStart && session.moodAtEnd) {
      const startValue = moodValues[session.moodAtStart] || 3;
      const endValue = moodValues[session.moodAtEnd] || 3;

      if (endValue > startValue) improved++;
      else if (endValue < startValue) worsened++;
      else unchanged++;
    }
  }

  const totalMoodSessions = improved + worsened + unchanged;
  const moodImprovementRate =
    totalMoodSessions > 0 ? (improved / totalMoodSessions) * 100 : 0;

  console.log("Mood improvement rate:", moodImprovementRate.toFixed(2) + "%");

  // 2. Calculate average stress score from memory metadata
  const memories = await db
    .select({
      meta: memory.meta,
    })
    .from(memory)
    .where(
      and(
        eq(memory.userId, userId),
        eq(memory.role, "assistant"),
        between(memory.createdAt, startDate, endDate),
      ),
    );

  const stressScores: number[] = [];
  const emotionCounts = new Map<string, number>();

  for (const mem of memories) {
    if (mem.meta && typeof mem.meta === "object") {
      const meta = mem.meta as {
        analysis?: {
          stress_score?: number;
          emotions?: string[];
        };
      };

      // Collect stress scores
      if (meta.analysis?.stress_score !== undefined) {
        stressScores.push(meta.analysis.stress_score);
      }

      // Collect emotions
      if (Array.isArray(meta.analysis?.emotions)) {
        for (const emotion of meta.analysis.emotions) {
          emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
        }
      }
    }
  }

  const averageStressScore =
    stressScores.length > 0
      ? stressScores.reduce((sum, s) => sum + s, 0) / stressScores.length
      : 0;

  console.log("Average stress score:", averageStressScore.toFixed(2));

  // 3. Calculate stress trend (compare with previous period)
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(
    previousStartDate.getDate() - (endDate.getDate() - startDate.getDate()),
  );

  const previousMemories = await db
    .select({
      meta: memory.meta,
    })
    .from(memory)
    .where(
      and(
        eq(memory.userId, userId),
        eq(memory.role, "assistant"),
        between(memory.createdAt, previousStartDate, startDate),
      ),
    );

  const previousStressScores: number[] = [];
  for (const mem of previousMemories) {
    if (mem.meta && typeof mem.meta === "object") {
      const meta = mem.meta as { analysis?: { stress_score?: number } };
      if (meta.analysis?.stress_score !== undefined) {
        previousStressScores.push(meta.analysis.stress_score);
      }
    }
  }

  const previousAverage =
    previousStressScores.length > 0
      ? previousStressScores.reduce((sum, s) => sum + s, 0) /
        previousStressScores.length
      : null;

  const stressScoreTrend = calculateStressTrend(
    averageStressScore,
    previousAverage,
  );

  console.log("Stress trend:", stressScoreTrend);

  // 4. Top emotions
  const totalEmotions = Array.from(emotionCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  const topEmotions = Array.from(emotionCounts.entries())
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage:
        totalEmotions > 0 ? Math.round((count / totalEmotions) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  console.log(
    "Top emotions:",
    topEmotions.map((e) => `${e.emotion} (${e.percentage}%)`).join(", "),
  );

  return {
    moodImprovementRate: Math.round(moodImprovementRate),
    averageStressScore: Math.round(averageStressScore),
    stressScoreTrend,
    topEmotions,
    moodDistribution: {
      improved,
      worsened,
      unchanged,
    },
  };
}

// =====================================
// 🎮 Gamification Summary
// =====================================

/**
 * Get gamification summary (wrapper around existing data)
 */
export async function getGamificationSummary(
  userId: string,
): Promise<GamificationSummary> {
  console.log("=== FETCHING GAMIFICATION SUMMARY ===");

  // Get current stats
  const stats = await db
    .select()
    .from(gamificationStat)
    .where(eq(gamificationStat.userId, userId))
    .limit(1);

  const currentStats = stats[0] || {
    xp: 0,
    level: 1,
    streakDays: 0,
  };

  // Calculate longest streak (from history)
  // For now, use current streak as longest
  // TODO: Store streak history if needed
  const longestStreak = currentStats.streakDays;

  // Get total badges earned
  const earnedBadges = await db
    .select({
      badgeCode: badge.code,
      badgeName: badge.name,
      earnedAt: userBadge.earnedAt,
    })
    .from(userBadge)
    .innerJoin(badge, eq(userBadge.badgeId, badge.id))
    .where(eq(userBadge.userId, userId))
    .orderBy(desc(userBadge.earnedAt));

  // Get recent badges (last 3)
  const recentBadges = earnedBadges
    .slice(0, 3)
    .map((b: { badgeCode: string; badgeName: string; earnedAt: Date }) => ({
      code: b.badgeCode,
      name: b.badgeName,
      earnedAt: b.earnedAt,
    }));

  console.log("Current level:", currentStats.level);
  console.log("Total XP:", currentStats.xp);
  console.log("Current streak:", currentStats.streakDays);
  console.log("Total badges:", earnedBadges.length);

  return {
    currentLevel: currentStats.level,
    totalXP: currentStats.xp,
    currentStreak: currentStats.streakDays,
    longestStreak,
    totalBadges: earnedBadges.length,
    recentBadges,
  };
}

// =====================================
// 💡 AI-Generated Summary Insights
// =====================================

/**
 * Generate human-readable insights from analytics data using AI
 */
export async function generateSummaryInsights(
  _userId: string,
  sessionStats: SessionStats,
  moodTrends: MoodTrends,
  gamificationSummary: GamificationSummary,
  days: number,
): Promise<SummaryInsights> {
  console.log("=== GENERATING SUMMARY INSIGHTS ===");

  // Build context for AI
  const context = {
    timeRange: `Last ${days} days`,
    sessions: {
      total: sessionStats.totalSessions,
      completed: sessionStats.completedSessions,
      avgDuration: sessionStats.averageDuration,
      totalTime: sessionStats.totalReflectionTime,
      mostActiveDay: sessionStats.mostActiveDay,
      mostActiveTime: sessionStats.mostActiveTimeOfDay,
    },
    mood: {
      improvementRate: moodTrends.moodImprovementRate,
      avgStress: moodTrends.averageStressScore,
      stressTrend: moodTrends.stressScoreTrend,
      topEmotions: moodTrends.topEmotions.slice(0, 3).map((e) => e.emotion),
      distribution: moodTrends.moodDistribution,
    },
    gamification: {
      level: gamificationSummary.currentLevel,
      xp: gamificationSummary.totalXP,
      streak: gamificationSummary.currentStreak,
      badges: gamificationSummary.totalBadges,
    },
  };

  // AI prompt for generating insights
  const prompt = `
Kamu adalah pendamping emosional non-klinis untuk remaja/mahasiswa Indonesia.
Gaya: hangat, empatik, tidak menghakimi, ringkas, Bahasa Indonesia sehari-hari. Hindari diagnosis/istilah medis dan klaim klinis. Fokus merayakan progres, membaca pola, dan memberi arahan lembut.

TUGAS:
Hasilkan ringkasan wawasan berbasis DATA yang diberikan di bawah. Gunakan hanya data yang tersedia—jangan mengada-ada angka/tren. Tulis seluruh output dalam Bahasa Indonesia dan PASTIKAN hanya mengembalikan JSON yang sesuai dengan insightsSchema.

DATA ANALITIK PENGGUNA:
- Periode: ${days} hari terakhir
- Total Sesi Refleksi: ${context.sessions.total}
- Sesi Tuntas: ${context.sessions.completed}
- Durasi Rata-rata: ${context.sessions.avgDuration} menit
- Waktu Paling Aktif: ${context.sessions.mostActiveTime}
- Hari Paling Aktif: ${context.sessions.mostActiveDay}

MOOD & EMOSI:
- Laju Perbaikan Mood: ${context.mood.improvementRate}%
- Skor Stres Rata-rata: ${context.mood.avgStress}/100
- Tren Stres: ${context.mood.stressTrend}
- Emosi Teratas: ${context.mood.topEmotions.join(", ")}

GAMIFIKASI:
- Level Saat Ini: ${context.gamification.level}
- Streak Saat Ini: ${context.gamification.streak} hari
- Total Lencana: ${context.gamification.badges}

FORMAT KELUARAN (WAJIB JSON SAJA):
{
  "main_insight": "...",            // 1–2 kalimat, hangat & menyemangati, merangkum pola terpenting dalam ${days} hari
  "bullet_points": ["...", "..."],  // 3–5 observasi spesifik & actionable, memakai istilah sehari-hari
  "encouragement": "...",           // 1 kalimat motivasional yang lembut
  "next_steps": ["...", "..."]      // 0–2 langkah kecil opsional; singkat, non-preskriptif (gunakan kata seperti "coba", "boleh")
}

Referensi Output:
{
  "main_insight": "Kamu menunjukkan konsistensi yang luar biasa dengan 5 sesi refleksi minggu ini! Pola stres kamu juga menunjukkan tren yang membaik.",
  "bullet_points": [
    "Kamu paling produktif untuk refleksi di malam hari (7-9 PM)",
    "Tingkat stres rata-rata menurun 15% dibanding minggu lalu",
    "Emosi 'grateful' muncul 3x lebih sering minggu ini",
    "Durasi sesi rata-rata meningkat ke 12 menit - tanda refleksi yang lebih dalam",
    "Streak 5 hari kamu adalah yang terpanjang bulan ini!"
  ],
  "encouragement": "Terus pertahankan momentum ini - kamu sedang membangun kebiasaan refleksi yang sehat! 🌱",
  "next_steps": [
    "Coba eksplorasi topik baru di sesi berikutnya untuk variasi",
    "Pertimbangkan refleksi pagi hari untuk memulai hari dengan mindful"
  ]
}

ATURAN GAYA (PENTING):
- Pakai "kamu", kalimat aktif, nada suportif. Hindari "harus/wajib"; gunakan "coba/boleh/kalau mau".
- Mulai "main_insight" dengan highlight positif (mis. konsistensi, streak, durasi membaik). Jika tren stres "naik", akui dengan empati lalu beri harapan singkat.
- Angka: bulatkan wajar (tanpa desimal kecuali perlu), gunakan "kali" alih-alih "x", jam pakai rentang 7–9 PM. Jangan sebut persentase kecil (<5%)—gunakan "sedikit menurun/naik".
- "bullet_points" awali dengan kata kerja/penanda pola: "Paling aktif…", "Rata-rata stres…", "Emosi yang sering muncul…". Sertakan konteks waktu (minggu ini/dibanding minggu lalu) bila relevan.
- "encouragement": maksimal 1 emoji opsional di akhir dari whitelist [🌱,✨,💪,😊]. Hanya 1.
- "next_steps": langkah mikro non-preskriptif (≤2 item, ≤12 kata/item), hindari nama teknik; contoh: "coba sesi 10 menit di jam aktifmu", "tarik napas 4-7-8 satu putaran sebelum mulai".
- Edge case:
  • totalSessions = 0 → apresiasi memulai dari nol, sarankan 1 langkah mikro tunggal.
  • data kosong/parsial → fokus pada sinyal yang ada, gunakan pernyataan hedging ringan ("terlihat", "cenderung").
- Jangan mengulang angka yang sama di banyak bidang; cukup tampilkan sekali di poin paling relevan.
`.trim();

  // Schema for AI output
  const insightsSchema = z.object({
    main_insight: z
      .string()
      .describe("Primary insight (1-2 sentences in Bahasa Indonesia)"),
    bullet_points: z
      .array(z.string())
      .min(3)
      .max(5)
      .describe("Specific observations (3-5 items)"),
    encouragement: z.string().describe("Motivational message (1 sentence)"),
    next_steps: z
      .array(z.string())
      .max(2)
      .describe("Suggested actions (0-2 items)"),
  });

  try {
    const { object: insights } = await resilientGenerateObject({
      schema: insightsSchema,
      prompt,
    });

    console.log("=== INSIGHTS GENERATED ===");
    console.log(
      "Main insight:",
      insights.main_insight.substring(0, 80) + "...",
    );
    console.log("Bullet points:", insights.bullet_points.length);
    console.log("Next steps:", insights.next_steps.length);

    return {
      mainInsight: insights.main_insight,
      bulletPoints: insights.bullet_points,
      encouragement: insights.encouragement,
      nextSteps: insights.next_steps,
    };
  } catch (error) {
    console.error("Error generating insights:", error);

    // Fallback to generic insights
    return {
      mainInsight:
        "Terima kasih sudah meluangkan waktu untuk refleksi. Setiap langkah kecil berarti dalam perjalanan kesehatan mental kamu.",
      bulletPoints: [
        `Kamu telah menyelesaikan ${sessionStats.totalSessions} sesi refleksi`,
        `Rata-rata durasi refleksi kamu adalah ${sessionStats.averageDuration} menit`,
        `Tingkat stres rata-rata kamu berada di ${moodTrends.averageStressScore}/100`,
      ],
      encouragement: "Terus lanjutkan kebiasaan refleksi yang baik ini! 🌱",
      nextSteps: [],
    };
  }
}

// =====================================
// 💾 Analytics Cache Management
// =====================================

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

/**
 * Get cached analytics if valid, otherwise return null
 */
async function getCachedAnalytics(
  userId: string,
  days: 7 | 30 | 90,
): Promise<UserAnalytics | null> {
  try {
    const cached = await db
      .select()
      .from(analyticsCache)
      .where(
        and(
          eq(analyticsCache.userId, userId),
          eq(analyticsCache.timeRangeDays, days),
        ),
      )
      .limit(1);

    if (cached.length === 0) {
      console.log("📊 No cache found");
      return null;
    }

    const cacheEntry = cached[0];
    const now = new Date();

    // Check if cache is expired
    if (now > cacheEntry.expiresAt) {
      console.log("📊 Cache expired, deleting...");
      await db
        .delete(analyticsCache)
        .where(eq(analyticsCache.id, cacheEntry.id));
      return null;
    }

    console.log("✅ Cache hit! Using cached analytics");
    console.log("📅 Cache created at:", cacheEntry.createdAt.toISOString());
    console.log("⏰ Cache expires at:", cacheEntry.expiresAt.toISOString());

    // Parse and reconstruct dates from cached data
    const data = cacheEntry.data as Record<string, unknown>;
    const timeRange = data.timeRange as Record<string, unknown>;
    const gamificationSummary = data.gamificationSummary as Record<
      string,
      unknown
    >;
    const recentBadges = gamificationSummary.recentBadges as Array<
      Record<string, unknown>
    >;

    return {
      ...data,
      timeRange: {
        ...timeRange,
        start: new Date(timeRange.start as string),
        end: new Date(timeRange.end as string),
        days: timeRange.days as number,
      },
      gamificationSummary: {
        ...gamificationSummary,
        recentBadges: recentBadges.map((badge) => ({
          ...badge,
          earnedAt: new Date(badge.earnedAt as string),
        })),
      },
    } as UserAnalytics;
  } catch (error) {
    console.error("❌ Error reading cache:", error);
    return null;
  }
}

/**
 * Save analytics to cache
 */
async function setCachedAnalytics(
  userId: string,
  days: 7 | 30 | 90,
  analytics: UserAnalytics,
): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

    // Delete old cache for this user+days combination
    await db
      .delete(analyticsCache)
      .where(
        and(
          eq(analyticsCache.userId, userId),
          eq(analyticsCache.timeRangeDays, days),
        ),
      );

    // Insert new cache (cast to unknown first to avoid type issues with jsonb)
    await db.insert(analyticsCache).values({
      userId,
      timeRangeDays: days,
      data: analytics as unknown as Record<string, unknown>,
      expiresAt,
    });

    console.log("💾 Analytics cached successfully");
    console.log("⏰ Cache expires at:", expiresAt.toISOString());
  } catch (error) {
    console.error("❌ Error saving cache:", error);
    // Don't throw - caching failure shouldn't break analytics
  }
}

/**
 * Invalidate (delete) cached analytics for a user
 * Call this when user data changes (e.g., completes session, earns badge)
 *
 * @param userId - User ID
 * @param days - Optional specific time range to invalidate (7, 30, or 90)
 *               If not provided, invalidates all time ranges
 */
export async function invalidateAnalyticsCache(
  userId: string,
  days?: 7 | 30 | 90,
): Promise<void> {
  try {
    if (days) {
      // Invalidate specific time range
      await db
        .delete(analyticsCache)
        .where(
          and(
            eq(analyticsCache.userId, userId),
            eq(analyticsCache.timeRangeDays, days),
          ),
        );
      console.log(`🗑️ Invalidated ${days}-day analytics cache for user ${userId}`);
    } else {
      // Invalidate all time ranges for this user
      await db
        .delete(analyticsCache)
        .where(eq(analyticsCache.userId, userId));
      console.log(`🗑️ Invalidated all analytics cache for user ${userId}`);
    }
  } catch (error) {
    console.error("❌ Error invalidating cache:", error);
    // Don't throw - cache invalidation failure shouldn't break the app
  }
}

/**
 * Clean up expired cache entries (can be called periodically)
 */
export async function cleanupExpiredCache(): Promise<void> {
  try {
    const now = new Date();
    await db.delete(analyticsCache).where(lt(analyticsCache.expiresAt, now));

    console.log("🧹 Cleaned up expired cache entries");
  } catch (error) {
    console.error("❌ Error cleaning up cache:", error);
  }
}

// =====================================
// 🎯 Main Analytics Function
// =====================================

/**
 * Get complete user analytics for a specified time period
 * Uses cache with 1-day TTL to avoid expensive recalculations
 */
export async function getUserAnalytics(
  userId: string,
  days: 7 | 30 | 90 = 7,
): Promise<UserAnalytics> {
  console.log("\n=== GETTING USER ANALYTICS ===");
  console.log("User ID:", userId);
  console.log("Time range:", days, "days");

  // 1. Try to get from cache first
  const cachedAnalytics = await getCachedAnalytics(userId, days);
  if (cachedAnalytics) {
    return cachedAnalytics;
  }

  // 2. Cache miss - calculate fresh analytics
  console.log("📊 Cache miss - calculating fresh analytics...");

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  console.log("Start date:", startDate.toISOString());
  console.log("End date:", endDate.toISOString());

  // Run all calculations in parallel for performance
  const [sessionStats, moodTrends, gamificationSummary] = await Promise.all([
    calculateSessionStats(userId, startDate, endDate),
    analyzeMoodTrends(userId, startDate, endDate),
    getGamificationSummary(userId),
  ]);

  // Generate insights (depends on other stats, so run after)
  const summaryInsights = await generateSummaryInsights(
    userId,
    sessionStats,
    moodTrends,
    gamificationSummary,
    days,
  );

  const analytics: UserAnalytics = {
    timeRange: {
      start: startDate,
      end: endDate,
      days,
    },
    sessionStats,
    moodTrends,
    gamificationSummary,
    summaryInsights,
  };

  // 3. Save to cache for next time
  await setCachedAnalytics(userId, days, analytics);

  console.log("=== ANALYTICS COMPLETE ===\n");

  return analytics;
}
