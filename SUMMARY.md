# SUMMARY — round `2026-10-17_0009` (no-op: blocked on owner decisions)

## What I did
- Restored the previous round's tip `cffd5e8` (`2026-10-16_0039`) onto this branch's stale base
  `3503537` as a separate commit (`bc4f31f`). `git rev-parse HEAD^{tree}` and `cffd5e8^{tree}` both
  print `1882c96d2a4e0a7ac62f23135e45e99b86efef80`, so every path matches.
- Checked the five places an owner answer could show up. None has one (details under Verification).
- Ran the live A/B that `_0039` forecast. I recorded the result and the next round's forecast in
  `## Next task` of `AUTOPILOT.md`.

## Why
- **The prompt's Next task was empty.** I followed the Next task in the restored `AUTOPILOT.md`.
  It queues a no-op until the owner answers `README.md → ## Open decisions`.
- **This round counts toward the A/B record.** It is the first round of 2026-10-17. After I dropped
  my own ref (`bc4f31f`), the newest date was `2026-10-16`, which holds four tips (`cffd5e8`,
  `5b985bb`, `18e2bc8`, `0181697`), so the sha tiebreak actually decided the ranking. Both formulas
  put `cffd5e8` on row 1, because it has the highest sha of the four (`node -e` → `true true true`).
  The trap formula got it right only because of how the shas happened to sort. The bug is still
  there. The wrong-formula record moves to tails 70/112 (70/108).
- **I did not answer any of the 8 open decisions.** Each one either moves pixels or adds a file to
  the repo, so the owner has to make it.

## Verification
- **Tip selection:** `git for-each-ref --sort=-committerdate` put `cffd5e8`
  (`auto/…/2026-10-16_0039`, local and `origin/`) on row 1. `git log --oneline -2 cffd5e8` shows
  real work (`cffd5e8 docs:` above `a58cac7 docs:`).
- **Channels:**
  - `grep -c "| Option | Cost |" README.md` printed 8. `grep -c "If you answer:"` also printed 8.
  - `git ls-files | grep -i jspdf` and `ls jspdf*` found nothing.
  - `git status --short --untracked-files=all` showed no changes.
  - `main` is still `ef3220e`. The newest non-`auto/*` refs are `design-system` and
    `origin/design-system`, both from 2026-08-13.
- **Verify** (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`) passed all three stages:
  - `54 passed, 0 failed`
  - check-tokens passed all 6 checks: tokens 22/22, fonts 4/4, and the colour, weight, radius and
    typeface checks across 15 CSS sources.
  - vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- **Harness, all 5 keys:**
  - `buttons 2488f2d:index.html index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS
  - `ds-disabled-hover cffd5e8:design-system/src/styles.css design-system/src/styles.css` → PASS,
    with the `Except the 1 undecidable rule(s)` caveat line
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs.
    This is the expected result. All 5 `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
    `:disabled:hover`, `:focus`), and each one shows `after : auto <- .toast-act`, which is the
    intentional fix from 2026-08-24. No `#toast` row appears.

## What I did NOT do
- I did not touch `index.html`, `design-system/`, `storyboard-simulator.html`, the test markers, or any test.
- I did not apply decisions 2, 5, 6 or 7 on my own, and I did not restore `docs/design-parity.md` (decision 8).
- I did not tick any acceptance-criterion box, because no criterion changed this round.

## Risk
- This round changed only three things: the restore commit (its tree is identical to `cffd5e8`'s),
  the edit to `AUTOPILOT.md`, and this file.
- **The next round is masked.** Once it drops its own ref, `2026-10-17` will hold only this round's
  tip, so the date decides row 1 and the A/B tells you nothing. Don't run it and don't count it. If
  the runner did not push this round, the newest date goes back to `2026-10-16`, where `cffd5e8`
  is both the real tip and the highest sha.
- The runner keeps cutting branches from `3503537`, and nothing has been merged into `main`. The
  project is stuck until someone answers `README.md → ## Open decisions`. More rounds won't change that.
