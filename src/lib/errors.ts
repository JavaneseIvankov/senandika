/**
 * Custom Error Classes
 *
 * These error classes provide semantic meaning to different types of failures
 * and enable proper error handling across server and client boundaries.
 */

/**
 * AuthenticationError
 *
 * Thrown when a user's session is invalid, expired, or missing.
 * This error should be caught in server actions and converted to
 * an error response that the client can handle with toast + redirect.
 *
 * @example
 * ```ts
 * if (!session?.user) {
 *   throw new AuthenticationError("Session expired");
 * }
 * ```
 */
export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}

/**
 * AuthorizationError
 *
 * Thrown when a user is authenticated but doesn't have permission
 * to access a resource or perform an action.
 *
 * @example
 * ```ts
 * if (session.userId !== resourceOwnerId) {
 *   throw new AuthorizationError("You don't have permission to access this resource");
 * }
 * ```
 */
export class AuthorizationError extends Error {
  constructor(message = "You don't have permission to perform this action") {
    super(message);
    this.name = "AuthorizationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
  }
}

/**
 * ValidationError
 *
 * Thrown when user input fails validation.
 *
 * @example
 * ```ts
 * if (!email.includes("@")) {
 *   throw new ValidationError("Invalid email format");
 * }
 * ```
 */
export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Type guard to check if an error is an AuthenticationError
 */
export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Type guard to check if an error is an AuthorizationError
 */
export function isAuthorizationError(
  error: unknown,
): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
