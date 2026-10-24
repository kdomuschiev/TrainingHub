import { describe, expect, it } from "vitest";
import { checkHealth } from "./health";

describe("checkHealth", () => {
  it("is ok when the database answers", async () => {
    const health = await checkHealth(async () => undefined);
    expect(health).toEqual({ status: "ok", database: "reachable" });
  });

  it("is an error when the database ping fails", async () => {
    const health = await checkHealth(async () => {
      throw new Error("connection refused");
    });
    expect(health).toEqual({ status: "error", database: "unreachable" });
  });
});
