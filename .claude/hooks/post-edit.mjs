// PostToolUse (Edit|Write): lint the changed file and run the unit tests
// related to it. Failures go back to Claude as feedback (exit 2); the edit
// itself stands, since a failing test is expected in a red step.
import { spawn } from "node:child_process";
import { relative } from "node:path";

const input = JSON.parse(await new Response(process.stdin).text());
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const file = relative(root, input.tool_input?.file_path ?? "");

const isSource = /\.(?:[cm]?[jt]sx?)$/.test(file);
const isOutside = file.startsWith("..") || /^(?:node_modules|\.next)\//.test(file);
if (!isSource || isOutside) process.exit(0);

// Both run at once so together they stay inside the hook's 180 s timeout.
const run = (args) =>
  new Promise((resolve) => {
    const child = spawn("npx", args, { cwd: root, timeout: 120_000 });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", (error) => (output += error.message));
    child.on("close", (status, signal) =>
      resolve({ status, output: signal ? `${output}\nStopped by ${signal} after 120 s.` : output }),
    );
  });
const results = await Promise.all([
  run(["eslint", "--max-warnings=0", "--no-warn-ignored", file]),
  run(["vitest", "related", "--run", "--project", "unit", "--passWithNoTests", file]),
]);
const failures = [
  ["ESLint", results[0]],
  ["Related unit tests", results[1]],
].filter(([, result]) => result.status !== 0);

if (failures.length > 0) {
  for (const [name, result] of failures) {
    console.error(`${name} failed for ${file}:\n${result.output}`.trim());
  }
  process.exit(2);
}
