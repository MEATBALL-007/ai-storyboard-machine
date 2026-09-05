# Round 2026-09-06_0036 — SUMMARY

## What I did

- **Restored the previous round's tree first.** `git log --oneline -1` showed `3503537` — the
  branch was cut from the stale base again, as it has been every round. Selected the previous tip
  with `%(committerdate:iso8601)` + `head -16`, cross-checked by refname (`_0028` is the highest
  round number below my own `_0036`), and confirmed the preconditions before touching the tree.
  Restore commit `0cb2587`; `git diff --stat ad5855c -- .` afterwards is **empty**.
- **Checked all five owner-answer channels — none has been answered.** All 8 decisions in
  `README.md → ## Open decisions` still stand as unanswered option tables.
- **Ran the full Verify (3 stages) and all 5 harness keys.** Everything reproduces the recorded
  numbers exactly, which is the second, independent confirmation that the restore was correct.
- **Wrote this round's status block into `AUTOPILOT.md`** and resolved the forecast round `_0028`
  left behind (see Why). Touched **only** `AUTOPILOT.md` and `SUMMARY.md` — not one byte of
  `index.html`, `design-system/`, `tools/` or `docs/`.

## Why

**No owner answer means this is a no-op round by contract, not by choice.** `AUTOPILOT.md`'s
`## Next task` says so explicitly: if no decision has been answered, restore, check the five
channels, run Verify plus the harness, write SUMMARY, and end. Fallback work that touches code is
exhausted (token tooling is 22/22 across six checks, the parity table is closed at 11/11), and the
last read-only fallback — the retrospective restore audit — was completed in round
`2026-08-31_0023`. Inventing a substitute task here would mean unilaterally applying decision
2/5/6/7, which moves pixels the owner has not approved.

**Round `_0028`'s tie-break forecast resolved HEADS — and the damage case shrank, it did not
retire.** `_0028` predicted: if its own closing sha led `9`–`f`, the `:short` trap stays
accidentally right at row 1; if `0`–`7`, `8def8f7` wins and three rounds get discarded at once.
Its tip is `ad5855c` — leading `a`, so the "heads" branch. My `for-each-ref` output confirms the
premise: four tips share `2026-09-06`, tie at day granularity, and sha-descending gives
`ad5855c` > `8def8f7` > `756027b` > `73c58d5`, putting the real tip at row 1.

That is luck, not safety, and I want to be precise about what it does and does not show:
**rows 2–4 are still genuinely inverted** (`8def8f7`/`_0002`, the *oldest* tip of the day, ranks
above both `_0020` and `_0012`). The 3-round damage case is merely **unmet**, not disproven.
I did **not** run `:short` live — `AUTOPILOT.md:355–356` records that the A/B has enough evidence
and need not be re-run, so this is inference from the `:iso8601` output and must not be cited as a
measurement.

**My own forecast for the next round: the damage case is now 1 round, down from 3**, because
`_0028`'s tip happens to lead with a high hex digit. After my commit `2026-09-06` holds five tips;
the highest leading digit in the group is `a` (`ad5855c`). If my closing sha leads `b`–`f` the trap
stays accidentally right; if `0`–`9`, `ad5855c` wins and only *this* round is discarded; if exactly
`a`, it is decided against `d5855c`. A round cannot resolve its own forecast — writing the sha down
changes it — so the next round evaluates this from the `for-each-ref` call it already makes.

## Verification

Restore preconditions (all run before touching the tree):

```
git log -1 --format="%h %an <%ae> %ad %s" ad5855c
  → ad5855c PHANTOM AUTOPILOT <autopilot@phantom.local> Sun Sep 6 00:34:44 2026 +0700
    chore: round 2026-09-06_0028 no-op -- five channels checked, no owner answer
    (author = the runner, i.e. the previous round's own commit, not an owner answer)
git merge-base --is-ancestor 3503537 ad5855c   → ancestor-ok
git diff --diff-filter=D --name-only HEAD ad5855c → empty (path-checkout ≡ fast-forward)
git diff --stat ad5855c -- .   (after restore)   → empty (tree matches byte for byte)
```

Verify command — **all three stages green**:

```
node tools/test.mjs           → 54 passed, 0 failed
node tools/check-tokens.mjs   → 6/6 checks, 15 CSS sources:
    tokens 22/22 identical · fonts 4/4 byte-identical · no derived-colour literals
    font weights all in {400,500,700,800} · every border-radius reads --r-* · every
    font-family reads var(--mono)
npm --prefix design-system test → 12 files, 31 passed (31)
```

Parity harness — all 5 keys match the table in `AUTOPILOT.md`'s `**Verify:**` block:

```
buttons           2488f2d:index.html index.html                      → PASS, 85 pairs / 17 elements,
                                                                        markup 7 gone / 5 new
segmented         021b966:index.html index.html                      → PASS, 45 / 9, markup 0 / 3
toast             de07ea8:index.html 10e8f39:index.html              → PASS, 5 / 1, markup 0 / 1,
                                                                        no undecidable rule
ds-disabled-hover ad5855c:…/styles.css design-system/src/styles.css  → PASS, 15 / 3,
                                                                        + 1 undecidable
toast-hit         3d3d5cc:index.html index.html                      → FAIL — 5 declaration(s)
                                                                        differ (the correct,
                                                                        expected result)
```

