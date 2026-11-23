# SUMMARY — round `2026-11-24_0006`

## What I did
- Restored the previous round's tip `df67579` (`2026-11-23_0036`) onto this branch. The runner cut
  it from the stale base `3503537` again. The restore is its own commit, and the trees match:
  `HEAD^{tree}` = `df67579^{tree}` = `721ea45c517f1fdd7d9a31bacbd01e21bcf49ca9`.
- Checked all five owner-answer channels and found no answer, so this round is a no-op, as the
  queued Next task requires.
- Ran Verify and all five parity-harness keys. Every result matched its expected value.
- Added this round's block to `## Next task` in `AUTOPILOT.md` and moved the restore target to
  `2026-11-24_0006`.

## Why
- The prompt's `## Next task` arrived empty, so I followed the one in the restored `AUTOPILOT.md`.
  It says that if nobody has answered an entry under `## Open decisions` in `README.md`, the round
  restores, checks, verifies, writes SUMMARY and stops. Hard rule 5 forbids inventing a substitute.
- I chose the restore target with `for-each-ref --sort=-committerdate`, not by sorting shas. On
  2026-11-23 the sha sort would have picked `ebec592` (`node -e` gave `'df67579' < 'ebec592'` →
  `true`) and thrown away `_0036`. This was a live measurement, so the record is now tails 145/222.
- Before restoring, I checked the tip's author (`PHANTOM AUTOPILOT <autopilot@phantom.local>`) and
  confirmed `3503537` is its ancestor. That shows the tip is the runner's own commit, not an owner
  answer, and that checking out its paths is equivalent to a fast-forward.

## Verification
- Owner-answer channels:
  - `grep -c "| Option | Cost |" README.md` → 8, and `grep -c "If you answer:"` → 8.
  - No `jspdf` file is tracked or present.
  - `git status` is clean.
  - `main` = `ef3220e`.
  - The newest non-`auto/*` ref is dated 2026-08-13.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` printed:
  - `54 passed, 0 failed`
  - tokens 22/22, fonts 4/4, and the colour, weight, radius and font-family checks each across
    15 CSS sources
  - `Tests 31 passed (31)`
- Harness:
  - `buttons` (`2488f2d`→live): 85 pairs / 17 elements, PASS.
  - `segmented` (`021b966`→live): 45 / 9, PASS.
  - `toast` (`de07ea8`→`10e8f39`): 5 / 1, PASS.
  - `ds-disabled-hover` (`df67579:design-system/src/styles.css`→live): 15 / 3, PASS, plus 1
    undecidable rule.
  - `toast-hit` (`3d3d5cc`→live): `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗`
    rows are `#toastUndo` (`pointer-events` `(unset)`→`auto`). This is the expected, deliberate
    result.

## What I did NOT do
- I did not answer or apply any of the eight open decisions (jsPDF, chip/segmented/input
  padding, spacing scale, browser verification, disabled-hover, `docs/design-parity.md`). Each one
  moves pixels or adds files, so the owner has to make the call.
- I did not tick any acceptance criterion. None changed state this round.

## Risk
- Low. The only change beyond the byte-exact restore is documentation (`AUTOPILOT.md` and this
  file). The integration stays stalled until a person answers `README.md → ## Open decisions`;
  more rounds will not clear it.
