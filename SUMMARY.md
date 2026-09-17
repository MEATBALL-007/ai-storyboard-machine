# Round 2026-09-18_0503 — no-op round (five channels checked, no owner answer)

## What I did

- **Restored the tree from the previous round's tip.** This branch was cut from `3503537`
  (the original round-1 contract), which predates ~55 rounds of committed work — `tools/check-tokens.mjs`
  and `docs/btn-parity-proof.mjs` did not exist in my checkout. Selected the tip with
  `git for-each-ref --sort=-committerdate` (row 1 = `304da7a` = `_0030`) and cross-checked by
  refname (`_0030` is the highest round number below my own `_0503` on date `2026-09-18`).
  Both methods agree. Committed as `chore: restore work from round 2026-09-18_0030`.
- **Checked all five owner channels — every one silent.** No decision answered; this round is
  therefore a no-op by contract, and I invented no substitute work.
- **Ran the Verify command in full (3 stages) and the parity harness (all 5 keys).**
  All five harness keys reproduce the recorded table value-for-value.
- **Resolved the previous round's A/B prediction: "ก้อย" (tails) — prediction wrong again**
  (`_0030` predicted ~66.3% heads). Second consecutive miss.
- Updated `## Next task` in `AUTOPILOT.md` with the A/B result, the new structural finding,
  and the prediction for the next round.

## Why

The contract's `## Next task` is explicit: with no owner answer, the round is a no-op —
restore the tip, check five channels, run Verify + harness, write SUMMARY, stop. The eight
open decisions in `README.md` each gate a change that **moves pixels a human will see**
(chip padding, segmented padding, input sizes, `:disabled:hover` cascade leaks). Answering
one myself would be a design decision taken by an unattended agent, which is exactly what
the contract forbids. Fallback tooling work is genuinely exhausted: all 22 tokens now have
checker coverage, so there is no seventh check left to add.

I ran the A/B because the contract asks for it and because this round is a **real
measurement**: day `2026-09-18` held 3 tips when the round began, so the date field could not
decide row 1 alone and the tiebreak genuinely fired. (Rounds where the day has a single tip
are excluded — the two formulas cannot be distinguished there, and agreement proves nothing.)

## Verification

**Five channels — all silent:**

| # | Channel | Command | Result |
|---|---|---|---|
| 1 | Owner edits in tree | `git diff --stat 304da7a -- .` | **empty** — tree byte-identical to restored tip |
| 2 | Decision counters | `grep -c "\| Option \| Cost \|" README.md` / `grep -c "If you answer:" README.md` | **8 / 8** — counters agree = nobody answered |
| 3 | jsPDF vendored | `git ls-files \| grep -i jspdf` | **empty** — still cannot inline jsPDF |
| 4 | Untracked drops | `git status --untracked-files=all --short` | **empty** |
| 5 | Non-auto branches | `git for-each-ref --sort=-committerdate` | unmoved: `design-system` = `3503537` (2026-08-13), `mac` = `e3a355c` (2026-07-20), `hardening-pass` = `592e7c3` (2026-07-20), `main` = `ef3220e` (**2026-06-27**) |

**Verify command — green on all 3 stages:**

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → 6/6 checks pass, 15 CSS sources scanned
                               (tokens 22/22, fonts 4/4, no derived-colour literals,
                                font weights 400/500/700/800, no radius literals,
                                every font-family reads var(--mono))
npm --prefix design-system test → 12 files, 31 passed
```

**Parity harness — all 5 keys match the recorded table:**

| Key | Pairs / elements | Markup coverage | Result |
|---|---|---|---|
| `buttons` | 85 / 17 | 7 old gone, 5 new | PASS |
| `segmented` | 45 / 9 | 0 old, 3 new | PASS |
| `toast` | 5 / 1 | 0 old, 1 new | PASS, no undecidable |
| `ds-disabled-hover` | 15 / 3 | N/A — source is a stylesheet | PASS + 1 undecidable (`.pui-menu__item:last-child`, unreadable: structural pseudo `:last-child`) |
| `toast-hit` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5 declarations differ** — the expected, intended result |

`toast-hit`'s FAIL is correct, not a regression: the `pointer-events:auto` fix on `.toast-act`
*deliberately* changed behaviour, and this key exists to show what changed. I read all five
`✗` rows — every one is `#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` /
`:focus`) and **not one is `#toast`**, which is the evidence that `#toast`'s
`pointer-events:none` was not removed.

