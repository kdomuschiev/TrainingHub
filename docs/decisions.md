# Decision log

Decisions from the initial design interview (2026-10-23/24). Each entry: the decision, then why. A future session must not reopen a decided question without new information; if it has new information, it raises it as a question to the owner.

Q-numbers refer to the interview order. Some questions were revisited; only the final outcome is recorded.

## Product

**D1 — New project, not an existing one.** (Q1)
Exercises the whole workflow from step 01, including writing context files from scratch, with no risk to working code.

**D2 — A real product the owner uses, small in scope.** (Q2)
Real usage produces real bugs and real corrections, which steps 07 (verify) and 08 (learn) need. A throwaway project leaves them theoretical.

**D3 — Domain: training and health; a training log with a team of AI coaches.** (Q3, Q4, Q6)
The owner's actual pain is the manual Garmin → claude.ai coaching loop.

**D4 — Run ingest from `.fit` files; no Garmin API, Strava API, or Connect IQ.** (Q5, revisited several times)
- Garmin Connect Developer Program: business entities only, reportedly paused.
- Unofficial Garmin login libraries: reportedly blocked via TLS fingerprinting; fragile.
- Strava API: no original FIT (streams only, missing running dynamics and Garmin metrics); its API agreement prohibits using API data in AI models, and the June 2026 tightening asks such developers to stop and seek written approval.
- Connect IQ: apps cannot read the recorded FIT file; a custom data field would be a separate Monkey C project with reduced data.

**D5 — v1 has one specialist (running coach) end to end; more specialists are separate later cycles.** (Q7)
A clear finish line for v1, and every new specialist becomes another full spec → PR cycle.

**D6 — Head coach plus specialists; specialists recommend, the head coach owns the single plan.** (Q8 context)
Prevents conflicting advice and keeps total training load visible in one place. Priority: health/injury > recovery > performance; rehab has a veto. The recommendation/plan split exists from v1 so the second specialist does not force a core rewrite.

**D7 — The owner talks to the head coach by default and may message a specialist directly; only the head coach changes the plan.** (Q8)

**D8 — Mobile-first PWA.** (Q9)
Logging happens on the phone right after a run; one codebase; testable end to end with Playwright.

**D9 — Hosting on free cloud tiers (Vercel + Neon).** (Q10)
Zero cost, always available, HTTPS out of the box. A PWA needs HTTPS for service workers.

**D10 — Next.js full-stack, TypeScript.** (Q11)
One codebase, one deploy, one CI pipeline, one test toolchain. Free .NET hosting is too limited for this.

**D11 — Claude Opus 5.5 at effort `medium` for every coach; monthly spend limit in the Console; log `usage`.** (Q12)
About $2–3/month more than Sonnet, keeps the quality the owner already relies on, one model means simpler code and better cache reuse. Change only based on measured data.

**D12 — Ingest via iOS Shortcuts automation plus a PWA file picker, both hitting one endpoint.** (Q13, Q14)
iOS sandboxing means a PWA (or even a native app) cannot watch or delete files in Downloads; Shortcuts can. The picker is the fallback if iOS stops the automation or Garmin changes the file name. The Shortcut deletes a file only after server confirmation, and only that file.

**D13 — Auth: Google Sign-In via Auth.js with a one-email allowlist; separate scoped token for the Shortcut.** (Q15)
Least custom security code. The Shortcut token is hashed at rest, revocable, and can only upload runs. Passkeys can come later.

**D14 — The coach gives post-run analysis plus a weekly plan (Sunday evening, Vercel Cron); push notifications come after v1.** (Q16)
The weekly plan is what makes it a coach rather than an analyzer. Web push on iOS needs separate setup and is its own small, testable step.

**D15 — Athlete profile: import a summary from the existing claude.ai coach session, then an onboarding interview fills the gaps; always editable.** (Q17)
Keeps the accumulated context. Errors in the profile multiply into every later decision, so the owner reviews it.

**D16 — Import the last 4–8 weeks of runs through the normal endpoint (multi-select); no bulk Garmin export importer.** (Q18)
Enough history for training load (acute/chronic) with no one-off code to maintain.

