# Round 2026-09-06_0020 — SUMMARY

## What I did

- **Restored the previous round's tip `73c58d5` (`…/2026-09-06_0012`) onto the stale base
  `3503537`**, as its own commit (`27fb4f9`), before reading any project file. The runner cut this
  branch from `3503537` again.
- **Checked all five owner-answer channels — no answer to any of the 8 open decisions.** Every
  remaining acceptance criterion is gated on one of them, so there was no unblocked work to do.
- **Ran the full three-stage Verify and all five `docs/btn-parity-proof.mjs` harness keys.** All
  green / all matching the expected counts; details under Verification.
- **Wrote this SUMMARY and refreshed the status block in `AUTOPILOT.md`.** `Next task` is unchanged
  in substance (still "no-op until an owner answers"), with this round's evidence folded in.
- **Touched no code**: `index.html`, `design-system/`, `tools/` and `docs/` are byte-identical to
  the restored tip. Only `AUTOPILOT.md` and `SUMMARY.md` changed after the restore commit.

## Why

The queued `## Next task` (read from the *restored* `AUTOPILOT.md` at line 340, not from the prompt
text, which arrives truncated with the section empty) says plainly: if no owner decision has been
answered, the round is a no-op — restore, check the five channels, run Verify plus the five harness
keys, write SUMMARY, end. It explicitly forbids inventing substitute work, and both memory notes and
`README.md` record that fallback work is exhausted: token tooling is 22/22 across six checks, the
component parity table is closed at 11/11, and the last read-only fallback (the retrospective
restore audit) was completed in `2026-08-31_0023` and marked do-not-repeat.

The three remaining delta points (chip padding, segmented padding, input sizes) and the three
gating items (jsPDF vendoring, browser verification, disabled-hover repair) all **move pixels or add
a file**, which makes each an owner's call, not an agent's. Answering one myself is the one action
that would make this system worse than doing nothing.

I selected the tip with `%(committerdate:iso8601)` + `head -20` and **cross-checked by refname**
(`_0012` is the highest round number below my own `_0020`) rather than by row position — both the
`:short` tie-break trap and the row-position trap are documented failure modes here.

## Verification

**Verify command — all three stages green:**

```
node tools/test.mjs         → 54 passed, 0 failed
node tools/check-tokens.mjs → 6/6 checks pass, 15 CSS sources scanned:
                              tokens 22/22 · fonts 4/4 byte-identical ·
                              no derived-colour literals · font-weights ⊂ {400,500,700,800} ·
                              every border-radius reads --r-* · every font-family reads var(--mono)
npm --prefix design-system test → 12 files, 31 passed
```

**All five harness keys — every value matches the expected table:**

| key | command (before → after) | result |
|---|---|---|
| `buttons` | `2488f2d:index.html` → `index.html` | PASS, 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html` → `index.html` | PASS, 45 pairs / 9 elements, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html` → `10e8f39:index.html` | PASS, 5 pairs / 1 element, markup 0 gone / 1 new, **no undecidable** |
| `ds-disabled-hover` | `73c58d5:design-system/src/styles.css` → working copy | PASS, 15 pairs / 3 elements, **+1 undecidable** |
| `toast-hit` | `3d3d5cc:index.html` → `index.html` | **FAIL — 5 differ** (expected), 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

- `ds-disabled-hover`'s before side is the tip **this round actually restored** (`73c58d5`), read
  from `git for-each-ref`, not copied from a status block. Its 1 undecidable rule is
  `.pui-menu__item:last-child` (unreadable: structural pseudo `:last-child`; subject matches
  `.pui-menu__item`, `.pui-menu__item--danger`) — the PASS says nothing about that rule.
- `toast-hit`'s FAIL-5 is the **correct** result: it pins the deliberate 2026-08-24
  `pointer-events:auto` fix. I read all five `✗` rows in full rather than using
  `grep -c "✗ #toast:"`, which has a documented blind spot (the base row prints `✗ #toast (base)`
  with no colon). All five rows are `#toastUndo` — `(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`, each `before: (unset)` → `after : auto <- .toast-act`. **No `#toast`
  row appears**, which is the proof that `#toast`'s own `pointer-events:none` was not disturbed.

**Restore preconditions, all checked before touching the tree:**

```
git log --oneline -1                                  → 3503537  (stale base confirmed)
git log -1 --format=… 73c58d5                         → PHANTOM AUTOPILOT <autopilot@phantom.local>
                                                        "chore: round 2026-09-06_0012 no-op …"
git merge-base --is-ancestor 3503537 73c58d5          → ancestor-ok
git diff --diff-filter=D --name-only HEAD 73c58d5     → empty (path-checkout ≡ fast-forward)
git diff --stat 73c58d5 -- .   (after checkout)       → empty (tree matches tip byte for byte)
```

