# SUMMARY — round 2026-11-17_0037

## What I did
- Restored the previous round's tip, `4bab4d7` (`2026-11-17_0027`), onto this branch. The runner had
  cut the branch from the stale base `3503537` again. The restore is its own commit, and the trees
  match: `HEAD^{tree}` = `4bab4d7^{tree}` = `bc5097fd2315…`.
- Checked all five owner-answer channels. None of them has an answer, so this is a no-op round, which
  is what the restored `## Next task` says to do in that case.
- Ran Verify (all 3 stages) and all 5 parity-harness keys. Every result matches the known baseline.
- Logged the round in `AUTOPILOT.md` under `## Next task` and moved the "tip to restore" line to
  `2026-11-17_0037`. I measured the A/B live: after dropping my own ref there are three tips on
  11-17, and the result was TAILS. The trap form would have restored `a558e40` and thrown away
  `_0027`. The trap-form tally is now 134/204 (134/200).

## Why
- The `## Next task` in the prompt was empty, so I took the task from the restored `AUTOPILOT.md`.
  That file says a round with no answered owner decision should restore, check the channels, verify,
  write SUMMARY, and stop. Hard rule 5 and the file both forbid inventing substitute work. Everything
  still open either moves pixels or adds a file, and those calls belong to the owner (README
  `## Open decisions`, items 1–8).

## Verification
- `git merge-base --is-ancestor 3503537 4bab4d7` exited 0 and printed nothing.
- `git log -1 4bab4d7`: author `PHANTOM AUTOPILOT <autopilot@phantom.local>`, subject
  `autopilot: SUMMARY for round 2026-11-17_0027`. That is a runner commit, not an owner answer.
- `git rev-parse HEAD^{tree} 4bab4d7^{tree}` printed `bc5097fd2315682fe2b36b5c8fffe106690f6de1` twice.
- Channels:
  - `grep -c "| Option | Cost |" README.md` → 8 and `grep -c "If you answer:" README.md` → 8.
    The two counts agree, so no decision has been answered.
  - There is no `jspdf*` file, and `git status --short --untracked-files=all` printed nothing.
  - `main`, `origin/main` and `mac/main` all point to `ef3220e`. The newest non-`auto/*` ref is
    `design-system` / `origin/design-system` at `3503537` (2026-08-13).
- A/B: trap form (`%(committerdate:short)` + sha + `| sort -r`) row 1 = `a558e40`. With my own
  `96dfd9c` dropped, the real tip `4bab4d7` sits at row 3 of 3. `node -e "console.log('4bab4d7'<'a558e40')"`
  → `true`.
- Verify (run bare, exit 0): `54 passed, 0 failed`; check-tokens reports tokens 22/22, fonts 4/4, and
  4 more checks across 15 CSS sources, all passing; vitest reports `12 passed (12)` test files and
  `31 passed (31)` tests.
- Harness:
  - `buttons` (`2488f2d:index.html` → `index.html`): 85 pairs / 17 elements, PASS.
  - `segmented` (`021b966:index.html` → `index.html`): 45 / 9, PASS.
  - `toast` (`de07ea8:index.html` → `10e8f39:index.html`): 5 / 1, PASS.
  - `ds-disabled-hover` (`4bab4d7:design-system/src/styles.css` → `design-system/src/styles.css`):
    15 / 3, PASS, with 1 undecidable rule (`.pui-menu__item:last-child`).
  - `toast-hit` (`3d3d5cc:index.html` → `index.html`): `FAIL — 5 declaration(s) differ` over 10
    pairs. That is the expected result. All five ✗ rows are `#toastUndo` (`(base)`, `:hover`,
    `:disabled`, `:disabled:hover`, `:focus`), and none is `#toast`.

## What I did NOT do
- I did not answer or act on any of the eight open decisions. Each one is the owner's call.
- I left `index.html`, `design-system/` and `tools/` untouched. This round changed only
  `AUTOPILOT.md` and `SUMMARY.md` (plus the restore commit).
- I did not open a browser. The Playwright and Chrome-DevTools MCPs are blocked by permissions
  (decision 4).

## Risk
- Low. The round changed only documentation. The open risk is unchanged: the project stays stalled
  until someone answers README `## Open decisions`. Another round will not fix that.
- For the next round, the A/B can be read from this round's closing sha: TAILS if it is less than
  `a558e40`. In that case the trap form would throw away `_0027` and `_0037`. Restore with
  `--sort=-committerdate`, never by row number from `sort -r`.
