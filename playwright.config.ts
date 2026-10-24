import { defineConfig, devices } from "@playwright/test";

// CI sets BASE_URL to the Vercel preview; locally we build and serve the app.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

// Vercel previews sit behind Deployment Protection; CI passes the bypass secret.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    extraHTTPHeaders: bypass
      ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true" }
      : undefined,
  },
  projects: [{ name: "iphone", use: { ...devices["iPhone 16"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          DATABASE_URL:
            process.env.DATABASE_URL ??
            "postgresql://traininghub:traininghub@localhost:5433/traininghub_test",
        },
      },
});
