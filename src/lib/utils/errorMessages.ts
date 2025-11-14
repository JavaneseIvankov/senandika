/**
 * Error message utilities for user-friendly error handling
 * Maps internal error codes/messages to user-friendly Indonesian messages
 */

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = "UNAUTHORIZED",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Session errors
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  SESSION_FORBIDDEN = "SESSION_FORBIDDEN",
  SESSION_ALREADY_ENDED = "SESSION_ALREADY_ENDED",
  NO_ACTIVE_SESSION = "NO_ACTIVE_SESSION",

  // Message errors
  MESSAGE_SEND_FAILED = "MESSAGE_SEND_FAILED",
  MESSAGE_EMPTY = "MESSAGE_EMPTY",

  // AI/Generation errors
  AI_GENERATION_FAILED = "AI_GENERATION_FAILED",
  AI_TIMEOUT = "AI_TIMEOUT",
  AI_OVERLOADED = "AI_OVERLOADED",

  // Database errors
  DATABASE_ERROR = "DATABASE_ERROR",

  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",

  // Generic
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
}

/**
 * User-friendly error messages in Indonesian
 */
const USER_FRIENDLY_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: "Sesi Anda telah berakhir. Silakan login kembali.",
  [ErrorCode.SESSION_EXPIRED]:
    "Sesi Anda telah berakhir. Silakan login kembali.",

  [ErrorCode.SESSION_NOT_FOUND]:
    "Sesi percakapan tidak ditemukan. Mulai percakapan baru?",
  [ErrorCode.SESSION_FORBIDDEN]:
    "Anda tidak memiliki akses ke sesi ini. Mulai percakapan baru?",
  [ErrorCode.SESSION_ALREADY_ENDED]: "Sesi ini sudah berakhir.",
  [ErrorCode.NO_ACTIVE_SESSION]:
    "Tidak ada sesi aktif. Silakan mulai percakapan terlebih dahulu.",

  [ErrorCode.MESSAGE_SEND_FAILED]: "Gagal mengirim pesan. Silakan coba lagi.",
  [ErrorCode.MESSAGE_EMPTY]: "Pesan tidak boleh kosong.",

  [ErrorCode.AI_GENERATION_FAILED]:
    "Gagal menghasilkan respons. Silakan coba lagi dalam beberapa saat.",
  [ErrorCode.AI_TIMEOUT]:
    "Respons memakan waktu terlalu lama. Silakan coba lagi.",
  [ErrorCode.AI_OVERLOADED]: "Server sedang sibuk. Silakan coba lagi nanti.",
  [ErrorCode.DATABASE_ERROR]:
    "Terjadi masalah saat menyimpan data. Silakan coba lagi.",

  [ErrorCode.NETWORK_ERROR]:
    "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.",

  [ErrorCode.UNKNOWN_ERROR]:
    "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
};

/**
 * Convert internal error to user-friendly message
 */
export function getUserFriendlyError(error: unknown): string {
  // Handle AppError with error code
  if (isAppError(error)) {
    return (
      USER_FRIENDLY_MESSAGES[error.code] || USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR
    );
  }

  // Handle Error objects
  if (error instanceof Error) {
    return parseErrorMessage(error.message);
  }

  // Handle string errors
  if (typeof error === "string") {
    return parseErrorMessage(error);
  }

  // Default fallback
  return USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Parse error message and map to user-friendly message
 */
function parseErrorMessage(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Session errors
  if (
    lowerMessage.includes("forbidden") ||
    lowerMessage.includes("not belong")
  ) {
    return USER_FRIENDLY_MESSAGES.SESSION_FORBIDDEN;
  }
  if (lowerMessage.includes("session not found")) {
    return USER_FRIENDLY_MESSAGES.SESSION_NOT_FOUND;
  }
  if (lowerMessage.includes("no active session")) {
    return USER_FRIENDLY_MESSAGES.NO_ACTIVE_SESSION;
  }
  if (lowerMessage.includes("session already ended")) {
    return USER_FRIENDLY_MESSAGES.SESSION_ALREADY_ENDED;
  }

  // Auth errors
  if (
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("not authenticated") ||
    lowerMessage.includes("session expired")
  ) {
    return USER_FRIENDLY_MESSAGES.UNAUTHORIZED;
  }

  // Network errors
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("fetch failed") ||
    lowerMessage.includes("connection")
  ) {
    return USER_FRIENDLY_MESSAGES.NETWORK_ERROR;
  }

  // AI errors
  if (
    lowerMessage.includes("ai") ||
    lowerMessage.includes("generation") ||
    lowerMessage.includes("model")
  ) {
    if (lowerMessage.includes("overloaded")) {
      return USER_FRIENDLY_MESSAGES.AI_TIMEOUT;
    }
    return USER_FRIENDLY_MESSAGES.AI_GENERATION_FAILED;
  }
  if (lowerMessage.includes("timeout") || lowerMessage.includes("timed out")) {
    return USER_FRIENDLY_MESSAGES.AI_TIMEOUT;
  }

  // Database errors
  if (
    lowerMessage.includes("database") ||
    lowerMessage.includes("db") ||
    lowerMessage.includes("sql")
  ) {
    return USER_FRIENDLY_MESSAGES.DATABASE_ERROR;
  }

  // Default fallback
  return USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Type guard for AppError
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as AppError).code === "string"
  );
}

/**
 * Create structured AppError
 */
export function createAppError(code: ErrorCode, details?: string): AppError {
  return {
    code,
    message: USER_FRIENDLY_MESSAGES[code],
    details,
  };
}

/**
 * Log error details for debugging (server-side only)
 */
export function logErrorDetails(error: unknown, context?: string): void {
  if (typeof window === "undefined") {
    // Server-side only
    console.error(`[Error${context ? ` - ${context}` : ""}]:`, error);

    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
  }
}
