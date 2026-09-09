# Round 2026-09-10_0003 — SUMMARY

## What I did

- **Restored the previous round's tip** (`62506ba` = `…/2026-09-09_0032`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537` (2026-08-13), so the tree
  arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the
  token/radius/font work and `README.md`'s `## Open decisions` — 16 files. Kept as its own commit
  (`478e8cf`).
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- **Resolved round `_0032`'s forecast: TAILS — the two-round "heads by luck" streak ended.** Its tip
  `62506ba` leads with `6`, which loses to the comparand `c75b1ca`, so the broken sha-first pipeline
  would have restored `_0021` and silently discarded `_0032`. Wrote the next-round forecast, which
  for structural reasons is risk-free.

## Why

- **Restore before reading anything.** On `3503537` the app's `:root` really is byte-identical to
  `tokens.css`, so the token work *looks finished* if you read the stale tree first. Round
  `2026-08-19_0022` read it that way, skipped the restore, and permanently lost
  `docs/design-parity.md` from the tree.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date (`--format='%(committerdate:short)
  %(objectname:short) …' | sort -r`), which ties same-day rounds and falls through to whichever
  field prints next. Native `--sort=` sorts on the real timestamp and cannot tie here.
- **The refname cross-check had to be read date-major, and this round is the starkest example yet
  of why.** My own round number is `_0003` — lower than yesterday's `_0032`, lower than
  `2026-09-08`'s `_0036`, lower than `2026-09-07`'s `_0041`. A selector keyed on the round number
  alone would pick `_0041` and discard three days of accumulated work. The correct reading is
  "highest round number **on the newest date present**", which gives `_0032`.
- **`_0032`'s forecast resolving TAILS is the useful outcome, not the bad one.** Two consecutive
  rounds had come out heads purely because a couple of hex digits fell the right way, and every
  prior record warned that agreement between the two formulas is the trap's most dangerous
  presentation rather than evidence it had retired. This round the hex fell the other way and the
  broken formula would have destroyed a round's work. The method did not change either time; only
  the coin did.
- **I did not run the `:short` A/B this round.** The evidence has been sufficient since
  `2026-09-04_0048` ran it live; `AUTOPILOT.md` says explicitly not to repeat it.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or adds
  a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22 under
  six checks, parity table 11/11).

## Verification

**Tip selection** — `git for-each-ref --sort=-committerdate` (my own branch's row, `478e8cf`, is
this round's restore commit and was not present at selection time):

```
2026-09-09 00:40:12 +0700  62506ba  …/2026-09-09_0032   ← selected
2026-09-09 00:30:59 +0700  c75b1ca  …/2026-09-09_0021
2026-09-09 00:18:36 +0700  c4bebe6  …/2026-09-09_0011
2026-09-09 00:09:16 +0700  0e6ad77  …/2026-09-09_0001
2026-09-08 00:43:57 +0700  1069537  …/2026-09-08_0036
```

Refname cross-check: `2026-09-09` is the newest date present other than my own, and `_0032` is its
highest round number. Both selectors agree.

**Restore result:** `git checkout 62506ba -- .` + commit `478e8cf`. `git diff --stat 62506ba` run
after the checkout is **empty** — the tree matches byte for byte. `git merge-base --is-ancestor`
holds trivially (`62506ba` descends from `3503537`, this branch's base). (`git merge --ff-only` is
denied by the permission layer, as in every prior round; the empty diff is what makes the two
equivalent.)

**Five channels — no owner answer on any of the eight decisions:**

1. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**
   (both run *after* the restore). The two counters agreeing is the "still unanswered" signal; they
   diverge when an owner appends an answer.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact absent).
3. `main` = `ef3220e` (Sat Jun 27 2026, "Add README"), unmoved.
4. `git status --untracked-files=all --short` → empty. (Path-checkout does not remove untracked
   files, so an owner-added file would still have shown here.)
5. Non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of the
   group); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `mac/hardening-pass`/
   `origin/hardening-pass` = `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` =
   `ef3220e` (2026-06-27). Nothing newer than 2026-08-13.

**Verify command — all three stages green:**

```
node tools/test.mjs            → 54 passed, 0 failed
node tools/check-tokens.mjs    → tokens 22/22 · fonts 4/4 byte-identical ·
                                 no derived-colour literals · font weights available ·
                                 no radius literals · typeface from one source
                                 (all six checks over 15 CSS sources)
npm --prefix design-system test → 12 files, 31 passed
```

