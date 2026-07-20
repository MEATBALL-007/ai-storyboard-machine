# Phantom UI — Component Library Extraction (design spec)

**Date:** 2026-07-20
**Status:** Approved design, pending implementation plan
**Author:** brainstormed with the user (MEATBALL-007)

## Goal

Extract the AI Storyboard Machine's inline UI (`index.html`'s `<style>` design
system) into a real, buildable **React + TypeScript component library** so it can
be synced to **claude.ai/design** via the `design-sync` skill. Today the app is a
single-file vanilla-JS `<canvas>` app with no exportable components; design-sync
requires a component-library package (with `package.json` + lockfile, a built
`dist/`, and `.d.ts` types). This project produces that package.

**This spec covers building the library only.** The actual claude.ai/design sync
is a separate follow-on task, run once the library builds and looks right.

## Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Scope | ~12 curated primitives | Reusable, brand-defining pieces; cleanest first library. Skips app-specific pieces (PanelCard, ShotList). |
| Location | `design-system/` subdir in this repo | Keeps source-of-truth CSS nearby; design-sync runs from the subpackage. No new repo/remote needed. |
| Fidelity | Faithful clone | Reuse the app's exact CSS values/tokens; components are thin wrappers over the same styling. |
| Styling method | **A** — plain CSS + `className`, CSS-variable tokens | Most faithful, esbuild-friendly, yields exactly what design-sync consumes. (Rejected: CSS Modules — hashed names lose the class vocabulary; Tailwind preset — a re-authoring that risks visual drift.) |
| Class naming | `pui-` prefix on component classes | Prevents collisions with a rendered design's own `.chip`/`.modal`. Agent uses the React API, so nameability isn't lost. Tokens stay unprefixed for faithfulness. |
| Stack | React 18 + TypeScript, Vite library build | Standard, design-sync package-shape compatible. |

## Architecture

A self-contained package at `design-system/`:

```
design-system/
  package.json          # name "@phantom/ui", global "PhantomUI", react as peerDep
  package-lock.json     # committed — design-sync installs via `npm ci`
  tsconfig.json
  vite.config.ts        # library mode -> dist/ (ESM + UMD global) + style.css
  src/
    index.ts            # re-exports every component (public API)
    tokens.css          # :root { --bg, --accent, ... } ported verbatim
    fonts.css           # @font-face for self-hosted JetBrains Mono
    fonts/              # JetBrains Mono 400/500/700/800 woff2 (OFL)
    styles.css          # @import tokens.css + fonts.css + each component css
    lib/cn.ts           # tiny className joiner
    components/
      Button/  { Button.tsx, Button.css, index.ts }
      Chip/    { ... }
      ...one folder per component
  demo/                 # Vite page rendering all components (visual gallery)
  dist/                 # build output (gitignored; design-sync's converter reads it)
```

**Principles**
- Each component = a typed `.tsx` wrapper rendering a semantic element carrying
  the app's declarations under prefixed classes, plus a colocated `.css` copied
  ~verbatim from the app's `<style>`. One folder, one purpose, testable in isolation.
- `styles.css` is the single import root; its transitive `@import` closure
  (tokens + fonts + all component CSS) is exactly what design-sync feeds each
  rendered design.
- The build emits `dist/` (compiled JS exposing `window.PhantomUI.*`, `.d.ts`
  types, and `style.css`).

## Components (12 conceptual pieces, 13 exports)

Each is a thin typed wrapper over the app's existing styling. Minimal, predictable
APIs; every component forwards `className` and native props (composable), uses
semantic elements, and needs **no provider** — styling comes entirely from
`styles.css` being present.

| Component | Key props | Maps to (app class) |
|---|---|---|
| Button | `variant: 'primary' \| 'ghost' \| 'icon' \| 'tab'`, `active?`, `disabled?` + native button props | `.btn-primary`/`#genBtn`, `.btn-ghost`, `.icon-btn`, `.tab-btn(.active)` |
| Chip | `selected?`, `onClick`, children | `.chip(.sel)` |
| Input | `label?`, `hint?` + native input props | `input.ti`, `.apikey-note` |
| Textarea | `label?` + native textarea props | styled `textarea` |
| Select | `label?`, `options?` or children | `select.ti` |
| Toggle | `checked`, `onChange`, `label` | `.toggle-row` (accent checkbox) |
| Modal | `open`, `title`, `subtitle?`, `onClose`, `actions?`, children | `.modal-bg` + `.modal` |
| Toast | `open`, `message`, `variant: 'default' \| 'error'`, `action?` | `#toast(.err)` |
| Menu | `items: {label,onClick,disabled?,danger?}[]`, `header?` (or children) | `.menu-pop` |
| SegmentedToggle | `options: {value,label}[]`, `value`, `onChange` (single-select) | `.col-toggle`/`.dn-toggle`/`.ovl-toggle` |
| Swatch | `color`, `label?` | `.sw` |
| Badge | `variant: 'accent' \| 'solid' \| 'warn' \| 'note' \| 'ok'`, children | `.pc-badge`, `.pc-special`, `.sev.*`, `.pc-dur` |
| EmptyState | `icon?`, `title`, `description?` | `.empty-state` |

