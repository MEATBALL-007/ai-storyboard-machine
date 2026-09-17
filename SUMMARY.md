# Round 2026-09-18_0006 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  again. Selected the real tip **before** any checkout → `bb09298`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-17_0121`), restored it with
  `git checkout bb09298 -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Resolved `_0121`'s A/B forecast with a real measurement: "tails" — the forecast was right**
  (~86.6% predicted, tails landed) and the bug was **load-bearing at row 1**: the wrong formula
  returns `ddc6e24` (`_0024`) and sinks the correct tip `bb09298` to row 3.
- **Measured something the last three rounds each predicted would be impossible: next round is
  MASKED.** This is the first round since `_0011` to open a new calendar day, which removes the
  tiebreak that has carried ~79–87% risk for five consecutive rounds (see Why).
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention from `_0035`/`_0041`/`_0121`,
  a no-op round does not append a `> **สถานะล่าสุด` status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**. The cause is now
  precisely known: `AUTOPILOT.md` is **3,667 lines** and `## Next task` sits at **line 340**, so the
  runner's truncation drops it. The real task is only readable *after* the restore, so the first
  action was `git log`, not a Read.

- **The mask is real this round, and it is the first one in five rounds.** Every prior round closed
  with "⚠️ ไม่มี mask รอบหน้า" because a mask requires the *previous* round to be the sole tip of its
  own day, and `2026-09-16`/`2026-09-17` each accumulated 3–4 tips. This round is different: it is
  the **first tip of `2026-09-18`** (restore commit timestamped `2026-09-18 00:07:22 +0700`), while
  `2026-09-17` closed with four. Next round's table therefore has a strictly-greatest date field
  holding **exactly one** entry, so row 1 is settled by the date before the sha tiebreak is ever
  reached — both formulas return this round's tip.

  **This is not the bug being fixed.** It is the bug not being load-bearing for one round, exactly
  like `_0011`'s structural heads. The two conditions (`_0121`'s finding) are still both present in
  the wrong formula; the mask only removes the *opportunity* for condition (a) to matter.

- **Which is also why next round must not run the A/B.** When the newest day holds one tip the two
  formulas cannot disagree, so agreement proves nothing and the cumulative statistic must not move.
  `_0010`, `_0016`, `_0011` and `_0020` all reached this conclusion; recording a "heads" here would
  inflate the record with a result that was never a measurement.

- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` ==
  `git rev-parse bb09298^{tree}` (both `0f0ba36d7262dd66b2a3555ce67cda4ced0c6567`) proves the
  snapshot agrees on *every path at once*, including files a path-checkout cannot delete — which
  `git diff --stat` cannot show. `git ls-files | wc -l` = **76** (the stale tree returns 73).

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
| `buttons 2488f2d:index.html index.html` | PASS, 85 pairs / 17 elements |
| `segmented 021b966:index.html index.html` | PASS, 45 / 9 |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1, markup coverage OK |
| `ds-disabled-hover bb09298:…/styles.css …/styles.css` | PASS, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. I listed
all five `✗` rows rather than counting them: `#toastUndo (base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`, each showing `pointer-events (unset) → auto <- .toast-act`. **No
`#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from the
container. (I avoided `grep -c "✗ #toast:"`, which has a documented blind spot — the base-state row
prints `✗ #toastUndo (base)` with no colon.) The `ds-disabled-hover` before-side was read from the
tip this round actually restored (`bb09298`), not copied from an older block; its 1 undecidable rule
is `.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`0f0ba36…`), not merely an empty diff.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   A divergence would be the signature of an answered decision; there is none. I also read the eight
   `###` headings directly — all still phrased as open questions, none marked answered. (Run *after*
   the restore — on the stale tree that grep returns 0, which means "stale tree", never "answered".)
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

Tip selection (run **before** the checkout, so this branch still sat at `3503537`/`2026-08-13`):

- `--sort=-committerdate` → row 1 = `bb09298` = `_0121`, dated `2026-09-17`.
- Date-major refname cross-check agrees: newest day holding a tip = `2026-09-17`; highest round
  number *on that day* = `_0121`.
- A/B on `refs/remotes/origin/`, resolving `_0121`'s forecast: **tails**, the two formulas disagree
  at row 1 (`bb09298` vs `ddc6e24`), and `bb09298` lands at **row 3** under the wrong formula. The
  wrong formula's cumulative record moves to **tails 24 of 39** (**24/36** excluding the 3
  structural heads).

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not treat the mask as a reason to relax the tip-selection rule.** Next round must still use
  `--sort=-committerdate`. A masked round is indistinguishable from a safe one *from inside*, which
  is precisely why the rule cannot be conditional on the forecast.
- **Did not run a second A/B after the restore commit**, and did not let this round's own local
  branch into any ranking table — it now carries a `2026-09-18` commit and would contaminate the
  local view. Both formulas were run against `refs/remotes/origin/` only.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check**, did not add the parity harness to Verify, and did not restore
  `docs/design-parity.md` — all three are explicitly forbidden or owner-gated.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are recorded as permission-blocked
  here; retrying them burns a round for a known answer (decision 4).
- **Did not trim `AUTOPILOT.md`.** Deleting accumulated history is an owner call, even though its
  size (3,667 lines) is measurably what truncates `## Next task` out of the runner's prompt.

## Risk

- **The mask is conditional on this round actually being pushed.** The whole "next round is safe"
  finding assumes `origin` gains a `2026-09-18` tip. If the runner holds this PR back — which it is
  designed to do when Verify fails — then `origin`'s newest day stays `2026-09-17` with four tips,
  the comparand returns to `ddc6e24`, and next round's risk snaps back to **~86.6%** with a
  **two-round** blast radius. A reviewer who sees this PR held must not let the next round read the
  mask claim at face value. Next round should confirm the mask *from the live table* (newest day
  holds exactly one tip) rather than trusting this paragraph.

- **A masked round is the easiest place to acquire a bad habit.** Both formulas agree next round, so
  a round that switches to the wrong formula gets away with it cleanly and may record that it
  "worked". The round after next re-arms: `2026-09-18` will hold two tips, the tiebreak fires again,
  and the comparand becomes **this round's closing sha**. I cannot compute that risk here — writing
  my own closing sha into the file changes it — so next round must read it live and forecast from it.

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.

- **Silent-discard remains the failure mode with no detector.** A round that restores the wrong tip
  produces a byte-identical code tree, an empty residual, five matching harness keys and three green
  Verify stages. Nothing in the repo catches it. The only defence is running the correct formula
  *before* the checkout, and the only evidence it was run is the table printed in the SUMMARY.

- **Sha orderings in older `AUTOPILOT.md` blocks may still contain inference errors.** `_0034`
  found and corrected one. Any block that reasons about sha order *without* showing a live `sort -r`
  should be treated as unverified — hex intuition and ASCII ordering disagree whenever digits and
  letters are compared.

- **The backwards-round-number trap remains live.** Older blocks still recommend the "highest round
  number below mine" cross-check without the date-major qualifier. Only "newest day that has a tip,
  then highest round number *on that day*" is safe — and note this round's own number (`_0006`) is
  *lower* than every tip it outranks, which is exactly the shape that trap exploits.
