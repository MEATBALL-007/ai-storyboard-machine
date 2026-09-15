# Round 2026-09-16_0020 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again (73 tracked files, `tools/` holding only `test.mjs` — the one-call tell).
  Selected the real tip with `git for-each-ref --sort=-committerdate` → `a14011f`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-16_0010`, `2026-09-16 00:18:15`), restored it
  with `git checkout a14011f -- .` and committed it separately (`c6ae478`) so this round's own
  diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered,
  so the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its
  documented expected result (details under Verification).
- **Updated `## Next task` in `AUTOPILOT.md` only** — resolved `_0010`'s forecast (HEADS, by
  construction) and wrote the next round's forecast (~63.0% tails, comparand `a14011f`).
  Per the convention started in `_0035`/`_0041`, a no-op round does **not** append a status
  block; it edits the forecast block alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* —
  on `3503537` the app's `:root` really is byte-identical to `tokens.css`, which is how round
  `2026-08-28_0004` wasted a full round concluding the token work was finished. So the first
  action was `git log --oneline`, not a Read.
- **Tree-SHA identity instead of a residual diff.** `git diff` is permission-blocked here, and
  it is the weaker check anyway: an empty diff only proves the rows that printed matched, while
  `git rev-parse HEAD^{tree}` == `git rev-parse a14011f^{tree}` proves the snapshot agrees on
  *every path at once*. Both printed `cff49758a4a3ec9d0c43d79f521a48806bcfc3dd`.
- **Deliberately did NOT re-run the `:short` vs `--sort=-committerdate` A/B.** `2026-09-16` held
  exactly one tip at selection time, so the two formulas are indistinguishable and their
  agreement would prove nothing. Cross-checked with a **date-major** refname read instead
  (newest date holding a tip = `2026-09-16`; highest round number on that date = `_0010`).
- **Ran the ranking call before the restore commit**, so this branch still sat at `3503537`
  (dated `2026-08-13`) and sank to the bottom by itself — no manual `grep -v` filtering, which
  is what weakened the evidence in `_0035` and `_0010`.

## Verification

Verify command — **all three stages green**:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 sources)
                               · font weights all in {400,500,700,800} · every border-radius reads
                               --r-* · every font-family reads var(--mono)
npm --prefix design-system test → 12 test files, 31 passed (vitest 2.1.9)
```

Parity harness — all five keys, each matching its documented expectation:

| key | before → after | result |
|---|---|---|
| `buttons` | `2488f2d:index.html` → `index.html` | PASS |
| `segmented` | `021b966:index.html` → `index.html` | PASS |
| `toast` | `de07ea8:index.html` → `10e8f39:index.html` | PASS |
| `toast-hit` | `3d3d5cc:index.html` → `index.html` | `FAIL — 5 declaration(s) differ` ← **expected** |
| `ds-disabled-hover` | `a14011f:…/styles.css` → `…/styles.css` | PASS (+1 undecidable rule) |

`toast-hit` failing is the **correct** outcome — it pins the deliberate 2026-08-24
`pointer-events:auto` fix. I read all five `✗` rows rather than grepping (`grep -c "✗ #toast:"`
has a known blind spot: the base-state row prints `✗ #toast (base)`, no colon). All five rows
were `#toastUndo` — `(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — and `#toast`
showed **no diff at all**, which is the evidence its `pointer-events:none` is still in place.

Five channels, all negative:

1. `README.md → ## Open decisions` — `grep -c "| Option | Cost |"` = **8**,
   `grep -c "If you answer:"` = **8**. Both counters agree; the two disagreeing is itself the
   signal that someone answered.
2. No `jspdf` file — neither tracked (`git ls-files | grep -i jspdf`) nor at the repo root.
3. `main` still `ef3220e` (2026-06-27), unmoved.
4. `git status --untracked-files=all` — empty.
5. No non-`auto/*` ref newer than 2026-08-13 (`design-system` `3503537` 2026-08-13; `mac` /
   `hardening-pass` 2026-07-20; every `main` copy `ef3220e`).

## What I did NOT do

- **Did not answer any open decision.** All eight still need a person: jsPDF vendoring (1),
  chip padding (2), spacing/type scale (3), browser verification (4), segmented padding (5),
  input sizes (6), `:disabled:hover` cascade repair (7), `docs/design-parity.md` (8). Each moves
  pixels or adds a file, so each is the owner's call, not an agent's.
- **Did not invent substitute work.** Fallback work has been exhausted since round `_0102`:
  token tooling is 22/22 across six checks, the parity table is closed at 11/11, and the harness
  already reports its own undecidable selectors. Did not touch the explicitly-forbidden list
  either (`:last-child`/combinator matching, adding the harness to Verify, applying decisions
  2/5/6/7 unilaterally).
- **Did not re-run the `:short` A/B** — see Why. On a single-tip day it is not a measurement.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools MCP are *permission*-blocked,
  not merely headless; retrying needs a permission change, not another round.

## Risk

- **The silent-restore bug is one round from firing again, at ~63.0%.** After this round closes,
  `2026-09-16` holds two tips tied at day granularity, so a ranking that falls through to the
  SHA must beat comparand `a14011f` (leading `a`). If it fires, it restores `a14011f` and
  discards this entire round — **and it is undetectable**: the code tree would be byte-identical,
  so the residual is empty, all five harness keys still match and all three Verify stages stay
  green. The next round must use `--sort=-committerdate`, never `| sort -r`, and never a row
  number.
- **`_0010`'s HEADS was structural, not a fix.** A reviewer seeing two consecutive formulas agree
  should not read the bug as retired — the mask of a single-tip day lasts exactly one round,
  every time, and has for 90+ rounds.
- **`ds-disabled-hover` PASSed but explicitly disclaims one rule** (`.pui-menu__item`,
  `.pui-menu__item--danger`): a change confined to it computes 0 diff, so the harness says
  nothing about it. That rule is precisely the subject of open decision 7 — do not read this
  PASS as evidence the `:disabled:hover` cascade bug is absent.
- **Still never verified in a real browser** (criterion 3). All parity reasoning is from source
  plus CSS spec. No checker looks at `:hover`, and jsdom does no hit testing, so a round that
  quietly changed hover behaviour would keep Verify fully green.
- **The stall is now 4+ weeks old and has crossed a month boundary**, across 100+ rounds cut from
  the same stale base. It will not clear on its own; it needs a person, not another round.