**D17 — App UI and coaches in Bulgarian only; all files (code, docs, specs, commits) in English.** (Q19, plus owner instruction)
Single user, so i18n adds cost without benefit. English is standard and works best for agents.

## Process

**D18 — No issue tracker; specs are the backlog.** (Q20)
A tracker solves coordination problems a solo developer does not have. Task IDs (`T1`, `T2`, …) stay stable so specs can be imported into Jira via MCP later. TASKS.md tracks progress and survives compaction (one file per spec since D46). Step 03 keeps branch → PR → AI review → owner approval → merge.

**D19 — `PRODUCT.md` for vision and shared decisions, plus one spec per feature in `specs/`.** (Q21)
One giant spec is too big for one fresh session and has no per-step finish line.

**D20 — v1 is eight specs in the order 000 → 001 → 002 → 003 → (004 ∥ 005) → 006 → 007.** (Q22, Q36)
Ingest comes before the coach because the coach needs data. 004 and 005 share no files, which makes them the first natural case for parallel agents in worktrees.

**D21 — Risk tiers adapted for one person.** (Q23)
- **Low** (docs, copy): merge without the owner when CI and AI review are green (GitHub auto-merge).
- **Medium:** owner approval after AI review.
- **High:** owner approval plus mandatory `/security-review` and `/code-review`, observer during implementation, and a second read on the next day before merge.
- The tier is set by touched paths, listed in `REVIEW.md`, not by the feature.

**D22 — Autonomy boundaries (stop rule).** (Q24)

| Action | Rule |
|---|---|
| Read, write code, run tests/lint/build inside the repo | Do it |
| Commit to a feature branch; push it; open a PR | Do it |
| Run AI review on the PR and fix findings | Do it, before calling the owner |
| Merge a low-tier PR | Automatic via GitHub auto-merge when green |
| Merge a medium/high-tier PR | Owner only |
| Deploy | Never manually; Vercel previews per PR and production on merge |
| Edit tests that already pass | Ask |
| DB migrations | Write them; apply to production only after approval |
| Add dependencies | Ask |
| Force-push, delete branches, touch files outside the repo, secrets | Never without an explicit yes |
| Push to `main` | Never (also blocked by branch protection) |

Agents run in auto mode with an allowlist of safe commands. Reports use: *Needs your decision (Q1, Q2…) · FYI · progress as % of plan*.

**D23 — Model / effort matrix.** (Q25)

| Work | Model | Effort | Advisor |
|---|---|---|---|
| Spec interviews | Opus 5.5 | medium | — |
| Implementing low/medium specs | Opus 5.5 | medium | — |
| Implementing high specs | Opus 5.5 | medium | Opus 5.5 |
| Tests, scripts, routine changes (subagent) | Sonnet 5.5 | medium | — |
| Task review (first pass) | Sonnet 5.5 | low | — |
| Final `/code-review` and `/security-review` | Opus 5.5 | medium | — |
| Observer | Sonnet 5.5 | low | — |

Start at medium everywhere; raise effort only with a measured gain (reviews missing things the owner later catches). No "think hard" or "double-check" in prompts. After two misses: fresh session first, higher effort second. Never `xhigh`/`max` by default.

**D24 — Observer: hooks plus a fresh subagent after every task.** (Q26)
Hooks catch mechanical cheating deterministically (deleted or skipped tests, TODOs without evidence, `.github/` changes outside a high spec). The subagent compares the task diff with the spec and flags silent decisions, unproven "done", weakened checks, and scope creep. A continuously running parallel observer session was rejected for now (noise from half-finished states); it can be tried later if this misses things.

**D25 — Test pyramid.** (Q27)

