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

The repo holds two things that must look identical: the app (`index.html`) and **Phantom UI**, the React component library in [`design-system/`](design-system). They share one design language, and the shared values live in exactly one place:

> **`design-system/src/tokens.css` is the source of truth.**

`index.html` deliberately cannot `@import` it — the app is one self-contained file with no build step, no bundler and no npm, and it has to keep working when you double-click it from `file://`. So it carries an **inlined mirror** of that `:root{}` block inside its `<style>` tag (marked with a `DESIGN TOKENS` comment).

A mirror maintained by good intentions drifts. This one is machine-checked.

### Changing a token

1. Edit the value in `design-system/src/tokens.css`.
2. Copy that whole `:root{ … }` block verbatim into the `<style>` block of `index.html`, replacing the existing one.
3. Run the checker:

```bash
node tools/check-tokens.mjs
```

It parses both `:root{}` blocks and compares them declaration by declaration, ignoring only what a browser ignores (hex case, whitespace inside the font stack). Any missing or divergent token prints a diff and exits `1`:

```
✗ 1 token problem(s) — index.html has drifted from design-system/src/tokens.css
  ✗ drifted: --accent
      tokens.css: #FF0000
      index.html: #FFC72C
```

Tokens defined only in `index.html` are allowed and reported as a note — each is a candidate for promotion into the design system.

### Full verification

```bash
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

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
node tools/test.mjs        # headless logic tests (54 assertions)
node tools/check-tokens.mjs  # design tokens still match the design system
open "index.html?test"     # in-browser test panel (dev-only)
```

The test runner is dev-only and not referenced by the main app.

---

*PHANTOM CREW OS · AI STORYBOARD MACHINE*
