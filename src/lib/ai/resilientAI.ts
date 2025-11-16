import "server-only";
import { generateText, generateObject } from "ai";
import { gemini } from "@/lib/ai";
import type { z } from "zod";

/**
 * Resilient AI Provider
 *
 * Problem: Gemini 2.5 Flash is faster and better, but prone to 503 overload errors
 * Solution: Try 2.5 Flash first, automatically fallback to 2.0 Flash on overload
 *
 * Features:
 * - Automatic fallback on 503 errors
 * - Centralized model configuration
 * - Detailed logging for monitoring
 * - Type-safe wrappers for generateText and generateObject
 */

// =====================================
// 🎯 Configuration
// =====================================

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";

// Error codes that trigger fallback
const OVERLOAD_ERROR_CODES = [503, 429]; // 503 = Service Unavailable, 429 = Too Many Requests
const OVERLOAD_ERROR_MESSAGES = [
  "overload",
  "overloaded",
  "quota",
  "rate limit",
  "too many requests",
];

/**
 * Check if error is due to model overload
 */
function isOverloadError(error: unknown): boolean {
  if (!error) return false;

  const errorObj = error as Record<string, unknown>;

  // Check status code
  if (
    typeof errorObj.status === "number" &&
    OVERLOAD_ERROR_CODES.includes(errorObj.status)
  ) {
    return true;
  }

  // Check error message
  const errorMessage =
    typeof errorObj.message === "string" ? errorObj.message.toLowerCase() : "";
  return OVERLOAD_ERROR_MESSAGES.some((msg) => errorMessage.includes(msg));
}

// =====================================
// 📝 generateText with Fallback
// =====================================

export interface ResilientGenerateTextOptions {
  system?: string;
  prompt: string;
  temperature?: number;
}

/**
 * Generate text with automatic fallback from 2.5 Flash to 2.0 Flash
 *
 * @param options - Generation options
 * @returns GenerateTextResult
 */
export async function resilientGenerateText(
  options: ResilientGenerateTextOptions,
) {
  const { system, prompt, temperature = 0.7 } = options;

  try {
    console.log(`🤖 Attempting with ${PRIMARY_MODEL}`);

    const result = await generateText({
      model: gemini(PRIMARY_MODEL),
      system,
      prompt,
      temperature,
    });

    console.log(`✅ Success with ${PRIMARY_MODEL}`);
    return result;
  } catch (error) {
    // Check if it's an overload error
    if (isOverloadError(error)) {
      console.warn(
        `⚠️ ${PRIMARY_MODEL} overloaded, falling back to ${FALLBACK_MODEL}`,
      );
      console.warn("Error details:", error);

      try {
        const result = await generateText({
          model: gemini(FALLBACK_MODEL),
          system,
          prompt,
          temperature,
        });

        console.log(`✅ Success with ${FALLBACK_MODEL} (fallback)`);
        return result;
      } catch (fallbackError) {
        console.error(`❌ ${FALLBACK_MODEL} also failed:`, fallbackError);
        throw fallbackError;
      }
    }

    // If it's not an overload error, throw immediately
    console.error(`❌ ${PRIMARY_MODEL} failed with non-overload error:`, error);
    throw error;
  }
}

// =====================================
// 🎯 generateObject with Fallback
// =====================================

export interface ResilientGenerateObjectOptions<SCHEMA extends z.ZodTypeAny> {
  schema: SCHEMA;
  system?: string;
  prompt: string;
  temperature?: number;
}

/**
 * Generate structured object with automatic fallback from 2.5 Flash to 2.0 Flash
 *
 * @param options - Generation options with Zod schema
 * @returns GenerateObjectResult with typed object
 */
export async function resilientGenerateObject<SCHEMA extends z.ZodTypeAny>(
  options: ResilientGenerateObjectOptions<SCHEMA>,
) {
  const { schema, system, prompt, temperature = 0.7 } = options;

  try {
    console.log(`🤖 Attempting generateObject with ${PRIMARY_MODEL}`);

    const result = await generateObject({
      model: gemini(PRIMARY_MODEL),
      schema,
      system,
      prompt,
      temperature,
    });

    console.log(`✅ Success with ${PRIMARY_MODEL}`);
    return result;
  } catch (error) {
    // Check if it's an overload error
    if (isOverloadError(error)) {
      console.warn(
        `⚠️ ${PRIMARY_MODEL} overloaded, falling back to ${FALLBACK_MODEL}`,
      );
      console.warn("Error details:", error);

      try {
        const result = await generateObject({
          model: gemini(FALLBACK_MODEL),
          schema,
          system,
          prompt,
          temperature,
        });

        console.log(`✅ Success with ${FALLBACK_MODEL} (fallback)`);
        return result;
      } catch (fallbackError) {
        console.error(`❌ ${FALLBACK_MODEL} also failed:`, fallbackError);
        throw fallbackError;
      }
    }

    // If it's not an overload error, throw immediately
    console.error(`❌ ${PRIMARY_MODEL} failed with non-overload error:`, error);
    throw error;
  }
}

// =====================================
// 📊 Statistics & Monitoring
// =====================================

interface FallbackStats {
  totalRequests: number;
  primarySuccesses: number;
  fallbackSuccesses: number;
  totalFailures: number;
}

// In-memory stats (resets on server restart)
const stats: FallbackStats = {
  totalRequests: 0,
  primarySuccesses: 0,
  fallbackSuccesses: 0,
  totalFailures: 0,
};

/**
 * Get fallback statistics
 * Useful for monitoring and alerting
 */
export function getFallbackStats(): FallbackStats {
  return { ...stats };
}

/**
 * Reset fallback statistics
 */
export function resetFallbackStats(): void {
  stats.totalRequests = 0;
  stats.primarySuccesses = 0;
  stats.fallbackSuccesses = 0;
  stats.totalFailures = 0;
}

// =====================================
// 🎨 Helper Functions
// =====================================

/**
 * Get current primary and fallback model names
 * Useful for debugging and monitoring
 */
export function getModelConfig() {
  return {
    primary: PRIMARY_MODEL,
    fallback: FALLBACK_MODEL,
  };
}

/**
 * Test if a specific model is available
 * Can be used for health checks
 */
export async function testModelAvailability(
  modelName: "gemini-2.5-flash" | "gemini-2.0-flash" = "gemini-2.5-flash",
): Promise<{ available: boolean; latency?: number; error?: string }> {
  const startTime = Date.now();

  try {
    await generateText({
      model: gemini(modelName),
      prompt: "Test",
    });

    const latency = Date.now() - startTime;

    return {
      available: true,
      latency,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
