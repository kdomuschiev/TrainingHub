import { defineConfig, devices } from "@playwright/test";
import { BYPASS_STATE } from "./e2e/global-setup";

// CI sets BASE_URL to the Vercel preview; locally we build and serve the app.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

// Vercel previews sit behind Deployment Protection; CI passes the bypass
// secret, and the global setup trades it for a preview-only cookie.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET && process.env.BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // Traces record request cookies, and CI uploads the report as a public
    // artifact: no traces while the bypass cookie is in use.
    trace: bypass ? "off" : "on-first-retry",
    screenshot: "only-on-failure",
    storageState: bypass ? BYPASS_STATE : undefined,
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
