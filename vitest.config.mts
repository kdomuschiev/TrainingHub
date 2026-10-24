import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    setupFiles: ["./test/setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts", "test/**/*.test.ts"],
          exclude: ["**/*.int.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["src/**/*.int.test.ts", "test/**/*.int.test.ts"],
          // CI points this at the PR's Neon branch; locally, docker compose.
          env: {
            DATABASE_URL:
              process.env.DATABASE_URL ??
              "postgresql://traininghub:traininghub@localhost:5433/traininghub_test",
          },
        },
      },
    ],
  },
});
