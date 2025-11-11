import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "./env";

export const gemini = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});
