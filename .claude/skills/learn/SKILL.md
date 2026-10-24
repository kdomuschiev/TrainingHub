---
name: learn
description: Record the owner's lesson in LEARNINGS.md. Invoked as /learn <note>.
disable-model-invocation: true
argument-hint: <note>
---

Append the owner's note to `LEARNINGS.md` as one entry at the bottom:

### <YYYY-MM-DD> · S<spec> T<task> · <branch>
**Note:** $ARGUMENTS, verbatim.
**Context:** one or two sentences of fact: what you were doing when the
owner wrote it, and what went wrong if you know. No proposed fix; the
retrospective proposes fixes.

Take spec and task from the in-progress row of `TASKS.md` and the branch
from `git branch --show-current`; write `—` for anything you can't find.
Commit only `LEARNINGS.md` right away as `docs(T<task>): record learning`,
then continue where you left off.