| Layer | Tool | When |
|---|---|---|
| Unit | Vitest (real `.fit` fixtures from the owner's runs) | Hook on change (touched tests) |
| Integration | Vitest + real Postgres (Docker locally; a Neon branch per PR in CI) | CI on every PR |
| E2E | Playwright, iPhone viewport | CI against the Vercel preview |
| AI behavior | Eval set | Manually, and before merging prompt changes; never in CI |

CI and regular tests never call the real Claude API; they use recorded responses. Ingest security fixtures (zip bomb, path traversal, two `.fit` files, renamed non-zip, duplicate, revoked token) are written before the code.

**D26 — TDD for all logic, proven in git.** (Q28)
Each behavior is a `test:` commit (red, failing for the right reason) followed by a `feat:`/`fix:` commit (green, minimal code). The observer checks out the red commit, confirms the test fails, then confirms the green commit did not modify the test. Exceptions, listed explicitly: scaffolding and configuration, purely visual UI, prompts (prompts have evals).

**D27 — `AGENTS.md` is the shared base; `CLAUDE.md` imports it with `@AGENTS.md` and adds Claude-specific rules only.** (Q29)
One line of cost; any other agent (Copilot, Cursor, Codex) sees the rules immediately.

**D28 — Learning loop: `/learn <note>` during work writes to `LEARNINGS.md`; a retrospective after every spec proposes fixes.** (Q30)
The retrospective (fresh session) reads transcripts, PR comments, observer and review findings, finds repeated corrections, and proposes where each fix goes, preferring deterministic over text: lint rule > hook > skill > line in AGENTS.md/CLAUDE.md > REVIEW.md. It also proposes cuts for lines that did not change behavior. Lands as a `[LEARN]` PR.

**D29 — No plugins or marketplace for now.** (Q31)
Everything lives in the repo's `.claude/` folder.

**D30 — Project name `TrainingHub`, at `~/Projects/TrainingHub`, public GitHub repo with branch protection on `main`.** (Q32; changed from private in spec 000, T2)
GitHub Free offers no branch protection, rulesets or auto-merge on private repos, and GitHub Pro ($4/month) was rejected in favor of zero infrastructure cost. Commits use the owner's GitHub noreply address. Nothing personal is committed: no secrets, and no unanonymized training data.

**D31 — Git conventions.** (Q33)

| Element | Format | Example |
|---|---|---|
| Branch | `<type>/s<spec>-<description>` | `feat/s003-run-ingest` |
| Commit | Conventional Commits with task ID | `test(T3): reject zip with path traversal` |
| PR title | `[S<spec>] <imperative description>` | `[S003] Add run ingest endpoint` |
| PR body | Spec link, risk tier, "Done means" checklist, observer findings | — |
| Special PRs | `[LEARN]`, `[HOTFIX]`, `[CHORE]` | `[LEARN] Rules from spec 003` |
| Merge | Merge commit only; squash and rebase disabled in repo settings | — |

One PR per spec by default; if a spec turns out large, the agent proposes splitting by tasks and asks. Squash would destroy the red/green TDD evidence.

**D32 — Specs are written just in time.** (Q34)
Now: `PRODUCT.md`, this log, `specs/000-foundation.md`. Before each later spec: a short interview about that spec's details only, because they depend on what earlier specs teach us.

**D33 — `AGENTS.md` and `CLAUDE.md` are written with the owner through an interview, as the first task of spec 000.** (Q34 follow-up)

**D34 — A project skill `/spec <number>` starts every later spec.** (Q34 follow-up)
It reads PRODUCT.md, this log, LEARNINGS.md and earlier specs, interviews the owner one question at a time about that spec only, writes the spec and its mockup, and tells the owner to open a fresh session for implementation. The skill itself is written with the owner through an interview in spec 000.

**D35 — Design system as its own spec (001), plus a mandatory UI section in every later `/spec` interview.** (Q36)
Visual direction is a product-level decision and must exist before the first screen (auth has a login screen). Uses the frontend-design skill. Visual UI is exempt from TDD; it is checked with Playwright screenshots on an iPhone viewport plus owner review.

**D36 — Every spec with UI ships with a static HTML mockup; the spec is approved only when both are approved.** (Q38)
- Specs 001, 002, 003, 005, 006, 007 get a screen mockup; 004 gets a flow diagram (Shortcut → API → confirmation → delete, with every failure path); 000 gets none.
- The mockup shows every state the spec describes (empty, loading, error, success), not only the happy path.
- After 001, mockups use the design tokens; 001's mockup explores 2–3 visual directions.
- Stored next to the spec: `specs/003-run-ingest.md` + `specs/003-run-ingest.mockup.html`, one self-contained HTML file.
- On feedback, the agent updates the spec and the mockup together.
- After approval the mockup is frozen and becomes the visual contract (not pixel-perfect); observer and `/code-review` check against it.
- Viewed in Safari Responsive Design Mode (iPhone), optionally also published as a private claude.ai artifact for viewing on the phone.
- Mockup copy is in Bulgarian, because it shows the product UI (D17).

**D37 — Every file that instructs agents is created or changed only after an interview with the owner.** (Q39)
Covers AGENTS.md, CLAUDE.md, skills, subagent definitions, hooks, REVIEW.md. The agent proposes wording; the owner approves line by line. Retrospectives only propose such changes. Such PRs are at least medium tier and never auto-merge.

**D38 — Every agent report ends with a "New session: yes/no — reason" line.** (owner instruction)
Yes when: a spec is finished (implementation always starts fresh), two misses on the same task, context above ~60%, or the next task does not need the current context (retrospective, new interview).

**D39 — Four review layers.** (Q41)

| Layer | When | Who | Checks |
|---|---|---|---|
| 1. Task review | After every task, in parallel with the observer | Fresh subagent, Sonnet 5.5, low | Task diff: correctness, edge cases, readability, conventions. Findings are fixed before the next task. |
| 2. Observer | Same time | Fresh subagent, Sonnet 5.5, low | TDD evidence, silent decisions, scope, spec and mockup fidelity |
| 3. PR review | Once per PR | `/code-review` Opus 5.5 medium; plus `/security-review` for high tier | The whole change: architecture, interactions between tasks |
| 4. Owner | Before merge (medium/high) | Owner | Per risk tier (D21) |

Task-review findings the agent does not fix go to "Needs your decision".

**D40 — The app map and end-to-end flow are decided in spec 001, before the visual direction.** (Q43)
The `/spec 001` interview starts with the screens, navigation, start screen, and the flow after a run is uploaded (upload → processing → analysis → plan adjustment → in-app notice). The 001 mockup is a clickable prototype of the whole flow in the chosen visual direction. The approved map is recorded in `PRODUCT.md`; later specs detail their screens within it and never change it silently (a change is a question to the owner). Flow and visuals influence each other, so they are decided together with a mockup in front of the owner.

## Decided in spec 000

**D41 — Drizzle ORM + drizzle-kit, with the `pg` driver everywhere (local, CI, Neon).** (spec 000, T5)
Schema in TypeScript, queries close to SQL, migrations as plain `.sql` files reviewable in the PR before production is migrated (D22). No generate step. One driver means integration tests exercise the production code path. Rejected: Prisma 7 (heavier, extra generate step, own schema language), Kysely with hand-written migrations (no schema or migration generation).

**D42 — Error monitoring with Sentry's free plan (`@sentry/nextjs`).** (spec 000, T6)
Server errors with stack traces and an email on the first occurrence of a new error, so a failed ingest does not go unnoticed. Rejected: Vercel runtime logs only (about an hour of retention on Hobby, no alerts).

**D43 — Database backups: Neon's built-in restore window only.** (spec 000, T6)
Owner's choice. Accepted risk: data older than the free-tier restore window cannot be recovered. Rejected: a weekly encrypted `pg_dump` as a GitHub Actions artifact (encryption would be mandatory because artifacts in a public repo are downloadable by any GitHub user).

**D44 — Implementation defaults from spec 000.** (spec 000, T4–T7; recorded after the observer flagged them)
- E2E runs on Playwright's iPhone 16 profile (WebKit), the closest match to the owner's phone.
- Local Postgres 17 on port 5433, so it can't collide with another project's Postgres on 5432.
- Node 24.x everywhere (`engines`, Vercel, CI).
- `GET /api/health` returns `{status, database}`; 503 when the database is unreachable; `Cache-Control: no-store`.
- Database: 5 s connect timeout and 5 s query timeout; pool errors are logged by message only (the error object carries the password).
- Production URL: https://traininghub-sand.vercel.app (assigned by Vercel).
- Sentry: no performance tracing (`tracesSampleRate: 0`) and no default PII (`sendDefaultPii: false`), because the app holds health data.
- CI waits for the Vercel commit status, then uses the branch preview URL. Vercel shortens hostnames over 63 characters with an unpredictable hash, so a branch name may be at most 25 characters after slugging (`feat/s003-run-ingest` is 20); CI fails with a clear message otherwise.
- E2E trades the Vercel bypass secret for a cookie scoped to the preview domain (global setup), so the secret never reaches other sites.

**D45 — How `/spec` runs.** (spec 000, T9 interview, Q1–Q11)
- Only the owner invokes it (`disable-model-invocation: true`); an agent never starts a spec on its own.
- The spec, its mockup and the implementation share one branch `feat/s<nnn>-<name>` and one PR (D31). The spec is committed once, after approval, as `docs(S<nnn>): add spec and mockup`; the implementation session opens the PR.
- Every mockup is published as a private claude.ai artifact and republished after each change (D36 made this optional): a mobile UI is judged best on the phone, and asking each time would almost always get the same answer.
- An approved spec carries `Approved: <date>` in its header table.

**D46 — One progress file per spec in `tasks/`, replacing `TASKS.md`.** (spec 000, T9 follow-up)
`tasks/<nnn>-<name>.md` mirrors `specs/<nnn>-<name>.md`; the current file has the branch's spec number; merged specs' files stay unchanged. Parallel specs (004 ∥ 005, D20) never edit the same file, and each spec's evidence and review findings stay in the repo for the retrospective (D28). Rejected: one `TASKS.md` replaced per spec (conflicts between parallel worktrees, evidence only in merged PR bodies); a `-spec`/`-task` suffix (the folder already says it, and it would break D36's file names).

