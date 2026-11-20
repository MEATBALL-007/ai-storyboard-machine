# SUMMARY — round 2026-11-21_0030

## What I did
- Restored the previous round's tip, `4708328` (`2026-11-21_0020`). The runner cut this branch from
  the stale base `3503537` again. The restore is its own commit, and the trees match:
  `HEAD^{tree}` = `4708328^{tree}` = `8ca69500…`.
- Checked all five owner-answer channels. None has an answer, so this is a no-op round. That is what
  the restored `## Next task` says to do when nobody has answered.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and moved the "tip to restore" line to
  `2026-11-21_0030`. The Next task itself is unchanged: wait for owner answers.

## Why
- **The prompt's `## Next task` was empty.** The real one is in the branch's `AUTOPILOT.md`, and you
  only see it after the restore. It says to do nothing unless the owner has answered one of the
  eight decisions in `README.md → ## Open decisions`. Hard rule 5 forbids inventing a substitute task.
- **How I picked the tip:** `for-each-ref --sort=-committerdate`. This branch's own ref still pointed
  at `3503537` when I read it, so nothing had to be dropped. Row 1 was `4708328` (`_0020`); the local
  and `origin/` refs agreed. 2026-11-21 held three tips (`4708328`, `44d83e0`, `360c6bb`).
- **Live A/B of the sha-sort trap: HEADS.** Ranking by sha (`| sort -r`) would also have put
  `4708328` first among the 11-21 tips (`node -e` → `'4708328'>'44d83e0'` true, `>'360c6bb'` true),
  so the trap form would not have lost work this time. Record: 141 failures out of 215 rounds (141/211).
- Next round (if still 11-21): 4 tips, comparand `4708328`; TAILS if this round's closing sha sorts below it.

## Verification
- `git rev-parse HEAD^{tree} 4708328^{tree}` → both `8ca69500b0cc6d1f0bb16e2f2bad2d8f14e0d67c`
- Owner channels:
  - `grep -c "| Option | Cost |" README.md` → 8; `grep -c "If you answer:"` → 8
  - no `jspdf*` file in the repo
  - `git status --short --untracked-files=all` empty
  - `main` = `ef3220e`
  - newest non-`auto/*` ref is 2026-08-13 (`design-system` at `3503537`)
- Verify: `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` → exit 0
  - test.mjs: `54 passed, 0 failed`
  - check-tokens: 22/22 tokens and 4/4 fonts in sync; colour, weight, radius and font-family checks pass on all 15 CSS sources
  - design-system: `Tests 31 passed (31)`, 12 files
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html` → 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS
  - `ds-disabled-hover 4708328:design-system/src/styles.css design-system/src/styles.css` → 15 / 3, PASS, plus 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ` across 10 pairs, exit 1. All five `✗` rows are `#toastUndo` ((base), :hover, :disabled, :disabled:hover, :focus); none is `#toast`. This FAIL is the expected result for this key.

## What I did NOT do
- Did not answer any open decision (jsPDF, chip/segmented/input padding, the spacing scale, browser
  verification, disabled-hover, `docs/design-parity.md`). Each one is the owner's call.
- Did not touch any `.css`, `index.html` or test file. This round changed only `AUTOPILOT.md` and
  `SUMMARY.md` (plus the restore commit, which is byte-identical to `4708328`'s tree).

## Risk
- No code changed, so there is no code risk. The real risk is the stall: three acceptance criteria
  stay open until the owner answers decisions 1–7 in `README.md`. More rounds will not change that.
- Still never verified in a real browser. Decision 4 is still unanswered.
