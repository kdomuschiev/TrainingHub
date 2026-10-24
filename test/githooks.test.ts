import { describe, expect, it } from "vitest";
import {
  checkGithub,
  checkTestCount,
  checkTestMarkers,
  checkTodos,
  specTiers,
} from "../.githooks/checks.mjs";

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

describe("checkTodos", () => {
  const specs = new Set(["000", "003"]);
  const todo = marker("TO", "DO");

  it.each([
    `// ${todo} parse laps`,
    `// ${todo}: later`,
    `// ${todo}(kiril): parse laps`,
    `// ${todo}(S009): parse laps`,
    `// ${todo}(S003):`,
    `// ${marker("FIX", "ME")} parse laps`,
    `// ${marker("HA", "CK")} parse laps`,
  ])("rejects %s", (line) => {
    expect(checkTodos([staged("src/lib/fit.ts", [line])], specs)).toEqual([
      expect.stringContaining("src/lib/fit.ts"),
    ]);
  });

  it("accepts a reference to a known spec, Markdown files and existing lines", () => {
    expect(
      checkTodos(
        [
          staged("src/lib/fit.ts", [`// ${todo}(S003): parse lap records`]),
          staged("TASKS.md", [`- ${todo} write the retrospective`]),
          staged("src/lib/laps.ts", ["export const laps = [];"], { before: `// ${todo} old` }),
        ],
        specs,
      ),
    ).toEqual([]);
  });
});

describe("specTiers", () => {
  const productMd = [
    "| # | Spec | Risk tier |",
    "|---|---|---|",
    "| 000 | `foundation`: repo | high |",
    "| 001 | `design-system`: app map | medium |",
    "| 003 | `run-ingest`: upload endpoint | high |",
  ].join("\n");

  it("reads tiers from PRODUCT.md and lets a spec file override them", () => {
    const specFiles = [
      { name: "001-design-system.md", content: "| Risk tier | **Low** (docs only) |" },
    ];
    expect(specTiers(specFiles, productMd)).toEqual(
      new Map([
        ["000", "high"],
        ["001", "low"],
        ["003", "high"],
      ]),
    );
  });
});

describe("checkGithub", () => {
  const tiers = new Map([
    ["000", "high"],
    ["001", "medium"],
  ]);
  const workflow = staged(".github/workflows/ci.yml", ["on: push"]);

  it.each(["feat/s001-design-system", "hotfix/broken-deploy", "main"])(
    "rejects a .github change on %s",
    (branch) => {
      expect(checkGithub([workflow], branch, tiers)).toEqual([
        expect.stringContaining(".github/workflows/ci.yml"),
      ]);
    },
  );

  it("rejects moving a file out of .github on a medium branch", () => {
    const moved = staged("docs/ci.yml", [], { status: "R", oldPath: ".github/workflows/ci.yml" });
    expect(checkGithub([moved], "feat/s001-design-system", tiers)).toHaveLength(1);
  });

  it("accepts a .github change on a high-tier spec branch and other paths anywhere", () => {
    expect(checkGithub([workflow], "feat/s000-foundation", tiers)).toEqual([]);
    expect(checkGithub([staged("src/lib/fit.ts", [])], "feat/s001-design-system", tiers)).toEqual([]);
  });
});
