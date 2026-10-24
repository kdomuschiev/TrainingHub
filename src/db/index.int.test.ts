import { afterAll, describe, expect, it } from "vitest";
import { createDb, pingDatabase } from "./index";

describe("pingDatabase", () => {
  const reachable = createDb(process.env.DATABASE_URL!);
  // Nothing listens on port 1, so the connection is refused.
  const unreachable = createDb("postgresql://nobody:nothing@127.0.0.1:1/none");

  afterAll(async () => {
    await reachable.$client.end();
    await unreachable.$client.end();
  });

  it("resolves when Postgres answers", async () => {
    await expect(pingDatabase(reachable)).resolves.toBeUndefined();
  });

  it("rejects when Postgres cannot be reached", async () => {
    await expect(pingDatabase(unreachable)).rejects.toThrow();
  });
});
