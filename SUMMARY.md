# SUMMARY — round `2026-11-25_0016`

## What I did
- The runner cut this branch from the stale base `3503537` again, so I restored the previous round's tip, `9c037f4` (`2026-11-25_0006`; the local ref and `origin/` agree). I restored with `git checkout 9c037f4 -- .` and committed that separately. `HEAD^{tree}` and `9c037f4^{tree}` both print `6e3f7dff79010c2099e237853edf603a2008026f`.
- I checked all five places an owner answer could appear. There was none, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-25_0016`.

## Why
- The prompt's "Next task" was empty. The repo's own `## Next task` says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They still are, so I did not invent other work (hard rule 5).
- The previous round predicted a MASK, and that is what happened: `2026-11-25` had one tip (`9c037f4`) and my own ref still pointed at `3503537`. Both ranking methods therefore pick the same row by construction, so I ran no A/B and left the wrong-method tally at tails 145/225.
- The next round, if it runs on 11-25, is a real measurement: 2 tips, comparand `9c037f4`, and tails if this round's closing sha sorts below `9c037f4`.

## Verification
- `git for-each-ref --sort=-committerdate`: top row is `9c037f4` `_0006` (local and `origin/`), then `e35c856`, `c37afe1` and `a245a7c` on 11-24.
- Channels: `grep -c "| Option | Cost |" README.md` → `8`, `grep -c "If you answer:" README.md` → `8`. `ls jspdf*` → no such file. `git status --short --untracked-files=all` → empty. `main` = `ef3220e` (2026-06-27). The newest non-`auto/*` ref is `design-system`/`origin/design-system` at `3503537` (2026-08-13).
- Verify, run bare: `54 passed, 0 failed`. check-tokens: 22/22 tokens, 4/4 fonts, and all four literal checks clean over 15 CSS sources. Vitest: 12 files, 31 passed.
- Harness:
  - `buttons` (`2488f2d`→live): 85 pairs / 17 elements, PASS.
  - `segmented` (`021b966`→live): 45/9, PASS.
  - `toast` (`de07ea8`→`10e8f39`): 5/1, PASS.
  - `ds-disabled-hover` (`9c037f4:design-system/src/styles.css`→live): 15/3, PASS, plus 1 undecidable rule.
  - `toast-hit` (`3d3d5cc`→live): exits 1 with `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo`, and none is `#toast`. This is the expected result.

## What I did NOT do
- I answered none of the eight open decisions and applied none of decisions 2, 5, 6 or 7 on my own. Each one moves pixels or adds a file, so the choice belongs to the owner.
- I did not retry the browser MCPs (decision 4). They are blocked by permissions.

## Risk
- No CSS, JS or tests changed. The only edits were to `AUTOPILOT.md` and this file.
- The stall is still there. Every round since late August has been a no-op because the eight README decisions have no answers. More rounds will not change that; an owner has to answer.
