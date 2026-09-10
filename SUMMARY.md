# Round 2026-09-10_0035 — SUMMARY

## What I did

- **Restored the previous round's tip** (`4401534` = `…/2026-09-10_0024`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537` (2026-08-13), so the tree
  arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the
  token/radius/font work and `README.md`'s `## Open decisions` — 16 files. Kept as its own commit.
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- 🔴 **Resolved round `_0024`'s forecast: TAILS — the ratchet bit for real.** Its ~11/16 warning was
  correct. The right tip this round (`4401534`, leading `4`) loses to the comparand `b2a5815`
  (leading `b`), so the broken selector puts `_0013` at row 1 and **would have discarded the whole
  of round `_0024`**. I used `--sort=-committerdate` + a refname cross-check and picked correctly.
- **This is the first empirical confirmation that the rising-comparand mechanism is real**, not just
  a plausible story: `_0024` predicted the comparand would climb `2` → `b` and that the next round
  would then lose — both happened, in order. Tally is now **tails 9 of 13**.

## Why

- **Restore before reading anything.** On `3503537` the app's `:root` really is byte-identical to
  `tokens.css`, so the token work *looks finished* if you read the stale tree first. Round
  `2026-08-19_0022` read it that way, skipped the restore, and permanently lost
  `docs/design-parity.md` from the tree. The stale `AUTOPILOT.md` also still carries the original
  "add tokens to `index.html`" task, finished on 2026-08-21 — reading it first invents a redo.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date, which ties same-day rounds and
  falls through to whichever field prints next. Native `--sort=` sorts on the real timestamp and
  never ties. This round is precisely the case where the two selectors **disagree**.
- **The refname cross-check is read date-major.** My round number `_0035` is *lower* than
  `2026-09-08`'s `_0036` and `2026-09-07`'s `_0041`. A selector keyed on round number alone would
  pick `_0041` and discard three days of work. The correct reading is "highest round number **on
  the newest date present**" → `_0024`.
- **I resolved the forecast by running the broken pipeline, not by reasoning about it.** Reasoning
  would have given the same verdict, but the run is what makes the mechanism falsifiable — and this
  is the round where a wrong prediction would have been visible, since the outcome flipped.
- **Why this tails matters more than the previous eight.** Every earlier tails was a two-sha day.
  This is the first three-sha day, i.e. the first time the comparand was itself the product of an
  *earlier* round winning the tie-break. That is the ratchet's actual claim, and it held.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or
  adds a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22
  under six checks, parity table 11/11).
- **I did not run the `:short` A/B.** Sufficient since `2026-09-04_0048`; `AUTOPILOT.md` says not
  to repeat it. The pipeline run above is the forecast resolution, which is a different check.

## Verification

**Tip selection** — `git for-each-ref --sort=-committerdate --format='%(committerdate:iso8601)
%(objectname:short) %(authorname) %(refname:short)'` (my own branch's top row is this round's
restore commit and was not present at selection time):

```
2026-09-10 00:36:24 +0700  9c1f02e  PHANTOM AUTOPILOT  …/2026-09-10_0035  ← mine (restore commit)
2026-09-10 00:33:10 +0700  4401534  PHANTOM AUTOPILOT  …/2026-09-10_0024  ← selected (local+origin)
2026-09-10 00:22:59 +0700  b2a5815  PHANTOM AUTOPILOT  …/2026-09-10_0013
2026-09-10 00:11:48 +0700  20c4b3a  PHANTOM AUTOPILOT  …/2026-09-10_0003
2026-09-09 00:40:12 +0700  62506ba  PHANTOM AUTOPILOT  …/2026-09-09_0032
```

Refname cross-check: `2026-09-10` is the newest date present other than my own row, and `_0024` is
its highest round number. Both selectors agree.

**Restore result:** `git checkout 4401534 -- .` + commit. Run *after* the checkout:

- `git diff 4401534 --stat` → **empty** (tree matches byte for byte)
- `git status --short` after checkout listed exactly the 16 expected paths (13 `M`, 3 `A`)
- `git log -1 --format="%an" 4401534` → `PHANTOM AUTOPILOT`, i.e. the runner, not the owner

(`git read-tree -u --reset` was denied by the permission layer this round, as `git merge --ff-only`
and `git reset --hard` have been in every prior round; the empty diff is what makes the
path-checkout equivalent to a fast-forward.)

**Five channels — no owner answer on any of the eight decisions:**

1. `| Option | Cost |` in `README.md` = **8** and `If you answer:` = **8** (both counted *after*
   the restore). The two counters agreeing is the "still unanswered" signal.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact absent).
