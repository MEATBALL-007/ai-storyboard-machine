# Round `2026-09-28_0002`: no-op. The prompt's task was already done, and the round is blocked on owner decisions

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. `git for-each-ref --sort=-committerdate` shows `6225a87`
  (`…/2026-09-24_0033`) as the newest tip. I restored it as its own commit.
- **Found that the prompt's `## Next task` is stale and already done.** It asks to add the
  `tokens.css` token set to `index.html`'s `<style>` and map hard-coded values onto it. That work
  shipped on 2026-08-21 (see acceptance criterion 1 in `AUTOPILOT.md`: colours done, radius done).
  The restored `index.html` already has 235 `var(--` references, and `tools/check-tokens.mjs`
  enforces them. Per hard rule 5, I did not redo the work or invent a substitute.
- **Checked all five owner-answer channels. None of the eight open decisions has an answer.** The
  task pinned in the restored `AUTOPILOT.md` covers this case: a deliberate no-op round.
- **Ran Verify (both the prompt's two-stage form and the contract's three-stage form). All green.**
  All five parity-harness keys match the established table.
- **Updated `AUTOPILOT.md`'s `## Next task` block only.**
  - The tip pointer now names `2026-09-28_0002`.
  - I added a warning not to trust a prompt that asks for the first token pass.
  - I resolved `_0033`'s forecast as **tails**, measured with a live A/B.
  - I set the next round's forecast: masked.

## Why

- **The prompt's contract came from the stale base, not the previous tip.** Its Goal says
  `index.html` is 3,756 lines, the design system has 12 components, and Verify has two stages. The
  restored contract says 4,034 lines, 11 components, and a three-stage Verify that includes
  `check-tokens.mjs`. The prompt text matches the original `3503537` contract. Earlier rounds saw the
  prompt generated from the previous tip, or arrive with an empty Next task. This round's prompt
  described work that looks open only on the stale tree. If I had read `index.html` before
  restoring, I would have "done" the task again from scratch.
- **This round was a live tiebreak, so I ran the A/B and counted it.** No rounds ran between
  09-25 and 09-27. My own ref still pointed at `3503537`, so the newest date in the table was
  `2026-09-24`, holding four tips.
  - Correct form (`--sort=-committerdate`) → row 1 = `6225a87` (`_0033`), which is right.
  - Trap form (`%(committerdate:short) %(objectname:short) %(refname:short)` + `| sort -r`, run
    live) → row 1 = `bef9f35` (`_0013`), which is wrong. The real tip sinks to **row 4 of 4**.
  - `node -e "console.log('6225a87'<'bef9f35')"` prints `true`, so `_0033`'s conditional was
    right at ≈74.60%.
  - The record is now **tails 36 of 59**, or 36/55 excluding structural heads.
- **The next round should be masked.** This round's tip is the first one dated `2026-09-28`. That
  holds only if the runner pushes it; `AUTOPILOT.md` gives the fallback case.

## Verification

- `git rev-parse HEAD^{tree}` and `git rev-parse 6225a87^{tree}` both print
  `a5c935415e4fc9fa9855b228ad4aacdcb92bd6b8`, so the restore matches on every path.
  `6225a87` holds real work: `docs: SUMMARY…` above `docs:` above `chore: restore…`.
- Channels:
  - (1) `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8. The two
    counters agree.
  - (2) There is no `jspdf*` file.
  - (3) `main` is still `ef3220e`.
  - (4) `git status --short --untracked-files=all` was empty after the restore.
  - (5) Non-`auto/*` refs are unchanged: `design-system` = `3503537`, `mac*` =
    `e3a355c`/`592e7c3`, `main`/`mac/main` = `ef3220e`. The newest is 2026-08-13.
- Prompt Verify: `node tools/test.mjs && npm --prefix design-system test` printed
  `54 passed, 0 failed`, then vitest printed `12 passed (12)` files and `31 passed (31)` tests.
- Contract Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix
  design-system test` was green. I ran it last, after all edits:
  - `54 passed, 0 failed`
  - check-tokens printed all 6 checks passing:
    - `tokens in sync: 22/22`
    - `fonts in sync: 4/4`
    - no derived-colour literals, font weights, no radius literals, and typeface, each across 15
      CSS sources
  - vitest: `12 passed (12)` files, `31 passed (31)` tests
- Harness keys, using the pairs pinned at `AUTOPILOT.md` ~line 920:
  - `buttons 2488f2d:index.html 9fab5c9:index.html` → PASS
  - `segmented 021b966:index.html index.html` → PASS
  - `toast bb10dd9:index.html 3d3d5cc:index.html` → PASS
  - `ds-disabled-hover 6225a87:design-system/src/styles.css design-system/src/styles.css` → PASS,
    plus the usual 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ, 0 markup
    problem(s), 0 unmatched element(s)`. This FAIL is the **expected** result. All five `✗` rows
    are `#toastUndo`. No row is `#toast`.

## What I did NOT do

- **Did not redo the prompt's token task.** It is already complete on the real tree. The
  unmatched-value list it asks for already exists at `AUTOPILOT.md` lines 24–26: `#000`, `#222`,
  `#333`, `#fff`, `#161616`, `#151515`, `#0a0a0a`, `#bbb`, `#ffb4a0`, `#7ac87a`, plus
  black/white/green `rgba()`. Choosing between moving those colours and adding tokens is still the
  owner's decision (README decision 3 covers the spacing and type side).
- **Did not answer any of the eight open decisions.**
- Did not touch `index.html`, any `.css`, tests, the Verify command, or the markers.
- Did not tick any acceptance box. Nothing changed that would complete one.

## Risk

- **Low for code.** This round changes docs only: `AUTOPILOT.md`'s Next-task block and this file.
- **The prompt contract can now describe a task that is already done.** A future round that reads
  files before restoring would find the stale tree, where the token task looks open. It could then
  redo it and produce a large conflicting diff. The new warning in `AUTOPILOT.md` only helps after a
  restore. The real fix belongs to the runner: cut branches from the previous tip, or merge a PR
  into `main`.
- **The stall needs a person.** Every remaining acceptance criterion is gated on an owner answer in
  `README.md → ## Open decisions`.
