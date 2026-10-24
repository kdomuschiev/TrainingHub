// PreToolUse (Bash): keep the git pre-commit hook switched on.
import { bypassReasons } from "./bypass.mjs";

const input = JSON.parse(await new Response(process.stdin).text());
const reasons = bypassReasons(input.tool_input?.command ?? "");

if (reasons.length > 0) {
  console.error(
    `Blocked: ${reasons.join("; ")}. ` +
      "Fix what the hook rejects; if the hook seems wrong, ask the owner.",
  );
  process.exit(2);
}
