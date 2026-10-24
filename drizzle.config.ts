import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit reads no env files; Next.js reads .env.local, so load it here too.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// Migrations need a direct (unpooled) connection on Neon.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
