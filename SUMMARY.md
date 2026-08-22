# Round summary — 2026-08-23_0047

## What I did

- **Restored the previous round's work first.** The branch was cut from `3503537` (the original
  contract commit), not from the tip of `auto/…/2026-08-23_0027`, so ~1,550 lines of prior work
  (`tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, the whole token migration in
  `index.html`, the `.btn` refactor, the README rewrite) were missing from my tree. Commit
  `cfe9efd` puts the tree back to `021b966` exactly (`git diff` against it is empty).
- **Collapsed the app's three segmented controls onto a shared `.seg` base**
  (`index.html`, `<style>` ~line 182 + three `<div>`s in the grid header). `.dn-toggle`,
  `.col-toggle` and `.ovl-toggle` each declared their own wrapper rule and their own `.on` rule;
  all three were byte-identical. They now read `class="seg dn-toggle"` etc., with the group class
  holding only its own delta — the same base-plus-modifier shape as `.pui-segmented` /
  `.pui-segmented__btn` / `.is-active` in the design system. Net: 9 rules → 6, one of them shared.
- **Surveyed `.menu-pop` against `Menu.css` — and changed nothing**, because there is nothing to
  collapse: the app already declares that menu once, and every value matches.
- **Generalised `docs/btn-parity-proof.mjs`** so a second refactor could use it: a keyed
  `REFACTORS` table selected by a new first CLI argument, non-`button` subjects via `type`,
  per-version ancestor chains via `beforeAncestors`/`afterAncestors`, and a markup-coverage rule
  that requires a token to disappear only if the refactor actually drops it (which also removed a
  hardcoded `c !== 'active'` special case).
- **Wrote up what only the owner can decide** as `## Open decisions` item 5 in `README.md`
  (segmented-control padding), and recorded the Menu and SegmentedToggle findings in the
  criterion-2 table in both `README.md` and `AUTOPILOT.md`.

## Why

**Why the three groups were not made identical.** `.dn-toggle` uses `4px 10px` / `9.5px`, which
matches `.pui-segmented__btn` exactly. `.col-toggle` uses `4px 9px` and `.ovl-toggle` uses
`4px 7px` / `9px`. Making them match the design system widens the overlay group by ~24px inside
`#gridHeader`, which has `flex-wrap:wrap` — so on a narrow window the header row could start
wrapping where it did not before. That is a design change, not a refactor, so it went to
`## Open decisions` as instructed rather than into the CSS.

**Why `display:flex` was left as-is.** Phantom UI's wrapper uses `inline-flex`. All three toggles
are direct children of `#gridHeader`, which is `display:flex`, so they are flex items and their
`display` is blockified — `inline-flex` and `flex` produce the same used value here. Changing the
declaration to match the DS text would have bought nothing and would have shown up as a diff in
the parity proof, weakening the very evidence this round rests on.

**Why the proof harness grew instead of being copied.** The old `ELEMENTS` table encodes the
*button* refactor's before-state, which no longer exists in `index.html`; running it against
today's file with a second table appended would compare `.icon-btn` against CSS that no longer
declares it. A keyed table keeps both rounds' arguments runnable.

## Verification

Verify command, run at the final tree — all green:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```
```
54 passed, 0 failed
tokens in sync: 22/22 ...            fonts in sync: 4/4 ...
no derived-colour literals: 15 CSS source(s) ...   font weights available: 15 ...
no radius literals: 15 ...           typeface from one source: 15 ...
Test Files  12 passed (12)           Tests  31 passed (31)
```

Pixel-neutrality proof (not part of Verify, by design):

```
node docs/btn-parity-proof.mjs segmented 021b966:index.html index.html
  markup coverage OK — 0 old class tokens gone, 3 new class attributes at the expected counts
  compared 45 (element, state) pairs across 9 "segmented" elements
  PASS — every element computes an identical declaration set before and after.

node docs/btn-parity-proof.mjs buttons 2488f2d:index.html index.html
  markup coverage OK — 7 old class tokens gone, 5 new class attributes at the expected counts
  compared 85 (element, state) pairs across 17 "buttons" elements
  PASS
```

The second run is the regression check: last round's button argument still holds against the file
as I leave it.

Two negative tests, each applied then reverted:

| Injected fault | Result |
|---|---|
| `.ovl-toggle button` padding `4px 7px` → `4px 8px` | `FAIL — 10 declaration(s) differ` (both overlay buttons × 5 states), exit 1 |
| `class="seg dn-toggle"` → `class="dn-toggle"` on one wrapper | `✗ expected 1x class="seg dn-toggle" …, found 0`, exit 1 |

## What I did NOT do

- **Did not answer any open decision.** README `## Open decisions` still has zero owner answers;
  I checked before starting, and item 5 is a new question, not an answer to an old one.
- **Did not equalise the three toggles' padding** — decision 5, see above.
- **Did not rename `.on` to `.is-active`** to match the DS class name. `.on` is the app-wide
  convention (13 rules use it) and is written by JS in four places; renaming buys a name and risks
  a live control.
- **Did not touch `tools/`** or add a seventh token check, as the contract instructs.
- **Did not add the missing `:disabled:hover` / `.danger:hover` rules to `Menu.css`.** The app has
  them and the design system does not, so a disabled Phantom UI menu item still changes colour on
  hover. That is a gap on the *library* side; fixing it changes rendering for every consumer of
  the component, so it is the owner's call. Recorded in `AUTOPILOT.md`, not acted on.
- **Did not open the app in a browser** — still blocked by permissions (decision 4), unchanged.

## Risk

- **Nobody has seen this render.** The proof is a static cascade model, not a browser. Its known
  limits are listed at the top of the file (no `>`/`+`/`~`, no structural pseudo-classes,
  shorthands compared by property name, `@media` blocks applied unconditionally and reported). It
  reported one media match, `@media(prefers-reduced-motion:reduce) { * }`, in both runs.
- **The cascade diff trusts the `ELEMENTS` table for class membership; it does not read the
  markup.** Negative test 2 demonstrates this directly: with the `seg` class stripped from a
  wrapper, the cascade diff still reported 0 differences and only the markup-coverage phase caught
  it. That phase is therefore load-bearing, and it only checks elements whose class list changed.
  I have flagged this in the Next task.
- **Source order, not specificity, is what makes this safe.** `.seg button` and
  `.col-toggle button` are both (0,1,1), so the group overrides work only because they sit after
  the base. Anyone inserting a segmented rule earlier in the `<style>` block will silently change
  the padding. The comment above `.seg` says the modifiers hold the deltas, but nothing enforces
  the ordering.
- The three wrappers' ancestor chain is hardcoded in the proof as
  `#center > #gridView > #gridHeader`. If that markup moves, the proof would need updating, and it
  is not in Verify so nothing will tell you.
