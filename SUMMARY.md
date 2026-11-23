# SUMMARY — round `2026-11-24_0026`

## What I did
- This branch was cut from the stale base `3503537` again, so I restored the previous round's tip, `a245a7c` (`2026-11-24_0016`). The local ref and `origin/` agreed on that sha. I restored with `git checkout a245a7c -- .` and committed the restore separately. `HEAD^{tree}` is `9ef27215…`, the same tree as `a245a7c`.
- I checked all five places an owner answer could appear and found none, so the restored `## Next task` makes this a no-op round.
- I ran the full Verify command and all five parity-harness keys. Every result matches what earlier rounds recorded.
- I added a `2026-11-24_0026` entry to `AUTOPILOT.md` under `## Next task`. The next round should restore this round's tip.

## Why
- The prompt's `## Next task` was empty, and the prompt's contract describes the stale tree. The real task exists only in the restored `AUTOPILOT.md`. It says that if no owner decision has been answered, the round restores, checks, verifies, writes this SUMMARY, and stops. Rule 5 forbids inventing a substitute task.
- This round was a live A/B measurement, as `_0016` predicted. Before the restore, 2026-11-24 had 2 tips: `a245a7c` and `7aad560`. The trap method (ranking tips by sha) would have picked `a245a7c`, because `node -e "console.log('a245a7c' < '7aad560')"` printed `false`. That is the real tip, so the result was HEADS, by luck. The record is now **tails 145/223 (145/219)**.

## Verification
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` exited 0:
  - `54 passed, 0 failed`
  - `tokens in sync: 22/22`, `fonts in sync: 4/4`, and the derived-colour, font-weight, radius and font-family checks all passed across 15 CSS sources
  - vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- Parity harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html` → markup OK, 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → markup OK, 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → markup OK, 5 / 1, PASS
  - `ds-disabled-hover a245a7c:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, with 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none is `#toast`. This is the expected result.
- Owner-answer checks:
  - README `grep -c "| Option | Cost |"` = 8 and `grep -c "If you answer:"` = 8
  - no `jspdf*` file in the repo
  - `git status` is clean
  - `main` is still `ef3220e`
  - the newest non-`auto/*` ref is from 2026-08-13

## What I did NOT do
- I didn't answer, apply or work around any of the eight open decisions in README `## Open decisions`. All of them are the owner's call.
- I didn't change any code, CSS, tests or the Verify command.
- I didn't retry the browser MCPs. They are permission-blocked (decision 4).

## Risk
- Low. The only changes are the restore commit, which is tree-identical to `a245a7c`, plus documentation edits to `AUTOPILOT.md` and `SUMMARY.md`.
- The project is still stalled on owner input. Until someone answers a decision in README `## Open decisions` (or drops in `jspdf.umd.min.js` for decision 1), every round will be a no-op like this one. Merging one round branch into `main` would also let the runner stop cutting branches from the stale `3503537`.
