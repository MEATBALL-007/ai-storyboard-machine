# Round `2026-09-22_0017` — no-op (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` yet again, so the tree arrived without `tools/check-tokens.mjs`,
  `docs/btn-parity-proof.mjs` and every token/radius/font change. Selected the tip
  **date-major** with `git for-each-ref --sort=-committerdate`, dropped my own refname first,
  and restored `7b6829f` (`…/2026-09-22_0007`) as its own commit.
- **Ran the five owner-answer channels. No answer on any of the eight open decisions.**
  So per the pinned `## Next task`, this is a deliberate no-op round: I did not invent
  substitute work.
- **Ran the full Verify command (three stages) — green.**
- **Ran all five parity-harness keys with the pinned refs — every number matches the
  established table**, including the one key that is *supposed* to fail.
- **Did NOT run the branch-ranking A/B — this round is structurally masked**, exactly as
  `_0007` forecast. I also found and documented a *second*, conflicting set of pinned harness
  commands in `AUTOPILOT.md` that has strictly weaker detection power.

## Why

- **The restore comes before any Read.** A stale tree here does not look broken — it looks
  *finished*, which is how round `2026-08-28_0004` burned a whole round concluding the token
  task was already done. `ls` showing no `SUMMARY.md` and `tools/` without `check-tokens.mjs`
  is the one-call tell; `git log --oneline -5` was the first action of the round.
- **Tree-sha identity instead of a residual diff.** `git rev-parse HEAD^{tree}` =
  `git rev-parse 7b6829f^{tree}` = `3ea827df2a2d92e01d3ddba9beefbd3834317c4e` proves equality
  on **every path at once**, and it closes the blind spot of `git checkout <sha> -- .`, which
  cannot delete a file that should be gone. An empty `--stat` only proves the rows that printed.
- **I did not run the A/B, and that is the correct action, not laziness.** After dropping my own
  refname the newest remaining date (`2026-09-22`) holds exactly **one** tip, so the date field
  settles row 1 before any sha is consulted and both formulas agree *by construction*. Agreement
  there is not evidence the trap is gone — misreading that cost round `2026-09-02_0022`.
- **I did not answer any of the eight decisions myself.** Every remaining acceptance-criteria
  item — chip padding (decision 2), segmented padding (5), input sizes (6), the
  `:disabled:hover` cascade leaks (7) — moves pixels a human will see, and no checker in this
  repo looks at `:hover` (jsdom does no hit testing either). A round that "just tries it" would
  stay green through all three Verify stages while changing the product.

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

**Parity harness — all five keys, using the refs pinned in the `2026-09-02_0002` block:**

| key | result | detail |
|---|---|---|
| `buttons 2488f2d:index.html index.html` | **PASS** | 85 pairs / 17 elements; markup 7 old class tokens gone, 5 new |
| `segmented 021b966:index.html index.html` | **PASS** | 45 pairs / 9 elements; markup 0 gone, 3 new |
| `toast de07ea8:index.html 10e8f39:index.html` | **PASS** | 5 pairs / 1 element; markup 0 gone, 1 new |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5** | 10 pairs / 2 elements, **0 markup problems, 0 unmatched** |
| `ds-disabled-hover 7b6829f:…/styles.css …/styles.css` | **PASS** | 15 pairs / 3 elements, + 1 undecidable |

- **`toast-hit`'s FAIL-5 is the correct result, not a regression.** That key exists to *show* the
  one intentional behaviour change (round `2026-08-24_0003` added `pointer-events:auto` to
  `.toast-act` to fix the dead Undo button). I read all five `✗` rows rather than trusting the
  count: **all five are `#toastUndo`** (`(base)` / `:hover` / `:disabled` / `:disabled:hover` /
  `:focus`) and **not one row is `#toast`** — which is the evidence that `#toast`'s own
  `pointer-events:none` was never removed. The single printed delta is
  `before: (unset) <- -` / `after: auto <- .toast-act`.
- **`ds-disabled-hover`'s 1 undecidable rule** is `.pui-menu__item:last-child`, unreadable because
  the harness deliberately does not model a DOM tree, so structural pseudos cannot match. The PASS
  says nothing about that rule; it is unchanged in both versions.

**Five owner-answer channels — nothing answered, all 8 decisions still open:**

1. tree identity matches (above)
2. `grep -c "^### [1-8]\." README.md` → **8**; `grep -c "If you answer:" README.md` → **8**
   (8 headings, 8 unused answer slots)
3. `git ls-files | grep -i jspdf` → empty (no vendored jsPDF, so the last CDN reference still
   cannot be inlined)
4. `git status --untracked-files=all --short` → empty
5. non-`auto/*` refs unmoved: `design-system` = `3503537`, `main` / `origin/main` / `mac/main` =
   `ef3220e`, `mac` / `mac/design-system` = `e3a355c`, `mac/hardening-pass` /
   `origin/hardening-pass` = `592e7c3`
   (precondition also holds: local **and** `origin/` of `_0007` both point at `7b6829f`, so
   restoring from that sha overwrites nothing the owner pushed)

