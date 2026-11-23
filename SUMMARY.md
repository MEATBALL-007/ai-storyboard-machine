# SUMMARY — round `2026-11-24_0036`

## What I did
- This branch was cut from the stale base `3503537` again, so I restored the previous round's tip, `c37afe1` (`2026-11-24_0026`). The local ref and `origin/` agreed on that sha. I restored with `git checkout c37afe1 -- .` and committed the restore separately. `HEAD^{tree}` and `c37afe1^{tree}` both print `8f755b9abecc375dbf7a124372d3cf1c7220cb34`.
- I checked all five places an owner answer could appear and found none, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-24_0036`.

## Why
- The prompt's "Next task" was empty. The repo's own `## Next task` says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They are, so I did not invent other work (hard rule 5).
- Sha-based ranking (the wrong method) came up HEADS this round. On 11-24, `c37afe1` sorts above `a245a7c` and `7aad560` (`node -e` printed `false false` for both `<` comparisons), so it happened to pick the real tip. Tally of the wrong method: tails 145/224 (145/220).

## Verification
- `git for-each-ref --sort=-committerdate`: top row `c37afe1` `_0026` (local and `origin/`), then `a245a7c` `_0016` and `7aad560` `_0006`. My own ref still pointed at `3503537`.
- Five channels:
  - `README.md`: `| Option | Cost |` = 8 and `If you answer:` = 8.
  - No tracked or untracked `jspdf` file.
  - `git status` is clean.
  - `main` is still `ef3220e`.
  - The newest non-`auto/*` ref is from 2026-08-13.
- Verify: `node tools/test.mjs` → `54 passed, 0 failed`. `check-tokens.mjs` → 22/22 tokens, 4/4 fonts, and four checks over 15 CSS sources, all OK. `npm --prefix design-system test` → `31 passed (31)`.
- Harness results:
  - `buttons` (`2488f2d:index.html` → live): 85 pairs / 17 elements, PASS
  - `segmented` (`021b966:index.html` → live): 45 / 9, PASS
  - `toast` (`de07ea8:index.html` → `10e8f39:index.html`): 5 / 1, PASS
  - `ds-disabled-hover` (`c37afe1:design-system/src/styles.css` → live): 15 / 3, PASS, plus 1 undecidable rule
  - `toast-hit` (`3d3d5cc:index.html` → live): `FAIL — 5 declaration(s) differ` over 10 pairs, which is the expected result. All five `✗` rows are `#toastUndo` (`pointer-events` `(unset)` → `auto` from `.toast-act`), and there are none for `#toast`.

## What I did NOT do
- I did not answer or apply any of open decisions 1–8 (jsPDF, chip/segmented/input padding, spacing scale, browser verification, disabled-hover, `docs/design-parity.md`). Each one moves pixels or adds a file, so the owner has to decide.
- I made no CSS, JS, or test changes.

## Risk
- Low. The only changes are the restore commit (tree identical to `c37afe1`) and edits to `AUTOPILOT.md` and SUMMARY.md.
- The project is still stalled on the owner. Rounds will stay no-ops until someone answers a decision in `README.md`.
