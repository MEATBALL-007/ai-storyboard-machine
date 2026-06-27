# AI Storyboard Machine — Hardening & Quality Pass

**Date:** 2026-06-27
**Status:** Design — awaiting approval before implementation planning
**Scope:** `index.html` (the app). The standalone `storyboard-simulator.html` is a reference tool, not in scope for changes here.

---

## 1. Context

`index.html` is a 3,052-line single-file web app (~440 lines CSS, ~2,350 lines JS across two `<script>` blocks, 93 functions). It works and ships a lot of features, but carries quality debt:

- The "v2 feature layer" **monkey-patches** the core engine — it reassigns `drawPanel`, `applyStoryboard`, `saveToLocalStorage`, `buildPanelCard`, `renderPanelDetails`, and `loadProject` at runtime. Behavior is split across two definitions per function and is fragile.
- **No tests** and **no real runtime verification** — the app was shipped on syntax-checks and static reference analysis, not by exercising flows in a browser.
- **No error recovery**: destructive actions (delete panel/scene) are irreversible; API failures surface as opaque toasts; `localStorage` access is unguarded.
- **Not responsive** (fixed-width panels) and **not accessible** (no ARIA, icon-only buttons, `#555` muted text fails WCAG contrast on `#0D0D0D`).
- **Canvas art** reads as flat silhouettes — composition data drives size but not framing/depth/pose.

## 2. Goals

Improve the app across four dimensions the user prioritized, **without changing the zero-setup constraint** (single `index.html`, no build tools, no npm, no server):

1. **Reliability & correctness** — it genuinely works, recovers from errors, and nothing is lost on a misclick.
2. **UX & visual polish** — responsive, accessible, with proper state feedback.
3. **Canvas art quality** — a clear perceived-quality jump, still deterministic and asset-free.
4. **Code quality & maintainability** — remove the monkey-patching, organize the code, make pure logic testable.

### Non-goals (out of scope)

- No framework, bundler, TypeScript, or external runtime dependency (jsPDF CDN stays).
- No backend/proxy server (CORS for direct API calls remains a documented limitation, not a fix).
- No new product features beyond what already exists; this is a quality pass, not a feature pass.
- The simulator file is left as-is.

## 3. Approach

**Approach A — clean refactor + phased hardening** (chosen over incremental-only and full-rewrite). The refactor is the maintainability win and the enabler for testing; the four workstreams sit on top of the cleaned base. Public behavior stays identical through the refactor; risk is controlled by doing it in verifiable phases and runtime-testing each.

## 4. Architecture

Single file, single `<script>` block, organized top-to-bottom in dependency order with section banners:

```
CONFIG (constants, palettes, maps)
STATE (one store + mutate()/save() path)
STORAGE (localStorage wrapper, schema version + migration)
ENGINE (generation: Claude API + procedural)
CANVAS (drawing system — the upgraded renderer)
RENDER (grid, color bible, shot list, panel details)
FEATURES (animatic, continuity, palette, parse, share, exports)
WIRING (DOM events, keyboard)
TESTS (assertion harness — runs only on ?test)
BOOT
```

### 4.1 Remove monkey-patching

Each currently-wrapped function collapses to **one definition** that already includes the v2 behavior:

| Function | Folded-in behavior |
|---|---|
| `drawPanel` | image-art branch + overlay pass |
| `applyStoryboard` | active-scene sync + scene-bar/runtime refresh |
| `saveToLocalStorage` | scene-aware persistence (multi-scene `APP`) |
| `buildPanelCard` | AI-art button + art badge |
| `renderPanelDetails` | inline drag-edit + comments |
| `loadProject` | scene-aware load |

No `_original` shadows, no reassignment.

### 4.2 Single state store

Merge `STATE` and `APP` into one object. Every mutation goes through one `mutate(fn)` helper that applies the change, pushes an undo snapshot, triggers autosave (debounced), and re-renders. This single funnel is what makes undo/redo and autosave reliable instead of scattered `saveToLocalStorage()` calls.

```
store = { project:{name,director,scenes,active}, ui:{selectedPanelId,rightMode,cols,overlays,readOnly}, history:{past:[],future:[]} }
```

### 4.3 Pure-logic extraction

Pull DOM-free logic into pure functions so they're unit-testable: continuity analyzer, palette extraction math, script parser, aspect math, hex↔rgb, share encode/decode, panel normalization, state reducers (mutate/undo/redo).

## 5. Workstreams

### 5.1 Reliability & correctness

