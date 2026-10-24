# Tasks

Status of the current spec. Every "done" needs evidence (command output, commit hash, link).

## Spec 000 — Foundation

| Task | Status | Evidence / next action |
|---|---|---|
| T1 Interview: `AGENTS.md` and `CLAUDE.md` | done | Interview 2026-10-24, Q1–Q13: every section approved by the owner (Q12 edited: advisor at effort medium; Q13 shortened). Full read approved, plus branch types added to Git. Committed as the first commit on `main` `2ecfe05`. |
| T2 Git and GitHub | done (checks pending T7) | Repo https://github.com/kdomuschiev/TrainingHub. Private Free plan blocked protection (HTTP 403); owner chose public. Commit authors rewritten to the GitHub noreply address before going public (owner approved one force-push). Verified via `gh api`: public; merge commit only (squash/rebase off); auto-merge on; `main` protected: PR required (0 approvals, solo owner), admins included, force-push and deletion blocked. Required status checks added in T7. |
| T3 Next.js scaffold | done | Next.js 16.4.3 via create-next-app (TS strict, ESLint, App Router, `src/`), defaults only. Commit `b651ddf`. `npm run lint`, `npm run typecheck`, `npm run build` pass; `next start` serves `/` with 200, `lang="bg"` and the Bulgarian placeholder. Tailwind and Geist font left out (spec 001 decides styling). |
| T4 Test toolchain | done (integration layer empty until T5) | Owner approved `vitest` 5.0.5, `@playwright/test` 1.64.1 and `@types/node` ^24. Claude API guard built red/green: `f482d66` (red: request reached api.anthropic.com, 401) → `36a775a` (green, test untouched). Playwright iPhone 16/WebKit + Postgres 17 on :5433: `b407497`. Local runs: lint ok, typecheck ok, `npm test` 2 passed, `test:e2e` 1 passed, `test:integration` no files yet (`--passWithNoTests`, removed in T5 `e628070`). |
| T5 Database | done locally; Neon pending | Owner chose Drizzle + drizzle-kit with `pg` everywhere. Red/green pairs: `5d6d248`→`723696c` (checkHealth, unit), `e628070`→`9e2a9b9` (pingDatabase vs real Postgres, integration), `0885dbd`→`22eabf6` (`GET /api/health`, E2E; red was 404). Local: lint, typecheck ok; unit 4 passed; integration 2 passed; E2E 2 passed; build lists `ƒ /api/health` (dynamic). Manual: bad DATABASE_URL → `503 {"status":"error","database":"unreachable"}`, `cache-control: no-store`. **Next:** owner creates the Neon project (Frankfurt, Postgres 17); checked against Neon in T6. |
| T6 Vercel | in progress, waiting on owner | Decisions D41–D43 recorded (`02ac1c6`). Sentry code added (`7971105`): lint, typecheck, build, E2E pass; not yet verified against a real Sentry project. **Waiting on owner:** Neon project (Frankfurt, PG 17, db `traininghub`), Vercel import of the repo, Neon↔Vercel integration with preview branches, Sentry account + project. **Then:** verify preview deploy and `/api/health` against Neon; set Sentry env vars for Production. |
| T7 CI (GitHub Actions) | blocked by T1 | — |
| T8 Interview: hooks, review subagents, `REVIEW.md`, `/learn` | blocked by T1 | — |
| T9 Interview: `/spec` skill | blocked by T1 | — |
| T10 PR and review | blocked by T1 | — |