**Branch-ranking A/B — deliberately NOT run. This round is structurally masked.**

After dropping my own refname, the newest date `2026-09-22` held exactly **one** tip (`7b6829f`
`_0007`). With one tip on the winning date, the date field decides row 1 before the sha tiebreak
is ever reached, so the correct and the trap formula agree *by construction*. Per the pinned
instruction I ran no A/B and moved no number: the statistic stays at **tails 33 of 51**
(excluding the 4 structural-heads rounds: **33 of 47**). `_0007`'s forecast of a masked round
was correct in every particular.

**New finding — a second, conflicting set of pinned harness commands.**

`AUTOPILOT.md` contains **two** blocks of "the correct harness arguments", and their refs differ:

```
📌 (2026-09-19_0013):  buttons 2488f2d:index.html 9fab5c9:index.html
                       toast   bb10dd9:index.html 3d3d5cc:index.html
🔴 (2026-09-02_0002):  buttons 2488f2d:index.html index.html          ← the set actually in use
                       toast   de07ea8:index.html 10e8f39:index.html
```

I ran the `📌` variants too: they print **identical numbers** (`buttons` 85/17 markup 7/5 PASS;
`toast` 5/1 markup 0/1 PASS). So output alone cannot tell a round which set it used. The real
difference is detection power: `📌`'s `buttons` pins its *after* side to `9fab5c9`, so it never
reads the live `index.html` and would stay PASS even if someone regressed the buttons today.
Recorded this in the contract with the reasoning, so a future round picks the right set for the
right reason rather than by matching numbers.

## What I did NOT do

- **Nothing on the acceptance criteria.** All remaining work is gated on owner decisions 1–8 and
  the fallback work is exhausted (token tooling closed at 22/22 tokens under 6 checks, parity
  table closed at 11/11 components). Per hard rule 5, inventing a substitute task is worse than a
  clean no-op.
- **Did not touch `Button.css`, `Menu.css`, or `index.html`'s `<style>`.** Decision 7's two real
  cascade leaks (`#tourBack`'s Back button staying bright while disabled; `.menu-pop
  button.danger:hover` beating the app's own `:disabled:hover` guard at identical `(0,3,1)`
  specificity) are genuine bugs, but fixing them changes colours a user sees.
- **Did not delete or "fix" the conflicting `📌` command block.** Removing an instruction block
  from the contract is an owner call, and both sets are green today; I documented the difference
  instead.
- **Did not add a 7th token check.** Every one of the 22 tokens already has a checker.
- **Did not open a browser.** Decision 4 (permission for Playwright / Chrome-DevTools MCP) is
  still unanswered; both were confirmed permission-blocked in `2026-08-21`, so retrying is a
  wasted round, not a missing capability.

## Risk

- 🔴 **The stale-base restore is the highest-risk step of every round, and it is invisible to
  every check.** A docs-only round restored from the wrong tip leaves an empty residual, five
  matching harness keys and three green Verify stages. The only defence is selecting the tip
  **before** `git checkout` and doing it date-major. Reviewers should confirm this round's
  restore parent is `7b6829f`.
- 🟨 **Next round is a REAL measurement — run the A/B and move the statistic.** At the next
  round's selection time `2026-09-22` will hold **two** tips (`7b6829f` and mine), so the
  tiebreak fires for real. The comparand *resets downward* from `f33211e` to `7b6829f`, putting
  `P(tails) ≈ 48.21%` — the most discriminating measurement in dozens of rounds. The older
  warning that "tails is now the normal outcome" applied only to the high-comparand era.
- 🟨 **Every line-number reference inside `AUTOPILOT.md` is now stale.** This round inserted
  ~55 lines near `:402`, shifting everything below. The previously pinned `:4062`, `:4066-4070`,
  `:4118-4125`, `:4156-4160` all point at the wrong text now. Future rounds must `Grep` for the
  block, not copy a line number. I wrote that rule into the contract.
- 🟨 **`toast-hit` reporting `FAIL` is expected and permanent.** A reviewer skimming for green
  will misread it. It is not in the Verify command for exactly that reason.
- 🟨 **`tools/check-tokens.mjs` blanks `<script>` before scanning**, so the `.toast-act` rule is
  the one token reference in the repo no checker sees. Deliberate (the canvas code legitimately
  needs `#111` / `#FA4616` literals for `ctx.fillStyle`), but a real coverage hole.
- ⚪ **Nothing in this round changes a single byte of application or library CSS.** The round's
  diff is `SUMMARY.md` + the `## Next task` block of `AUTOPILOT.md`, on top of a restore commit
  whose tree is provably identical to `7b6829f`'s.
