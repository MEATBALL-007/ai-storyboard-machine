# Round 2026-09-17_0121 — no-op round (blocked on owner decisions)

## What I did

- **Restored the previous round's work.** The runner cut this branch from the stale base `3503537`
  again. Selected the real tip **before** any checkout → `8ced217`
  (`auto/deep_dive_AI_Storyboard_Machine/2026-09-17_0034`), restored it with
  `git checkout 8ced217 -- .` and committed it separately so this round's own diff stays readable.
- **Checked all five owner-answer channels. All five negative** — no decision has been answered, so
  the queued no-op task stands and there is no substitute work to invent.
- **Ran the full Verify command and all five parity-harness keys.** Every one matched its documented
  expected result, including the intentional `toast-hit` FAIL (details under Verification).
- **Resolved `_0034`'s A/B forecast with a real measurement: "tails" — the forecast was right**
  (~86.6% predicted, tails landed) and this time the bug was **load-bearing at row 1**: the wrong
  formula returns `ddc6e24` (`_0024`) and sinks the correct tip `8ced217` to row 3.
- **Measured something new: the bug lives in the *field order*, not in `sort -r` alone.** Four format
  variants over the same ref set isolate it to two simultaneous conditions (see Why).
- **Updated `## Next task` in `AUTOPILOT.md` only.** Per the convention from `_0035`/`_0041`, a
  no-op round does not append a `> **สถานะล่าสุด` status block; it edits the forecast alone.

## Why

- **Restore before reading anything.** The stale tree does not look broken, it looks *done* — the
  `## Next task` section the runner pasted into my prompt arrived **empty**, because the prompt
  carries the `3503537` copy of `AUTOPILOT.md`, which predates that section existing. The real task
  is only readable *after* the restore, so the first action was `git log`, not a Read.

- **The new finding: the wrong formula needs *two* conditions to fire, and either one alone
  defuses it.** I ran four variants against `refs/remotes/origin/` — same data, same moment:

  | variant | row 1 | result |
  |---|---|---|
  | `--sort=-committerdate` (`iso8601`) | `8ced217` `_0034` | ✅ correct |
  | `%(committerdate:iso8601) %(refname) %(objectname)` + `sort -r` | `8ced217` `_0034` | ✅ **matches correct formula on every row** |
  | `%(committerdate:short) %(refname) %(objectname)` + `sort -r` | `8ced217` `_0034` | ✅ **matches correct formula on every row** |
  | `%(committerdate:short) %(objectname) %(refname)` + `sort -r` | `ddc6e24` `_0024` | ❌ the recorded wrong formula |

  So the bug requires **(a)** truncating the timestamp to a bare date **and** **(b)** placing the sha
  **before** the refname. With `iso8601` the seconds field settles every comparison before the sha is
  ever reached. With the refname first, the same-day tiebreak becomes the **round number** — and
  because those are zero-padded to four digits, lexical order *is* numeric order, which is exactly
  the date-major rule the log has been recommending all along. Every earlier round described this as
  "day granularity + sha tiebreak"; that was correct but incomplete — it never separated the two
  conditions, so it never noticed that one of them is a one-token edit away from being safe.

- **I am *not* recommending switching to a `sort -r` variant.** The refname-first variants are safe
  only because `origin/main`, `origin/design-system` and `origin/hardening-pass` currently carry older
  dates and fall to the bottom on their own. If any non-`auto/` ref ever lands on the newest day,
  refname-first breaks the other way — `'m'`, `'d'`, `'h'` all sort above the `'a'` of `auto/…` — and
  it would pick `origin/main`. `--sort=-committerdate` remains the answer; the table above only
  explains *why* the wrong formula is wrong.

- **Tree-SHA identity as the restore proof.** `git rev-parse HEAD^{tree}` == `git rev-parse
  8ced217^{tree}` (both `04017b15af6de8d294fae58dbd4c61ea6d7122a9`) proves the snapshot agrees on
  *every path at once*, including files a path-checkout cannot delete — which `git diff --stat`
  cannot show. `git ls-files | wc -l` = **76** (the stale tree returns 73).

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
| `ds-disabled-hover 8ced217:…/styles.css …/styles.css` | PASS, 15 / 3, **+1 undecidable rule** |
| `toast-hit 3d3d5cc:index.html index.html` | **FAIL — 5 declaration(s) differ**, 10 / 2, 0 markup problems, 0 unmatched |