The `ds-disabled-hover` before-side reads from the tip I actually restored (`304da7a`), not a
sha copied from an older AUTOPILOT block.

**A/B on the tip-selection bug — resolved as "ก้อย" (tails), a real measurement:**

```
correct (--sort=-committerdate)                      → row 1 = 304da7a  _0030  ✅
buggy   (date:short + sha-before-refname + sort -r)  → row 1 = 563e7fc  _0006  ❌
```

The correct tip falls to **row 2** under the buggy formula because `'3'` < `'5'`. Using it
would have discarded both `_0018` and `_0030` = **2 rounds**. Actual damage this round =
**0**, because I used the correct formula as the first command of the round, before any
`checkout`. Cumulative for the buggy formula: **tails 26 of 41** (excluding the 3 structural
heads: **26 of 38**).

## What I did NOT do

- **Did not answer any of the 8 open decisions.** Each moves visible pixels; that is the
  owner's call. This is the only thing that can actually unblock the remaining criteria.
- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte.
  Only `AUTOPILOT.md` + `SUMMARY.md` changed beyond the restore commit.
- **Did not add a 7th token check.** All 22 tokens have coverage; there is nothing left to
  enforce, and inventing one would be scope creep dressed as progress.
- **Did not trim `AUTOPILOT.md`** (now **3,762 lines / 530,451 bytes**). Its size is why
  `## Next task` arrives empty in the prompt, but deleting the owner's record is the owner's
  right, not mine.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are permission-blocked, not
  merely headless — previous rounds already burned a round proving this. Criterion 3
  (`file://` double-click) stays unverified.
- Did not push or open a PR — I cannot; the runner does that.

## Risk

- **The round is genuinely empty of product value.** Nothing a user sees changed, and nothing
  will until someone answers a decision. Roughly 6 weeks of rounds are now in this state.
  A reviewer should read that as a process problem, not as progress.
- **The runner's stale-base bug is unfixed for ~5 weeks** and `main` is still `ef3220e`
  (2026-06-27) — no autopilot work has ever landed on `main`. Every round pays the restore
  cost. No round can fix this; it needs a human.
- **Next round's tip-selection risk is ~33.7%, and the blast radius is now 3 rounds.**
  When this round closes, day `2026-09-18` will hold 4 tips
  (`563e7fc` / `1c3401f` / `304da7a` / this round's sha). The comparand stays **`563e7fc`**
  — unchanged for a third consecutive round, because this round was tails. Heads only if this
  round's closing sha sorts lexically above `563e7fc`;
  P(tails) = `0x563e7fc / 0x10000000` = `90,433,532 / 268,435,456` ≈ **33.7%**.
  ⚠️ Do not read 33.7% as safe — one-in-three has now landed **twice in a row**. There is no
  mask next round (4 tips means the tiebreak fires for certain). Next round must use
  `--sort=-committerdate` and cross-check by refname.
- **A wrong restore is undetectable by every gate in this repo.** If next round picks
  `563e7fc`, the code tree is byte-identical, residual diff is empty, all 5 harness keys
  match, and Verify is green on all 3 stages. Only the refname cross-check catches it.
  Treat the harness and Verify as *incapable* of detecting lost rounds.
- **Verify does not cover the harness, and nothing forces the harness to track the code.**
  The 5 keys are evidence about specific past rounds, not a live regression net.
- **No checker reads `:hover`, and jsdom does no hit testing.** The two `:disabled:hover`
  cascade leaks recorded under decision 7 (`#tourBack`, `.menu-pop button.danger:hover`) are
  real and still live in the shipped app. A round that "just fixed them" would keep Verify
  fully green — which is precisely why they must wait for an answer.
