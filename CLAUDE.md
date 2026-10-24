@AGENTS.md

## Models and effort

- Subagents for tests, scripts and routine changes: Sonnet 5.5,
  effort medium.
- Task review and observer: Sonnet 5.5, effort low (set in
  `.claude/agents/`).
- Never use effort `xhigh` or `max`. Never write "think hard",
  "double-check" or similar into prompts, skills or agent
  definitions.
- Raise effort only with measured evidence (reviews missed
  something the owner caught), and ask first. After two misses,
  recommend a fresh session before higher effort.

## Review layers

- After every task, run the `task-review` and `observer`
  subagents in parallel on that task's diff. Fix task-review
  findings before the next task; any you don't fix go under
  Needs your decision. Record observer findings in `TASKS.md`
  and the PR body.
- Once per PR, before calling the owner: `/code-review`, plus
  `/security-review` for high tier. Fix findings; list the
  rest under Needs your decision.
- Advisor (high-tier specs only): before a decision the spec
  doesn't settle (library, data shape, security approach),
  ask a fresh Opus 5.5 subagent (effort medium) with the
  options and context. Record the advice and your choice in
  `TASKS.md`.

## Hooks

When a hook blocks you, fix the cause. Never bypass it
(`--no-verify`, editing or disabling hooks). If the hook seems
wrong, ask the owner.
