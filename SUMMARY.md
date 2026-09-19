# Round `2026-09-20_0030` — no-op (no owner answer); ranking A/B measured TAILS

## What I did

- **Restored the previous round's work before reading anything.** `git log --oneline -3` as the
  first call showed HEAD at `3503537` (the stale base the runner cuts every `auto/*` branch from),
  and `git ls-files | wc -l` = 73 confirmed it. Restored tip `0779a9e`
  (`…/2026-09-20_0020`) with `git checkout 0779a9e -- .` as its own commit `c615cba`.
- **Ran the branch-ranking A/B live, before the restore, and it FIRED.** This is a real
  measurement, not a masked round: `2026-09-20` held two tips when the round opened.
  - correct form `--sort=-committerdate` → row 1 `0779a9e` (`_0020`) ✅
  - trap form `%(committerdate:short) %(objectname:short) %(refname:short) | sort -r`
    → row 1 `c7842e2` (`_0010`) ✗ — the real tip sank to row 2 because `'0'` < `'c'`
  - `_0020` predicted "ก้อย" at 77.94% and got it. **Third consecutive correct tails call.**
    Cumulative record of the wrong formula: **tails 29 of 45** (29/42 excluding the 3 structural
    heads).
- **Checked all five owner-answer channels. None has been answered** (see below).
- **Ran the full Verify command and all five harness keys.** All green / all as documented.
- Updated `## Next task` in `AUTOPILOT.md` with the resolution and the next round's forecast.
  No status block appended, per the `_0035`/`_0041` convention.

## Why

- The contract's Next task says: read `README.md → ## Open decisions` first; if nothing is
  answered, do a no-op round (restore, five channels, Verify, SUMMARY, stop) and **invent no
  substitute work**. Nothing was answered, so that is what this round is. Fallback work is
  genuinely exhausted — token tooling is 22/22 across six checks and the parity table is closed
  at 11/11.
- The restore had to precede every Read. On the stale tree `tools/check-tokens.mjs` does not
  exist and `README.md` has no `## Open decisions` section at all, so a channel-1 grep run too
  early returns `0` and reads as "the owner deleted the section" — a documented past failure.
- `ds-disabled-hover` takes the tip *this round restored* (`0779a9e`) as its before side, unlike
  the four fixed-sha keys.

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
git rev-parse HEAD^{tree}     = afc4d4d571356a552180c8cd2b59b96e7543c28c
git rev-parse 0779a9e^{tree}  = afc4d4d571356a552180c8cd2b59b96e7543c28c   ✅ identical
```

Harness, all five keys (argument pairs copied from `AUTOPILOT.md`, not guessed):

```
node docs/btn-parity-proof.mjs buttons           2488f2d:index.html 9fab5c9:index.html   → PASS
node docs/btn-parity-proof.mjs segmented         021b966:index.html index.html          → PASS
node docs/btn-parity-proof.mjs toast             bb10dd9:index.html 3d3d5cc:index.html  → PASS
node docs/btn-parity-proof.mjs toast-hit         3d3d5cc:index.html index.html          → 5 ✗ rows
node docs/btn-parity-proof.mjs ds-disabled-hover 0779a9e:…/styles.css …/styles.css      → PASS
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
| 2 | vendored jsPDF at repo root | absent (`git ls-files \| grep -i jspdf` empty) |
| 3 | `main` | still `ef3220e` |
| 4 | uncommitted drop | `git status --untracked-files=all --short` empty |
| 5 | non-`auto/*` refs | newest is `design-system` @ 2026-08-13, older than all this work |

## What I did NOT do

- **Did not answer any of the eight open decisions.** Every one moves pixels or adds a file to
  the repo; they are the owner's call, and answering one unilaterally is explicitly forbidden.
- **Did not touch any `.css`, `.html` or tooling file.** This round's diff is `AUTOPILOT.md` +
  `SUMMARY.md` only, on top of the restore commit.
- Did not retry the browser MCPs (Playwright / Chrome-DevTools). They are *permission*-blocked,
  not merely headless, so retrying burns a round for a known answer — that is decision 4.
- Did not re-run the retrospective restore audit or restore `docs/design-parity.md` (decision 8).
- Did not add a `> **สถานะล่าสุด …` status block to `AUTOPILOT.md`. Per the `_0035`/`_0041`
  convention a no-op round edits only the `## Next task` forecast block; the file is already
  4,000+ lines and its size *is* why `## Next task` reaches the prompt empty.

## Risk

- **Next round is the dangerous one and I predict TAILS again (~77.94%).** When this round's
  commit lands, `2026-09-20` holds three tips (`c7842e2` `_0010`, `0779a9e` `_0020`, this round).
  The comparand stays `c7842e2` — it only ratchets up on a heads round — so the trap form picks
  `_0010` and would discard **both `_0020` and this round: 2 rounds**, up from 1.
- **That loss would be undetectable by every check in this repo.** Both rounds are docs-only, so
  after a wrong restore the code tree is byte-identical, the residual is empty, all five harness
  keys still match and all three Verify stages stay green. The *only* defence is ranking
  date-major (`--sort=-committerdate`) as the first command of the round, cross-checked by
  refname — and refname is a genuine independent key here, since `_0020` measured all 167 `auto/*`
  refs and found refname order and committerdate order differ in **0 of 167** positions.
- **A reviewer should not read this round's green Verify as evidence of progress.** Nothing in
  the product changed. The acceptance criteria that remain open are blocked on decisions 1–7, and
  no amount of further agent work moves them; the stall is now 4+ weeks old and has crossed a
  calendar-month boundary. It needs a person.
- `toast`'s after side must stay pinned at `3d3d5cc`. Pointing it at the working tree yields
  `FAIL — 5 declaration(s) differ` that looks exactly like a regression but is the later,
  deliberate `2026-08-24` fix. Tell them apart by the harness line `after : auto <- .toast-act`.
