# SUMMARY — round `2026-11-28_0009`

## What I did
- Restored the previous round's tip `15795d7` (`2026-11-27_0039`) onto this branch, which the runner again cut from the stale base `3503537`. The restore is its own commit, and its tree is identical to the tip's: `HEAD^{tree}` = `15795d7^{tree}` = `f337709d3d704caa1f7cc7be9ed97b7620da6874`.
- Checked all five owner-answer channels. None of them has an answer, so per the restored `## Next task` this is a no-op round.
- Ran Verify (3 stages) and all 5 `docs/btn-parity-proof.mjs` keys.
- Recorded the A/B measurement for the stale-base ranking trap in `AUTOPILOT.md` → `## Next task` and pointed the next round at this round's tip.

## Why
- The prompt's `## Next task` arrived empty. The real task is in the restored `AUTOPILOT.md` (line 340): if no open decision has an answer, restore the tip, check the five channels, run Verify and the harness, and stop. I did not make up any other work (hard rule 5).
- All eight `## Open decisions` in `README.md` change pixels or add a file to the repo, so only the owner can make them. I answered none of them.

## Verification
- `git for-each-ref --sort=-committerdate` before the restore: row 1 = `15795d7` `_0039`, local and `origin/` agree. 2026-11-27 holds 4 tips.
- A/B (the wrong sha-sort formula): `node -e` sorts them as `[d613e76, cfe6a43, 8443ec2, 15795d7]`. The trap would pick `d613e76`, while the real tip is row 4/4 → **TAILS**. Running record: tails 150/231.
- Channels: `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8. No `jspdf` file. `git status` is clean. `main` = `ef3220e`. The newest non-`auto/*` ref is dated 2026-08-13.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` → `54 passed, 0 failed`; tokens 22/22, fonts 4/4, and the 4 checks over 15 CSS sources all OK; vitest `31 passed (31)`.
- Harness: `buttons` (`2488f2d`→live) 85 pairs/17 elements PASS; `segmented` (`021b966`→live) 45/9 PASS; `toast` (`de07ea8`→`10e8f39`) 5/1 PASS; `ds-disabled-hover` (`15795d7:design-system/src/styles.css`→live) 15/3 PASS + 1 undecidable; `toast-hit` (`3d3d5cc`→live) `FAIL — 5 declaration(s) differ`. All five `✗` rows are on `#toastUndo` and none is on `#toast`. That is the expected, intended result.

## What I did NOT do
- I answered none of open decisions 1–8 and applied none of decisions 2/5/6/7 on my own.
- I did not try the browser MCPs again (decision 4: they are blocked by permissions).
- I did not restore `docs/design-parity.md` (decision 8).

## Risk
- Low. The diff for this round is documentation only (`AUTOPILOT.md`, `SUMMARY.md`) on top of a tree-identical restore.
- The project is still stalled on owner input. Further rounds cannot move any acceptance criterion until someone answers a decision in `README.md → ## Open decisions` or drops `jspdf.umd.min.js` into the repo.
- The runner still cuts every branch from `3503537`. If a future round skips the restore, it will wrongly conclude that the work is finished.
