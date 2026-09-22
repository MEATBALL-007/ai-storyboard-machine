# Round `2026-09-23_0018` — no-op (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. I picked the tip date-major with `git for-each-ref --sort=-committerdate`
  and restored `e33b058` (`…/2026-09-23_0008`) as its own commit.
- **Checked all five owner-answer channels. None of the eight open decisions has an answer.**
  Per the pinned `## Next task`, this is a deliberate no-op round. I did not invent substitute work.
- **Ran the full Verify command (three stages): all green.** I also ran all five parity-harness
  keys, and every number matches the established table.
- **Resolved `_0008`'s forecast: masked (structural heads), exactly as predicted.** After dropping
  my own ref, `2026-09-23` holds exactly one tip (`e33b058`). So I did not run the A/B and did not
  move the statistic.
- **Wrote the next round's forecast into `AUTOPILOT.md`.** That round is *not* masked:
  `2026-09-23` will hold two tips (`_0008` and this round), with comparand `e33b058`.
  `P(tails)` ≈ 88.76%.

## Why

- **The restore comes before any Read.** On this repo a stale tree looks *finished*, not broken.
- **No A/B this round.** With a single tip on the newest remaining date, the date field settles
  row 1 before any sha is compared. Both formulas agree by construction, so their agreement proves
  nothing. Counting it would inflate the "heads" side of the record.
- **I committed `AUTOPILOT.md` before writing this file** (separate commits). `_0028` lost its
  SUMMARY to a timeout, and the runner's rescue saved only `AUTOPILOT.md`.
- **I did not answer any of the eight decisions myself.** Decisions 2/5/6/7 move pixels a human
  will see. No checker here looks at `:hover`, and jsdom does no hit testing. So a round that
  "just tries it" would stay green on all three Verify stages while changing the product.

## Verification

- `git log --format="%h | %an <%ae> | %s" -4 e33b058` → `e33b058 docs: SUMMARY…`, `096b755 docs:`,
  `2d27b5e chore: restore…`, `3503537`. All four are `PHANTOM AUTOPILOT <autopilot@phantom.local>`.
  The tip is the agent's own commit, not a runner rescue.
- `git merge-base --is-ancestor 3503537 e33b058` passed.
  `git diff --diff-filter=D --name-only HEAD e33b058` was empty, so the path-checkout strands no file.
- `git rev-parse HEAD^{tree} e33b058^{tree}` → both `1120468e6bd81bcef30cf2be52a7ac8418d3777d`
  (the restore is exact on every path).
- Channels: `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:"` = **8**
  (they agree). `git ls-files | grep -i jspdf` is empty, and `git status --short -uall` is empty.
  Non-`auto/*` refs: `design-system` = `3503537` (2026-08-13), `mac*` = `e3a355c`/`592e7c3`,
  `main`/`origin/main` = `ef3220e` (2026-06-27). Nothing is newer than 2026-08-13.
- **Verify** `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`:
  `54 passed, 0 failed`. check-tokens: 22/22 tokens, 4/4 fonts, and all four scans pass over 15
  CSS sources. vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`.
- Harness (the pinned `2026-09-02_0002` set):
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, markup 7 gone / 5 new, **PASS**
  - `segmented 021b966:index.html index.html` → 45 / 9, markup 0 / 3, **PASS**
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, markup 0 / 1, **PASS**
  - `ds-disabled-hover e33b058:design-system/src/styles.css design-system/src/styles.css` →
    15 / 3, **PASS** + 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html` → **FAIL — 5 declaration(s) differ, 0 markup
    problem(s), 0 unmatched element(s)**, over 10 pairs / 2 elements. This is the expected result:
    it records the deliberate `pointer-events:auto` fix. I read all five `✗` rows. They are all
    `#toastUndo` (base, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), and none is `#toast`.
- `node -e "console.log((0xe33b058/0x10000000*100).toFixed(2))"` → `88.76` (next round's `P(tails)`).
- Running record for the wrong formula is unchanged: **33 tails of 53** (**33/49** excluding the 4
  structural heads). This masked round is excluded from both the numerator and the denominator.

## What I did NOT do

- I did not answer or pre-empt any of the eight `## Open decisions`, and I did not retry the
  browser MCPs (decision 4: they are blocked by permissions, not just by the headless server).
- I did not run the trap-form A/B, because it can prove nothing on a single-tip day.
- I did not trim `AUTOPILOT.md` (now ~615 KB). Its size is why `## Next task` reaches the prompt
  empty, but deleting history is the owner's call. I relabelled `_0008`'s forecast as history
  instead of deleting it.

## Risk

- **Nothing in the product changed.** The round's diff is the restore commit plus `AUTOPILOT.md`
  and `SUMMARY.md`.
- **The next round faces a real tiebreak at ≈88.76% tails.** If it used the wrong (sha-first
  `| sort -r`) formula, it would silently discard this whole round, and every check would stay
  green. It must use `--sort=-committerdate`.
- **The stall still needs a person.** No agent round can unblock the remaining criteria. It has
  lasted 5+ weeks and 120+ rounds cut from the stale base.