**All five harness keys, matching the expected table exactly:**

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | 85 pairs / 17 elements → **PASS**, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html index.html` | 45 / 9 → **PASS**, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | 5 / 1 → **PASS**, markup 0 gone / 1 new |
| `ds-disabled-hover` | `62506ba:design-system/src/styles.css design-system/src/styles.css` | **PASS** + 1 undecidable rule |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`ds-disabled-hover`'s before side is the tip **this round actually restored** (`62506ba`), read from
`for-each-ref`, not copied from an older status block. Its one undecidable rule is the documented
`.pui-menu__item:last-child` (structural pseudo, identical in both versions), and its markup
coverage reports `N/A — the source is a stylesheet`, the correct result for a `.css` key.

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I listed all five `✗` rows rather than grepping for a substring: they are
`#toastUndo (base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — **all five are
`#toastUndo` and none is `#toast`**, which is what proves the app side was not touched.

**Forecast resolution (`_0032` → TAILS; the streak of two lucky heads ended):** `_0032` predicted
four tips tied at day granularity, so a sha-first pipeline had to beat `c75b1ca` — the highest of
the other three — over the whole string: `d`–`f` wins outright (~3/16), a leading `c` is undecided
until digit two (~1/16), `0`–`b` loses (~12/16). Its tip is `62506ba` — **leading `6`, in the
~12/16 losing branch**. So a sha-first pipeline this round would have put `c75b1ca` (`_0021`) at row
1 and discarded `_0032` entirely: one round of real damage, avoided only because selection used
`--sort=-committerdate`. Running tally of the broken formula: tails on `_0018`(`3`), `_0027`(`2`),
`_0035`(`7`), `_0041`(`9`), `_0016`(`7`), `_0026`(`2`), `_0036`(`1`), `_0032`(`6`); heads by luck on
`_0011`(`c`) and `_0021`(`c7`) → **tails 8 of 11**.

**`AUTOPILOT.md` edit is near net-zero:** `34 insertions(+), 43 deletions(-)`, one file — the
`_0035` convention (edit the Next task block, add no new `> **สถานะล่าสุด …` block) held. File is now
**2,960 lines / 398,730 bytes**, 9 lines *shorter* than it arrived.

## What I did NOT do

- **Answered no owner decision.** All eight are still open. Decisions 2, 5 and 6 are the last three
  gaps in the element-parity criterion; 1 and 4 each gate one further criterion; 8 blocks none.
- **Did not restore `docs/design-parity.md`** (`c3351fc:docs/design-parity.md`, 44,376 bytes) — that
  is decision 8 itself.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a call and changes nothing until decision 4 is answered.
- **Did not trim `AUTOPILOT.md`.** Its size is why `## Next task` reaches the prompt empty, but
  deleting round history is an owner decision.
- **Did not re-run the retrospective restore audit** (closed at `2026-08-31_0023`) or the `:short`
  A/B (`AUTOPILOT.md` says the evidence is sufficient and not to repeat it).
- **Did not invent a substitute task.** Fallback work that touches code is genuinely exhausted.

## Risk

- **Nothing in this round can regress the app** — `git diff` for the round proper touches only
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `62506ba`'s tree
  (empty `git diff --stat 62506ba`), independently corroborated by all five harness keys recomputing
  their cascades from the files actually standing and reporting unchanged counts.
- 🟢 **The next round's tip selection is structurally safe, for once, and this is worth stating
  precisely so nobody over-reads it.** This round's tip lands on `2026-09-10` and is the **only**
  tip on that date, so the top group holds one row and there is no tie to break — any formula gets
  row 1 right regardless of sha. The same thing happened at `2026-09-07_0000`.
- 🔴 **That safety expires the moment a second round closes today.** With two tips on `2026-09-10`
  the tie returns for the round after next, and the new comparand is `62506ba` (leading `6`):
  sha-first wins on `7`–`f` (~9/16), is undecided on `6` (~1/16), loses on `0`–`5` (~6/16). Round
  `_0003`'s low refname number sinks correctly under refname-first ordering and randomly under
  sha-first. **Use `--sort=-committerdate` regardless of the shas.**
- ⚠️ **This round's TAILS is the counter-evidence to two rounds of apparent safety.** The failure
  mode is agreement between the two formulas; it had occurred twice consecutively and both times was
  decided by one or two hex digits. It did not hold a third time. Nothing about the trap changed —
  only the coin did.
- 🔴 **The runner bug is unfixed after ~4 weeks** (85+ branches cut from `3503537`; `main` still
  `ef3220e` from 2026-06-27). Every round pays a restore commit for it. No round can fix this.
- ⚠️ **`toast-hit` exits non-zero by design.** If the runner gates the PR on exit codes, do not read
  that as a regression — the count must be exactly 5 and all five rows `#toastUndo`.
- ⚠️ **Still never verified in a real browser.** Every parity claim in this repo rests on source
  reading, the cascade harness and the CSS spec. The harness in particular does **not** model
  inheritance, and does not read `:hover` behaviour.
- ⚠️ **The stall needs a person, not another round.** Eight decisions, three-plus weeks, across a
  calendar-month boundary. Rounds will keep costing a restore and producing nothing until one is
  answered.
