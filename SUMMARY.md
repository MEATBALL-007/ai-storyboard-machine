# Round 2026-09-10_0013 — SUMMARY

## What I did

- **Restored the previous round's tip** (`20c4b3a` = `…/2026-09-10_0003`) onto the stale base the
  runner cut this branch from. `git log --oneline -1` opened on `3503537` (2026-08-13), so the tree
  arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the
  token/radius/font work and `README.md`'s `## Open decisions` — 16 files. Kept as its own commit.
- **Checked all five owner-answer channels. None of the eight decisions has been answered**, so per
  the queued Next task this is a **no-op round**: not one byte of `index.html`, `design-system/`,
  `tools/` or `docs/` was touched. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all five harness keys** — every number matches the expected
  table exactly (details under Verification).
- **Resolved round `_0003`'s forecast: HEADS, by structure rather than luck** — confirmed by
  actually running the broken pipeline, not by reasoning about it. The coin tally is unchanged at
  tails 8 of 11.
- 🔴 **Corrected a factual error `_0003` left in the contract.** It named `62506ba` as the next
  tie-break comparand. That commit is dated `2026-09-09`, and the date is the *first* printed
  field, so it separates days even when truncated — it can never tie against a `2026-09-10` row.
  The real comparand is `20c4b3a`. Fixed in `AUTOPILOT.md`.

## Why

- **Restore before reading anything.** On `3503537` the app's `:root` really is byte-identical to
  `tokens.css`, so the token work *looks finished* if you read the stale tree first. Round
  `2026-08-19_0022` read it that way, skipped the restore, and permanently lost
  `docs/design-parity.md` from the tree.
- **Tip selection used `--sort=-committerdate` (full precision), cross-checked by refname.** The
  documented trap is a shell pipeline keyed on a truncated date, which ties same-day rounds and
  falls through to whichever field prints next. Native `--sort=` sorts on the real timestamp.
- **The refname cross-check is read date-major.** My round number `_0013` is *lower* than
  yesterday's `_0032`, than `2026-09-08`'s `_0036`, and than `2026-09-07`'s `_0041`. A selector
  keyed on round number alone would pick `_0041` and discard three days of work. The correct
  reading is "highest round number **on the newest date present**" → `_0003`.
- **I tested `_0003`'s forecast instead of trusting it, which is how the error surfaced.** Running
  the broken pipeline with my own branch excluded showed the `2026-09-10` group contains only
  `20c4b3a`, and that `62506ba` does not even reach the top rows — within its own day `c75b1ca`
  outranks it by sha. The correction *lowers* the estimated risk for the next round (~2/16 rather
  than ~6/16), so it is not a warning I am adding for safety's sake; it is the record being wrong
  in the optimistic direction being made accurate.
- **I answered no decision and invented no substitute task.** Each of the eight moves pixels or
  adds a file to the repo; all agent-side survey and tooling work is already closed (tokens 22/22
  under six checks, parity table 11/11).
- **I did not run the `:short` A/B.** Sufficient since `2026-09-04_0048`; `AUTOPILOT.md` says not
  to repeat it. The pipeline run above is the forecast resolution, which is a different check.

## Verification

**Tip selection** — `git for-each-ref --sort=-committerdate --format='%(committerdate:iso8601)
%(refname:short) %(objectname:short)'` (my own branch's row is this round's restore commit and was
not present at selection time):

```
2026-09-10 00:11:48 +0700  20c4b3a  …/2026-09-10_0003   ← selected (local + origin, same sha)
2026-09-09 00:40:12 +0700  62506ba  …/2026-09-09_0032
2026-09-09 00:30:59 +0700  c75b1ca  …/2026-09-09_0021
2026-09-09 00:18:36 +0700  c4bebe6  …/2026-09-09_0011
2026-09-09 00:09:16 +0700  0e6ad77  …/2026-09-09_0001
```

Refname cross-check: `2026-09-10` is the newest date present other than my own row, and `_0003` is
its highest round number. Both selectors agree.

**Restore result:** `git checkout 20c4b3a -- .` + commit. Run *after* the checkout:

- `git diff --stat 20c4b3a -- .` → **empty** (tree matches byte for byte)
- `git diff --diff-filter=D --name-only HEAD 20c4b3a` → **empty** (path-checkout equals fast-forward)
- `git merge-base --is-ancestor HEAD 20c4b3a` → holds; `20c4b3a` descends from this branch's base
- `git log -1 --format="%h %an <%ae> %ad %s" 20c4b3a` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, i.e. the runner, not the owner

