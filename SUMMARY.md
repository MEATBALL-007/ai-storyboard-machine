# SUMMARY — round `2026-09-01_0011`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

---

## What I did

- **Restored the previous round's tip** (`ec1d48b`, branch `…/2026-09-01_0001`) into the working
  tree and committed it on its own as `a078ffd`. The runner cut this branch from `3503537` again,
  so the tree arrived without any of the design-system integration work — `tools/` held only
  `test.mjs`, and `docs/` held only `superpowers/`.
- **Checked all five owner-answer channels.** None has been answered — see the table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is the
  independent confirmation that the restore was complete rather than merely byte-equal to a sha I
  picked.
- **Updated `## Next task` in `AUTOPILOT.md`** with this round's status block and demoted the
  `_0001` block to reference status. The queued task is unchanged: check the five channels, and if
  still no answer, write SUMMARY and end.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  A previous round read files off the stale base and concluded the token task was already done,
  wasting the round. So the first action was `git log --oneline -8`, with `ls tools` in the same
  call confirming the stale base; the first file read after that came from the restored tree.
- **This round is *not* evidence for the `:iso8601` ranking formula, and I did not record it as
  such.** The top two tips fall on different calendar days (`ec1d48b` 2026-09-01 00:07:20 vs
  `e9cf110` 2026-08-31 01:01:36), so the old truncated `:short` key would have ranked this round
  correctly too — the two formulas are indistinguishable here. `:iso8601` is still the formula to
  use, because the four `2026-08-31` tips below the winner do still tie under `:short`; but a
  reviewer should not read this round as another confirmation.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--stat | tail -15` answers only for the rows that happened to
  print; the diff here is 16 files, so it would clip two. `--diff-filter=D --name-only` answers for
  the whole diff in one call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** This branch fell outside `head -8`
  entirely because it still pointed at `3503537` (2026-08-13) — but the rule applied was the name
  match, not the absence.
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
buttons            2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements,
                                                            markup coverage OK
                                                            (7 old class tokens gone,
                                                             5 new class attributes)
segmented          021b966:index.html index.html         -> PASS, 45 pairs / 9 elements,
                                                            markup coverage OK
                                                            (0 gone, 3 new)
toast              bb10dd9:index.html 10e8f39:index.html -> PASS, 5 pairs / 1 element,
                                                            markup coverage OK (0 gone, 1 new)
ds-disabled-hover  HEAD:design-system/src/styles.css design-system/src/styles.css
                                                         -> PASS, 15 pairs / 3 elements,
                                                            1 undecidable rule
                                                            (.pui-menu__item:last-child),
                                                            markup coverage N/A (stylesheet)
toast-hit          3d3d5cc:index.html index.html         -> FAIL - 5 declaration(s) differ,
                                                            0 markup problems, 0 unmatched,
                                                            10 pairs / 2 elements;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change made in
round `2026-08-24_0003` (`.toast-act` gained `pointer-events:auto`). The zero `✗ #toast` lines are
the proof the app side of that pair was not touched. It exits non-zero by design, so its run was
separated from the others; its output was captured to `.toast-hit.out` inside the repo and deleted
straight after, with `git status --untracked-files=all` re-run to confirm the tree is clean.

Restore correctness, from this round's own output:

- `git for-each-ref … %(committerdate:iso8601) … | sort -r | head -8` (run **before** the restore)
  ranked `ec1d48b` (`2026-09-01 00:07:20`) above `e9cf110` (`2026-08-31 01:01:36`), `919574c`
  (`00:54:25`) and `25b89cf` (`00:45:05`) — agreeing with branch-name order. This branch
  (`2026-09-01_0011`) still pointed at `3503537` (2026-08-13) and so fell outside `head -8`
  entirely; the winner was confirmed by `refname`, not by row position.
- Local and `origin/` refs both point at `ec1d48b`.
- `git merge-base --is-ancestor 3503537 ec1d48b` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD ec1d48b` → empty, so the path-checkout is
  tree-equivalent to a fast-forward. The restore staged 13 `M` + 3 `A` (`SUMMARY.md`,
  `docs/btn-parity-proof.mjs`, `tools/check-tokens.mjs`), no `D`.
- `git log -1 --format="%h %an %ae %ad %s" ec1d48b` → author `PHANTOM AUTOPILOT
  autopilot@phantom.local`, subject `chore: round 2026-09-01_0001 no-op -- five channels checked,
  no owner answer` — the runner's own commit, not an owner answer committed onto the old branch.
- `git diff --stat ec1d48b -- .` after the checkout → empty, so the restore is total. That also
  proves `README.md` is unchanged, which closes channel 1 more strongly than the grep does.

The five channels, and what each returned:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md` `## Open decisions` | 8 open; `\| Option \| Cost \|` = 8 and `If you answer:` = 8 — none consumed. Closed more strongly by the empty `git diff --stat ec1d48b -- .` |
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
  separate restore commit `a078ffd`, which reproduces `ec1d48b`'s tree exactly.
- **Do not read this round as a confirmation of the `:iso8601` tip-ranking formula.** Its top two
  candidates are on different days, so both the old and new formulas agree here. This is stated
  under *Why* as well, because several previous SUMMARYs did record such a confirmation and those
  claims get copied forward.
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
  restore drops everything, which has already happened ten times and cost `docs/design-parity.md`
  permanently from the tree.
