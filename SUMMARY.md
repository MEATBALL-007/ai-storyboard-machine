# Round 2026-09-06_0045 — SUMMARY

## What I did

- **Restored the previous round's tip before reading anything.** `git log --oneline -1` showed
  `3503537` (the stale base the runner cuts every `auto/*` branch from), so the working tree did
  not contain `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, the token/radius/font work,
  or `README.md`'s `## Open decisions`. Restored `e057051` (branch `…/2026-09-06_0036`) with
  `git checkout e057051 -- .` as its own commit (`3a4d5ff`) so this round's real diff stays readable.
- **Checked all five owner-answer channels. None has been answered — still 8 open decisions.**
  This is a no-op round: `index.html`, `design-system/`, `tools/` and `docs/` were not touched by
  a single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full three-stage Verify plus all five parity-harness keys** — every number matches the
  expected table, which is the independent confirmation that the restore was byte-correct.
- **Resolved round `_0036`'s conditional forecast about the `:short` ranking trap: HEADS.** Its
  closing sha is `e057051`, leading `e`, inside the `b`–`f` branch it wrote. Recorded in
  `AUTOPILOT.md` along with a fresh conditional forecast for the next round.

## Why

- **The restore comes first, before any Read.** The stale tree does not look broken — it looks
  *done*: on `3503537` the app's `:root` really is byte-identical to `tokens.css` (11 tokens), so
  a round that reads before restoring concludes the token work is finished and wastes itself.
  That has actually happened here (round `2026-08-28_0004`), and once (`2026-08-19_0022`) it
  permanently dropped `docs/design-parity.md` from the tree.
- **Tip selected with `%(committerdate:iso8601)`, never the `:short` pipeline form.** With five
  tips already sharing `2026-09-06`, day-granularity keys tie and `sort -r` silently falls through
  to comparing the sha *string*. Cross-checked by refname (`_0036` is the highest round number
  below my own `_0045`); both methods agreed. **I did not pick by row number** — a round's own
  branch can land above or below the real tip depending on one hex digit.
- **No substitute task was invented.** The design-system integration is finished except for the
  eight owner decisions in `README.md`; the survey work is genuinely complete (parity table closed
  at 11/11, token tooling at 22/22 with six checks). What is missing is a decision, not more
  analysis. Ending with only a SUMMARY is the contract's defined success for this state.

## Verification

Verify command, all three stages green:

```
node tools/test.mjs         → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens in sync: 22/22 … identical in index.html
                              fonts in sync: 4/4 … byte-identical in index.html
                              no derived-colour literals: 15 CSS source(s) scanned
                              font weights available: 15 CSS source(s), every weight in 400/500/700/800
                              no radius literals: 15 CSS source(s), every border-radius reads a --r-* token
                              typeface from one source: 15 CSS source(s), every font-family reads var(--mono)
npm --prefix design-system test → 12 test files, 31 passed (31)
```

Parity harness, all five keys (before-side shas copied from `AUTOPILOT.md`'s `**Verify:**` block,
never guessed; `ds-disabled-hover` uses the tip *this* round restored):

```
buttons           2488f2d:index.html index.html
  → 85 pairs / 17 elements, markup OK (7 old class tokens gone, 5 new) — PASS
segmented         021b966:index.html index.html
  → 45 pairs / 9 elements,  markup OK (0 gone, 3 new)                  — PASS
toast             de07ea8:index.html 10e8f39:index.html
  → 5 pairs / 1 element,    markup OK (0 gone, 1 new)                  — PASS, no undecidable
ds-disabled-hover e057051:design-system/src/styles.css design-system/src/styles.css
  → 15 pairs / 3 elements, markup "N/A — the source is a stylesheet"   — PASS
    + 1 undecidable: .pui-menu__item:last-child (structural pseudo :last-child;
      subject matches .pui-menu__item, .pui-menu__item--danger)
toast-hit         3d3d5cc:index.html index.html
  → 10 pairs / 2 elements, 0 markup problems, 0 unmatched
  → FAIL — 5 declaration(s) differ   ← EXPECTED, not a regression
```

`toast-hit`'s FAIL is the designed output: it pins the deliberate 2026-08-24 `pointer-events:auto`
fix on `.toast-act`. I read **all five `✗` rows** with `grep -E "✗|…"` rather than
`grep -c "✗ #toast:"`, which has a documented blind spot (the base-state row prints
`✗ #toast (base)` with no colon, so that pattern returns 0 even when `#toast` regresses). All five
rows are `#toastUndo` — `(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus` — and **no row
is `#toast`**, which is the proof `#toast` still carries its `pointer-events:none`.

