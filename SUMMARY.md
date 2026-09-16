# Round 2026-09-17_0034 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  again. Selected the real tip with `git for-each-ref --sort=-committerdate` **before** any
  checkout → `ddc6e24` (`auto/deep_dive_AI_Storyboard_Machine/2026-09-17_0024`), restored with
  `git checkout ddc6e24 -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Resolved `_0024`'s A/B forecast with a real measurement: "heads" — the forecast was wrong.**
  It predicted ~79.0% tails; the outcome landed in the ~21.0% branch. Unlike the last three rounds,
  `2026-09-17` held **two** tips at selection time, so the A/B actually measured something.
- **Corrected a measurement error `_0024` left behind** about the wrong formula's group ordering —
  it was labelled an inference, and this round measured it and found it wrong (see Why).
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention from `_0035`/`_0041`, a
  no-op round does not append a `> **สถานะล่าสุด` status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**, because the prompt
  carries the `3503537` copy of `AUTOPILOT.md`, which predates that section existing. The real task
  is only readable *after* the restore, so the first action was `git log`, not a Read.

- **The A/B came out heads, but by luck, not by structure.** Day `2026-09-17` held `ca35a4b`
  (`_0011`) and `ddc6e24` (`_0024`). They tie at day granularity, so the wrong formula falls through
  to an ASCII compare of the sha field: `ddc6e24` ('d') > `ca35a4b` ('c'), which happens to be the
  correct tip. `_0024`'s comparand prediction was exactly right; only the coin landed the other way.
  **This is not evidence the wrong formula is usable** — rows 3–6 show the bug fully intact below
  row 1, where the correct formula gives `39d0934` (`_0200`) and the wrong one gives `d68882c`
  (`_0020`).

- **`_0024`'s inferred group ordering was wrong, and I could measure it this round.** `_0024`
  explicitly flagged it as "อนุมานจากค่า sha ไม่ใช่การวัด" and predicted the `2026-09-16` group
  would sort `d68882c` > `3cbd244` > `39d0934` > `a14011f`. The measured order is
  **`d68882c` > `a14011f` > `3cbd244` > `39d0934`**. The cause is that `sort -r` compares ASCII
  character by character, not hex magnitude, and letters sort above digits (`'a'`=0x61 > `'3'`=0x33),
  so `a14011f` must outrank both `3…` shas. The load-bearing conclusion survives — the group head is
  still `d68882c` (`_0020`) — but the side effect is **worse** than inferred: the true tip of that
  day, `39d0934` (`_0200`), sinks to the **bottom** of its group (row 6), not row 3.

- **Why it was safe to run the A/B *after* the restore commit this round.** Earlier rounds insisted
  on selecting the tip before `checkout` because a local commit immediately contaminates the local
  `for-each-ref` table. Restricting the A/B to `refs/remotes/origin/` removes that coupling by
  construction: a commit created locally cannot appear under `origin/` until it is pushed, and this
  round cannot push. Verified live — `for-each-ref refs/remotes/origin/ | grep '_0034'` is empty.
  Tip *selection* was still done before the checkout, as required.

- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` == `git rev-parse
  ddc6e24^{tree}` (both `a5b29aa77b0a5cd5be69b0578462d1a2a73c8fdc`) proves the snapshot agrees on
  *every path at once*, including files a path-checkout cannot delete — which `git diff --stat`
  cannot show, and which is permission-blocked here anyway. `git ls-files | wc -l` = **76**
  (the stale tree returns 73).

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
| `toast de07ea8:index.html 10e8f39:index.html` | PASS, 5 / 1 |
| `ds-disabled-hover ddc6e24:…/styles.css …/styles.css` | PASS, 15 / 3, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. I listed
all five `✗` rows rather than counting them: they are `#toastUndo (base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`, each showing `pointer-events (unset) → auto <- .toast-act`. **No
`#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from the
container. (I avoided `grep -c "✗ #toast:"`, which has a documented blind spot — the base-state row
prints `✗ #toastUndo (base)` with no colon.) The `ds-disabled-hover` before-side was read from the
tip this round actually restored (`ddc6e24`), not copied from an older block; its 1 undecidable rule
is `.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`a5b29aa…`), not merely an empty diff.
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

- `--sort=-committerdate` → row 1 = `ddc6e24` = `_0024`, dated `2026-09-17`.
- Date-major refname cross-check agrees: newest day holding a tip = `2026-09-17`; highest round
  number *on that day* = `_0024`. Both refname-**only** readings still disagree — "highest overall"
  picks `_0200`, "highest below mine" picks `_0030`, both on the older `2026-09-16`.
- A/B on `refs/remotes/origin/`, resolving `_0024`'s forecast: **heads**, both formulas agree at
  row 1 on `ddc6e24`. The wrong formula's cumulative record moves to **tails 22 of 37**
  (**22/34** excluding the 3 structural heads).

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not delete or rewrite `_0024`'s incorrect inference block** — I appended a correction above
  it. Cutting accumulated history is an owner call, as every prior round has recorded.
- **Did not fix the two `:hover` cascade bugs catalogued under decision 7** (tour Back button staying
  bright while disabled; `.menu-pop button.danger:hover` swallowing the app's own `:disabled:hover`
  guard at equal specificity `(0,3,1)`). Both are real and both move visible colour, so they are
  owner calls — and critically, **no checker would catch it if I did**.
- **Did not add a 7th token check**, did not add the parity harness to Verify, and did not restore
  `docs/design-parity.md` — all three are explicitly forbidden or owner-gated.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are recorded as permission-blocked
  here; retrying them burns a round for a known answer (decision 4).
- **Did not trim `AUTOPILOT.md`.** Deleting accumulated history is an owner call, even though its
  size is what truncates `## Next task` out of the runner's prompt.

