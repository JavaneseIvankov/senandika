/**
 * Server Action Helper Utilities
 *
 * Provides helper functions for handling common server action patterns
 * like authentication error handling.
 *
 * NOTE: This file is SERVER-ONLY. For client-side imports, use @/lib/action-types
 */

import "server-only";
import { AuthenticationError, isAuthenticationError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/auth";
import type { ActionError } from "@/lib/action-types";

// Re-export types from shared module for convenience in server code
export type { ActionError, ActionResponse } from "@/lib/action-types";
export { isActionError } from "@/lib/action-types";

/**
 * Wrapper for server actions that handles authentication errors automatically
 *
 * @param action - Async function that receives the authenticated user
 * @returns Promise that resolves to either success data or error object
 *
 * @example
 * ```ts
 * export async function myAction(param: string) {
 *   return withAuth(async (user) => {
 *     // Your logic here - user is guaranteed to be authenticated
 *     return { success: true, data: "something" };
 *   });
 * }
 * ```
 */
export async function withAuth<T>(
  action: (user: Awaited<ReturnType<typeof getCurrentUser>>) => Promise<T>,
): Promise<T | ActionError> {
  try {
    const user = await getCurrentUser();
    return await action(user);
  } catch (error) {
    // Handle authentication errors
    if (isAuthenticationError(error)) {
      return {
        error: "AUTH_EXPIRED",
        message: error.message,
      };
    }

    // Log unexpected errors for debugging
    console.error("[SERVER ACTION ERROR]", error);

    // Re-throw other errors to be caught by Next.js error boundary
    throw error;
  }
}

/**
 * Extended wrapper that also handles other common errors
 *
 * @example
 * ```ts
 * export async function myAction(param: string) {
 *   return withErrorHandling(async (user) => {
 *     if (!param) throw new ValidationError("Param is required");
 *     // Your logic here
 *     return { success: true };
 *   });
 * }
 * ```
 */
export async function withErrorHandling<T>(
  action: (user: Awaited<ReturnType<typeof getCurrentUser>>) => Promise<T>,
): Promise<T | ActionError> {
  try {
    const user = await getCurrentUser();
    return await action(user);
  } catch (error) {
    // Handle authentication errors
    if (isAuthenticationError(error)) {
      return {
        error: "AUTH_EXPIRED",
        message: error.message,
      };
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return {
        error: "VALIDATION_ERROR",
        message: error.message,
      };
    }

    // Handle authorization errors
    if (error instanceof Error && error.name === "AuthorizationError") {
      return {
        error: "FORBIDDEN",
        message: error.message,
      };
    }

    // Log unexpected errors
    console.error("[SERVER ACTION ERROR]", error);

    // Return generic error for unexpected cases
    return {
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
