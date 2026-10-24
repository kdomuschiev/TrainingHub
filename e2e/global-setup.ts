import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { request } from "@playwright/test";

export const BYPASS_STATE = "playwright/.auth/vercel-bypass.json";

// Trades the Vercel bypass secret for a cookie scoped to the preview domain,
// so the secret is sent once, to the preview only, and never to other sites.
export default async function globalSetup() {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const baseURL = process.env.BASE_URL;
  if (!secret || !baseURL) return;

  const context = await request.newContext({ baseURL });
  const response = await context.get("/", {
    headers: { "x-vercel-protection-bypass": secret, "x-vercel-set-bypass-cookie": "true" },
  });
  if (!response.ok()) {
    throw new Error(`Vercel bypass failed: ${response.status()} from ${baseURL}`);
  }

  await mkdir(dirname(BYPASS_STATE), { recursive: true });
  const state = await context.storageState({ path: BYPASS_STATE });
  await context.dispose();
  if (state.cookies.length === 0) {
    throw new Error("Vercel bypass set no cookie; check the bypass secret");
  }
}
