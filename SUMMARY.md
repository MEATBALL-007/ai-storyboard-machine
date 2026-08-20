# Round summary — 2026-08-21 (branch `auto/…/2026-08-21_0030`)

## What I did

- **Restored the baseline first — the branch was cut from a stale base again** (`12e8ca7`).
  The runner cut this branch from `3503537`; the `AUTOPILOT.md` I was handed was generated from
  branch `2026-08-21_0012`, three commits ahead. Without them `node tools/check-tokens.mjs` —
  named in my own Verify command — does not exist. Verified `git merge-base --is-ancestor` first,
  so this is a pure fast-forward of content with **no new work**.
- **Did the named task: Chip parity** — adopted **2 of the 3** differences against `.pui-chip`
  (`cursor:pointer`, `font-family:var(--mono)`).
- **Did NOT adopt `padding:6px 10px` — it does not fit, and the contract told me to stop rather
  than pick a smaller value myself.** Measured budget below; the decision goes to the owner.
- **Surveyed the three remaining criterion-2 elements** (Badge, Modal, EmptyState) that no prior
  round had compared. **All three are already at value parity** — the only differences are
  properties `body` already supplies. Recorded as a table in `AUTOPILOT.md` so nobody re-measures.
- **Documented both in README** under a new "Element parity with Phantom UI" heading, and set
  `## Next task` to self-hosting JetBrains Mono.

## Why

**Why `font-family:var(--mono)` on `.chip` is not a cosmetic no-op but is a render no-op.**
`body` (line 27) already sets `font-family:var(--mono)`, and the only other `font-family`
declarations in the file are on `button`, `input/textarea/select`, and one unrelated rule at 502.
Chips are `<div>`s, so nothing between `body` and `.chip` intercepts the inherited value. Adding it
explicitly changes zero pixels; it makes the rule self-contained like `.pui-chip`, which is the
point of parity. `cursor:pointer` is a genuine fix — chips carry `onclick` handlers
(`index.html:2756`) but rendered a text caret.

**Why the chip padding is blocked.** The width budget, all from fixed px values so no font metrics
are needed for the container half:

| Step | Width |
|---|---|
| `#left` 212px, minus its 1px right border | 211px |
| minus vertical scrollbar (`::-webkit-scrollbar{width:8px}`) | 203px |
| minus `.section` padding 12px × 2 | 179px |
| minus `.radio-grid` gaps 4px × 3 | 167px → **41.75px per track** |

`16:9` is 4 characters of 10px monospace ≈ 24px, and `*{box-sizing:border-box}` means padding and
border come out of that track: `24 + 20 + 2 = 46px` needed vs 41.75px available. The failure is not
clipping — `1fr` is `minmax(auto, 1fr)`, so the track cannot shrink below min-content and the grid
instead grows to 196px, pushing a horizontal scrollbar into the sidebar. **7px is the largest
padding-x that always fits.** Fixing it means widening `#left`, shrinking the font, going to two
columns, or changing the DS value — all four move pixels, so per `AUTOPILOT.md` I stopped and
handed it over rather than quietly shipping `6px 7px`.

**Why I left a CSS comment at the `.chip` rule.** A bare `6px 2px` sitting next to a README that
says the DS value is `6px 10px` invites the next round to "fix" it and reintroduce the overflow.

## Verification

Full Verify command, unmodified, run as one chain after the final code edit:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```
```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
Test Files  12 passed (12)
     Tests  31 passed (31)
```

Additional checks:

- **Baseline captured green before any edit** (54/54, 22/22, 31/31), so the green above is a
  comparison rather than a bare assertion.
- **Base restoration proven content-identical**: after `git checkout 9c719cc -- .`,
  `git diff 9c719cc` printed nothing. `git diff --stat` between rounds `_0002` and `_0012`
  confirmed `_0012` is a strict content superset, so folding in only `_0012` loses nothing.
- Font-inheritance claim checked by enumerating **every** `font-family` in `index.html`
  (4 declarations, lines 27/35/36/502) — none on the chip's ancestor chain.
- Chip interactivity confirmed at `index.html:2756` before adding `cursor:pointer`.
- All 8 chips are static markup (lines 645–657); `grep` found no JS-generated `.chip`, so the
  longest label really is 4 characters and the measurement covers every instance.

## What I did NOT do

- **Did not change chip padding.** Reasoning above; deliberately handed to the owner.
- **No browser check — and this time it is not just "no display".** I tried the Playwright and
  Chrome-DevTools MCP tools to open `file://…/index.html` and measure the real track width;
  **both were permission-denied.** `git merge`, `git cherry-pick`, and `git reset` are denied too
  (I used `git checkout <sha> -- .` instead). Criterion 3 is unverified for the fifth round, and
  no future round can fix that without the owner opening the permission. Noted in `AUTOPILOT.md`
  so nobody burns another round rediscovering it.
- **Did not add the `.btn` base class.** Values already match `Button.css`; the gap is structural
  and would mean editing `class=` in markup *and* in the JS that generates HTML. Its own round.
- **Did not touch the 3 rgba literals** in `Button.css:9`, `Badge.css:7-8`. Still noted as a
  pick-up-anytime item.
- **Did not tokenize spacing/font-size.** Prior round established these are a continuum, not a
  scale; unchanged.

## Risk

**The branching defect is still the top problem, and it is getting worse, not better.** There are
now 28 `auto/…` branches all cut from `3503537`, and `main` is still at `ef3220e` with 2 commits —
no design system, no token work. This is the **second consecutive round** that had to spend its
opening on base restoration. Every round produces a PR that overlaps its siblings; rounds are not
accumulating. **This is a runner configuration fix, not a code fix**, and no amount of agent work
inside a round can resolve it.

**Commit `12e8ca7` duplicates content from two unmerged sibling PRs** (`_0002`, `_0012`). If either
merges first this PR conflicts on `index.html`, `README.md`, `AUTOPILOT.md`, `tools/check-tokens.mjs`
and the DS component CSS. The content is textually identical, so conflicts resolve trivially — but
a reviewer should expect them. **If `_0012` has already merged, drop `12e8ca7` and keep only the
two commits after it.**

**The overflow claim is arithmetic, not observation.** The container half (41.75px) is exact — every
input is a fixed px value. The text half is an estimate: I assumed ~0.6em advance width for 10px
monospace. JetBrains Mono is 0.6em, and the offline fallbacks are close (Consolas 0.55em, Courier
New 0.6em), so `16:9` lands at 22–24px against a 19.75px budget under every candidate font — the
conclusion holds across the range, but **the margin is single-digit pixels and I could not look at
it.** If the owner has a browser, this is a ten-second check worth doing before acting on my number.
Note the scrollbar assumption matters: without a vertical scrollbar the budget is 43.75px and 10px
padding *nearly* fits, which is likely why the DS value looked plausible in the first place.

**Parity here means "same declared values", not "same rendered output".** I compared CSS rules by
reading them. For Badge/Modal/EmptyState I verified the missing properties are supplied by `body`,
but I did not render either codebase side by side. A difference arising from surrounding context
(a parent's `line-height`, a stacking or `backdrop-filter` interaction) would not show up in this
method. `.pc-badge` also adds `position:absolute` and `backdrop-filter:blur(2px)` that `.pui-badge`
lacks — I judged those app-specific placement concerns rather than parity gaps, which is a
judgement call a reviewer may disagree with.
