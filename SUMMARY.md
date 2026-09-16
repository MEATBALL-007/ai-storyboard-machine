# Round 2026-09-17_0024 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  again — `git ls-files | wc -l` returned **73**, the one-call tell for the stale tree (no
  `tools/check-tokens.mjs`, no `docs/btn-parity-proof.mjs`). Selected the real tip with
  `git for-each-ref --sort=-committerdate` → `ca35a4b`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-17_0011`, `2026-09-17 00:18:59`), restored with
  `git checkout ca35a4b -- .` and committed it separately (`6b79c16`) so this round's own diff
  stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Confirmed `_0011`'s two forecasts, one of which fired for real.** Its day-granularity forecast
  resolved **heads by construction** (one tip on `2026-09-17`). Its *other* forecast — the
  "round number runs backwards" trap — **fired live this round, in both of its refname-only forms**,
  and that is a new measurement, not a restatement (see Why).
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention started in `_0035`/`_0041`,
  a no-op round does not append a `> **สถานะล่าสุด` status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**, because the prompt
  carries the `3503537` copy of `AUTOPILOT.md`, which predates that section existing. The real task
  is only readable *after* the restore, so the first action was `git log`, not a Read.
- **The backwards-round-number trap fired this round, and both refname-only readings of it picked a
  wrong tip.** `_0011` predicted this and it is now measured against this round's own live table:
  - "highest round number **overall**" → `_0200` (`2026-09-16`, `39d0934`) — because `0200 > 0011`.
    That discards all of `_0011`.
  - "highest round number **below my own**" (the softer heuristic older blocks suggest as a
    cross-check) → `_0020` (`2026-09-16`, `d68882c`) — because `0020 < 0024 < 0200`. That is
    **three rounds stale** and discards `_0011`, `_0030` and `_0200` at once.
  - Only the **date-major** reading survives: newest day holding a tip = `2026-09-17`; highest round
    number *on that day* = `_0011` → `ca35a4b` ✓, agreeing with `--sort=-committerdate`.
  This is the first round on record where the refname-only cross-check fails in *both* directions
  at once, so the "highest below mine" phrasing is not a safe fallback even as a sanity check.
- **Deliberately did NOT re-run the sha tie-break A/B.** `2026-09-17` held exactly one tip at
  selection time (confirmed live: row 1 `ca35a4b` on `2026-09-17`, every row below on `2026-09-16`),
  so the two formulas are indistinguishable at row 1 and their agreement would prove nothing. That
  matches what `_0010`, `_0016`, `_0011` and `_0020` each decided in the same situation.
- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` == `git rev-parse
  ca35a4b^{tree}` (both `41599b32a7520f4dec79e1ef679ee6f7f9889917`) proves the snapshot agrees on
  *every path at once*, including files a path-checkout cannot delete — which `git diff --stat`
  cannot show, and which is permission-blocked here anyway.

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
| `ds-disabled-hover ca35a4b:…/styles.css …/styles.css` | PASS, 15 / 3, markup `N/A — the source is a stylesheet`, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. All five
`✗` rows are `#toastUndo` (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`), each
showing `pointer-events (unset) → auto <- .toast-act`; **no `#toast` row appears**, which is the
evidence that `pointer-events:none` was not removed from the container. I read all five rows rather
than running `grep -c "✗ #toast:"`, which has a documented blind spot (the base-state row prints
`✗ #toast (base)` with no colon). The `ds-disabled-hover` before-side was read from the tip this
round actually restored (`ca35a4b`), not copied from an older block; its 1 undecidable rule is
`.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`41599b3…`), not merely an empty diff.
2. README decision counters **agree at 8/8** (`| Option | Cost |` = 8, `If you answer:` = 8).
   A divergence would be the signature of an answered decision; there is none. (Run *after* the
   restore — on the stale tree that grep returns 0, which means "stale tree", never "answered".)
3. `git ls-files | grep -i jspdf` → empty. jsPDF still not vendored (decision 1 unanswered).
4. `git status --untracked-files=all --short` → empty. No owner file dropped into the tree.
5. Non-`auto/` branch tips unmoved, byte-for-byte as prior rounds recorded them:
   `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20);
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20);
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27).

Tip selection (run **before** the checkout, so this branch still sat at `3503537`/`2026-08-13` and
sank to the bottom on its own — no hand-filtering needed):

- `--sort=-committerdate` → row 1 = `ca35a4b` = `_0011`, dated `2026-09-17 00:18:59`; **the only
  row on that date**, with rows 2–9 all on `2026-09-16` (`39d0934` `_0200`, `3cbd244` `_0030`,
  `d68882c` `_0020`, `a14011f` `_0010`, each appearing twice as local + `origin/`).
- Date-major refname cross-check agrees (`2026-09-17` → `_0011`). Both refname-**only** readings
  disagree — see Why. No A/B was run; on a single-tip day it measures nothing.
- The wrong formula's cumulative record is unchanged at **tails 22 of 36** (**22/33** excluding the
  structural heads), because this round added no measurement to it.

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit `6b79c16`.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not re-run the sha tie-break A/B**, for the reason given in Why. Recording "both formulas
  agreed" on a single-tip day would be a misleading entry in a table of measurements.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check**, did not add the parity harness to Verify, and did not restore
  `docs/design-parity.md` — all three are explicitly forbidden or owner-gated.
- **Did not retry `git merge --ff-only`, `git reset --hard`, `git restore --source` or `git diff`** —
  all are recorded as permission-denied here, and re-testing them burns calls for a known answer.
- **Did not trim `AUTOPILOT.md`** (3,553 lines before this round's edit). Deleting accumulated
  history is an owner call, even though its size is what truncates `## Next task` out of the
  runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.
- **Next round's day-granularity risk jumps to ~79.0%.** When this round closes, `2026-09-17` holds
  two tips and the comparand is `ca35a4b` (leading `c`), so the wrong formula lands right only if
  this round's closing sha sorts above it: `0xca35a4b / 0x10000000` ≈ **0.790** tails. Damage if a
  round uses it: restores `ca35a4b` and discards this round (1 round, docs only) — **undetectably**,
  since the code tree is byte-identical, the residual is empty, all five harness keys match and all
  three Verify stages stay green. (A round cannot resolve its own forecast; writing its sha changes
  its sha.)
- **The backwards-round-number trap is now proven to break the "highest below mine" cross-check too**,
  not just "highest overall". Older blocks in `AUTOPILOT.md` still recommend that phrasing. Any round
  reading them without the date-major qualifier will restore a 3-round-stale tip and see every check
  pass. This round rewrote the guidance in `## Next task`, but the stale phrasing survives further
  down the file and I did not delete it (trimming is an owner call).
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
