# SUMMARY — round `2026-11-23_0036`

## What I did
- Restored the previous round's tip `ebec592` (`2026-11-23_0025`) onto this branch. The runner
  had cut it from the stale base `3503537` again. The restore is its own commit, and the trees
  match: `HEAD^{tree}` = `ebec592^{tree}` = `19207803b5c84dca2c80b656c707180adcfee27e`.
- Checked all five owner-answer channels and found no answer in any of them, so this round is a
  no-op, as the queued Next task requires.
- Ran Verify and all five parity-harness keys. Every result matched its expected value.
- Added this round's block to `## Next task` in `AUTOPILOT.md` and moved the restore target to
  `2026-11-23_0036`.

## Why
- The prompt's `## Next task` arrived empty, so I followed the one in the restored `AUTOPILOT.md`.
  It says: if nobody has answered an entry under `## Open decisions` in `README.md`, restore, check,
  verify, write SUMMARY, and stop. It also says not to invent other work.
- All eight open decisions change pixels or add files, so only the owner can make them. I answered
  none of them.

## Verification
- `git for-each-ref --sort=-committerdate`, run before the restore: row 1 was `ebec592` `_0025`
  (local and `origin/` agree). 11-23 then held 3 tips: `ebec592`, `3a88062`, `9980046`. My own
  ref still pointed at `3503537`.
- The prediction from the previous round was checked live and came out **HEADS**.
  `node -e "console.log('ebec592'<'9980046')"` printed `false`, so the wrong ranking formula would
  have picked the real tip by luck this time. Record: tails 144/221 (144/217).
- Owner channels: `README.md` still has 8 `| Option | Cost |` tables and 8 `If you answer:`
  lines. There is no `jspdf*` file. `git status` is clean. `main`, `origin/main` and `mac/main`
  are all `ef3220e`. The newest non-auto ref is `design-system` at `3503537`, dated 2026-08-13.
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  passed. It printed `54 passed, 0 failed`, then tokens 22/22, fonts 4/4, and four checks that
  each scanned 15 CSS sources, then `Tests 31 passed (31)`.
- Harness, all five keys:
  - `buttons` (`2488f2d:index.html` → live): PASS, 85 pairs across 17 elements.
  - `segmented` (`021b966:index.html` → live): PASS, 45 pairs across 9 elements.
  - `toast` (`de07ea8:index.html` → `10e8f39:index.html`): PASS, 5 pairs across 1 element.
  - `ds-disabled-hover` (`ebec592:design-system/src/styles.css` → live): PASS, 15 pairs across
    3 elements, plus 1 undecidable rule.
  - `toast-hit` (`3d3d5cc:index.html` → live): `FAIL — 5 declaration(s) differ` across 10 pairs.
    This is the expected result, because the key exists to show the intended pointer-events change.
    All five ✗ rows are `#toastUndo`, and none are `#toast`.

## What I did NOT do
- I didn't answer, apply or reword any of the eight open decisions (jsPDF, chip padding, spacing
  scale, browser verification, segmented padding, input sizes, disabled-hover, design-parity.md).
- I didn't touch any CSS, the JS, the tests, or the Verify command.
- I didn't tick any acceptance-criterion box, because none changed state.

## Risk
- Low. The diff on top of the restore is docs only: `AUTOPILOT.md` and this file.
- The real risk is still outside the repo. Every round branch is cut from `3503537`, so merging
  any single `auto/*` branch other than the newest one would drop later work. Merge the newest one
  only.
- Nothing has been checked in a real browser. Decision 4 is still unanswered.
- If the next round is still on 11-23 it must measure the prediction live. 11-23 will hold 4 tips
  and the comparand becomes `ebec592`. The result is TAILS if this round's closing sha sorts below
  `ebec592`.
