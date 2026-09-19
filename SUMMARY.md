# Round 2026-09-20_0020 — no-op round (no owner answer; all work still blocked)

## What I did

- **Restored the previous round's work.** The branch was cut from the stale base `3503537` again
  (111th+ consecutive round: the tree I was handed had no `tools/check-tokens.mjs` and no
  `docs/btn-parity-proof.mjs`). Selected the tip **date-major**, verified `git log --oneline -4` on
  the top two candidates, restored `c7842e2` (`auto/…/2026-09-20_0010`) with
  `git checkout c7842e2 -- .`, committed as `b1a1d45`. **Tree-sha identity confirmed:**
  `git rev-parse HEAD^{tree}` and `git rev-parse c7842e2^{tree}` both print
  `0895696ed94a9a9c350f56ea8b532c228e3b5b19` — every path matches, not just the ones a diff prints.
- **Checked all five owner-answer channels. None has been answered.** (Details under Verification.)
- **Ran the A/B both ways. This round is the structural mask `_0010` forecast** — day `2026-09-20`
  held exactly one foreign tip, so both formulas returned `c7842e2`. **Heads by structure, not
  counted in the statistics**; `_0010`'s forecast was right in both result and reasoning.
- **Measured something new, across all 167 `auto/*` refs rather than the top ten:** the date in a
  branch's *name* matches its tip's commit date **167/167**, and sorting the whole ref list by
  refname is identical to sorting it by `--sort=-committerdate` in **all 167 positions**. The
  "double-check with refname" step this contract has mandated for weeks is therefore an
  independent date-major key, not a weak sanity check.
- **Ran the full Verify command and all five harness keys.** All green / all as pinned.
- **Updated `AUTOPILOT.md`'s `## Next task` block only** — recorded the resolution, the new
  measurement, and next round's forecast (`P(tails) ≈ 77.94%`, comparand `c7842e2`).

## Why

- **No task was invented.** The contract's `## Next task` says: if no owner decision has been
  answered, restore the tip, check the five channels, run Verify + the five harness keys, write
  SUMMARY, end the round — and forbids substituting other work. All eight decisions in
  `README.md → ## Open decisions` are still unanswered, so that is what this round did. Every
  remaining path to an acceptance criterion moves pixels or adds a file to the repo, which is the
  owner's call, not an agent's.
- **The refname audit is not substitute work.** The contract already *orders* refname as the
  cross-check on tip selection; nobody had ever measured whether that cross-check holds. It touches
  no tracked file (two throwaway `.tmp` files, both deleted), and it directly hardens the one step
  that, if it goes wrong, silently destroys a month of rounds.
- **I audited all 167 refs, not the visible top ten.** `_0503` found that the ranking bug
  mis-orders *every* day-group with more than one tip, so a top-ten sample proves nothing about the
  tail. A full-list positional comparison does.

## Verification

**Three-stage Verify command — all green** (run as three separate invocations; this repo's Bash
tool rejects `&&`-chained commands):

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
ds-disabled-hover c7842e2:design-system/src/styles.css design-system/src/styles.css
                                                          → PASS, with the harness's own warning:
                                                             1 undecidable rule (structural pseudo
                                                             :last-child on .pui-menu__item) that
                                                             the PASS says nothing about
