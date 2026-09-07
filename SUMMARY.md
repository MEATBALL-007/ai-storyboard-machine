# Round 2026-09-08_0016 — SUMMARY

## What I did

- **Restored the previous round's tip.** `git log --oneline -1` showed HEAD at `3503537` (the stale
  base the runner cuts every `auto/*` branch from), so the working tree lacked every round of work
  since 2026-08-21. Ranked the round tips with
  `git for-each-ref --format="%(committerdate:iso8601) %(objectname:short) %(refname:short)" refs/heads refs/remotes | grep auto/deep_dive | grep -v 2026-09-08_0016 | sort -r | head -20`
  → newest is `81af905` = `2026-09-08_0006`. Restored with `git checkout 81af905 -- .` as its own
  commit so this round's real diff stays readable.
- **Checked all five owner-answer channels — no answer on any of the 8 open decisions.** This round
  is therefore a **no-op**: `index.html`, `design-system/`, `tools/` and `docs/` were not touched by
  a single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify chain and all five harness keys.** Every number matches the expected table.
- **Updated only the `## Next task` forecast block in `AUTOPILOT.md`** (per the convention started by
  round `_0035`): resolved `_0006`'s prediction, wrote this round's, and corrected the "next tip to
  restore" pointer to `2026-09-08_0016`. No new `> **สถานะล่าสุด …` block was appended.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *finished* —
  on `3503537` the app's `:root` really is byte-identical to `tokens.css`. Round `2026-08-28_0004`
  read files first and burned a whole round concluding work already shipped was still to do.
- **Ranking is date-major, refname as cross-check only.** Two independent traps make any other
  formula silently wrong: a truncated date key falls through to the random sha, and — new as of
  yesterday's rollover — **the round number went DOWN across the day boundary** (`_0006`/`_0016`
  today vs `_0041` yesterday), so any ranking keyed on the refname alone now picks yesterday's
  `_0041` as "latest" forever. Both were checked here and agree on `81af905`.
- **`_0006`'s forecast resolved HEADS, structurally.** It predicted zero risk because its tip would
  be the only one dated `2026-09-08`. Confirmed live from this round's own `for-each-ref`: exactly
  one tip on that date, all six rows below it on `2026-09-07`. I deliberately did **not** re-run the
  `:short` A/B — on a single-tip day the two formulas are indistinguishable and their agreement
  proves nothing. That ends a four-round "tails" streak, and it ends it by construction, not luck.
- **No substitute task was invented.** The contract's Next task says a round with no owner answer is
  a no-op, and every code-touching fallback is exhausted. Three of the eight decisions block the
  remaining acceptance criteria directly (chip padding / segmented padding / input sizes); all three
  move visible pixels, which is the owner's call, not an agent's.

## Verification

Verify command, all three stages green:

```
node tools/test.mjs        → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                              font weights available · no radius literals ·
                              typeface from one source   (6/6 checks, 15 CSS sources)
npm --prefix design-system test → 12 test files, 31 passed (31)
```

All five `docs/btn-parity-proof.mjs` keys, matching the expected table exactly:

| key | result | markup coverage |
|---|---|---|
| `buttons 2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements | 7 old gone, 5 new |
| `segmented 021b966:index.html index.html` | PASS — 45 pairs / 9 elements | 0 old gone, 3 new |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS — 5 pairs / 1 element, no undecidable | 0 old gone, 1 new |
| `ds-disabled-hover 81af905:…/styles.css …/styles.css` | PASS — 15 pairs / 3 elements, **+1 undecidable** | N/A — source is a stylesheet |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declarations differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched | 0 old gone, 0 new |

`toast-hit`'s FAIL is its **correct** result — it exists to display the deliberate behaviour change
from round `2026-08-24_0003`, not to pass. Read with
`grep -E "✗|compared|PASS|FAIL|markup|unmatched|undecidable"` per round `_0043`'s instruction: all
five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and
**none is `#toast`** — that is the proof `pointer-events:none` was not stripped from the container.
(`grep -c "✗ #toast:"` would return 0 here even in the regression case, because the base-state row
prints without a colon. Do not use it.)