- **Undo/redo** via the store's `history` (snapshots of `project`). `Cmd/Ctrl+Z` / `Shift+Cmd/Ctrl+Z`; a "Deleted F03 · Undo" toast after destructive actions. Cap history at ~30 snapshots.
- **Soft-delete** for panels/scenes (undoable; no instant data loss).
- **API layer**: single `callClaude()` / `callImage()` wrappers with `AbortController` timeout (30s), one retry on network/5xx, hardened JSON extraction, returned-storyboard schema validation/repair via `normalizePanel`, and **typed errors** distinguishing auth / CORS / rate-limit / bad-JSON with actionable messages.
- **Storage safety**: try/catch around all `localStorage` (quota / private mode), `schemaVersion` field with a migration step on load, debounced autosave.
- **Bug sweep** from real browser testing — fix the inline-edit handle redraw race, tainted-canvas export edge (URL images), and any scene-sync corner cases found.

### 5.2 UX, polish & accessibility

- **Responsive**: below ~1100px the side panels become toggle-drawers; grid reflows; usable on a tablet/narrow window.
- **Accessibility**: landmark roles, `aria-label` on icon buttons, visible focus rings, full keyboard operability (tab order, arrow-move selected panel, Enter/Space activation), `prefers-reduced-motion` honored, and contrast fix (raise muted text to ≥4.5:1).
- **State feedback**: real empty state ("no storyboard → Generate"), grid skeleton/shimmer during generation, inline error cards with a retry button, and a dismissible first-run hint pointing at Generate.
- **Interaction polish**: drag-reorder shows a drop placeholder; toast queue (no overwrite); subtle panel enter animation; consistent hover/active states.

### 5.3 Canvas-art upgrade (deterministic, asset-free)

- **Layered depth** — background / midground / subject / foreground planes with atmospheric haze (further subjects lighter/desaturated).
- **Posed figures** — head tilt, shoulder line, suggested arm; pose presets standing / sitting / lying / reaching, selected from action keywords + a `pose` field.
- **Shot-size-aware framing** — map `shot_size` to an actual crop/scale (CU crops to head-shoulders, ECU to eyes, OTS frames the foreground shoulder), so the drawing matches the label.
- **Environment props** — lightweight rough vector hints per setting (bed/window/door interior; trees/buildings/streetlights exterior), keyword-driven from `background_notes`.
- **Form lighting** — rim/shadow side on figures from light direction, not a flat wash.
- **Texture** — cross-hatch in shadow regions + paper grain for the marker-storyboard look.

Same render budget; smarter geometry. Backward-compatible: a new optional `pose` field defaults sensibly when absent.

### 5.4 Test harness

`index.html?test` replaces the UI with a results panel running ~30–50 assertions against the pure-logic units (§4.3): continuity rules, palette math, parser, aspect/hex, share round-trip, normalization, undo/redo reducers. Zero dependencies — a local `assert()` plus a pass/fail/total summary with red/green output. This is the automated-test story within the no-toolchain constraint.

## 6. Verification

Two layers:
1. **Automated**: the `?test` harness must be all-green.
2. **Manual runtime**: actually open the app and exercise each flow (generate, regenerate, edit, drag-reorder, delete+undo, multi-scene, animatic, continuity, palette, parse, share round-trip, all exports). Report results honestly, including anything that breaks — no "it works" claims without having run it.

## 7. Sequencing (phases)

1. **Refactor foundation** — merge scripts, remove monkey-patching, single store, extract pure logic. Behavior unchanged. Verify: app still does everything it did before.
2. **Test harness** — add `?test` and the assertion suite over the now-extracted pure logic.
3. **Reliability** — undo/redo, soft-delete, API/storage hardening, bug-sweep.
4. **Canvas-art upgrade** — the renderer improvements.
5. **UX & a11y** — responsive, accessibility, state feedback, interaction polish.

Each phase is independently verifiable and leaves the app shippable.

## 8. Success criteria

- No `_original`/reassigned functions remain; each wrapped function has one definition.
- `?test` runs and is all-green.
- Deleting a panel/scene is undoable; no data lost on misclick.
- API failures produce a specific, actionable message (auth vs CORS vs rate-limit vs bad-JSON).
- App is usable and laid-out correctly down to ~700px width.
- Icon buttons have accessible names; muted text meets WCAG AA contrast; core flows are keyboard-operable.
- A side-by-side of the same panel shows a clear art-quality improvement (depth, framing-matches-shot, pose).
- Every existing feature still works, verified by manual runtime pass.

## 9. Risks & mitigations

- **Regression during refactor** → keep behavior identical, phase-by-phase verification, manual runtime pass after each phase; git commit per phase for easy rollback.
- **Single-file size growth** → section banners + dependency ordering keep it navigable; pure-logic extraction shrinks the tangled middle.
- **Canvas changes altering existing saved panels** → new `pose` field is optional with safe defaults; renderer stays backward-compatible with stored storyboards.
- **Can't fully headless-test in this environment** → rely on the `?test` harness for logic + an explicit manual browser pass for UI, reported honestly.
