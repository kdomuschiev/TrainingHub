# TrainingHub

A personal training app with a team of AI coaches. Single user (the owner). Built as a real product the owner uses daily, and as a vehicle for practicing a professional AI-agent development workflow end to end.

## Problem

The owner runs three times a week with a Garmin watch. Today, after every run they:

1. Open Garmin Connect in a browser and download the activity as a `.zip` containing the `.fit` file.
2. Upload it to a claude.ai session where Opus plays the role of a running coach.
3. Read the analysis and the recommendation for the next sessions.

This is manual and slow. TrainingHub automates it: the run arrives on its own, gets analyzed, and the weekly plan updates without the owner doing anything but finishing the run and downloading the file.

## The coaching team

- **Specialists**, each owning one domain: running coach (v1), then strength/fitness coach, rehabilitation specialist, wellness specialist.
- **Head coach**: the default point of contact once there is more than one specialist. Owns the single weekly plan.
- **Specialists produce recommendations, never the plan.** The head coach collects recommendations, resolves conflicts, and writes the plan.
- **Conflict priority:** health and injury (rehab) > recovery (wellness) > performance (running, fitness). The rehabilitation specialist has a veto.
- **Shared athlete profile**: goals, current level, injuries, available days, heart-rate zones. Every coach reads it.
- **Conversation model:** the owner talks to the head coach by default and can message a specialist directly. Anything a specialist says reaches the plan only through the head coach.
- In v1 there is one specialist (running coach) and the head coach is a thin layer, but the recommendation/plan separation exists from day one so adding specialists does not require rewriting the core.

## Run ingest

The `.fit` file stays the source of truth. No Garmin API, no Strava API, no Connect IQ.

- **Primary path: iOS Shortcuts automation.** Runs on a schedule, looks only in the iPhone Downloads folder, matches only names of the form `<digits>.zip`, uploads each match to the ingest endpoint with a scoped token, and deletes the file **only** after the server confirms it was processed, and only that exact file. On any failure the file stays and the owner is notified.
- **Fallback path: file picker in the PWA**, multi-select. Also used once to import the last 4–8 weeks of runs at the start.
- Both paths hit the same endpoint with the same validation: token check, size limit, exactly one `.fit` inside, zip-bomb and path-traversal protection, activity-type check, deduplication by the activity ID in the file name.
- FIT parsing uses Garmin's official FIT SDK for JavaScript.

## What the coach does (v1)

- **After every run:** analysis of the run (how it went, against the plan, what stands out) and a recommendation for what comes next.
- **Weekly plan:** every Sunday evening the head coach writes next week's plan (three runs with type, distance, pace, HR zones). Post-run analysis can adjust the rest of the current week.
- **Chat** with the head coach or directly with the running coach.
- **Athlete profile** bootstrapped by importing a summary from the owner's existing claude.ai coach session, completed by an onboarding interview for missing fields. Always visible and editable.

## Platform and stack

| Area | Choice |
|---|---|
| Form factor | Mobile-first PWA, installed on iPhone via Safari "Add to Home Screen" |
| Stack | Next.js full-stack, TypeScript (frontend, API routes, AI calls in one codebase) |
| Hosting | Vercel Hobby (free) with preview deploys per PR and production deploys on merge to `main` |
| Database | Neon Postgres, free tier, EU (Frankfurt) |
| Auth | Google Sign-In via Auth.js with an allowlist of the owner's email; separate scoped, revocable, hashed token for the iOS Shortcut (upload only, cannot read data) |
| AI | Claude Opus 5.5 (`claude-opus-5-5`), effort `medium`, for every coach. Model is configurable. |
| Scheduled jobs | Vercel Cron (weekly plan) |

## Cost

Target: infrastructure at zero cost on free tiers. The only real cost is the Claude API (pay-per-token, not covered by a claude.ai subscription). Estimate with Opus 5.5 at the owner's volume: roughly $4–6/month. A monthly spend limit (e.g. $10) is set in the Anthropic Console, and the app logs `usage` from every response so real cost is visible.

## Language

- **App UI and coaches: Bulgarian only.** No i18n.
- **Everything else in English:** code, comments, identifiers, commits, PRs, specs, docs, agent instruction files.

## v1 scope

Eight specs, each a full cycle: spec interview and mockup, then a fresh session implements it, then layered review, merge, and a retrospective.

| # | Spec | Risk tier |
|---|---|---|
| 000 | `foundation`: repo, Next.js, Neon, Vercel, CI, context files, hooks, review subagents, `/spec` skill | high |
| 001 | `design-system`: app map and end-to-end flow (screens, navigation, start screen, flow after upload), then visual direction, design tokens, base components, PWA shell; clickable prototype mockup (uses the frontend-design skill) | medium |
| 002 | `auth`: Google Sign-In with allowlist, Shortcut token issue/revoke | high |
| 003 | `run-ingest`: upload endpoint, zip/FIT validation, FIT parsing, storage, multi-select picker | high |
| 004 | `ios-shortcut`: the Shortcut, install guide, end-to-end check on the phone | medium |
| 005 | `athlete-profile`: import from claude.ai summary, onboarding interview, editing | medium |
| 006 | `run-coach`: post-run analysis, recommendations, direct chat with the running coach | medium |
| 007 | `head-coach-weekly-plan`: head coach, recommendation → plan, weekly cron, in-week adjustments | medium |

Order: 000 → 001 → 002 → 003 → (004 ∥ 005) → 006 → 007. Specs 004 and 005 run in parallel (separate worktrees).

## App map

To be decided in spec 001 (D40) and recorded here. Later specs detail screens within this map and never change it silently.

## After v1 (each its own cycle)

Push notifications (web push), rehabilitation specialist, fitness coach, wellness specialist, passkey sign-in, voice input.

## Non-goals

- Garmin Connect API, unofficial Garmin login, Strava API, Connect IQ apps.
- Issue trackers (Jira, GitHub Issues). Specs are the backlog; task IDs stay stable so they can be imported into Jira later.
- Plugins and a private marketplace.
- i18n.
- Multi-user support.
