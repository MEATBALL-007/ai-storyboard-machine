# SUMMARY — round `2026-11-08_0022`

## What I did
- Restored the previous round's tip. The runner cut this branch from the stale base `3503537` again. I restored `98663a6` (`2026-11-08_0011`, same sha locally and on `origin/`) with `git checkout 98663a6 -- .` and committed the restore on its own (`704fe8c`).
- Checked all five owner-answer channels and found no answer in any of them. Under the restored `## Next task`, that makes this a no-op round.
- Ran the three-stage Verify command and all five parity-harness keys. Every result matches the expected values.
- Ran the A/B ranking test, as `_0011` forecast. After dropping my own ref (`704fe8c`), `2026-11-08` held two tips. The correct form (`--sort=-committerdate`) put `98663a6` (`_0011`) at row 1. The trap form (sha + `| sort -r`) put `d38ce60` (`_0001`) at row 1, which is TAILS: it would have thrown away `_0011`. The record is now tails 117/176 (117/172).
- Added this round's entry to the `## Next task` block in `AUTOPILOT.md` (`1ccfa1e`), with the forecast for the next round.

## Why
- The prompt's `## Next task` was empty. The task lives in the restored `AUTOPILOT.md`: check the README's `## Open decisions` first, and if nothing has been answered, restore, check, verify, summarise, and stop. I followed that and did not make up any other work (hard rule 5).
- All remaining acceptance-criteria work is waiting on eight owner decisions in `README.md`. Each one moves pixels or adds a file, so the owner has to make it.

## Verification
- Restore: `git rev-parse HEAD^{tree} 98663a6^{tree}` printed `a9e97716eee0d391465ec82f47abc87a2832ab4d` twice. The trees are identical on every path.
- A/B: `node -e "console.log('98663a6'<'d38ce60')"` printed `true`.
- The five channels:
  1. `grep -c "| Option | Cost |" README.md` returned 8, and `grep -c "If you answer:"` returned 8. Both counts still agree.
  2. There is no `jspdf` file, either tracked or on disk.
  3. `main` is still at `ef3220e`.
  4. `git status --short --untracked-files=all` is empty.
  5. The newest non-`auto/*` ref is `design-system` (2026-08-13).
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` passed all three stages:
  - `54 passed, 0 failed`
  - check-tokens passed all six checks (tokens 22/22, fonts 4/4, colours, weights, radius, font-family) across 15 CSS sources
  - vitest: `Tests 31 passed (31)`
- Harness (`docs/btn-parity-proof.mjs`):
  | key | before → after | result |
  |---|---|---|
  | `buttons` | `2488f2d` → live | 85 pairs / 17 elements, PASS |
  | `segmented` | `021b966` → live | 45 / 9, PASS |
  | `toast` | `de07ea8` → `10e8f39` | 5 / 1, PASS |
  | `ds-disabled-hover` | `98663a6:design-system/src/styles.css` → live | 15 / 3, PASS + 1 undecidable |
  | `toast-hit` | `3d3d5cc` → live | `FAIL — 5 declaration(s) differ` over 10 pairs |

  The `toast-hit` FAIL is the expected result. All five ✗ rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), and none is `#toast`.

## What I did NOT do
- I did not answer any of the eight open decisions or apply decisions 2/5/6/7 on my own authority.
- I did not restore `docs/design-parity.md`. That is decision 8.
- I did not retry the browser MCPs. They are blocked by permissions, not just by the server being headless.

## Risk
- Low. This round changes only `AUTOPILOT.md` and `SUMMARY.md`, plus the restore commit, which has the same tree as `98663a6`.
- The next round must measure live. `2026-11-08` will hold three tips with comparand `d38ce60`. It comes up TAILS only if this round's closing sha sorts below `d38ce60`, and in that case the trap form would throw away `_0011` and `_0022`.
- The project is still stalled. Nothing in the acceptance criteria can move until the owner answers a README decision or drops `jspdf.umd.min.js` into the repo.
