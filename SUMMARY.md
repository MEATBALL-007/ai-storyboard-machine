# Round 2026-08-31_0039 — no-op: restore, check five channels, stop

The task named in `AUTOPILOT.md`'s `## Next task` is conditional: read `README.md`'s
`## Open decisions` first, act on any owner answer found, and if there is none, run the no-op
cycle — check the five channels an answer could arrive through, write this file, end the round.
No answer arrived. This is the **16th consecutive** round with all eight decisions open.

Nothing outside `AUTOPILOT.md` and `SUMMARY.md` was modified. `index.html`,
`design-system/`, `tools/` and `docs/` are byte-identical to the previous round's tip.

## What I did

- **Restored the previous round's tip** (`110911a`, branch `…/2026-08-31_0023`) onto this branch,
  which the runner had again cut from the stale base `3503537` — the 41st time. Kept as its own
  commit (`eb88ff9`) so this round's real diff stays readable.
- **Checked all five channels for an owner answer. Found none**, on any of the eight decisions.
- **Ran the full Verify command and all five parity-harness keys**; every number reproduces the
  previous round's exactly, which is the independent evidence that the restore was complete.
- **Updated `AUTOPILOT.md`'s status block** for this round and left `## Next task` pointing at the
  same no-op cycle, since the answer it waits on still has not come.
- Recorded one new (small) fact in the status block: this round's two independent tip-ranking
  methods agreed, so they can corroborate each other for free — see Why.

## Why

**Why the restore comes before reading anything.** The runner cuts every `auto/*` branch from
`3503537`, but the `AUTOPILOT.md` text it hands the agent is generated from the *previous* round's
branch. So the contract describes files that are not in the tree. The documented worst failure is
not forgetting the restore — it is *reading files before* it: on the stale tree `index.html`'s
`:root` really does match `tokens.css` (11 tokens), so the work looks finished and nothing looks
wrong. `ls tools` showing only `test.mjs` was the confirming tell here.

**Why `git diff --stat 110911a -- .` printing nothing is the real proof for channel 1.** Byte
identity with the tip means `README.md` cannot contain an answer the tip did not already have.
The `grep -c` counts are corroboration only — a count of 8 would survive the owner editing prose
*inside* a decision block, whereas the empty diff would not.

**Why the harness ran in a round that changed no CSS.** An empty `git diff` proves bytes match;
the harness proves *behaviour* matches, because it recomputes each element's cascade-winning
declaration set from the files actually standing. A partial or wrong restore shows up as changed
pair counts even when `git status` is clean. Round `_0020` skipped these on the "no CSS changed"
argument and `_0031` reinstated them.

**Why the two ranking methods are worth cross-checking.** All three `2026-08-31` branches share a
calendar day, which is exactly the condition under which the old `%(committerdate:short)` key ties
and `sort` falls through to comparing SHA strings. `git branch -a --sort=-committerdate` (native,
full precision) and the `%(committerdate:iso8601)` pipeline both put `_0023` on top, and that
agrees with branch-name order — three independent signals, no tiebreak needed.

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
                                                            0 markup problems, 0 unmatched;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change in round
`2026-08-24_0003` (`.toast-act` gained `pointer-events:auto`). The zero `✗ #toast` lines are the
proof the app side of that pair was not touched.

Restore correctness: `git diff --stat 110911a -- .` empty; `git diff --stat HEAD 110911a` = 16
files, 2949+/162−, no `deleted` line, so the path-checkout is tree-equivalent to a fast-forward;
`git merge-base --is-ancestor 3503537 110911a` → ancestor-ok;
`git log -1 --format="%h %an <%ae> …" 110911a` → author `PHANTOM AUTOPILOT
<autopilot@phantom.local>`, i.e. the runner's own commit and not an owner answer committed onto
the old branch.

The five channels, and what each returned:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md` `## Open decisions` | 8 open; `\| Option \| Cost \|` = 8, `^### [1-8]\.` = 8, `If you answer:` = 8, none consumed. Inline grep `answer\|decided\|chose\|we pick` → 10 hits, all pre-existing prompt text |
| 2 | a vendored jsPDF in the repo | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` moved | still `ef3220e` (2026-06-27) |
| 4 | uncommitted/untracked files left by the owner | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c`, `hardening-pass` = `592e7c3` (origin+mac refs only, no local branch), `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` |

## What I did NOT do

- **Did not answer, or partially implement, any of the eight open decisions.** Every one of them
  moves pixels or adds a file to the repo; that is the owner's call, and it is the single reason
  three acceptance criteria stay unticked.
- **Did not restore `docs/design-parity.md`** (lost at round `2026-08-19_0022`, still reachable at
  `c3351fc:docs/design-parity.md`). It is decision 8 and remains unanswered.
- **Did not re-run the retrospective restore audit** — closed in round `_0023`, and the task block
  forbids repeating it.
- **Did not invent substitute work.** The code-touching backlog is exhausted and the last
  read-only item closed last round; `## Next task` explicitly forbids using "nothing to do" as a
  reason to pick something off the forbidden list.
- **Did not open a browser.** Still permission-blocked (decision 4), so acceptance criterion 3
  remains unverified by real rendering, as in every prior round.

## Risk

- **Nothing in this round is new work, so there is little to review — the risk is the opposite
  one: that a reviewer reads 41 rounds of green Verify as progress.** It is not. The three
  unticked acceptance criteria have been blocked on owner input for 16 consecutive rounds and no
  amount of agent work will move them.
- **Channel 1 detects an answer committed to `README.md`. It cannot detect one delivered any other
  way** — a comment on a PR, a chat message, an email. If the owner has answered somewhere the
  repo cannot see, this round (and the fifteen before it) reports "no answer" and is wrong about
  it.
- **The harness numbers are a restore check, not a correctness check.** They prove the files
  standing now compute the same cascade as last round; they say nothing about whether that cascade
  is what the owner wants, and `ds-disabled-hover` still carries 1 rule
  (`.pui-menu__item:last-child`) the harness cannot read at all.
- The underlying runner bug is untouched and will re-cut the next branch from `3503537` again.
