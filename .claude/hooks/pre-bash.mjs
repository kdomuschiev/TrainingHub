// PreToolUse (Bash): keep the git pre-commit hook switched on. Blocks
// `--no-verify`, its short form `git commit -n`, and changes to core.hooksPath.
const input = JSON.parse(await new Response(process.stdin).text());
const command = input.tool_input?.command ?? "";

const rules = [
  [/--no-verify\b/, "--no-verify skips the git hooks"],
  [/\bgit\s+commit\b[^;&|]*\s-[a-zA-Z]*n[a-zA-Z]*(?=\s|$)/, "git commit -n skips the git hooks"],
  [/core\.hooksPath/, "core.hooksPath is set by `npm install` only"],
];

const broken = rules.filter(([pattern]) => pattern.test(command));
if (broken.length > 0) {
  console.error(
    `Blocked: ${broken.map(([, reason]) => reason).join("; ")}. ` +
      "Fix what the hook rejects; if the hook seems wrong, ask the owner.",
  );
  process.exit(2);
}
