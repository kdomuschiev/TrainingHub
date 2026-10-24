// Pure checks behind the pre-commit hook. Each takes the staged files and
// returns one message per violation; an empty array means the commit may pass.
//
// A staged file: { path, status: "A" | "M" | "D" | "R", oldPath?,
//   before: string | null, after: string | null, addedLines: string[] }

const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$/;
const MARKER = /\b(?:(?:it|test|describe)\.(?:skip|only|todo)\b|(?:xit|xtest|xdescribe|fit|fdescribe)\s*\()/;
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


/**
 * Maps spec numbers to their risk tier ("high" | "medium" | "low"). A spec
 * file's "Risk tier" row wins over the spec table in PRODUCT.md.
 */
export function specTiers(specFiles, productMd) {
  const tiers = new Map();
  for (const [, spec, tier] of productMd.matchAll(/^\|\s*(\d{3})\s*\|.*\|\s*(high|medium|low)\s*\|\s*$/gim)) {
    tiers.set(spec, tier.toLowerCase());
  }
  for (const { name, content } of specFiles) {
    const spec = name.match(/^(\d{3})-/)?.[1];
    const tier = content.match(/^\|\s*Risk tier\s*\|\s*\**(high|medium|low)\b/im)?.[1];
    if (spec && tier) tiers.set(spec, tier.toLowerCase());
  }
  return tiers;
}

/** Rejects changes under `.github/` unless the branch's spec is high tier. */
export function checkGithub(files, branch, tiers) {
  const spec = branch.match(/^[a-z]+\/s(\d{3})-/)?.[1];
  if (spec && tiers.get(spec) === "high") return [];
  return files
    .filter((file) => [file.path, file.oldPath].some((path) => path?.startsWith(".github/")))
    .map((file) => `${file.path}: .github/ changes only in high-tier specs (branch ${branch})`);
}

/** The lines a one-file `git diff -U0` adds; headers before the first hunk are skipped. */
export function addedLinesFromDiff(diff) {
  return [];
}
