import "server-only";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/db";
import { headers } from "next/headers";
import * as schema from "@/lib/db/schema";
import { AuthenticationError } from "@/lib/errors";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (refresh session if older than this)
  },
});

/**
 * Get the current authenticated user from the session
 *
 * @throws {AuthenticationError} If session is invalid, expired, or missing
 *
 * Server actions should catch this error and return an error response
 * that the client can handle with toast + redirect.
 *
 * @example
 * ```ts
 * try {
 *   const user = await getCurrentUser();
 *   // ... use user
 * } catch (error) {
 *   if (error instanceof AuthenticationError) {
 *     return { error: "AUTH_EXPIRED", message: error.message };
 *   }
 *   throw error;
 * }
 * ```
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthenticationError(
      "Session expired or invalid. Please log in again.",
    );
  }

  return session.user;
}

/**
 * Get the current session (user + session data)
 * Returns null if not authenticated
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
