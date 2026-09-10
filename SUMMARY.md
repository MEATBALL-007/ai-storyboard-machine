# SUMMARY — round `auto/deep_dive_AI_Storyboard_Machine/2026-09-11_0005`

**Result: no-op round.** All eight owner decisions in `README.md` → `## Open decisions` are still
unanswered, so no acceptance criterion could be unblocked. Work was limited to restoring the
previous round's tip, verifying nothing regressed, and correcting one wrong claim in the contract.

## What I did

- **Restored the previous round's tip.** The branch was cut from the stale base `3503537` again —
  the tree arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, `SUMMARY.md`,
  the inlined fonts and every token change. Correct tip selected with
  `git for-each-ref --sort=-committerdate` (full-resolution timestamp) and cross-checked by
  refname: `0d08961` = `2026-09-10_0035`, the highest round number on the newest date that is not
  my own branch. `git merge --ff-only` is permission-blocked, so I used
  `git checkout 0d08961 -- .` + commit; `git diff --stat 0d08961 -- .` came back **empty**, so the
  tree is byte-identical to a fast-forward.
- **Checked all five owner-signal channels — all silent** (details under Verification).
- **Ran the full Verify command and all five harness keys.** Every number matches the table in
  `AUTOPILOT.md` exactly.
- **Resolved the previous round's prediction and corrected the reasoning behind it** in the
  `## Next task` block. This is the only substantive edit of the round.

## Why

The prediction machinery in `AUTOPILOT.md` exists because the runner cuts every round's branch
from a stale base, so each round has to find its own predecessor. A historically buggy formula
(`--format='%(committerdate:short) %(objectname:short) …' | sort -r`) ties on the truncated date
and falls through to the **sha**, which is random. Each round records whether that formula would
have picked correctly, so the failure rate is measured rather than assumed.

Round `_0035` predicted ~11/16 odds of failure and it resolved as **tails**. I confirmed this by
running the buggy formula for real (excluding my own branch to reproduce pre-restore conditions):
row 1 is `b2a5815` (`_0013`) and the correct tip `0d08961` does not even reach the top 5, because
`0` sorts below `b`. That formula would have discarded **two** rounds — `git log b2a5815..0d08961`
is 2 commits.

The more useful finding is a **wrong claim in the `_0035` block**, which I corrected rather than
carried forward. `_0035` wrote that crossing midnight into `2026-09-11` would make the next round
"the first tip of a new day → no tie → structurally heads." This round *did* start on
`2026-09-11` (00:06) and was still tails. The reason: tip selection must exclude the deciding
round's own branch, since it is looking for its *predecessor*. So this round's candidate set was
still entirely `2026-09-10`, and its own branch date bought it nothing. **The day rollover helps
the round after the first one of a new day, not the first one** — an off-by-one-round error that
would have made a future round misread a tails result as a formula that had stopped failing.

## Verification

Verify command, all three stages, run in full:

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
| `ds-disabled-hover 0d08961:…/styles.css …/styles.css` | 15 pairs / 3 elements — **PASS** + 1 undecidable; markup `N/A — the source is a stylesheet` |

The `toast-hit` FAIL is the **documented correct result** for that key, not a regression: it pins
the deliberate `pointer-events:auto` behaviour change from round `2026-08-24_0003`. I read all
five `✗` rows rather than trusting the count — every one is `#toastUndo`
(`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) and **no row is `#toast`**,
which is the evidence that `pointer-events:none` is still in place on the container.
The `ds-disabled-hover` before-side reads the tip I actually restored this round, not a sha copied
from an old block.

Five owner-signal channels, all silent:

1. **Working tree vs restored tip** — `git diff --stat 0d08961 -- .` empty; the tip's author is
   `PHANTOM AUTOPILOT <autopilot@phantom.local>` (subject: *"rescued work the agent left
   uncommitted"*), i.e. the runner, not the owner.
2. **README answer counters** — `grep -c "| Option | Cost |"` = **8** and
   `grep -c "If you answer:"` = **8**. The two counters agree, so no decision has been answered.
3. **jsPDF vendored?** — `git ls-files | grep -i jspdf` → 0 matches.
4. **Uncommitted / untracked** — `git status --untracked-files=all --short` → 0 lines.
5. **Non-auto branches** — unchanged from what round `_0027` recorded:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c`; `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3`;
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

`AUTOPILOT.md` before this round's edit: **2,963 lines / 398,984 bytes**.

## What I did NOT do

- **Did not answer any open decision.** All eight move pixels, add a file to the repo, or rewrite
  history — owner's call, and answering one myself is the one thing this contract forbids most
  clearly.
- **Did not invent substitute work.** The contract states no-op rounds must not manufacture a task,
  and that code-touching fallback work is exhausted.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte. Only
  `AUTOPILOT.md` and `SUMMARY.md` changed, plus the restore commit.
- **Did not add a `> **สถานะล่าสุด …` block.** Since round `_0035` the convention is that no-op
  rounds edit only the Next task block; the file grows 30–40 lines/round and is already the reason
  `## Next task` reaches the prompt empty.
- **Did not re-run the A/B sort experiment.** Lines 408–409 record that evidence was sufficient as
  of `2026-09-04_0048`; I ran only the single buggy-formula command needed to resolve the
  outstanding prediction.
- **Did not recover `docs/design-parity.md`** (lost by round `2026-08-19_0022`, still retrievable
  at `c3351fc:docs/design-parity.md`). That is open decision 8.
- **Did not open a browser.** Blocked by permission, not by absence of a display — decision 4.

## Risk

- **The honest size of the near-miss is smaller than "two rounds lost" suggests.** Both rounds the
  buggy formula would have discarded were themselves no-ops, so the loss would have been
  `AUTOPILOT.md` + `SUMMARY.md` — **no code, no tests, no pixels**. I recorded this qualifier in
  the contract because the running tally of "tails" outcomes could otherwise read as accumulating
  code loss, which it is not. The one genuine permanent loss remains `docs/design-parity.md`.
- **Next round is structurally safe, and that safety is temporary.** This round's closing tip will
  be the only tip dated `2026-09-11`, so no tie exists at the top group and any formula picks
  correctly. The ratchet returns as soon as a second round closes on `2026-09-11`. A reviewer
  should not read one clean round as the trap being fixed — the fix is to always use
  `--sort=-committerdate`.
- **The round-number trap is now at its worst.** This round is `_0005`, lower than `_0035`
  (yesterday), `_0036` (09-08) and `_0041` (09-07). Anything ranking by round number alone would
  reach back to `_0041` and discard four days of accumulated work.
- **`main` is still `ef3220e` (2026-06-27) and nothing has been merged in roughly four weeks.**
  No round can fix this; it needs the owner.
- **Nothing here was verified in a real browser.** All parity claims come from the harness plus CSS
  spec reasoning. The harness does not model inheritance and does not evaluate `:hover` visually.
