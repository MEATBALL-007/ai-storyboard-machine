# SUMMARY — round `2026-09-02_0015`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

One thing in this round is worth reading:

> **The retired `%(committerdate:short)` ranking formula picked the *correct* tip this round — by
> luck of the calendar, not because the trap is fixed.** `98e4380` is the only tip on `2026-09-02`,
> so day granularity separated it before the sha fallback could fire. The trap is still plainly
> live one row lower: among the six `2026-09-01` tips, `:short` ranks `ec1d48b` (`_0001`, the
> **oldest**) above `460f6e2` (`_0042`, the **newest**). Per the standing rule, a round where the
> two formulas agree is **not** evidence the bug is gone — do not record this as a confirmation.

---

## What I did

- **Restored the previous round's tip** (`98e4380`, branch `…/2026-09-02_0002`) into the working tree
  and committed it on its own as `1529f7c`. The runner cut this branch from `3503537` again, so the
  tree arrived without any of the design-system integration work (16 files, 3301+/162−).
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys** using the command lines pinned in `AUTOPILOT.md`. Every count
  matches the recorded baseline exactly.
- **Ran the retired `:short` formula as a live command** alongside `:iso8601`, and recorded the
  result honestly: the two agree at position 1 this round, and that agreement proves nothing.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  Round `2026-08-20_0004` was fooled exactly this way and burned a commit. The only trustworthy
  signal is `git log --oneline -1`; `ls tools` showing just `test.mjs` was the cheap confirmation
  here, and it did show exactly that.
- **The restore target was picked with `%(committerdate:iso8601)`, never `:short`** — the same rule
  as every prior round, applied regardless of what the output happened to look like. Both formulas
  were run as real commands:

  ```
  :short (retired)                    :iso8601 (used)
  2026-09-02 98e4380 _0002  ←1st      2026-09-02 00:12:43 98e4380 _0002  ←1st, correct
  2026-09-01 ec1d48b _0001  ←inverted 2026-09-01 00:47:10 460f6e2 _0042
  2026-09-01 460f6e2 _0042            2026-09-01 00:37:41 42f34bd _0032
  2026-09-01 42f34bd _0032            2026-09-01 00:30:11 2bb9777 _0026
  ```

  This round `:short` would have restored correctly, because the calendar rolled over and only one
  tip carries `2026-09-02`. **That is luck, not a fix.** Rows 2–3 show the defect intact: `ec1d48b`
  (`_0001`, 00:07:20 — the oldest of the six same-day tips) outranks `460f6e2` (`_0042`, 00:47:10 —
  the newest) purely because `e` (0x65) beats `4` (0x34) as a leading hex character. The moment a
  second round lands on `2026-09-02`, the tie returns and the fallback is a coin flip again.
- **Why `toast` pins both sides** (`de07ea8:index.html 10e8f39:index.html`). That key exists to prove
  one specific 2026-08-23 refactor moved no pixels. A *later, deliberate* 2026-08-24 change added
  `pointer-events:auto` to `.toast-act`; leaving the after side open-ended folds that intentional
  delta in and reports `FAIL — 5`, the same count `toast-hit` is supposed to report. I used the
  pinned pair from `AUTOPILOT.md` and it PASSed, as recorded.
- **`ds-disabled-hover` took the previous round's tip** (`98e4380`), not a fixed sha, so it reads as
  a "nothing moved since last round" guard rather than a comparison that weakens each round.
- **I did not answer any decision, and did not do code work in their place.** Decisions 2/5/6/7 all
  move visible pixels; decision 8 (recovering `docs/design-parity.md` from `c3351fc`) means
  reconciling a file that predates the radius tokens, the font inlining and the `.btn` refactor.
  Both categories are owner calls, not agent calls.

## Verification

**Contract Verify — all three stages green:**

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```
```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
Test Files  12 passed (12)      Tests  31 passed (31)
```

**Restore integrity (channel 1 closes itself here):**

| Check | Result |
|---|---|
| `git diff --stat 98e4380 -- .` | empty → tree identical byte for byte |
| `git diff --diff-filter=D --name-only HEAD 98e4380` | empty → path-checkout equivalent to fast-forward |
| `git merge-base --is-ancestor 3503537 98e4380` | ancestor-ok |
| restore commit `1529f7c` shape | 13 `M` + 3 `A`, no `D`; 16 files, 3301+/162− |
| `98e4380` in `refs/heads` **and** `refs/remotes` | same sha in both → tip is live, not stale |
| `git log -1 98e4380` author | `PHANTOM AUTOPILOT <autopilot@phantom.local>` — runner, not owner |

The author check is the one that separates "the previous round wrote this" from "the owner committed
an answer onto the old branch"; the commit subject alone is not a reliable test.

**Five owner-answer channels — all negative:**

| # | Channel | Command | Result |
|---|---|---|---|
| 1 | Owner edits in the branch tree | `git diff --stat 98e4380 -- .` | empty |
| 2 | `README.md` `## Open decisions` | `grep -c "\| Option \| Cost \|" README.md` | **8** — all still open |
| 3 | `main` moved | `for-each-ref` | `ef3220e`, unchanged since 2026-06-27 |
| 4 | Dropped files (e.g. vendored jsPDF) | `git ls-files \| grep -i jspdf`; `ls jspdf.umd.min.js`; `git status --untracked-files=all --short` | all empty / no such file |
| 5 | Non-`auto/` refs | `for-each-ref … \| grep -v auto/deep_dive` | newest is `3503537` (2026-08-13), older than all round work |

