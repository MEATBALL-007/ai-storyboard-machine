# SUMMARY — round 2026-11-17_0017

## What I did
- Restored the previous round's tip `4d6c8f7` (`2026-11-17_0007`) onto this branch. The runner cut
  it from the stale base `3503537` again. The restore is its own commit, and tree identity holds:
  `HEAD^{tree}` = `4d6c8f7^{tree}` = `a7d0be97fc7a…`.
- Checked all five owner-answer channels. None had an answer, so this is a no-op round, which is
  what the restored `## Next task` says to do when nothing has been answered.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and pointed the "tip to restore" line at
  `2026-11-17_0017`. This round was MASKED (only one tip on 11-17), so no A/B was run and the
  trap-form tally is unchanged at 133/202.

## Why
- The prompt's `## Next task` arrived empty. The real task lives in the restored `AUTOPILOT.md`: if
  no owner decision has been answered, restore, check the channels, verify, write SUMMARY, and stop.
  Hard rule 5 and the file both forbid inventing substitute work. Everything left either moves pixels
  or adds a file, and those calls belong to the owner (README `## Open decisions`, items 1–8).

## Verification
- `git merge-base --is-ancestor 3503537 4d6c8f7` returned exit 0 (no output).
- `git rev-parse HEAD^{tree} 4d6c8f7^{tree}` printed `a7d0be97fc7ab042db92a881182f76c47b9f11e3` twice.
- Channels: `grep -c "| Option | Cost |" README.md` → 8 and `grep -c "If you answer:"` → 8 (they agree,
  so nothing was answered). No `jspdf*` file. `git status --short --untracked-files=all` was empty.
  `main` / `origin/main` / `mac/main` = `ef3220e`. The newest non-`auto/*` ref is 2026-08-13
  (`design-system` = `3503537`).
- Verify `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`, run
  bare: `54 passed, 0 failed`. check-tokens printed 6 green lines (tokens 22/22, fonts 4/4, and 4 scans
  over 15 CSS sources). vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`.
- Harness `docs/btn-parity-proof.mjs`:
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 4d6c8f7:design-system/src/styles.css design-system/src/styles.css`: 15 / 3,
    PASS, plus 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs. All
    five `✗` rows are `#toastUndo` (`pointer-events` `(unset)` → `auto`) and none is `#toast`. This
    is the intended result.

## What I did NOT do
- I did not answer or apply any open decision. Decisions 2, 5, 6 and 7 change pixels, 1 adds a file,
  4 needs a permission change, 3 changes the design scale, and 8 is a git-history question.
- I did not retry the browser MCPs, since decision 4 has not been granted.
- I did not run the trap-form A/B, because the round was MASKED.

## Risk
- Low. This round's diff is the restore commit plus documentation in `AUTOPILOT.md` and `SUMMARY.md`.
  No code or CSS changed.
- The stall continues: every acceptance criterion left open is blocked on owner decisions in
  `README.md → ## Open decisions`. More rounds won't unblock it. Only an owner answer will.
