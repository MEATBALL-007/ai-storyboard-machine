# SUMMARY — round `2026-11-05_0004`

## What I did
- Restored the previous round's tip, `655428f` (`2026-11-04_0034`). The runner had cut this branch from the stale base `3503537` again. I ran `git checkout 655428f -- .` and committed the restore on its own. `git rev-parse HEAD^{tree} 655428f^{tree}` printed `fe7fc45d7dd44281dc7340244dc6826051604e4f` twice.
- The prompt's `## Next task` arrived empty, so I took the task from the restored `AUTOPILOT.md` (line 340). It says to check `README.md → ## Open decisions` first, and to run a no-op round if no decision has been answered.
- Checked all five owner-answer channels. None of them has an answer (details under Verification).
- Measured the ranking tiebreak live. This was the first round of 11-05 and my own ref still pointed at `3503537`, so the newest date was `2026-11-04`, with four tips. `--sort=-committerdate` ranks `655428f` (`_0034`) first, which is correct. Sorting by sha with `| sort -r` gives `bf66ead` > `655428f` > `45ec09d` > `3170a3a`, so it would have restored `bf66ead` and discarded `_0013`, `_0024` and `_0034`. The result is TAILS, which matches `_0034`'s forecast. The record is now 110/167 (110/163).
- Added this round's entry and the next round's forecast to the `## Next task` block in `AUTOPILOT.md`. If the next round runs on 11-05 it is masked. If this round isn't pushed, the comparand is `bf66ead` and the forecast is TAILS.

## Why
- None of the eight open decisions has an answer, and each remaining acceptance criterion waits on at least one of them: chip, segmented and input padding (decisions 2, 5 and 6), jsPDF (1), and browser verification (4). The contract forbids substitute work, so the round ends once verification is done.

## Verification
- Channel 1: `grep -c "| Option | Cost |" README.md` → `8`; `grep -c "If you answer:" README.md` → `8`. The two counters agree, so nothing has been answered.
- Channel 2: `git ls-files | grep -i jspdf` and `ls jspdf*` both printed nothing. There is no jsPDF file.
- Channel 3: `main`, `origin/main` and `mac/main` are all still at `ef3220e` (2026-06-27).
- Channel 4: `git status --short --untracked-files=all` printed nothing after the restore commit.
- Channel 5: the newest non-`auto/*` refs are `design-system` and `origin/design-system`, both at `3503537` and dated 2026-08-13.
- Tiebreak: `node -e "console.log('655428f'<'bf66ead')"` → `true`.
- Verify, run bare (exit 0):
  - `node tools/test.mjs` → `54 passed, 0 failed`
  - `node tools/check-tokens.mjs` → all 6 checks pass (tokens 22/22, fonts 4/4, and 4 checks across 15 CSS sources)
  - `npm --prefix design-system test` → `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- Harness, five keys:
  - `buttons 2488f2d:index.html index.html` → markup OK, 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → markup OK, 45 pairs / 9 elements, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → markup OK, 5 pairs / 1 element, PASS
  - `ds-disabled-hover 655428f:design-system/src/styles.css design-system/src/styles.css` → 15 pairs / 3 elements, PASS, plus `1 undecidable rule(s)` (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none is `#toast`. This is the expected result: the key documents a deliberate behaviour fix.

## What I did NOT do
- I did not answer or act on any open decision (1–8). Those belong to the owner.
- I did no substitute work. Things like `:last-child` matching in the harness, adding the harness to Verify, or applying decisions 2/5/6/7 are explicitly forbidden by the Next task.
- I did not open a browser. Decision 4 is still unanswered, and the browser MCPs are permission-blocked.

## Risk
- Low. This round's own diff touches only `AUTOPILOT.md` (one forecast entry) and this `SUMMARY.md`. The restore commit matches `655428f` exactly (same tree sha).
- The bigger problem is structural and hasn't changed. The runner keeps cutting every branch from `3503537`, so the `auto/*` branches pile up in parallel and nothing reaches `main`. The work is stalled on owner decisions, and more rounds won't unstall it. Someone needs to answer `README.md → ## Open decisions`.
