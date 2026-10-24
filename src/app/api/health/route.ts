import { connection } from "next/server";
import { pingDatabase } from "@/db";
import { checkHealth } from "@/lib/health";

export async function GET() {
  // Run per request, never at build time: the point is a live DB check.
  await connection();
  const health = await checkHealth(
    () => pingDatabase(),
    (message) => console.error("Health check failed:", message),
  );
  return Response.json(health, {
    status: health.status === "ok" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
