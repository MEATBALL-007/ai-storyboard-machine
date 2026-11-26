# SUMMARY — round `2026-11-25_0037`

## What I did
- The runner cut this branch from the stale base `3503537` again. I restored the previous round's tip, `0c00290` (`2026-11-25_0026`; the local ref and `origin/` agree), with `git checkout 0c00290 -- .` and committed that on its own. `HEAD^{tree}` and `0c00290^{tree}` both print `f4b7e7182ac6629418aa40d6ac19c058bdd337f2`.
- I checked all five places an owner answer could appear and found none, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-25_0037`.

## Why
- The prompt's "Next task" was empty. The repo's own `## Next task` says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They still are, so I did not make up other work (hard rule 5).
- The previous round said this round would be a real measurement. Before the restore, `2026-11-25` had 3 tips (`0c00290`, `b3ebde1`, `9c037f4`), and my own ref still pointed at `3503537`. `node -e` showed that the wrong ranking method (sha + `sort -r`) picks `b3ebde1`, and `'0c00290'<'b3ebde1'` is `true`. So the wrong method would have restored the wrong tip and thrown away `_0026` (TAILS). I restored the right one, `0c00290`, by commit date. The wrong-method tally is now tails 146/227 (146/223).
- If the next round runs on 11-25 it will also be a real measurement: 4 tips, comparand still `b3ebde1`, and tails if this round's closing sha sorts below `b3ebde1`.

## Verification
- `git for-each-ref --sort=-committerdate`: the top row is `0c00290` `_0026` (local and `origin/`), then `b3ebde1` `_0016`, then `9c037f4` `_0006`, then `e35c856` on 11-24.
- Channels:
  - `grep -c "| Option | Cost |" README.md` → `8`
  - `grep -c "If you answer:" README.md` → `8`
  - `git ls-files | grep -i jspdf` → nothing; `ls jspdf*` → no such file
  - `git status --short --untracked-files=all` → empty
  - `main` = `ef3220e` (2026-06-27). The newest non-`auto/*` ref is `design-system` / `origin/design-system` at `3503537` (2026-08-13).
- Verify, run bare (exit 0):
  - `node tools/test.mjs`: `54 passed, 0 failed`
  - check-tokens: 22/22 tokens, 4/4 fonts, and all four literal checks clean over 15 CSS sources
  - Vitest: 12 files, 31 passed
- Harness:
  - `buttons` (`2488f2d`→live): 85 pairs / 17 elements, PASS
  - `segmented` (`021b966`→live): 45/9, PASS
  - `toast` (`de07ea8`→`10e8f39`): 5/1, PASS
  - `ds-disabled-hover` (`0c00290:design-system/src/styles.css`→live): 15/3, PASS, plus 1 undecidable rule (`.pui-menu__item:last-child`)
  - `toast-hit` (`3d3d5cc`→live): exits 1 with `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo` and none is `#toast`, which is the expected result.

## What I did NOT do
- I did not answer any of the eight open decisions, and I did not apply decisions 2, 5, 6 or 7 myself. Each one moves pixels or adds a file, so the owner has to choose.
- I did not retry the browser MCPs (decision 4). Permissions block them.

## Risk
- No CSS, JS or tests changed. I only edited `AUTOPILOT.md` and this file.
- The project is still stuck. Every round since late August has been a no-op because none of the eight README decisions has an answer. Running more rounds won't fix that; the owner needs to answer them.
- Runner bug, still unfixed: every branch is cut from `3503537`. This round shows the risk. Ranking tips by sha instead of by commit date would have silently discarded the previous round's work.
