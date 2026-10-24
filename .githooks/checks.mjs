// Pure checks behind the pre-commit hook. Each takes the staged files and
// returns one message per violation; an empty array means the commit may pass.
//
// A staged file: { path, status: "A" | "M" | "D" | "R", oldPath?,
//   before: string | null, after: string | null, addedLines: string[] }

const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$/;
const MARKER = /\b(?:(?:it|test|describe)\.(?:skip|only|todo)|x(?:it|test|describe)|f(?:it|describe))\b/;

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
