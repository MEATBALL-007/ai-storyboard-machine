# Round 2026-09-16_0200 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base
  `3503537` again (`tools/` held only `test.mjs`, `docs/` had no `btn-parity-proof.mjs`,
  `index.html` was 191,094 bytes instead of 308,916 — three independent tells). Selected the
  real tip with `git for-each-ref --sort=-committerdate` → `3cbd244`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-16_0030`, `2026-09-16 00:31:44`), restored with
  `git checkout 3cbd244 -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered,
  so the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its
  documented expected result (details under Verification).
- **Ran the tip-selection A/B and it diverged ("tails").** The wrong formula would have restored
  `d68882c` (`_0020`) and silently discarded `_0030`. Damage this round: **0**, because the
  correct formula was used to pick the tip *before* the checkout.
- **Updated `## Next task` in `AUTOPILOT.md` only** — recorded the A/B result and wrote the next
  round's forecast (~83.8% tails, comparand `d68882c`). Per the convention started in
  `_0035`/`_0041`, a no-op round does **not** append a status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**, because the prompt
  carries the `3503537` copy of `AUTOPILOT.md`, which predates that section existing. The real
  task is only readable *after* the restore. So the first action was `git log`, not a Read.
- **Tree-SHA identity as the restore proof.** `git diff --stat 3cbd244` printed nothing, but that
  only proves the rows that printed matched. `git rev-parse HEAD^{tree}` ==
  `git rev-parse 3cbd244^{tree}` (both `c6b582ed8d5e591e19460f794fb24d95299a74de`) proves the
  snapshot agrees on *every path at once*, including files a path-checkout cannot delete.
- **`git merge --ff-only` was attempted and refused** ("This command requires approval"), exactly
  as the contract predicted, even though `3cbd244`'s parent *is* `3503537` and it would have been
  a clean fast-forward. `git checkout <tip> -- .` remains the only available route.
- **Ran the A/B over `refs/remotes/origin/` instead of all refs.** Rounds `_0035` and `_0010` both
  had to hand-filter their own branch out of the table because they committed the restore before
  running the A/B, which weakens the evidence (a manual filter can filter wrongly, unobserved).
  This round's branch is unpushed, so `origin/` **cannot** contain it — verified by
  `git for-each-ref refs/remotes/origin/ | grep '_0200'` returning empty. The table is clean by
  construction rather than by hand, so the ordering constraint no longer costs anything.

## Verification

Verify command — all three stages green:

- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → all 6 checks pass at **15 CSS sources**: tokens 22/22,
  fonts 4/4 byte-identical, no derived-colour literals, font weights all in {400,500,700,800},
  every `border-radius` reads a `--r-*` token, every `font-family` reads `var(--mono)`
- `npm --prefix design-system test` → `12 passed (12)` files, `31 passed (31)` tests

Parity harness — all five keys match the documented table exactly:

| key | result |
|---|---|
| `buttons 2488f2d:index.html index.html` | PASS, 85 pairs / 17 elements, markup 7 gone / 5 new, no undecidable |
| `segmented 021b966:index.html index.html` | PASS, 45 / 9, markup 0 gone / 3 new |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1, markup 0 gone / 1 new |
| `ds-disabled-hover 3cbd244:…/styles.css …/styles.css` | PASS, 15 / 3, markup `N/A — the source is a stylesheet`, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. All
five `✗` rows are `#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`);
**no `#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from
the container. The `ds-disabled-hover` before-side was read from the tip this round actually
restored (`3cbd244`), not copied from an older block.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — `git diff --stat 3cbd244` empty **and** tree SHAs equal.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   A divergence would be the signature of an answered decision; there is none.
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

Restored tip authorship: `git log -1 --format='%h %an <%ae> %ad %s' 3cbd244` →
`PHANTOM AUTOPILOT <autopilot@phantom.local>` — a runner commit, not an owner commit.

A/B on tip selection (run over `origin/` refs only, no hand-filtering):

- **Wrong** formula (`%(committerdate:short)` + `| sort -r`) → row 1 = `d68882c` = `_0020` ✗
- **Right** formula (`--sort=-committerdate`) → row 1 = `3cbd244` = `_0030` ✓
- Cross-checked date-major by refname: newest day holding a tip = `2026-09-16`, highest round
  number that day = `_0030`. Both methods agree.

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This
  round's own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button
  staying bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own
  `:disabled:hover` guard at equal specificity `(0,3,1)`). Both are real and both move visible
  colour, so they are owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check.** All 22 tokens are covered by the 6 existing checks; the
  contract concluded there is nothing left to enforce.
- **Did not retry `git merge --ff-only` more than once**, or try `git read-tree` at all — both are
  recorded as permission-denied, and re-testing them burns calls for a known answer.
- **Did not trim `AUTOPILOT.md`** (now 3,491 → 3,516 lines / ~486 KB). Deleting accumulated
  history is an owner call, even though its size is what truncates `## Next task` out of the
  runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed
  `pointer-events:none` from the container and the toast now blocks clicks across 80vw for 5s.
- **The runner's stale-cut bug is now ~4.5 weeks old and still unfixed**, and `main` is still
  `ef3220e` from 2026-06-27. Every round pays a restore before it can do anything, and every round
  is one wrong tip-selection away from silently discarding work. This is the single highest-value
  thing an owner could fix, and no round can fix it from inside.
- **Next round's tip-selection risk is ~83.8%** — the highest recorded — if it lands on
  `2026-09-16` (comparand `d68882c`, and a wrong pick discards **two** rounds). If it is instead
  the first round of `2026-09-17`, that risk is structurally 0 for one round only, but the
  "round number runs backwards" trap (`_0200` → `_0010`) goes live in its place. Date-major
  verification defends against both; nothing else does.
- **The app has still never been verified in a real browser.** Playwright and Chrome-DevTools MCP
  are permission-blocked, not merely headless. Every claim about `:hover`, hit-testing, and
  `pointer-events` rests on source reading plus the CSS spec — and jsdom does no hit testing, so
  the 31 design-system tests cannot confirm any of it either. Decision 4 still gates this.
- **A silent-edit hole remains open by design:** no checker inspects `:hover`, and the parity
  harness is deliberately outside the Verify command. A round that quietly changed hover colours
  in `Button.css` / `Menu.css` / `index.html` would still show three green Verify stages. That is
  precisely why decisions 2 / 5 / 6 / 7 must be answered rather than guessed at.
