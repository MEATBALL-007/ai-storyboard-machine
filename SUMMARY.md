# Round 2026-09-10_0024 — SUMMARY

## What I did

- **Restored the previous round's tip** (`b2a5815` = `…/2026-09-10_0013`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537` (2026-08-13), so the tree
  arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the
  token/radius/font work and `README.md`'s `## Open decisions` — 16 files. Kept as its own commit.
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- **Resolved round `_0013`'s forecast: HEADS, but by luck, not by structure.** Both its predictions
  were right (a real tie; comparand `20c4b3a`). The broken formula survived only because `b2a5815`
  starts with `b` and beat `2`. That is a coin landing well, so **it counts: tails 8 of 12.**
- 🔴 **Forecast for the next round is the worst yet: ~11/16 that the broken formula discards a
  whole round.** The comparand has advanced from `20c4b3a` (`2`) to `b2a5815` (`b`), so the closing
  sha must now beat `b` rather than `2`. Recorded in `AUTOPILOT.md` with the mechanism.

## Why

- **Restore before reading anything.** On `3503537` the app's `:root` really is byte-identical to
  `tokens.css`, so the token work *looks finished* if you read the stale tree first. Round
  `2026-08-19_0022` read it that way, skipped the restore, and permanently lost
  `docs/design-parity.md` from the tree.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date, which ties same-day rounds and
  falls through to whichever field prints next. Native `--sort=` sorts on the real timestamp.
- **The refname cross-check is read date-major.** My round number `_0024` is *lower* than
  yesterday's `_0032`, than `2026-09-08`'s `_0036`, and than `2026-09-07`'s `_0041`. A selector
  keyed on round number alone would pick `_0041` and discard three days of work. The correct
  reading is "highest round number **on the newest date present**" → `_0013`.
- **I tested `_0013`'s forecast by running the broken pipeline rather than reasoning about it.**
  That is what separates this round's result from last round's: `_0003` was heads because its day
  held a single tip (no tie could form), whereas this round the tie genuinely formed — 4 rows, 2
  distinct shas — and was resolved by sha comparison. Same verdict, different cause, and only the
  second kind is a coin flip. Classifying this one as structural would have flattered the tally.
- **The rising-comparand mechanism is the finding worth recording.** The comparand is the max sha
  in the day's group, and it never decreases within a day — so each extra round per day raises the
  bar the next round's sha must clear. The trap therefore *degrades as the day goes on* and resets
  only at midnight. That reframes it from "random 50/50" to a predictable ratchet.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or
  adds a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22
  under six checks, parity table 11/11).
- **I did not run the `:short` A/B.** Sufficient since `2026-09-04_0048`; `AUTOPILOT.md` says not
  to repeat it. The pipeline run above is the forecast resolution, which is a different check.

## Verification

**Tip selection** — `git for-each-ref --sort=-committerdate --format='%(committerdate:iso8601)
%(objectname:short) %(refname:short)'` (my own branch's top row is this round's restore commit and
was not present at selection time):

```
2026-09-10 00:22:59 +0700  b2a5815  …/2026-09-10_0013   ← selected (local + origin, same sha)
2026-09-10 00:11:48 +0700  20c4b3a  …/2026-09-10_0003
2026-09-09 00:40:12 +0700  62506ba  …/2026-09-09_0032
2026-09-09 00:30:59 +0700  c75b1ca  …/2026-09-09_0021
```

Refname cross-check: `2026-09-10` is the newest date present other than my own row, and `_0013` is
its highest round number. Both selectors agree.

**Restore result:** `git checkout b2a5815 -- .` + commit. Run *after* the checkout:

- `git diff b2a5815 --stat` → **empty** (tree matches byte for byte)
- `git status --short` after checkout listed exactly the 16 expected paths (13 `M`, 3 `A`)
- `git log -1 --format="%an" b2a5815` → `PHANTOM AUTOPILOT`, i.e. the runner, not the owner

(`git read-tree -u --reset` was denied by the permission layer this round, as `git merge --ff-only`
and `git reset --hard` have been in every prior round; the empty diff is what makes the
path-checkout equivalent to a fast-forward.)

**Five channels — no owner answer on any of the eight decisions:**

1. `| Option | Cost |` in `README.md` = **8** and `If you answer:` = **8** (both counted *after*
   the restore). The two counters agreeing is the "still unanswered" signal.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact absent).
3. `git status --untracked-files=all --short` → empty. Path-checkout does not remove untracked
   files, so an owner-added file would still have shown here.
