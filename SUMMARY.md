# Round summary — 2026-08-20

Task this round: add the `design-system/src/tokens.css` token set into `index.html`'s
`<style>`, and repoint hard-coded colour/spacing values at tokens whose value matches
**exactly**. Zero visual change expected.

## What I did

- **Verified the token set is already present in `index.html` — byte-identical to
  `design-system/src/tokens.css`.** `index.html:12-19` and `tokens.css:1-8` declare the
  same 12 custom properties, in the same order, with the same values. The first half of
  this round's task was already done (by shared authorship, not by any mechanism).
- **Proved the second half has an empty result set.** I extracted every colour literal
  from the 558-line `<style>` block and compared against the token values. Every hex
  literal that equals a token (`#0D0D0D`, `#111111`×2, `#141414`, `#0C0C0C`, `#FFC72C`,
  `#FA4616`, `#E0E0E0`, `#9a9a9a`, `#2E2E2E`, `#1c1c1c`) occurs **inside `:root` itself**.
  Nothing outside `:root` is an exact match, so there was no safe substitution to make.
- **Made the duplication intentional and discoverable** (`index.html:12-17`): a provenance
  comment naming `tokens.css` as the single source of truth, why it is copied rather than
  `@import`ed (one file, no build step), and the rule that the block must stay
  byte-identical. Comment only — no declaration changed.
- Listed every remaining un-tokenized value below, split by *why* it doesn't match, since
  resolving each is a design decision the owner has to make.

## Why

The instruction was explicit: do not change values that have no exact token match, list
them instead. Once the data showed zero exact matches remained, the honest deliverable for
this round became the finding plus the provenance note, not a cosmetic edit. Per hard rule
5, a round that corrects the plan is a successful round.

I did **not** invent the tokens that would make the remaining literals substitutable
(e.g. `--accent-rgb`), even though doing so is pixel-identical, because that expands the
design system's token surface — which belongs to the next task, under its own review.

## Values that do NOT match any token

### Class A — alpha derivatives of an existing token colour (~30 occurrences)

CSS cannot apply an alpha to a hex custom property; `rgba(var(--accent), .4)` is invalid.
These need channel tokens (`--accent-rgb:255,199,44`) before they can be tokenized.

| literal | derives from | count |
|---|---|---|
| `rgba(255,199,44,{.05 .07 .16 .32 .35 .4 .45 .5 .6 .85 .9 0})` | `--accent` `#FFC72C` | 15 |
| `rgba(250,70,22,{.1 .18})` | `--secondary` `#FA4616` | 3 |
| `rgba(13,13,13,{.86 .92})` | `--bg` `#0D0D0D` | 2 |
| `rgba(0,0,0,{.5 .6 .7 .74 .9})` | `#000` (untokened) | 10 |

### Class B — near-misses; close to a token but not equal (design call required)

| literal | nearest token | used for |
|---|---|---|
| `#0a0a0a` ×4 | `--panel` `#0C0C0C` | `#sceneBar`, `.menu-pop .mh`, `#animaticBar`, `#animaticTrack` |
| `#161616` ×2 | `--line` `#1c1c1c` | `table.shotlist td`, `.cont-item` borders |
| `#151515` ×1 | `--line` `#1c1c1c` | `.proj-item` border |

### Class C — colours with no token at all (design call required)

| literal | used for |
|---|---|
| `#000` ×18 | text on accent/secondary fills, `::selection`, canvas backdrop |
| `#7ac87a` ×4 + `rgba(120,200,120,.15)` + `rgba(122,200,122,{.4 .65})` | "ok"/"live" green — **also hard-coded identically in `Badge.css` and the DS**, so both sides share an untokened colour |
| `#222` / `#333` | scrollbar thumb + hover |
| `#ffb4a0` | `#toast.err` text |
| `#bbb` | `#animaticCap` |
| `#fff`, `rgba(255,255,255,{.008 .06 .6 .7 .85})` | swatch labels, hairlines |
| `rgba(80,180,90,.85)` | `.pc-imgbadge` |

### Class D — structural gap: there are no spacing/radius/type tokens at all

`tokens.css` defines **only** 11 colours + `--mono`. The goal asks for "สี, ระยะ, ตัวอักษร"
from one source, but the app's ~40 distinct `padding`/`gap`/`border-radius`/`font-size`
values have nothing to map to. No spacing was tokenized this round because there is no
spacing token to map to — not because I skipped it.

### Class E — colours in JS, not CSS

`index.html:3467-3478` (`ctx.fillStyle='#0D0D0D'`, `'#FFC72C'`, `'#FA4616'`) are canvas
draw calls in the contact-sheet exporter. These *are* exact token values but canvas takes
no CSS vars; tokenizing them needs a `getComputedStyle` lookup, i.e. a behaviour change.
Lines 2006/2021 use `#FA4616` as palette *content* (a colour-bible preset) — that is data,
not chrome, and should stay literal.

## Verification

Ran the Verify command unmodified:

```
$ node tools/test.mjs && npm --prefix design-system test
54 passed, 0 failed
...
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

Both green. No test was added, removed, skipped, or edited. The marker regions
(`==PURE-LOGIC-START==` etc.) were not touched — my only edit is a CSS comment above
`:root`, ~550 lines above the first marker.

## What I did NOT do

- **Did not add `--accent-rgb` / `--secondary-rgb` / `--bg-rgb` channel tokens.** They
  would collapse ~20 Class-A literals onto the token layer with zero pixel change, but
  adding tokens is a design-system change and is queued as the next task.
- **Did not touch the Class-B near-misses.** Deciding whether `#0a0a0a` should become
  `--panel` (a visible ~2-level shift on four surfaces) or whether `--panel` should move
  is exactly the owner decision the brief reserves.
- **Did not tick acceptance criterion 1.** The token block is present and used pervasively
  via `var()`, but ~50 literals remain un-tokenized, so claiming it complete would
  overstate. Ticked 5 and 6 (both suites verified green this round).
- **Did not open `index.html` in a browser**, so criterion 3 (`file://` works) is unticked
  — my edit is a CSS comment and cannot plausibly break it, but I did not verify it.
- Did not touch `storyboard-simulator.html`, the design system, or the README.

## Risk

- **Low risk in the diff itself**: one CSS comment. Nothing renders differently.
- **The real risk is the one this round documents rather than fixes**: `index.html`'s
  `:root` is a *hand-maintained copy* of `tokens.css`, and nothing detects drift. They are
  identical today; a one-line edit to either file silently breaks the "single source"
  premise the whole goal rests on. The comment I added is documentation, not enforcement.
  Acceptance criterion 7 is not met and cannot be met by convention alone.
- **Pre-existing external dependencies contradict the project's own pitch** — a reviewer
  should look at this. `index.html:7-10` already loads Google Fonts *and*
  `cdnjs.cloudflare.com/.../jspdf.umd.min.js`. So "double-click and it works offline" is
  **already false today** for PDF export and for the JetBrains Mono webfont. I added no new
  external reference (criterion 4 holds for my diff), but criterion 3 is on shakier ground
  than the brief assumes. `design-system/src/fonts/` exists and may hold an embeddable
  font — worth checking before anyone claims criterion 3.
- **The "ok green" (`#7ac87a`) is duplicated between the app and `Badge.css`** with no
  token on either side. Whatever token gets introduced for it must land in both, or the
  two will drift the moment one is tuned.
