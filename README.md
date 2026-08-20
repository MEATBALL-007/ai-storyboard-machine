# ✦ AI Storyboard Machine

> **Phantom Crew OS** — a single-file web app for filmmakers that turns scripts into visual storyboards.

Generate complete shot breakdowns from a scene description, see each panel rendered as an evocative storyboard thumbnail on `<canvas>`, then export a production-ready PDF. No build tools, no npm, no backend — it's one `index.html` you can open straight in a browser.

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
- [jsPDF](https://github.com/parallax/jsPDF) (via CDN) for PDF export
- JetBrains Mono, dark cinematic theme (`#0D0D0D` / yellow-gold `#FFC72C` / orange `#FA4616`)
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
of freezing the old hue into a literal. **Exception:** the `rgba()` / hex literals inside the
canvas-drawing JavaScript are deliberate — `ctx.fillStyle` does not resolve CSS custom
properties and would silently paint black.

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

> This ramp steps 1px at a time, which is finer than a radius scale usually needs — `--r-xs`
> through `--r-2xl` are near-indistinguishable in isolation. It is recorded as-is because
> it is what both codebases already shipped; collapsing it to three steps would move pixels,
> and that is a design call for the owner rather than a mechanical one.

## Element parity with Phantom UI

Tokens make the two codebases share *values*; this table tracks whether they also share the
*rules* built from those values. The app cannot import the React components, so parity here
means the `<style>` block in `index.html` and the matching file under
`design-system/src/components/` declare the same properties.

| App selector | Phantom UI | Status |
|---|---|---|
| `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.tab-btn` | `Button.css` | ✅ every value matches |
| `.chip` | `Chip.css` | ⚠️ matches except `padding` — see below |
| `.badge`, `.modal`, empty state | `Badge.css`, `Modal.css`, `EmptyState.css` | not yet compared |

`index.html` has no base `.btn` class; it styles modal buttons through the descendant selector
`.modal-actions button`. The declarations are equivalent, so this is a structural difference
rather than a visual one.

### Open decision: chip horizontal padding

`.pui-chip` uses `padding:6px 10px`; the app's `.chip` still uses `6px 2px`. **The DS value does
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

**Max horizontal padding that always fits is 7px.** 10px only fits if the sidebar has no
vertical scrollbar, which it does in normal use. Closing this gap properly means picking one:
widen `#left`, drop the chip font-size, switch `.radio-grid` to two columns, or set the DS chip
to a smaller padding. All four move pixels, so the choice belongs to the owner.

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
node tools/test.mjs      # headless logic tests (42 assertions)
open "index.html?test"   # in-browser test panel (dev-only)
```

The test runner is dev-only and not referenced by the main app.

---

*PHANTOM CREW OS · AI STORYBOARD MACHINE*
