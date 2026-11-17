# SUMMARY — round 2026-11-18_0007

## What I did
- Restored the previous round's tip, `92c503b` (`2026-11-17_0037`). The runner had cut this branch
  from the stale base `3503537` again. The restore is its own commit, and the trees match:
  `HEAD^{tree}` = `92c503b^{tree}` = `ac16c012e241…`.
- Checked all five owner-answer channels. None has an answer, so this is a no-op round, which is
  what the restored `## Next task` says to do in that case.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and moved the "tip to restore" line to
  `2026-11-18_0007`. This is the first round on 11-18, so the A/B ran against the four 11-17 tips
  and came up TAILS: the trap form (`| sort -r` on sha) would have restored `a558e40` and thrown
  away `_0027` and `_0037`. The trap-form tally is now 135/205 (135/201).

## Why
- The prompt's `## Next task` arrived empty. Hard rule 5 forbids inventing a task, so I followed the
  task written in the restored `AUTOPILOT.md`: restore, check channels, verify, summarise, stop.
- All remaining work is gated on the eight owner decisions in `README.md` → `## Open decisions`.
  Answering any of them would move pixels or add files, so it is the owner's call, not an agent's.

## Verification
- `git for-each-ref --sort=-committerdate …` gave `92c503b` `_0037` in row 1 (local and `origin/`
  agree). `git log -1 92c503b` shows author PHANTOM AUTOPILOT with subject
  `autopilot: SUMMARY for round 2026-11-17_0037`, so it is runner work, not an owner answer.
- `git rev-parse HEAD^{tree} 92c503b^{tree}` printed the same sha twice (`ac16c012e241f87c…`).
- Channels:
  - `grep -c "| Option | Cost |" README.md` printed 8 and `grep -c "If you answer:"` printed 8.
  - `git ls-files | grep -ci jspdf` printed 0, and there is no `jspdf*` file at the root.
  - `git status --untracked-files=all` came back clean.
  - `main` is still `ef3220e`, and the newest non-`auto/*` ref is from 2026-08-13 (`design-system`).
- `node -e`: `'92c503b'<'a558e40'` → `true`, which is why the trap form picks the wrong row.
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
  - `54 passed, 0 failed`
  - check-tokens: tokens 22/22, fonts 4/4, and the four literal checks are clean across 15 CSS sources
  - vitest: `12 passed (12)` files, `31 passed (31)` tests
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS, markup OK
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 92c503b:design-system/src/styles.css design-system/src/styles.css`: 15 / 3,
    PASS, plus 1 undecidable rule (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs.
    This is the expected result. All five `✗` rows are `#toastUndo` (base, `:hover`, `:disabled`,
    `:disabled:hover`, `:focus`), none is `#toast`, and the change shown is `pointer-events
    (unset) → auto <- .toast-act`.

## What I did NOT do
- I did not answer or act on any of the eight open decisions (jsPDF vendoring, chip, segmented and
  input sizes, the spacing scale, browser verification, disabled-hover, `docs/design-parity.md`).
- I did not retry the Playwright or Chrome-DevTools MCPs; they are permission-blocked (decision 4).
- I did not touch `index.html`, any CSS, any tests, the PURE-LOGIC/TESTS markers, or
  `storyboard-simulator.html`.

## Risk
- Low. This round changes only `AUTOPILOT.md` (one log entry plus the restore-target line) and this
  file. The restore commit is byte-identical to `92c503b` by tree sha.
- The project has been stalled on owner decisions since late August. Another automated round will
  not change that; a person has to answer something in `README.md` → `## Open decisions`, or drop
  `jspdf.umd.min.js` at the repo root.
