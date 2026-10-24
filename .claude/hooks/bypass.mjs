// Rules behind pre-bash.mjs. They scan the whole command, quoted text
// included, so a commit message that mentions a blocked flag is rejected
// too; rephrase the message. Stripping quotes would let `"--no-verify"`
// through as a quoted argument.
const rules = [
  // git accepts unique prefixes of long options; --no-ver is ambiguous with --no-verbose.
  [/--no-veri(?:fy?)?\b/, "--no-verify skips the git hooks"],
  [/\bgit\b[^;&|]*?\scommit\b[^;&|]*\s-[a-zA-Z]*n[a-zA-Z]*(?=\s|$)/, "git commit -n skips the git hooks"],
  // git config keys are case-insensitive.
  [/core\.hooksPath/i, "core.hooksPath is set by `npm install` only"],
];

/** Returns why the command would switch off the git hooks; empty if it would not. */
export function bypassReasons(command) {
  return rules.filter(([pattern]) => pattern.test(command)).map(([, reason]) => reason);
}
