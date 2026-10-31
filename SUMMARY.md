# SUMMARY — round `2026-11-01_0037`

## What I did
- Restored the previous round's tip `b8210f6` (`2026-11-01_0027`) onto the stale base `3503537` in a separate commit. The runner cut this branch from `3503537` again.
- Checked the five owner-answer channels. None has an answer, so I applied none of the eight open decisions.
- Ran the three-stage Verify command and all five `docs/btn-parity-proof.mjs` keys.
- Added this round's entry to `AUTOPILOT.md → ## Next task` and pointed the next restore at `_0037`'s tip.

## Why
- The prompt's `## Next task` arrived empty. The restored `AUTOPILOT.md` says to run a no-op round while `README.md → ## Open decisions` has no answers, and none has arrived. Hard rule 5 forbids inventing a substitute task.
- This round counts in the restore-ranking record. After I dropped my own ref (`_0037`), `2026-11-01` held three tips. Ranking with `--sort=-committerdate` put `b8210f6` (`_0027`) first, which is correct. The sha-sorted `| sort -r` form put `f80e8c8` (`_0007`) first, which would have dropped both `_0017` and `_0027` (`node -e "console.log('b8210f6'<'f80e8c8','0b66eba'<'f80e8c8')"` → `true true`). Record: tails 102/157 (102/153).

## Verification
- `git rev-parse HEAD^{tree} b8210f6^{tree}` printed the same sha twice (`9964dfe73c4e88eb32c4eb641c2426bc2f3f1481`), so the restore matches on every path.
- Channels: `grep -c "| Option | Cost |" README.md` → 8, `grep -c "If you answer:" README.md` → 8, `git ls-files | grep -i jspdf` → nothing, `git status --short --untracked-files=all` → clean, `main` = `ef3220e`, newest non-`auto/*` ref dated 2026-08-13.
- Verify `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`, run bare (exit 0): `54 passed, 0 failed`. check-tokens reported all 6 checks OK (22/22 tokens, 4/4 fonts, 15 CSS sources for the four scan checks). vitest: `12 passed (12)` files, `31 passed (31)` tests.
- Harness:
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS
  - `ds-disabled-hover b8210f6:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), with `after : auto <- .toast-act`. This is the expected result for this key.

## What I did NOT do
- I answered none of the eight open decisions (jsPDF, chip padding, spacing scale, browser verification, segmented padding, input sizes, disabled-hover, `docs/design-parity.md`). Each one moves pixels or adds a file, so the owner has to make the call.
- I did not retry the browser MCPs. They are permission-blocked.
- I made no change to `index.html`, the design-system CSS, the tests or the tooling.

## Risk
- Low. The only content change is docs (`AUTOPILOT.md`, `SUMMARY.md`), and the restore is tree-identical to `b8210f6`.
- The next round is a live tiebreak whether it runs on 11-01 or 11-02. Either way the newest date left after it drops its own ref is 11-01, with four tips. The comparand is `f80e8c8`, so the result is TAILS if this round's closing sha sorts below it.
- The underlying stall still needs a person. Every round branch is cut from `3503537`, and all remaining acceptance criteria are blocked on the owner decisions in `README.md`.
