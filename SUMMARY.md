# Round 2026-09-06_0002 — SUMMARY

**Result: no-op round.** All eight owner decisions in `README.md → ## Open decisions` are still
unanswered, so there was no unblocked work to do. Not a single byte of `index.html`,
`design-system/`, `tools/` or `docs/` was touched.

## What I did

- **Restored the previous round's tip** (`a88d56e` = branch `…/2026-09-05_0042`) onto the stale
  base `3503537` the runner cut this branch from. Restore commit is the first commit of this round.
- **Checked all five owner-answer channels.** None has moved:
  1. `README.md → ## Open decisions` — 8 option tables, 8 `If you answer:` lines, counters agree
  2. no `jspdf` file anywhere in `git ls-files`, none at the repo root
  3. `main` still `ef3220e` (2026-06-27)
  4. `git status --untracked-files=all --short` empty — no uncommitted drop
  5. no non-`auto/*` ref newer than 2026-08-13
- **Ran the full Verify command and all five `docs/btn-parity-proof.mjs` keys**, reading each key's
  complete output rather than tailing or grepping it. Everything matches the expected table exactly.
- **Resolved round `_0042`'s conditional forecast about the `:short` tie-break trap** — it came up
  TAILS, and at a cost of two rounds. Details under Verification.
- **Recorded the round** in `AUTOPILOT.md` (new status block, existing labels demoted one step) and
  wrote this file. Next task is unchanged: the same no-op loop until an owner answers.

## Why

- **The restore comes before any file read.** HEAD really was `3503537` again — 70+ rounds and the
  runner bug has never been fixed; it has now survived the rollover to `2026-09-06` as well. The
  dangerous failure mode is not forgetting to restore, it is *reading source first*: on the stale
  tree the token work genuinely looks finished, and round `2026-08-28_0004` burned itself
  concluding exactly that. `ls tools` showing both `check-tokens.mjs` and `test.mjs` is the
  one-call confirmation that I am on the real tree.
- **Tip chosen with `%(committerdate:iso8601)` + `head -16`, cross-checked by refname, never by row
  number.** `_0042` is the highest round number below my own `_0002` on the previous day, and both
  methods agree on `a88d56e`.
- **I did not re-run the `:short` A/B.** `AUTOPILOT.md:355–356` records that round `2026-09-04_0048`
  measured it live and caught a real inversion at rows 3–4; the file explicitly says later rounds
  need not repeat it. Skipping it is compliance, not an omission — and it is why my statement about
  the trap below is labelled inference rather than measurement.
- **`ds-disabled-hover`'s before side is the tip I actually restored** (`a88d56e`), read from
  `git for-each-ref` this round. Copying a sha from an old status block would pin the guard to a
  stale baseline and make it a tautology.
- **`toast` has both sides pinned** (`de07ea8` → `10e8f39`). Left open-ended it reports
  `FAIL — 5 declaration(s) differ`, the same count `toast-hit` is *supposed* to report, which reads
  as a regression and is not one.

## Verification

Verify command — all three stages green:

```
node tools/test.mjs           → 54 passed, 0 failed
node tools/check-tokens.mjs   → tokens 22/22, fonts 4/4, and four more checks,
                                all at 15 CSS sources
npm --prefix design-system test → 12 test files, 31 passed
```

All five harness keys, run with the sha pairs from `AUTOPILOT.md`'s `**Verify:**` block:

```
buttons           2488f2d:index.html  index.html  → PASS  85 pairs / 17 elements
                                                    markup 7 old gone, 5 new
segmented         021b966:index.html  index.html  → PASS  45 pairs /  9 elements
                                                    markup 0 old gone, 3 new
toast             de07ea8:index.html  10e8f39:index.html
                                                  → PASS   5 pairs /  1 element
                                                    no undecidable block
ds-disabled-hover a88d56e:…/styles.css …/styles.css
                                                  → PASS  15 pairs /  3 elements
                                                    + 1 undecidable .pui-menu__item:last-child
toast-hit         3d3d5cc:index.html  index.html  → FAIL — 5 declaration(s) differ
                                                    10 pairs / 2 elements,
                                                    0 markup problems, 0 unmatched
```

`toast-hit`'s FAIL is the expected result, not a regression. I read all five `✗` rows rather than
using `grep -c "✗ #toast:"` (which has a documented blind spot — the base-state row prints
`✗ #toast (base)` with no colon). All five rows are `#toastUndo` — `(base)`, `:hover`,
`:disabled`, `:disabled:hover`, `:focus` — every one `before: (unset)` → `after : auto <-
.toast-act`. **No `#toast` row appeared**, which is the positive evidence that `#toast` still
carries its `pointer-events:none` and that nobody has touched the app side.

