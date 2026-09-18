# Round 2026-09-19_0035 — no-op round (no owner answer; all work still blocked)

## What I did

- **Restored the previous round's work.** The branch was cut from the stale base `3503537` again
  (109th+ consecutive round). Selected the tip **date-major** with
  `git for-each-ref --sort=-committerdate` → `1794e8c` (`auto/…/2026-09-19_0025`), restored with
  `git checkout 1794e8c -- .`, committed as `cfd4d37`. **Tree-sha identity confirmed:**
  `git rev-parse HEAD^{tree}` and `git rev-parse 1794e8c^{tree}` both print
  `6dc7af42418b90eef4fda103fec004b09ba5100d` — every path matches, not just the ones a diff prints.
- **Checked all five owner-answer channels. None has been answered.** (Details under Verification.)
- **Ran the A/B the previous round asked for, live.** Its forecast (`P(tails) ≈ 77.7%`, predicting
  tails) **resolved TAILS — correct.** The trap formula puts `c6e065b` (`_0013`) at row 1 and sinks
  the real tip `1794e8c` (`_0025`) to row 2, because `'1'` < `'c'`. Using it would have silently
  discarded all of `_0025`.
- **Ran the full Verify command and all five harness keys.** All green / all as pinned.
- **Updated `AUTOPILOT.md`'s `## Next task` block only** — recorded the resolution, the new
  measurement below, and next round's forecast. No status block appended (the `_0035` convention).

## Why

- **No task was invented.** The contract's `## Next task` says: if no owner decision has been
  answered, restore the tip, check the five channels, run Verify + the five harness keys, write
  SUMMARY, end the round — and forbids substituting other work. All eight decisions in
  `README.md → ## Open decisions` are still unanswered, so that is exactly what this round did.
  Every remaining path to an acceptance criterion moves pixels or adds a file, which is the owner's
  call, not an agent's.
- **Tip selection was date-major, run before `git checkout`.** A sha-lexical tie-break would have
  restored the wrong tip this round — it is not a hypothetical here, it is what the A/B measured.

## Verification

**Three-stage Verify command — all green:**

```
node tools/test.mjs               → 54 passed, 0 failed
node tools/check-tokens.mjs       → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 CSS
                                     sources) · font weights all 400/500/700/800 · every
                                     border-radius reads a --r-* token · every font-family reads
                                     var(--mono)
npm --prefix design-system test   → 12 test files, 31 passed
```

**Harness, all five keys (argument pairs copied from `AUTOPILOT.md`, not guessed):**

```
buttons           2488f2d:index.html 9fab5c9:index.html   → PASS (85 pairs / 17 elements)
segmented         021b966:index.html index.html           → PASS (45 pairs / 9 elements)
toast             bb10dd9:index.html 3d3d5cc:index.html   → PASS (5 pairs / 1 element)
toast-hit         3d3d5cc:index.html index.html           → 5 rows differ, ALL #toastUndo
                                                             (base, :hover, :disabled,
                                                              :disabled:hover, :focus)
                                                             and NO #toast row — the expected,
                                                             deliberate pointer-events:auto fix
ds-disabled-hover 1794e8c:design-system/src/styles.css design-system/src/styles.css
                                                          → PASS, with the harness's own warning:
                                                             1 undecidable rule (structural pseudo
                                                             :last-child on .pui-menu__item) that
                                                             the PASS says nothing about
```

`toast-hit` was read with `grep "✗"` and all five rows inspected — **not** `grep -c "✗ #toast:"`,
which has a documented blind spot (the base-state row prints without a colon).

**Five channels — all negative:**

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8**, `grep -c "If you answer:"` = **8** — agree, so unanswered |
| 2 | `jspdf.umd.min.js` in repo | absent (`git ls-files \| grep -i jspdf` → nothing) |
| 3 | `main` | still `ef3220e` |
| 4 | untracked drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system` at **2026-08-13**, older than all this work |

**A/B measurement (own branch filtered out):**

```
correct (--sort=-committerdate)        trap (:short, sha before refname, | sort -r)
2026-09-19 1794e8c _0025 ✓             2026-09-19 c6e065b _0013 ✗ (one round stale)
2026-09-19 c6e065b _0013               2026-09-19 1794e8c _0025  ← real tip, row 2
2026-09-18 7f342c1 _0503               2026-09-18 7f342c1 _0503
2026-09-18 304da7a _0030               2026-09-18 563e7fc _0006  ← INVERTED
2026-09-18 1c3401f _0018               2026-09-18 304da7a _0030  ← INVERTED
2026-09-18 563e7fc _0006               2026-09-18 1c3401f _0018
```

New this round: **the bug mis-ranked two day-groups at once.** Row 1 of the top group was wrong,
*and* the `2026-09-18` group below it was inverted at rows 2–4 — that group merely happened to be
right at its own row 1 because `_0503`'s sha leads `'7'`, the highest in the set. So "row 1 of the
top group looks right" is not evidence the formula works. Cumulative record of the wrong formula:
**tails 27 of 43** (excluding the 3 structural heads: **27 of 40**).

## What I did NOT do

- **Did not answer any of the eight open decisions.** Each moves pixels or adds a file to the repo.
- **Did not invent substitute work.** Fallback work is genuinely exhausted: token tooling is 22/22
  across six checks, the element-parity table is closed at 11/11, and the harness already reports
  its own undecidable selectors. The explicitly-forbidden list (implementing `:last-child`/
  combinator matching, adding the harness to Verify, applying decisions 2/5/6/7 unilaterally) was
  left alone.
- **Did not retry the browser MCPs.** They are *permission*-blocked, not merely headless — that is
  decision 4, and retrying burns a round for a known answer.
- **Did not restore `docs/design-parity.md`** (decision 8, unanswered).
- **Did not append a status block to `AUTOPILOT.md`** — only the `## Next task` block was edited,
  per the convention started in `_0035`. The file's size is *why* `## Next task` reaches the agent
  empty in the prompt.

## Risk

- **Nothing in the app or the design system changed this round.** The only edits are `AUTOPILOT.md`
  and this file; the restore commit `cfd4d37` reproduces `1794e8c`'s tree exactly. A reviewer
  should see a code diff of zero against `1794e8c`.
- **The `toast-hit` harness key reports `FAIL — 5 declaration(s) differ`, and that is correct.**
  It pins a deliberate behaviour change (round `2026-08-24_0003` added `pointer-events:auto` to
  `.toast-act` to make the toast's Undo button clickable). The check that matters is *which* rows
  differ: all five must be `#toastUndo` and none may be `#toast`. Verified this round.
- **`ds-disabled-hover` PASSes but covers less than it looks like.** The harness cannot evaluate
  `:last-child`, so a change confined to `.pui-menu__item:last-child` computes 0 diff. The harness
  prints this itself; it is not a silent gap, but the PASS is not blanket coverage.
- **The stall is structural, not technical.** 109+ rounds have been cut from the same stale base,
  nothing has merged to `main` since 2026-06-27, and the work has been decision-blocked for over a
  month. No round can clear this — it needs a person to answer `## Open decisions`.
- **Next round faces `P(tails) ≈ 77.7%` with a 2-round blast radius.** If a round picks its tip by
  sha instead of date, it restores `c6e065b` and discards both `_0025` and this round — and it does
  so **undetectably**: identical code tree, empty residual, five matching harness keys, three green
  Verify stages. Date-major selection, run before `git checkout`, is the only guard.
