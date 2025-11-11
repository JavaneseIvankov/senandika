import { defineConfig } from "drizzle-kit";
import { env } from "@/app/lib/env";

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