Channel 5 in full: `design-system`/`origin/design-system` = `3503537` (2026-08-13);
`mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` exists only as `origin/`+`mac/`
= `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

Channel 1's `grep` was run **after** the restore. On the stale `3503537` tree `README.md` has no
`## Open decisions` section at all, so a pre-restore run returns `0` — which means "you are on the
stale tree", never "the owner deleted the section".

**Parity harness — all five keys, exact commands and results:**

| Key | Command | Pairs / elements | Markup coverage | Result |
|---|---|---|---|---|
| `buttons` | `buttons 2488f2d:index.html index.html` | 85 / 17 | 7 gone, 5 new | PASS |
| `segmented` | `segmented 021b966:index.html index.html` | 45 / 9 | 0 gone, 3 new | PASS |
| `toast` | `toast de07ea8:index.html 10e8f39:index.html` | 5 / 1 | 0 gone, 1 new | PASS |
| `ds-disabled-hover` | `ds-disabled-hover 98e4380:…/styles.css …/styles.css` | 15 / 3 | N/A (stylesheet) | PASS + 1 undecidable |
| `toast-hit` | `toast-hit 3d3d5cc:index.html index.html` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5 declaration(s) differ (expected)** |

`toast-hit`'s FAIL is the contract-specified correct result: it documents the deliberate
`pointer-events:auto` fix to the toast Undo button. `grep -c "✗ #toast:"` = **0**, confirming the
app-side `#toast` rule was not touched — all 5 differing declarations sit on `#toastUndo`, and the
harness names the cause outright (`after : auto <- .toast-act`). `ds-disabled-hover`'s 1 undecidable
rule is `.pui-menu__item:last-child` (structural pseudo, identical in both versions).

These five keys are an *independent* check on the restore: an empty `git diff` proves only that bytes
match, whereas the harness recomputes each element's cascade-winning declaration set from the files
actually standing, so a wrong or partial restore shows up as changed counts.

**Final tree state:** `git status --untracked-files=all --short` empty; only `AUTOPILOT.md` and
`SUMMARY.md` differ from `98e4380`.

## What I did NOT do

- **Did not answer, or act on, any of the eight owner decisions.** Decisions 2 (chip padding), 5
  (segmented padding), 6 (input sizes) and 7 (`:disabled:hover` leaks) each move pixels a user sees;
  decision 8 (recovering `docs/design-parity.md`) means reconciling stale content. Owner's call.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte.
- **Did not edit `AUTOPILOT.md` beyond its status/Next-task block.** Last round amended the Verify
  block because it had been misled by a gap there; this round found no such gap, so the harness
  command lines were used exactly as pinned and left alone.
- **Did not add a 7th token checker.** All 22 tokens are covered by the 6 existing checks; there is
  nothing left to enforce.
- **Did not add the harness to the Verify command.** It is a per-round instrument, not a check that
  must stay green — `toast-hit` is *designed* to FAIL.
- **Did not re-run the retrospective restore audit** (closed in `2026-08-31_0023`).
- **Did not retry Playwright / Chrome-DevTools MCP.** Both are permission-blocked, not merely
  headless; decision 4 has not been granted. Retrying wastes a round.

## Risk

- **Nothing in this round changes behaviour, so the review surface is the restore itself.** If
  `1529f7c` restored the wrong tip, every downstream check here would still be green — that is the
  known failure mode. The evidence that it did not: the tip was ranked by `:iso8601`, its sha matches
  in both `refs/heads` and `refs/remotes`, its author is the runner, and all five harness keys
  recompute to the pinned counts from the standing files.
- **The `:short` agreement this round is a coincidence and must not be cited as a fix.** I have
  written it up as such above, but a future round skimming this SUMMARY could read "`:short` was
  right" and relax the rule. It was right for one round because of a date rollover. Rows 2–3 of the
  same output show the ranking inverted.
- **The harness models no inheritance and no hit testing, and nothing in Verify evaluates `:hover`.**
  If a round quietly changed a hover colour, all three Verify stages and all five harness keys would
  stay green. This is precisely why decisions 2/5/6/7 must wait for an answer rather than be "tried
  out" — the safety net people assume exists does not.
- **Still never opened in a real browser.** Every claim about rendering and hit testing rests on
  reading source plus the CSS spec. Unchanged for the whole project; flagged again because it is the
  largest standing gap.
- **The consecutive-no-op stall has now run well past a calendar month** (the first recorded no-op
  rounds are in mid-August; `main` has not moved since 2026-06-27). I am deliberately **not** quoting
  a precise "Nth consecutive round" figure: rounds phrase their commit subjects differently, so
  `grep -c "no-op -- five channels checked"` is a floor rather than a count, and the tallies carried
  forward in earlier SUMMARYs were built by transcription rather than measurement. The verifiable
  statement is the one that matters: **the mechanical side is healthy — restores are correct, all
  checks green — and no acceptance criterion can advance without the owner.** The bottleneck is
  `README.md` `## Open decisions`, not the agent.