Restore preconditions, all checked before touching the tree:

```
git log -1 --format="%h %an <%ae> %ad %s" 81af905
  → PHANTOM AUTOPILOT <autopilot@phantom.local> Tue Sep 8 00:12:58 2026
    "chore: round 2026-09-08_0006 no-op -- five channels checked, no owner answer"
    = the runner's own commit, not an owner answer
git merge-base --is-ancestor 3503537 81af905      → ancestor-ok
git diff --diff-filter=D --name-only HEAD 81af905 → empty (no deletions ⇒ path-checkout ≡ fast-forward)
git diff --stat 81af905 -- .   (after checkout)   → empty (tree matches tip byte for byte)
```

Five channels, all silent:

1. `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:" README.md` = **8** —
   the two counters agree, so all 8 decisions are still unanswered.
2. `git ls-files | grep -i jspdf` → empty. The owner has not vendored jsPDF, so the last external
   reference cannot be inlined yet.
3. `git status --untracked-files=all --short` → empty. Nothing dropped into the tree by hand.
4. Non-`auto/*` refs unmoved: `design-system`/`origin/design-system` = `3503537` (2026-08-13),
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20), `mac/hardening-pass`/`origin/hardening-pass`
   = `592e7c3` (2026-07-20), `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (**2026-06-27**).
5. `AUTOPILOT.md` measured before editing: **2,944 lines / 395,971 bytes**.

## What I did NOT do

- **No code change of any kind.** No byte of `index.html`, `design-system/`, `tools/` or `docs/`.
- **Did not answer any of the 8 open decisions.** Three of them (chip padding, segmented padding,
  input sizes) are the only things still standing between the repo and the remaining acceptance
  criteria, and every option under each moves visible pixels.
- **Did not re-run the `:short` A/B.** Evidence has been sufficient since `2026-09-04_0048`, and this
  round's single-tip day makes the two formulas indistinguishable anyway — running it would have
  produced agreement that proves nothing and risks being cited later as "the trap retired".
- **Did not trim `AUTOPILOT.md`,** even though its size is precisely why `## Next task` arrives empty
  in the prompt. Deleting round history is an owner decision. I only *stopped adding* to it: no new
  status block this round, and the forecast block was rewritten in place at roughly constant length.
- **Did not attempt `git push`, `gh`, `git merge --ff-only`, or a browser.** The first two are denied
  by contract, `merge --ff-only` is permission-blocked here (rounds `_0010` and `_0027` both burned a
  call confirming it), and both browser MCPs are permission-blocked, not merely headless.
- **Did not restore `docs/design-parity.md`** (lost by round `2026-08-19_0022`, still reachable at
  `c3351fc:docs/design-parity.md`). That is open decision 8.

## Risk

- 🔴 **The runner bug is now ~3.5 weeks old and nothing in this repo can fix it.** Every `auto/*`
  branch is still cut from `3503537` and `main` is still `ef3220e` (2026-06-27) — **83 rounds of work
  have never been merged anywhere.** A reviewer should look at the branch topology before the diff.
- 🔴 **This round's own tip will be the second on `2026-09-08`, so the ranking tie returns next
  round.** With `81af905` (leading `8`) as the incumbent, a sha-first ranking is accidentally right
  only for a closing sha leading `9`–`f`; `0`–`7` discards this entire round, silently — empty
  residual diff, five matching harness keys, three green Verify stages. The forecast is written into
  `AUTOPILOT.md`; the fix is `--sort=-committerdate`, not hoping the hex digit falls right.
- ⚠️ **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child`, identical in
  both versions). The PASS says nothing about it. This is expected and unchanged, not new.
- ⚠️ **Nothing here was verified in a real browser** — that has never happened in any round, and it
  is open decision 4. Every claim about rendering rests on source reading and the CSS cascade
  simulation in `docs/btn-parity-proof.mjs`, which notably does **not** model inheritance.
- ⚠️ **This SUMMARY's numbers all come from this round's own command output**, not transcribed from
  the previous SUMMARY. Errors in these files have historically propagated by copy-forward.
