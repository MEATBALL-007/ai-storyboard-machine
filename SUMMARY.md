# Round 2026-09-19_0013 — no-op round (five channels checked, no owner answer)

## What I did

- **Restored the tree from the previous round's tip.** This branch was cut from `3503537`
  (the original round-1 contract), which predates ~56 rounds of committed work — `tools/check-tokens.mjs`
  and `docs/btn-parity-proof.mjs` did not exist in my checkout, and `index.html` was 191,094 bytes
  instead of 308,916. Selected the tip with `git for-each-ref --sort=-committerdate` (row 1 =
  `7f342c1` = `_0503`) and cross-checked **by refname** (`_0503` is the highest round number on the
  latest date `2026-09-18`). Both methods agree. Committed as `ff6e85d`.
- **Checked all five owner channels — every one silent.** No decision answered; this round is
  therefore a no-op by contract, and I invented no substitute work.
- **Ran the Verify command in full (3 stages) and the parity harness (all 5 keys).** All five
  reproduce the recorded table — but `toast` only after I corrected its arguments (below).
- **Found and recorded a real trap in the harness: the `toast` key's after-side must be pinned
  to `3d3d5cc`.** Run against the working tree it reports `FAIL — 5 declarations differ`, which
  is *not* a regression. Wrote the full 5-key argument list into `AUTOPILOT.md` so no future
  round has to guess.
- **Resolved the previous round's A/B prediction: "หัว" (heads) — prediction correct**, ending a
  two-round miss streak.

## Why

The contract's `## Next task` is explicit: with no owner answer, the round is a no-op — restore
the tip, check five channels, run Verify + harness, write SUMMARY, stop. The eight open
decisions in `README.md` each gate a change that **moves pixels a human will see** (chip padding,
segmented padding, input sizes, `:disabled:hover` cascade leaks). Answering one myself would be a
design decision taken by an unattended agent, which is exactly what the contract forbids.
Fallback tooling work is genuinely exhausted: all 22 tokens have checker coverage.

I recorded the `toast` argument pair rather than just noting the PASS because the previous round
logged `toast` as PASS *without* logging how it was invoked. That gap is a live trap: the obvious
guess (`bb10dd9:index.html index.html`, mirroring the `segmented` pair) produces a FAIL, and a
future round could reasonably read that as a regression in shipped code and start "fixing" it.

## Verification

**Five channels — all silent:**

| # | Channel | Command | Result |
|---|---|---|---|
| 1 | Owner edits in tree | `git diff --stat 7f342c1 -- .` | **empty** — tree byte-identical to restored tip |
| 2 | Decision counters | `grep -c "\| Option \| Cost \|"` / `grep -c "If you answer:"` / `grep -c "^### [1-8]\."` | **8 / 8 / 8** — all three agree = nobody answered |
| 3 | `main` moved? | `git for-each-ref refs/heads refs/remotes` | `main` = `ef3220e` (**2026-06-27**) — unmoved |
| 4 | jsPDF vendored / untracked drops | `git ls-files \| grep -i jspdf` ; `git status --untracked-files=all --short` | **both empty** |
| 5 | Non-auto branches | same `for-each-ref` | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13), older than every round's work; `mac` = `e3a355c`, `hardening-pass` = `592e7c3` (both 2026-07-20) |

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

| Key | Arguments used | Pairs / elements | Markup coverage | Result |
|---|---|---|---|---|
| `buttons` | `2488f2d:index.html 9fab5c9:index.html` | 85 / 17 | 7 old gone, 5 new | PASS |
| `segmented` | `021b966:index.html index.html` | 45 / 9 | 0 old, 3 new | PASS |
| `toast` | `bb10dd9:index.html 3d3d5cc:index.html` | 5 / 1 | 0 old, 1 new | PASS, no undecidable |
| `ds-disabled-hover` | `7f342c1:design-system/src/styles.css design-system/src/styles.css` | 15 / 3 | N/A — source is a stylesheet | PASS + 1 undecidable (`.pui-menu__item:last-child`, structural pseudo) |
| `toast-hit` | `3d3d5cc:index.html index.html` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5 declarations differ** — the expected, intended result |

⚠️ **Correction to the previous round's record.** `toast` does **not** reproduce with the working
tree as its after-side. `bb10dd9:index.html index.html` yields `FAIL — 5 declaration(s) differ`,
because round `2026-08-24_0003` added `pointer-events:auto` to `.toast-act` *after* the refactor
this key documents. Pinning the after-side to `3d3d5cc` (the tip of round `_0103`, the round the
key exists to prove) gives the recorded PASS. The `_0503` SUMMARY recorded the PASS but not the
arguments, so this was not discoverable from the record alone — the full list is now in
`AUTOPILOT.md` under `## Next task`.

