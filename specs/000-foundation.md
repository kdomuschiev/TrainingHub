# Spec 000 — Foundation

| | |
|---|---|
| Risk tier | **High** (CI, branch protection, agent instruction files) |
| Model / effort | Opus 5.5, `medium`; advisor Opus 5.5 at decisions |
| Mockup | None (no UI) |
| Read first | `PRODUCT.md`, `docs/decisions.md` |

## Goal

Stand up an empty but production-shaped TrainingHub: the repo, the toolchain, the deploy pipeline, the tests, and the agent workflow (context files, hooks, review subagents, `/spec` skill). After this spec, every later spec starts with `/spec <n>` and ends in a reviewed PR that deploys on merge.

## Done means

1. `AGENTS.md` and `CLAUDE.md` exist, were written with the owner through an interview (T1), and are committed. `CLAUDE.md` starts with `@AGENTS.md`.
2. A private GitHub repo `TrainingHub` exists. `main` is protected: PR required, required status checks, force-push blocked, merge commits only (squash and rebase disabled), auto-merge allowed. Verified with `gh api` output pasted in the PR.
3. `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:integration` and `npm run test:e2e` pass locally and in CI.
4. Vercel serves the production URL over HTTPS with a placeholder page in Bulgarian. `GET /api/health` returns `200` and reports the database as reachable.
5. Every PR gets a Vercel preview deploy and its own Neon database branch. CI runs E2E against the preview.
6. Hooks are active. Demonstrated: a commit that adds `.skip`/`.only` to a test, or deletes a test, is rejected.
7. The task-review and observer subagents exist and have run on at least one task in this spec.
8. `/spec` and `/learn` exist. The progress file `tasks/000-foundation.md`, `LEARNINGS.md` and `REVIEW.md` exist.
9. PR `[S000] Set up project foundation` is open with all review layers done. The owner merges it.

## Tasks

Keep the progress file `tasks/000-foundation.md` updated from the start: status per task, evidence for every "done" (command output, commit hash, link).

**T1 — Interview: `AGENTS.md` and `CLAUDE.md`.**
Interview the owner one question at a time. Propose each line; the owner approves, edits or cuts it. Test every line: "Would removing it cause a mistake? If not, cut it." Nothing else in this spec starts before both files are approved and committed. Candidates come from `docs/decisions.md`:
- Commands (dev, test layers, lint, typecheck).
- Next.js 16 has breaking changes: read `node_modules/next/dist/docs/` before writing Next.js code; do not rely on training-data conventions.
- Language rule (D17).
- Stop rule and autonomy table (D22); report format; "New session" line (D38).
- TDD with red/green commits and its exceptions (D26).
- Git conventions (D31).
- Model/effort rules; no "think hard" lines (D23).
- Agent-instruction files change only through an owner interview (D37).
- Claude-specific (CLAUDE.md only): subagents, advisor, hooks.

**T2 — Git and GitHub.**
`git init`, `.gitignore`, first commit. Ask before creating the GitHub repo (outward-facing). Create it private with `gh`, configure branch protection and merge settings (Done means #2).

**T3 — Next.js scaffold.**
Next.js 16, TypeScript strict, ESLint. A single placeholder page in Bulgarian. Scaffolding is exempt from TDD.

**T4 — Test toolchain.**
Vitest for unit and integration, Playwright with an iPhone viewport project, local Postgres via `docker compose` for integration tests. npm scripts for each layer. CI and tests never call the real Claude API (no AI code exists yet; set the rule up anyway).

**T5 — Database.**
Propose an ORM and migration tool with a recommendation and wait for the owner's choice (open question). Neon project in EU (Frankfurt). `GET /api/health` with a DB check, built test-first (red/green commits).

**T6 — Vercel.**
Link the project, set environment variables, preview deploys per PR, production on merge to `main`, Neon branch per PR (Neon's Vercel/GitHub integration). Propose error logging/monitoring and a backup approach within free tiers and wait for the owner's choice (open question).

**T7 — CI (GitHub Actions).**
Lint, typecheck, unit, integration against the PR's Neon branch, E2E against the Vercel preview. These are the required status checks.

**T8 — Interview: hooks, review subagents, `REVIEW.md`, `/learn`.**
Interview the owner (D37), then create:
- Hooks: lint and touched tests on change; reject skipped/deleted tests, TODOs without evidence, `.github/` changes outside high-tier work.
- Task-review subagent (Sonnet 5.5, low) and observer subagent (Sonnet 5.5, low) per D24, D26 and D39. The observer verifies TDD by checking out the red commit and confirming the test fails.
- `REVIEW.md` with the risk-tier path lists (D21).
- `/learn <note>` appending to `LEARNINGS.md` (D28).
Once they exist, run both subagents over the diffs of T3–T7.

**T9 — Interview: `/spec` skill.**
Interview the owner (D37), using `mattpocock-skills:writing-for-agents`. The skill must cover D34 and D36: read context, interview one question at a time with a recommended answer, include a UI section, write the spec using this file's structure, write the mockup with every state, update both files together on feedback, and end by saying a fresh session is needed.

**T10 — PR and review.**
Open the PR, run `/code-review` and `/security-review`, fix findings, list anything unfixed under "Needs your decision". The owner does a second read on the next day before merging (high tier).

## Out of scope

Auth, design system, PWA manifest and icons, any product feature, plugins, issue trackers.

## When to stop and ask

`AGENTS.md` does not exist yet, so this section is the stop rule for this spec:

- Keep going when a step does not need the owner. Put status notes with the next action.
- Stop and ask before: creating the GitHub repo, adding any dependency beyond the scaffold defaults, editing a test that already passes, anything destructive (deleting data, force-pushing, touching files outside the repo), anything involving secrets.
- Stop and ask for: ORM choice (T5), monitoring/backup choice (T6), and every account step only the owner can do (Vercel, Neon, GitHub app installs).
- Never push to `main`, deploy manually, or merge.
- Report as: **Needs your decision** (Q1, Q2…) · **FYI** · progress as % of plan · **New session:** yes/no with the reason.
