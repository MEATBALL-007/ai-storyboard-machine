# Round `2026-09-28_0012`: no-op, blocked on owner decisions

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. `git for-each-ref --sort=-committerdate` shows `8dc4093`
  (`…/2026-09-28_0002`) as the newest tip, and it holds real work (`docs: SUMMARY…` above `docs:`
  above `chore: restore…`). I restored it as its own commit.
- **Read the task from the restored `AUTOPILOT.md`.** The prompt's `## Next task` arrived empty.
  The restored task says: if no owner decision is answered, run a no-op round.
- **Checked all five owner-answer channels. None of the eight open decisions has an answer.**
- **Ran Verify and all five parity-harness keys.** Everything is green, and every key matches the
  established table.
- **Updated only the `## Next task` block in `AUTOPILOT.md`.**
  - The tip pointer now names `2026-09-28_0012`.
  - I recorded `_0002`'s forecast as resolved: masked, not counted.
  - I set the next round's forecast: a live tiebreak.

## Why

- **I did not run the A/B.** My own ref still pointed at `3503537`, so it sank to the bottom of the
  ranking without filtering. That left `2026-09-28` holding one tip, `8dc4093`. With one tip on the
  date, the date field decides row 1 before any sha is compared, so both formulas must agree and
  their agreement proves nothing. The record stays at **tails 36 of 59** (36/55).
- **Next round is a real tiebreak.** `2026-09-28` will hold two tips, so the trap form ranks by sha.
  It lands on the wrong tip if and only if this round's closing sha sorts below `8dc4093`. The
  chance of that is about 55.38%.
- **I used the `2026-09-02_0002` harness pairs, not the 📌 set the previous round used.**
  `AUTOPILOT.md` (the `_0017` block) records that the 📌 set pins `buttons`'s after-side to
  `9fab5c9`, so it never reads the current `index.html` and cannot catch a regression. Both sets
  have produced identical numbers, so this changes how much the check can detect, not the result.

## Verification

- `git rev-parse HEAD^{tree}` and `git rev-parse 8dc4093^{tree}` both print
  `ff6771f2980d202a308ec066251c530373c18094`, so the restore matches on every path.
- Channels:
  - (1) `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8. The two
    counters agree.
  - (2) There is no `jspdf*` file.
  - (3) `main` is still `ef3220e`.
  - (4) `git status --short --untracked-files=all` was empty after the restore.
  - (5) Non-`auto/*` refs are unchanged: `design-system` = `3503537`, `mac*` =
    `e3a355c`/`592e7c3`, `main`/`origin/main` = `ef3220e`. The newest is 2026-08-13.
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - `54 passed, 0 failed`
  - check-tokens printed all 6 checks passing: 22/22 tokens, 4/4 fonts, and the colour, weight,
    radius and typeface checks, each across 15 CSS sources
  - vitest printed `12 passed (12)` files and `31 passed (31)` tests
- Harness keys:
  - `buttons 2488f2d:index.html index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS
  - `ds-disabled-hover 8dc4093:design-system/src/styles.css design-system/src/styles.css` → PASS,
    plus the usual 1 undecidable rule (`.pui-menu__item`)
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ, 0 markup
    problem(s), 0 unmatched element(s)` across 10 pairs and 2 elements. This FAIL is the expected
    result. I read all five `✗` rows: every one is `#toastUndo`, and none is `#toast`.

## What I did NOT do

- **Did not answer any of the eight open decisions.**
- Did not touch `index.html`, any `.css`, the tests, the Verify command, or the markers.
- Did not tick any acceptance box. Nothing changed that would complete one.

## Risk

- **Low for code.** This round changes docs only: `AUTOPILOT.md`'s Next-task block and this file.
- **The stall needs a person.** Every remaining acceptance criterion depends on an owner answer in
  `README.md → ## Open decisions`. The runner also still cuts every branch from `3503537`. Merging
  one of these branches into `main`, or cutting new branches from the previous tip, would end the
  restore step.
