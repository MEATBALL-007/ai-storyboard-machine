# Round `2026-09-20_0040` — no-op (no owner answer); ranking A/B measured TAILS (4th in a row)

## What I did

- **Ranked the branch tips date-major as the first command of the round, before any `checkout`.**
  `git for-each-ref --sort=-committerdate` put `2026-09-20_0030` (`8aa785d`) at row 1; the refname
  cross-check agrees (`_0030` > `_0020` > `_0010` lexically, and refname is date-major by
  construction). `git log --oneline -2` on that tip showed a real docs commit above its
  `chore: restore…`, so it is not an empty tip like `_0045` was.
- **Restored `8aa785d` into the stale base.** HEAD started at `3503537` — the commit the runner
  cuts every `auto/*` branch from, carrying the July contract with no `tools/check-tokens.mjs` and
  no `## Open decisions` in `README.md`. `git checkout 8aa785d -- .` landed as its own commit
  `faaf47d`. `git diff --name-status 3503537 8aa785d` showed 16 paths, **no deletions**, so
  `checkout -- .` is sufficient here (it cannot delete files, which is its known blind spot).
- **Ran the ranking A/B live and it FIRED — a real measurement, no mask.** `2026-09-20` held three
  tips when this round opened.
  - correct form `--sort=-committerdate` → row 1 `8aa785d` (`_0030`) ✅
  - trap form `%(committerdate:short) %(objectname:short) %(refname:short) | sort -r`
    → row 1 `c7842e2` (`_0010`) ✗ — `_0030` sank to row 2 and `_0020` to row 3 because
      `'8'` < `'c'` and `'0'` < `'c'`
  - `_0030` predicted "ก้อย" at 77.94% and got it. **Fourth consecutive correct tails call.**
    Cumulative record of the trap formula: **tails 30 of 46** (30/43 excluding the 3 structural
    heads).
- **Checked all five owner-answer channels. None has been answered** (table below).
- **Ran the full three-stage Verify and all five harness keys.** All green / all as documented.
- Updated `## Next task` in `AUTOPILOT.md` with this round's resolution and the next forecast.
  No `> **สถานะล่าสุด …` block appended, per the `_0035`/`_0041` convention.

## Why

- The contract's Next task is explicit: read `README.md → ## Open decisions` first; if nothing is
  answered, run a no-op round (restore, five channels, Verify, SUMMARY, stop) and **invent no
  substitute work**. Nothing is answered, so that is what this round is. Fallback work really is
  exhausted — token tooling is 22/22 across six checks and the component parity table closed at
  11/11 on 2026-08-23.
- The restore has to precede every `Read`. On the stale tree `README.md` has no `## Open decisions`
  section at all, so a channel-1 grep run too early returns `0` and reads as "the owner deleted the
  section" — a documented past failure mode of this loop.
- `ds-disabled-hover` is the one harness key whose before side is **the tip this round restored**
  (`8aa785d`), not a fixed sha like the other four.

## Verification

Verify command — all three stages green:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → tokens in sync: 22/22
                               fonts in sync: 4/4 byte-identical
                               no derived-colour literals: 15 CSS sources
                               font weights available: 15 CSS sources (400/500/700/800)
                               no radius literals: 15 CSS sources, every border-radius reads --r-*
                               typeface from one source: 15 CSS sources, every font-family var(--mono)
npm --prefix design-system test → 12 files, 31 passed
```

Restore integrity — tree-sha identity (proves every path at once, unlike an empty diff):

```
git rev-parse HEAD^{tree}     = ad1f154394006beeee1d440cff60634d425d744c
git rev-parse 8aa785d^{tree}  = ad1f154394006beeee1d440cff60634d425d744c   ✅ identical
```

Harness, all five keys (argument pairs copied from `AUTOPILOT.md`, not guessed):

```
node docs/btn-parity-proof.mjs buttons           2488f2d:index.html 9fab5c9:index.html   → PASS
node docs/btn-parity-proof.mjs segmented         021b966:index.html index.html          → PASS
node docs/btn-parity-proof.mjs toast             bb10dd9:index.html 3d3d5cc:index.html  → PASS
node docs/btn-parity-proof.mjs toast-hit         3d3d5cc:index.html index.html          → 5 ✗ rows
node docs/btn-parity-proof.mjs ds-disabled-hover 8aa785d:…/styles.css …/styles.css      → PASS
                                                  (+ 1 undecidable rule, which the PASS excludes)
