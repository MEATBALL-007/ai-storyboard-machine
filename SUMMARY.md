# Round `2026-09-21_0005` — no-op round (blocked on owner decisions), plus one correction to the contract's own tip-selection rule

## What I did

- **Restored the previous round's work.** The runner cut this branch from `3503537` (the round-1
  contract) again, so the tree arrived ~5 weeks stale: `tools/check-tokens.mjs` and
  `docs/btn-parity-proof.mjs` did not exist (`ls tools docs` confirmed). Selected the tip by
  refname (date-major) **before** any `checkout`, cross-checked with
  `git for-each-ref --sort=-committerdate` — both agree on `29bccef` (`_0040`). Confirmed the
  restore was purely additive (`A`/`M` only, **no `D`**) before running it.
- **Checked all 5 owner channels — no answer on any of the 8 open decisions.** Details below.
- **Ran the full Verify (3 steps) and all 5 harness keys** — every value matches the recorded table.
- **Found and fixed a real error in `AUTOPILOT.md`'s own predictive rule.** The `_0040` block split
  the next round into cases (ก)/(ข) by *calendar day* and claimed a round starting `2026-09-21`
  would be a **masked "structural heads"** that must not be counted. That is wrong, and this round
  is the case that demonstrates it. Replaced both cases with the correct rule.
- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/` by a single byte** — only
  `AUTOPILOT.md` and `SUMMARY.md`.

## Why

**Why the case (ก)/(ข) rule was wrong.** It read row 1 of `for-each-ref` *including this round's own
ref*. But a round can never restore its own tip, so every round must drop its own refname before
reading row 1 — which `_0020` already did in practice. Once my own ref is dropped, the newest
remaining date is `2026-09-20`, holding **4 tips** (`c7842e2` `_0010` / `0779a9e` `_0020` /
`8aa785d` `_0030` / `29bccef` `_0040`). The SHA tiebreak therefore *does* fire, and the two formulas
diverge:

- correct (`--sort=-committerdate`) → row 1 = `29bccef` = `_0040` ✅ date-major
- legacy (`committerdate:short` + sha before refname + `| sort -r`) → row 1 = `c7842e2` = `_0010` ✗

So this round is a **real measurement ("tails"), not a masked one** — blast radius of the legacy
formula would have been **3 tips** (`_0020` + `_0030` + `_0040`), each of which carries real content
(a docs commit above its `chore: restore…`). Cumulative: **tails 31 of 47** (excluding the 3
structural heads = **31/44**).

**The corrected rule, now written into the contract:** masking depends only on how many tips are
*eligible to be restored*, never on the calendar day —

> mask iff, after dropping your own refname, the newest `committerdate:short` in the list holds
> **exactly one** tip. One tip → the date field decides before reaching the SHA (structural heads,
> do not count). Two or more → the SHA becomes the tiebreaker (real measurement, count it).

A consequence worth flagging: this makes the **first round of a new day precisely the round that is
NOT masked** — the exact opposite of what case (ข) claimed — because the newest remaining date is
the *previous* day, which usually holds 4–6 tips.

**Why I am confident this is the contract's error and not my own reinterpretation:** `_0010` was
itself the first round of `2026-09-20`, and its own ledger entry scored it as *"วัน 2026-09-19 มี 4 tip
→ ไม่มี mask tiebreak fire จริง เป็นการวัดจริง"* — i.e. it already applied the corrected rule.
Case (ข) contradicts `_0010` inside the same file, and `_0010` is the side that is right.

Note also that `_0040` contained **two mutually contradictory predictions**: its *conditional* form
("tails iff the round-closing sha < `c7842e2`") was **correct** — `_0040` closed at `29bccef`, and
`'2'` < `'c'` → tails. Only the day-based framing was wrong. The lesson recorded: the conditional
form survived; the day-split did not.

## Verification

Verify command, all three steps green:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → 6/6 checks pass: tokens 22/22, fonts 4/4 byte-identical,
                               no derived-colour literals / font weights available /
                               no radius literals / typeface from one source
                               (15 CSS sources scanned)
npm --prefix design-system test → 12 files, 31 passed
```

Harness, all 5 keys (argument pairs copied from the contract block, not guessed):

