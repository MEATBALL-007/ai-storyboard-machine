# SUMMARY — round `2026-11-01_0027`

## What I did
- Restored the previous round's tip `0b66eba` (`2026-11-01_0017`) onto the stale base `3503537` in a separate commit. The runner cut this branch from `3503537` again.
- Checked the five owner-answer channels. None of them has an answer, so I applied none of the eight open decisions.
- Ran the three-stage Verify command and all five `docs/btn-parity-proof.mjs` keys.
- Added this round's entry to `AUTOPILOT.md → ## Next task` and pointed the next restore at `_0027`'s tip.

## Why
- The prompt's `## Next task` arrived empty. The restored `AUTOPILOT.md` says to run a no-op round while `README.md → ## Open decisions` has no answers, and none has arrived. Hard rule 5 forbids inventing a substitute task.
- This round counts in the restore-ranking record. My own ref still pointed at `3503537` when I picked the tip, so `2026-11-01` held two tips. Ranking with `--sort=-committerdate` put `0b66eba` (`_0017`) first, which is correct. The sha-sorted `| sort -r` form would have put `f80e8c8` first and dropped `_0017` (`node -e "console.log('0b66eba'<'f80e8c8')"` → `true`). Record: tails 101/156 (101/152).

## Verification
- `git rev-parse HEAD^{tree} 0b66eba^{tree}` printed the same sha twice (`f80971afaaa3875e1b037be523813a564fec0bff`), so the restore matches on every path.
- Channels: `grep -c "| Option | Cost |" README.md` → 8, `grep -c "If you answer:" README.md` → 8, `git ls-files | grep -i jspdf` → nothing, `git status --short --untracked-files=all` → clean, `main` = `ef3220e`, newest non-`auto/*` ref dated 2026-08-13.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` printed `54 passed, 0 failed`, 22/22 tokens, 4/4 fonts, four scan checks over 15 CSS sources, then `Tests 31 passed (31)`.
- Harness:
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS
  - `ds-disabled-hover 0b66eba:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`). This is the expected result for that key.

## What I did NOT do
- I left all eight open decisions in `README.md` unanswered. Each one either moves pixels or adds a file, so the owner has to make them.
- I made no changes to `index.html`, `design-system/`, or `tools/`.
- I didn't try the browser MCPs, which are permission-blocked (decision 4).

## Risk
- None from code: this round changed only `AUTOPILOT.md` and `SUMMARY.md` on top of an exact restore.
- The stall is still there. Every acceptance criterion left open is waiting on the owner's answers in `README.md → ## Open decisions`, and more rounds won't change that.
