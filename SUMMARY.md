# SUMMARY — round `2026-11-05_0029`

## What I did
- Restored the previous round's tip, `c3165b8` (`2026-11-05_0014`). The runner had cut this branch from the stale base `3503537` again. I ran `git checkout c3165b8 -- .` and committed the restore on its own. `git rev-parse HEAD^{tree}` printed `af4e7f195435b05182e782c488d094cd81fdd9c8`, which matches the tip's tree `af4e7f1` from `for-each-ref`.
- Did **not** run the prompt's task. The prompt carried the **original `3503537` contract**: 3,756 lines, a 2-stage Verify, and "add the tokens to `index.html`". That task was finished on 2026-08-21. The restored tree has 22/22 tokens in sync and a 3-stage Verify. Per hard rule 5, I followed the restored `AUTOPILOT.md` `## Next task` (line 340) instead. It says: check `README.md → ## Open decisions` first, and if nothing has been answered, run a no-op round.
- Checked all five owner-answer channels. None of them has an answer, so this is a no-op round.
- Recorded the tip-ranking A/B in `AUTOPILOT.md`. The result was HEADS, as `_0014` predicted: the sha-sorted trap form also put `c3165b8` in row 1. The record is now tails 110/168 (110/164).
- Found and recorded a local-only ref, `2026-11-05_0024`, pointing at `3503537` with no `origin/` copy. A round ran under that name, committed nothing and was never pushed.

## Why
- The prompt's contract is stale. Running its token pass on the restored tree would find nothing to do. Running it on the unrestored tree would make the stale tree look "done", which is the failure that cost `docs/design-parity.md` in round `2026-08-19_0022`.
- All remaining acceptance criteria are blocked on the eight owner decisions in `README.md → ## Open decisions`. Answering one would move pixels or add files, so that is the owner's call. I did not answer any.

## Verification
- Channel 1: `grep -c "| Option | Cost |" README.md` printed `8`, and `grep -c "If you answer:" README.md` printed `8`. The two counters agree, so nothing was answered.
- Channels 2 and 4: `ls jspdf*` found nothing, and `git status --short --untracked-files=all` was empty.
- Channels 3 and 5: `main` = `ef3220e`. The newest non-`auto/*` ref is `design-system` / `origin/design-system` at `3503537`, dated 2026-08-13.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` passed:
  - `54 passed, 0 failed`
  - check-tokens 6/6: tokens 22/22, fonts 4/4, and 15 CSS sources clean for derived colours, font weights, radius and typeface
  - vitest `12 passed (12)` files, `31 passed (31)` tests
- I also ran the prompt's own 2-stage Verify (`node tools/test.mjs && npm --prefix design-system test`). It is a subset of the command above, so it is green too.
- `docs/btn-parity-proof.mjs`, all 5 keys:
  - `buttons 2488f2d:index.html index.html`: 85/17 PASS
  - `segmented 021b966:index.html index.html`: 45/9 PASS
  - `toast de07ea8:index.html 10e8f39:index.html`: 5/1 PASS
  - `ds-disabled-hover c3165b8:design-system/src/styles.css design-system/src/styles.css`: 15/3 PASS, plus 1 undecidable rule (`.pui-menu__item:last-child`)
  - `toast-hit 3d3d5cc:index.html index.html`: `FAIL — 5 declaration(s) differ` across 10 pairs. All five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), with `after : auto <- .toast-act`. This is the expected result: it proves the deliberate `pointer-events:auto` fix.
- A/B: `node -e "console.log('c3165b8'<'34fcbf7')"` printed `false`. After dropping my own `_0029` (`6b23714`), the sha-sorted list for 11-05 was `c3165b8`, `3503537` (`_0024`), `34fcbf7`. Row 1 = real tip, so the result is HEADS.

## What I did NOT do
- Did not do the prompt's token-mapping task. It was finished in August, and the restored contract supersedes it.
- Did not answer or apply any of the eight open decisions, did not restore `docs/design-parity.md` (that is decision 8), and did not touch `storyboard-simulator.html` or the test markers.
- Did not investigate why `_0024` left an empty ref. That is runner behaviour and is outside this repo.

## Risk
- Low. The only changes are the restore commit, which is tree-identical to `c3165b8`, plus docs (`AUTOPILOT.md` Next task log and this file). No CSS or JS changed.
- The empty `_0024` ref doesn't affect tip selection today. Its committerdate is 2026-08-13, and `'3503537'` sorts below every 11-05 sha. Still, a future round reading `for-each-ref` by eye could mistake it for a real round tip. It holds no work, so never restore it.
- Next round: if it is still 11-05, there are 3 real tips and the comparand is `c3165b8`. It comes up TAILS only if this round's closing sha < `c3165b8`.
