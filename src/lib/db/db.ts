import { env } from "@/app/lib/env";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(env.DATABASE_URL);
