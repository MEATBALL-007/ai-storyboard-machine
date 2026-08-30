# Round 2026-08-31_0049 — no-op: restore, check five channels, stop

The task named in `AUTOPILOT.md`'s `## Next task` is conditional: read `README.md`'s
`## Open decisions` first, act on any owner answer found, and if there is none, run the no-op
cycle — check the five channels an answer could arrive through, write this file, end the round.
**No answer arrived.** All eight decisions are still open.

Nothing outside `AUTOPILOT.md` and `SUMMARY.md` was modified. `index.html`, `design-system/`,
`tools/` and `docs/` are byte-identical to the previous round's tip.

## What I did

- **Restored the previous round's tip** (`25b89cf`, branch `…/2026-08-31_0039`) onto this branch,
  which the runner had again cut from the stale base `3503537`. Kept as its own commit (`8c55afa`)
  so this round's real diff stays readable.
- **Checked all five channels for an owner answer. Found none**, on any of the eight decisions.
- **Ran the full Verify command and all five parity-harness keys**; every number reproduces the
  previous round's exactly, which is the independent evidence that the restore was complete.
- **Updated `AUTOPILOT.md`'s status block** for this round and left `## Next task` pointing at the
  same no-op cycle, since the answer it waits on still has not come.

## Why

**Why the restore comes before reading anything.** The runner cuts every `auto/*` branch from
`3503537`, but the `AUTOPILOT.md` text handed to the agent is generated from the *previous* round's
branch — so the contract describes files that are not in the tree. The documented worst failure is
not forgetting the restore, it is *reading files before* it: on the stale tree the work looks
finished and nothing looks wrong (round `2026-08-28_0004` lost a whole round to exactly that, and
round `2026-08-19_0022` permanently dropped `docs/design-parity.md` the same way).

**Why I checked for deletions separately instead of trusting `--stat | tail`.** `git diff --stat
HEAD 25b89cf | tail -15` clipped two of the sixteen file rows, and a deletion hiding in a clipped
row is precisely the condition that makes `git checkout <tip> -- .` *not* equivalent to a
fast-forward (path-checkout cannot remove a file the tip deleted). `git diff --diff-filter=D
--name-only HEAD 25b89cf` returned empty, which settles it for the whole diff rather than for the
rows that happened to print.

**Why `git diff --stat 25b89cf -- .` printing nothing is the real proof for channel 1.** Byte
identity with the tip means `README.md` cannot contain an answer the tip did not already have. The
`grep -c` count is corroboration only — a count of 8 would survive the owner editing prose *inside*
a decision block, whereas the empty diff would not.

**Why the harness ran in a round that changed no CSS.** An empty `git diff` proves bytes match; the
harness proves *behaviour* matches, because it recomputes each element's cascade-winning
declaration set from the files actually standing. A partial or wrong restore shows up as changed
pair counts even when `git status` is clean. Round `_0020` skipped these on the "no CSS changed"
argument and `_0031` reinstated it.

**Why the tip was identified by refname, not by row position.** All four `2026-08-31` branches share
a calendar day. That is the exact condition under which the old `%(committerdate:short)` key ties
and `sort` falls through to comparing SHA strings, which has previously ranked an older round above
a newer one. I used `%(committerdate:iso8601)` (second granularity, a total order) and matched the
`refname` against this branch's own name. The result also agrees with branch-name order
(`_0004` < `_0014` < `_0023` < `_0039`), so two independent signals corroborate.

## Verification

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                   font weights ok (400/500/700/800) · no radius literals ·
                                   one typeface source   (15 CSS sources scanned per check)
npm --prefix design-system test -> Test Files 12 passed (12) / Tests 31 passed (31)
```

Parity harness, all five keys, counts identical to the previous round:

```
buttons            2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
segmented          021b966:index.html index.html         -> PASS, 45 pairs / 9 elements
toast              bb10dd9:index.html 10e8f39:index.html -> PASS, 5 pairs / 1 element
ds-disabled-hover  HEAD:design-system/src/styles.css design-system/src/styles.css
                                                         -> PASS, 15 pairs / 3 elements,
                                                            1 undecidable rule
                                                            (.pui-menu__item:last-child)
