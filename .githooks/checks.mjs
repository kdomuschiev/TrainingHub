// Pure checks behind the pre-commit hook. Each takes the staged files and
// returns one message per violation; an empty array means the commit may pass.
//
// A staged file: { path, status: "A" | "M" | "D" | "R", oldPath?,
//   before: string | null, after: string | null, addedLines: string[] }

const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$/;
const MARKER = /\b(?:(?:it|test|describe)\.(?:skip|only|todo)|x(?:it|test|describe)|f(?:it|describe))\b/;
// The bracketed letters keep this file from matching its own check.
const TODO_MARKER = /\b(?:T[O]DO|F[I]XME|H[A]CK)\b(?:\(S(\d{3})\):\s*\S)?/g;
const EXAMPLE_TODO = "T" + "ODO(S003): <what>";

/** Rejects `.skip`, `.only`, `.todo`, `xit` and friends added to a test. */
export function checkTestMarkers(files) {
  return files
    .filter((file) => TEST_FILE.test(file.path))
    .flatMap((file) =>
      file.addedLines
        .filter((line) => MARKER.test(line))
        .map((line) => `${file.path}: skipped or focused test: ${line.trim()}`),
    );
}

/** Rejects a deleted test file, or a test file with fewer tests than before. */
export function checkTestCount(files) {
  return files
    .filter((file) => TEST_FILE.test(file.path) && file.before !== null)
    .flatMap((file) => {
      if (file.status === "D") return [`${file.path}: test file deleted`];
      const before = countTests(file.before);
      const after = countTests(file.after ?? "");
      return after < before ? [`${file.path}: ${before} tests before, ${after} now`] : [];
    });
}

function countTests(source) {
  return source.match(/\b(?:it|test)(?:\.\w+)*\s*\(/g)?.length ?? 0;
}

/** Rejects added to-do, fix-me and hack markers that do not name a known spec. */
export function checkTodos(files, specNumbers) {
  return files
    .filter((file) => !file.path.endsWith(".md"))
    .flatMap((file) =>
      file.addedLines
        .filter((line) =>
          [...line.matchAll(TODO_MARKER)].some(([, spec]) => !specNumbers.has(spec)),
        )
        .map((line) => `${file.path}: write it as ${EXAMPLE_TODO}: ${line.trim()}`),
    );
}

