# SUMMARY — round `2026-11-27_0017`

## What I did
- The runner cut this branch from the stale base `3503537` again. I restored the previous round's tip, `d613e76` (`2026-11-27_0007`; the local ref and `origin/` agree, author `PHANTOM AUTOPILOT <autopilot@phantom.local>`), with `git checkout d613e76 -- .` and committed that on its own. `HEAD^{tree}` and `d613e76^{tree}` both print `cadde04f421f8ad2152aaf3ce61e0733558b9fdc`.
- I checked all five places an owner answer could show up. None had one, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-27_0017`.

## Why
- The prompt's `## Next task` was empty. The restored file's Next task says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They still are, so I did not make up other work (hard rule 5).
- This round was a MASK, as `_0007` predicted. `2026-11-27` held one tip (`d613e76`), and my own ref still pointed at `3503537` when I read the list. With one tip, the right and wrong ranking methods give the same answer, so I ran no A/B and the wrong-method tally stays at tails 147/228.
- The next round is a live measurement if it lands on 11-27 or is the first round of 11-28. There will be 2 tips on 11-27 and the comparand is `d613e76`. It comes up TAILS only if this round's closing sha sorts below `d613e76`. That round should compare the hex with `node -e`, not by eye.

## Verification
- `git log --oneline -2` before the restore: `3503537`, `e3a355c` (the stale base).
- `git for-each-ref --sort=-committerdate`: the top row is `d613e76` `_0007` (local and `origin/`), then `6666c5d` `_0037` on 11-25.
- `git rev-parse HEAD^{tree} d613e76^{tree}`: both print `cadde04f421f8ad2152aaf3ce61e0733558b9fdc`.
- The five channels:
  1. `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:" README.md` = 8. Both counters agree.
  2. No `jspdf*` file, tracked or untracked.
  3. `main` = `ef3220e` (2026-06-27).
  4. `git status --short --untracked-files=all` is empty.
  5. The newest non-`auto/*` refs are `design-system` and `origin/design-system`, both `3503537` from 2026-08-13.
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`), run bare: exit 0.
  - `54 passed, 0 failed`
  - `tokens in sync: 22/22`, `fonts in sync: 4/4`, and the four lint checks each print "15 CSS source(s) scanned"
  - vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS, markup coverage OK
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover d613e76:design-system/src/styles.css design-system/src/styles.css`: 15 / 3, PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs, which is the expected result. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) with `after : auto <- .toast-act`. None is `#toast`.

## What I did NOT do
- I did not answer any of the eight open decisions (jsPDF, chip padding, spacing scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`). Each one moves pixels or changes what is in the repo, so each is the owner's call.
- I did not retry the Playwright or Chrome-DevTools MCPs. Earlier rounds found them blocked by permissions.
- I made no CSS, HTML, or JS changes. This round's diff is limited to the restore commit, `AUTOPILOT.md`, and this file.

## Risk
- Low. Nothing outside the docs changed. The tree-sha match shows the restore is identical to the previous tip on every path.
- The stall continues: the work can only move forward once the owner answers something in `README.md → ## Open decisions`. Each further round produces the same no-op.
- The runner still cuts every round from `3503537`. Any round that skips the restore will see a stale tree that looks finished.
