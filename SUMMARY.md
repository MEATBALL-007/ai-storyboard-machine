# SUMMARY — round 2026-11-17_0007

## What I did
- Restored the previous round's tip `97982ac` (`2026-11-16_0032`) onto this branch. The runner cut
  it from the stale base `3503537` again. The restore is its own commit (`d505623`), and tree identity
  holds: `HEAD^{tree}` = `97982ac^{tree}` = `0b6389450a3b…`.
- Checked all five owner-answer channels. None had an answer, so this is a no-op round. That is what
  the restored `## Next task` says to do when nothing has been answered.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Measured the trap-form A/B live (first round of 11-17, against the 4 tips on 11-16). The result was
  TAILS. Logged the round in `AUTOPILOT.md` under `## Next task` and pointed the "tip to restore"
  line at `2026-11-17_0007`.

## Why
- The prompt's `## Next task` arrived empty. The real task is in the restored `AUTOPILOT.md`. When
  `README.md → ## Open decisions` has no answer, it says a round restores, checks, verifies, writes a
  SUMMARY and stops. It must not invent other work (hard rule 5).
- I picked the tip with `--sort=-committerdate` before the restore commit, while my own ref was still
  on `3503537`. That put `97982ac` (`_0032`) in row 1, and local and `origin/` agreed on it. The trap
  form (`%(committerdate:short)` + sha + `| sort -r`), run after the restore commit, puts my own
  `d505623` in row 1 and `f0dcde6` (`_0012`) in row 2. After dropping my own ref, the trap form's
  pick is `f0dcde6`, and the real tip `97982ac` falls to row 2 of 4, because `'9' < 'f'`
  (`node -e "console.log('97982ac'<'f0dcde6')"` → `true`). Following the trap form would have
  discarded `_0022` and `_0032`. So this round is TAILS, and the trap-form record is now 133 tails
  out of 202 (133/198).

## Verification
- `git rev-parse HEAD^{tree} 97982ac^{tree}` → both `0b6389450a3bfdd2df69f8e46141b19a5e616581`.
- Tip provenance: `git log -1 --format="%h | %an <%ae> | %ad | %s" 97982ac` → author
  `PHANTOM AUTOPILOT <autopilot@phantom.local>`, subject `autopilot: SUMMARY for round 2026-11-16_0032`.
  `git merge-base --is-ancestor 3503537 97982ac` → exit 0.
- Owner channels: `grep -c "| Option | Cost |" README.md` → 8, `grep -c "If you answer:" README.md` → 8.
  `ls jspdf*` → no such file. `git status --short --untracked-files=all` → empty.
  `main` = `ef3220e` (2026-06-27). The newest non-`auto/*` refs are `design-system` and
  `origin/design-system`, both at 2026-08-13.
- Verify (exit 0): `node tools/test.mjs` → `54 passed, 0 failed`. `node tools/check-tokens.mjs` →
  22/22 tokens, 4/4 fonts, and all four scans clean across 15 CSS sources. `npm --prefix design-system test` →
  `12 passed (12)` test files, `31 passed (31)` tests.
- Harness: `buttons 2488f2d:index.html index.html` → 85 pairs / 17 elements, PASS (markup coverage OK).
  `segmented 021b966:index.html index.html` → 45 / 9, PASS.
  `toast de07ea8:index.html 10e8f39:index.html` → 5 / 1, PASS.
  `ds-disabled-hover 97982ac:design-system/src/styles.css design-system/src/styles.css` → 15 / 3,
  PASS + 1 undecidable. `toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5 declaration(s) differ`
  across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`), with `after : auto <- .toast-act`, and none is `#toast`. That is the
  expected, intentional result.

## What I did NOT do
- I did not answer any of the eight open decisions in `README.md`, and I did not apply
  decisions 2/5/6/7 on my own. Each one moves pixels or adds a file, so the owner has to choose.
- I made no changes to `index.html`, `design-system/`, `tools/`, or `docs/`.
- I did not retry the browser MCPs (decision 4). They are blocked by permissions.

## Risk
- Low. The only content changes are the new log entry in `AUTOPILOT.md` and this file.
- The stall is structural. The runner still cuts every branch from `3503537`, and nothing has been
  merged to `main`. Rounds will keep doing nothing until an owner answers a decision in `README.md`
  (or drops `jspdf.umd.min.js` into the repo for decision 1).
- The next round is MASKED: once it drops its own ref, 11-17 will hold only this round's tip. If this
  round is not pushed, the newest day falls back to 11-16. There, the trap form's row 1 is `f0dcde6`,
  not the real tip `97982ac`. Pick the tip with `--sort=-committerdate`.
