# Round summary — token adoption pass (index.html ← design-system/src/tokens.css)

**Headline: the task as written was ~90% already done, and the remaining 10% is
blocked on tokens that do not exist.** Details below, plus the list of
non-matching values the owner has to rule on.

## What I did

- **Verified, not assumed, the starting state.** `index.html:17-24` (`:root{...}`) is
  **byte-identical** to all 8 lines of `design-system/src/tokens.css` (compared
  line-by-line in Node after removing the outer 2-space indent — 8/8 `SAME`). The
  token set is already in the app's `<style>`; nothing needed adding.
- **Swept the whole file for hard-coded values that exactly equal a token value.**
  Wrote a throwaway Node scan (hex incl. 3-digit shorthand + `rgb()/rgba()`,
  zoned by `<style>` / PURE-LOGIC / TESTS / other-JS boundaries read from the
  actual markers). Result before my edit: **0 exact matches left in the CSS
  layer**; 2 in an inline `style=` attribute; 8 in JS.
- **Mapped the only exact matches `var()` can reach**: `renderSkeleton()`'s inline
  shimmer gradient hard-coded `#111` twice (`index.html:2233`) →
  `var(--surface)`. `#111` === `#111111` === `--surface`/`--card`, and `var()`
  resolves in `style=` attributes, so this is pixel-identical.
- **Documented the block's provenance** (`index.html:12-16`): a comment stating it
  is mirrored verbatim from `tokens.css`, that the two must stay byte-identical,
  and that the design system defines no spacing/radius/type-scale tokens.
- Ticked acceptance criteria 5 and 6 in `AUTOPILOT.md` (both suites verified green
  this round) and rewrote `## Next task`.

## Why

- **Why the task was already done:** the design system was *extracted from*
  `index.html`, not built beside it — `Button.css` hard-codes the same `#000` and
  `rgba(255,199,44,.4)` the app does, and `Chip.css` is a near-copy of the app's
  `.chip` rule. So the app and the DS have shared a token vocabulary from day one;
  what has never existed is a *link* between the two copies. That reframes the
  goal: the work left is not "adopt tokens" but "make the duplication enforced and
  the element rendering shared".
- **Why I did not touch the 29 alpha-derived colors** (`rgba(255,199,44,.4)` etc.):
  no token holds that value, and the round's instruction is to list mismatches
  rather than decide. See the table below — this one needs a mechanism decision,
  not a color decision.
- **Why I did not touch the canvas colors:** `ctx.fillStyle` takes a resolved color
  string; `var(--accent)` is not valid there. Tokenizing them means reading tokens
  in JS (a `getComputedStyle` call or a JS-side token object) — a real change with
  a real failure mode, not a no-op rename.
- **Why only a comment and not a sync tool:** enforcing the mirror is acceptance
  criterion 7 and is now the Next task. One task per round.

## Values with NO exact token match — owner decision required

Nothing below was changed.

### 1. Alpha-derived brand colors — 29 sites (20 in CSS, 9 in JS)

The RGB channels are *exactly* the token colors; only the alpha differs, so no
token can match them:

| literal | equals | sites |
|---|---|---|
| `rgba(255,199,44,α)` α ∈ {0, .05, .07, .16, .32, .35, .4, .45, .5, .6, .85, .9, .95} | `--accent` #FFC72C | 21 |
| `rgba(250,70,22,α)` α ∈ {.1, .18, .4} | `--secondary` #FA4616 | 5 |
| `rgba(13,13,13,α)` α ∈ {.86, .92} | `--bg` #0D0D0D | 2 |

These are every glow, tint and scrim in the app (`#genBtn:hover`, `.sev.warn`,
`.tour-spot`, `#gridHeader` scrim, …). **They will go stale the moment `--accent`
changes** — this is the single biggest remaining token leak.
Two mechanisms, both pixel-identical, neither free:
- **(a) channel tokens** — add `--accent-rgb:255,199,44` etc. to `tokens.css` and
  use `rgba(var(--accent-rgb),.4)`. Works in every browser. Cost: enlarges the
  design system's public token surface, and the DS's own component CSS should be
  converted too (its 31 tests would need a look).
- **(b) `color-mix(in srgb, var(--accent) 40%, transparent)`** — no new tokens, but
  needs Chrome 111+ / Safari 16.2+. For a "double-click the .html file" app,
  silently breaking older browsers is a worse trade than (a).
Recommendation: (a).

### 2. Colors with no token at all — CSS layer

