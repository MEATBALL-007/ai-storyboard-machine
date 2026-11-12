# SUMMARY — round 2026-11-13_0021

## What I did
- Restored the previous round's tip `af85066` (`2026-11-13_0011`) onto this branch. The runner cut this branch from the stale base `3503537` again. The restore is its own commit, and the tree shas match: `HEAD^{tree}` = `af85066^{tree}` = `f4ec9ab0deddfe5e2cac29f3ecfc14bff791a9c0`.
- Checked the five channels where an owner answer could show up. None of them had one, so this round is a no-op, as the restored `## Next task` says to do in that case.
- Ran the full Verify command and all five parity-harness keys. Every result matched the expected values.
- Added this round's log block under `## Next task` in `AUTOPILOT.md` and changed the "tip to restore" line to point at `2026-11-13_0021`.

## Why
- The prompt's `## Next task` was empty. The real task is in the branch's own `AUTOPILOT.md`, and that file only exists after the restore. It says that when no owner decision has been answered, the round should restore, check the channels, verify, write SUMMARY and stop. It should not invent other work.
- Every remaining acceptance criterion is blocked on one of the 8 owner decisions in `README.md` → `## Open decisions`:
  - jsPDF vendoring
  - chip, segmented and input sizing
  - the spacing scale
  - browser verification
  - disabled-hover
  - `docs/design-parity.md`

  Each one either moves pixels or adds a file, so the owner has to decide it.

## Verification
- The tip came from `git for-each-ref --sort=-committerdate`: `af85066` `_0011`, the same sha locally and on `origin/`.
- `git rev-parse HEAD^{tree} af85066^{tree}` printed the same sha twice (`f4ec9ab0…`).
- Channels:
  - `grep -c "| Option | Cost |" README.md` → **8**
  - `grep -c "If you answer:" README.md` → **8**
  - no `jspdf*` file is tracked or present
  - `git status --short --untracked-files=all` printed nothing
  - `main`, `origin/main` and `mac/main` are all at `ef3220e`
  - the newest non-`auto/*` ref is `design-system` / `origin/design-system`, dated 2026-08-13
- Tip-selection A/B: measured live and counted, and the result was **HEADS**, as `_0011` predicted.
  - After the restore commit, my own ref `be863d1` sat at row 1 of the trap form, so I dropped it.
  - That left 2 tips on 2026-11-13, and the trap form's row 1 was `af85066`, which is the real tip.
  - `node -e "console.log('af85066'>'6d51354')"` → `true`
  - The wrong-formula tally is now tails 126 of 191 (126/187).
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` exited 0.
  - `54 passed, 0 failed`
  - check-tokens: all 6 checks pass across 15 CSS sources (tokens 22/22, fonts 4/4)
  - vitest: `Test Files 12 passed (12)`, `Tests 31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):

  | Key | Before → after | Result |
  |---|---|---|
  | `buttons` | `2488f2d` → live | 85 pairs / 17 elements, PASS |
  | `segmented` | `021b966` → live | 45 / 9, PASS |
  | `toast` | `de07ea8` → `10e8f39` | 5 / 1, PASS |
  | `ds-disabled-hover` | `af85066:design-system/src/styles.css` → live | 15 / 3, PASS, plus 1 undecidable rule (reported) |
  | `toast-hit` | `3d3d5cc` → live | `FAIL — 5 declaration(s) differ` on 10 pairs (exit 1), markup coverage OK |

  The `toast-hit` FAIL is what this key should report, because the Undo-button fix it tracks was a deliberate change. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), each showing `pointer-events` going from unset to `auto`. No row is `#toast`.

## What I did NOT do
- I did not answer any of the 8 owner decisions, and I did not apply decisions 2, 5, 6 or 7 on my own.
- I did not retry the Playwright or Chrome-DevTools browser tools. Permissions block them, and lifting that is decision 4.
- I did not touch `index.html`, any CSS, `storyboard-simulator.html`, the test markers, or the Verify command.
- I did not tick any acceptance-criterion box, because nothing in the product changed.

## Risk
- Low. After the restore, the only changes are a log block in `AUTOPILOT.md` and this file. Nothing the app or the library ships was changed.
- The branch still carries the restore commit because the runner keeps cutting branches from `3503537`. A reviewer who diffs against `main` will see all the accumulated design-system work, not just this round's.
- Rounds will keep ending as no-ops until a person answers a decision in `README.md` or puts `jspdf.umd.min.js` in the repo root.
- If the next round runs on 2026-11-13, that date will hold 3 tips, so it is a live tiebreak against `af85066`. The trap form would pick the wrong tip, and throw away this round's docs-only work, if this round's closing sha sorts below `af85066`. The next round should settle this from `for-each-ref` using `node -e`.
