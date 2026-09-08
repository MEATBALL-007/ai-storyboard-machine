# Round 2026-09-09_0011 — SUMMARY

## What I did

- **Restored the previous round's tip** (`0e6ad77` = `…/2026-09-09_0001`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537`, so the tree arrived
  without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, the token/radius/font work and
  `README.md`'s `## Open decisions` — 16 files, 4,915 insertions. Kept as its own commit (`b65ed51`).
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- **Resolved round `_0001`'s forecast in `AUTOPILOT.md`: HEADS, by construction rather than luck**,
  confirmed live from this round's own `for-each-ref`, and wrote the next-round forecast — which is
  the unusual case where the wrong formula is ~15/16 likely to be *accidentally* right.

## Why

- **Restore before reading anything.** The failure mode this repo actually suffers from is not
  forgetting to restore, it is reading the stale tree first: on `3503537` the app's `:root` really
  is byte-identical to `tokens.css`, so the token work *looks finished*. Round `2026-08-19_0022`
  read it that way, skipped the restore, and permanently lost `docs/design-parity.md` from the tree.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date (`--format='%(committerdate:short) …'
  | sort -r`), which ties same-day rounds and falls through to whichever field prints next. Native
  `--sort=` sorts on the real timestamp and cannot tie here.
- **The refname cross-check was read date-major**, not by round number alone: today's `_0011` is a
  *lower* number than yesterday's `_0036` and than `2026-09-07`'s `_0041`, so a selector keyed on the
  round number alone would pick `_0041` and discard three days of accumulated work.
- **I did not run the `:short` A/B this round.** `2026-09-09` held exactly one tip at selection time,
  so the two formulas are indistinguishable — their agreement would prove nothing, and the evidence
  has been sufficient since `2026-09-04_0048` ran it live.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or adds
  a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22 under
  six checks, parity table 11/11).

## Verification

**Restore preconditions** (all before touching the tree):

```
git merge-base --is-ancestor 3503537 0e6ad77   → ancestor-ok
git diff --diff-filter=D --name-only HEAD 0e6ad77 → empty (no deletions → path-checkout ≡ fast-forward)
git log -1 --format="%h %an <%ae> %ad %s" 0e6ad77
  → 0e6ad77 PHANTOM AUTOPILOT <autopilot@phantom.local> Wed Sep 9 00:09:16 2026
    "docs: round 2026-09-09_0001 no-op -- all eight owner decisions still unanswered"
    (author = the runner, i.e. the previous round's own commit, not an owner answer)
git diff --stat 0e6ad77 -- .   (run after checkout) → empty = tree matches byte for byte
```

Local and `origin/` both point at `0e6ad77`, so the sha had not moved under me.

**Tip selection**, `git for-each-ref --sort=-committerdate` (own branch still sat at `3503537`,
2026-08-13, at the bottom):

```
2026-09-09 00:09:16  0e6ad77  …/2026-09-09_0001   ← only tip on the newest date
2026-09-08 00:43:57  1069537  …/2026-09-08_0036
2026-09-08 00:32:49  22c8aea  …/2026-09-08_0026
2026-09-08 00:22:35  775deb2  …/2026-09-08_0016
2026-09-08 00:12:58  81af905  …/2026-09-08_0006
```

Refname cross-check: `_0001` is the highest round number below my own `_0011` **on the newest date
present**. Both selectors agree.

**Five channels — no owner answer on any of the eight decisions:**

1. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**
   (both run *after* the restore). The two counters agreeing is the "still unanswered" signal; they
   diverge when an owner appends an answer.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact absent).
3. `main` = `ef3220e` (2026-06-27), unmoved.
4. `git status --untracked-files=all --short` → empty (checked pre-restore).
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
| `ds-disabled-hover` | `0e6ad77:design-system/src/styles.css design-system/src/styles.css` | 15 / 3 → **PASS** + 1 undecidable rule; markup `N/A — the source is a stylesheet` |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

No key reported an undecidable rule except `ds-disabled-hover`'s known
`.pui-menu__item:last-child` (identical in both versions), which is its documented result.

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I read all five `✗` rows rather than grepping: every one is
`#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and **none is
`#toast`**, which is what proves the app side was not touched. (`grep -c "✗ #toast:"` cannot
match the base row, which prints `✗ #toast (base)` with no colon, and returns 0 in exactly the
regression case it exists to catch.)

`ds-disabled-hover`'s before side is the tip **this round actually restored**, read from
`for-each-ref`, not copied from an older status block.

## What I did NOT do

- **Answered no owner decision.** All eight are still open. Decisions 2, 5 and 6 are the last three
  gaps in the element-parity criterion; 1 and 4 each gate one further criterion; 8 blocks none.
- **Did not restore `docs/design-parity.md`** (`c3351fc:docs/design-parity.md`, 44,376 bytes) — that
  is decision 8 itself.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a call and changes nothing until decision 4 is answered.
- **Did not trim `AUTOPILOT.md`** (now **2,951 lines / 397,642 bytes**). Its size is why
  `## Next task` reaches the prompt empty, but deleting round history is an owner decision. Per the
  convention started at `_0035` I added no `> **สถานะล่าสุด …` block — I edited only the Next task
  forecast, which is why this round's `AUTOPILOT.md` diff is small and the file got *shorter*.
- **Did not re-run the retrospective restore audit** (closed at `2026-08-31_0023`) or the `:short`
  A/B (pointless on a single-tip day).
- **Did not invent a substitute task.** Fallback work that touches code is genuinely exhausted.

## Risk

- **Nothing in this round can regress the app** — `git diff` for the round proper touches only
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `0e6ad77`'s tree
  (empty `git diff --stat 0e6ad77 -- .`), independently corroborated by all five harness keys
  recomputing their cascades from the files actually standing and reporting unchanged counts.
- 🔴 **The real standing risk is the next round's tip selection, and it is at its most deceptive.**
  `2026-09-09` now holds two tips, tied at day granularity. `0e6ad77` leads with `0`, the lowest
  possible hex digit, so the broken sha-first pipeline is ~15/16 likely to land on the right tip
  **by accident**. A round that sees the two formulas agree and concludes the trap is retired will
  be wrong, and the failure is silent: empty residual diff, five matching harness keys, three green
  Verify stages. Use `--sort=-committerdate` regardless of what the shas look like.
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
