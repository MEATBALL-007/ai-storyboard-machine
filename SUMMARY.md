# Round `2026-09-21_0027` — no-op round (blocked on owner decisions); tiebreak fired for real → **heads**, breaking a 5-round tails streak

## What I did

- **Restored the previous round's work.** The runner cut this branch from `3503537` (the round-1
  contract) again, so the tree arrived ~5 weeks stale — `ls tools docs` showed only `test.mjs` and
  `superpowers/`, i.e. neither `tools/check-tokens.mjs` nor `docs/btn-parity-proof.mjs` existed, and
  `git log -1` dated my tip `2026-08-13`. Selected the tip **date-major** from
  `git for-each-ref --sort=-committerdate`, taken *before* any `checkout`, after dropping my own
  refname: row 1 = `f33211e` = `auto/…/2026-09-21_0017`. Confirmed it holds real work
  (`git log --oneline -3` → `f33211e docs:` above `0e5774f chore: restore…`), not a restore-only tip.
- **Checked all 5 owner channels — no answer on any of the 8 open decisions.** Details below.
- **Ran the full Verify (3 stages) and all 5 harness keys** — every value matches the recorded table
  in `AUTOPILOT.md`, including `toast-hit`'s intentional `FAIL — 5`.
- **Resolved `_0017`'s forecast: the tiebreak FIRED (not masked), and the result is `หัว`/heads.**
  This is a real measurement and it **moves the statistic** — the first non-tails result in 6
  measured rounds. Ran both formulas explicitly; both return `f33211e` at row 1.
- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/` by a single byte** — this
  round's only content edits are `AUTOPILOT.md` (`## Next task` block) and `SUMMARY.md`.

## Why

- The `## Next task` block is explicit: if `README.md`'s `## Open decisions` has no owner answer,
  the round is a no-op — restore, check 5 channels, verify, write SUMMARY, stop, and **invent no
  substitute work**. All eight decisions are still open, so that is exactly what this round is.
  Every remaining acceptance criterion is gated on a *design* choice (chip padding, segmented
  padding, input sizes, `:hover` leaks on disabled buttons, browser-verification permission,
  vendoring jsPDF) — an agent picking one of those moves pixels the owner did not approve.
- **I used tree-sha identity rather than a residual diff to prove the restore.**
  `git rev-parse HEAD^{tree}` = `git rev-parse f33211e^{tree}` = `e4324232f8849651…`. Identical tree
  objects prove the snapshot matches on **every path at once**, closing `git checkout -- .`'s known
  blind spot (it cannot delete files). I also confirmed `git diff --name-status 3503537 f33211e`
  yields only `A`/`M` and no `D`, so `checkout -- .` was sufficient this round.
- **I did run the A/B this round, unlike `_0017`, because the mask rule says it is a real
  measurement.** After dropping my own refname the newest `committerdate:short` is `2026-09-21`
  holding **two** tips (`b857b8e` `_0005`, `f33211e` `_0017`) → the date field does *not* settle row
  1, so the sha becomes a genuine tiebreak. Per the mask rule (`≥2 tips = fire, 1 tip = structural
  heads`), this counts.
- **Why heads:** comparand = `b857b8e` (the max sha on `2026-09-21` that is not the correct tip).
  The correct tip `f33211e` starts `'f'` > `'b'`, so the wrong formula happens to land on the *same*
  tip — the two agree, which is heads. `_0017`'s **conditional** prediction was therefore correct in
  form ("tails iff the closing sha < `b857b8e`"); its point estimate `P(tails) ≈ 72.01%` simply
  landed in the 28% branch. A correct conditional with an unlucky draw is not a wrong rule.

## Verification

