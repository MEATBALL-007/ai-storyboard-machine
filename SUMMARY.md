# Round `2026-09-28_0022`: no-op, blocked on owner decisions

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. `git for-each-ref --sort=-committerdate` shows `ca8954d`
  (`…/2026-09-28_0012`) as the newest tip. It holds real work (`docs:` above `chore: restore…`).
  I restored it as its own commit.
- **Read the task from the restored `AUTOPILOT.md`.** The prompt's `## Next task` arrived empty.
  The restored task says: if no owner decision is answered, run a no-op round.
- **Checked all five owner-answer channels.** None of the eight open decisions has an answer.
- **Ran Verify and all five parity-harness keys.** Everything is green, and every key matches the
  recorded table.
- **Updated only the `## Next task` block in `AUTOPILOT.md`.** It now points at this round's tip,
  records `_0012`'s forecast as resolved, and sets the next round's forecast.

## Why

- **I ran the A/B this round, and it counts toward the record.** After I dropped my own refname,
  `2026-09-28` held two tips (`ca8954d`, `8dc4093`), so the sha tiebreak actually fired. The
  correct form and the trap form (`committerdate:short` + sha + `| sort -r`) both put `ca8954d`
  at row 1. They agree only because `'c'` sorts above `'8'`. The trap did not stop being a trap.
  The record moves to **tails 36 of 60** (36/56).
- **Next round is a live tiebreak again.** `2026-09-28` will hold three tips with comparand
  `ca8954d`. The trap form picks the wrong tip if and only if this round's closing sha sorts
  below `ca8954d`. The chance of that is about 79.12%.
- **I edited the existing block and did not append a new status block.** That follows the
  convention started at `_0035`, which limits growth of a file that is already ~4,600 lines.

## Verification

- `git rev-parse HEAD^{tree}` and `git rev-parse ca8954d^{tree}` both print
  `e2375d79a925a4d039c522786c2683f2f4e3c3cb`, so the restore matches on every path.
- Channels:
  - (1) `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8. The two
    counters agree.
  - (2) There is no `jspdf*` file, either tracked or on disk.
  - (3) `main` is still `ef3220e`.
  - (4) `git status --untracked-files=all --short` was empty after the restore.
  - (5) Non-`auto/*` refs are unchanged: `design-system` = `3503537`, `mac*` =
    `e3a355c`/`592e7c3`, `main`/`origin/main` = `ef3220e`. The newest is 2026-08-13.
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - `54 passed, 0 failed`
  - check-tokens: the colour, font-weight, radius and typeface checks each passed across
    15 CSS sources, and the chain continued to the next stage
  - vitest printed `12 passed (12)` files and `31 passed (31)` tests
- Harness keys:
  - `buttons 2488f2d:index.html index.html` → PASS, 85 pairs across 17 elements. Markup check:
    7 old class tokens gone, 5 new class attributes.
  - `segmented 021b966:index.html index.html` → PASS, 45 pairs across 9 elements
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS, 5 pairs across 1 element
  - `ds-disabled-hover ca8954d:design-system/src/styles.css design-system/src/styles.css` → PASS,
    15 pairs across 3 elements, plus the usual 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ, 0 markup
    problem(s), 0 unmatched element(s)` across 10 pairs and 2 elements. This FAIL is the expected
    result. I read all five `✗` rows: every one is `#toastUndo`, and none is `#toast`.

## What I did NOT do

- **Did not answer any of the eight open decisions.**
- Did not touch `index.html`, any `.css`, the tests, the Verify command, or the markers.
- Did not tick any acceptance box. Nothing changed that would complete one.

## Risk

- **Low for code.** This round changes docs only: `AUTOPILOT.md`'s Next-task block and this file.
- **Only a person can end the stall.** Every remaining acceptance criterion depends on an owner
  answer in `README.md → ## Open decisions`. The runner also still cuts every branch from
  `3503537`. Merging one of these branches into `main`, or cutting new branches from the previous
  tip, would end the restore step.
