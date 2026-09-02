# Round 2026-09-03_0043 — SUMMARY

## What I did

- **Restored the previous round's tip.** The runner cut this branch from `3503537` again (HEAD was
  the bare contract commit, no `tools/check-tokens.mjs`, no `docs/`). Restored `844900e`
  (`…/2026-09-03_0033`) with `git checkout 844900e -- .` as its own commit `5f5cb9d`, so this
  round's real diff stays readable.
- **Checked all five owner channels — no answer to any of the 8 open decisions.** This is a
  **no-op round**: `index.html`, `design-system/`, `tools/` and `docs/` are untouched, byte for byte.
  Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full Verify (3 stages) and all 5 harness keys.** Every number matches the expected
  table in `AUTOPILOT.md`'s `**Verify:**` block.
- **Corrected one verification instruction in `AUTOPILOT.md`.** The contract told rounds to confirm
  `toast-hit` with `grep -c "✗ #toast:"` = 0. That pattern cannot match the base-state row, which
  prints `✗ #toast (base)` — no colon. It would read 0 even if `#toast`'s base state had regressed,
  i.e. exactly the thing the check exists to catch. Replaced with `grep "✗"` + read all 5 rows.
  Documentation only; no `.css`, no `.html`, no `.mjs` touched.

## Why

- **Restore first, read second.** Reading `index.html` off the stale `3503537` tree makes the token
  work look already finished (that tree *looks* done, not broken) — a past round burned itself that
  way. `git log --oneline -1` showing `3503537` was the first call of this round.
- **Tip picked by `%(committerdate:iso8601)` + cross-checked by refname, never by row number.**
  Four tips now share `2026-09-03` (`844900e`/`adcae8b`/`8cc03f4`/`2eda89e`), so day-granularity
  keys tie completely and a `| sort -r` pipeline would fall through to comparing sha strings.
  `_0033` is also the highest round number below my own `_0043` — the two methods agree.
- **No substitute task invented.** All remaining work is gated on owner decisions 1–8; the survey
  work is closed at 11/11 components and token tooling is 22/22 with six checks. Re-running analysis
  finds nothing. A round that verifies and reports is the correct outcome here.
- **The grep fix is bookkeeping, not new work.** It is an error in the instruction I was executing
  this round, found by executing it. Leaving a check in place that silently passes on the regression
  it guards against is worse than no check.

## Verification

Restore preconditions (all before touching the tree):

```
git log -1 --format=... 844900e  → PHANTOM AUTOPILOT <autopilot@phantom.local>
                                    "chore: round 2026-09-03_0033 no-op -- five channels checked…"
                                    = the runner's commit, not an owner answer
git merge-base --is-ancestor 3503537 844900e   → ancestor-ok
git diff --diff-filter=D --name-only HEAD 844900e → empty (no deletions ⇒ path-checkout ≡ fast-forward)
git diff --stat 844900e -- .  (after restore)  → empty (tree identical byte for byte)
```

Verify command — all three stages green:

```
node tools/test.mjs                → 54 passed, 0 failed
node tools/check-tokens.mjs        → 6/6 checks, 15 CSS sources:
                                     tokens 22/22 · fonts 4/4 byte-identical ·
                                     no derived-colour literals · font-weights ∈ {400,500,700,800} ·
                                     every border-radius reads --r-* · every font-family reads var(--mono)
npm --prefix design-system test    → 12 files, 31 passed
```

