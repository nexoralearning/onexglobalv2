import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // Warn instead of hard-throwing so the serverless function can still boot.
  // Actual queries will fail with a clear "DATABASE_URL must be set" error.
  console.warn(
    "[db] WARNING: DATABASE_URL is not set. Database queries will fail. " +
    "Set DATABASE_URL in your environment (Vercel project settings, etc.)."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://placeholder",
});
export const db = drizzle(pool, { schema });

export * from "./schema";
