# SUMMARY — round `2026-11-12_0001`

## What I did
- The runner cut this branch from the stale base `3503537` again. I restored the previous round's tip `c989bf0` (`2026-11-11_0034`) onto it as its own commit (`43c09fc`). `HEAD^{tree}` and `c989bf0^{tree}` both print `dc4a5c8e00d7d8bd160f0442e548b3cee3a01719`, so every path matches.
- Checked all five owner-answer channels. None of them has an answer.
- Ran the Verify command and all five `docs/btn-parity-proof.mjs` harness keys. Every result matches the previous round.
- Added this round's entry to `AUTOPILOT.md → ## Next task` (commit `125c486`). The "tip to restore next" line now points at `2026-11-12_0001`. The task itself is unchanged.

## Why
- The prompt's `## Next task` arrived empty, so I followed the one in the restored `AUTOPILOT.md`. It says that while none of the eight `README.md → ## Open decisions` items has an answer, the round is a no-op: restore, check the channels, verify, write SUMMARY, and invent nothing else. Hard rule 5 says the same.
- I restored before reading any project file. On the stale tree the work looks finished rather than broken, so reading first is how earlier rounds went wrong.
- I measured the A/B forecast live. After dropping my own ref (`43c09fc`, dated 11-12), the newest date 2026-11-11 held four tips. The correct formula (`--sort=-committerdate`) put the real tip `c989bf0` (`_0034`) at row 1. The wrong formula (short date + sha + `sort -r`) put `e9fefaf` (`_0014`) at row 1 and sank the real tip to row 3/4. Applying the wrong formula would have discarded `_0024` and `_0034`. The result is TAILS, as `_0034` forecast. The wrong-formula record is now **tails 125/187 (125/183)**.

## Verification
- **Tip selection:** `git for-each-ref --sort=-committerdate` put `c989bf0` (`_0034`) at row 1, and the local and `origin/` refs agree (tree `dc4a5c8`).
- **Restore:** `git rev-parse HEAD^{tree} c989bf0^{tree}` printed the same sha twice (`dc4a5c8e…`).
- **Owner channels:**
  1. README: `grep -c "| Option | Cost |"` = 8 and `grep -c "If you answer:"` = 8, so the counters agree and nothing is answered.
  2. No `jspdf*` file is tracked or present.
  3. `main` = `ef3220e` (2026-06-27).
  4. `git status --short --untracked-files=all` is empty.
  5. The newest non-`auto/*` ref is 2026-08-13 (`design-system`/`origin/design-system` = `3503537`).
- **Verify** (run bare): `node tools/test.mjs` printed `54 passed, 0 failed`. `node tools/check-tokens.mjs` passed all six checks (22/22 tokens, 4/4 fonts, and the colour/weight/radius/font-family checks across 15 CSS sources). `npm --prefix design-system test` printed 12 files and 31 tests passed.
- **Harness:**
  - `buttons` (`2488f2d`→live): 85 pairs / 17 elements, PASS, markup OK.
  - `segmented` (`021b966`→live): 45/9, PASS.
  - `toast` (`de07ea8`→`10e8f39`): 5/1, PASS.
  - `ds-disabled-hover` (`c989bf0:design-system/src/styles.css`→live): 15/3, PASS + 1 undecidable rule.
  - `toast-hit` (`3d3d5cc`→live): `FAIL — 5 declaration(s) differ` across 10 pairs, which is the expected result. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), each with `after : auto <- .toast-act`. No row is `#toast`.

## What I did NOT do
- I did not answer or act on any of the eight open decisions (jsPDF, chip padding, spacing scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`). Each one moves pixels or adds a file, so they are the owner's call.
- I did not tick any acceptance box, because nothing new was completed.
- I did not open a browser. Decision 4 is still unanswered, and the MCPs are permission-blocked.

## Risk
- This round changed no code. The only content diff is the new block in `AUTOPILOT.md`. The restore commit `43c09fc` is large because the branch base is stale, but its tree is byte-identical to `c989bf0`.
- The project has been stalled for weeks on owner decisions. More rounds will not change that; a person needs to answer `README.md → ## Open decisions`.
- The next round on 2026-11-12 is **MASKED** for the A/B record (only one tip that day after it drops its own ref). If this round isn't pushed, the newest date falls back to 11-11, where the wrong formula would again restore the wrong tip (`e9fefaf`).