Verify command, all three stages green:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → 6/6 checks, 22/22 tokens, 4/4 fonts, 15 CSS sources
npm --prefix design-system test → 12 files, 31 passed
```

All 5 harness keys, run with the **pinned** shas from `AUTOPILOT.md:4066-4070`:

| key | result | pairs / elements | markup coverage |
|---|---|---|---|
| `buttons` (`2488f2d`→tree) | PASS | 85 / 17 | 7 old gone, 5 new ✅ |
| `segmented` (`021b966`→tree) | PASS | 45 / 9 | 0 old gone, 3 new ✅ |
| `toast` (`de07ea8`→`10e8f39`) | PASS | 5 / 1 | no undecidable |
| `ds-disabled-hover` (`f33211e`→tree) | PASS | 15 / 3 | + 1 undecidable (`.pui-menu__item:last-child`) |
| `toast-hit` (`3d3d5cc`→tree) | **FAIL — 5** (correct) | 10 / 2, 0 markup, 0 unmatched | — |

`toast-hit`'s 5 failing rows verified **individually** with `grep "✗"` (not the blind-spotted
`grep -c "✗ #toast:"`): all five are `#toastUndo` — `(base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus` — and **no `#toast` row appears**. That is the recorded correct result.

Five channels, all showing no owner answer:

1. tree identity `HEAD^{tree}` == `f33211e^{tree}` == `e4324232f8849651…`
2. `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:" README.md` = **8** —
   the two counters agree, so nothing has been answered
3. `git ls-files | grep -i jspdf` → **0 lines** — jsPDF still not vendored
4. `git status --untracked-files=all --short` → **0 lines** — no files dropped in by the owner
5. non-`auto/*` refs unmoved: `design-system`/`origin/design-system` = `3503537` (2026-08-13),
   `mac`/`mac/design-system` = `e3a355c`, `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3`,
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27)

## What I did NOT do

- **Did not answer any of the 8 open decisions**, and did not touch `Button.css`, `Menu.css`,
  `Chip.css`, `SegmentedToggle.css`, `Field.css`, or `index.html`. Decisions 2/5/6/7 each move
  visible pixels, and **no checker in this repo can see it**: jsdom does no hit-testing and nothing
  inspects `:hover`, so Verify would stay green through a silent visual regression.
- **Did not add a 7th token check** or otherwise touch `tools/` — all 22 tokens already have
  coverage, so there is nothing left to enforce.
- **Did not verify in a real browser** — Playwright and Chrome-DevTools MCP are both
  permission-blocked (decision 4 unanswered). This is a standing gap, not a new one.
- **Did not add the harness to the Verify command** — it is a per-round instrument, not a gate that
  must stay green (`toast-hit` is *supposed* to fail).

## Risk

- ⚠️ **I initially ran `buttons` and `segmented` with a guessed `before` ref** (the tip I had just
  restored, `f33211e`) and got `FAIL — 487` and `FAIL — 150`. Those were **artifacts of the wrong
  ref, not regressions** — with the pinned shas both PASS. `AUTOPILOT.md:4062` predicted this exact
  trap ("a round that guesses the ref may read PASS as FAIL and think the app regressed"). The
  restored tip is the `before` side for **`ds-disabled-hover` only**; the other four keys pin their
  own historical shas. Read `AUTOPILOT.md:4066-4070` *before* running, not after a surprising FAIL.
- ⚠️ **The A/B agreement this round is a coincidence, not a structural guarantee.** Both formulas
  returned `f33211e` for *different reasons* (correct: highest refname on the newest date; wrong:
  `'f' > 'b'` lexically). The wrong formula is still wrong — visible one row down, where it ranks
  `c7842e2` (`_0010`, the *oldest* tip of 2026-09-20) above `29bccef` (`_0040`). Do not read this
  heads as evidence the trap retired.
- ⚠️ **Cumulative statistic now `ก้อย` (tails) 31 of 49** — excluding the 4 structural-heads rounds,
  **31/45**. The 5-round tails streak is broken.
- ⚠️ `ds-disabled-hover`'s PASS still says nothing about `.pui-menu__item:last-child`; the harness
  deliberately cannot read structural pseudo-selectors. A change confined to that rule computes 0
  diff. It must be read by hand.
- ⚠️ This round is docs-only, so **the blast radius of a mis-selected tip would have been invisible
  to every checker** — residual empty, harness all matching, Verify green. Tip selection is only
  ever validated *before* the `checkout`.
