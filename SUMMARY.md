# Round 2026-09-19_0025 — no-op round (five channels checked, no owner answer)

## What I did

- **Restored the tree from the previous round's tip.** This branch was cut from `3503537` (the
  original round-1 contract), which predates ~57 rounds of committed work. Selected the tip with
  `git branch -a --sort=-committerdate` as the **first command of the round, before any
  `checkout`** (row 1 = `2026-09-19_0013`) and cross-checked **by refname** (`_0013` is the highest
  round number on the latest date `2026-09-19`). Both methods agree. Restored `c6e065b`; residual
  diff `git diff c6e065b --stat` is **empty**. Committed as `5a05fb2`.
- **Checked all five owner channels — every one silent.** No decision answered; this round is
  therefore a no-op by contract, and I invented no substitute work.
- **Ran the Verify command in full (3 stages) and the parity harness (all 5 keys).** All three
  Verify stages green; all five harness keys reproduce the recorded table exactly, including
  `toast-hit`'s intended FAIL.
- **Resolved the A/B on the tip-selection bug: "หัว" (heads) — but *structurally masked*, so it
  does not move the statistic.** `_0013` predicted exactly this, for exactly the right reason.
- **Found and recorded a genuine correction to the record: the mask is not a safety feature.**
  Round `_0018` concluded that a new day with one tip "resets the ratchet" and pulls expected risk
  back to ~50%. True in expectation — but this is the first observed reset that landed *worse* than
  the value it replaced: **P(tails) jumped 33.7% → 77.7%**. Next round is the highest-risk round
  ever recorded here, and it is the first round whose prediction is **"tails"**.

## Why

The contract's `## Next task` is explicit: with no owner answer, the round is a no-op — restore the
tip, check five channels, run Verify + harness, write SUMMARY, stop. The eight open decisions in
`README.md` each gate a change that **moves pixels a human will see** (chip padding, segmented
padding, input sizes, the two `:disabled:hover` cascade leaks). Answering one myself would be a
design decision taken by an unattended agent, which is exactly what the contract forbids. Fallback
tooling work is genuinely exhausted: all 22 tokens already have checker coverage.

I ran the A/B with my own refname excluded, because a round never restores its own branch — leaving
it in would let this round's fresh commit masquerade as a candidate and fake an agreement between
the two formulas.

I flagged the mask finding loudly because the existing record trends toward reading a mask as good
news ("ความเสี่ยงเป็น 0 จริง"). That is true only *for the masked round itself*. The mask also
**re-draws the comparand uniformly**, and this time the draw was bad. A future round that reads
"mask = safe" and skips the refname cross-check is walking into a 77.7% chance of silently
discarding work.

## Verification

**Five channels — all silent:**

| # | Channel | Command | Result |
|---|---|---|---|
| 1 | Owner edits in tree | `git diff --stat c6e065b -- .` | **empty** — tree byte-identical to restored tip |
| 2 | Decision counters | `grep -c "^### [1-8]\."` / `grep -c "If you answer:"` / `grep -c "\| Option \| Cost \|"` | **8 / 8 / 8** — all three agree = nobody answered |
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
| `toast` | `bb10dd9:index.html 3d3d5cc:index.html` | 5 / 1 | 0 old, 1 new | PASS |
| `ds-disabled-hover` | `c6e065b:design-system/src/styles.css design-system/src/styles.css` | 15 / 3 | N/A — source is a stylesheet | PASS + 1 undecidable (`.pui-menu__item:last-child`, structural pseudo) |
| `toast-hit` | `3d3d5cc:index.html index.html` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5 declarations differ** — the expected, intended result |

The `toast` key reproduced PASS on the **first** attempt this round, because `_0013` recorded its
argument pair. Pinning the after-side to `3d3d5cc` is mandatory; the obvious guess
(`bb10dd9:index.html index.html`) still yields a misleading FAIL.

`toast-hit`'s FAIL is correct, not a regression. I enumerated all five `✗` rows —
`#toastUndo (base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`. **Not one is `#toast`**,
which is the evidence that `#toast`'s `pointer-events:none` is still in place and only the
`.toast-act` fix moved.

