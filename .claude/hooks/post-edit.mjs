// PostToolUse (Edit|Write): lint the changed file and run the unit tests
// related to it. Failures go back to Claude as feedback (exit 2); the edit
// itself stands, since a failing test is expected in a red step.
import { spawnSync } from "node:child_process";
import { relative } from "node:path";

const input = JSON.parse(await new Response(process.stdin).text());
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const file = relative(root, input.tool_input?.file_path ?? "");

const isSource = /\.(?:[cm]?[jt]sx?)$/.test(file);
const isOutside = file.startsWith("..") || /^(?:node_modules|\.next)\//.test(file);
if (!isSource || isOutside) process.exit(0);

const run = (args) => spawnSync("npx", args, { cwd: root, encoding: "utf8", timeout: 120_000 });
const failures = [
  ["ESLint", run(["eslint", "--max-warnings=0", file])],
  ["Related unit tests", run(["vitest", "related", "--run", "--project", "unit", "--passWithNoTests", file])],
].filter(([, result]) => result.status !== 0);

if (failures.length > 0) {
  for (const [name, result] of failures) {
    console.error(`${name} failed for ${file}:\n${result.stdout}${result.stderr}`.trim());
  }
  process.exit(2);
}