Input/Textarea/Select are three small siblings treated as one "form field" family,
keeping the set at ~12 conceptual pieces.

## Tokens & styling

**Tokens** — port the app's `:root` block verbatim into `tokens.css`, on `:root`
so `var(--*)` resolves everywhere:

```
--bg #0D0D0D · --surface #111 · --surface2 #141414 · --panel #0C0C0C · --card #111
--accent #FFC72C · --secondary #FA4616
--text #E0E0E0 · --muted #9a9a9a · --dim #2E2E2E · --line #1c1c1c
--mono 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace
```

Kept faithful (unprefixed). A `--radius` / single spacing step may be surfaced
only where the app is already trivially consistent — no invented scale.

**Idiom** — className-based, self-contained:
- Component CSS reproduces the app's declarations verbatim, keyed to stable
  prefixed classes (`.pui-btn.pui-btn--primary`, `.pui-chip.is-selected`) instead
  of the app's id/generic selectors.
- No provider/wrapper: components carry their own `font-family: var(--mono)` (as
  the app's `button`/`input` rules already do), so styling works the moment
  `styles.css` is imported. This "just import the stylesheet" fact is the spine of
  the design-sync conventions header.
- Dark-only, matching the app.

**Fonts** — self-host JetBrains Mono 400/500/700/800 as `woff2` via `@font-face`
in `fonts.css` (OFL-licensed), replacing the app's Google Fonts `<link>`.

**`@import` closure** — `styles.css` imports `tokens.css`, `fonts.css`, and every
component `.css`. That closure is what design-sync feeds each rendered design, so
correctness here = correct rendering everywhere.

## Build & design-sync fit

**Build (Vite library mode):**
- `vite build` → `dist/phantom-ui.js` (ESM) + a UMD build exposing
  `window.PhantomUI.*`, plus `dist/style.css`. `vite-plugin-dts` emits `.d.ts`.
- `react`/`react-dom` externalized as peer-deps.
- `package.json` scripts: `build`, `typecheck`, `test`. Committed
  `package-lock.json`.

**design-sync handoff (follow-on task):** a later sync run writes
`design-system/.design-sync/config.json`:
- `shape: "package"`, package dir `design-system/`, `globalName: "PhantomUI"`
- `componentSrcMap` mapping each exported component to
  `src/components/<Name>/<Name>.tsx` (for per-component `.d.ts` + `.prompt.md`)
- styles entry `src/styles.css`, `tokensGlob` for `tokens.css`, and
  `readmeHeader → .design-sync/conventions.md`

The converter reads `dist/` + `src/` and produces the upload bundle.

## Testing & verification

- **Typecheck gate:** `tsc --noEmit` clean.
- **Build gate:** `vite build` succeeds and emits `dist/` + `style.css`.
- **Per-component smoke tests (Vitest + Testing Library):** each component renders
  and emits its root class + honors its key prop (e.g. `Button variant="primary"`
  → `.pui-btn--primary`; `Chip selected` → `.is-selected`). ~2 assertions each.
- **Visual gallery page (`demo/`):** renders all components in their states for
  eyeballing against the app; doubles as the usage examples design-sync's package
  converter grades previews from.
- Final fidelity is gated at sync time by design-sync's own preview grading; the
  gallery is the pre-sync self-check.

## Out of scope

- App-specific / domain components (PanelCard, SceneChip, AiChip, ShotList table,
  ContinuityItem, tour coachmark).
- Light theme / theming beyond the app's dark palette.
- Refactoring `index.html` to consume the new library (the app stays as-is).
- The claude.ai/design sync run itself (separate task).
- A spacing/type scale beyond what the app already uses consistently.

## Risks & notes

- **Font vendoring:** need JetBrains Mono woff2 for 4 weights. Source via
  `@fontsource/jetbrains-mono` or download; confirm subset covers the app's glyphs
  (incl. Thai? — the app shows Thai text, but that's *content*, not UI chrome; the
  UI itself is Latin/symbols, so the standard subset is fine. Flag if Thai UI
  labels appear.)
- **Global `:root` tokens** could theoretically collide with a design's own token
  names; kept unprefixed deliberately for faithfulness — low risk since names are
  semantic and design-sync scopes delivery.
- **esbuild bundlability:** Vite/React library output must re-bundle cleanly under
  design-sync's converter; verified at sync time, not here.
