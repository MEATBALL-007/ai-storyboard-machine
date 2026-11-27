# SUMMARY — round `2026-11-27_0039`

## What I did
- The runner cut this branch from the stale base `3503537` again. I restored the previous round's tip, `8443ec2` (`2026-11-27_0027`; the local ref and `origin/` agree), with `git checkout 8443ec2 -- .` and committed that on its own. `HEAD^{tree}` and `8443ec2^{tree}` both print `2f66e2e34ecc7fac7c4f60f9379866382feaec89`.
- I checked all five places an owner answer could show up. None had one, so the restored `## Next task` makes this a no-op round.
- I added this round's record to `AUTOPILOT.md` under `## Next task`. The next tip to restore is now `2026-11-27_0039`.

## Why
- The prompt's `## Next task` was empty. The restored file's Next task says to end the round as a no-op while all eight decisions in `README.md → ## Open decisions` are unanswered. They still are, so I did not make up other work (hard rule 5).
- `_0027` predicted a live measurement for this round. `2026-11-27` held 3 tips (`8443ec2` `_0027`, `cfe6a43` `_0017`, `d613e76` `_0007`), and my own ref still pointed at `3503537` when I read the list. `node -e` sorted them `["d613e76","cfe6a43","8443ec2"]`, so the wrong ranking method (sha tie-break plus `| sort -r`) would have restored `d613e76` and dropped `_0017` and `_0027`. The result is TAILS, and the wrong-method tally is now tails 149/230.
- Next round: 11-27 will hold 4 tips and the comparand stays `d613e76`. It comes up TAILS only if this round's closing sha sorts below `d613e76`.

## Verification
- `git log --oneline -5` before the restore: `3503537` at HEAD (the stale base).
- `git for-each-ref --sort=-committerdate`: the top rows are `8443ec2` `_0027`, `cfe6a43` `_0017`, `d613e76` `_0007` (local and `origin/` each), then `6666c5d` `_0037` on 11-25.
- Owner channels: `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:" README.md` = 8; no `jspdf` file tracked or present; `git status --short --untracked-files=all` printed nothing; `main` = `ef3220e` (2026-06-27); the newest non-`auto/*` ref is `design-system` / `origin/design-system` at `3503537` (2026-08-13).
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`), run bare: exit 0. It printed `54 passed, 0 failed`; check-tokens printed tokens 22/22, fonts 4/4, and the four checks over 15 CSS sources all clean; vitest printed 12 files and 31 tests passed.
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs across 17 elements, PASS.
  - `segmented 021b966:index.html index.html`: 45 pairs across 9 elements, PASS.
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 pairs across 1 element, PASS.
  - `ds-disabled-hover 8443ec2:design-system/src/styles.css design-system/src/styles.css`: 15 pairs across 3 elements, PASS, plus 1 undecidable rule.
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo` (`pointer-events` `(unset)` → `auto` from `.toast-act`), with none on `#toast`. FAIL-5 is the expected result for this key.

## What I did NOT do
- I did not answer any of the eight open decisions or apply decisions 2, 5, 6 or 7 on my own. Each one moves pixels or adds a file, so the owner has to make those calls.
- I did not retry the browser MCPs (decision 4). They are blocked by permissions.
- I did not restore `docs/design-parity.md` (decision 8).

## Risk
- Low. This round changes only `AUTOPILOT.md` (one record block) and `SUMMARY.md`. The restore commit is tree-identical to `8443ec2`.
- The stall has not changed. The runner keeps cutting branches from `3503537`, and nothing has been merged to `main`. Rounds will keep producing no-op PRs until the owner answers an item in `README.md → ## Open decisions` or fixes the runner's branch base.
