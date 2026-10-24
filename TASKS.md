# Tasks

Status of the current spec. Every "done" needs evidence (command output, commit hash, link).

## Spec 000 — Foundation

| Task | Status | Evidence / next action |
|---|---|---|
| T1 Interview: `AGENTS.md` and `CLAUDE.md` | done | Interview 2026-10-24, Q1–Q13: every section approved by the owner (Q12 edited: advisor at effort medium; Q13 shortened). Full read approved, plus branch types added to Git. Committed as the first commit on `main` `2ecfe05`. |
| T2 Git and GitHub | done (checks pending T7) | Repo https://github.com/kdomuschiev/TrainingHub. Private Free plan blocked protection (HTTP 403); owner chose public. Commit authors rewritten to the GitHub noreply address before going public (owner approved one force-push). Verified via `gh api`: public; merge commit only (squash/rebase off); auto-merge on; `main` protected: PR required (0 approvals, solo owner), admins included, force-push and deletion blocked. Required status checks added in T7. |
| T3 Next.js scaffold | done | Next.js 16.4.3 via create-next-app (TS strict, ESLint, App Router, `src/`), defaults only. Commit `b651ddf`. `npm run lint`, `npm run typecheck`, `npm run build` pass; `next start` serves `/` with 200, `lang="bg"` and the Bulgarian placeholder. Tailwind and Geist font left out (spec 001 decides styling). |
| T4 Test toolchain | blocked by T1 | — |
| T5 Database | blocked by T1 | — |
| T6 Vercel | blocked by T1 | — |
| T7 CI (GitHub Actions) | blocked by T1 | — |
| T8 Interview: hooks, review subagents, `REVIEW.md`, `/learn` | blocked by T1 | — |
| T9 Interview: `/spec` skill | blocked by T1 | — |
| T10 PR and review | blocked by T1 | — |
