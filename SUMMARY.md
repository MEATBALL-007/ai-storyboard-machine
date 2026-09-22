# Round `2026-09-23_0008` — no-op (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. I picked the tip date-major with `git for-each-ref --sort=-committerdate`
  and restored `cf7820e` (`…/2026-09-22_0028`) as its own commit (`2d27b5e`).
- **Checked all five owner-answer channels. None of the eight open decisions has an answer.**
  Per the pinned `## Next task`, this is a deliberate no-op round. I did not invent substitute work.
- **Ran the full Verify command (three stages): all green.** I also ran all five parity-harness
  keys, and every number matches the established table.
- **Resolved `_0028`'s forecast by a live A/B: heads.** This round is the first of a new day, so it
  is *not* masked. After dropping my own ref, `2026-09-22` holds 3 tips, and both formulas put
  `cf7820e` at row 1.
- **Found and recorded that `_0028`'s agent never committed.** Its tip `cf7820e` is a runner
  commit ("rescued work the agent left uncommitted") that touches only `AUTOPILOT.md`. So
  `_0028` never wrote a `SUMMARY.md`: the one I inherited was still headed `2026-09-22_0017`.

## Why

- **The restore comes before any Read.** On this repo a stale tree looks *finished*, not broken.
- **I checked for a real tiebreak before running the A/B.** The rule is: drop your own ref, then
  count the tips on the newest remaining date. My ref is dated `2026-09-23`; with it dropped,
  `2026-09-22` has three tips, so the sha tiebreak really fired and the result counts.
- **This heads is luck, not a fix.** `cf7820e` vs comparand `cb2bf76` ties on the first hex digit
  (`c`) and wins on the second (`f` > `b`). The pre-round `P(tails)` was 79.36%. Any closing sha
  from `c0…` to `ca…` would have made the wrong formula silently discard `_0028`.
- **I committed `AUTOPILOT.md` before writing this file** (two commits, not one). `_0028` shows
  that an uncommitted SUMMARY at timeout is simply lost. The runner's rescue saved only
  `AUTOPILOT.md`.
- **I did not answer any of the eight decisions myself.** Decisions 2/5/6/7 move pixels a human
  will see. No checker here looks at `:hover`, and jsdom does no hit testing. A round that "just
  tries it" would stay green on all three Verify stages while changing the product.

## Verification

- `git rev-parse HEAD^{tree} cf7820e^{tree}` → both `e422420f7d6bf01f60d1a2ff7530e7c6b000bc01`
  (the restore is exact on every path).
- `git log --oneline -3 cf7820e` → `cf7820e autopilot: rescued work…` / `3be2cc9 chore: restore…` / `3503537`.
- Channels: `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:"` = **8**
  (they agree). `git ls-files | grep -ic jspdf` = **0**, `git status --short -uall` is empty.
  Non-`auto/*` refs: `design-system` = `3503537` (2026-08-13), `mac*` = `e3a355c`/`592e7c3`,
  `main`/`origin/main` = `ef3220e` (2026-06-27). Nothing is newer than 2026-08-13.
- **Verify** `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`:
  `54 passed, 0 failed`. check-tokens: 22/22 tokens, 4/4 fonts, and all four scans pass over 15
  CSS sources. vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`.
- Harness (the pinned `2026-09-02_0002` set):
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, markup 7 gone / 5 new, **PASS**
  - `segmented 021b966:index.html index.html` → 45 / 9, markup 0 / 3, **PASS**
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, markup 0 / 1, **PASS**
  - `ds-disabled-hover cf7820e:design-system/src/styles.css design-system/src/styles.css` →
    15 / 3, **PASS** + 1 undecidable (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html` → **FAIL — 5 declaration(s) differ, 0 markup
    problem(s), 0 unmatched**. This is the expected result: it records the deliberate
    `pointer-events:auto` fix. I read all five `✗` rows. They are all `#toastUndo` (base,
    `:hover`, `:disabled`, `:disabled:hover`, `:focus`), and none is `#toast`.
- A/B trap form, run live:
  `git for-each-ref --format="%(committerdate:short) %(objectname:short) %(refname:short)" refs/heads | sort -r | head -5`
  → row 1 is my own ref `2d27b5e` (dropped), then row 2 is `cf7820e` `_0028`. That is the same as
  the correct form, so the result is heads. Running record for the wrong formula: **33 tails of 53**
  (**33/49** excluding the 4 structural heads).

## What I did NOT do

- I did not answer or pre-empt any of the eight `## Open decisions`, and I did not retry the
  browser MCPs (decision 4: they are blocked by permissions, not just by the headless server).
- I did not backfill a `SUMMARY.md` for `_0028`. Its branch is already pushed, and this round's
  file replaces the stale one.
- I did not trim `AUTOPILOT.md` (4,400+ lines). Its size is why the `## Next task` section reaches
  the prompt empty, but deleting history is the owner's call. I relabelled the old forecast as
  history instead of deleting it.

## Risk

- **Nothing in the product changed.** The round's diff is the restore commit plus `AUTOPILOT.md`
  and `SUMMARY.md`.
- **`_0028`'s PR contains a stale `SUMMARY.md`** (headed `_0017`). A reviewer reading that PR on
  its own would see the wrong round's report. Its `AUTOPILOT.md` content is complete and correct.
- **The next round is masked** (only one tip on `2026-09-23` once it drops its own ref), so it
  must not run the A/B or move the statistic. The round after it faces a real tiebreak against
  this round's closing sha.
- **The stall still needs a person.** No agent round can unblock the remaining criteria. It has
  lasted 5+ weeks and 120+ rounds cut from the stale base.
