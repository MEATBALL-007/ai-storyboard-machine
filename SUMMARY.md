# SUMMARY — round `2026-09-02_0002`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

Two things in this round are worth reading:

1. **The parity harness's `toast` key was under-documented in a way that reads as a regression.**
   `AUTOPILOT.md`'s Verify block listed expected numbers for all five keys but a command line for
   only one. Running `toast` the way `README.md:338` templates it reports
   `FAIL — 5 declaration(s) differ` — and `5` is the same number `toast-hit` is *supposed* to
   report, so the two are easy to confuse. It is not a regression. Fixed in `AUTOPILOT.md`.
2. **A sixth tip landed on `2026-09-01`, and the retired `%(committerdate:short)` key now ranks the
   *oldest* of the six first — restoring it would discard five rounds at once**, up from four. Both
   formulas were run as live commands, so this is a reproduction, not an inference.

---

## What I did

- **Restored the previous round's tip** (`460f6e2`, branch `…/2026-09-01_0042`) into the working
  tree and committed it on its own as `9788de1`. The runner cut this branch from `3503537` again, so
  the tree arrived without any of the design-system integration work (16 files, 3248+/162−).
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count matches the recorded baseline.
- **Corrected the Verify block in `AUTOPILOT.md`** to carry all five harness command lines verbatim,
  plus the reason `toast` must have *both* sides pinned. This is the only content change this round.
- **Reproduced the `:short` ranking trap as live output, in its worst recorded form yet** — this
  round it would cost five rounds of work, up from four.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  Round `2026-08-20_0004` was fooled exactly this way and burned a commit. The only trustworthy
  signal is `git log --oneline -1`; `ls tools` showing just `test.mjs` is the cheap confirmation.
- **The restore target was picked with `%(committerdate:iso8601)`, never `:short`.** All six
  candidate tips now share the date `2026-09-01`, so `:short` ties on all six and `sort -r` falls
  through to comparing the abbreviated **sha as a string**. Both were run as real commands:

  ```
  :short (retired, WRONG)        :iso8601 (used)
  2026-09-01 ec1d48b _0001  ←ranked 1st   2026-09-01 00:47:10 460f6e2 _0042  ←correct
  2026-09-01 460f6e2 _0042                2026-09-01 00:37:41 42f34bd _0032
  2026-09-01 42f34bd _0032                2026-09-01 00:30:11 2bb9777 _0026
  2026-09-01 3e6cb1a _0017                2026-09-01 00:23:58 3e6cb1a _0017
  2026-09-01 2bb9777 _0026                2026-09-01 00:17:00 0b082ed _0011
  2026-09-01 0b082ed _0011                2026-09-01 00:07:20 ec1d48b _0001
  ```

  `ec1d48b` is the **oldest** of the six (00:07:20) and ranks first purely because `e` (0x65) is the
  largest leading hex digit. Restoring it would silently delete `_0011`, `_0017`, `_0026`, `_0032`
  and `_0042`. Nothing would catch it: all five are no-ops touching only `AUTOPILOT.md`/`SUMMARY.md`,
  so the tree diff would still be empty, the harness would still match, and Verify would still be
  green. Note the correct tip fell to rank 2 under `:short` — close enough to look "nearly right",
  which is exactly why the formula must not be judged by eyeballing the top row.
- **Why `toast` must pin both sides.** The `toast` key exists to prove one specific 2026-08-23
  refactor (inline `style=` inside a JS template string → `class="toast-act"`) moved no pixels:
  `de07ea8` → `10e8f39`. On **2026-08-24** a *later, deliberate* change added `pointer-events:auto`
  to `.toast-act` to fix the unclickable Undo button. So leaving the after side as the working tree
  folds that intentional delta into a key whose whole claim is "nothing moved". I ran it the wrong
  way first and got `FAIL — 5`, with the harness naming the cause outright (`after : auto <-
  .toast-act`) — that line is what distinguishes it from `toast-hit`'s identically-sized FAIL.
  `buttons` and `segmented` *should* keep an open-ended after side: nothing has touched those areas
  since, so an open comparison is a live regression guard rather than a stale one.
- **`ds-disabled-hover` has no canonical before-rev**, because it is a 0-diff baseline whose job is
  to fire when `Button.css`/`Menu.css` change. I used the previous round's tip, which makes it a
  "nothing moved since last round" guard. I recorded it in `AUTOPILOT.md` as `<tip รอบก่อน>` rather
  than a fixed sha, since a fixed sha would make the check weaker every round.
- **I did not answer any decision, and did not do code work in their place.** Decisions 2/5/6/7 all
  move visible pixels, and decision 8 (recovering `docs/design-parity.md` from `c3351fc`) requires
  reconciling a 13-day-old file against work that postdates it. Both are owner calls.

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
| `git diff --stat 460f6e2 -- .` | empty → tree identical byte for byte |
| `git diff --diff-filter=D --name-only HEAD 460f6e2` | empty → path-checkout equivalent to fast-forward |
| `git merge-base --is-ancestor 3503537 460f6e2` | ancestor-ok |
| restore stage shape | 13 `M` + 3 `A`, no `D` |
| `git log -1 460f6e2` author | `PHANTOM AUTOPILOT <autopilot@phantom.local>` — runner, not owner |