`#000` (13×, pure black on accent fills — deliberately *not* `--bg`), `#0a0a0a`
(4×, scene bar / animatic chrome — darker than `--panel`), `#161616` (2×) and
`#151515` (1×) (table + project-list rules — between `--line` and `--surface2`),
`#222`/`#333` (scrollbar thumb), `#7ac87a` + `rgba(120,200,120,.15)` +
`rgba(122,200,122,α)` (the "ok/live" green — **the app has a third brand color the
design system has no token for**), `#ffb4a0` (error toast text), `#fff`, `#bbb`,
`rgba(255,255,255,{.008,.06,.6,.7,.85})`, `rgba(0,0,0,{.5,.6,.7,.74,.9})`,
`rgba(80,180,90,.85)`. Adding tokens for these is a design call.

### 3. Spacing / radius / type scale — **no tokens exist to map to**

`tokens.css` is 8 lines: 11 colors + `--mono`. There is **no** spacing, radius, or
font-size token, so the "ระยะ" (spacing) half of this round's task is not
merely undone — it is unperformable. The app and the DS independently hard-code
the same ad-hoc scale: radii 2/3/4/5/6px, gaps 3/4/5/6/7/8/10/12/14px, font sizes
7/7.5/8/8.5/9/9.5/10/10.5/11/12/13/14/15/18px. Extracting a scale from those means
choosing which values collapse into one another — a design decision.

### 4. Exact matches that remain, in JS only (8)

`index.html:2011` and `:2026` — `accent:'#FA4616'` inside two *palette data*
objects (`= --secondary`, but calling it the brand secondary is a semantic claim,
not a refactor); `:3472,:3473,:3482,:3483` — `ctx.fillStyle` in the contact-sheet
canvas renderer (`#0D0D0D`, `#FFC72C`, `#FA4616`); `:2990` — inside the
`==TESTS==` markers, **out of scope**.

## Verification

Ran the AUTOPILOT Verify command verbatim, unmodified:

```
$ node tools/test.mjs
54 passed, 0 failed

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

Post-edit re-scan of `index.html` (same Node scan, marker boundaries recomputed
after the line shift): exact-match literals still hard-coded = **8, all in JS**;
CSS layer = **0**. Markers intact and found by the scan at PURE-LOGIC 961-1137,
TESTS 2902-2983 — `tools/test.mjs` extracted them without throwing, which is
itself proof they were not moved.

`git diff` for the round is 6 insertions, 1 deletion, `index.html` only.

## What I did NOT do

- **Did not add a spacing/radius/type scale** — nothing to map to (§3 above).
- **Did not convert the 29 alpha-derived colors** — needs the mechanism decision in
  §1.
- **Did not tokenize the canvas/`ctx.fillStyle` colors** — different mechanism,
  different round.
- **Did not write the README sync section or a drift check** — that is acceptance
  criterion 7 and is now the Next task.
- **Did not change any element's appearance** — that is criterion 2, next-next.
- **Did not open a browser.** The pixel-identity claim rests on `#111` ===
  `#111111` === `--surface` and on `var()` being valid in a `style=` attribute; it
  is not a screenshot diff. See Risk.
- Did not touch `storyboard-simulator.html`, the markers, or any test.

## Risk

- **The main risk is that this round looks like less progress than it is.** A
  reviewer expecting a large token diff will find 7 changed lines. The finding —
  that the token layer was already unified and the real gaps are elsewhere — is
  the deliverable. If that finding is wrong I would be hiding it, so: the evidence
  is the 8/8 `SAME` line-by-line comparison, reproducible in five lines of Node.
- **`renderSkeleton` (`index.html:2233`) is the only functional change.** It is the
  loading shimmer shown while panels generate. Verified by value equality, not by
  eye. If `var(--surface)` somehow failed to resolve the gradient stop would fall
  back to `unset` and the shimmer would look wrong — worth one glance in a browser.
  Nothing else in the app renders differently.
- **Pre-existing external dependencies contradict the project's own pitch, and I
  left them alone.** `index.html:7-10` loads Google Fonts (2 preconnects + a
  stylesheet) and jsPDF from cdnjs. So the README's "no build tools, no npm, no
  backend" is true but "opens straight in a browser" is only *offline*-true for the
  core app: with no network, JetBrains Mono falls back to `ui-monospace` and **PDF
  export fails**. Acceptance criterion 4 only forbids *new* external references, so
  this is not a regression — but the design system already ships self-hosted
  JetBrains Mono woff2 files (`design-system/src/fonts/`, 4 weights) and
  `fonts.css`, so inlining them would remove one CDN and make the app match the DS
  typography exactly. Flagging, not fixing: it changes file size materially
  (base64 fonts in a 187 KB file) and is a call for the owner.
- **The design system has a green (`#7ac87a`) with no token**, used for "AI live"
  and "continuity ok" states in the app. Any future token pass that ignores it will
  leave a third brand color permanently untokenized.
- I did **not** tick acceptance criterion 1. Colors in the CSS layer satisfy it;
  spacing cannot yet, and "from tokens.css" is currently a copy rather than a
  reference. Ticking it would overstate the state.