The `toast-hit` FAIL is the **correct and expected** result, not a regression — see Risk. I listed
all five `✗` rows rather than counting them: `#toastUndo (base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`, each showing `pointer-events (unset) → auto <- .toast-act`. **No
`#toast` row appears**, which is the evidence that `pointer-events:none` was not removed from the
container. (I avoided `grep -c "✗ #toast:"`, which has a documented blind spot — the base-state row
prints `✗ #toastUndo (base)` with no colon.) The `ds-disabled-hover` before-side was read from the
tip this round actually restored (`8ced217`), not copied from an older block; its 1 undecidable rule
is `.pui-menu__item:last-child` (structural pseudo), unchanged.

Five owner-answer channels, all negative:

1. Restored tree identical to tip — tree SHAs equal (`04017b1…`), not merely an empty diff.
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

Tip selection (run **before** the checkout, so this branch still sat at `3503537`/`2026-08-13`):

- `--sort=-committerdate` → row 1 = `8ced217` = `_0034`, dated `2026-09-17`.
- Date-major refname cross-check agrees: newest day holding a tip = `2026-09-17`; highest round
  number *on that day* = `_0034`. Both refname-**only** readings still disagree — "highest overall"
  picks `_0200` and "highest below mine" picks `_0034`'s older siblings on `2026-09-16`.
- A/B on `refs/remotes/origin/`, resolving `_0034`'s forecast: **tails**, the two formulas disagree
  at row 1 (`8ced217` vs `ddc6e24`). The wrong formula's cumulative record moves to
  **tails 23 of 38** (**23/35** excluding the 3 structural heads).

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. This round's
  own diff is `AUTOPILOT.md` + `SUMMARY.md` only, on top of the separate restore commit.
- **Did not answer any of the eight open decisions.** Every one moves pixels, adds a file, or
  rewrites history; all are owner calls. Decisions 2 / 5 / 6 / 7 remain the only things standing
  between the project and three unticked acceptance criteria.
- **Did not change the tip-selection command** despite finding two `sort -r` variants that agree with
  it today. `--sort=-committerdate` is already correct; swapping a working command for one that is
  only *contingently* correct would be a regression dressed as a cleanup.
- **Did not delete or rewrite any older forecast block** — I appended above them. Cutting accumulated
  history is an owner call, as every prior round has recorded.
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

- **Next round's risk stays ~86.6%, but the blast radius doubles to two rounds.** When this round
  closes, `2026-09-17` holds four tips and the comparand is still `ddc6e24` (leading `d`) — *not*
  `8ced217`, because the wrong formula takes the lexical maximum, not the newest. A round that uses
  it restores `ddc6e24` and discards **both `_0034` and this round**, and does so **undetectably**:
  the code tree is byte-identical, the residual is empty, all five harness keys match and all three
  Verify stages stay green. **There is no structural mask next round** — a mask requires the
  *previous* round to have been the sole tip of its day, and this one was not. Even if the next round
  is the first of `2026-09-18`, the risk stays ~86.6%.

- **The new field-order finding is easy to over-read.** "Two `sort -r` variants matched the correct
  formula on every row" is a statement about *today's ref set*, not a proof. It holds only while
  every non-`auto/` ref carries an older date than the newest round. A future round that adopts a
  refname-first `sort -r` because this summary measured it green will silently pick `origin/main`
  the first day a non-`auto/` branch is touched.

- **Sha orderings in older `AUTOPILOT.md` blocks may still contain inference errors.** `_0034`
  found and corrected one. Any block that reasons about sha order *without* showing a live `sort -r`
  should be treated as unverified — hex intuition and ASCII ordering disagree whenever digits and
  letters are compared.

- **The backwards-round-number trap remains live.** Older blocks still recommend the "highest round
  number below mine" cross-check without the date-major qualifier. Only "newest day that has a tip,
  then highest round number *on that day*" is safe.