```

All five `toast-hit` rows were read in full from the harness output, not counted with
`grep -c "✗ #toast:"`, which has a documented blind spot (the base-state row prints without a
colon).

**Five channels — all negative:**

| # | Channel | Result |
|---|---------|--------|
| 1 | `README.md → ## Open decisions` | `\| Option \| Cost \|` = **8**, `If you answer:` = **8** — agree, so all eight unanswered |
| 2 | `jspdf.umd.min.js` in repo | absent (full `git ls-files` read; 77 tracked files, no jsPDF) |
| 3 | `main` | still `ef3220e` (`Add README`, 2026-06-27) |
| 4 | untracked drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system` / `origin/design-system` at **2026-08-13**; then `mac/*` and `origin/hardening-pass` at 2026-07-20 — all older than this work |

Channel 5 also confirms the mask's precondition: `origin/auto/…/2026-09-20_0010` = `c7842e2`, i.e.
last round **was** pushed, so the day-group it forms is real and not local-only.

**A/B measurement (own branch `_0020` filtered out, per the standing convention):**

```
correct (--sort=-committerdate)        trap (:short, sha before refname, | sort -r)
2026-09-20 c7842e2 _0010 ✓             2026-09-20 c7842e2 _0010 ✓   ← agree (mask)
2026-09-19 0c3968d _0045               2026-09-19 c6e065b _0013     ← INVERTED
2026-09-19 21d0f4c _0035               2026-09-19 21d0f4c _0035
2026-09-19 1794e8c _0025               2026-09-19 1794e8c _0025
2026-09-19 c6e065b _0013               2026-09-19 0c3968d _0045     ← INVERTED
2026-09-18 7f342c1 _0503               2026-09-18 7f342c1 _0503
2026-09-18 304da7a _0030               2026-09-18 563e7fc _0006     ← INVERTED
2026-09-18 1c3401f _0018               2026-09-18 304da7a _0030     ← INVERTED
2026-09-18 563e7fc _0006               2026-09-18 1c3401f _0018
```

Row 1 agrees because `2026-09-20` holds one foreign tip — **the date field settles it before the
sha is consulted.** That agreement is *not* evidence the trap formula works: rows 2–9 show it still
mis-ordering both of the multi-tip day-groups below. Statistics unchanged: **tails 28 of 44**
(excluding the 3 structural heads: **28 of 41**).

**New this round — refname is itself a date-major key (measured on all 167 `auto/*` refs):**

```
name-date vs tip commit-date   → 167 refs compared, 0 mismatches
full-list order by refname     → 167 positions compared against --sort=-committerdate, 0 differ
```

`auto/<project>/YYYY-MM-DD_HHMM` sorts date-major then time-major by construction, and no round has
ever started before midnight and committed after it — including the late starters `2026-09-18_0503`
and `2026-08-24_0322`, whose names and commit dates agree. The trap formula's within-day key is the
sha, a field with **no temporal meaning at all**; that substitution is the root cause of every
mis-restore recorded in this file.

## What I did NOT do

- **Did not answer any of the eight open decisions.** Each moves pixels or adds a file to the repo.
- **Did not invent substitute work.** Fallback work is genuinely exhausted: token tooling is 22/22
  across six checks, the element-parity table is closed at 11/11, and the harness already reports
  its own undecidable selectors. The explicitly-forbidden list (implementing
  `:last-child`/combinator matching, adding the harness to Verify, applying decisions 2/5/6/7
  unilaterally) was left alone.
- **Did not switch the tip-selection key to refname.** The measurement says refname *agrees*; it
  does not say the runner will keep naming branches this way. `--sort=-committerdate` stays primary.
- **Did not retry the browser MCPs.** They are *permission*-blocked, not merely headless — that is
  decision 4, and retrying burns a round for a known answer.
- **Did not restore `docs/design-parity.md`** (decision 8, unanswered).
- **Did not append a status block to `AUTOPILOT.md`** — only the `## Next task` block was edited,
  per the `_0035` convention. The file is ~3,970 lines, which is *why* `## Next task` reaches the
  agent empty in the prompt.

## Risk

- **Nothing in the app or the design system changed this round.** The only edits are `AUTOPILOT.md`
  and this file; the restore commit `b1a1d45` reproduces `c7842e2`'s tree exactly. A reviewer should
  see a code diff of zero against `c7842e2`.
- **Procedural deviation, disclosed: I ran the `--sort=-committerdate` A/B *after* the restore
  commit, not as the first command of the round.** I selected the tip from the full refname-sorted
  branch list plus `git log --oneline -4` on the top two candidates, restored, and only then ran the
  sorted table as confirmation. Three things make this safe *this* round, and none of them is a
  reason to repeat it: (a) `git checkout <sha> -- .` moves no refs, so the table was unchanged
  except for my own branch, which the convention excludes anyway; (b) the confirmation returned
  `c7842e2` — the tip I had already restored; (c) the 167-ref audit above shows refname ordering and
  committerdate ordering are currently identical. **Next round should still run the sorted table
  first.**
- **The `toast-hit` harness key reports `FAIL — 5 declaration(s) differ`, and that is correct.** It
  pins a deliberate behaviour change (round `2026-08-24_0003` added `pointer-events:auto` to
  `.toast-act` so the toast's Undo button is clickable). What matters is *which* rows differ: all
  five must be `#toastUndo` and none may be `#toast`. Verified this round.
- **`ds-disabled-hover` PASSes but covers less than it looks like.** The harness cannot evaluate
  `:last-child`, so a change confined to `.pui-menu__item:last-child` computes 0 diff. The harness
  prints this itself; it is not a silent gap, but the PASS is not blanket coverage.
- **Next round is the dangerous one: `P(tails) ≈ 77.94%`, comparand `c7842e2`.** Day `2026-09-20`
  will hold two tips, so the tiebreak fires. Heads only if this round's closing sha sorts above
  `c7842e2` — it must start with `c`…`f`. Blast radius is 1 round. A wrong restore is
  **undetectable downstream**: the code tree would be identical, Verify green, all five harness keys
  as pinned. Date-major selection plus the refname cross-check is the only gate.
- **The stall is structural, not technical.** 111+ rounds cut from the same stale base, nothing
  merged to `main` since 2026-06-27, decision-blocked for over a month. No round can clear this — it
  needs a person to answer `## Open decisions`.