**Five channels — no owner answer:**

1. `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:" README.md` = **8**
   → the two counters **agree**, which is the "nobody answered" signal. Run *after* the restore.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact absent)
3. `main` = `ef3220e` (2026-06-27) — unmoved
4. `git status --untracked-files=all --short` → empty
5. non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of the
   group), `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` — nothing newer than 2026-08-13.

**`:short` forecast from round `_0012` — RESOLVED, TAILS, exactly as its condition described.**
`_0012` predicted: with `2026-09-06` holding two tips, a closing sha leading `9`–`f` keeps the
pipeline `:short` form accidentally right at row 1, while `0`–`7` hands row 1 to `8def8f7` and
discards `_0012` entirely. Its tip is **`73c58d5` — leading `7`**, so the tails branch is the live
one: `8def8f7` (`_0002`, 00:09:09) and `73c58d5` (`_0012`, 00:19:01) tie at day granularity, and
sha-descending puts `8` (0x38) above `7` (0x37). A round using the pipeline `:short` form this
morning would have restored `_0002` and **silently thrown away all of `_0012`**. My `for-each-ref`
output confirms the premise: those two tips, tied on the day, at selection time.
⚠️ **I did not run `:short` live** — this is inference from the `:iso8601` output, not an A/B.
`AUTOPILOT.md:355–356` says the A/B need not be re-run, so this is compliance, not a skipped step.

## What I did NOT do

- **Did not answer, or act on, any of the 8 open decisions.** Each moves pixels or adds a file.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte.
- **Did not re-run the retrospective restore audit** (completed `2026-08-31_0023`, marked do-not-repeat).
- **Did not restore `docs/design-parity.md`** from `c3351fc` — that is decision 8, unanswered.
- **Did not re-run the `:short` A/B**, per `AUTOPILOT.md:355–356`.
- **Did not retry the browser MCPs** — Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless, so retrying burns a round for a known refusal (decision 4).
- **Did not trim `AUTOPILOT.md`** — measured this round with `wc`: **2,430 lines / 320,834 bytes**.
  Its size is *why* the prompt's copy arrives truncated with an empty `## Next task`. Deleting round
  history is discarding evidence and is an owner call.
- **Did not tick any acceptance-criterion box** — nothing was completed this round.

## Risk

- 🔴 **The real risk this round is not in the diff, it is in the stall.** The stall on owner
  decisions is now **3+ weeks old and has crossed both a month and several day boundaries**. Nothing
  merges to `main` (still 2 commits, no design system), so 80+ `auto/*` branches stack in parallel.
  **No further agent round can improve this** — it needs a person to answer
  `README.md → ## Open decisions`. (I am not carrying forward an "Nth consecutive round" tally in
  the commit message; the checkable fact is simply that my `git log --oneline -1` showed `3503537`.)
- 🔴 **Forecast for the next round — the damage window widens to two rounds.** After my commit,
  `2026-09-06` holds **three** tips: `8def8f7` (`_0002`, 00:09:09), `73c58d5` (`_0012`, 00:19:01)
  and mine. All three tie at day granularity, so the pipeline `:short` form falls to sha-descending
  against a current maximum leading digit of `8`. **If my closing sha leads `9`–`f`, `:short` is
  accidentally right at row 1; if it leads `0`–`7`, `8def8f7` wins and the next round would silently
  discard both `_0012` and this round — two rounds at once; if it leads exactly `8`, the outcome is
  decided by the following hex digits against `def8f7`.** A round cannot resolve this about itself
  (stating the sha changes it), so the next round evaluates it from the `for-each-ref` call it
  already makes. Use `:iso8601` + refname and the question never arises.
- ⚠️ **A wrong-tip restore is undetectable downstream.** Because no-op rounds touch only
  `AUTOPILOT.md`/`SUMMARY.md`, restoring the wrong sibling leaves an empty residual diff, five
  matching harness keys, and three green Verify stages. The refname cross-check is the only cheap
  independent guard — reviewers should confirm `27fb4f9`'s tree equals `tree(73c58d5)`.
- ⚠️ **`ds-disabled-hover`'s PASS excludes 1 undecidable rule** (`.pui-menu__item:last-child`). A
  change confined to that rule computes 0 diff. It must be read by hand; the harness says so itself.
- ⚠️ **The harness does not model inheritance and jsdom does no hit testing**, so the
  `pointer-events` reasoning behind the Toast fixes rests on source + CSS spec, never on a rendered
  page. **No round has ever opened this app in a real browser** (decision 4).
- ⚠️ Nothing here proves the app *works*, only that it is unchanged. The verification is
  regression-shaped by design.
