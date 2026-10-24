import { describe, expect, it } from "vitest";
import { checkTestMarkers } from "../.githooks/checks.mjs";

// Markers are assembled from pieces so this file passes its own hook.
const marker = (...parts: string[]) => parts.join("");

function staged(path: string, addedLines: string[], extra = {}) {
  return { path, status: "M", before: "", after: "", addedLines, ...extra };
}

describe("checkTestMarkers", () => {
  it.each([
    marker("it", ".skip"),
    marker("test", ".only"),
    marker("describe", ".skip"),
    marker("it", ".todo"),
    marker("x", "it"),
    marker("f", "describe"),
  ])("rejects %s added to a test file", (fn) => {
    const line = `${fn}("parses laps", () => {});`;
    const violations = checkTestMarkers([staged("src/lib/fit.test.ts", [line])]);
    expect(violations).toEqual([expect.stringContaining("src/lib/fit.test.ts")]);
  });

  it("accepts plain tests and markers outside test files", () => {
    expect(
      checkTestMarkers([
        staged("src/lib/fit.test.ts", ['it("parses laps", () => {});']),
        staged("src/lib/list.ts", [`export const rest = ${marker("list", ".skip")}(2);`]),
      ]),
    ).toEqual([]);
  });
});