## Risk

- **`toast-hit` reports FAIL by design — do not "fix" it.** It documents an intentional behaviour
  change (adding `pointer-events:auto` to `.toast-act` so the Undo button is clickable). A reviewer
  skimming for green will misread this. The number to check is **exactly 5 differing declarations,
  all on `#toastUndo`**; if `#toast` ever appears in that list, someone removed `pointer-events:none`
  from the container and the toast now blocks clicks across 80vw for 5s.

- **Next round's day-granularity risk is the highest ever recorded: ~86.6%.** When this round closes,
  `2026-09-17` holds three tips and the comparand is `ddc6e24` (leading `d`), so the wrong formula
  lands right only if this round's closing sha sorts above it: `0xddc6e24 / 0x10000000` ≈ **0.866**
  tails. Damage if a round uses it: restores `ddc6e24` and discards this round (1 round, docs only)
  — **undetectably**, since the code tree is byte-identical, the residual is empty, all five harness
  keys match and all three Verify stages stay green. **There is no structural mask next round**: a
  mask requires the *previous* round to have been the sole tip of its day, and this one was not. Even
  if the next round is the first of `2026-09-18`, the risk stays ~86.6%.

- **This round's "heads" is the most misreadable result in the log.** Both formulas agreed at row 1,
  which is exactly what a *correct* selector looks like. It agreed by coincidence of one hex digit.
  A future round that reads "heads" as "the tie-break is fine" will adopt the broken formula right
  before the highest-risk round on record.

- **Sha orderings in older `AUTOPILOT.md` blocks may contain more inference errors.** One was found
  and corrected this round. Any block that reasons about sha order *without* showing a live `sort -r`
  should be treated as unverified — hex intuition and ASCII ordering disagree whenever digits and
  letters are compared.

- **The backwards-round-number trap remains live.** Older blocks still recommend the "highest round
  number below mine" cross-check without the date-major qualifier; this round it would again have
  picked a `2026-09-16` tip. Only "newest day that has a tip, then highest round number *on that
  day*" is safe.
