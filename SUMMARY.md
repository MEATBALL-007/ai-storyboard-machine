# Round summary — 2026-08-21 (branch `auto/…/2026-08-21_0012`)

## What I did

- **Found that this branch was cut from a stale base**, and restored the assumed baseline first.
  The runner cut my branch from `3503537`, but the `AUTOPILOT.md` contract I was handed was
  generated from branch `2026-08-21_0002`, which is two commits ahead. The practical damage:
  `tools/check-tokens.mjs` — named in my own Verify command — did not exist here. Commit
  `b6c9d03` restores `a231bf5` (channel tokens, `check-tokens.mjs`, README sync section) and
  `3d4cf6a`'s `AUTOPILOT.md`. **No new work in that commit.**
- **Did the named task: named the corner-radius scale** (`c627dd6`). Added
  `--r-xs/sm/md/lg/xl/2xl/full` to `design-system/src/tokens.css`, mirrored the `:root` block
  into `index.html`, and pointed all **61** `border-radius` literals in `index.html` plus **9**
  in the Phantom UI component CSS at those tokens.
- **Applied the tokens to the design system too, not just the app.** The DS components had
  hard-coded the same values (`2px` badges, `3px` controls, `5px` menus, `6px` modals). A radius
  token that only `index.html` honours while the owning library ignores it would not be a single
  source of anything, and `check-tokens.mjs` cannot detect that kind of gap.
- **Documented the scale in README** with a table mapping each token to what it is used for, plus
  an explicit flag that the ramp is 1px-granular and probably wants collapsing.
- **Rewrote `## Next task`** in `AUTOPILOT.md` to Chip parity, with the measured deltas inline,
  and added a standing warning about the stale-base problem.

## Why

**Why the rebase commit.** I was told to run the Verify command and not to edit it. On the base I
was given, `node tools/check-tokens.mjs` does not exist, so the command could not run at all. I
treated restoring the assumed baseline as a prerequisite rather than a second task, and kept it in
its own commit so a reviewer can drop it if the intent really is one independent PR per round.

**Why token names are `--r-md` and not `--radius-md`.** I wrote `--radius-*` first, then changed
to the names the plan spelled out. Plan-to-code drift is the exact failure mode this repo is
already suffering from, and the terse form also matches the existing `--bg` / `--dim` / `--line`
house style.

**Why I did not invent a spacing scale.** `AUTOPILOT.md` listed spacing as the round after radius.
I surveyed it and it is not mechanically tokenizable: `padding` uses nearly every integer from
1–12px plus 16/20/24/80, `gap` uses 3,4,5,6,7,8,12,14,24, and `font-size` steps 0.5px at a time
from 7 to 13 before jumping to 14/15/16/18/26/40. A 1:1 map yields ~16 tokens that name values
without systematizing them; snapping to a 4px grid moves pixels, which the contract reserves for
the owner. I recorded the histograms in `AUTOPILOT.md` and pointed the next round at element
parity instead.

## Verification

Full Verify command, run as one chain after the final edit:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```
```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
Tests  31 passed (31)
```

Additional checks:

- **Per-value radius counts are identical before and after**, which is the actual evidence that
  nothing moved: `32 md / 11 sm / 5 lg / 4 xl / 4 full / 3 2xl / 2 xs` — matching the baseline
  `32×3px / 11×2px / 5×4px / 4×5px / 4×50% / 3×6px / 2×1px`.
- `grep "border-radius:[0-9]"` on `index.html` returns nothing — no literals left.
- `grep -rn "radius-"` across README, `index.html`, `design-system/src/` returns nothing — no
  stale names from the rename.
- **Confirmed `check-tokens.mjs` is not passing vacuously**: I temporarily set `--r-md:9px` in
  `index.html` only; it exited 1 with `value drift: --r-md — tokens.css has "3px", index.html has
  "9px"`. Reverted, re-ran, back to 22/22.
- `npm --prefix design-system run build` succeeds; the rebuilt `dist/phantom-ui.css` contains
  `--r-md` 6 times (1 definition + 5 component usages), so the token really reaches the built
  library rather than just sitting in source.
- Baseline was captured green (54/54, 15/15, 31/31) before any edit, so the green above is a
  comparison, not just an assertion.

## What I did NOT do

- **No browser check.** Headless server, no display. Every claim above about "nothing moved" rests
  on the count-conservation argument, not on a rendered screenshot. Acceptance criterion 3
  (`file://` still works) remains unverified for the fourth round running.
- **No spacing or font-size tokens** — reasoning above; deliberately handed back to the owner.
- **No `.btn` base class in `index.html`.** I checked, and `.btn-primary`, `.btn-ghost`,
  `.icon-btn`, `.tab-btn` already match `Button.css` on every value. The only gap is structural —
  `index.html` styles modal buttons via the descendant selector `.modal-actions button` instead of
  a shared base class. Fixing that means editing `class=` in both markup and the JS that generates
  HTML, which is its own round.
- **Did not touch the three stray `rgba()` literals** in `Button.css:9`, `Badge.css:7`,
  `Badge.css:8` that should use the channel tokens. Noted in `AUTOPILOT.md`; too small to justify
  widening this round's scope.
- **Did not fix the runner.** Out of my reach, and it is a config change the owner should make.

## Risk

**Look at this first: the branching defect is the biggest problem in this repo, and it is not a
code problem.** All 27 `auto/…` branches are cut from `3503537`, and `main` is still at `ef3220e`
with 2 commits — no design system, no token work. Rounds are not accumulating; they are
re-deriving the same ground in parallel and each opening a PR that overlaps its siblings. My
round is the third to independently create `tools/check-tokens.mjs`. Until the runner branches
from the previous round or the PRs get merged, extra rounds mostly produce extra conflicting PRs.

**Commit `b6c9d03` duplicates content that already exists in an unmerged sibling PR** (branch
`2026-08-21_0002`). If that PR merges first, this one will conflict on `index.html`'s `:root`,
`README.md`, and `tools/check-tokens.mjs`. The conflicts are textually identical content, so they
resolve trivially, but a reviewer should expect them rather than be surprised.

**The radius change is verified by counting, not by looking.** Count conservation proves I did not
drop or add a declaration and that every value maps to a token of equal value. It does not prove
the browser resolves them — a typo'd custom property name silently falls back to the CSS initial
value (`0`), i.e. square corners, and no test here would catch it. `check-tokens.mjs` compares the
two `:root` blocks, not the usage sites. The rename from `--radius-*` to `--r-*` is exactly the
kind of edit that could strand a usage site, which is why I grepped for leftover `radius-`
(clean) — but **one glance at the running app is worth more than all of that**, and I could not
take it.

**One radius replacement is outside the `<style>` block**: the inline `style=` attribute on the
export-menu button (line ~596). I verified it is plain body markup that already resolved
`var(--accent)`, so it is safe, and it is not canvas code. Flagging it because the prior round
scoped itself strictly to lines 11–571 and I deliberately went one site wider.
