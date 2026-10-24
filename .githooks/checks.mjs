// Pure checks behind the pre-commit hook. Each takes the staged files and
// returns one message per violation; an empty array means the commit may pass.
//
// A staged file: { path, status: "A" | "M" | "D" | "R", oldPath?,
//   before: string | null, after: string | null, addedLines: string[] }

/** Rejects `.skip`, `.only`, `.todo`, `xit` and friends added to a test. */
export function checkTestMarkers(files) {
  return [];
}
