# Round 2026-09-18_0018 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  (`design-system`, 2026-08-13) again. Selected the real tip **before** any checkout → `563e7fc`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-18_0006`), restored it with
  `git checkout … -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Confirmed `_0006`'s mask from the live table, as `_0006` itself demanded.** The mask was real
  *and* its precondition held: `origin` gained a `2026-09-18` tip, so the newest date field held
  exactly one entry and row 1 was settled before the sha tiebreak. Risk this round ≈ 0, structurally.
  Per the standing rule I therefore **did not run the A/B and did not move the cumulative statistic**.
- **Measured something new: the mask does not merely skip a round, it *resets the ratchet*.** Next
  round's risk is **~33.7%** — the lowest ever recorded here, against a 79–87% band across the last
  five rounds. Mechanism in Why.
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention from `_0035`/`_0041`/`_0121`/
  `_0006`, a no-op round does not append a `> **สถานะล่าสุด` status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty** again. `AUTOPILOT.md` is
  now **3,695 lines** with `## Next task` at **line 340**, so the runner's truncation drops it. The
  real task is only readable *after* the restore, so the first action was `git log`, not a Read.

- **The ratchet, and why a mask resets it.** The wrong formula ties at day granularity and breaks the
  tie on sha, so it picks the wrong tip whenever the closing sha sorts below
  `max(shas already sharing the newest date)`. That maximum is the comparand — and because a day only
  ever *gains* tips, the comparand can rise but never fall. That is exactly the observed monotone
  climb: **79.0 → 83.8 → 86.6 → 86.6%**.

  A mask breaks it because the new day starts with **one** tip. Next round's comparand is therefore a
  single freshly-minted sha, uniform on `[0, 0x10000000)`, not a maximum over four draws — expected
  risk falls from ~87% back to ~50%, and this round drew a leading nibble of `5`, giving
  `0x563e7fc / 0x10000000` ≈ **33.7%**. This is a mechanism, not a one-round fluke: every
  single-tip day rollover resets the ratchet the same way.

  **This is still not the bug being fixed.** Both of `_0121`'s conditions remain in the wrong
  formula. The ratchet simply restarts from a low value and climbs again.

- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` ==
  `git rev-parse 563e7fc^{tree}` (both `6239084a333fa0038f83fdf7ef7c09e983a57655`) proves the
  snapshot agrees on *every path at once*, including files a path-checkout cannot delete — which
  `git diff --stat` cannot show. `git ls-files | wc -l` = **76** (the stale tree returns 73).

## Verification

Verify command — all three stages green (run separately; this shell blocks `&&` chains):

- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → all 6 checks pass at **15 CSS sources**: tokens 22/22,
  fonts 4/4 byte-identical, no derived-colour literals, every font-weight in {400,500,700,800},
  every `border-radius` reads a `--r-*` token, every `font-family` reads `var(--mono)`
- `npm --prefix design-system test` → `12 passed (12)` files, `31 passed (31)` tests

Parity harness — all five keys match the documented table exactly:

| key | result |
|---|---|
| `buttons 2488f2d:index.html index.html` | PASS, 85 pairs / 17 elements, markup coverage OK (7 gone / 5 new) |
| `segmented 021b966:index.html index.html` | PASS, 45 / 9, markup coverage OK (0 gone / 3 new) |
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1, markup coverage OK (0 gone / 1 new) |
| `ds-disabled-hover 563e7fc:…/styles.css …/styles.css` | PASS, 15 / 3, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. I listed
all five `✗` rows rather than counting them: `#toastUndo (base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`, each showing `pointer-events (unset) → auto <- .toast-act`. **No
`#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from the
container. (I avoided `grep -c "✗ #toast:"`, which has a documented blind spot — the base-state row
prints `✗ #toastUndo (base)` with no colon.) The `ds-disabled-hover` before-side was read from the
tip this round actually restored (`563e7fc`), not copied from an older block; its 1 undecidable rule
is `.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`6239084…`), not merely an empty diff.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   I also read the eight `###` decision headings directly — all still phrased as open questions, and
   a case-insensitive scan for `answered|resolved|decided|ตอบแล้ว` finds only the two narrative
   sentences that describe the blockage, no answer marker. (Run *after* the restore — on the stale
   tree that grep returns 0, which means "stale tree", never "answered".)
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

Tip selection (run **before** the checkout, so this branch still sat at `3503537`/`2026-08-13`):

- `--sort=-committerdate` → row 1 = `563e7fc` = `_0006`, dated `2026-09-18 00:13:59 +0700`.
- Date-major refname cross-check agrees: newest day holding a tip = `2026-09-18`; highest round
  number *on that day* = `_0006` (the only one).
- **Mask confirmed live on `refs/remotes/origin/`**, not taken on trust from `_0006`'s paragraph:
  row 1 = `563e7fc` `2026-09-18`, rows 2–5 all `2026-09-17` (`bb09298` `_0121`, `8ced217` `_0034`,
  `ddc6e24` `_0024`, `ca35a4b` `_0011`). The newest date holds **exactly one** tip, so the date field
  settles row 1 before the sha tiebreak is reached and both formulas return the same answer.
- **No A/B run, cumulative statistic unmoved** at **tails 24 of 39** (**24/36** excluding the 3
  structural heads) — a single-tip day cannot distinguish the two formulas, so agreement would not
  have been a measurement.

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not run the A/B and did not move the cumulative statistic.** Recording a "heads" from a
  masked round would inflate the record with a result that was never a measurement.
- **Did not treat the low 33.7% forecast as licence to relax the tip-selection rule.** Next round
  must still use `--sort=-committerdate`. One-in-three is not zero, and a masked or lucky round is
  indistinguishable from a safe one *from inside* — which is why the rule cannot be conditional on
  the forecast.
- **Did not let this round's own local branch into any ranking table.** It now carries a
  `2026-09-18` commit and would contaminate the local view; the mask confirmation was run against
  `refs/remotes/origin/` only, which structurally cannot contain an unpushed local commit.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check**, did not add the parity harness to Verify, and did not restore
  `docs/design-parity.md` — all three are explicitly forbidden or owner-gated.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are recorded as permission-blocked
  here; retrying them burns a round for a known answer (decision 4).
- **Did not trim `AUTOPILOT.md`.** Deleting accumulated history is an owner call, even though its
  size (now 3,695 lines) is measurably what truncates `## Next task` out of the runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.

- **The 33.7% forecast is the most misreadable number in this file.** Five rounds of 79–87% have
  trained the log's reader to treat the percentage as "the risk is high"; a drop to one-in-three
  invites the conclusion that the problem went away. It did not — the ratchet reset and will climb
  again from here. The forecast is also conditional on this round being pushed, the same way `_0006`'s
  mask was: if the runner holds this PR back, `origin`'s newest day stays `2026-09-18` with one tip
  and next round is masked instead, at ~0%. Either way next round must read the table live.

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
  then highest round number *on that day*" is safe — and note this round's number (`_0018`) is
  *higher* than the `_0006` it restored, the opposite shape from last round, so neither direction of
  the round-number heuristic can be trusted.

- **Eight rounds have now produced no user-visible change**, because every remaining path is
  owner-gated. That is the correct behaviour under the contract, but a reviewer should read it as a
  signal that the project needs a decision, not more agent rounds.
