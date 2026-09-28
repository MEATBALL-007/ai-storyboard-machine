# Round `2026-09-29_0002`: no-op, blocked on owner decisions

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. `git for-each-ref --sort=-committerdate` shows `cd67287`
  (`…/2026-09-28_0032`) as the newest tip. It holds real work (`cd67287 docs:` above
  `439c5b4 docs:` above `3a6406a chore: restore…`). I restored it as its own commit.
- **Read the task from the restored `AUTOPILOT.md`.** The prompt's `## Next task` arrived empty.
  The restored task says: if no owner decision is answered, run a no-op round.
- **Checked all five owner-answer channels.** None of the eight open decisions has an answer.
- **Ran Verify and all five parity-harness keys.** Everything is green, and every key matches the
  recorded table.
- **Updated only the `## Next task` block in `AUTOPILOT.md`.** It now points at this round's tip,
  records `_0032`'s forecast as resolved, and marks the next round as masked.

## Why

- **The A/B counts toward the record this round, and it came up HEADS by luck.** This is the first
  round of a new day. After I dropped my own refname, the newest date (`2026-09-28`) held four
  tips, so the sha tiebreak really ran. The sha-first trap form put `cd67287` at row 1, which is
  the correct tip. That was luck: `cd67287` sorts above `ca8954d` only on its second hex digit.
  The rest of the day-group is still out of order (`ca8954d` > `8dc4093` > `67f1def`), so the bug
  is still there. Record: **tails 37 of 62 (37/58 excluding structural heads)**.
- **The next round is masked.** `2026-09-29` will hold exactly one tip (this round's). The date
  field then decides row 1 before any sha is compared, so an A/B would prove nothing. If the runner
  does not push this branch, the newest date falls back to `2026-09-28` with comparand `cd67287`.
- **I did not invent a substitute task.** Every remaining acceptance criterion waits on an owner
  decision (README `## Open decisions`, items 1–8). Hard rule 5 says a round that only records
  this is a successful round.

## Verification

- Restore identity: `git rev-parse HEAD^{tree}` = `git rev-parse cd67287^{tree}` =
  `44dcec3e50d7acf9de4564b4d819e9510a6167a4`. The two trees match on every path.
- Owner channels:
  - (1) `grep -c "| Option | Cost |" README.md` = 8, and `grep -c "If you answer:"` = 8.
  - (2) There is no `jspdf` file tracked or at the repo root.
  - (3) `main` is still `ef3220e`.
  - (4) `git status --short --untracked-files=all` printed nothing.
  - (5) The newest non-`auto/*` ref is `design-system`, dated 2026-08-13.
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - `54 passed, 0 failed`
  - check-tokens: 22/22 tokens, 4/4 fonts, and the other four checks all pass over 15 CSS sources.
  - vitest: `12 passed (12)` files, `31 passed (31)` tests.
- Harness (`docs/btn-parity-proof.mjs`, using the `2026-09-02_0002` pairs):
  - `buttons 2488f2d:index.html index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → PASS
  - `ds-disabled-hover cd67287:design-system/src/styles.css design-system/src/styles.css` → PASS,
    plus 1 undecidable rule.
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs.
    I read all five `✗` rows. Every one is `#toastUndo` (`pointer-events` `(unset)` → `auto`,
    from `.toast-act`). This is the intended result of the 2026-08-24 fix, not a regression.

## What I did NOT do

- **I did not answer or apply any of the eight owner decisions.** They are jsPDF, chip padding,
  the spacing/type scale, browser verification, segmented padding, input sizes, disabled-hover,
  and `docs/design-parity.md`. Each one moves pixels or adds a file, so each is the owner's call.
- **I did not retry the browser MCPs.** They are permission-blocked, and nothing about that has
  changed.
- **I did not tick any acceptance box.** No criterion changed state this round.

## Risk

- **No code changed.** The diff beyond the restore touches only `AUTOPILOT.md` (the Next task
  block) and this file.
- **I printed only the last lines of the `buttons`, `segmented` and `toast` harness runs.** I saw
  the PASS verdicts but not their pair counts this round. The counts in earlier rounds were 85/17,
  45/9 and 5/1.
- **This stall needs a person.** The branch-stacking runner bug (every `auto/*` branch is cut from
  `3503537`) and the eight open decisions will not resolve on their own. Every round until then
  is a no-op.
