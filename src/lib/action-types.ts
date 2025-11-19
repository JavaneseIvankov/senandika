/**
 * Shared types for server actions
 * Can be safely imported by both client and server code
 */

/**
 * Discriminated union of possible action error types
 */
export type ActionError =
  | { error: "AUTH_EXPIRED"; message: string }
  | { error: "FORBIDDEN"; message: string }
  | { error: "VALIDATION_ERROR"; message: string }
  | { error: "INTERNAL_ERROR"; message: string };

/**
 * Type guard to check if a value is an ActionError
 */
export function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error: unknown }).error === "string" &&
    [
      "AUTH_EXPIRED",
      "FORBIDDEN",
      "VALIDATION_ERROR",
      "INTERNAL_ERROR",
    ].includes((value as { error: string }).error)
  );
}

/**
 * Generic type for action responses
 * Either returns the expected data or an error
 */
export type ActionResponse<T> = T | ActionError;