- The `ds-disabled-hover` undecidable rule is `.pui-menu__item:last-child`, unreadable because
  `structural pseudo :last-child`; subject matches `.pui-menu__item`, `.pui-menu__item--danger`.
  Identical in both versions. The PASS says nothing about it.
- `toast-hit`'s FAIL-5 is the pinned, deliberate `pointer-events:auto` behaviour change from round
  `2026-08-24_0003`, not a regression. 10 pairs / 2 elements, 0 markup problems, 0 unmatched. I read
  **all five `✗` rows in full** and every one is `#toastUndo` (`(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`), each `before: (unset)` → `after : auto <- .toast-act`. **No `#toast`
  row** — which is the proof its `pointer-events:none` is still in place. I deliberately did **not**
  use `grep -c "✗ #toast:"`: the base-state row prints `✗ #toast (base)` with no colon, so that
  pattern returns 0 even when the check should fire (documented in round `2026-09-03_0043`).
- `ds-disabled-hover`'s before side is `ad5855c` — the tip **this round actually restored**, read
  from `for-each-ref`, not copied from an older status block.

Five channels, all checked **after** the restore (channel 1 returns a misleading `0` on the stale tree):

| # | Channel | Result |
|---|---------|--------|
| 1 | `README.md → ## Open decisions` | `grep -c "| Option | Cost |"` = **8**, `grep -c "If you answer:"` = **8** — the two counters **agree**, so nobody answered (a disagreement is the signal) |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | `ef3220e` (2026-06-27) — unmoved |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`, `mac/design-system` = `e3a355c` (2026-07-20); `mac/hardening-pass`, `origin/hardening-pass` = `592e7c3` (2026-07-20); `main`, `mac/main`, `origin`, `origin/main` = `ef3220e`. Nothing newer than 2026-08-13. |

## What I did NOT do

- **Did not answer any of the 8 open decisions.** Every one moves pixels or adds a file; that is
  the owner's call. Decisions 2, 5 and 6 are the last three gaps in the element-parity criterion;
  1 and 4 each gate a criterion of their own.
- **Did not tick any acceptance-criterion box.** None moved, because all remaining ones are
  blocked on those decisions.
- **Did not run the `:short` A/B live.** `AUTOPILOT.md:355–356` says the evidence is sufficient and
  future rounds need not re-run it. My statements about the tie-break are inference from the
  `:iso8601` output, and I have labelled them as such rather than dressing them up as measurement.
- **Did not restore `docs/design-parity.md`** (recoverable at `c3351fc:docs/design-parity.md`).
  That is decision 8 and it blocks no acceptance criterion.
- **Did not re-run the retrospective restore audit** — completed in round `2026-08-31_0023`, and
  `AUTOPILOT.md` explicitly forbids repeating it.
- **Did not trim `AUTOPILOT.md`** (now 2,542 lines / 336,726 bytes before this round's edit). Its
  size is *why* `## Next task` arrives empty in the prompt, but deleting round history is discarding
  evidence and is an owner decision.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying without a permission change just burns a round (decision 4).

## Risk

- **Nothing in this round's diff can move a pixel** — only `AUTOPILOT.md` and `SUMMARY.md` changed.
  A reviewer can confirm that from `git show --stat` on the two commits.
- 🔴 **The runner bug is unfixed and this is now the 72nd round cut from `3503537`.** The stall is
  3+ weeks old and has crossed a month boundary. It cannot be cleared by another round; it needs a
  person to answer a decision, or the runner to stop cutting from the stale base.
- ⚠️ **The `:short` tie-break trap did not fire this round only by luck.** Any future round that
  ranks tips with `%(committerdate:short) | sort -r` and takes row 1 can silently restore the wrong
  sibling, and **nothing downstream catches it**: the residual `git diff --stat` against the wrong
  tip is empty, all five harness keys still match, and all three Verify stages stay green, because
  no-op rounds touch only `AUTOPILOT.md`/`SUMMARY.md`. Use `:iso8601` + a refname cross-check, and
  never pick by row number.
- ⚠️ **`toast-hit` reporting `FAIL — 5` is correct here and must not be "fixed".** The same
  5-declaration count also appears if a round runs the `toast` key with an open-ended after side
  (the `README.md:338` template). Tell them apart by the harness line `after : auto <- .toast-act`.
- ⚠️ **The `.pui-menu__item:last-child` rule is outside what the harness can decide.** A change
  confined to it computes 0 diff. It is identical in both versions here, but a future round editing
  `Menu.css` must read it by hand.
- ⚠️ **No browser has ever verified this app.** Every visual claim in the repo rests on source
  reading, the token checker, and the cascade harness — none of which does hit testing or models
  inheritance. That is decision 4, still unanswered.
