# Round 2026-09-05_0042 — SUMMARY

**Result: no-op round.** All eight owner decisions in `README.md → ## Open decisions` are still
unanswered, so there was no unblocked work to do. Not a single byte of `index.html`,
`design-system/`, `tools/` or `docs/` was touched.

## What I did

- **Restored the previous round's tip** (`01aebaa` = branch `…/2026-09-05_0035`) onto the stale
  base `3503537` the runner cut this branch from. Restore commit `c3c74bb`.
- **Checked all five owner-answer channels.** None has moved:
  1. `README.md → ## Open decisions` — 8 option tables, 8 `If you answer:` lines, counters agree
  2. no `jspdf` file anywhere in `git ls-files`, none at the repo root
  3. `main` still `ef3220e` (2026-06-27)
  4. `git status --untracked-files=all --short` empty — no uncommitted drop
  5. no non-`auto/*` ref newer than 2026-08-13
- **Ran the full Verify command and all five `docs/btn-parity-proof.mjs` keys**, reading each key's
  complete output rather than tailing it. Everything matches the expected table exactly.
- **Found a live defect in the tip-ranking recipe that rounds have been copying forward** (see Risk):
  the `grep -v "^origin/"` filter in the `for-each-ref` pipeline is inert. Recorded it in
  `AUTOPILOT.md` with the corrected form.
- **Recorded the round** in `AUTOPILOT.md` (new status block, existing labels demoted one step) and
  wrote this file. Next task is unchanged: the same no-op loop until an owner answers.

## Why

- **The restore comes before any file read.** HEAD really was `3503537` again — 70+ rounds and the
  runner bug has never been fixed. The dangerous failure mode is not forgetting to restore, it is
  *reading source first*: on the stale tree the token work genuinely looks finished, and round
  `2026-08-28_0004` burned itself concluding exactly that.
- **Tip chosen with `%(committerdate:iso8601)`, cross-checked by refname, never by row number.**
  `_0035` is the highest round number below my own `_0042`, and both methods agree.
- **I did not re-run the `:short` A/B.** `AUTOPILOT.md:355–356` records that round `2026-09-04_0048`
  measured it live and caught a real inversion at rows 3–4; the file explicitly says later rounds
  need not repeat it. Skipping it is compliance, not an omission.
- **`ds-disabled-hover`'s before side is the tip I actually restored** (`01aebaa`), read from
  `git for-each-ref` this round. Copying a sha from an old status block would pin the guard to a
  stale baseline and make it a tautology.

## Verification

Verify command — all three stages green:

```
node tools/test.mjs           → 54 passed, 0 failed
node tools/check-tokens.mjs   → 6/6 checks pass, 15 CSS sources scanned
                                (22/22 tokens, 4/4 fonts, no derived-colour literals,
                                 font weights all in {400,500,700,800}, every border-radius
                                 reads a --r-* token, every font-family reads var(--mono))
npm --prefix design-system test → 12 files, 31 passed
```

All five harness keys match the expected table exactly:

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html index.html` | PASS — 45 pairs / 9 elements, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 pairs / 1 element, **no undecidable** |
| `ds-disabled-hover` | `01aebaa:…/styles.css …/styles.css` | PASS — 15 pairs / 3 elements, + 1 undecidable |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ` (**expected**) |

- The `ds-disabled-hover` undecidable is the known `.pui-menu__item:last-child`
  (`structural pseudo :last-child`; subject matches `.pui-menu__item`, `.pui-menu__item--danger`).
- `toast-hit`'s FAIL is the correct result — it documents the deliberate 2026-08-24
  `pointer-events:auto` fix. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`), each `before: (unset)` → `after : auto <- .toast-act`, with
  **no `#toast` row** — which is the proof `#toast` still carries its `pointer-events:none`.
  I read the full output; `grep -c "✗ #toast:"` has a documented blind spot (the base-state row
  prints `✗ #toast (base)`, no colon) and would return 0 even on a real regression.

Restore preconditions, all checked before touching the tree:

