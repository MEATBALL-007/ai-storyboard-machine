# Round 2026-09-17_0011 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  again (`tools/` held only `test.mjs`, `docs/` had no `btn-parity-proof.mjs`, `index.html` was
  191,094 bytes instead of 308,916 — the same three independent tells). Selected the real tip with
  `git for-each-ref --sort=-committerdate` → `39d0934`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-16_0200`, `2026-09-16 02:09:23`), restored with
  `git checkout 39d0934 -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Ran the tip-selection A/B and it diverged ("tails"), exactly as `_0200` predicted at ~83.8%.**
  The wrong formula would have restored `d68882c` (`_0020`) and silently discarded **two** rounds
  (`_0030` and `_0200`). Damage this round: **0**, because the correct formula picked the tip
  *before* the checkout.
- **Corrected a wrong conditional in `_0200`'s forecast and updated `## Next task` in `AUTOPILOT.md`
  only.** Per the convention started in `_0035`/`_0041`, a no-op round does not append a status
  block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**, because the prompt
  carries the `3503537` copy of `AUTOPILOT.md`, which predates that section existing. The real task
  is only readable *after* the restore, so the first action was `git log`, not a Read.
- **`_0200`'s forecast stated the right probability but the wrong *condition*, and this round is the
  counterexample that proves it.** `_0200` wrote: "if the next round is the *first* of `2026-09-17`,
  that day has one tip → structural mask → risk 0%." This round **is** the first round of
  `2026-09-17`, and the risk was nevertheless the full ~83.8% — the A/B came out tails. The reason
  is that a round's own branch is **not yet a tip of its own day** when the round starts: it points
  at the stale base `3503537`, dated `2026-08-13`. The newest day actually holding a tip was still
  `2026-09-16`, with four tips tied at day granularity. **The correct condition is: the mask appears
  when the *previous* round was the only tip of its day — not when *this* round crosses into a new
  day.** That is also what really produced the `_0010`→`_0020` mask. I wrote this correction into
  `## Next task` because a future round that trusts the old wording would skip the A/B on a day it
  was most needed.
- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` == `git rev-parse
  39d0934^{tree}` (both `a35a63d223dee2fd3d4e4c491a2dd4d621cebd85`) proves the snapshot agrees on
  *every path at once*, including files a path-checkout cannot delete — which a `git diff --stat`
  cannot show.
- **Ran the A/B over `refs/remotes/origin/` only**, as `_0200` recommended. This round's branch is
  unpushed, so `origin/` cannot contain it — verified with
  `git for-each-ref refs/remotes/origin/ | grep -c '2026-09-17'` → `0`. The table is clean by
  construction rather than by hand-filtering, so no round-ordering constraint was paid.

## Verification

Verify command — all three stages green:

- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → all 6 checks pass at **15 CSS sources**: tokens 22/22,
  fonts 4/4 byte-identical, no derived-colour literals, every font-weight in {400,500,700,800},
  every `border-radius` reads a `--r-*` token, every `font-family` reads `var(--mono)`
- `npm --prefix design-system test` → `12 passed (12)` files, `31 passed (31)` tests

Parity harness — all five keys match the documented table exactly:

| key | result |
|---|---|
| `buttons 2488f2d:index.html index.html` | PASS, 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented 021b966:index.html index.html` | PASS, 45 / 9, markup 0 gone / 3 new |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1, markup 0 gone / 1 new |
| `ds-disabled-hover 39d0934:…/styles.css …/styles.css` | PASS, 15 / 3, markup `N/A — the source is a stylesheet`, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. All five
`✗` rows are `#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`), each
showing `pointer-events (unset) → auto <- .toast-act`; **no `#toast` row appears**, which is the
evidence that `pointer-events:none` was not removed from the container. The `ds-disabled-hover`
before-side was read from the tip this round actually restored (`39d0934`), not copied from an
older block; its 1 undecidable rule is `.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`a35a63d…`), not merely an empty diff.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   A divergence would be the signature of an answered decision; there is none.
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

A/B on tip selection (run over `origin/` refs only, before the checkout, no hand-filtering):

- **Wrong** formula (`%(committerdate:short)` + `| sort -r`) → row 1 = `d68882c` = `_0020` ✗
  (rows 2–4 = `a14011f` `_0010`, `3cbd244` `_0030`, `39d0934` `_0200` — ordered by sha spelling)
- **Right** formula (`--sort=-committerdate`) → row 1 = `39d0934` = `_0200` ✓
- Cross-checked date-major by refname: newest day holding a tip = `2026-09-16`, highest round
  number that day = `_0200`. Both methods agree.
- Cumulative record of the wrong formula: **tails 22 of 36** (excluding the 3 structural heads,
  **22/33**).

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check.** All 22 tokens are covered by the 6 existing checks; the contract
  concluded there is nothing left to enforce.
- **Did not retry `git merge --ff-only` or `git read-tree`** — both are recorded as
  permission-denied, and re-testing them burns calls for a known answer. (`git ls-tree` with a `--`
  pathspec was newly refused this round; `git show --stat` and `git ls-files` covered the same need.)
- **Did not trim `AUTOPILOT.md`** (now 3,516 → 3,553 lines). Deleting accumulated history is an owner
  call, even though its size is what truncates `## Next task` out of the runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.
- **Next round is the one where the "round number runs backwards" trap bites.** The correct tip will
  be `_0011` (day `2026-09-17`), but the highest round number *overall* is still `_0200` from
  `2026-09-16`. A selector that ranks by refname alone picks `_0200` and **discards this round
  undetectably** — residual diff empty, all 5 harness keys matching, Verify green on all three
  stages, precisely because this round is a no-op. Only date-major verification catches it.
- **Next round's day-granularity risk is 0%, but structurally and for one round only.** When this
  round closes, `2026-09-17` holds exactly one tip, so `sort -r` separates it on the date field
  before ever reaching the sha. Do not read that as the bug being fixed — `_0010` issued the same
  warning and the ratchet returned immediately.
- **`_0200`'s forecast had a correct number attached to a wrong condition**, and no automated check
  would have flagged it; it took re-deriving the claim against this round's observed table. Treat the
  forecast blocks in `## Next task` as reasoning to re-check, not as results to copy.
- **The runner's stale-cut bug is now ~5 weeks old and still unfixed**, and `main` is still `ef3220e`
  from 2026-06-27. Every round pays a restore before it can do anything, and every round is one wrong
  tip-selection away from silently discarding work. This is the single highest-value thing an owner
  could fix, and no round can fix it from inside.
- **The app has still never been verified in a real browser.** Playwright and Chrome-DevTools MCP are
  permission-blocked, not merely headless. Every claim about `:hover`, hit-testing, and
  `pointer-events` rests on source reading plus the CSS spec — and jsdom does no hit testing, so the
  31 design-system tests cannot confirm any of it either. Decision 4 still gates this.
- **A silent-edit hole remains open by design:** no checker inspects `:hover`, and the parity harness
  is deliberately outside the Verify command. A round that quietly changed hover colours in
  `Button.css` / `Menu.css` / `index.html` would still show three green Verify stages. That is
  precisely why decisions 2 / 5 / 6 / 7 must be answered rather than guessed at.
