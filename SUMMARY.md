# SUMMARY — round 2026-11-29_0009

## What I did
- The branch was cut from the stale base `3503537` again. I restored the previous round's tip `6c73cef` (`2026-11-28_0039`) with `git checkout 6c73cef -- .` and committed it as a separate restore commit. Tree identity matches: `HEAD^{tree}` = `6c73cef^{tree}` = `56e9194b…`.
- The prompt's Next task arrived **empty**, so I followed the Next task in the restored `AUTOPILOT.md`. It says this is a no-op round unless an owner decision has been answered.
- I checked all five answer channels and found no answer, so I changed no code or CSS.
- I ran the A/B measurement that `_0039` forecast (this is the first round of 11-29, compared against the 4 tips on 11-28). Result: **TAILS**. The record is now 153/234 (153/230).
- I added this round's entry to the `## Next task` block of `AUTOPILOT.md` and pointed the next restore at this round's tip. The next round is a MASK round, because this is the only tip on 11-29.

## Why
- All remaining work is blocked on 8 open owner decisions in `README.md → ## Open decisions`. Each one moves pixels or adds a file, so the owner has to make them. Hard rule 5 and the in-repo Next task both say not to invent a substitute task.

## Verification
- `git for-each-ref --sort=-committerdate …` before the restore listed `6c73cef` `_0039` first (local and `origin/` match), followed by `3fa7315` `_0029`, `45b63dd` `_0019` and `ce9a718` `_0009`. My own ref still pointed at `3503537`.
- Trap form: `node -e` sorts the 11-28 shas descending as `['ce9a718','6c73cef','45b63dd','3fa7315']`. The trap would restore `ce9a718` and discard `_0019`, `_0029` and `_0039`, so this round counts as TAILS.
- The five channels:
  - `grep -c "| Option | Cost |" README.md` = 8 and `grep -c "If you answer:" README.md` = 8.
  - There is no `jspdf*` file.
  - `git status --short --untracked-files=all` is empty.
  - `main` = `ef3220e`.
  - The newest non-`auto/*` ref is `design-system` at 2026-08-13.
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`) passed:
  - `54 passed, 0 failed`
  - check-tokens: tokens 22/22, fonts 4/4, and the 4 checks over 15 CSS sources all pass
  - vitest: `Tests 31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons 2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS
  - `segmented 021b966:index.html index.html`: 45 / 9, PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover 6c73cef:design-system/src/styles.css design-system/src/styles.css`: 15 / 3, PASS, plus 1 undecidable rule
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` over 10 pairs. All five `✗` rows are `#toastUndo`. This is the expected result.

## What I did NOT do
- I answered none of the 8 open decisions and applied none of decisions 2/5/6/7 on my own.
- I did not add the harness to Verify, restore `docs/design-parity.md` (decision 8), or retry the browser MCPs (decision 4, permission-blocked).

## Risk
- Low. This round changed only `AUTOPILOT.md` (one Next-task log entry) and `SUMMARY.md`, and the restore commit is tree-identical to `6c73cef`.
- The runner bug is still there: every branch is cut from `3503537`, so a round that doesn't restore first would wipe out weeks of work. The project will stay stalled until a person answers the decisions in `README.md`.
