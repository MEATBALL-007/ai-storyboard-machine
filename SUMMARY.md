# SUMMARY — round `2026-11-23_0025`

## What I did
- Restored the previous round's tip `3a88062` (`2026-11-23_0015`) onto this branch. The runner
  had cut it from the stale base `3503537` again. The restore is its own commit, and the trees
  match: `HEAD^{tree}` = `3a88062^{tree}` = `5fdd2fe6242eb3290a48c40f94a07f781b8d1e28`.
- Checked all five owner-answer channels and found no answer in any of them, so this round is a
  no-op, as the queued Next task requires.
- Ran Verify and all five parity-harness keys. Every result matched its expected value.
- Added this round's block to `## Next task` in `AUTOPILOT.md` and moved the restore target to
  `2026-11-23_0025`.

## Why
- The prompt's `## Next task` arrived empty, so I followed the one in the restored `AUTOPILOT.md`:
  if nobody has answered an entry under `## Open decisions` in `README.md`, restore, check,
  verify, write this file, and stop. Hard rule 5 forbids inventing a substitute task.
- Every remaining acceptance criterion is blocked on one of the eight owner decisions in
  `README.md` (jsPDF vendoring, chip/segmented/input sizes, spacing scale, browser verification,
  disabled-hover guards, `docs/design-parity.md`). Each one moves pixels or adds a file, so the
  owner has to make the call.
- Restore-target A/B (the record kept in `AUTOPILOT.md`): 11-23 held 2 tips before the restore.
  Ranked by committer date, the real tip `3a88062` is row 1. Sorting by sha instead (the "trap" form)
  would put `9980046` first, because `node -e "console.log('3a88062'<'9980046')"` printed `true`.
  That makes this round TAILS, and the record is now 144/220 (144/216).

## Verification
- `git rev-parse HEAD^{tree} 3a88062^{tree}` printed `5fdd2fe6…` for both.
- Channels: `grep -c "| Option | Cost |" README.md` printed 8, `grep -c "If you answer:"` printed 8,
  `git ls-files | grep -i jspdf` printed nothing, `git status --short --untracked-files=all`
  printed nothing, `main`/`origin/main` = `ef3220e` (2026-06-27), and the newest non-`auto/*` ref is
  `design-system` `3503537` (2026-08-13).
- Verify `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  passed with exit 0: `54 passed, 0 failed`; tokens 22/22, fonts 4/4, and the four literal checks
  all clean across 15 CSS sources; vitest `12 passed (12)` files, `31 passed (31)` tests.
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS, markup OK
  - `segmented 021b966:index.html index.html` → 45 / 9, PASS, markup OK
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS, markup OK
  - `ds-disabled-hover 3a88062:design-system/src/styles.css design-system/src/styles.css` → 15 / 3,
    PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html` → 10 pairs, `FAIL — 5 declaration(s) differ`. This
    is the expected result. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
    `:disabled:hover`, `:focus`) and none is `#toast`.

## What I did NOT do
- I did not answer or act on any open decision. That includes vendoring jsPDF, changing any
  padding or size, and restoring `docs/design-parity.md`.
- I did not retry the browser MCPs. They are blocked by permissions.
- No CSS, JS, or test changes. The only edits are `AUTOPILOT.md` (the round record) and this file.

## Risk
- Low. Nothing outside the docs changed after the restore, and tree identity proves the restore
  matches `3a88062` on every path.
- The real risk is the stall itself. Nothing in the repo moves until the owner answers a decision
  in `README.md → ## Open decisions`, and until then every round is a no-op like this one.
