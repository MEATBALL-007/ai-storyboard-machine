# SUMMARY — round 2026-11-20_0012

## What I did
- Restored the previous round's tip, `fe04a7d` (`2026-11-20_0002`). The runner cut this branch from
  the stale base `3503537` again. The restore is its own commit, and the trees match:
  `HEAD^{tree}` = `fe04a7d^{tree}` = `9e204c92e8bf…`.
- Checked all five owner-answer channels. None has an answer, so this is a no-op round. That is what
  the restored `## Next task` says to do when nobody has answered.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and moved the "tip to restore" line to
  `2026-11-20_0012`. The Next task itself is unchanged: wait for owner answers.

## Why
- **The prompt's `## Next task` was empty.** The real one is in the branch's `AUTOPILOT.md`, and you
  only see it after the restore. It says to do nothing unless the owner has answered one of the
  eight `## Open decisions` in `README.md`. Each of those decisions moves pixels or adds a file, so
  an agent must not make them.
- **I didn't run the tip-ranking A/B this round.** `2026-11-20` had exactly one tip (`_0002`) when I
  read the refs, and my own ref was still on `3503537`. The correct and incorrect ranking forms give
  the same row 1 when there is only one tip, so the result tells you nothing. The record stays at
  138/210.

## Verification
- `git for-each-ref --sort=-committerdate` (before the restore): row 1 = `fe04a7d` `_0002`, and the
  local and `origin/` refs agree.
- `git rev-parse HEAD^{tree} fe04a7d^{tree}`: both print `9e204c92e8bf6ce0fa4dcee7107a7b055ddbe76b`.
- Owner-answer channels:
  - `README.md`: `grep -c "| Option | Cost |"` = 8 and `grep -c "If you answer:"` = 8.
  - No `jspdf` file is tracked or present.
  - `git status --short --untracked-files=all` is empty.
  - `main` is still at `ef3220e`.
  - The newest non-`auto/*` ref is from 2026-08-13 (`design-system` at `3503537`).
- Verify command, run bare:
  `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - **54 passed, 0 failed**
  - check-tokens: tokens 22/22, fonts 4/4, and 4 more checks across 15 CSS sources, all clean
  - vitest: **12 files, 31 passed**
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons` `2488f2d:index.html` → `index.html`: 85 pairs / 17 elements, PASS, markup OK
  - `segmented` `021b966:index.html` → `index.html`: 45 / 9, PASS
  - `toast` `de07ea8:index.html` → `10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover` `fe04a7d:design-system/src/styles.css` → live: 15 / 3, PASS, plus 1 undecidable rule
  - `toast-hit` `3d3d5cc:index.html` → `index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs.
    This is the expected result. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
    `:disabled:hover`, `:focus`), and there are none for `#toast`.

## What I did NOT do
- I didn't answer, implement, or work around any of the 8 open decisions (jsPDF, chip padding,
  spacing scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`).
- I didn't start any substitute task. Hard rule 5 forbids it, and no fallback work is left.
- I ticked no acceptance criteria because nothing changed.

## Risk
- This round changed no code or CSS. The diff is the restore commit plus documentation in
  `AUTOPILOT.md` and `SUMMARY.md`.
- The stall is the runner, not the code. Every round branch is still cut from `3503537`, and every
  remaining criterion is waiting on a person. More rounds won't unblock anything until the owner
  answers one of the `README.md → ## Open decisions` entries or drops `jspdf.umd.min.js` into the repo.
- The next round's tip ranking is a live test on 11-20. If this round's closing sha sorts below
  `fe04a7d`, the incorrect `| sort -r` form would restore `_0002` and lose this round. That would
  cost documentation only.