| key | result | matches table |
|---|---|---|
| `buttons` (`2488f2d`→`9fab5c9`) | 85 pairs / 17 elements, markup 7 gone / 5 new, **PASS** | ✅ |
| `segmented` (`021b966`→tree) | 45 / 9, markup 0 / 3, **PASS** | ✅ |
| `toast` (`bb10dd9`→`3d3d5cc`) | 5 / 1, markup 0 / 1, **PASS**, no undecidable | ✅ |
| `ds-disabled-hover` (`29bccef`→tree) | 15 / 3, **PASS** + 1 undecidable, markup `N/A` | ✅ |
| `toast-hit` (`3d3d5cc`→tree) | **FAIL — 5 declarations differ**, 10 pairs / 2 elements, 0 markup, 0 unmatched | ✅ expected |

`toast-hit` FAIL-5 is the **correct, recorded result**, not a regression: all five `✗` rows are
`#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) and **none is
`#toast`** — which is the evidence that `pointer-events:none` is still on the container.

Restore integrity:

- `git rev-parse HEAD^{tree}` = `29bccef^{tree}` = `1e74f0c33b8035e97523405cd596dd44e9b2df7b`
- `git diff --stat 29bccef -- .` — empty (byte-identical every path)
- `git diff --name-status 3503537 29bccef | cut -c1-2 | sort -u` = `A`/`M` only, no `D`
- `git log --oneline -2 29bccef` = docs commit above `chore: restore…` → the tip held real work

The 5 channels:

1. `git diff --stat 29bccef -- .` — **empty** → no owner edit in the tree
2. `grep -c "| Option | Cost |" README.md` = **8**; `grep -c "If you answer:" README.md` = **8**
   → the two counters **agree** = nobody answered
3. `git ls-files | grep -i jspdf` — **empty** → jsPDF still not vendored
4. `git status --untracked-files=all --short` — **empty**
5. `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` =
   `e3a355c` (2026-07-20); `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — **no movement**

## What I did NOT do

- **No acceptance criterion was ticked.** All remaining work (chip padding, segmented padding, input
  sizes, the two `:hover`-on-`:disabled` cascade bugs, inlining jsPDF, real browser verification)
  is gated on owner decisions 1–8. I did not answer any of them myself.
- **Did not delete any history from `AUTOPILOT.md`,** even though its size (now **4,099 lines /
  583,742 bytes**, up from 3,762 / 530,451 at `_0503`) *is* the reason `## Next task` reaches the
  prompt empty. Trimming it is the owner's call. Per the `_0035` convention I did not add a new
  `> **สถานะล่าสุด …` block; the channel results went inside the Next task block instead.
- **Did not re-audit the 3 historical "structural heads" classifications** against the corrected
  mask rule. `_0020` I checked and it is correctly classified (its newest other-owner date held
  exactly 1 tip). The other two I did not verify — see Risk.
- Did not touch `storyboard-simulator.html`, tests, or the `PURE-LOGIC`/`TESTS` markers.

## Risk

- **A reviewer should check the corrected mask rule before trusting it.** It changes how future
  rounds classify their own A/B result, so an error here propagates into the statistics. The
  argument rests on one premise — *a round can never restore its own tip, so its own refname must be
  dropped before reading row 1* — which I believe is self-evidently true and is what `_0020` already
  did. If that premise is ever false, the rule is wrong.
- **The cumulative statistic `31/47` (`31/44` excluding structural heads) inherits any error in the
  3 earlier structural-heads classifications,** which I did not re-audit under the corrected rule.
  If any of those were first-of-day rounds, they were probably misclassified as masked when the
  tiebreak actually fired, and the denominator should grow. I flag this rather than silently
  adjusting numbers I did not measure.
- **The whole tip-selection ritual is a workaround for an unfixed runner bug,** now ~5 weeks old:
  every `auto/*` branch is still cut from `3503537`, and `main` is still `ef3220e` (2026-06-27), so
  **no round's work has ever been merged**. No round can fix this; it needs a human. If the runner is
  ever fixed, the restore step becomes wrong and must be removed.
- **`toast-hit` reports FAIL by design.** Any automation that treats a non-zero harness exit as a
  gate will misread this round. The pass/fail meaning is per-key, documented in the table above.
- **Nothing here was verified in a real browser** (decision 4 not granted; Playwright and
  Chrome-DevTools MCP are both permission-blocked, not merely headless). Every claim about rendering
  comes from source plus the CSS cascade model, and the harness does not model inheritance.
