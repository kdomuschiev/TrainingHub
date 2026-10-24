// Shared by server, edge and browser. No DSN (local, tests, CI, previews)
// means Sentry stays off.
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  // Errors only: no tracing, no replays, no personal data (health data app).
  tracesSampleRate: 0,
  sendDefaultPii: false,
};
