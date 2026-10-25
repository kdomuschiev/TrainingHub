# AGENTS.md

## Project

TrainingHub: single-user, mobile-first PWA with a team of AI
coaches. Next.js + TypeScript, Neon Postgres, Vercel.

- Product and scope: `PRODUCT.md`. Current spec: `specs/`.
- Decisions: `docs/decisions.md`. Do not reopen a decided question
  without new information; if you have it, ask the owner.
- Progress: one progress file per spec, `tasks/<nnn>-<name>.md`,
  named like the spec; the current one has the branch's spec
  number. Read it first when resuming; keep it updated with status
  and evidence for every "done". Leave merged specs' files as they are.

## Commands

- `npm run dev` — dev server
- `npm run lint` · `npm run typecheck`
- `npm test` — unit (Vitest)
- `npm run test:integration` — Vitest + Postgres;
  run `docker compose up -d` first
- `npm run test:e2e` — Playwright, iPhone viewport

Before every commit: lint, typecheck and unit tests pass, except
the one new failing test in a `test:` commit.

## Next.js 16

Next.js 16 has breaking changes from earlier versions. Before
writing or changing Next.js code (routing, data fetching,
caching, middleware, config), read the relevant guide in
`node_modules/next/dist/docs/`. Do not rely on conventions
from training data.

## Language

- UI copy and everything the coaches say: Bulgarian only.
- No i18n: hard-code Bulgarian strings; no translation
  library, no message files.
- Everything else in English: code, comments, identifiers,
  commits, PRs, specs, docs. Tests assert on the Bulgarian
  UI text exactly as shown.

## TDD

All logic is built test-first, and git history must prove it.
For each behavior:

1. `test(Tn): …` — the new test, failing for the right
   reason: an assertion, not an import or type error. Add a
   minimal stub (correct signature, wrong result) if needed.
2. `feat(Tn): …` or `fix(Tn): …` — the minimal code that makes
   it pass. This commit does not touch the test.

Exceptions (no red commit): scaffolding and configuration,
purely visual UI, prompts (they have evals).

Never skip, delete or weaken a test to get to green. Tests and
CI never call the real Claude API; use recorded responses.

## Git

- Branch: `<type>/s<spec>-<description>`, e.g.
  `feat/s003-run-ingest`. Never commit to `main`.
  Types: `feat` (new behavior), `fix` (bug fix),
  `chore` (config, tooling, dependencies), `docs`,
  `learn` (retrospective rules, `[LEARN]` PR),
  `hotfix` (urgent production fix, `[HOTFIX]` PR; may
  omit `s<spec>-`).
- Commit: Conventional Commits with the task ID, e.g.
  `test(T3): reject zip with path traversal`.
- PR title: `[S<spec>] <imperative description>`. Non-spec PRs:
  `[LEARN]`, `[HOTFIX]`, `[CHORE]`.
- PR body: spec link, risk tier (from `REVIEW.md`), the spec's
  "Done means" checklist with evidence, observer findings.
- One PR per spec. If a spec turns out too large, propose a split
  by tasks and ask.
- Never squash, rebase or amend pushed commits: it destroys the
  red/green evidence.

## Autonomy

Keep going while the next step doesn't need the owner. When
blocked, leave a status note with the next action in the progress file.
When the owner must act in an external service (dashboard,
account, settings), read its current docs first, then give
numbered steps with the exact menu path, every name and value
to enter, and what they will see when it worked.

Do without asking:
- Read and write code, run tests/lint/build inside the repo.
- Commit to a feature branch, push it, open a PR.
- Run AI review on the PR and fix findings before calling the owner.
- Write DB migrations; apply them to local and preview databases.
- Low-tier PR (per `REVIEW.md`) green: enable auto-merge.
- After `gh pr view` shows your PR merged:
  `git switch main && git pull --prune`.

Ask first:
- Adding or upgrading a dependency.
- Editing a test that already passes.
- Applying a migration to production.
- Anything outward-facing (creating repos, accounts, integrations).

Never without an explicit yes: force-push, touching files
outside the repo, anything involving secrets.

Never: push to `main`, deploy manually, merge a medium/high PR,
delete a branch (GitHub deletes merged branches).

## Reports

End every report to the owner with:

**Needs your decision** — numbered Q1, Q2…, each with a
recommended answer · **FYI** · **Progress** — % of the spec's
tasks done, plus any "Done means" items still open ·
**New session:** yes/no — reason

New session is yes when: the spec is finished (implementation
always starts fresh), the same task failed twice or the owner
corrected the same thing twice, context is above ~60%, or the
next task doesn't need the current context.

## Agent instruction files

`AGENTS.md`, `CLAUDE.md`, `REVIEW.md` and everything in
`.claude/` (skills, agents, hooks, settings) change only after
an interview with the owner: propose the full wording in one
message, numbered by block; the owner approves it line by
line. Retrospectives propose such changes; they never apply
them. PRs touching these files are at least medium tier and
never auto-merge.
