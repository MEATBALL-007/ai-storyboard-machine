# SUMMARY — round `2026-09-01_0001`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

---

## What I did

- **Restored the previous round's tip** (`e9cf110`, branch `…/2026-08-31_0056`) into the working
  tree and committed it on its own as `d1fef44`. The runner cut this branch from `3503537` again,
  so the tree arrived without any of the design-system integration work — `tools/` held only
  `test.mjs`.
- **Checked all five owner-answer channels.** None has been answered — see the table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is
  the independent confirmation that the restore was complete and not merely byte-equal to a sha I
  picked.
- **Updated `## Next task` in `AUTOPILOT.md`** with this round's status block and demoted the
  `_0056` block to reference status. The queued task is unchanged: check the five channels, and if
  still no answer, write SUMMARY and end.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (its `:root` really is byte-identical to the 11-token `tokens.css` of `3503537`). A previous
  round read files off the stale base and concluded the token task was already done, wasting the
  round. So the first action was `git log --oneline -1`; `ls tools` showing only `test.mjs`
  confirmed the stale base in the same call, and the first file read after that came from the
  restored tree.
- **This is the first round whose branch name crosses into a new calendar day**, so it is worth
  recording that the day boundary changes nothing about how the tip is found. What is ranked is the
  tip's `committerdate` (`2026-08-31 01:01:36` for `e9cf110`), not the branch name's date. The four
  `2026-08-31` rounds still tie under the old `:short` key; only `:iso8601` orders them.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--stat | tail -15` answers only for the rows that happened to
  print; the diff here is 16 files, so it would clip two. `--diff-filter=D --name-only` answers for
  the whole diff in one call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** A round's own branch can sort
  either above or below the real tip; here it fell outside `head -8` entirely because it still
  pointed at `3503537` (2026-08-13).
- **The harness was run even though no CSS changed.** An empty `git diff` proves only that bytes
  match the tip I chose. The harness recomputes each element's cascade-winning declaration set from
  the files actually on disk, so a wrong or partial restore would show up as changed counts.

## Verification

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens in sync 22/22 · fonts in sync 4/4 ·
                                   no derived-colour literals · font weights available
                                   (400/500/700/800) · no radius literals ·
                                   typeface from one source
                                   (15 CSS sources scanned per check)
npm --prefix design-system test -> Test Files 12 passed (12) / Tests 31 passed (31)
```

Parity harness, all five keys — counts identical to the previous round:

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

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change made in
round `2026-08-24_0003` (`.toast-act` gained `pointer-events:auto`). The zero `✗ #toast` lines are
the proof the app side of that pair was not touched. It exits non-zero by design, so its run was
separated from the others.

Restore correctness, from this round's own output:

- `git for-each-ref … %(committerdate:iso8601) … | sort -r | head -8` (run **before** the restore)
  ranked `e9cf110` (`2026-08-31 01:01:36`) above `919574c` (`00:54:25`), `25b89cf` (`00:45:05`) and
  `110911a` (`00:37:38`) — agreeing with branch-name order. This branch (`2026-09-01_0001`) still
  pointed at `3503537` (2026-08-13) and so fell outside `head -8` entirely; the winner was confirmed
  by `refname`, not by row position.
- Local and `origin/` refs both point at `e9cf110`, with the same tree `30e662a`.
- `git merge-base --is-ancestor 3503537 e9cf110` → ancestor-ok.
- `git diff --diff-filter=D --name-only HEAD e9cf110` → empty, so the path-checkout is
  tree-equivalent to a fast-forward. `git diff --stat HEAD e9cf110` → 16 files, 3011+/162−.
- `git log -1 --format="%h %an <%ae> %ad %s" e9cf110` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-08-31_0056 no-op -- five channels checked,
  no owner answer` — the runner's own commit, not an owner answer committed onto the old branch.
- `git diff --stat e9cf110 -- .` after the checkout → empty, so the restore is total. That also
  proves `README.md` is unchanged, which closes channel 1 more strongly than the grep does.

The five channels, and what each returned:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md` `## Open decisions` | 8 open; `\| Option \| Cost \|` = 8, `^### [1-8]\.` = 8, `If you answer:` = 8 — none consumed. Closed more strongly by the empty `git diff --stat e9cf110 -- .` |
| 2 | a vendored jsPDF in the repo | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` moved | still `ef3220e` (2026-06-27) |
| 4 | uncommitted/untracked files left by the owner | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` = `592e7c3` (2026-07-20, `origin/`+`mac/` refs only, no local branch); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) |

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
  reviewer to check in the tree. The round's own diff is `AUTOPILOT.md` + `SUMMARY.md`, plus the
  separate restore commit `d1fef44`, which reproduces `e9cf110`'s tree exactly (tree `30e662a`).
- **I did not carry forward a "Nth consecutive no-op" tally.** Rounds phrase their commits
  differently, so any such count is not cheaply checkable. The checkable facts are the five channel
  results above.
- **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child`). Its PASS says
  nothing about that rule — the harness does not implement `:last-child` matching, so a change
  confined to it would compute 0 diff. Unchanged from previous rounds, and no CSS moved this round.
- **The harness does not model inheritance**, which is the mechanism behind the `pointer-events`
  toast bug it was built to document. That part of the argument rests on source reading and the CSS
  spec, and has never been confirmed in a real browser (decision 4).
- **The real risk is structural and not fixable from inside a round:** the runner has never pushed
  any of this work to `main` (still `ef3220e`, two commits, no design-system), and it keeps cutting
  each round branch from `3503537` rather than from the previous tip. Seventy-plus round branches
  now stack in parallel, each reconstructed by path-restoring its predecessor. The work is sound,
  but it is only reachable through the newest `auto/*` branch — and a single round that skips the
  restore drops everything, which has already happened ten times and cost
  `docs/design-parity.md` permanently from the tree.
