# SUMMARY — round `auto/deep_dive_AI_Storyboard_Machine/2026-09-11_0016`

**Result: no-op round.** All eight owner decisions in `README.md` → `## Open decisions` are still
unanswered, so no acceptance criterion could be unblocked. Work was limited to restoring the
previous round's tip, verifying nothing regressed, and resolving the outstanding prediction in
the contract.

## What I did

- **Restored the previous round's tip.** The branch was cut from the stale base `3503537` again —
  the tree arrived with only 72 tracked files and without `tools/check-tokens.mjs`,
  `docs/btn-parity-proof.mjs`, `SUMMARY.md`, the inlined fonts and every token change. Correct tip
  selected with `git for-each-ref --sort=-committerdate` (full-resolution timestamp) and
  cross-checked by refname: `1a30454` = `2026-09-11_0005`, the highest round number on the newest
  date that is not my own branch. `git merge --ff-only` is permission-blocked, so I used
  `git checkout 1a30454 -- .` + commit; `git diff --stat 1a30454 --` came back **empty**, so the
  tree is byte-identical to a fast-forward.
- **Checked all five owner-signal channels — all silent** (details under Verification).
- **Ran the full Verify command and all five harness keys.** Every number matches the table in
  `AUTOPILOT.md` exactly.
- **Resolved round `_0005`'s prediction (heads) and wrote the next one** in the `## Next task`
  block, plus the two lines that must change every round (restore-tip pointer, round counter).
  This is the only substantive edit of the round.

## Why

The prediction machinery in `AUTOPILOT.md` exists because the runner cuts every round's branch from
a stale base, so each round has to find its own predecessor. The historically buggy formula
(`--format='%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r`) ties on the
truncated date and falls through to the **sha**, which is random. Each round records whether that
formula would have picked correctly, so the failure rate is measured rather than assumed.

Round `_0005` predicted **heads with zero risk, structurally** — its closing tip would be the only
tip dated `2026-09-11`, so the top group would hold a single sha and no tie could form. That
resolved **correct**: I ran the buggy formula for real (excluding my own branch, to reproduce
pre-restore conditions) and row 1 is `1a30454` = `_0005` = the right tip.

The part worth carrying forward is *why* it was heads. **Row 3 of that same output shows the bug is
entirely intact**: inside the `2026-09-10` group the buggy formula still lifts `b2a5815` (`_0013`)
above `0d08961` (`_0035`), exactly as it did last round. The formula did not get better — the top
group just happened to have one member. I recorded this explicitly because a future round reading
"heads" alone could conclude the trap was fixed and stop using `--sort=-committerdate`.

I also kept the cumulative tally at **tails 10 of 14** rather than scoring this round as a win.
Structural heads have never been counted as coin flips (`2026-09-07_0000` and `_0003` were treated
the same way), and folding them in would quietly dilute a failure rate that is the whole point of
the measurement.

## Verification

Verify command, all three stages, run in full (separately — chained commands are permission-blocked
in this environment):

| Stage | Result |
|---|---|
| `node tools/test.mjs` | `54 passed, 0 failed` |
| `node tools/check-tokens.mjs` | all 6 checks pass — tokens 22/22, fonts 4/4, and 4 × "15 CSS source(s) scanned" |
| `npm --prefix design-system test` | `12 passed (12)` files, `31 passed (31)` tests |

Harness, all five keys, filtered with `grep -E "✗|compared|PASS|FAIL|markup|unmatched|undecidable"`:

| Key | Result |
|---|---|
| `buttons 2488f2d:index.html index.html` | 85 pairs / 17 elements, markup 7 gone / 5 new — **PASS** |
| `segmented 021b966:index.html index.html` | 45 pairs / 9 elements, markup 0 / 3 — **PASS** |
| `toast de07ea8:index.html 10e8f39:index.html` | 5 pairs / 1 element, markup 0 / 1 — **PASS** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declarations differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |
| `ds-disabled-hover 1a30454:…/styles.css …/styles.css` | 15 pairs / 3 elements — **PASS** + 1 undecidable; markup `N/A — the source is a stylesheet` |

