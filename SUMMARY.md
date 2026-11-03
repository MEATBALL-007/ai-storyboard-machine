# SUMMARY — round `2026-11-04_0024`

## What I did
- Restored the previous round's tip `45ec09d` (`2026-11-04_0013`) onto this branch. The runner had again cut it from the stale base `3503537`. I ran `git checkout 45ec09d -- .` and committed the result on its own. The tree shas match: `git rev-parse HEAD^{tree} 45ec09d^{tree}` printed `eae08b2a0095939a5f4e3d6d808ff96fe67dae91` both times.
- Read `## Next task` from the restored `AUTOPILOT.md`, because the prompt delivered it empty. It says to check `README.md → ## Open decisions` and run a no-op round if nothing has been answered.
- Checked all five owner-answer channels. None of them has an answer (details under Verification).
- Measured the ranking tiebreak live. After I dropped my own ref (`17c95c4`), `2026-11-04` held two tips. The correct `--sort=-committerdate` form ranks `45ec09d` first. The trap form (sha + `| sort -r`) ranks `bf66ead` first, which would have thrown away `_0013`. That makes this round TAILS, as `_0013` predicted, and the record is now 108/165 (108/161).
- Wrote this round's entry and the next round's forecast into `AUTOPILOT.md`. The next round is a live tiebreak with 3 tips on 11-04 and comparand `bf66ead`.

## Why
- None of the eight open decisions has been answered. Every remaining acceptance criterion depends on one of them: chip, segmented and input padding (decisions 2, 5 and 6), jsPDF (decision 1) and browser verification (decision 4). The contract forbids inventing substitute work, so this round stops after verification.

## Verification
- Channel 1: `grep -c "| Option | Cost |" README.md` printed `8` and `grep -c "If you answer:" README.md` printed `8`. The two counters agree, which means nothing has been answered.
- Channel 2: there is no `jspdf*` file, tracked or untracked. `git ls-files | grep -i jspdf` printed nothing and `ls jspdf*` printed "No such file".
- Channel 3: `main` is still at `ef3220e`.
- Channel 4: `git status --short --untracked-files=all` printed nothing after the restore commit.
- Channel 5: the newest non-`auto/*` ref is `design-system` / `origin/design-system` at `3503537`, dated 2026-08-13.
- Tiebreak: `node -e "console.log('45ec09d'<'bf66ead')"` printed `true`.
- Verify, run bare:
  - `node tools/test.mjs` printed `54 passed, 0 failed`.
  - `node tools/check-tokens.mjs` passed all 6 checks: 22/22 tokens, 4/4 fonts, and 15 CSS sources clean for colour, weight, radius and font-family.
  - `npm --prefix design-system test` printed `12 passed (12)` test files and `31 passed (31)` tests.
- Harness, all 5 keys:
  - `buttons` (`2488f2d:index.html` → live): 85 pairs across 17 elements, PASS.
  - `segmented` (`021b966:index.html` → live): 45 pairs across 9 elements, PASS.
  - `toast` (`de07ea8:index.html` → `10e8f39:index.html`): 5 pairs across 1 element, PASS.
  - `ds-disabled-hover` (`45ec09d:design-system/src/styles.css` → live): 15 pairs across 3 elements, PASS, plus `1 undecidable rule(s)`.
  - `toast-hit` (`3d3d5cc:index.html` → live): `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), and none of them is `#toast`. FAIL-5 is the expected result here, because it records the intentional `pointer-events:auto` fix.

## What I did NOT do
- I didn't answer, implement or work around any of the eight open decisions. Each one moves pixels or adds a file, so the owner has to make it.
- I didn't touch `index.html`, any CSS, any test or the Verify command.
- I didn't retry browser verification, because the Playwright and Chrome-DevTools MCPs are permission-blocked (decision 4).

## Risk
- Low. This round changed only three things: the restore commit (tree-identical to `45ec09d`), `AUTOPILOT.md` and this file.
- The stall continues. Integration can't move until someone answers `README.md → ## Open decisions`, and more no-op rounds won't change that.
- The runner bug is still there: every round branch is cut from `3503537` instead of the previous tip. A round that skips the restore silently throws away all the work done since that base. This round's live tiebreak also shows that ranking tips by sha instead of commit date would have dropped a round.