Restore preconditions, all checked before touching the tree:

```
git merge-base --is-ancestor 3503537 a88d56e      → ancestor-ok
git diff --diff-filter=D --name-only HEAD a88d56e → empty (no deletions;
                                                    path-checkout == fast-forward)
git log -1 --format="%h %an <%ae> …" a88d56e      → PHANTOM AUTOPILOT
                                                    <autopilot@phantom.local>
                                                    "chore: round 2026-09-05_0042 no-op …"
git diff --stat a88d56e -- .                      → empty (restore total)
```

The author check matters independently of the sha check: a matching sha only proves the branch head
has not moved, while `%an`/`%ae` distinguishes the runner's own commit from an owner answer landing
on that branch.

### Round `_0042`'s forecast resolved — TAILS, two rounds of damage

`_0042` predicted: `2026-09-05` would hold six tips this round, and if its own closing sha led
`e`–`f` the `:short` pipeline trap would be accidentally right at row 1, but if it led `0`–`d`
then `d8cfce8` (`_0027`) would win and **both `_0035` and `_0042` would be discarded**. Its tip is
`a88d56e` — leading `a`. The condition holds. From my own `:iso8601` output the six tips are
`a88d56e` (`_0042`, 00:48:45), `01aebaa` (`_0035`), `d8cfce8` (`_0027`), `ba6baa6` (`_0020`),
`0b1e5a0` (`_0013`), `304cd2d` (`_0003`); they tie at day granularity, and sha-descending gives
`d8cfce8` > `ba6baa6` > `a88d56e` > `304cd2d` > `0b1e5a0` > `01aebaa`. So the pipeline `:short`
form picks `_0027`, two rounds stale, with the real tip third of six.

⚠️ **I did not run `:short` live** — this is inference from the `:iso8601` list, exactly as
`AUTOPILOT.md:355–356` permits. Do not cite it as an A/B or a reproduction.

## What I did NOT do

- **Did not answer, reword or reorder any of the eight open decisions.** Each moves pixels or adds
  a file; all eight are the owner's call.
- **Did not apply decisions 2, 5, 6 or 7 unilaterally**, did not restore `docs/design-parity.md`
  (decision 8), and did not vendor jsPDF (decision 1 — there is still no copy on this machine and
  the network is blocked).
- **Did not retry the browser MCPs.** They are *permission*-blocked, not merely headless; decision 4
  gates them and retrying burns a round for nothing.
- **Did not invent substitute work.** Code-touching fallbacks and the last read-only fallback (the
  retrospective restore audit, completed in `2026-08-31_0023`) are both exhausted.
- **Did not trim `AUTOPILOT.md`**, now ~2,300 lines and the reason the contract text reaches the
  agent with `## Next task` empty. Deleting round history is discarding evidence and is an owner
  decision.
- **Did not add a seventh token check.** All 22 tokens are covered; there is nothing left to enforce.

## Risk

- **The single largest risk in this round is the restore, and it is silent when it goes wrong.** If
  a future round ranks tips with the `:short` pipeline it will restore `_0027` and discard two
  rounds, and *nothing downstream catches it*: the residual `git diff --stat` against the wrong tip
  is empty and all five harness keys still match, because no-op rounds touch only `AUTOPILOT.md`
  and `SUMMARY.md`. Use `:iso8601` and cross-check by refname.
- 🔴 **Forecast for the next round, resolvable and independent of my closing sha:** my commit is the
  **first tip on `2026-09-06`**, so day granularity separates it from the six `2026-09-05` tips and
  the `:short` trap will be *accidentally* right at row 1 — regardless of what my sha turns out to
  be. This is the documented rollover mask, and it lasts **exactly one round**: as soon as a second
  round lands on `2026-09-06` the tie returns. A round that reads row 1 agreeing as evidence the
  trap is retired will be wrong the round after.
- **`ds-disabled-hover` still reports 1 undecidable rule** (`.pui-menu__item:last-child`,
  `structural pseudo :last-child`, subject matches `.pui-menu__item` and
  `.pui-menu__item--danger`). A change confined to that rule computes 0 diff. It is identical in
  both versions this round, but the guard says nothing about it.
- **No browser has ever verified this app.** Every parity claim rests on source reading, the
  cascade harness and the CSS spec. The harness also does not model inheritance, which is the
  mechanism of the toast `pointer-events` bug it is pinned to.
- **The stall is now over three weeks old and has crossed two month boundaries.** It will not clear
  on its own — it needs a person to answer, not another round.