`toast-hit`'s FAIL is correct, not a regression: the `pointer-events:auto` fix on `.toast-act`
*deliberately* changed behaviour, and this key exists to show what changed. I read all five `✗`
rows — every one is `#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` /
`:focus`) and **not one is `#toast`**, which is the evidence that `#toast`'s `pointer-events:none`
was not removed.

The `ds-disabled-hover` before-side reads from the tip I actually restored (`7f342c1`), not a sha
copied from an older AUTOPILOT block.

**A/B on the tip-selection bug — resolved as "หัว" (heads), a real measurement:**

```
correct (--sort=-committerdate)                      → row 1 = 7f342c1  _0503  ✅
buggy   (date:short + sha-before-refname + sort -r)  → row 1 = 7f342c1  _0503  ✅
```

Day `2026-09-18` held **4 tips** when the round began, so the tiebreak genuinely fired and this
counts as a real measurement. Both formulas agreed because `_0503`'s sha starts with `'7'` — the
highest of the four (`7` > `5` > `3` > `1`). Cumulative for the buggy formula: **tails 26 of 42**
(excluding the 3 structural heads: **26 of 39**). This ends a two-round miss streak; the ~66.3%
heads prediction was correct.

⚠️ The agreement is luck, not evidence the buggy formula works. It would still have failed on any
day where the newest round's sha is not the lexical maximum.

## What I did NOT do

- **Did not answer any of the 8 open decisions.** Each moves visible pixels; that is the owner's
  call, and it is the only thing that can unblock the three remaining criteria.
- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte beyond the
  restore. Only `AUTOPILOT.md` + `SUMMARY.md` changed.
- **Did not "fix" the `toast` FAIL.** It was my arguments that were wrong, not the code. Changing
  shipped CSS to make a mis-invoked harness key go green would have been a real regression
  introduced to satisfy a bad measurement.
- **Did not document the argument list inside `docs/btn-parity-proof.mjs`**, where it arguably
  belongs. That would edit a file this no-op round is supposed to leave alone; I put it in
  `AUTOPILOT.md` instead. A future round with an owner mandate should move it into the harness header.
- **Did not add a 7th token check.** All 22 tokens have coverage; inventing one would be scope
  creep dressed as progress.
- **Did not trim `AUTOPILOT.md`** (now **3,883 lines / 548,505 bytes**, up from 3,762 / 530,451).
  Its size is why `## Next task`
  arrives empty in the prompt, but deleting the owner's record is the owner's right, not mine.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are permission-blocked, not merely
  headless — a previous round already burned a round proving this. Criterion 3 (`file://`
  double-click) stays unverified.
- Did not push or open a PR — I cannot; the runner does that.

## Risk

- **The round is genuinely empty of product value.** Nothing a user sees changed, and nothing will
  until someone answers a decision. Roughly 6 weeks of rounds are now in this state. A reviewer
  should read that as a process problem, not as progress.
- **The runner's stale-base bug is unfixed for ~5 weeks** and `main` is still `ef3220e`
  (2026-06-27) — no autopilot work has ever landed on `main`. Every round pays the restore cost.
  No round can fix this; it needs a human.
- **Next round is structurally masked — risk 0%, and it must not be counted in the statistic.**
  This round commits onto day `2026-09-19`, which will hold exactly **one** tip when the next
  round starts, so the date field decides row 1 alone and both formulas agree. This is a pause,
  not a fix. (Do not confuse this with the *first* round of a new day, which selects among the
  previous day's several tips and is **not** masked.)
- **The round after next is the dangerous one, and I cannot size it.** Its comparand will be this
  round's *closing* sha — the commit containing this sentence — so the probability cannot be
  computed here without changing the very value it depends on. That round must read the sha from
  `for-each-ref` and compute `P(tails) = 0x<sha7> / 0x10000000` itself. **There is no number to
  copy from this SUMMARY.** (The restore commit `ff6e85d` is *not* the comparand — it is not the
  branch tip.)
- **A wrong restore is undetectable by every gate in this repo.** The code tree would be
  byte-identical, residual diff empty, harness keys matching, Verify green on all 3 stages. Only
  the refname cross-check catches it. Treat the harness and Verify as *incapable* of detecting
  lost rounds.
- **The harness is evidence about past rounds, not a live regression net**, and this round proved
  it the hard way: two of the five keys (`toast`, `toast-hit`) now legitimately disagree with the
  working tree, and one of them is *supposed* to. Nothing forces these keys to track the code.
- **No checker reads `:hover`, and jsdom does no hit testing.** The two `:disabled:hover` cascade
  leaks recorded under decision 7 (`#tourBack`, `.menu-pop button.danger:hover`) are real and
  still live in the shipped app. A round that "just fixed them" would keep Verify fully green —
  which is precisely why they must wait for an answer.
