# SUMMARY — round 2026-08-21_0002

## What I did

- Added three channel tokens to `design-system/src/tokens.css` — `--accent-rgb:255,199,44`,
  `--secondary-rgb:250,70,22`, `--bg-rgb:13,13,13` — and mirrored the whole `:root{}` block
  into the `<style>` block of `index.html`.
- Rewrote **all 20** token-derived `rgba()` literals inside `index.html`'s `<style>` block
  (lines 11–571) as `rgba(var(--accent-rgb), α)` etc.: accent ×15, secondary ×3, bg ×2 —
  exactly the counts AUTOPILOT.md predicted. Changing `--accent` now actually moves every
  glow, ring, gradient and tint with it.
- Wrote `tools/check-tokens.mjs`, which **did not exist** even though AUTOPILOT.md's Verify
  command and acceptance criteria both claimed it did. It parses the `:root{}` block from
  `tokens.css` and from `index.html` and exits 1 on a missing or drifted token.
- Added a "Design tokens — single source of truth" section to `README.md` — also claimed as
  done by AUTOPILOT.md, also absent — documenting the copy-the-block sync procedure, the
  channel-token convention, and why the canvas literals are deliberate.
- Updated `AUTOPILOT.md`: ticked the four criteria that are now genuinely true, annotated the
  colour criterion as complete, and set Next task to the radius token group.

## Why

- **`rgba(var(--x-rgb), α)` rather than `color-mix()`** — per the plan. Identical output, no
  dependency on newer browser support, and no risk of a rounding difference showing up as a
  visual diff. The values are the same numbers as before, so this round is pixel-identical
  by construction, not by inspection.
- **Line-range-bounded rewrite instead of a global replace.** `rgba(255,199,44,…)` appears on
  8 more lines *outside* the style block, inside canvas drawing code (`ctx.strokeStyle` /
  `ctx.fillStyle`, lines 1620–3194), plus one `rgba(250,70,22,…)` at line 1606. Canvas does
  not resolve CSS custom properties — `var()` there parses as an invalid colour and the paint
  silently turns black. I ran the substitution through a throwaway script clamped to the
  `<style>…</style>` line range, then deleted the script. It reported `replaced 20`.
- **I wrote `check-tokens.mjs` rather than skipping it.** Step 4 of the assigned task and the
  Verify command I am required to run both invoke it. Without it the named task could not be
  completed or verified at all. I treated it as part of this task, not a second one — but it
  *is* net-new code that the plan assumed already existed, so it deserves review attention.
  The README section is the other half of the same falsely-ticked criterion.

## Verification

Full Verify command, run at the end on the committed tree:

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
tokens in sync: 15/15 from design-system/src/tokens.css present and identical in index.html
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

Negative tests on `check-tokens.mjs` (temporarily set `--accent:#FF0000` and added a
`--brand-new` token to `tokens.css`, then reverted):

```
FAIL  value drift: --accent — design-system/src/tokens.css has "#ff0000", index.html has "#ffc72c"
FAIL  missing in index.html: --brand-new (design-system/src/tokens.css has "#123456")
2 token(s) out of sync. ...            → exit code 1
```

So it fails on both drift and omission, not just on a missing file. The extras path (a token
in `index.html` absent from `tokens.css`) was also exercised accidentally and printed three
`warn` lines without failing — that is intentional; app-only tokens are allowed.

Residual grep over `index.html` for `rgba(255,199,44|rgba(250,70,22|rgba(13,13,13`: 9 hits,
**all** at lines > 571 and all of them `ctx.strokeStyle` / `ctx.fillStyle` assignments.

## What I did NOT do

- **No spacing / radius / typography tokens.** `tokens.css` still holds only colours, the
  three channel tokens and `--mono`. That is deliberately the next round's task; the radius
  group is now specced in AUTOPILOT.md with its measured counts (60 `border-radius`
  declarations, 7 distinct values).
- **Did not touch any `rgba()`/hex in the canvas code** — explicitly out of scope, and would
  break rendering.
- **Did not open `index.html` in a browser.** This is a headless server with no display, so
  the `file://` acceptance criterion is still unverified — as it was before this round. The
  change is CSS-value-preserving, but "the tests pass" is not the same claim as "the page
  still renders".
- **Did not touch the CDN `<head>` references or `storyboard-simulator.html`.**

## Risk

- **Highest-value thing to eyeball: the two lines with unusual alpha.** `rgba(var(--accent-rgb),0)`
  (line 108, `#genBtn`'s zero-alpha resting shadow) and the `editPulse` keyframe (line 484,
  two occurrences on one line, `.6` → `0`). Both are transitions/animations from a fully
  transparent state; they are correct as plain substitutions, but a typo there would only
  show up as a missing hover glow or a dead pulse animation, which no test covers.
- **Nothing in the test suite covers CSS at all.** `tools/test.mjs` extracts and exercises the
  pure-logic block; it would pass just as happily if every glow in the app had turned black.
  The pixel-identity claim rests on the substitution being value-preserving by construction
  plus the residual grep, not on an executed check.
- **`check-tokens.mjs` is new, unreviewed enforcement.** It is the thing that now gates the
  Verify command, so a bug in it either blocks future rounds falsely or waves drift through.
  Its parser is deliberately simple: it takes the *first* `:root{…}` block in each file and
  splits on `;`. If someone adds a second `:root` block, a media-query-scoped override, or a
  declaration containing a semicolon, it will read the wrong thing. Adequate for these two
  files today; not a general CSS parser.
- **AUTOPILOT.md was describing work that had not been done.** Two `[x]` criteria referenced a
  script and a README section that did not exist in the repo. I made both real rather than
  unticking them, but it is worth knowing the plan file had drifted from the tree — other
  claims in it may deserve the same scepticism.
