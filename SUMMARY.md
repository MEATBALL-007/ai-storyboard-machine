# SUMMARY — round `2026-10-10_0725` (no-op: blocked on owner decisions)

## What I did
- Restored the previous round's tip `18d68fb` (`2026-10-10_0715`) onto this branch's stale base
  `3503537` as a separate commit. `git rev-parse HEAD^{tree}` and `18d68fb^{tree}` both print
  `58f37371672126ce246542a362e8c0def7dba4ef`, so every path matches.
- Checked the five places an owner answer could show up. None of them has one (details under Verification).
- Added this round's block and the next round's forecast to `## Next task` in `AUTOPILOT.md`.

## Why
- **The prompt's Next task was empty.** I followed the Next task in the restored `AUTOPILOT.md`. It
  queues a no-op until the owner answers `README.md → ## Open decisions`.
- **The tip-selection A/B was a real measurement this round, and it came up TAILS, as predicted.**
  After I dropped my own ref (`ba3732a`, row 1 after the restore), `2026-10-10` held two tips. With
  two tips on one date, the selector has to break the tie by sha:
  - The correct form, `--sort=-committerdate`, put `18d68fb` (`_0715`) at row 1. That is the right tip.
  - The trap form (sha before refname, then `| sort -r`) put `4670ed5` (`_0220`) at row 1. That is
    wrong. It would have dropped `_0715`, which was one round of docs-only work.

  `node -e "console.log('18d68fb'<'4670ed5')"` prints `true`, which matches `_0715`'s condition. The
  wrong-formula record moves to tails 60/93 (60/89).
- **I did not answer any of the 8 open decisions.** Each one either moves pixels or adds a file to
  the repo, so it is the owner's call.

## Verification
- **Tip selection:** `git for-each-ref --sort=-committerdate`. Row 1 was `18d68fb` and row 2 was `4670ed5`.
  `git log --oneline -4 18d68fb` shows real `docs:` commits above the restore.
- **Channels:**
  - `grep -c "| Option | Cost |" README.md` printed 8, and `grep -c "If you answer:"` printed 8.
  - `ls jspdf*` found no file.
  - `git status --short --untracked-files=all` was clean.
  - `main` is still `ef3220e`. The newest non-`auto/*` ref is `design-system` at 2026-08-13.
- **Verify** (the prompt's command):
  `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - `54 passed, 0 failed`
  - check-tokens: all 6 checks pass. 22/22 tokens and 4/4 fonts are in sync. All 15 CSS sources pass the colour, weight, radius and typeface checks.
  - vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- **Harness, all 5 keys:**
  - `buttons 2488f2d:index.html index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS
  - `ds-disabled-hover 18d68fb:design-system/src/styles.css design-system/src/styles.css` → PASS, plus `1 undecidable rule(s)`
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs.
    This is expected. All 5 `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
    `:disabled:hover`, `:focus`), and each shows `after : auto <- .toast-act`. That is the
    deliberate 2026-08-24 fix.

## What I did NOT do
- I did not touch `index.html`, `design-system/`, `storyboard-simulator.html`, the test markers, or any test.
- I did not apply decisions 2, 5, 6 or 7 on my own, and I did not restore `docs/design-parity.md` (decision 8).

## Risk
- The only changes are the restore commit (its tree is identical to `18d68fb`'s) plus edits to `AUTOPILOT.md` and this file.
- **The next round is also a live tiebreak.** `2026-10-10` will hold 3 tips, and the comparand is
  still `4670ed5`. The trap selector picks the wrong tip if and only if this round's closing sha
  sorts below `4670ed5` (≈27.52%). Selecting with `--sort=-committerdate` avoids the problem
  whatever the sha.
- The runner keeps cutting branches from `3503537`, and nothing has been merged into `main`. The stall
  needs a person to answer `README.md → ## Open decisions`; more rounds won't clear it.