```

`toast-hit`'s five `✗` rows are the correct, expected result — it is the key that *shows* the
deliberate `pointer-events:auto` fix, not a regression guard. Read with `grep "✗"` (never
`grep -c "✗ #toast:"`, which has a documented blind spot on the no-colon base row); all five rows
are `#toastUndo` — `(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — and **no `#toast`
row appears**, which is the proof that `#toast` still carries its `pointer-events:none`.

Five channels — no owner answer on any:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `\| Option \| Cost \|` = **8**, `If you answer:` = **8** — agree, so nothing answered |
| 2 | vendored jsPDF at repo root | absent (`git ls-files \| grep -i jspdf` = 0) |
| 3 | `main` | still `ef3220e` ("Add README", 2026-06-27) |
| 4 | uncommitted drop | `git status --untracked-files=all --short` = 0 lines |
| 5 | non-`auto/*` refs | newest is `design-system` @ 2026-08-13, older than all this work |

## What I did NOT do

- **Did not answer any of the eight open decisions.** Every one moves pixels or adds a file to the
  repo; they are the owner's call, and answering one unilaterally is explicitly forbidden.
- **Did not touch any `.css`, `.html`, `.mjs` or other product/tooling file.** This round's diff on
  top of the restore commit is `AUTOPILOT.md` + `SUMMARY.md` only.
- Did not retry the browser MCPs (Playwright / Chrome-DevTools). They are *permission*-blocked, not
  merely headless, so retrying burns a round for a known answer — that is decision 4.
- Did not re-run the retrospective restore audit or restore `docs/design-parity.md` (decision 8).

## Risk

- **The next round's coin depends on when it starts, and this round is the first to say so
  explicitly.**
  - *If the next round starts on `2026-09-20`* (e.g. `_0050`): the day then holds four tips
    (`c7842e2` `_0010`, `0779a9e` `_0020`, `8aa785d` `_0030`, this round). The comparand is the
    lexical max of the others = **`c7842e2`**, so the prior `P(tails) ≈ 77.94%`
    (`0xc7842e2 / 0x10000000`) applies **only until this round's own closing sha is known**.
    A wrong restore would discard `_0020`, `_0030` **and this round = 3 rounds**, up from 2.
  - ⚠️ **A numeric forecast written from inside the round is unsound, and this round is the first
    to hit it.** The outcome depends on this round's closing sha, but writing the forecast *is* a
    commit, so the sha moves. My first closing commit was `e5ecb8d`, which is **above** the
    comparand (`'e'` > `'c'`) — i.e. heads, the opposite of what the block had just predicted —
    so I amended it, which changes the sha again. Earlier rounds were not right; their closing
    shas simply happened to land below `c7842e2`. The forecast is now written as a **condition**
    (`tails iff closing sha < c7842e2`), and the next round must read the real sha from
    `for-each-ref` and decide for itself rather than copying the word "tails".
  - *If the next round starts on `2026-09-21`* (the usual pattern — rounds cluster just after
    midnight): the newest tip is then the only one of its date at the top, the date field settles
    row 1 before the sha is ever read, and both formulas agree. That is a **structural heads and
    must NOT be counted** in the statistic, per `_0010`'s rule.
- **A wrong restore would be undetectable by every check in this repo.** `_0020`, `_0030` and this
  round are all docs-only, so after a wrong restore the code tree is byte-identical, the residual
  is empty, all five harness keys still match and all three Verify stages stay green. The only
  defence is ranking date-major as the round's *first* command, cross-checked by refname.
- **Do not read this round's green Verify as progress.** Nothing in the product changed. The open
  acceptance criteria are blocked on decisions 1–7; no further agent work moves them. The stall is
  now 4+ weeks old and has crossed a calendar-month boundary. It needs a person.
- `toast`'s after side must stay pinned at `3d3d5cc`. Pointing it at the working tree yields
  `FAIL — 5 declaration(s) differ` that looks exactly like a regression but is the later,
  deliberate `2026-08-24` fix. Tell them apart by the harness line `after : auto <- .toast-act`.
