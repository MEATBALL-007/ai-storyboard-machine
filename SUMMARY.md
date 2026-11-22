# SUMMARY — round `2026-11-23_0005`

## What I did
- Restored the previous round's tip `3958290` (`2026-11-22_0030`) onto this branch, which the
  runner had cut from the stale base `3503537` again. Restore is its own commit; tree identity
  `HEAD^{tree}` = `3958290^{tree}` = `e09273db55aae7aadb5a8363855b22aba2ec9961`.
- Checked all five owner-answer channels. None of them has an answer, so this round is a no-op
  as the queued Next task says.
- Ran Verify and all five parity-harness keys. Every result matches the expected values.
- Added this round's block to `## Next task` in `AUTOPILOT.md` and moved the restore target to
  `2026-11-23_0005`.

## Why
- The prompt's `## Next task` arrived empty. The real task is in the restored `AUTOPILOT.md`:
  if no `## Open decisions` entry in `README.md` has been answered, restore, check, verify and
  stop, and invent no other work (hard rule 5).
- Picking the tip by `--sort=-committerdate` instead of by sha matters this round. The sha-sorted
  "trap" form would have restored `df44cfc` (`_0010`) and dropped `_0020` and `_0030`, because
  `node -e "console.log('3958290'<'df44cfc')"` prints `true`. That makes the measured result
  TAILS, and the running record is now 143/219.

## Verification
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`, run
  bare, exited 0:
  - `54 passed, 0 failed`
  - `tokens in sync: 22/22`, `fonts in sync: 4/4`, plus the four checks across 15 CSS sources
    (no derived-colour literals, font weights available, no radius literals, typeface from one
    source)
  - vitest: `12 passed (12)` test files, `31 passed (31)` tests
- Owner-answer channels:
  - `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8. The counts
    agree, so nothing has been answered.
  - No `jspdf` file is tracked or present.
  - `git status --short --untracked-files=all` is empty.
  - `main` / `origin/main` / `mac/main` are still `ef3220e`.
  - The newest non-`auto/*` ref is dated 2026-08-13.
- Harness (`docs/btn-parity-proof.mjs`):

  | Key | Before → after | Result |
  |---|---|---|
  | `buttons` | `2488f2d` → live | 85 pairs / 17 elements, PASS |
  | `segmented` | `021b966` → live | 45 / 9, PASS |
  | `toast` | `de07ea8` → `10e8f39` | 5 / 1, PASS |
  | `ds-disabled-hover` | `3958290:design-system/src/styles.css` → live | 15 / 3, PASS + 1 undecidable |
  | `toast-hit` | `3d3d5cc` → live | `FAIL — 5` across 10 pairs, which is the expected result |

  All five `✗` rows from `toast-hit` are on `#toastUndo` (`(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`). None is on `#toast`.

## What I did NOT do
- I answered none of the eight open decisions in `README.md`, and I didn't apply decisions
  2/5/6/7 on my own. Each of them moves pixels or adds a file, so each is the owner's call.
- I didn't change `index.html`, the design-system CSS or the tests.
- I didn't retry the browser MCPs (decision 4: they are blocked by permissions).

## Risk
- This round changes documentation only. The restore commit carries the whole previous tree, so
  review the branch by tree identity, not by its diff against `3503537`.
- The stall is still there. Every remaining acceptance criterion is waiting on an owner decision
  in `README.md → ## Open decisions`, and more rounds won't clear it without one.