Harness — all 5 keys, exactly the expected values:

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | **PASS** — 85 pairs / 17 elements, 0 undecidable, markup OK (7 old class tokens gone, 5 new class attrs) |
| `segmented` | `021b966:index.html index.html` | **PASS** — 45 / 9, 0 undecidable, markup OK (0 gone, 3 new) |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | **PASS** — 5 / 1, 0 undecidable, markup OK (0 gone, 1 new) |
| `ds-disabled-hover` | `844900e:design-system/src/styles.css design-system/src/styles.css` | **PASS** — 15 / 3, **+1 undecidable** `.pui-menu__item:last-child` ("structural pseudo :last-child", identical in both versions) |
| `toast-hit` | `3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 pairs / 2 elements, 0 markup problems, 0 unmatched — **the correct, expected result** |

`toast-hit` differing rows, read in full rather than grepped:

```
✗ #toastUndo (base)   ✗ #toastUndo:hover   ✗ #toastUndo:disabled
✗ #toastUndo:disabled:hover   ✗ #toastUndo:focus
```

All 5 are `#toastUndo`; **zero `#toast` rows of any form** — the proof the app side is untouched
and `#toast` still carries `pointer-events:none`.

Five channels (channel 1 run *after* the restore):

1. `grep -c "| Option | Cost |" README.md` = **8**; `grep -c "If you answer:" README.md` = **8** —
   the two counters **agree**, so nobody answered. (They disagreeing is the signal that someone did.)
2. `git ls-files | grep -i jspdf` → empty (decision 1's file drop has not happened)
3. `main` = `ef3220e` (2026-06-27) — unmoved
4. `git status --untracked-files=all --short` → empty
5. non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of the
   group); `mac`, `mac/design-system` = `e3a355c` (2026-07-20); `mac/hardening-pass`,
   `origin/hardening-pass` = `592e7c3` (2026-07-20); `main`, `mac/main`, `origin`, `origin/main`
   = `ef3220e`. Nothing newer than 2026-08-13, i.e. older than all this work.

## What I did NOT do

- **Did not answer, apply or partially apply any of decisions 1–8.** Each moves pixels a reviewer
  would see or adds a file to the repo. Specifically untouched: chip padding (2), spacing/type scale
  (3), segmented padding (5), input sizes (6), the `:disabled:hover` cascade repairs in `Button.css`
  and `.menu-pop button.danger:hover` (7), and `docs/design-parity.md` (8).
- **Did not restore `docs/design-parity.md`** from `c3351fc`, though it is still reachable there.
  That is decision 8.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying is a wasted round until decision 4 is answered.
- **Did not trim `AUTOPILOT.md`** (now 1,700+ lines, mostly accumulated round status blocks). It is
  why the contract text arrives truncated in the prompt, but deleting round history is discarding
  evidence and is an owner call.
- **Did not add a seventh token check.** All 22 tokens are covered; there is nothing left to enforce.
- Did not run the retrospective restore audit — completed in `2026-08-31_0023`, marked do-not-repeat.

## Risk

- **This round changes no behaviour at all.** The only edits are to `AUTOPILOT.md` prose. If a
  reviewer wants one thing to check, check that: `git diff 844900e -- . ':!AUTOPILOT.md' ':!SUMMARY.md'`
  should be empty.
- **The `grep -c "✗ #toast:"` blind spot may have masked a regression in an earlier round.** I
  verified *this* round directly (all 5 rows printed, none `#toast`), so the current tree is sound.
  But rounds that relied only on that grep would not have caught a `#toast` **base-state** change.
  Nothing suggests one happened — `toast-hit` has reported exactly 5 differing declarations every
  round — and 5 is the count consistent with only `#toastUndo` differing, so this is a latent
  weakness in the check rather than evidence of damage.
- **`ds-disabled-hover`'s PASS excludes `.pui-menu__item:last-child`.** The harness cannot resolve
  structural pseudo-classes without a DOM. That rule is identical in both versions here, but the
  PASS says nothing about it — do not read it as coverage.
- **Still zero browser verification, ever.** Every parity claim in this repo rests on source reading,
  CSS-cascade computation and jsdom. jsdom does no hit testing and no checker inspects `:hover`, so
  a change to hover or pointer-events behaviour would leave all three Verify stages green. This is
  decision 4 and it is the single largest gap in the evidence base.
- **The stale-base restore is still unfixed after 60+ rounds** and survived three day rollovers.
  Every round must keep restoring, and a round that skips it can silently drop a file — that is how
  `docs/design-parity.md` was lost.
