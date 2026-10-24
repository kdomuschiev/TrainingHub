import { afterAll, describe, expect, it, vi } from "vitest";
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

describe("createDb", () => {
  it("reports an idle connection the server drops instead of crashing", async () => {
    const onPoolError = vi.fn();
    const db = createDb(process.env.DATABASE_URL!, { onPoolError });
    const killer = createDb(process.env.DATABASE_URL!);
    try {
      const client = await db.$client.connect();
      const { rows } = await client.query<{ pid: number }>("select pg_backend_pid() as pid");
      client.release();

      await killer.$client.query("select pg_terminate_backend($1)", [rows[0].pid]);

      await vi.waitFor(() => expect(onPoolError).toHaveBeenCalledOnce());
    } finally {
      await db.$client.end();
      await killer.$client.end();
    }
  });
});
