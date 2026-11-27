# SUMMARY — round 2026-11-28_0029

## What I did
- The branch was cut from the stale base `3503537` again. I restored the previous round's tip `45b63dd` (`2026-11-28_0019`) with `git checkout 45b63dd -- .` and committed it as a separate restore commit. Tree identity matches: `HEAD^{tree}` = `45b63dd^{tree}` = `17943722…`.
- I followed the restored `AUTOPILOT.md` Next task (the prompt's Next task arrived **empty**). That task is a no-op round unless an owner decision has been answered.
- I checked all five answer channels and found no answer, so I made no code or CSS change.
- I ran the A/B measurement that `_0019` forecast. Result: **TAILS**. The record is now 151/232 (151/228).
- I added this round's entry to the `## Next task` block of `AUTOPILOT.md` and pointed the next restore at `_0029`'s tip.

## Why
- All remaining work is blocked on 8 open owner decisions in `README.md → ## Open decisions`. Each one moves pixels or adds a file, so the owner has to make them. Hard rule 5 and the in-repo Next task both say not to invent a substitute task.

## Verification
- `git for-each-ref --sort=-committerdate …` before the restore: row 1 = `45b63dd` `_0019` (local and `origin/` match), then `ce9a718` `_0009`. My own ref still pointed at `3503537`.
- Trap form: `node -e` sorts the 11-28 shas as `['ce9a718','45b63dd']`, and `'45b63dd'<'ce9a718'` is `true`. So the trap would restore `ce9a718` and discard `_0019`, which makes this round TAILS.
- Channels:
  - `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:"` = 8
  - no `jspdf` file is tracked or present
  - `git status` is clean
  - `main` = `ef3220e`
  - the newest non-`auto/*` ref is 2026-08-13 (`design-system`, `origin/design-system` = `3503537`)
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`) exited 0:
  - `54 passed, 0 failed`
  - tokens 22/22, fonts 4/4, and the derived-colour, font-weight, radius and font-family checks across 15 CSS sources all OK
  - vitest `31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 45b63dd:design-system/src/styles.css design-system/src/styles.css`: 15 / 3, PASS, plus 1 undecidable rule (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs. All 5 `✗` rows are `#toastUndo` (`pointer-events` `(unset)`→`auto`) and none is `#toast`. This is the correct, intended result.

## What I did NOT do
- I answered none of the 8 open decisions and applied none of decisions 2/5/6/7 on my own.
- I did not restore `docs/design-parity.md`, because that is decision 8.
- I did not retry the browser MCPs, because they are permission-blocked (decision 4).

## Risk
- None in the code: the round changes only `AUTOPILOT.md` and `SUMMARY.md`.
- The runner keeps cutting branches from `3503537`. Merging any single `auto/*` branch without the restore commit would lose months of work. The integration is still stalled on owner answers, and another round will not change that; a person needs to answer the decisions.
