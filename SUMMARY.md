# Round 2026-09-18_0030 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  (`design-system`, 2026-08-13) again. Ran the tip-selection formula as the **first command of the
  round, before any checkout** → `1c3401f` (`auto/deep_dive_AI_Storyboard_Machine/2026-09-18_0018`),
  restored it with `git checkout … -- .` and committed it separately so this round's own diff stays
  readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **The A/B was a real measurement this round and it came out "ก้อย" (tails) — the prediction was
  wrong.** `_0018` forecast ~66.3% heads; the ~33.7% tail event fired. The wrong formula's row 1 was
  `563e7fc` (`_0006`), which would have silently discarded all of `_0018`. Cumulative statistic moves
  to **tails 25 of 40** (**25/37** excluding the 3 structural heads).
- **Measured something new: the ratchet does not climb every round — it climbs only on heads.**
  Because this round drew tails, next round's comparand is **unchanged** and the risk stays at
  **~33.7%**. Mechanism in Why.
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention from `_0035`/`_0041`/`_0121`/
  `_0006`/`_0018`, a no-op round does not append a `> **สถานะล่าสุด` status block; it edits the
  forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty** again. `AUTOPILOT.md` is
  now ~3,760 lines with `## Next task` at line 340, so the runner's truncation drops it. The real
  task is only readable *after* the restore, so the first actions were `git log`/`git branch
  --sort=-committerdate`, not a Read.

- **The A/B, and why it was a measurement this time.** `_0018`'s mask expired exactly as predicted:
  day `2026-09-18` held **two** tips at the start of this round (`563e7fc` `_0006`,
  `1c3401f` `_0018`), so the date field no longer settles row 1 and the sha tiebreak actually fires.
  The two formulas were therefore distinguishable, and they disagreed.

- **The ratchet is a running maximum, so it advances only on heads.** State the comparand precisely:
  for round R it is `max` over the same-day shas **excluding the previous round's** — i.e. a running
  max over rounds older than the previous one. Then:

  - **tails ⟺ previous round's sha < comparand ⟺ the comparand does not move** (the sha that just
    joined the day is below the existing max, so the max is unchanged);
  - **heads ⟺ previous round's sha > comparand ⟺ the comparand is pushed up to that new sha.**

  So risk is non-decreasing, stays *flat* through a run of tails, and jumps only when a round comes
  up heads. This retro-explains the `86.6% → 86.6%` flat step already in the log — that was a tails
  round holding the comparand, not a rounding artifact. **It is not good news:** tails is the
  outcome where the bug is load-bearing, so a flat risk number means the system is sitting in
  "constant risk, bug actually firing" for as long as the run lasts.

- **Concretely for next round:** `max(563e7fc, 1c3401f)` = `563e7fc`, unchanged, so
  P(tails) = `0x563e7fc / 0x10000000` ≈ **33.7%** again. But the blast radius **doubled**: the
  comparand has now outranked the correct tip for two consecutive rounds, so a wrong-formula restore
  next round discards `_0018` *and* this round — **2 rounds**, not 1.

- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` ==
  `git rev-parse 1c3401f^{tree}` (both `83b89463e3ad76015f9ff8d099a6312b527dbe9e`) proves the
  snapshot agrees on *every path at once*, including files a path-checkout cannot delete — which
  `git diff --stat` cannot show. `git ls-files | wc -l` = **76** (the stale tree returns 73).

## Verification

Verify command — all three stages green (run separately; this shell blocks some chained commands):

- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → all 6 checks pass at **15 CSS sources**: tokens 22/22,
  fonts 4/4 byte-identical, no derived-colour literals, every font-weight in {400,500,700,800},
  every `border-radius` reads a `--r-*` token, every `font-family` reads `var(--mono)`
- `npm --prefix design-system test` → `12 passed (12)` files, `31 passed (31)` tests

Parity harness — all five keys match the documented table exactly:

| key | result |
|---|---|
| `buttons 2488f2d:index.html index.html` | PASS, 85 pairs / 17 elements |
| `segmented 021b966:index.html index.html` | PASS, 45 / 9 |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1 |
| `ds-disabled-hover 1c3401f:…/styles.css …/styles.css` | PASS, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. I listed
all five `✗` rows rather than counting them: `#toastUndo (base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`, each showing `pointer-events (unset) → auto <- .toast-act`. **No
`#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from the
container. (I used `grep '✗'` with no anchor rather than `grep -c "✗ #toast:"`, which has a
documented blind spot — the base-state row prints `✗ #toastUndo (base)` with no colon.) The
`ds-disabled-hover` before-side was read from the tip this round actually restored (`1c3401f`), not
copied from an older block; its 1 undecidable rule is `.pui-menu__item:last-child` (structural
pseudo), unchanged.

