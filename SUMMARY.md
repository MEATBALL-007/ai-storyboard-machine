# Round 2026-08-24_0048

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from the stale base
  `3503537` again (44 rounds missing from the tree — no `tools/check-tokens.mjs`, no
  `docs/btn-parity-proof.mjs`, `index.html` back at its pre-token state). Commit `10f2a0b`
  brings the tree back to `526b564`, the tip of round `2026-08-24_0036`, exactly as the last
  five rounds have had to do.
- **Checked `README.md → ## Open decisions` for owner answers: there are none.** `git log --`
  `README.md` shows its only commits are `ef3220e` / `44237ee` (pre-autopilot) plus this
  round's restore. No decision is answered, so criteria 1 / 2 / 3 stay blocked and the
  contract's single named fallback task applies.
- **Taught `docs/btn-parity-proof.mjs` to read the design system's CSS** (commit `fb970f3`).
  A source may now be a `.css` path (or `<rev>:<path>`), and when it is `styles.css` the
  harness follows every `@import` and splices each imported file in **at the point the
  `@import` appears**, depth first — which is the order a browser lays the rules down. Every
  run prints the assembled file list in order (14 files today). Missing `@import` targets
  throw; `@import` cycles throw; re-importing the same file down two paths is allowed,
  because that is legal CSS and simply duplicates the rules.
- **Added the `ds-disabled-hover` key** — the three controls decision 7 asks about
  (`.pui-btn--icon`, `.pui-menu__item`, `.pui-menu__item--danger`). Classes are identical
  before and after on purpose: today it is a 0-diff baseline whose job is to be re-run the
  moment `Button.css` / `Menu.css` change and say exactly which declarations moved.
- **Added the guard that replaces markup coverage in stylesheet mode.** A stylesheet has no
  markup, so phase 1 cannot run; it now says `markup coverage N/A` instead of a misleading
  `OK`, and hard-fails if an element in the table claims a class/inline change it cannot
  prove. In its place, any element that matches **zero rules in both versions** is now a
  failure in every mode — without that, a typo in the element table computes two empty
  declaration sets, diffs clean, and reads as proof.

## Why

- Rounds 0023 (`Toast.css`) and 0036 (decision 7) both had to fall back to "read the
  `git diff` yourself" as evidence, because the harness could only see `index.html`. Decision
  7, whenever it is answered, edits `Button.css` and `Menu.css` — so this was the one
  remaining piece of preparation that moves zero pixels.
- **Import order, not specificity, is what decides every case decision 7 is about.** Reading
  one component file in isolation, or several in the wrong order, would produce a confident
  and wrong answer. That is why the harness assembles from `styles.css` rather than accepting
  a list of files, and why it prints the order on every run.
- The zero-rule guard is not extra scope, it is the load-bearing check for the new mode: in
  HTML mode a bad table is caught by markup coverage, and stylesheet mode had nothing.

## Verification

Verify command, all three steps, run on the final committed tree:

```
node tools/test.mjs                  -> 54 passed, 0 failed
node tools/check-tokens.mjs          -> tokens 22/22, fonts 4/4, and checks 3-6 all clean
                                        (15 CSS sources scanned)
npm --prefix design-system test      -> Test Files 12 passed (12), Tests 31 passed (31)
```

Every existing harness key still gives the result recorded for it:

```
buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
segmented  021b966:index.html index.html         -> PASS, 45 pairs / 9 elements
toast      bb10dd9:index.html 10e8f39:index.html -> PASS, 5 pairs / 1 element
toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 declaration(s) differ
                                                    (#toast: no diff at any state; all 5 are
                                                     #toastUndo pointer-events (unset)->auto)
```

New key, on the current tree:

```
node docs/btn-parity-proof.mjs ds-disabled-hover \
  HEAD:design-system/src/styles.css design-system/src/styles.css
-> 14 files listed in @import order: styles, tokens, fonts, Button, Chip, Field, Toggle,
   Modal, Toast, Menu, SegmentedToggle, Swatch, Badge, EmptyState
-> markup coverage N/A — the source is a stylesheet, and no element claims a class change
-> PASS, 15 pairs / 3 elements
```

Four negative tests, each reverted immediately afterwards (`git status` is clean apart from
`AUTOPILOT.md` / `SUMMARY.md`):

1. **Source order alone.** Swapped `Button.css:15` and `:16` — same two rules, same
   specificity `(0,2,0)`, nothing else touched. Result:
   `FAIL — 1 declaration(s) differ`, and the one diff is exactly the decision-7 case:
   `.pui-btn--icon:disabled:hover  color  before var(--dim) <- :disabled  after var(--accent) <- :hover`.
   This is also positive evidence the table matches real rules, and it independently confirms
   round 0036's correction that `:disabled`, being later, wins `color`.
2. **A pixel.** `padding:5px 10px` -> `5px 11px` on `.pui-btn--icon`:
   `FAIL — 5 declaration(s) differ` (one per state).
3. **A missing `@import` target.** Pointed `styles.css` at `Menu/Nope.css`: throws
   `Error: no such file: design-system/src/components/Menu/Nope.css` and exits non-zero,
   rather than quietly assembling a stylesheet one file short.
4. **A wrong element table.** Typed `pui-menu__itemx` in the table:
   `✗ .pui-menu__item matched no rule in either version — its row in the table is wrong, not
   proven`, `FAIL — ... 1 unmatched element(s)`. Before this round that case printed PASS.

## What I did NOT do

- **Did not answer any of the seven open decisions,** and did not touch `Button.css`,
  `Menu.css`, or `index.html`. Every one of those edits moves visible pixels with nothing in
  the Verify command able to detect it (jsdom does no hit testing; no checker reads `:hover`).
- **Did not touch `tools/`** and did not add a seventh token check — all 22 tokens are covered.
- Did not implement `:last-child` / `>` / `+` / `~` matching. Doing that needs a real DOM
  tree, which this harness deliberately does not build. See Risk.
- Did not tick any acceptance criterion. This round produced no user-visible change; it built
  the instrument that makes the next library-side change reviewable.

## Risk

- **The harness silently drops selectors it cannot model, and the file's own header says
  otherwise.** The header claims `>` `+` `~` and structural pseudo-classes are "reported as
  unsupported, not silently ignored". They are not: `ruleMatches()` returns
  `{matched:false, unsupported:true}` and `computed()` discards the flag. This is now load
  bearing, because `Menu.css:31` `.pui-menu__item:last-child{border-bottom:none}` is a real
  rule affecting two of the three `ds-disabled-hover` elements — a change confined to it would
  report 0 diff. It is called out in the new table's comment and is set as the next task.
  Nothing in this round's claims rests on that rule.
- **`ds-disabled-hover` is a 0-diff baseline, so its PASS proves little on its own.** What
  gives it weight is negative test 1: the same table turns a pure source-order swap into a
  precise one-line diff, so the rules really are being matched and ordered.
- **Still no browser** (decision 4 unanswered). Everything above is computed from source and
  the CSS cascade rules, not observed in a renderer.
- The harness is not in the Verify command and nothing forces it to keep up with the code —
  the same caveat every round since 0027 has carried.