Restore preconditions, each run before touching the tree:

```
git log -1 --format="%h %an <%ae> %ad %s" e057051
  → PHANTOM AUTOPILOT <autopilot@phantom.local> … "chore: round 2026-09-06_0036 no-op …"
    (author = the runner, so this tip is the previous round's own commit, not an owner answer)
git merge-base --is-ancestor 3503537 e057051     → ancestor-ok
git diff --diff-filter=D --name-only HEAD e057051 → empty (path-checkout ≡ fast-forward)
git diff --stat e057051 -- .  (after restore)     → empty (tree matches the tip byte for byte)
```

Five channels, all checked **after** the restore where it matters:

1. `grep -c "| Option | Cost |" README.md` = **8**; `grep -c "If you answer:" README.md` = **8**.
   The two counters agree, which is itself the signal that nobody answered — README states an
   answer *replaces* the option table, so a disagreement is what an answer looks like.
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact is a file drop, not README text).
3. `main` / `mac/main` / `origin` / `origin/main` = `ef3220e` (2026-06-27) — unmoved.
4. `git status --untracked-files=all --short` → empty.
5. Non-`auto/*` refs: `design-system` / `origin/design-system` = `3503537` (2026-08-13, newest of
   the group), `mac` / `mac/design-system` = `e3a355c` (2026-07-20), `mac/hardening-pass` /
   `origin/hardening-pass` = `592e7c3` (2026-07-20). Nothing newer than 2026-08-13.

## What I did NOT do

- **Did not answer, edit, delete or relocate any of the eight open decisions.** Each moves pixels
  or adds a file to the repo; all eight are the owner's call. Decisions 2, 5 and 6 are the last
  three gaps in the element-parity criterion; 1 and 4 each gate one further criterion.
- **Did not re-run the `:short` A/B.** `AUTOPILOT.md:355–356` records that round `2026-09-04_0048`
  measured it live and caught a real inversion at rows 3–4; the evidence is sufficient and the file
  explicitly says future rounds need not repeat it. This is a deliberate skip, not an omission.
- **Did not re-run the retrospective restore audit** (completed round `2026-08-31_0023`, all 72
  branches by tree-sha identity) and **did not restore `docs/design-parity.md`** — that is
  decision 8, still unanswered.
- **Did not trim `AUTOPILOT.md`.** It is now 2,601 lines / 345,275 bytes before this round's edit,
  and that size is exactly why `## Next task` reaches the agent truncated to empty. Deleting round
  history is discarding evidence and is an owner decision, not an agent's.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** No CSS moved, so no
  pixel moved.
- **Did not open a browser.** Playwright and Chrome-DevTools MCP are *permission*-blocked here, not
  merely headless; retrying them without a permission change (decision 4) burns a round.

## Risk

- 🔴 **The `toast-hit` key reports `FAIL — 5 declaration(s) differ`, and a reviewer skimming for a
  green wall will read that as a broken build.** It is the intended, load-bearing output of that
  key. Tell a real regression from this one by the harness line `after : auto <- .toast-act` and
  by every `✗` row naming `#toastUndo`; a genuine regression would put `#toast` on one of them.
- 🔴 **The runner bug that causes all of this is still unfixed after 70+ rounds.** Every round
  branch is cut from `3503537` rather than the previous tip, so each round spends effort restoring
  before it can start. It has survived six day rollovers and a month boundary. No round can fix it.
- ⚠️ **`:short`'s row 1 was accidentally correct again this round — two heads in a row, both by
  luck.** Rows 3–5 of the same ordering are genuinely inverted (`8def8f7`/`_0002`, the *oldest* tip
  of the day, ranks above both `_0020` and `_0012`), so the trap fired; it just fired somewhere
  harmless. Do not read that as retired.
- ⚠️ **The forecast in `AUTOPILOT.md` is inference from `:iso8601` output, not a live A/B.** I did
  not run the `:short` pipeline form this round. It must not be cited as a measurement.
- ⚠️ **The `ds-disabled-hover` PASS says nothing about `.pui-menu__item:last-child`** — the harness
  reports it as undecidable (structural pseudo). A change confined to that rule computes 0 diff.
  Read it by hand if it ever matters.
- ⚠️ **The restore audit was file-level only.** If a round that skipped its restore dropped
  individual *lines* from a file that still exists, no check here would see it, and it is no longer
  provable retroactively.
- ⚠️ **Nothing in this repo has ever been merged.** `main` is still `ef3220e` (2 commits, no
  design-system) while 70+ `auto/*` branches stack in parallel. The work is real and verified, but
  it lives only on sibling branches.
