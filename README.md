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
| `G` | Generate storyboard |
| `E` | Export PDF |
| `R` | Regenerate selected panel |
| `P` | Play animatic |
| `C` | Continuity check |
| `1` / `2` / `3` | 2 / 3 / 4 columns |
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

*PHANTOM CREW OS · AI STORYBOARD MACHINE*
