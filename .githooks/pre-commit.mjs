// Reads the staged change from git and runs the checks in checks.mjs.
// Enabled by `npm install` (the `prepare` script sets core.hooksPath).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  checkGithub,
  checkTestCount,
  checkTestMarkers,
  checkTodos,
  specTiers,
} from "./checks.mjs";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const show = (ref) => {
  try {
    return git("show", ref);
  } catch {
    return null;
  }
};

function stagedFiles() {
  const fields = git("diff", "--cached", "--name-status", "-M", "-z").split("\0").filter(Boolean);
  const files = [];
  for (let i = 0; i < fields.length; ) {
    const status = fields[i++][0];
    const oldPath = status === "R" || status === "C" ? fields[i++] : undefined;
    const path = fields[i++];
    files.push({
      path,
      status,
      oldPath,
      before: status === "A" || status === "C" ? null : show(`HEAD:${oldPath ?? path}`),
      after: status === "D" ? null : show(`:${path}`),
      addedLines: [],
    });
  }
  return files;
}

function attachAddedLines(files) {
  const byPath = new Map(files.map((file) => [file.path, file]));
  let current;
  for (const line of git("diff", "--cached", "-U0", "-M", "--no-color").split("\n")) {
    if (line.startsWith("+++ ")) current = byPath.get(line.slice(6));
    else if (line.startsWith("+") && current) current.addedLines.push(line.slice(1));
  }
  return files;
}

const specFiles = existsSync("specs")
  ? readdirSync("specs")
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({ name, content: readFileSync(`specs/${name}`, "utf8") }))
  : [];
const tiers = specTiers(specFiles, existsSync("PRODUCT.md") ? readFileSync("PRODUCT.md", "utf8") : "");
const files = attachAddedLines(stagedFiles());
const branch = git("branch", "--show-current").trim();

const violations = [
  ...checkTestMarkers(files),
  ...checkTestCount(files),
  ...checkTodos(files, new Set(tiers.keys())),
  ...checkGithub(files, branch, tiers),
];

if (violations.length > 0) {
  console.error("pre-commit: commit rejected\n");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error("\nFix the cause. If the rule itself seems wrong, ask the owner.");
  process.exit(1);
}
