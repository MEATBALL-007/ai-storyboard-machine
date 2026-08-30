# Round 2026-08-31_0023 — retrospective restore audit

The audit that had been queued and deferred for six consecutive rounds. Read-only over git
history; no CSS, `tools/`, `docs/` or `index.html` was touched.

## What I did

- **Restored the previous round's tip** (`af85891`, branch `…/2026-08-31_0014`) onto this
  branch, which the runner had cut from the stale base `3503537` for the 40th time. Kept as its
  own commit (`e9f502a`) so this round's real diff stays readable.
- **Audited all 72 `auto/deep_dive*` round branches** for whether each one restored the correct
  predecessor tip. Result: **every restore that was performed was correct**, but **10 rounds
  performed no restore at all**, and one of those permanently dropped a file.
- **Found the one real loss:** `docs/design-parity.md` (44,376 bytes, 535 lines) disappeared at
  round `2026-08-19_0022` and has never come back. It is absent from `HEAD` today.
- **Wrote it up as open decision 8 in `README.md`** with three options (restore / restore and
  reconcile / let it go) — per the task's instruction not to repair anything this round, because
  putting a 13-day-stale document back into the tree is a content decision.
- Left `AUTOPILOT.md`'s Next task pointing at the no-op cycle, since the audit is now closed.

## The audit table

Method: a correct restore reproduces its predecessor's tree exactly, so the test is
`tree(restore commit of Bₙ) == tree(tip of Bₙ₋₁)`, with Bₙ₋₁ the previous branch by **real
committer time** (`git for-each-ref --sort=-committerdate`, full precision — not the truncated
`:short` key that has misranked tips in four separate rounds).

| Class | Rounds | Verdict |
|---|---|---|
| Exact restore — tree sha identical to predecessor tip | 58 | ✅ correct |
| Deliberate multi-branch consolidation (tree ≠ any single tip, by design) | 2 | ✅ correct, superset |
| Partial restore — predecessor tip minus `SUMMARY.md` | 1 | ✅ benign |
| No restore commit at all | 10 | 🔴 **9 harmless, 1 lost a file** |
| First round in the history — nothing to restore | 1 | n/a |
| **Total branches** | **72** | |

**The 10 rounds that skipped the restore** (each cut from `3503537`, each committing straight
onto the bare base):

| Round | Predecessor tip it dropped | Consequence |
|---|---|---|
| `2026-08-14_0008` | `5bbdaa5` | recovered later; nothing missing from `HEAD` |
| `2026-08-14_0023` | `75c38ae` | recovered later |
| `2026-08-15_0003` | `972502b` | recovered by the 4-branch consolidation in `_0013` |
| `2026-08-16_0014` | `c5696cf` | recovered by `_0025`/`_0048` consolidations |
| **`2026-08-19_0022`** | **`c3351fc`** | 🔴 **`docs/design-parity.md` lost permanently** |
| `2026-08-20_0004` | `395016d` | nothing missing |
| `2026-08-20_0014` | `8fc453c` | nothing missing |
| `2026-08-20_0025` | `b8eee55` | nothing missing |
| `2026-08-20_0036` | `6417c3a` | nothing missing |
| `2026-08-21_0002` | `8ea5d63` | nothing missing |

**The 3 restore-type commits whose tree did not match a single predecessor tip** — all three
checked by hand and all three benign:

| Round | Commit | Difference vs. predecessor tip | Reading |
|---|---|---|---|
| `2026-08-15_0013` | `0fc934e` | `+docs/design-parity.md` (490), `−SUMMARY.md`, edits to 3 files | consolidated **four** siblings on purpose; a superset, not a mis-pick |
| `2026-08-16_0025` | `f951277` | `+docs/design-parity.md` (510), `+tools/test.mjs` (111), `+tokens.css` | consolidated rounds `_0002`+`_0014`; superset |
| `2026-08-21_0012` | `b6c9d03` | `−SUMMARY.md` only (101 lines) | restored everything except the file every round overwrites anyway |

## Why the loss is exactly one file, and how that is proven

Not by spot-checking. Every path the entire 72-branch history has ever touched:

```
git log --all --format= --name-only ^3503537 | sort -u    -> 21 paths
git ls-files                                              -> 79 paths
```

All 21 appear in `HEAD` **except `docs/design-parity.md`**. That is exhaustive, not a sample.
Per-tip confirmation with `git diff --diff-filter=D --name-only <tip> HEAD` over all 13 dropped
tips returns empty for every one except the three that still carried the parity report
(`972502b`, `c5696cf`, `c3351fc`), each of which names that single file.

