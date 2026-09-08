# Round 2026-09-09_0021 — SUMMARY

## What I did

- **Restored the previous round's tip** (`c4bebe6` = `…/2026-09-09_0011`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537` (2026-08-13), so the tree
  arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the
  token/radius/font work and `README.md`'s `## Open decisions` — 16 files. Kept as its own commit.
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- **Resolved round `_0011`'s forecast in `AUTOPILOT.md`: HEADS, but by luck rather than by
  construction** — the exact "two formulas agree for the wrong reason" case it warned about — and
  wrote the next-round forecast, where the odds swing hard the other way (~3/16).

## Why

- **Restore before reading anything.** On `3503537` the app's `:root` really is byte-identical to
  `tokens.css`, so the token work *looks finished* if you read the stale tree first. Round
  `2026-08-19_0022` read it that way, skipped the restore, and permanently lost
  `docs/design-parity.md` from the tree.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date (`--format='%(committerdate:short)
  %(objectname:short) …' | sort -r`), which ties same-day rounds and falls through to whichever
  field prints next. Native `--sort=` sorts on the real timestamp and cannot tie here.
- **This round is the one where that discipline paid nothing visible — and that is the point.**
  `2026-09-09` held two tips at selection time, so the broken sha-first formula *also* had to
  choose; `c4bebe6` starts with `c`, beats `0e6ad77`'s `0`, and lands on the right tip by accident.
  Agreement here is a one-hex-digit coincidence, not evidence the trap retired. I recorded it as
  such rather than relaxing the method.
- **The refname cross-check was read date-major**, not by round number alone: today's `_0021` is a
  *lower* number than yesterday's `_0036` and than `2026-09-07`'s `_0041`, so a selector keyed on
  the round number alone would pick `_0041` and discard three days of accumulated work.
- **I did not run the `:short` A/B this round.** The evidence has been sufficient since
  `2026-09-04_0048` ran it live; `AUTOPILOT.md` lines 388–396 say explicitly not to repeat it.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or adds
  a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22 under
  six checks, parity table 11/11).

## Verification

**Tip selection** — `git for-each-ref --sort=-committerdate` (own branch still sat at `3503537`,
2026-08-13, far down the list at selection time):

```
2026-09-09 00:18:36 +0700  c4bebe6  …/2026-09-09_0011   ← selected
2026-09-09 00:09:16 +0700  0e6ad77  …/2026-09-09_0001
2026-09-08 00:43:57 +0700  1069537  …/2026-09-08_0036
2026-09-08 00:32:49 +0700  22c8aea  …/2026-09-08_0026
2026-09-08 00:22:35 +0700  775deb2  …/2026-09-08_0016
```

Refname cross-check: `_0011` is the highest round number below my own `_0021` **on the newest date
present**. Both selectors agree. Local and `origin/` both point at `c4bebe6`, so the sha had not
moved under me.

**Restore preconditions** (before touching the tree):

```
git merge-base --is-ancestor HEAD c4bebe6        → true (3503537 is an ancestor of the tip)
git log -1 --format="%h %s" c4bebe6
  → c4bebe6 "docs: round 2026-09-09_0011 no-op -- five channels checked, no owner answer"
    (author = the runner, i.e. the previous round's own commit, not an owner answer)
git diff --cached --stat c4bebe6 -- .   (run after checkout) → empty = tree matches byte for byte
```

⚠️ `git merge --ff-only` was **denied by the permission layer**, so the restore was done as
`git checkout c4bebe6 -- .` + commit, matching the method every prior round used. The empty
`git diff --cached --stat` above is what makes the two equivalent here.

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
| `ds-disabled-hover` | `c4bebe6:design-system/src/styles.css design-system/src/styles.css` | **PASS** + 1 undecidable rule |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`ds-disabled-hover`'s before side is the tip **this round actually restored** (`c4bebe6`), read from
`for-each-ref`, not copied from an older status block. Its one undecidable rule is the documented
`.pui-menu__item:last-child` (structural pseudo, identical in both versions).

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I listed all five `✗` rows rather than grepping for a substring: they are
`#toastUndo (base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — **all five are
`#toastUndo` and none is `#toast`**, which is what proves the app side was not touched.

## What I did NOT do

- **Answered no owner decision.** All eight are still open. Decisions 2, 5 and 6 are the last three
  gaps in the element-parity criterion; 1 and 4 each gate one further criterion; 8 blocks none.
- **Did not restore `docs/design-parity.md`** (`c3351fc:docs/design-parity.md`, 44,376 bytes) — that
  is decision 8 itself.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a call and changes nothing until decision 4 is answered.
- **Did not trim `AUTOPILOT.md`** (now **2,954 lines / 397,885 bytes**). Its size is why
  `## Next task` reaches the prompt empty, but deleting round history is an owner decision. Per the
  convention started at `_0035` I added no `> **สถานะล่าสุด …` block — I edited only the Next task
  forecast, so this round's `AUTOPILOT.md` diff is a near-net-zero replacement of three blocks.
- **Did not re-run the retrospective restore audit** (closed at `2026-08-31_0023`) or the `:short`
  A/B (`AUTOPILOT.md` says the evidence is sufficient and not to repeat it).
- **Did not invent a substitute task.** Fallback work that touches code is genuinely exhausted.

## Risk

- **Nothing in this round can regress the app** — `git diff` for the round proper touches only
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `c4bebe6`'s tree
  (empty `git diff --cached --stat c4bebe6 -- .`), independently corroborated by all five harness
  keys recomputing their cascades from the files actually standing and reporting unchanged counts.
- 🔴 **The next round's tip selection is where the accumulated work is actually at risk, and the
  odds just got much worse.** `2026-09-09` will hold **three** tips, tied at day granularity. A
  sha-first pipeline must beat both `c4bebe6` (`c`) and `0e6ad77` (`0`), so it survives only if this
  round's closing sha starts with `d`/`e`/`f` (~3/16); otherwise it restores `_0011` and silently
  discards this round. Use `--sort=-committerdate` regardless of what the shas look like.
- ⚠️ **Do not read last round's clean result as the trap weakening.** `_0011` came out HEADS purely
  because `c` > `0`. The dangerous state is *agreement*, and it just occurred.
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