`ds-disabled-hover`'s before-side reads from the tip I actually restored (`c6e065b`), not a sha
copied from an older AUTOPILOT block.

**A/B on the tip-selection bug — "หัว" (heads), but masked and therefore NOT counted:**

```
correct (--sort=-committerdate)                      → row 1 = c6e065b  _0013  ✅
buggy   (committerdate:short + sha-before-refname + sort -r) → row 1 = c6e065b  _0013  ✅
```

Day `2026-09-19` held exactly **one** tip when the round began (`c6e065b`); this branch itself
pointed at `3503537`, dated `2026-08-13`, so it was not a tip of that day. The date field decided
row 1 on its own and the tiebreak never fired — a structural head, not a measurement. Cumulative
statistic for the buggy formula is therefore **unchanged: tails 26 of 42** (excluding the now-4
structural heads: **26 of 39**). Both A/B commands were run with my own refname excluded.

**Next round's risk — computed, not copied:**

```
comparand 0xc6e065b = 208537179
space     0x10000000 = 268435456
P(tails) = 77.7%      P(heads) = 22.3%
```

## What I did NOT do

- **Did not answer any of the 8 open decisions.** Each moves visible pixels; that is the owner's
  call, and it is the only thing that can unblock the three remaining criteria.
- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte beyond the
  restore. Only `AUTOPILOT.md` + `SUMMARY.md` changed on top of `5a05fb2`.
- **Did not "fix" the `toast-hit` FAIL.** It is the intended, documented output of that key.
- **Did not move the harness argument list into `docs/btn-parity-proof.mjs`**, where it arguably
  belongs — that would edit a file this no-op round must leave alone. It stays in `AUTOPILOT.md`.
  A future round with an owner mandate should move it into the harness header.
- **Did not add a 7th token check.** All 22 tokens have coverage; inventing one is scope creep.
- **Did not trim `AUTOPILOT.md`.** Its size is why `## Next task` arrives empty in the prompt, but
  deleting the owner's record is the owner's right, not mine.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are permission-blocked, not merely
  headless. Criterion 3 (`file://` double-click) stays unverified.
- Did not push or open a PR — I cannot; the runner does that.

## Risk

- **🚨 Next round carries the highest tip-selection risk ever recorded: `P(tails) ≈ 77.7%`,
  and the mask has expired.** Day `2026-09-19` will hold 2 tips, so the tiebreak fires for certain.
  If that round uses the buggy formula it restores `c6e065b` and silently discards this round.
  Blast radius is currently 1 round, but grows by 1 for every subsequent tails.
- **The record's framing of "mask" was over-optimistic and I have corrected it.** A mask makes the
  *masked* round safe while re-drawing the next comparand uniformly. This round's draw landed at
  `c` — worse than the `5`-nibble value it replaced. Do not read "we just had a mask" as "we are
  safe."
- **The round is genuinely empty of product value.** Nothing a user sees changed, and nothing will
  until someone answers a decision. Roughly 6 weeks of rounds are now in this state. A reviewer
  should read that as a process problem, not as progress.
- **The runner's stale-base bug is unfixed for ~5 weeks** and `main` is still `ef3220e`
  (2026-06-27) — no autopilot work has ever landed on `main`. Every round pays the restore cost.
  No round can fix this; it needs a human.
- **A wrong restore is undetectable by every gate in this repo.** The tree would be byte-identical,
  residual diff empty, harness keys matching, Verify green on all 3 stages. Only the refname
  cross-check catches it. Treat the harness and Verify as *incapable* of detecting lost rounds.
- **The harness is evidence about past rounds, not a live regression net.** Two of the five keys
  (`toast`, `toast-hit`) legitimately disagree with the working tree, and one of them is supposed
  to. Nothing forces these keys to track the code.
- **No checker reads `:hover`, and jsdom does no hit testing.** The two `:disabled:hover` cascade
  leaks recorded under decision 7 (`#tourBack`, `.menu-pop button.danger:hover`) are real and still
  live in the shipped app. A round that "just fixed them" would keep Verify fully green — which is
  precisely why they must wait for an answer.
