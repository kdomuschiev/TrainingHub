import { describe, expect, it } from "vitest";
import { checkTestCount, checkTestMarkers } from "../.githooks/checks.mjs";

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

describe("checkTestCount", () => {
  const twoTests = 'it("a", () => {});\nit("b", () => {});\n';
  const oneTest = 'it("a", () => {});\n';

  it("rejects a deleted test file", () => {
    const deleted = staged("src/lib/fit.test.ts", [], { status: "D", before: twoTests, after: null });
    expect(checkTestCount([deleted])).toEqual([expect.stringContaining("src/lib/fit.test.ts")]);
  });

  it("rejects a test file that lost a test", () => {
    const shrunk = staged("src/lib/fit.test.ts", [], { before: twoTests, after: oneTest });
    expect(checkTestCount([shrunk])).toEqual([expect.stringContaining("src/lib/fit.test.ts")]);
  });

  it("rejects a renamed test file that lost a test", () => {
    const renamed = staged("src/lib/laps.test.ts", [], {
      status: "R",
      oldPath: "src/lib/fit.test.ts",
      before: twoTests,
      after: oneTest,
    });
    expect(checkTestCount([renamed])).toEqual([expect.stringContaining("src/lib/laps.test.ts")]);
  });

  it("accepts new, grown, renamed and non-test files", () => {
    expect(
      checkTestCount([
        staged("src/lib/new.test.ts", [], { status: "A", before: null, after: oneTest }),
        staged("src/lib/fit.test.ts", [], { before: oneTest, after: twoTests }),
        staged("src/lib/b.test.ts", [], { status: "R", oldPath: "src/lib/a.test.ts", before: oneTest, after: oneTest }),
        staged("src/lib/fit.ts", [], { status: "D", before: "export {};", after: null }),
      ]),
    ).toEqual([]);
  });
});
