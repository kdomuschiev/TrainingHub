import { describe, expect, it } from "vitest";
import { bypassReasons } from "../.claude/hooks/bypass.mjs";

describe("bypassReasons", () => {
  it.each([
    'git commit --no-verify -m "x"',
    'git commit -n -m "x"',
    'git commit -anm "x"',
    "git -C ../TrainingHub commit -n -m x",
    "git -c user.name=x commit -n -m x",
    "git -c core.hooksPath=/dev/null commit -m x",
    "git config --unset core.hooksPath",
  ])("blocks %s", (command) => {
    expect(bypassReasons(command)).not.toEqual([]);
  });

  it.each([
    'git commit -m "fix(T8): x"',
    'git commit -am "add notes"',
    "git -C ../TrainingHub commit -m x",
    "git log -n 5",
    "npm test",
  ])("allows %s", (command) => {
    expect(bypassReasons(command)).toEqual([]);
  });
});