**How it happened** is the failure mode this project has documented but never caught in the act:
round `2026-08-19_0022` read the stale base, concluded the work was already done — its only
commit is literally *"docs: correct plan — token task already done"* — and committed that on top
of `3503537`. On the stale tree that conclusion is internally consistent, which is precisely why
nothing downstream flagged it. Every later round then inherited a tree without the file.

## Verification

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                   font weights ok · no radius literals · one typeface source
                                   (15 CSS sources scanned per check)
npm --prefix design-system test -> Test Files 12 passed (12) / Tests 31 passed (31)
```

Parity harness, all five keys, values identical to the previous round — this is the independent
check that the restore was complete, since the harness recomputes each element's cascade-winning
declaration set from the files actually standing rather than comparing bytes:

```
buttons            2488f2d:index.html 9fab5c9:index.html -> PASS
segmented          021b966:index.html index.html         -> PASS
toast              bb10dd9:index.html 10e8f39:index.html -> PASS
ds-disabled-hover  HEAD:design-system/src/styles.css design-system/src/styles.css
                                                         -> PASS, 1 undecidable rule (unchanged)
toast-hit          3d3d5cc:index.html index.html         -> FAIL - 5 declaration(s) differ,
                                                            0 markup problems, 0 unmatched;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change in round
`2026-08-24_0003`; the absence of any `✗ #toast` line proves the app side was not touched.

Restore correctness for **this** round, additionally: `tree(e9f502a)` = `tree(af85891)` = `fb13d0f`
— tree-object identity, which is stronger than an empty `git diff`.

Five channels checked for an owner answer, none found (15th consecutive no-answer round):
`README.md` still has 8/8 decisions open (`| Option | Cost |` = 8, `^### [1-8]\.` = 8,
`If you answer:` = 8, now including the one this round added); inline grep for
`answer|decided|chose|we pick` returns only the existing prompt text; the restored tip's author is
`PHANTOM AUTOPILOT <autopilot@phantom.local>`, i.e. the runner and not the owner; non-`auto/*`
refs are all unchanged and old (`design-system` `3503537` 2026-08-13, `mac`/`mac/design-system`
`e3a355c` 2026-07-20, `hardening-pass` `592e7c3` origin+mac only, `main` `ef3220e` 2026-06-27).

## What I did NOT do

- **Did not restore `docs/design-parity.md`.** The task block forbids repairing anything found by
  the audit, and the file is 13 days stale — it predates the radius tokens, the font inlining and
  the `.btn` refactor, so it would land contradicting `AUTOPILOT.md`. It is decision 8 now.
- **Did not answer any of the eight open decisions**, and implemented no option from any of them.
- **Did not touch CSS, `tools/`, `docs/` or `index.html`** — `git status` after the audit showed
  `M README.md` alone.
- **Did not audit content-level loss inside surviving files.** The claim proven here is
  file-level. Establishing that no *lines* were lost from `index.html` or `tools/test.mjs` is not
  decidable this way, because those files were legitimately rewritten many times since.

## Risk

- **The "nothing else was lost" claim is file-level only.** If one of the 10 skipping rounds
  dropped a paragraph or a rule from a file that still exists, this audit would not see it. I
  believe that is unlikely for the code paths — both test suites are green at their historical
  counts (54 and 31) and all six token checkers pass — but green tests are not proof, and I did
  not attempt a line-level reconstruction.
- **The two multi-branch consolidations (`0fc934e`, `f951277`) were judged benign from their
  diffstats**, which showed them adding content rather than dropping it. I did not verify that
  they picked up *every* sibling they claimed to; their commit subjects name the rounds, and I
  took the subjects at face value for the "which siblings" question only.
- **The audit's ordering depends on committer timestamps** being truthful. All 72 branches are
  siblings cut from `3503537` — `git merge-base --is-ancestor` cannot order two of them — so
  there is no structural cross-check on the sequence, only the clock and the branch names, which
  do agree with each other throughout.
- **README decision 8 asserts the report's findings survive elsewhere.** I based that on the
  11/11 element-parity table in `AUTOPILOT.md` and the README parity section both being written
  after the file vanished. I did **not** diff the 535-line report against them line by line, so
  "whatever it said that those two do not" is genuinely unknown — that is why "restore and
  reconcile" is offered as an option rather than "let it go" being recommended.
- The underlying runner bug is untouched and will re-cut the next branch from `3503537` again.
