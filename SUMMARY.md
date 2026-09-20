# Round `2026-09-21_0017` — no-op round (blocked on owner decisions); mask forecast resolved by construction

## What I did

- **Restored the previous round's work.** The runner cut this branch from `3503537` (the round-1
  contract) again, so the tree arrived ~5 weeks stale — `ls tools docs` showed only `test.mjs` and
  `superpowers/`, i.e. neither `tools/check-tokens.mjs` nor `docs/btn-parity-proof.mjs` existed.
  Selected the tip **date-major** from `git for-each-ref --sort=-committerdate`, taken *before* any
  `checkout` (so my own branch still sat at `3503537`/`2026-08-13` and sank on its own — no manual
  filtering): row 1 after dropping my own refname is `b857b8e` = `auto/…/2026-09-21_0005`.
  Confirmed it holds real work (`git log --oneline -3` → a `docs:` commit above
  `8412eb5 chore: restore…`), not an empty restore-only tip.
- **Checked all 5 owner channels — no answer on any of the 8 open decisions.** Details below.
- **Ran the full Verify (3 stages) and all 5 harness keys** — every value matches the recorded table
  in `AUTOPILOT.md`, including `toast-hit`'s intentional `FAIL — 5`.
- **Resolved `_0005`'s forecast (case ก): this round is MASKED — structural heads, risk 0%.**
  After dropping my own refname, the newest `committerdate:short` is `2026-09-21`, holding
  **exactly one** tip (`b857b8e`). The date field settles row 1 before the sha is ever consulted,
  so both formulas necessarily agree. Per the mask rule `_0005` wrote, that is **not a measurement**
  and must not move the statistic. I therefore deliberately did **not** run the A/B.
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
  `git rev-parse HEAD^{tree}` = `git rev-parse b857b8e^{tree}` = `43ba9cdf087e05f4…`. Identical tree
  objects prove the snapshot matches on **every path at once**, which also closes
  `git checkout -- .`'s known blind spot (it cannot delete files): had any path been left over or
  missing, the tree shas could not match. An empty `--stat` only proves the rows that printed
  matched, and `git diff` is permission-blocked here anyway.
- **I did not run the sha-first/date-major A/B this round, on purpose.** On a single-tip day the
  two forms are indistinguishable, so their agreement proves nothing — and reading that agreement
  as "the trap retired" is the specific mistake that cost round `2026-09-02_0022` part of its round.

## Verification

Verify command, all three stages green:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → all 6 checks pass over 15 CSS sources:
    tokens in sync 22/22 · fonts in sync 4/4 (byte-identical)
    no derived-colour literals · font weights ∈ {400,500,700,800}
    every border-radius reads a --r-* token · every font-family reads var(--mono)
npm --prefix design-system test → 12 test files, 31 passed
```

Parity harness, all 5 keys, with the `after` sides pinned exactly as `AUTOPILOT.md` records them:

| key | result |
|---|---|
| `buttons 2488f2d:index.html 9fab5c9:index.html` | **PASS** — 85 pairs / 17 elements; markup coverage OK, 7 old class tokens gone, 5 new class attributes |
| `segmented 021b966:index.html index.html` | **PASS** — 45 pairs / 9 elements; markup coverage OK, 0 gone / 3 new |
| `toast bb10dd9:index.html 3d3d5cc:index.html` | **PASS** — 5 pairs / 1 element |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 0 markup problems, 0 unmatched — *this is the correct result* |
| `ds-disabled-hover b857b8e:…/styles.css …/styles.css` | **PASS** + 1 undecidable rule (`.pui-menu__item:last-child`) |

`toast-hit`'s FAIL is the expected outcome, not a regression: round `2026-08-24_0003` intentionally
added `pointer-events:auto` to `.toast-act`. I checked the failing rows individually rather than
trusting the verdict line — **all 5 `✗` rows are `#toastUndo`** (`(base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`) and **not one is `#toast`**, which is the evidence that `#toast`'s
`pointer-events:none` is still in place.

Five owner channels (all negative):

1. **Tree identity** `HEAD^{tree}` == `b857b8e^{tree}` == `43ba9cdf087e05f4…` → byte-equal on every path.
2. `grep -c '| Option | Cost |' README.md` = **8** and `grep -c 'If you answer:' README.md` = **8** —
   the two counters agree, so no decision has been answered.
3. `git ls-files | grep -i jspdf` → **empty**; jsPDF still not vendored, so the last CDN reference
   cannot be inlined.
4. `git status --untracked-files=all --short` → **empty**; no files dropped in by the owner.
5. Non-`auto/*` refs unmoved: `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c`; `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3`
   (both 2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

## What I did NOT do

- **No work on any acceptance criterion.** The three remaining CSS deltas (chip `padding`,
  segmented `padding`, input sizes) and the two `:hover`-leak bugs are owner decisions 2, 5, 6 and 7.
  Every one of them moves visible pixels, so an agent choosing for the owner is out of scope.
- **Did not run the A/B between the correct and trap tip-selection formulas** — see Why. Agreement
  on a single-tip day is a property of the date field, not evidence about the trap.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP were both permission-blocked in
  earlier rounds (this is a permission wall, not a missing display), and decision 4 has not been
  granted. So criterion 3 still has never been verified against a real renderer.
- **Did not add a 7th check to `check-tokens.mjs`.** All 22 tokens already have coverage; the
  contract states token tooling is finished and a 7th check would have nothing left to enforce.
- **Did not append a `> **สถานะล่าสุด …` status block to `AUTOPILOT.md`**, following the `_0035`
  convention — the file is already 4,099 lines, and its size is precisely why `## Next task`
  reaches the agent empty in the prompt. Only the `## Next task` block was edited.

## Risk

- 🔴 **The stale-base bug is still unfixed after 92+ rounds and remains this project's dominant
  risk.** Nothing has ever merged to `main` (still `ef3220e`, 2 commits, no design-system), so
  ~170 `auto/*` branches now stack in parallel. Every round's real work survives only because each
  round restores its predecessor by hand. A reviewer should treat this as the finding, not the
  CSS work.
- 🔴 **Next round the tip-selection tiebreak FIRES for real — it is not masked.** `2026-09-21`
  will hold ≥2 tips (`b857b8e` plus this round's), so the sha becomes the tiebreak and the
  comparand is **`b857b8e`** (leading `b`). A wrong restore here is **invisible to every check
  this repo has**: the discarded round would be docs-only, so the residual is empty, all five
  harness keys still match and all three Verify stages stay green. The next round must select
  date-major (`--sort=-committerdate`) *before* its `checkout`.
- ⚠️ **`toast-hit` is a FAIL by design, and that is fragile knowledge.** A future round that reads
  only the verdict line could mistake it for a regression and "fix" it by reverting a real bug fix.
  The per-row check above (all 5 rows `#toastUndo`, zero `#toast`) is the discriminator to re-run.
- ⚠️ **`ds-disabled-hover`'s PASS says nothing about `.pui-menu__item:last-child`** — the harness
  cannot read structural pseudo-classes, so a change confined to that rule computes 0 diff. It must
  be read by hand.
- ⚠️ **This round moved nothing that could break, which is itself worth stating plainly:** the only
  non-doc file touched is the restore commit, whose tree is proven identical to the tip it restored.
  If a reviewer wants to check one thing, check that `git rev-parse` pair.