```
git log -1 --format="%h %an <%ae> %ad %s" 01aebaa
  → PHANTOM AUTOPILOT <autopilot@phantom.local> Sat Sep 5 00:40:44 2026
    "chore: round 2026-09-05_0035 no-op -- five channels checked, no owner answer"
git merge-base --is-ancestor 3503537 01aebaa        → ancestor-ok
git diff --diff-filter=D --name-only HEAD 01aebaa   → empty (no deletions)
git diff --stat 01aebaa -- .                        → empty (restore total)
```

The author check matters on its own: it distinguishes "the previous round's own commit" from "the
owner committed an answer onto that branch", which would change what this round should do.

## What I did NOT do

- **Did not answer, apply or work around any of the eight open decisions.** Each moves visible
  pixels or adds a file; all are the owner's call. Decisions 2, 5 and 6 are the last three gaps in
  the element-parity criterion, 1 and 4 each gate a further criterion, 8 is a git-history question.
- **Did not invent substitute work.** Code-touching fallbacks are exhausted (token tooling 22/22 at
  six checks, parity table closed 11/11) and the last read-only fallback — the retrospective restore
  audit — was completed in round `2026-08-31_0023`. `AUTOPILOT.md` explicitly forbids the tempting
  leftovers (`:last-child` matching, adding the harness to Verify, applying 2/5/6/7 unilaterally).
- **Did not run the `:short` A/B**, per `AUTOPILOT.md:355–356` (see Why).
- **Did not restore `docs/design-parity.md`** — that is decision 8, still unanswered.
- **Did not trim `AUTOPILOT.md`** despite it now being 2,325 lines (`wc -l`, after this round's
  block), which is *why* the contract text
  reaches the agent truncated with an empty `## Next task`. Deleting round history is discarding
  evidence and is an owner decision.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are permission-blocked, not merely
  headless — that is decision 4.

## Risk

- **The stall is the real risk, and it is now 3+ weeks old and across a month boundary.** Rounds are
  producing correct no-ops indefinitely. This needs a person to answer `## Open decisions`; no number
  of further rounds will clear it.
- **`grep -v "^origin/"` in the tip-ranking pipeline does nothing, and a future round could be misled
  by it.** The `--format` string emits `%(committerdate:iso8601)` first, so every line begins with a
  date and the `^origin/` anchor never matches — my own output still contains all the `origin/` rows,
  which is the proof. Harmless here (`head -16` still showed 16 rows = 8 distinct tips, real tip in
  rows 1–2, nothing clipped), but a round that believed the filter worked would think it had 16 tips
  of headroom when it had 8, which is exactly the clipping trap round `2026-09-02_0047` documented.
  Correct forms: `grep -v " origin/"` (leading space), or just keep `head -16`+ as I did.
- **Round `_0035`'s conditional forecast resolved, and it came up TAILS.** Its tip `01aebaa` starts
  `0`, so with five tips now sharing `2026-09-05` the day-truncated pipeline ties them all and
  sha-descending gives `d8cfce8` > `ba6baa6` > `304cd2d` > `0b1e5a0` > `01aebaa`. A round using
  `:short` would restore `_0027` and silently discard `_0035` — **and the real tip ranks last of the
  five**, the worst *position* recorded for a real tip inside a same-day group. **Forecast for next
  round:** the day will hold six tips; if this round's closing commit sha starts `e`–`f` the trap
  reverts to accidentally-right at row 1, otherwise `d8cfce8` wins and both `_0035` and `_0042` are
  discarded. I did **not** run `:short` live — this is inference from the `:iso8601` output, not a
  measurement, and must not be cited as an A/B.
- **`toast-hit` reporting `FAIL — 5` is correct and expected.** A reviewer scanning for green will
  misread it. It is a documented, deliberate behaviour change, not a regression.
- **The restore-audit completeness proof is file-level only.** If a round that skipped its restore
  dropped *lines* from a file that still exists, that is not detectable now and never will be.
  Do not cite the audit as closing that question.
- **Nothing here was verified in a real browser.** Every parity claim in this repo rests on source
  reading, the CSS cascade as the harness models it, and jsdom — which does no hit testing. The
  harness also does not model inheritance, which is the exact mechanism of the toast bug it documents.