4. Tip authorship: the newest commit on any `auto/*` branch is the runner's, not the owner's.
5. Non-`auto/*` refs, with author: `design-system`/`origin/design-system` = `3503537` (2026-08-13,
   PHANTOM AUTOPILOT, newest of the group); `mac`/`mac/design-system` = `e3a355c` (2026-07-20,
   MEATBALL-007); `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27). **The owner's most recent
   commit anywhere is 2026-07-20 — 52 days ago.**

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
| `ds-disabled-hover` | `b2a5815:design-system/src/styles.css design-system/src/styles.css` | 15 / 3 → **PASS** + 1 undecidable rule, markup `N/A` |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`ds-disabled-hover`'s before side is the tip **this round actually restored** (`b2a5815`), read from
`for-each-ref`, not copied from an older status block. Its one undecidable rule is the documented
`.pui-menu__item:last-child` (unreadable because of the structural pseudo; subject matches
`.pui-menu__item` and `.pui-menu__item--danger`), and its markup coverage reports `N/A — the source
is a stylesheet`, the correct result for a `.css` key.

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I listed all five `✗` rows rather than trusting the verdict line:
`#toastUndo (base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — **all five are
`#toastUndo` and none is `#toast`**, which is what proves the app side was not touched.

**Forecast resolution (`_0013` → HEADS, by luck).** Confirmed by running the broken pipeline with
my own branch excluded:

```
2026-09-10 b2a5815 origin/…/2026-09-10_0013
2026-09-10 b2a5815        …/2026-09-10_0013
2026-09-10 20c4b3a origin/…/2026-09-10_0003
2026-09-10 20c4b3a        …/2026-09-10_0003
2026-09-09 c75b1ca origin/…/2026-09-09_0021
```

The `2026-09-10` group holds **4 rows / 2 distinct shas**, so unlike last round a tie really did
form and really was broken by sha. `b` > `2` put the correct tip at row 1 — the ~13/16 branch of
`_0013`'s own forecast. Tally updated: tails on `_0018`(`3`), `_0027`(`2`), `_0035`(`7`),
`_0041`(`9`), `_0016`(`7`), `_0026`(`2`), `_0036`(`1`), `_0032`(`6`); heads by luck on `_0011`(`c`),
`_0021`(`c7`) and now `_0013`(`b`) → **tails 8 of 12**, with `_0006`/`_0001`/`2026-09-07_0000`/
`_0003` remaining heads-by-structure (not counted).

**`AUTOPILOT.md` edit is net-positive by 3 lines** (`26 insertions(+), 23 deletions(-)`), one file —
the `_0035` convention (edit the Next task block, add no new `> **สถานะล่าสุด …` block) held.

## What I did NOT do

- **Answered no owner decision.** All eight are still open. Decisions 2, 5 and 6 are the last three
  gaps in the element-parity criterion; 1 and 4 each gate one further criterion; 8 blocks none.
- **Did not restore `docs/design-parity.md`** (`c3351fc:docs/design-parity.md`, 44,376 bytes) — that
  is decision 8 itself.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a call and changes nothing until decision 4 is answered. (Both appear in
  this session's tool list, which is exactly how the trap presents — availability is not permission.)
- **Did not trim `AUTOPILOT.md`.** Its size is why `## Next task` reaches the prompt empty, but
  deleting round history is an owner decision.
- **Did not re-run the retrospective restore audit** (closed at `2026-08-31_0023`) or the `:short`
  A/B (`AUTOPILOT.md` says the evidence is sufficient and not to repeat it).
- **Did not invent a substitute task.** Fallback work that touches code is genuinely exhausted.

## Risk

- **Nothing in this round can regress the app** — `git diff` for the round proper touches only
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `b2a5815`'s tree
  (empty `git diff b2a5815 --stat`), independently corroborated by all five harness keys
  recomputing their cascades from the files actually standing and reporting unchanged counts.
- 🔴 **The next round is the most dangerous tip selection recorded so far: ~11/16 loss.** The
  comparand is now `b2a5815` (leading `b`), not `20c4b3a`. Under sha-first the closing sha wins
  only on `c`–`f` (~4/16), is undecided on `b` (~1/16), and **loses on `0`–`a` (~11/16)**, in which
  case `_0013` is restored and this round's work is discarded. Under refname-first `_0024` >
  `_0013` > `_0003` is correct by structure. **Use `--sort=-committerdate` regardless of the shas.**
- ⚠️ **The ratchet claim is the one a reviewer should check directly.** I assert the comparand is
  the day's maximum sha and never decreases within a day, so risk compounds with rounds-per-day.
  It follows from `sort -r` comparing whole lines left to right with the date printed first, and
  the one-line pipeline in Verification demonstrates it. If that is wrong, the ~11/16 figure is
  wrong too — but the permanent fix (`--sort=-committerdate`) is unaffected either way, because it
  never ties in the first place.
- ⚠️ **Last round's heads was structural; this round's was luck.** Two green outcomes in a row do
  not mean the trap is weakening — the mechanism that produced them was different each time, and
  the tally is now tails 8 of 12.
- 🔴 **The runner bug is unfixed after ~4 weeks** (86+ branches cut from `3503537`; `main` still
  `ef3220e` from 2026-06-27, and the owner's last commit anywhere is 2026-07-20). Every round pays
  a restore commit for it. No round can fix this.
- ⚠️ **`toast-hit` exits non-zero by design.** If the runner gates the PR on exit codes, do not read
  that as a regression — the expected result for that key is FAIL-5, and the five differing rows are
  all `#toastUndo`.
