# Round `2026-09-23_0028` — no-op (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again. I picked the tip date-major with `git for-each-ref --sort=-committerdate`
  and restored `615ad9d` (`…/2026-09-23_0018`) as its own commit.
- **Checked all five owner-answer channels. None of the eight open decisions has an answer.**
  Per the pinned `## Next task`, this is a deliberate no-op round. I did not invent substitute work.
- **Ran the full Verify command (three stages): all green.** I also ran all five parity-harness
  keys, and every number matches the established table.
- **Resolved `_0018`'s forecast: tails, measured by a live A/B.** After dropping my own ref,
  `2026-09-23` holds two tips, so the sha tiebreak ran for real. The correct formula put
  `615ad9d` at row 1. The sha-first trap formula put `e33b058` (`_0008`) at row 1, which would
  have silently thrown away all of `_0018`. Record: **tails 34 of 54** (34/50 excluding
  structural heads).
- **Wrote the next round's forecast into `AUTOPILOT.md`.** `2026-09-23` will hold three tips.
  The comparand is still `e33b058`, so `P(tails)` ≈ 88.76%. If the trap formula is used and
  comes up tails, it would discard two rounds (`_0018` + `_0028`).

## Why

- **The restore comes before any Read.** On this repo a stale tree looks *finished*, not broken.
- **The A/B counts this round.** The mask rule is "exactly one tip on the newest remaining date
  after dropping my own ref". Here that date held two tips, so this is a real measurement,
  unlike `_0018`'s masked round.
- **I committed `AUTOPILOT.md` before writing this file** (separate commits), so a timeout could
  not cost both.
- **I did not answer any of the eight decisions myself.** Decisions 2/5/6/7 move pixels a human
  will see. No checker here looks at `:hover`, and jsdom does no hit testing. So a round that
  "just tries it" would stay green on all three Verify stages while changing the product.

## Verification

- Restore identity: `git rev-parse HEAD^{tree}` and `git rev-parse 615ad9d^{tree}` both print
  `ac7da2d03385c8dc93516fe130295ed3c0f5e3d0`.
- Tip has real work: `git log --oneline -3 615ad9d` = `615ad9d docs: SUMMARY…` over `b615f83 docs:`
  over `eea1820 chore: restore…`.
- Channels: README `| Option | Cost |` = 8 and `If you answer:` = 8. `git ls-files | grep -i jspdf`
  is empty. `git status --short --untracked-files=all` is empty. Non-`auto/*` refs are unchanged:
  `main`/`origin/main` = `ef3220e`, `design-system` = `3503537`, `mac*` = `e3a355c`/`592e7c3`.
- `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` →
  `54 passed, 0 failed`; check-tokens 6/6 (22/22 tokens, 4/4 fonts, 15 CSS sources);
  vitest `12 passed` files, `31 passed` tests.
- Harness: `buttons` 85 pairs/17 elements, markup 7 gone/5 new, PASS · `segmented` 45/9, markup
  0/3, PASS · `toast` (`de07ea8`→`10e8f39`) 5/1, PASS · `ds-disabled-hover` (before `615ad9d`)
  15/3, PASS + 1 undecidable (`.pui-menu__item:last-child`) · `toast-hit` `FAIL — 5
  declaration(s) differ` across 10 pairs/2 elements (the expected result). All five `✗` rows are
  `#toastUndo`, and none is `#toast`.
- A/B (trap form, own ref filtered):
  `2026-09-23 e33b058 …_0008` / `2026-09-23 615ad9d …_0018` / `2026-09-22 cf7820e …_0028`.

## What I did NOT do

- I did not apply decisions 1–8, and I did not delete or relocate `## Open decisions`.
- I did not retry the browser MCPs (decision 4 is still a permission block).
- I did not add a status block outside `## Next task`. I followed the no-op convention and only
  added the resolution and the forecast.

## Risk

- None to code: this round's diff is `AUTOPILOT.md` and `SUMMARY.md` only.
- The integration is still stalled on a person, not on work. Eight decisions have been open for
  4+ weeks, and every round since then has been a no-op like this one.
- `AUTOPILOT.md` keeps growing a little each round. Trimming its old history blocks is the
  owner's call.
