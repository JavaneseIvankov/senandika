import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

// =====================================
// 🧩 BETTER AUTH BASE SCHEMA
// =====================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// =====================================
// 🧠 APAAC EXTENSION SCHEMA
// =====================================

// === Reflective Sessions (one per journaling/chat reflection) ===
export const reflectionSession = pgTable("reflection_session", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  topic: text("topic"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  moodAtStart: varchar("mood_start", { length: 32 }),
  moodAtEnd: varchar("mood_end", { length: 32 }),
});

// === Conversation Memory ===
export const memory = pgTable("memory", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: uuid("session_id").references(() => reflectionSession.id, {
    onDelete: "cascade",
  }),
  role: varchar("role", { length: 16 }).notNull(), // 'user' | 'assistant'
  text: text("text").notNull(),
  embedding: vector("embedding", {
    dimensions: 768,
  }),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === Rolling Summary (for RAG context) ===
export const rollingSummary = pgTable("rolling_summary", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: uuid("session_id").references(() => reflectionSession.id, {
    onDelete: "cascade",
  }),
  dailySummary: text("daily_summary").notNull(),
  keyPoints: jsonb("key_points").notNull().$type<string[]>(),
  followUpTomorrow: jsonb("follow_up_tomorrow").notNull().$type<string[]>(),
  safetyFlag: boolean("safety_flag").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// === Moods ===
export const mood = pgTable("mood", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  mood: varchar("mood", { length: 32 }).notNull(), // e.g., "calm", "anxious"
  intensity: integer("intensity").notNull(), // 1–10
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === Insights (AI-generated reflections or patterns) ===
export const insight = pgTable("insight", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  memoryId: uuid("memory_id").references(() => memory.id, {
    onDelete: "cascade",
  }),
  type: varchar("type", { length: 64 }), // "pattern", "emotion", "habit"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === Gamification Stats ===
export const gamificationStat = pgTable("gamification_stat", {
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .primaryKey(),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  streakDays: integer("streak_days").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
});

// === Badges ===
export const badge = pgTable("badge", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 128 }),
});

export const userBadge = pgTable(
  "user_badge",
  {
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    badgeId: integer("badge_id")
      .references(() => badge.id, { onDelete: "cascade" })
      .notNull(),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.badgeId] }),
  }),
);

// === System Logs (optional, for analytics/debugging) ===
export const systemLog = pgTable("system_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  event: varchar("event", { length: 128 }).notNull(), // "memory_upsert", "badge_earned", etc
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
