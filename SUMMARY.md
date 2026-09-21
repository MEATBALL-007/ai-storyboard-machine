# Round `2026-09-22_0007` — no-op (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again (the 130-somethingth consecutive round), so the tree arrived without
  `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs` and every token/radius/font change.
  Selected the tip **date-major** with `git for-each-ref --sort=-committerdate`, dropped my own
  refname first, and restored `9f028b6` (`…/2026-09-21_0037`) as its own commit.
- **Ran the five owner-answer channels. No answer on any of the eight open decisions.**
  So per the pinned `## Next task`, this is a deliberate no-op round: I did not invent
  substitute work.
- **Ran the full Verify command (three stages) — green.**
- **Ran all five parity-harness keys with the pinned refs — every number matches the
  established table**, including the one key that is *supposed* to fail.
- **Measured the branch-ranking A/B live. It came up TAILS**, exactly as `_0037`'s conditional
  forecast said it would, and the wrong formula would have silently discarded two rounds.

## Why

- **The restore comes before any Read.** A stale tree here does not look broken — it looks
  *finished* (the app's `:root` really is byte-identical to `tokens.css` on `3503537`), which is
  how round `2026-08-28_0004` burned a whole round concluding the token task was already done.
  `ls tools` showing only `test.mjs` is the one-call tell, and I ran `git log --oneline -5` as
  the first action of the round.
- **Tree-sha identity instead of a residual diff.** `git diff` is permission-blocked here anyway,
  but the identity check is also strictly stronger: `git rev-parse HEAD^{tree}` =
  `git rev-parse 9f028b6^{tree}` = `82f577dcb2bb23a8ece81879aa669ff318134149` proves equality on
  **every path at once**, and it closes the blind spot of `git checkout <sha> -- .` (which cannot
  delete a file that should be gone). An empty `--stat` only proves the rows that printed matched.
- **I did not answer any of the eight decisions myself.** Every remaining item on the acceptance
  criteria — chip padding (decision 2), segmented padding (5), input sizes (6), the
  `:disabled:hover` cascade leaks (7) — moves pixels a human will see, and no checker in this repo
  looks at `:hover` (jsdom does no hit testing either). A round that "just tries it" would stay
  green through all three Verify stages while changing the product.

## Verification

**Verify command — all three stages, run individually (the Bash tool rejects some `&&` chains):**

```
node tools/test.mjs              → 54 passed, 0 failed
node tools/check-tokens.mjs      → 6/6 checks pass:
    tokens in sync: 22/22 … present and identical in index.html
    fonts in sync: 4/4 … embedded byte-identical in index.html
    no derived-colour literals: 15 CSS source(s) scanned
    font weights available: 15 CSS source(s) scanned (400, 500, 700, 800)
    no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
    typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
npm --prefix design-system test  → 12 test files passed, 31 tests passed
```

**Parity harness — all five keys, using the refs pinned at `AUTOPILOT.md:4156-4160`
(NOT guessed refs — see the trap note below):**

| key | result | detail |
|---|---|---|
| `buttons 2488f2d:index.html index.html` | **PASS** | 85 pairs / 17 elements; markup 7 old class tokens gone, 5 new |
| `segmented 021b966:index.html index.html` | **PASS** | 45 pairs / 9 elements; markup 0 gone, 3 new |
| `toast de07ea8:index.html 10e8f39:index.html` | **PASS** | 5 pairs / 1 element |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5** | 10 pairs / 2 elements, **0 markup problems, 0 unmatched** |
| `ds-disabled-hover 9f028b6:…/styles.css …/styles.css` | **PASS** | 15 pairs / 3 elements, + 1 undecidable |

- **`toast-hit`'s FAIL-5 is the correct result, not a regression.** That key exists to *show* the
  one intentional behaviour change (round `2026-08-24_0003` added `pointer-events:auto` to
  `.toast-act` to fix the dead Undo button). I checked it row by row with `grep "✗"` rather than
  trusting the count: **all five rows are `#toastUndo`** (`(base)` / `:hover` / `:disabled` /
  `:disabled:hover` / `:focus`) and **not one row is `#toast`** — which is the evidence that
  `#toast`'s own `pointer-events:none` was never removed. The single printed delta is
  `before: (unset) <- -` / `after: auto <- .toast-act`.
- **`ds-disabled-hover`'s 1 undecidable rule** is `.pui-menu__item:last-child`, unreadable because
  the harness deliberately does not model a DOM tree, so structural pseudos cannot match. The PASS
  says nothing about that rule; it is unchanged in both versions.

**Five owner-answer channels — nothing answered, all 8 decisions still open:**

1. tree identity matches (above)
2. `grep -c "^### [1-8]\." README.md` → **8**; `grep -c "If you answer:" README.md` → **8**
   (8 headings, 8 unused answer slots — note this counter reads 8 because round `2026-08-31_0023`
   *added* decision 8 itself, not because an owner replied)
3. `git ls-files | grep -i jspdf` → empty (no vendored jsPDF, so the last CDN reference still
   cannot be inlined)
4. `git status --untracked-files=all --short` → empty
5. non-`auto/*` refs unmoved: `design-system` = `3503537` (2026-08-13), `main` / `origin/main` /
   `mac/main` = `ef3220e` (2026-06-27), `mac` / `mac/design-system` = `e3a355c`,
   `mac/hardening-pass` / `origin/hardening-pass` = `592e7c3` (2026-07-20)

**Branch-ranking A/B — measured live, and it fired: TAILS.**

After dropping my own refname, the newest date `2026-09-21` held **four** tips, so the sha
tiebreak was live and this is a real measurement, not a masked one:

```
--sort=-committerdate (correct)          %(committerdate:short) + sha | sort -r (the trap)
9f028b6  _0037  00:42:40  ✓ real tip     f33211e  _0017   ✗ three rounds stale
92d9038  _0027  00:35:11                 b857b8e  _0005
f33211e  _0017  00:22:59                 9f028b6  _0037   ← real tip sunk to row 3
b857b8e  _0005  00:15:21                 92d9038  _0027
```

The two forms **disagree at row 1**. Blast radius of the wrong formula this round: it restores
`_0017` and silently discards **both `_0027` and `_0037`** — and both hold real content
(`git log --oneline -3 9f028b6` shows `9f028b6 docs:` sitting above `68bf84a chore: restore…`).

- `_0037`'s conditional forecast was **correct**: it wrote *"tails iff the closing sha sorts below
  `f33211e`"*, and it closed at `9f028b6` — `'9' < 'f'` → tails, at its stated ≈95.00% point.
- **Cumulative record of the wrong formula: tails 33 of 51** (excluding the 4 structural-heads
  rounds: **33 of 47**).

## What I did NOT do

- **Nothing on the acceptance criteria.** All remaining work is gated on owner decisions 1–8 and
  the fallback work is exhausted (token tooling closed at 22/22 tokens under 6 checks, parity
  table closed at 11/11 components). Per hard rule 5, inventing a substitute task is worse than a
  clean no-op.
- **Did not touch `Button.css`, `Menu.css`, or `index.html`'s `<style>`.** Decision 7's two real
  cascade leaks (`#tourBack`'s Back button staying bright while disabled; `.menu-pop
  button.danger:hover` beating the app's own `:disabled:hover` guard at identical `(0,3,1)`
  specificity) are genuine bugs, but fixing them changes colours a user sees.
- **Did not add a 7th token check.** Every one of the 22 tokens already has a checker; there is
  nothing left to enforce.
- **Did not open a browser.** Decision 4 (permission for Playwright / Chrome-DevTools MCP) is
  still unanswered; both were confirmed permission-blocked in `2026-08-21`, so retrying is a
  wasted round, not a missing capability.
- **Did not append a status block to `AUTOPILOT.md`.** Per the `_0035`/`_0041` convention, a
  no-op round edits only the `## Next task` forecast block — the file is already 4,224 lines, and
  its size *is* why `## Next task` reaches the agent empty in the prompt.

## Risk

- 🔴 **The stale-base restore is the highest-risk step of every round, and it is invisible to
  every check.** A docs-only round restored from the wrong tip leaves an empty residual, five
  matching harness keys and three green Verify stages. The only defence is selecting the tip
  **before** `git checkout` and doing it date-major. Reviewers should confirm this round's restore
  parent is `9f028b6`, not `f33211e`.
- 🟨 **Next round is MASKED — do not count it in the statistic and do not run the A/B.** At the
  next round's selection time, `2026-09-22` will hold exactly one tip (mine), so the date field
  settles row 1 before the sha is ever consulted and the two formulas agree *by construction*.
  Agreement there proves nothing about the trap. Keep using `--sort=-committerdate`.
- 🟨 **`toast-hit` reporting `FAIL` is expected and permanent.** A reviewer skimming for green
  will misread it. It is not in the Verify command for exactly that reason — the harness is a
  round tool, not a checker that must stay green.
- 🟨 **`tools/check-tokens.mjs` blanks `<script>` before scanning**, so the `.toast-act` rule is
  the one token reference in the repo no checker sees. That is deliberate (the canvas drawing code
  legitimately contains `#111` and `#FA4616` literals that `ctx.fillStyle` needs), but it is a
  real coverage hole worth knowing about.
- ⚪ **Nothing in this round changes a single byte of application or library CSS.** The round's
  diff is `SUMMARY.md` + the `## Next task` block of `AUTOPILOT.md`, on top of a restore commit
  whose tree is provably identical to `9f028b6`'s.
