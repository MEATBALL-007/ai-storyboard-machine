# SUMMARY — round `2026-11-01_0017`

## What I did
- Restored the previous round's tip `f80e8c8` (`2026-11-01_0007`) onto the stale base `3503537` in its own commit. The runner cut this branch from `3503537` again.
- Checked the five owner-answer channels. None has an answer, so I did not apply any of the eight open decisions.
- Ran the three-stage Verify command and all five `docs/btn-parity-proof.mjs` keys.
- Added this round's entry to `AUTOPILOT.md → ## Next task` and pointed the next restore at `_0017`'s tip.

## Why
- The prompt's `## Next task` arrived empty. The restored `AUTOPILOT.md` queues a no-op round whenever `README.md → ## Open decisions` is unanswered, and it still is. Hard rule 5 forbids inventing a substitute task.
- This round is **MASKED**. When I picked the tip, my own ref still pointed at `3503537`, and `2026-11-01` held only `f80e8c8`. With one candidate on the deciding date the A/B has nothing to compare, so I didn't run it and the record stays at 100/155 (100/151).

## Verification
- `git rev-parse HEAD^{tree} f80e8c8^{tree}` printed the same sha twice (`45e88726608c986e7cf82adddd792b33c8bccbd8`), so the restore matches on every path.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` printed `54 passed, 0 failed`, 22/22 tokens, 4/4 fonts, 4 scan checks over 15 CSS sources, then `Tests 31 passed (31)`.
- Harness:
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS
  - `ds-disabled-hover f80e8c8:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` over 10 pairs. All five ✗ rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none are `#toast`. That is this key's expected result.
- Channels:
  - `README.md` still has 8 `| Option | Cost |` tables and 8 `If you answer:` lines
  - no `jspdf` file is tracked or present
  - `git status` is clean
  - `main` = `ef3220e`
  - the newest non-`auto/*` ref is from 2026-08-13

## What I did NOT do
- I did not answer or apply any of open decisions 1–8, because each one moves pixels or adds a file, and that is the owner's call.
- I did not retry the browser MCPs (decision 4) and did not touch `index.html`, `design-system/`, `tools/` or `docs/`.

## Risk
- Low. The only changes are the restore commit (identical to `f80e8c8`'s tree) and documentation edits to `AUTOPILOT.md` and `SUMMARY.md`.
- The project stays stalled until a person answers `README.md → ## Open decisions`. More rounds won't clear it.
- If the runner keeps cutting branches from `3503537`, the next round on 2026-11-01 is a real tiebreak against `f80e8c8`.