Tip selection (run **before** the checkout, so this branch still sat at `3503537`/`2026-08-13`):

- `git branch -a --sort=-committerdate` → row 1 = `auto/deep_dive_AI_Storyboard_Machine/2026-09-18_0018`.
- `git for-each-ref --sort=-committerdate … refs/remotes/origin/` agrees: row 1 = `1c3401f` `_0018`
  `2026-09-18 00:25:54 +0700`, row 2 = `563e7fc` `_0006` `2026-09-18 00:13:59 +0700`, rows 3–6 all
  `2026-09-17`.
- Date-major refname cross-check agrees: newest day holding a tip = `2026-09-18`; highest round
  number *on that day* = `_0018`.

A/B (a genuine measurement — the day held 2 tips, so the tiebreak fired):

- Wrong formula `--format='%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r`
  → row 1 = `2026-09-18 563e7fc … _0006` = **the wrong tip**; the correct tip `1c3401f` fell to
  row 2 because `'1'` < `'5'`.
- Right formula → row 1 = `1c3401f`. **Disagreement = tails.** Actual damage this round = **0**,
  because this round used the right formula.
- Cumulative: **tails 25 of 40** (**25/37** excluding the 3 structural heads).

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`83b8946…`), not merely an empty diff.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   The eight `###` decision headings (lines 408–657) are all still phrased as open questions, and a
   case-insensitive scan for `answered|resolved|decided|ตอบแล้ว` finds only the two narrative
   sentences that describe the blockage (README lines 10 and 404), no answer marker. (Run *after*
   the restore — on the stale tree that grep returns 0, which means "stale tree", never "answered".)
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not treat the repeated 33.7% as "the same safe number twice".** It is the same number for a
  specific reason (tails held the comparand), and the *consequence* changed underneath it — the
  blast radius went from 1 round to 2.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check**, did not add the parity harness to Verify, and did not restore
  `docs/design-parity.md` — all three are explicitly forbidden or owner-gated.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are recorded as permission-blocked
  here; retrying them burns a round for a known answer (decision 4).
- **Did not trim `AUTOPILOT.md`.** Deleting accumulated history is an owner call, even though its
  size is measurably what truncates `## Next task` out of the runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.

- **The forecast was wrong last round, in the direction that costs work.** `_0018` said ~66.3% heads
  and it came up tails. Next round's ~33.7% is the *same* probability, not a track record of safety.
  Read the table live; do not reason from the percentage.

- **Blast radius is now 2 rounds, not 1.** `563e7fc` has outranked the correct tip twice running. A
  wrong-formula restore next round throws away `_0018` and this round together.

- **Silent-discard remains the failure mode with no detector.** A round that restores the wrong tip
  produces a byte-identical code tree, an empty residual, five matching harness keys and three green
  Verify stages. Nothing in the repo catches it. The only defence is running the correct formula
  *before* the checkout, and the only evidence it was run is the table printed in the SUMMARY.

- **The backwards-round-number trap remains live.** Older blocks still recommend the "highest round
  number below mine" cross-check without the date-major qualifier. Only "newest day that has a tip,
  then highest round number *on that day*" is safe.

- **Nine rounds have now produced no user-visible change**, because every remaining path is
  owner-gated. That is the correct behaviour under the contract, but a reviewer should read it as a
  signal that the project needs a decision, not more agent rounds.
