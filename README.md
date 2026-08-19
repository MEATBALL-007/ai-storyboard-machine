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

Colours (and, in time, spacing and type) live in **one** place:
[`design-system/src/tokens.css`](design-system/src/tokens.css). The Phantom UI React
components import it directly. The app cannot — it is a single file that must open
over `file://` with no build step, no bundler and no `@import` — so `index.html`
carries a **verbatim copy** of the same `:root` block inside its `<style>`.

To change a token:

1. Edit the value in `design-system/src/tokens.css`.
2. Copy the **whole** `:root { … }` block over the one at the top of the `<style>`
   in `index.html`. Re-indent to match the file; nothing else may change.
3. Run `node tools/check-tokens.mjs`.

Step 3 is the enforcement: it parses the `:root` block out of both files and fails
if any custom property is missing, extra, or holds a different value. Indentation,
comments and line breaks are ignored, so only real drift trips it.

### Alpha variants

CSS cannot apply an alpha channel to a hex custom property — `rgba(var(--accent), .4)`
is invalid. Tokens that need transparency therefore ship a **channel form** alongside
the hex one:

```css
--accent:#FFC72C;  --accent-rgb:255,199,44;
--secondary:#FA4616; --secondary-rgb:250,70,22;
```

Use `rgba(var(--accent-rgb), .4)` in CSS rather than writing the numbers out.

> **Canvas is the exception.** `ctx.fillStyle` / `ctx.strokeStyle` are resolved by the
> 2D context, not the CSS engine, and do **not** understand custom properties — a
> `var()` there silently renders black. The `rgba()` literals in the drawing code are
> intentional and must stay literal.

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
