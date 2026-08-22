# ✦ AI Storyboard Machine

> **Phantom Crew OS** — a single-file web app for filmmakers that turns scripts into visual storyboards.

Generate complete shot breakdowns from a scene description, see each panel rendered as an evocative storyboard thumbnail on `<canvas>`, then export a production-ready PDF. No build tools, no npm, no backend — it's one `index.html` you can open straight in a browser.

> **⚠️ Maintainers — four decisions are blocking the Phantom UI integration.** They are
> investigated and written up in [Open decisions](#open-decisions); each one needs an answer
> from the project owner, not more analysis. Until they're answered the remaining work on that
> effort cannot move.

---

## Quick start

```bash
# just open it
open index.html          # macOS
# or double-click index.html anywhere
```

That's it. On first open it auto-loads a sample music-video storyboard (MV *"ขอให้ผม"*, scene *"คนละเวลา ห้องเดียว"*, 8 panels with a split-screen concept) so you can poke at every feature immediately.

**Zero credentials required.** With no API key the app generates procedural storyboards locally. Add keys to unlock AI generation.

---

## Hero features

### 🖼 Canvas drawing system
Every panel is drawn from its composition data into a genuine-looking storyboard frame:
- Gradient backgrounds per time-of-day (`warm_day`, `golden_hour`, `night_interior`, …)
- 1-point interior perspective rooms / exterior ground planes
- Lighting: window shafts, backlight, practicals, key light, toplight
- Rough hand-drawn human silhouettes, depth-sorted by scale, with facing direction
- Camera-movement arrows, Dutch-angle hints, vignette, film grain, shot-size/lens watermarks
- Special renderers: **split-screen**, **insert detail**, **over-the-shoulder**

### 📄 PDF export (jsPDF)
Landscape A4, 3×3 panels per page, dark production header (director · date · page), crisp 4× hi-res frame re-renders, word-wrapped action + italic dialogue, plus a dedicated **Color Bible** page.

---

## The 10-feature layer

| # | Feature | Where |
|---|---------|-------|
| 1 | **AI frame-art generation** — image-model art per panel, canvas fallback | `✦` on each panel |
| 2 | **Animatic playback** — plays panels by duration with motion-derived Ken Burns | `▶ PLAY` / `P` |
| 3 | **Inline drag-to-pose editing** — drag subjects & horizon on the canvas | panel editor |
| 4 | **Continuity checker** — 180° line, repeated coverage, angle monotony, long takes | `✓ CHECK` / `C` |
| 5 | **Reference-image palette** — extract a Color Bible from a film still | left sidebar |
| 6 | **Multi-scene projects** — scene navigator with running sequence runtime | scene bar |
| 7 | **Framing overlays** — thirds / center / title-safe / FOV guides | grid header |
| 8 | **Share + comments** — self-contained read-only link, per-panel notes | `↗ SHARE` |
| 9 | **Script → scenes** — auto-split a screenplay on `INT./EXT.` sluglines | `⎘ Parse → Scenes` |
| 10 | **Richer exports** — Contact Sheet PNG, Call Sheet PDF, ProductionBoard CSV, Fountain | `⤓ EXPORT ▾` |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Cmd/Ctrl+Z` | Undo |
| `Shift+Cmd/Ctrl+Z` or `Ctrl+Y` | Redo |
| `Cmd/Ctrl+D` | Duplicate selected panel |
| `?` | Open the shortcuts overlay |
| `G` | Generate storyboard |
| `E` | Export PDF |
| `R` | Regenerate selected panel |
| `P` | Play animatic |
| `C` | Continuity check |
| `1` / `2` / `3` | 2 / 3 / 4 columns |
| `←` / `→` | Reorder selected panel left/right |
| `Del` | Delete selected panel |
| `Esc` | Close player / modal |

In the animatic player: `Space` play/pause, `←` / `→` step frames.

---

## AI generation (optional)

### Storyboard text generation — Claude
Paste an **Anthropic API key** into the left sidebar (stored in `localStorage` only). Uses `claude-sonnet-4-6` via the Messages API with the direct-browser-access header.

### Frame art — image model
Enable **"Render AI frame art"**, then set an image endpoint, model, and key. Expects an OpenAI-images-shaped response with `b64_json`.

> ⚠️ Use an image API that returns **base64** (`response_format: b64_json`). URL-only responses render on screen but can taint the canvas and break that panel's PDF/PNG export. Calling provider APIs directly from a `file://` page may also hit CORS — the app falls back to procedural art and surfaces the error in a toast.

---

## Data & persistence

- Auto-saves to `localStorage` after every change; reloads your last project on open
- Up to 10 projects in the sidebar
- Export / import projects as JSON
- Share links encode the entire project into the URL hash (open read-only)

---

## Tech

- Vanilla JavaScript (ES6+), no framework, no bundler
- HTML5 `<canvas>` for all storyboard rendering
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export — **the one remaining CDN
  dependency**, so PDF export is the only feature that still needs a network connection
- JetBrains Mono (self-hosted, embedded in the file), dark cinematic theme (`#0D0D0D` / yellow-gold `#FFC72C` / orange `#FA4616`)
- Single file: [`index.html`](index.html)

---

## Design tokens — single source of truth

[`design-system/src/tokens.css`](design-system/src/tokens.css) is authoritative for every
colour, the corner-radius scale, and the type family. `index.html` carries a **verbatim copy** of that `:root{}` block
inside its `<style>` element — it cannot `@import` the file, because the app has to keep
working when you double-click it (`file://` blocks cross-file CSS imports), and adding a
build step would defeat the whole point of the project.

**To change a token:**

1. Edit the value in `design-system/src/tokens.css`.
2. Copy the entire `:root{ … }` block into the `<style>` block at the top of `index.html`
   (keep the extra indentation; nothing else about it changes).
3. Run `node tools/check-tokens.mjs` — it fails if any token is missing from `index.html`
   or holds a different value, so the copy cannot silently drift.

Colours that need transparency use the channel tokens (`--accent-rgb`, `--secondary-rgb`,
`--bg-rgb`) via `rgba(var(--accent-rgb), .4)`, so a glow or ring follows `--accent` instead
of freezing the old hue into a literal. This holds on **both** sides — the app's `<style>`
and the library's component CSS — because a token the library ignores re-tints half the
system and strands the other half.

`check-tokens.mjs` enforces that: it scans every stylesheet under `design-system/src`, the
`<style>` block of `index.html`, **and every `style="…"` attribute in its body**, and fails on
any `rgb()`/`rgba()` triple or hex that matches a token's value, naming the token you should
have used. `tokens.css` and the `:root{ … }` block of `index.html` are exempt — they *are* the
palette, and the check above already proves the two agree.

**Exception:** the `rgba()` / hex literals inside the JavaScript are deliberate. In the
canvas-drawing code `ctx.fillStyle` does not resolve CSS custom properties and would silently
paint black; in the markup-generating template strings a couple of literals (`#111` in the
shimmer gradient, `#FA4616` in the self-test banner) *do* match tokens but are code, not a
stylesheet. `<script>` is blanked out before the attribute scan runs, so none of them is read.

Literals with no token behind them are left alone on purpose. That is the complete remaining
set, not a sample — outside the `:root{}` block, `index.html`'s `<style>` holds ten distinct
hex values (`#000`, `#0a0a0a`, `#151515`, `#161616`, `#222`, `#333`, `#7ac87a`, `#bbb`,
`#fff`, `#ffb4a0`) plus black and white overlay `rgba()`s and four greens
(`rgba(80,180,90,.85)`, `rgba(120,200,120,.15)`, `rgba(122,200,122,.4)`,
`rgba(122,200,122,.65)`). The component CSS draws on the same families and adds none of its
own. Giving those a token would widen the design language, which is a decision for the owner
rather than something a checker should force.

### Corner radius

| Token | Value | Used for |
|---|---|---|
| `--r-xs` | 1px | hairline marks — section bullet, animatic thumbnails |
| `--r-sm` | 2px | badges, `kbd`, the logo mark, scrubber track |
| `--r-md` | 3px | the default control radius — buttons, chips, inputs, tabs |
| `--r-lg` | 4px | primary call-to-action, toasts, scrollbar thumb |
| `--r-xl` | 5px | panel cards, dropdown menus, tour spotlight |
| `--r-2xl` | 6px | modals, tour popover, large colour swatches |
| `--r-full` | 50% | dots and circular buttons |

Both consumers use this scale: the `<style>` block in `index.html` and the Phantom UI
component CSS under `design-system/src/components/`. Neither one hard-codes a radius, so a
change here reaches the app and the library together.

`check-tokens.mjs` keeps it that way. It reads the **value side of `border-*-radius`
declarations only** — shorthand, the four corner longhands, and vendor-prefixed spellings —
across the same two consumers, and fails on any length that is not a `var()`. When the value
matches a token it names the token (`3px` → `var(--r-md)`); when it matches none it prints the
whole scale, because inventing an eighth radius is the owner's call, not a checker's.
Skipped: `0` and `0px` (a square corner is not a design value, and `border-radius:4px 4px 0 0`
is an everyday idiom), keywords like `inherit`, and `calc()`. Nothing outside a
`border-*-radius` declaration is read — a bare `3px` is far more likely to be padding, gap or
`font-size`, and **spacing is deliberately not tokenised** (measured across both files it is a
continuum from 1–12px, not a ladder, so naming it would take a design decision first).

Like the colour and `font-weight` scans, this one also reads the `style="…"` attributes in the
body, so the radius on the export button is enforced rather than merely correct.

> This ramp steps 1px at a time, which is finer than a radius scale usually needs — `--r-xs`
> through `--r-2xl` are near-indistinguishable in isolation. It is recorded as-is because
> it is what both codebases already shipped; collapsing it to three steps would move pixels,
> and that is a design call for the owner rather than a mechanical one.

### Typeface

The four JetBrains Mono latin subsets in [`design-system/src/fonts/`](design-system/src/fonts/)
(weights 400 / 500 / 700 / 800, 86,144 bytes total) are authoritative.
[`design-system/src/fonts.css`](design-system/src/fonts.css) loads them by relative URL for the
React library; `index.html` embeds the same bytes as `data:font/woff2;base64,…` inside its
`@font-face` rules, for the same reason it inlines the tokens — a `file://` page cannot fetch a
sibling font file, and the app used to paper over that by loading the typeface from Google Fonts.
That CDN link is gone: the app now renders in its real typeface with no network at all.

**To change a font file:**

1. Replace the `.woff2` in `design-system/src/fonts/` (and its `@font-face` in `fonts.css`
   if the weight changed).
2. Re-embed it in `index.html`: base64 the file and swap the payload inside the matching
   `src:url(data:font/woff2;base64,…)`.
3. Run `node tools/check-tokens.mjs` — it decodes each embedded payload and compares it
   byte-for-byte with the file on disk, so a forgotten re-embed fails loudly.

**Those four weights are the whole inventory**, and `check-tokens.mjs` holds the stylesheets to
it: every `font-weight` in `index.html`'s `<style>` and `style="…"` attributes, and in
`design-system/src/**/*.css`, must have an `@font-face` in `fonts.css` behind it (`normal` and `bold` count as 400 and 700; `bolder` /
`lighter` are relative and are skipped, as are the `@font-face` blocks themselves, which declare
the inventory rather than draw on it). Asking for a weight that does not exist is not an error in
CSS — the browser substitutes the nearest available face and, for a request *lighter* than
anything installed, will not even synthesize one. `.add-card .ac-plus` asked for `300` and had
been rendering at `400` since the fonts were embedded, with nothing on screen to give it away.
To use a new weight, add its `.woff2` and `@font-face` first; the check then lets the rule through.

The **name** of the family is held to one place the same way. `--mono` in `tokens.css` carries
the family and its fallback list, and every `font-family` across the same three scan targets
must read `var(--mono)` and nothing else — not even `var(--mono), monospace`, since the
fallbacks belong in the token where every consumer inherits them at once. The `@font-face`
blocks are skipped, as with `font-weight`: they *name* the family rather than draw on it.
This one is a pure regression guard — all 18 declarations in scope already read the token
(13 in the component CSS, 5 in `index.html`'s `<style>`; no `style="…"` attribute sets a family) —
and it matters precisely because a stray `font-family:'JetBrains Mono', ui-monospace` renders
identically today. The day the owner swaps the typeface, that one rule keeps the old face and
surfaces as a single odd-looking element rather than an obvious break. Only the longhand is
read; a `font:` shorthand in a stylesheet would slip past it (there are none today — the one
`font:` in the project is inside `<script>`, which no check ever sees).

The cost is size: inlining the fonts took `index.html` from **188,288 bytes to 303,787 bytes**
(+61%), because base64 adds about a third.

> **Byte counts here are stated in bytes on purpose.** Those two are what git stores, with LF
> line endings — reproduce them with `git cat-file -s HEAD:index.html`. This repo has no
> `.gitattributes`, so a Windows checkout under `core.autocrlf=true` writes CRLF and the same
> file measures **307,820 bytes** on disk (`node -e "console.log(require('fs').statSync('index.html').size)"`)
> — 4,033 bytes larger, one per line. Earlier revisions of this README said "297 KB", which was
> 303,787 ÷ 1024 — KiB wearing a KB label. Prefer bytes, or say which KB you mean.

That is the price of the headline promise, and it buys back a real one — the app no longer
degrades to a fallback font when you are offline, which matters here because the sidebar's
column widths have well under a pixel of slack (see *Element parity* below).

> **Coverage is unchanged, not merely preserved.** These are latin subsets, so the box-drawing
> (`═` appears 1,576 times), arrows, and Thai characters in the UI fall back to the system
> monospace font. They did so before too: none of those ranges are in *any* of the subsets
> Google's `css2` endpoint serves for JetBrains Mono (latin, latin-ext, cyrillic, cyrillic-ext,
> greek, vietnamese). No character in `index.html` lands in a subset that was fetched before
> and is missing now.

## Element parity with Phantom UI

Tokens make the two codebases share *values*; this table tracks whether they also share the
*rules* built from those values. The app cannot import the React components, so parity here
means the `<style>` block in `index.html` and the matching file under
`design-system/src/components/` declare the same properties.

| App selector | Phantom UI | Status |
|---|---|---|
| `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.tab-btn` | `Button.css` | ✅ every value matches |
| `.chip` | `Chip.css` | ⚠️ matches except `padding` — see [decision 2](#2-chip-horizontal-padding--which-pixels-move) |
| `.pc-badge` | `Badge.css` | ✅ every value matches |
| `.modal-bg`, `.modal` | `Modal.css` | ✅ every value matches |
| `.empty-state` | `EmptyState.css` | ✅ every value matches |

Badge, modal, and empty state differ from their Phantom UI files only by `font-family:var(--mono)`
(and `color:var(--text)` on the modal), both of which `body` already sets with nothing overriding
them — so they render identically. The remaining difference is the class *name*
(`.pc-badge` vs `.pui-badge--accent`), which is not a visual one.

`index.html` has no base `.btn` class; it styles modal buttons through the descendant selector
`.modal-actions button`. The declarations are equivalent, so this is a structural difference
rather than a visual one.

---

## Open decisions

Four questions block nearly all remaining Phantom UI integration work. Every one has already
been investigated to the end — what is missing is a **decision**, not more analysis. Each moves
pixels or adds a file to the repo, so none is an automated agent's call to make.

Three of the seven acceptance criteria in `AUTOPILOT.md` stay unticked until these are answered.
Each entry below is self-contained: what is blocked, the options, what each costs, and what
happens next once you pick.

### 1. jsPDF — vendor it into the repo?

**Blocks:** *"opens from `file://` with no build and no server."*

Line 7 of `index.html` loads `jspdf.umd.min.js` from `cdnjs.cloudflare.com`. It is the **last**
external reference in the file — the three Google Fonts links are gone since the typeface was
inlined as base64. Open the app offline today and PDF export fails.

There is a second problem regardless of offline use: the tag has no
`integrity` / `crossorigin` attributes, so if the CDN ever served modified code the app would
execute it without complaint.

An automated round cannot fix this alone. There is no copy of jsPDF anywhere on the build
machine (`C:/PHANTOM-AUTOPILOT` and the npm global root were both searched) and network access
is blocked, so the file has to be brought in from outside.

| Option | Cost |
|---|---|
| **Vendor** `jspdf.umd.min.js` into the repo, then inline it | `index.html` grows again — it already went 188,288 → 303,787 bytes when the fonts were inlined. Ticks the criterion permanently. |
| **Keep the CDN**, add `integrity="sha384-…" crossorigin="anonymous"` | Cheap, closes the tampering hole, but PDF export stays broken offline and the criterion can never be ticked. |
| **Keep the CDN as-is** | Nothing to do; accept both the offline gap and the supply-chain exposure. |

**If you answer:** drop the file at the repo root (or say "CDN + integrity" and supply the
hash — the hash cannot be computed here without the file either). A later round inlines it into
`<style>`/`<script>` the same way the fonts were done and ticks the criterion.

### 2. Chip horizontal padding — which pixels move?

**Blocks:** *"basic elements match the component of the same name in the design system."*
This is the **only** remaining parity gap; the other four element groups all match.

`.pui-chip` uses `padding:6px 10px`; the app's `.chip` still uses `6px 2px`. The DS value **does
not fit the current sidebar**, so it was deliberately not adopted:

| Step | Width |
|---|---|
| `#left` | 212px, minus its 1px right border → 211px |
| minus vertical scrollbar (`::-webkit-scrollbar{width:8px}`) | 203px |
| minus `.section` padding (12px × 2) | 179px |
| minus `.radio-grid` gaps (4px × 3) | 167px → **41.75px per `1fr` track** |

The widest label, `16:9`, is 4 characters of 10px monospace ≈ 24px, and `box-sizing:border-box`
means padding and border come out of the track: `24 + 20 + 2 = 46px` needed against 41.75px
available. Because `1fr` resolves to `minmax(auto, 1fr)`, the track cannot shrink below that
min-content width — the grid would instead grow to 196px and push a horizontal scrollbar into
the sidebar.

**The widest horizontal padding that always fits is 7px.** 10px fits only when the sidebar has
no vertical scrollbar, which it does have in normal use.

| Option | Cost |
|---|---|
| Widen `#left` past 212px | Steals width from the board area on small screens. |
| Drop the chip `font-size` below 10px | Sidebar labels get harder to read. |
| Switch `.radio-grid` to two columns | Taller sidebar; changes the control's shape. |
| Lower the DS chip padding to `6px 7px` | Changes Phantom UI for every consumer, not just this app. |

**If you answer:** a round applies the one change and the element-parity criterion ticks.

### 3. Spacing and font-size — approve a scale?

**Blocks:** *"`index.html` reads colour/spacing from `tokens.css` instead of hard-coded values."*
Colour, corner radius, and typeface are done; spacing and font-size are the remainder.

The survey found these are a **continuum, not a scale**:

- `padding` uses nearly every value from 1–12px, plus 16/20/24/80
- `gap` uses 3, 4, 5, 6, 7, 8, 12, 14, 24
- `font-size` steps by 0.5px from 7 to 13 (11 distinct values), then jumps to 14/15/16/18/26/40

Mapping that 1:1 would produce ~16 tokens that only rename the numbers — no single source of
truth, no leverage when a value changes. Snapping to a real scale (a 4px grid, say) is what
makes tokens worth having, but it **moves pixels across the whole app**, which is a design
change rather than a refactor.

| Option | Cost |
|---|---|
| **Approve a 4px spacing grid + a font-size ramp** | Real tokens, real leverage. Every panel, sidebar, and control shifts slightly; needs a visual pass afterwards (see decision 4). |
| **Map 1:1, no snapping** | Zero visual change, but ~16 vanity tokens that add naming without adding a system. |
| **Leave spacing untokenised** | Criterion 1 stays partially unticked; the design language covers colour, radius, and type only. |

**If you answer:** approving a scale lets a round rewrite the values against it, extend
`tokens.css`, and extend `tools/check-tokens.mjs` to enforce them the way it already enforces
colour, radius, weight, and family.

### 4. Browser verification — grant the MCP permission?

**Blocks:** *"opens from `file://` and still works."* Nobody has actually looked at the app in a
browser during any of the ten rounds of Phantom UI work so far (branches
`auto/…/2026-08-21_0002` through `auto/…/2026-08-23_0004`), several of which edited CSS or
replaced the typeface outright. The automated tests cover pure logic
(`node tools/test.mjs`, 54/54) and token consistency (`tools/check-tokens.mjs`), neither of
which can see a layout break.

Both Playwright and Chrome-DevTools MCP were tried and were **blocked by permissions** — this is
not simply "the server is headless", so retrying without a permission change wastes a round.

| Option | Cost |
|---|---|
| Grant the MCP permission | A round can screenshot the app, confirm the sidebar has no horizontal scrollbar, and check the inlined fonts actually load. Grants a browser automation tool access to the machine. |
| Verify manually yourself | No new permissions; costs your time, and only when you happen to look. |
| Leave it unverified | CSS changes keep shipping without anyone seeing the result. |

**If you answer:** granting it lets every future round end with a real screenshot instead of an
assumption — which also makes decisions 2 and 3 much safer to act on.

---

## Recent updates (hardening pass)

### Undo / Redo
- **Undo**: `Cmd+Z` (macOS) or `Ctrl+Z` (Windows/Linux)
- **Redo**: `Shift+Cmd+Z` (macOS) or `Ctrl+Y` (Windows/Linux)
- Covers panel delete, edit, reorder, regenerate, and scene add/delete
- Deleting a panel shows an inline "Undo" toast for quick recovery

### Responsive & Accessible UI
- **Responsive design**: Collapsible sidebar drawers appear under 1100px screen width (☰ toggle button)
- Grid reflows intelligently from 3 columns → 2 columns → 1 column on smaller screens
- **Keyboard shortcuts for panel reorder**: `←` / `→` keys reorder the selected panel left/right
- **Accessibility**: ARIA landmarks and labels, visible focus rings, WCAG-AA compliant muted-text contrast ratios
- **Motion**: `prefers-reduced-motion` honored (disables animatic auto-play and transitions)

### Hardened generation
- **API resilience**: Claude API calls wrapped with a 30-second timeout and specific, typed error handling
  - Distinguishes auth errors (bad/missing key), CORS errors, rate limits, and invalid JSON responses
- **Graceful fallback**: When no API key is set or on error, uses the procedural demo generator locally
- Consistent error UI with inline error card and Retry button

### Safer storage
- **Guarded localStorage**: Survives quota exceptions and private-mode sessions
- **Schema versioning + migration**: Older saved projects auto-upgrade without data loss
- **Debounced autosave**: Prevents excessive writes while editing

### Upgraded canvas art
- **Shot-size-aware framing**: Close-ups actually crop to head/shoulders; wide shots show full environments
- **Posed figures**: Sitting, lying, reaching, and other poses inferred from the action text
- **Depth haze**: Distant subjects rendered with atmospheric perspective
- **Form lighting**: Directional key light reveals volume and dimension on figures
- **Prop keywords**: Environment details (bed, window, tree, building, streetlight) drawn with shadow hatching

### State feedback
- **Empty state**: Clear prompt when no panels exist
- **Shimmer skeletons**: Subtle loading animations during AI generation
- **Inline error card**: Actionable feedback with a Retry button

### Development / tests
The app is a single `index.html` with no build tools — it runs instantly in any browser. For development and testing:

```bash
node tools/test.mjs      # headless logic tests (54 assertions)
open "index.html?test"   # in-browser test panel (dev-only)
```

The test runner is dev-only and not referenced by the main app.

---

*PHANTOM CREW OS · AI STORYBOARD MACHINE*