toast-hit          3d3d5cc:index.html index.html         -> FAIL - 5 declaration(s) differ,
                                                            0 markup problems, 0 unmatched,
                                                            10 pairs / 2 elements;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change in round
`2026-08-24_0003` (`.toast-act` gained `pointer-events:auto`). The zero `✗ #toast` lines are the
proof the app side of that pair was not touched.

Restore correctness: `git diff --stat 25b89cf -- .` empty; `git diff --stat HEAD 25b89cf` = 16
files, 2948+/162−; `git diff --diff-filter=D --name-only HEAD 25b89cf` empty, so the path-checkout
is tree-equivalent to a fast-forward; `git merge-base --is-ancestor 3503537 25b89cf` → ancestor-ok;
`git log -1 --format="%h %an <%ae> …" 25b89cf` → author `PHANTOM AUTOPILOT
<autopilot@phantom.local>`, i.e. the runner's own commit and not an owner answer committed onto the
old branch.

The five channels, and what each returned:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md` `## Open decisions` | 8 open; `\| Option \| Cost \|` = 8, none consumed. Closed more strongly by the empty `git diff --stat 25b89cf -- .` |
| 2 | a vendored jsPDF in the repo | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` moved | still `ef3220e` (2026-06-27) |
| 4 | uncommitted/untracked files left by the owner | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c`, `hardening-pass` = `592e7c3` (origin+mac refs only, no local branch), `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` |

## What I did NOT do

- **Did not answer, or partially implement, any of the eight open decisions.** Every one of them
  moves pixels or adds a file to the repo; that is the owner's call, and it is the single reason
  this round had no code work available.
- **Did not restore `docs/design-parity.md`** from `c3351fc`. That is decision 8, and the file
  predates the radius tokens, the font inlining and the `.btn` refactor, so restoring it raw would
  immediately contradict `AUTOPILOT.md`; reconciling it means judging its content, which is the
  owner's call.
- **Did not re-run the retrospective restore audit** — completed in round `2026-08-31_0023` and
  explicitly marked do-not-repeat.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked here,
  not merely headless; retrying costs a round and changes nothing (decision 4).
- **Did not pick up any item from the Next task block's explicitly-forbidden list** (implementing
  `:last-child`/combinator matching in the harness, adding the harness to Verify, or applying
  decisions 2/5/6/7 unilaterally).

## Risk

- **The Verify command passes and this round changed no code**, so there is nothing new for a
  reviewer to check in the tree. The diff is `AUTOPILOT.md` + `SUMMARY.md`, plus the separate
  restore commit `8c55afa` which reproduces the previous tip exactly.
- **The consecutive-no-op count is inherited, not re-derived.** The previous round recorded itself
  as the 16th in a row; I observed that this round is also a no-op but did not verify the running
  total, because rounds phrase their commits differently and any such tally is not cheaply
  checkable. Treat the number as narrative, not evidence. The checkable facts are the five channel
  results above.
- **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child`). Its PASS says
  nothing about that rule — the harness does not implement `:last-child` matching, so a change
  confined to it would compute 0 diff. Unchanged from previous rounds, and no CSS moved this round.
- **The harness does not model inheritance**, which is the mechanism behind the `pointer-events`
  toast bug it was built to document. That part of the argument rests on source reading and the CSS
  spec, and has never been confirmed in a real browser (decision 4).
- **The real risk is structural and not fixable from inside a round:** the runner has never pushed
  any of this work to `main` (still `ef3220e`, two commits, no design-system). Seventy-plus round
  branches now stack in parallel, each one reconstructed by path-restoring its predecessor. The
  work is sound but it is only reachable through the newest `auto/*` branch.
