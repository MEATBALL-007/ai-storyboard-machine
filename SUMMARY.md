# Round 2026-08-23_0004

## What I did

- **Restored the previous round's work first** (commit `450f2a6`). The branch was again cut from
  `3503537` instead of the previous tip, so the tree arrived with no `tools/check-tokens.mjs` and
  none of the token/radius/font work the contract describes. Restored from
  `auto/deep_dive_AI_Storyboard_Machine/2026-08-22_0048` via `git checkout <tip> -- .`;
  `git diff --stat <tip>` came back empty, so the restore is total. Kept as its own commit so this
  round's real diff stays readable. **Ninth round in a row that has had to do this.**
- **Moved the four owner decisions out of `AUTOPILOT.md` into `README.md` as `## Open decisions`**
  — the round's actual task. Each entry is now self-contained: what it blocks, why an agent can't
  resolve it, an options table with the cost of each, and what a future round does once answered.
- **Rewrote each item to be decidable cold.** The originals were one-line reminders that only made
  sense next to the acceptance criteria. They now carry their own evidence — the sidebar width
  arithmetic for the chip, the spacing/font-size value inventory, the "no local jsPDF copy +
  network blocked" finding, the "Playwright and Chrome-DevTools MCP were *permission*-blocked,
  not merely headless" finding.
- **Added a pointer under the README title** so a maintainer opening the repo front page lands on
  the section without scrolling, and reduced the `🔴` heading in `AUTOPILOT.md` to a link plus an
  instruction not to write the questions back into a runner-owned file.
- **Folded the pre-existing `### Open decision: chip horizontal padding` subsection into the new
  section** rather than leaving two copies, and repaired the two cross-references that my own move
  would otherwise have left dangling (the parity table's "see below", and `AUTOPILOT.md`'s pointer
  to the README heading that no longer holds the calculation).

## Why

The three unticked acceptance criteria are blocked on the owner, not on the agent, and the
token-side tooling is finished (checks 1–6 cover all 22 tokens). But the questions were sitting in
`AUTOPILOT.md`, which the runner **overwrites every round** and which the owner has no reason to
open. `README.md` is the repo's front door. This is not duplication — it is moving the question to
where the person who answers it actually looks.

I wrote the new section in English to match the rest of `README.md`, and left `AUTOPILOT.md` in
Thai to match its own voice.

**One judgment call worth flagging:** I also corrected the element-parity table, which still said
badge / modal / empty state were "not yet compared". The contract's acceptance criterion 2 records
that all five were compared on 2026-08-21 and all three match. I fixed it because I was
restructuring that exact table (the chip subsection nested inside it moved out), and because
leaving a known-false status row directly above a section I had just told the owner to trust for
decisions would defeat the point of the round. It is sourced from the prior round's record, not
from a fresh survey.

## Verification

Ran the contract's Verify command in full:

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
Test Files  12 passed (12)
     Tests  31 passed (31)
```

All green. `git diff --stat` for the task commit is `AUTOPILOT.md` + `README.md` only — no line of
`index.html`, no CSS, no `tools/`, as the task required. Both `#open-decisions` and
`#2-chip-horizontal-padding--which-pixels-move` follow GitHub's heading-slug rules and match the
headings I wrote.

## What I did NOT do

- **Did not answer any of the four questions.** Every one moves pixels or adds a file to the repo.
  That is the owner's call, and answering them myself is exactly the failure this round exists to
  prevent.
- **Did not touch `index.html`, any CSS, or `tools/`** — explicitly forbidden by the task.
- **Did not add a seventh token check.** All 22 tokens are covered; there is nothing left to enforce.
- **Did not fix the stale file-size numbers I found while working** (README says 297 KB; the file is
  actually 307,820 bytes, and `AUTOPILOT.md`'s Portfolio block still says 187 KB, a pre-font-inline
  figure that feeds `registry.csv`). Both are real and both are outside this round's one task, so I
  wrote them into `## Next task` with the exact command that measures the truth instead.
- **Did not add the base `.btn` class** noted as optional in the contract. It requires editing
  `class=` in both markup and JS template strings in a 3,756-line file that **nobody can look at in
  a browser** (decision 4). A refactor that cannot be visually verified is the wrong thing to do
  while blocked on visual verification.

## Risk

- **The parity-table edit is the one substantive claim I changed, and I did not re-verify it.** It
  is transcribed from the prior round's recorded survey, not from reading the CSS this round. If a
  reviewer wants one thing checked, check that `.pc-badge`, `.modal-bg`/`.modal`, and `.empty-state`
  really do match their Phantom UI files.
- **Documentation-only round: it ticks no acceptance criterion.** All three remaining criteria are
  still owner-blocked, by design. If the owner does not read the new section, the next several
  rounds will keep producing small cleanups and nothing else.
- **Everything here is still unmerged.** `main` has never received any of it, and every `auto/*`
  branch stacks in parallel from `3503537`. Each round now begins by restoring the last one. The
  restore has worked nine times, but it is a runner bug that keeps costing part of every round, and
  a single bad restore would silently discard weeks of work.
- Markdown anchors are the one thing here that can rot silently — if a future round renames a
  heading under `## Open decisions`, the parity table's link breaks with no test to catch it.