**Five owner-answer channels — all negative:**

| # | Channel | Command | Result |
|---|---|---|---|
| 1 | Owner edits in the branch tree | `git diff --stat 460f6e2 -- .` | empty |
| 2 | `README.md` `## Open decisions` | `grep -c "^### [1-8]\."` / `"If you answer:"` / `"\| Option \| Cost \|"` | **8 / 8 / 8** — all still open |
| 3 | `main` moved | `for-each-ref` | `ef3220e`, unchanged since 2026-06-27 |
| 4 | Dropped files (e.g. vendored jsPDF) | `git ls-files \| grep -i jspdf`; `git status --untracked-files=all --short` | both empty |
| 5 | Non-`auto/` refs | `for-each-ref … \| grep -v auto/deep_dive` | newest is `3503537` (2026-08-13), older than all round work |

Channel 5 in full: `design-system`/`origin/design-system` = `3503537` (2026-08-13);
`mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` exists only as `origin/`+`mac/`
= `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

**Parity harness — all five keys, exact commands and results:**

| Key | Command | Pairs / elements | Markup coverage | Result |
|---|---|---|---|---|
| `buttons` | `buttons 2488f2d:index.html index.html` | 85 / 17 | 7 gone, 5 new | PASS |
| `segmented` | `segmented 021b966:index.html index.html` | 45 / 9 | 0 gone, 3 new | PASS |
| `toast` | `toast de07ea8:index.html 10e8f39:index.html` | 5 / 1 | 0 gone, 1 new | PASS |
| `ds-disabled-hover` | `ds-disabled-hover 460f6e2:…/styles.css …/styles.css` | 15 / 3 | N/A (stylesheet) | PASS + 1 undecidable |
| `toast-hit` | `toast-hit 3d3d5cc:index.html index.html` | 10 / 2 | 0 problems | **FAIL — 5 declaration(s) differ (expected)** |

`toast-hit`'s FAIL is the contract-specified correct result: it documents the deliberate
`pointer-events:auto` fix. `grep -c "✗ #toast:"` = **0**, confirming the app-side `#toast` rule was
not touched — the 5 differing declarations are all on `#toastUndo`. `ds-disabled-hover` assembled its
stylesheet from **14 files in `@import` order**; its 1 undecidable rule is
`.pui-menu__item:last-child` (structural pseudo), identical in both versions.

**Final tree state:** `git status --untracked-files=all --short` empty; only `AUTOPILOT.md` and
`SUMMARY.md` differ from `460f6e2`.

## What I did NOT do

- **Did not answer, or act on, any of the eight owner decisions.** Decisions 2 (chip padding), 5
  (segmented padding), 6 (input sizes) and 7 (`:disabled:hover` leaks) each move pixels a user sees;
  decision 8 (recovering `docs/design-parity.md`) means reconciling stale content. Owner's call.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte.
- **Did not add a 7th token checker.** The contract records that all 22 tokens are covered by the 6
  existing checks and that there is nothing left to enforce.
- **Did not add the harness to the Verify command.** It is a per-round instrument, not a check that
  must stay green — `toast-hit` is *designed* to FAIL.
- **Did not re-run the retrospective restore audit** (closed in `2026-08-31_0023`).
- **Did not retry Playwright / Chrome-DevTools MCP.** Both are permission-blocked, not merely
  headless; decision 4 has not been granted. Retrying wastes a round.

## Risk

- **The `AUTOPILOT.md` Verify-block edit is the only judgement call in this round.** A strict reading
  of "no-op round: check five channels, write SUMMARY, stop" would have left it alone. I made the
  change because I had just been misled by the gap myself, it is confined to documentation of the
  round's own verification procedure, and every command in it was executed in this round. It changes
  no CSS and no checker. A reviewer who disagrees can drop that hunk with no other effect.
- **`ds-disabled-hover` was run against the previous round's tip, so it is a weak proof this round.**
  I restored that tip, so a 0-diff result is nearly tautological. It would only have caught a
  mid-round edit of mine. Its real value arrives when `Button.css`/`Menu.css` genuinely change.
- **The harness models no inheritance and no hit testing, and nothing in Verify evaluates `:hover`.**
  If a future round quietly changed a hover colour, all three Verify stages and all five harness keys
  would stay green. This is precisely why decisions 2/5/6/7 must wait for an answer rather than be
  "tried out" — the safety net people assume exists does not.
- **Still never opened in a real browser.** Every claim about rendering and hit testing rests on
  reading source plus the CSS spec. Unchanged for the whole project; flagged again because it is the
  largest standing gap.
- **This is the 25th consecutive round with no owner answer.** The contract's own tally stops at
  **#16** (`2026-08-31_0039`); since then `_0049`, `_0056`, `_0001`, `_0011`, `_0017`, `_0026`,
  `_0032`, `_0042` were all recorded no-ops, making this #25. (`grep -c "no-op -- five channels
  checked"` returns only **9** — earlier rounds used different commit subjects, so the git count is a
  floor, not the tally.) The mechanical part is healthy — restores
  are correct, checks are green — but no acceptance criterion can advance without the owner. If
  these rounds are meant to make progress, the bottleneck is `README.md` `## Open decisions`, not
  the agent.
