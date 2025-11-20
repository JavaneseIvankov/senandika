/**
 * Client-side Server Action Error Handling Hook
 *
 * Provides utilities for handling server action errors on the client,
 * particularly authentication errors that require user notification and redirect.
 */

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isActionError, type ActionError } from "@/lib/action-types";

// Global tracker to prevent duplicate toasts for the same error type
const lastToastTime: Record<string, number> = {};
const TOAST_DEBOUNCE_MS = 3000; // Show same error at most once per 3 seconds

function shouldShowToast(errorType: string): boolean {
  const now = Date.now();
  const lastTime = lastToastTime[errorType] || 0;

  if (now - lastTime < TOAST_DEBOUNCE_MS) {
    return false; // Skip - too soon after last toast of this type
  }

  lastToastTime[errorType] = now;
  return true;
}

/**
 * Hook for handling server action errors with automatic toast + redirect
 *
 * @example
 * ```tsx
 * const { handleAction } = useServerActionError();
 *
 * const handleSubmit = async () => {
 *   const result = await handleAction(() => myServerAction(param));
 *   if (result) {
 *     // Success - result is the actual data
 *     console.log(result);
 *   }
 * };
 * ```
 */
export function useServerActionError() {
  const router = useRouter();

  /**
   * Execute a server action and handle any errors
   * Returns null if error occurred, otherwise returns the result
   */
  const handleAction = async <T>(
    action: () => Promise<T | ActionError>,
  ): Promise<T | null> => {
    try {
      const result = await action();

      // Check if result is an error
      if (isActionError(result)) {
        handleActionError(result);
        return null;
      }

      return result;
    } catch {
      // Handle unexpected errors
      // [CLIENT] Commented out for production
      // console.error("[CLIENT ERROR]", error);
      toast.error("An unexpected error occurred. Please try again.");
      return null;
    }
  }; /**
   * Handle different types of action errors
   */
  const handleActionError = (error: ActionError) => {
    // Check if we should show this toast (debouncing)
    if (!shouldShowToast(error.error)) {
      // [CLIENT] Commented out for production
      // console.log(
      //   `[handleActionError] Skipping duplicate toast for: ${error.error}`,
      // );
      return;
    }

    switch (error.error) {
      case "AUTH_EXPIRED":
        toast.error(error.message || "Session expired. Please log in again.");
        // Small delay to show toast before redirect
        setTimeout(() => {
          router.push("/login");
        }, 1000);
        break;

      case "FORBIDDEN":
        toast.error(
          error.message || "You don't have permission to perform this action.",
        );
        break;

      case "VALIDATION_ERROR":
        toast.error(error.message || "Invalid input. Please check your data.");
        break;

      case "INTERNAL_ERROR":
        toast.error(error.message || "Something went wrong. Please try again.");
        break;

      default:
        toast.error("An error occurred. Please try again.");
    }
  };

  return {
    handleAction,
    handleActionError,
  };
}

/**
 * Simpler helper function for one-off error handling
 * Use this when you don't need the full hook
 *
 * @example
 * ```tsx
 * const result = await myServerAction();
 * if (handleServerActionError(result, router)) {
 *   return; // Error was handled
 * }
 * // Continue with success logic
 * ```
 */
export function handleServerActionError(
  result: unknown,
  router: ReturnType<typeof useRouter>,
): result is ActionError {
  if (!isActionError(result)) {
    return false;
  }

  // Check if we should show this toast (debouncing)
  if (!shouldShowToast(result.error)) {
    // [CLIENT] Commented out for production
    // console.log(
    //   `[handleServerActionError] Skipping duplicate toast for: ${result.error}`,
    // );
    return true; // Still return true as it IS an error
  }

  switch (result.error) {
    case "AUTH_EXPIRED":
      toast.error(result.message || "Session expired. Please log in again.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      break;

    case "FORBIDDEN":
      toast.error(
        result.message || "You don't have permission to perform this action.",
      );
      break;

    case "VALIDATION_ERROR":
      toast.error(result.message || "Invalid input. Please check your data.");
      break;

    case "INTERNAL_ERROR":
      toast.error(result.message || "Something went wrong. Please try again.");
      break;

    default:
      toast.error("An error occurred. Please try again.");
  }

  return true;
}