**D47 — Agents never delete branches; GitHub deletes head branches on merge.** (after spec 000, owner instruction, Q35/Q38)
The repo setting `delete_branch_on_merge` is on, so merged branches leave GitHub without any agent action. After a merge the agent only runs `git switch main && git pull --prune`. Supersedes the "delete branches" part of D22's "never without an explicit yes" row: deleting a branch is now never. Merged local branches stay on the owner's machine; they are harmless.

**D48 — Rules from the spec 000 retrospective.** (retrospective, Q1–Q6)
- The observer flags a "done" that rests only on the owner's report of a manual step when its effect can be checked, and a service a task turns on that no "Done means" item proves in production. The first production build ran without Sentry variables while T6 said "env vars done"; Sentry was chosen in T6, after the spec was written.
- Every service a spec turns on gets a "Done means" item proving it works in production (`/spec`). Spec 000 chose Sentry in T6, and no item covered it.
- Before owner steps in an external service, the agent reads the service's current docs and gives exact steps plus what success looks like. About 10 follow-up questions came from steps written from memory, two of them wrong.
- The advisor also checks the agent's recommendation when the owner decides during implementation; spec interviews still have no advisor (D23). It never ran in spec 000, because every unsettled decision went straight to the owner.
- Reports list open "Done means" items next to task progress. Amends D22's report format.
- Interviews on agent instruction files show the full proposed wording in one message, numbered by block; the owner approves each block or edits lines in it. Amends D37's "approves line by line". Most spec 000 edits came at the full read.

## Open questions (decided in the named spec's interview)

| Topic | Spec |
|---|---|
| Database schema; whether to store the raw `.fit` file | 003 |
| How `.fit` test fixtures are anonymized (GPS tracks, timestamps, device IDs) before they are committed to the public repo | 003 |
| Which FIT metrics are shown and passed to the coach | 003 / 006 |
| Coach prompts and personalities | 006 / 007 |
| Health-data privacy: what is sent to the Claude API, account and data deletion | 002 / 006 |
| Whether iOS allows the delete step of the Shortcut to run without a confirmation tap | 004 |