(`git merge --ff-only` and `git reset --hard` are both denied by the permission layer, as in every
prior round; the empty diff is what makes path-checkout equivalent.)

**Five channels — no owner answer on any of the eight decisions:**

1. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**
   (both run *after* the restore). The two counters agreeing is the "still unanswered" signal.
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
| `toast` | `de07ea8:index.html 10e8f39:index.html` | 5 / 1 → **PASS**, markup 0 gone / 1 new, no undecidable |
| `ds-disabled-hover` | `20c4b3a:design-system/src/styles.css design-system/src/styles.css` | 15 / 3 → **PASS** + 1 undecidable rule, markup `N/A` |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`ds-disabled-hover`'s before side is the tip **this round actually restored** (`20c4b3a`), read from
`for-each-ref`, not copied from an older status block. Its one undecidable rule is the documented
`.pui-menu__item:last-child` (unreadable because of the structural pseudo; subject matches
`.pui-menu__item` and `.pui-menu__item--danger`), and its markup coverage reports `N/A — the source
is a stylesheet`, the correct result for a `.css` key.

`toast-hit`'s FAIL-5 **is its correct result** — it displays the deliberate 2026-08-24
`pointer-events:auto` fix. I read all five `✗` rows rather than trusting the verdict line: they are
`#toastUndo` `(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — **all five are
`#toastUndo` and none is `#toast`**, which is what proves the app side was not touched.

**Forecast resolution (`_0003` → HEADS, by structure).** `_0003` predicted that at my selection
time `2026-09-10` would hold a single tip, leaving no tie to break. Confirmed by running the broken
pipeline with my own branch excluded:

```
2026-09-10 20c4b3a origin/…/2026-09-10_0003
2026-09-10 20c4b3a        …/2026-09-10_0003
2026-09-09 c75b1ca origin/…/2026-09-09_0021
```

Row 1 is `20c4b3a` under the broken formula too, so it agrees with the correct one and no damage
was possible. The tally of the broken formula is therefore unchanged: tails on `_0018`(`3`),
`_0027`(`2`), `_0035`(`7`), `_0041`(`9`), `_0016`(`7`), `_0026`(`2`), `_0036`(`1`), `_0032`(`6`);
heads by luck on `_0011`(`c`) and `_0021`(`c7`) → **tails 8 of 11**, with `_0003` joining
`_0006`/`_0001`/`2026-09-07_0000` as heads-by-structure (not counted in the tally).

**`AUTOPILOT.md` edit is net-negative:** `28 insertions(+), 31 deletions(-)`, one file — the
`_0035` convention (edit the Next task block, add no new `> **สถานะล่าสุด …` block) held. File is
now **2,957 lines / 397,781 bytes**, 3 lines shorter than it arrived.

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
  `AUTOPILOT.md` and `SUMMARY.md`. The restore commit is a byte-exact copy of `20c4b3a`'s tree
  (empty `git diff --stat 20c4b3a`), independently corroborated by all five harness keys
  recomputing their cascades from the files actually standing and reporting unchanged counts.
- ⚠️ **The correction I made to `_0003`'s forecast is a claim a reviewer should check directly.**
  It rests on one property: `sort -r` compares the whole line left to right, and the date is the
  first field, so `2026-09-09` rows cannot enter a `2026-09-10` tie group. The command that shows
  it is in Verification and takes one run to repeat. If I am wrong about that, the risk figure
  below is wrong too — but the *permanent* fix (`--sort=-committerdate`) is unaffected either way,
  because it never ties in the first place.
- 🔴 **The next round's tie is real, and its comparand is `20c4b3a` (leading `2`).** This round is
  the second tip on `2026-09-10`, so the top group has two rows again. Under sha-first the closing
  sha wins on `3`–`f` (~13/16), is undecided on `2` (~1/16), and loses on `0`–`1` (~2/16). Under
  refname-first `_0013` > `_0003` is correct by structure. **Use `--sort=-committerdate` regardless
  of the shas** — a 2/16 loss is still a whole round of work discarded.
- ⚠️ **A structural heads is not evidence the trap has weakened.** `_0003` came out heads because
  its day held one tip, not because the formula improved. The tally stands at tails 8 of 11.
- 🔴 **The runner bug is unfixed after ~4 weeks** (86+ branches cut from `3503537`; `main` still
  `ef3220e` from 2026-06-27, and the owner's last commit anywhere is 2026-07-20). Every round pays
  a restore commit for it. No round can fix this.
- ⚠️ **`toast-hit` exits non-zero by design.** If the runner gates the PR on exit codes, do not read
  that as a regression — the expected result for that key is FAIL-5, and the five differing rows are
  all `#toastUndo`.
