# REVIEW.md

A PR's risk tier is the highest tier among the paths it touches.
The tier in the spec is the minimum.

## Tiers

| Tier | Merge | Required before merge |
|---|---|---|
| Low | Auto-merge when CI and AI review are green | Task review, observer |
| Medium | Owner | Low + `/code-review` + owner approval |
| High | Owner, after a second read the next day | Medium + `/security-review` |

## High
- `.github/`
- `.githooks/`
- `.claude/`, `AGENTS.md`, `CLAUDE.md`, `REVIEW.md`
- `drizzle/` (migrations), `src/db/schema.ts`
- `vercel.json`, `next.config.ts`, `src/proxy.ts`, `src/instrumentation*.ts`
- Auth, the Shortcut token, run upload: the paths are added here
  by the `/spec` interview of the spec that creates them

## Low
- `docs/`, `specs/`, `tasks/`, `PRODUCT.md`, `LEARNINGS.md`, `README.md`

## Medium
- Everything else
