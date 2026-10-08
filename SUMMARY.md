# SUMMARY — round `2026-10-09_0020` (no-op: blocked on owner decisions)

## What I did
- Restored the previous round's tip `4118af0` (`2026-10-09_0010`) onto this branch's stale base
  `3503537` as a separate commit. `git rev-parse HEAD^{tree}` and `4118af0^{tree}` both print
  `de153c4ca4c6cb3520951c9e2775fb2586f814ec`, so every path matches.
- Checked all five channels where an owner answer could appear. None of them has one. Details are under Verification.
- Ran the live A/B that the previous round forecast. The result was **tails**: the trap selector would have picked the wrong tip.
- Updated `## Next task` in `AUTOPILOT.md` with this round's block and the forecast for the next round.

## Why
- The prompt's `## Next task` arrived empty. The real task is in the restored `AUTOPILOT.md`. It says
  that if no owner decision has been answered, I should restore the tip, check the 5 channels, run
  Verify, write SUMMARY and stop without inventing work. Per hard rules 1 and 5, I did that and nothing else.
- **This round was a real tiebreak, so the A/B counts.** After I dropped my own ref (`30ebdee`),
  `2026-10-09` held 2 tips. The correct form (`--sort=-committerdate`) put `4118af0` (`_0010`) at row 1.
  The trap form (`%(committerdate:short)` + sha, then `| sort -r`) put `9a63d32` (`_0000`) at row 1 and
  sank the real tip to row 2 of 2. `node -e "'4118af0'<'9a63d32'"` → `true`, so `_0010`'s tails condition
  held. The wrong-formula record is now **tails 58 of 90 (58/86)**.
- **Forecast for the next round:** another real tiebreak. `2026-10-09` will hold 3 tips, and the comparand
  stays `9a63d32`. The result is tails if and only if this round's closing sha is less than `9a63d32`.
  The probability of that is about 60.31%, computed with `node -e`.

## Verification
- Tip selection: `git for-each-ref --sort=-committerdate …` put `4118af0` `_0010` (2026-10-09 00:12:28)
  at row 1. `git log --oneline -2 4118af0` shows `4118af0 docs:` above `571e1b9 docs:`, so the tip holds actual work.
- Channel 1: `grep -c "| Option | Cost |" README.md` → 8, and `grep -c "If you answer:"` → 8. The two counters agree.
- Channel 2: `git ls-files | grep -i jspdf` → nothing.
- Channel 3: `git rev-parse --short main` → `ef3220e`, unchanged.
- Channel 4: `git status --short --untracked-files=all` → clean.
- Channel 5: the newest non-`auto/*` refs are `design-system` and `origin/design-system`, dated 2026-08-13.
- Verify: `node tools/test.mjs` → `54 passed, 0 failed`. `node tools/check-tokens.mjs` → all 6 checks pass
  on 15 CSS sources (22/22 tokens, 4/4 fonts). `npm --prefix design-system test` → `Test Files 12 passed (12)`,
  `Tests 31 passed (31)`.
- Harness, all 5 keys:
  - `buttons 2488f2d:index.html index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS
  - `ds-disabled-hover 4118af0:design-system/src/styles.css design-system/src/styles.css` → PASS across 15 pairs,
    plus the expected `1 undecidable rule(s)` line (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows
    are `#toastUndo`: `(base)`, `:hover`, `:disabled`, `:disabled:hover` and `:focus`. Each one shows
    `after : auto <- .toast-act`. That is the intended result: this key exists to show the deliberate
    2026-08-24 behaviour change, not to pass.

## What I did NOT do
- I did not answer or apply any of the 8 owner decisions in `README.md → ## Open decisions` (jsPDF,
  chip padding, spacing scale, browser verification, segmented padding, input sizes, disabled-hover,
  `docs/design-parity.md`). Each one moves pixels or adds a file, so each is the owner's call.
- I did not touch `index.html`, any CSS, the tests or the Verify command.
- I did not trim the growing per-round blocks in `AUTOPILOT.md`. Deleting history is an owner decision.
- I did not tick any acceptance-criterion box, because no criterion changed state.

## Risk
- Low. This round changes only documentation (`AUTOPILOT.md` and `SUMMARY.md`), on top of a restore
  commit whose tree is identical to `4118af0`.
- The runner still cuts every branch from `3503537`. The next round must restore this round's tip
  first and must select it with `--sort=-committerdate`. With the trap form, the next round has a ≈60%
  chance of restoring `9a63d32` and silently discarding both `_0010` and this round. Both are docs-only,
  so no check would notice.
- The project stays stalled until a person answers a decision in `README.md`. More rounds will not change that.
