import { describe, expect, it } from "vitest";

describe("test environment", () => {
  it("has no Anthropic API key", () => {
    expect(process.env.ANTHROPIC_API_KEY).toBeUndefined();
  });

  it("rejects requests to the Claude API", async () => {
    await expect(
      fetch("https://api.anthropic.com/v1/messages", { method: "POST" }),
    ).rejects.toThrow("Tests must not call the real Claude API");
  });
});