The `toast-hit` FAIL is the **documented correct result** for that key, not a regression: it pins
the deliberate `pointer-events:auto` behaviour change from round `2026-08-24_0003`. I read all five
`✗` rows rather than trusting the count — every one is `#toastUndo`
(`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) and **no row is `#toast`**, which
is the evidence that `pointer-events:none` is still in place on the container.
The `ds-disabled-hover` before-side reads `1a30454`, the tip I actually restored this round, not a
sha copied from an old block.

Five owner-signal channels, all silent:

1. **Working tree vs restored tip** — `git diff --stat 1a30454 --` empty; the tip's author is
   `PHANTOM AUTOPILOT <autopilot@phantom.local>` (subject: *"chore: round 2026-09-11_0005 no-op --
   five channels checked, no owner answer"*), i.e. the runner, not the owner.
2. **README answer counters** — `| Option | Cost |` = **8** and `If you answer:` = **8**. The two
   counters agree, so no decision has been answered. I also listed the eight `###` headings under
   `## Open decisions` and none carries an answer marker.
3. **jsPDF vendored?** — `git ls-files | grep -i jspdf` → **0** matches.
4. **Uncommitted / untracked** — `git status --untracked-files=all --short` → **0** lines.
5. **Non-auto branches** — unchanged from what round `_0005` recorded:
   `design-system`/`origin/design-system` = `3503537`; `mac`/`mac/design-system` = `e3a355c`;
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3`;
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

`AUTOPILOT.md` after this round's edit: **2,983 lines / 402,613 bytes** (+18 lines).

## What I did NOT do

- **Did not answer any open decision.** All eight move pixels, add a file to the repo, or rewrite
  history — owner's call, and answering one myself is the thing this contract forbids most clearly.
- **Did not invent substitute work.** The contract states no-op rounds must not manufacture a task,
  and that code-touching fallback work is exhausted.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte. Only
  `AUTOPILOT.md` and `SUMMARY.md` changed, plus the restore commit.
- **Did not add a `> **สถานะล่าสุด …` block.** Since round `_0035` the convention is that no-op
  rounds edit only the Next task block.
- **Did not delete the now-stale `⚠️ กับดักเลขรอบ` paragraph** that says "รอบนี้แย่ที่สุด" while
  referring to `_0005`. Deleting old blocks is the owner's right; my new block sits above it and
  states the current position.
- **Did not re-run the A/B sort experiment.** Lines 408–409 record that evidence was sufficient as
  of `2026-09-04_0048`; I ran only the single buggy-formula command needed to resolve the
  outstanding prediction.
- **Did not recover `docs/design-parity.md`** (lost by round `2026-08-19_0022`, still retrievable at
  `c3351fc:docs/design-parity.md`). That is open decision 8.
- **Did not open a browser.** Blocked by permission, not by absence of a display — decision 4.

## Risk

- **Next round carries the ratchet again, at roughly 10%.** Two tips will be dated `2026-09-11`
  once this round closes, so the tie returns; the buggy formula picks correctly only if this
  round's closing sha sorts above `1a30454`. That is ~89.8% of the sha space, so the failure odds
  are the *lowest ever measured* — precisely because `1a30454` starts with `1`. A reviewer should
  read that as a lucky comparand, not as the trap weakening. The fix remains
  `--sort=-committerdate` plus a refname cross-check.
- **A "heads" result this round is not evidence the sort bug is fixed.** Row 3 of the same command
  shows it still misordering the `2026-09-10` group. This is the single most likely thing for a
  future round to misread.
- **The round-number trap is unchanged and still severe.** `_0016` is lower than `_0035`
  (yesterday), `_0036` (09-08) and `_0041` (09-07), so anything ranking by round number alone would
  reach back to `_0041` and discard four days of work. Date must always be the first sort field.
- **`main` is still `ef3220e` (2026-06-27) and nothing has been merged in roughly four weeks.**
  No round can fix this; it needs the owner. The backlog of unmerged auto branches keeps growing.
- **Nothing here was verified in a real browser.** All parity claims come from the harness plus CSS
  spec reasoning. The harness does not model inheritance and does not evaluate `:hover` visually —
  which matters most for decision 7, whose whole subject is `:hover` on disabled controls.
