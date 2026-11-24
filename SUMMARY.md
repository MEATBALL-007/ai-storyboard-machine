# SUMMARY — round `2026-11-25_0006`

## What I did
- This branch was cut from the stale base `3503537` again, so I restored the previous round's tip, `e35c856` (`2026-11-24_0036`, author PHANTOM AUTOPILOT). The local ref and `origin/` agreed on that sha. I restored with `git checkout e35c856 -- .` and committed the restore separately. `HEAD^{tree}` and `e35c856^{tree}` both print `4f35cc70210514923a79724c7a2b7177eeb807f1`.
- I checked all five places an owner answer could appear and found none, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-25_0006`.

## Why
- The prompt's "Next task" was empty. The repo's own `## Next task` says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They are, so I did not invent other work (hard rule 5).
- Sha-based ranking (the wrong method) came up HEADS this round. On 11-24, `e35c856` sorts above `c37afe1`, `a245a7c` and `7aad560` (`node -e` printed `false false false` for the three `<` comparisons), so it happened to pick the real tip. Tally of the wrong method: tails 145/225 (145/221).
- This is the only round on 11-25 so far, so the next round is MASKED: both ranking methods will give the same answer, and it should not be counted.

## Verification
- `git for-each-ref --sort=-committerdate`: top row `e35c856` `_0036` (local and `origin/`), then `c37afe1` `_0026`, `a245a7c` `_0016` and `7aad560` `_0006`. My own ref still pointed at `3503537`.
- `git merge-base --is-ancestor 3503537 e35c856` → `ancestor-ok`.
- Five channels:
  - `README.md`: `| Option | Cost |` = 8 and `If you answer:` = 8.
  - `git ls-files | grep -i jspdf`: nothing.
  - `git status --short --untracked-files=all`: clean.
  - `main` = `ef3220e` (2026-06-27).
  - Non-`auto/*` refs: the newest is `design-system` / `origin/design-system` at 2026-08-13.
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`): `54 passed, 0 failed`; tokens 22/22, fonts 4/4, and four checks over 15 CSS sources all passed; vitest `12 passed (12)` files, `31 passed (31)` tests.
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html` → markup OK, 85 pairs / 17 elements, PASS.
  - `segmented 021b966:index.html index.html` → markup OK, 45 / 9, PASS.
  - `toast de07ea8:index.html 10e8f39:index.html` → markup OK, 5 / 1, PASS.
  - `ds-disabled-hover e35c856:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, plus 1 undecidable rule.
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none are `#toast`. This FAIL is the expected result: the key exists to show the deliberate `pointer-events:auto` fix.

## What I did NOT do
- I did not answer any of the eight open decisions (jsPDF, chip padding, spacing/type scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`). Each one moves pixels or adds a file, so the owner has to decide.
- I made no changes to `index.html`, `design-system/`, `tools/` or the tests.
- I did not try the browser MCPs, which are permission-blocked.

## Risk
- Low. The only content change on top of the restore is documentation (`AUTOPILOT.md` and `SUMMARY.md`).
- The project is stalled until the owner answers something in `README.md → ## Open decisions`, or drops `jspdf.umd.min.js` at the repo root. More rounds will not change that.
