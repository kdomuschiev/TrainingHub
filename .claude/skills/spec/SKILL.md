---
name: spec
description: Interview the owner, then write one spec and its mockup. Invoked as /spec <number>.
disable-model-invocation: true
argument-hint: <number>
---

You write spec $ARGUMENTS with the owner: interview, spec, mockup.
You write no code; implementation starts in a fresh session.
`<nnn>` is $ARGUMENTS padded to three digits (3 → 003).

## 1. Read

Read `PRODUCT.md`, `docs/decisions.md`, `LEARNINGS.md`, `REVIEW.md`,
and every earlier spec and mockup in `specs/`. Run
`git grep -n "TODO(S<nnn>)"` for work deferred to this spec.
Done when you can state the spec's goal in one sentence and list
everything that belongs to it: its row in the v1 scope, its rows in
the open-questions table, deferred TODOs and out-of-scope items that
earlier specs left to it.

Create `feat/s<nnn>-<name>` from an up-to-date `main`, with `<name>`
from the v1 scope table, at most 25 characters after slugging (D44).
The spec, the mockup and the implementation share this branch and
its one PR.

## 2. Interview

Ask one question per message, each with your recommended answer and
why. Order the questions so later answers can build on earlier ones:
goal and scope, the open questions, behavior (inputs, outputs, limits,
every failure path), the UI section, then tasks and risk tier. For the
risk tier, name the paths this spec creates that belong in `REVIEW.md`'s
High list. When `docs/decisions.md` already settles a question, cite
the decision instead of asking.
Done when every item from step 1 has an answer and every behavior
has its failure paths decided.

### UI section

Every spec gets one. A spec with no screens says so in one line,
with the reason. For each screen, settle where it sits in the app
map (`PRODUCT.md`), what it shows, every state (empty, loading,
error, success, plus any the behavior adds) and its exact Bulgarian
copy. A change to the app map is a question to the owner.
- Spec 001: the app map and end-to-end flow first (D40), then 2–3
  visual directions, using the `frontend-design` skill.
- Spec 004: a flow diagram instead of screens: Shortcut → API →
  confirmation → delete, with every failure path.
- After 001: screens use 001's design tokens and base components.

## 3. Write the spec

Write `specs/<nnn>-<name>.md` in the structure of
`specs/000-foundation.md`: header table, Goal, Done means, Tasks,
Out of scope, When to stop and ask. Each "Done means" item is
checkable by a command, a test, or an owner look at a named mockup
state. Number tasks T1…Tn in build order, each small enough for one
task review. "When to stop and ask" lists only what this spec adds
to the Autonomy section of `AGENTS.md`.

In the same change: each new decision goes into `docs/decisions.md`
as the next D-number with its reason; answered rows leave the
open-questions table; the spec's High paths go into `REVIEW.md`;
`TASKS.md` becomes this spec's task table, every task `not started`.

## 4. Write the mockup

For a spec with UI, write `specs/<nnn>-<name>.mockup.html`: one
self-contained HTML file (inline CSS and JS, no network requests),
sized for an iPhone viewport, with a switcher that reaches every
state from the UI section. It uses the spec's Bulgarian copy word
for word. Spec 001's mockup is a clickable prototype of the whole
flow, one per visual direction; spec 004's is the flow diagram.
Publish it as a private claude.ai artifact and give the owner the
link next to the file path; republish after every change.

## 5. Review with the owner

The owner reviews the spec and the mockup together. Apply each piece
of feedback to both files in the same edit and say what changed in
each. The spec is approved when the owner explicitly approves both;
add `Approved: <date>` to the spec's header table. From then on the
mockup is frozen: it is the visual contract the observer and
`/code-review` check against, and a later change to it is a question
to the owner.

## 6. Finish

After approval, commit the spec, the mockup, `docs/decisions.md`,
`REVIEW.md` and `TASKS.md` as `docs(S<nnn>): add spec and mockup`,
then push the branch. End with the report from `AGENTS.md`, with
**New session:** yes — implementation starts fresh with
"Implement spec <nnn>".