3. `git status --untracked-files=all --short` → empty. Path-checkout does not remove untracked
   files, so an owner-added file would still have shown here.
4. Tip authorship: every row of the `auto/*` listing above is `PHANTOM AUTOPILOT` — the runner.
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
| `buttons` | `2488f2d:index.html index.html` | 85 pairs / 17 elements → **PASS** |
| `segmented` | `021b966:index.html index.html` | 45 / 9 → **PASS** |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | 5 / 1 → **PASS** |
| `ds-disabled-hover` | `4401534:design-system/src/styles.css design-system/src/styles.css` | **PASS** + 1 undecidable rule |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`ds-disabled-hover`'s before side is the tip **this round actually restored** (`4401534`), read from
`for-each-ref`, not copied from an older status block. Its one undecidable rule is the documented
`.pui-menu__item:last-child` (unreadable because of the structural pseudo; subject matches
`.pui-menu__item` and `.pui-menu__item--danger`).

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I listed the `✗` rows rather than trusting the verdict line:
`#toastUndo (base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — **all five are
`#toastUndo` and none is `#toast`**, which is what proves the app side was not touched.

**Forecast resolution (`_0024` → TAILS, the ratchet bit).** Confirmed by running the broken pipeline
with my own branch excluded:

```
2026-09-10 b2a5815 origin/…/2026-09-10_0013   ← row 1: WRONG tip
2026-09-10 b2a5815        …/2026-09-10_0013
2026-09-10 4401534 origin/…/2026-09-10_0024   ← the correct tip, demoted to row 3
2026-09-10 4401534        …/2026-09-10_0024
2026-09-10 20c4b3a origin/…/2026-09-10_0003
2026-09-10 20c4b3a        …/2026-09-10_0003
```

The `2026-09-10` group holds **6 rows / 3 distinct shas**. `b` > `4` > `2`, so the correct tip lands
at row 3 and a round using the broken selector restores `_0013`, silently throwing away round
`_0024`. Tally updated: tails on `_0018`(`3`), `_0027`(`2`), `_0035`(`7`), `_0041`(`9`), `_0016`(`7`),
`_0026`(`2`), `_0036`(`1`), `_0032`(`6`) and now `_0024`(`4`); heads by luck on `_0011`(`c`),
`_0021`(`c7`), `_0013`(`b`) → **tails 9 of 13**, with `_0006`/`_0001`/`2026-09-07_0000`/`_0003`
remaining heads-by-structure (not counted).

**`AUTOPILOT.md` edit is net-positive by 3 lines** (`41 insertions(+), 38 deletions(-)`), one file —
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
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `4401534`'s tree
  (empty `git diff 4401534 --stat`), independently corroborated by all five harness keys
  recomputing their cascades from the files actually standing and reporting unchanged counts.
- 🔴 **A reviewer should note that this round's tip selection was the one that finally diverged.**
  For eight prior rounds the broken and correct selectors happened to agree or the gap was
  academic; here they give **different answers**, and the broken one loses a full round of work.
  If any future round is seen restoring `b2a5815` while `4401534` or later exists, that is this bug.
- 🔴 **The next round is at least as dangerous: ≥ ~11/16 loss.** The comparand is
  `max(b2a5815, <this round's closing sha>)` — at least `b`, and higher if my closing sha starts
  `c`–`f`. It cannot fall while the day holds. **Use `--sort=-committerdate` regardless of the shas.**
  The one thing that resets it is crossing midnight into `2026-09-11`; at ~10 minutes per round and
  a 00:35 start, the next round is very likely still `2026-09-10`.
- ⚠️ **I could not observe my own closing sha**, so the next-round forecast is stated as a bound
  rather than a value. Writing the sha into the file would change the sha.
- ⚠️ **The ratchet claim is now supported but still worth a direct check.** It follows from `sort -r`
  comparing whole lines left to right with the date printed first; the pipeline output above shows
  the three-sha ordering directly. The permanent fix (`--sort=-committerdate`) is unaffected either
  way, because it never ties in the first place.
- 🔴 **The runner bug is unfixed after ~4 weeks** (86+ branches cut from `3503537`; `main` still
  `ef3220e` from 2026-06-27, and the owner's last commit anywhere is 2026-07-20). Every round pays
  a restore commit for it. No round can fix this.
- ⚠️ **`toast-hit` exits non-zero by design.** If the runner gates the PR on exit codes, do not read
  that as a regression — the expected result for that key is FAIL-5, and the five differing rows are
  all `#toastUndo`.
