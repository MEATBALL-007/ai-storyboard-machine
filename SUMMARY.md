# SUMMARY — round 2026-11-15_0012

## What I did
- Restored the previous round's tip `42398a5` (`2026-11-15_0002`) onto this branch. The runner cut
  it from the stale base `3503537` again. The restore is its own commit, and tree identity holds:
  `HEAD^{tree}` = `42398a5^{tree}` = `45f7433bd699…`.
- Checked all five owner-answer channels. None has an answer, so this is a no-op round. That is what
  the restored `## Next task` says to do when nothing is answered.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and pointed the "tip to restore" line at
  `2026-11-15_0012`.

## Why
- The prompt's `## Next task` arrived empty. The real task is in the restored `AUTOPILOT.md`. It says
  that if `README.md → ## Open decisions` has no answer, a round only restores, checks, verifies and
  stops. Hard rule 5 rules out inventing a substitute task.
- I picked the tip with `git for-each-ref --sort=-committerdate` while my own ref was still on
  `3503537`. `2026-11-15` held exactly one tip (`42398a5`, matching on local and `origin/`), so the
  round is **MASKED** as `_0002` predicted. I ran no A/B and left the tally at 129/196.

## Verification
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`, run bare,
  exited 0: `54 passed, 0 failed`; check-tokens 22/22 tokens, 4/4 fonts, and all four
  lint checks clean across 15 CSS sources; vitest `12 passed (12)` files, `31 passed (31)` tests.
- Owner channels: `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8
  (they agree); `git ls-files | grep -i jspdf` printed nothing; `git status --short
  --untracked-files=all` printed nothing; `main` = `ef3220e` (2026-06-27); the newest non-`auto/*`
  ref is `design-system` / `origin/design-system` at 2026-08-13.
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 42398a5:design-system/src/styles.css design-system/src/styles.css`: 15 / 3,
    PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html`: exit 1, `FAIL — 5 declaration(s) differ` across 10
    pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`,
    `:focus`) and none is `#toast`. That is the intended result.

## What I did NOT do
- I did not answer or act on any of the eight open decisions. Each one moves pixels or adds a file,
  so each is the owner's call.
- I did not retry the browser MCPs (decision 4). They are blocked by permissions, not by the lack
  of a display.
- I did not touch `index.html`, any `.css` file, the test markers, or `storyboard-simulator.html`.

## Risk
- Low. The only content changes are the restore, which is tree-identical to `42398a5`, and two
  documentation files (`AUTOPILOT.md`, `SUMMARY.md`).
- The project has stalled. Every acceptance criterion still open is waiting on an owner decision in
  `README.md → ## Open decisions`, and more rounds cannot change that. The runner also still cuts
  every branch from `3503537`, so nothing reaches `main`.
- Next round's tiebreak: `2026-11-15` will hold two tips. The trap form gives TAILS (and drops
  `_0012`) if this round's closing sha sorts below `42398a5`. The real tip still has to be read
  from `for-each-ref --sort=-committerdate`.
