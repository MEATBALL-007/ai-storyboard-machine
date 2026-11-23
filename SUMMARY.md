# SUMMARY — round `2026-11-24_0016`

## What I did
- Restored the previous round's tip `7aad560` (`2026-11-24_0006`) onto this branch. The branch had been cut from the stale base `3503537` again. I confirmed `3503537` is an ancestor of `7aad560`, then restored with `git checkout 7aad560 -- .` and committed it as its own commit. `HEAD^{tree}` and `7aad560^{tree}` are the same tree, `4d572e37…`.
- Checked all five owner-decision channels. None of them has an answer, so per the restored `## Next task` this is a no-op round.
- Ran the full Verify command and all five parity-harness keys. Every result matches what the previous rounds recorded.
- Added a `2026-11-24_0016` entry to `AUTOPILOT.md` → `## Next task`. The next tip to restore is now this round's.

## Why
- The prompt's `## Next task` arrived empty, and the prompt contract described the stale tree. The real task lives only in the restored `AUTOPILOT.md`. It says: if no owner decision has been answered, restore, check, verify, write SUMMARY, and stop. Rule 5 forbids inventing a substitute task.
- This round is MASKED. Before the restore, 2026-11-24 held only one tip (`7aad560`), so the correct and incorrect tip-ranking methods give the same result by construction. I ran no A/B test and left the record at 145/222.

## Verification
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`, run bare, exited 0:
  - `54 passed, 0 failed`
  - tokens 22/22; fonts 4/4 byte-identical; the derived-colour, font-weight, radius and font-family checks each scanned 15 CSS sources with no findings
  - vitest: 12 files, `31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS, markup OK
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS, markup OK
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 7aad560:design-system/src/styles.css design-system/src/styles.css`: 15 / 3, PASS, plus 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html`: 10 pairs, `FAIL — 5`. This is the expected result. All five `✗` rows are `#toastUndo` (base, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none are `#toast`.
- Channels:
  - `grep -c "| Option | Cost |" README.md` = 8, and `grep -c "If you answer:"` = 8
  - no file matching `jspdf*`
  - `git status` is clean
  - `main`, `origin/main` and `mac/main` are all still `ef3220e`
  - the newest non-`auto/*` ref is dated 2026-08-13

## What I did NOT do
- I did not answer, apply or work around any of the eight open decisions in `README.md` (jsPDF, chip padding, spacing scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`). They change pixels or repo contents, so the owner has to decide them.
- I made no changes to CSS, JS or tests, and I did not edit the Verify command.
- I did not retry the browser MCPs. They are blocked by permissions, not by the lack of a display.

## Risk
- Low. The only change beyond the restore is text in `AUTOPILOT.md` and this file.
- The real risk is still the runner. Every round's branch is cut from `3503537`, so merging any single `auto/*` branch other than the newest would drop work. Only the newest tip holds everything.
- The integration criteria cannot move until an owner answers a decision in `README.md` → `## Open decisions`. More rounds will not change that.
