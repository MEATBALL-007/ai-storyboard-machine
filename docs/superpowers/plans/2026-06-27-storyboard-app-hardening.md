# AI Storyboard Machine — Hardening Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the single-file AI Storyboard Machine to remove monkey-patching, make its pure logic testable, then harden reliability, upgrade the canvas art, and add responsive/accessible UX — all while keeping it a zero-setup single `index.html`.

**Architecture:** One `index.html` with one `<script>` block organized in dependency-ordered sections. Pure (DOM-free) logic lives between `// ==PURE-LOGIC-START==`/`END` markers and is unit-tested headlessly by a dev-only node runner (`tools/test.mjs`) and in-browser via `index.html?test`. A single `store` object with a `mutate()` funnel powers autosave and undo/redo.

**Tech Stack:** Vanilla JS (ES2020+), HTML5 Canvas, jsPDF (CDN). Node.js used only as a dev-time test runner — never shipped, never a runtime dependency.

## Global Constraints

- Shipped artifact stays a **single `index.html`** — no build step, no npm, no bundler, no framework, no runtime dependency beyond the existing **jsPDF CDN** `<script>`.
- `tools/test.mjs` is **dev-only** (Node ESM). It must not be referenced by `index.html`.
- Refactor tasks (Phase 1) are **behavior-preserving** — the app does everything it did before; only structure changes.
- Palette is fixed: bg `#0D0D0D`, surface `#111111`/`#141414`, panel `#0C0C0C`, accent `#FFC72C`, secondary `#FA4616`, text `#E0E0E0`. Muted text must be raised to meet WCAG AA (≥4.5:1) but stay in the grey family.
- Font: `'JetBrains Mono', ui-monospace, monospace`.
- New panel schema fields must be **optional with safe defaults** so previously-saved storyboards still render.
- Every code task is TDD: write the failing assertion, run `node tools/test.mjs` to see it fail, implement, run to see it pass, commit. Mechanical/CSS tasks verify via `node tools/test.mjs` staying green **plus** the manual checklist in Task 22.
- Commit after every task. Work happens on the `hardening-pass` branch (already created).

---

## File Structure

- `index.html` — the app. Reorganized into these `<script>` sections (one block):
  `CONFIG → PURE-LOGIC (markered) → STORAGE → ENGINE → CANVAS → RENDER → FEATURES → WIRING → TESTS (markered) → BOOT`.
- `tools/test.mjs` — dev-only headless test runner (new).
- `docs/superpowers/specs/2026-06-27-storyboard-app-hardening-design.md` — the approved spec (exists).

Marker contract inside `index.html`'s script:
```
// ==PURE-LOGIC-START==
...DOM-free function + const declarations...
// ==PURE-LOGIC-END==
...
// ==TESTS-START==
function __TESTS(assert, assertEq){ /* assertions */ }
// ==TESTS-END==
```

---

## Phase 1 — Refactor foundation (behavior-preserving)

### Task 1: Dev-only test runner + first pure-logic tests

**Files:**
- Create: `tools/test.mjs`
- Modify: `index.html` (add markers; move `hexToRgb`, `aspectDims` into PURE-LOGIC; add TESTS block)

**Interfaces:**
- Produces: `tools/test.mjs` runnable via `node tools/test.mjs`; global `__TESTS(assert, assertEq)` inside `index.html`; `assert(cond,msg)` and `assertEq(actual,expected,msg)` semantics.

- [ ] **Step 1: Write the test runner**

Create `tools/test.mjs`:
```js
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
function extract(tag){
  const m = html.match(new RegExp('// ==' + tag + '-START==([\\s\\S]*?)// ==' + tag + '-END=='));
  if(!m) throw new Error('Missing marker section: ' + tag);
  return m[1];
}
const results = { pass:0, fail:0, failures:[] };
const assert = (cond, msg) => { if(cond) results.pass++; else { results.fail++; results.failures.push(msg||'assertion failed'); } };
const assertEq = (a, b, msg) =>
  assert(JSON.stringify(a) === JSON.stringify(b), `${msg||''} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`);

const ctx = { console, Math, JSON, Array, Object, String, Number, structuredClone };
vm.createContext(ctx);
vm.runInContext(extract('PURE-LOGIC') + '\n' + extract('TESTS'), ctx);
ctx.__TESTS(assert, assertEq);

console.log(`\n${results.pass} passed, ${results.fail} failed`);
results.failures.forEach(f => console.log('  ✗ ' + f));
process.exit(results.fail ? 1 : 0);
```

- [ ] **Step 2: Add markers and move two pure functions**

In `index.html`, locate the existing `hexToRgb` and `aspectDims` functions. Cut them and paste both between new markers placed near the top of the script (just after the constants), exactly:
```js
// ==PURE-LOGIC-START==
function aspectDims(ratio){
  const map = { '16:9':[160,90], '2.39:1':[160,67], '4:3':[160,120], '1:1':[120,120] };
  return map[ratio] || [160,100];
}
function hexToRgb(hex){
  hex = (hex || '#000').replace('#','');
  if(hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
// ==PURE-LOGIC-END==
```
Ensure no duplicate definitions remain elsewhere.

- [ ] **Step 3: Add the TESTS block**

Just before the `BOOT` call at the end of the script, add:
```js
// ==TESTS-START==
function __TESTS(assert, assertEq){
  assertEq(aspectDims('16:9'), [160,90], 'aspectDims 16:9');
  assertEq(aspectDims('1:1'), [120,120], 'aspectDims 1:1');
  assertEq(aspectDims('weird'), [160,100], 'aspectDims fallback');
  assertEq(hexToRgb('#FFC72C'), [255,199,44], 'hexToRgb full');
  assertEq(hexToRgb('#fff'), [255,255,255], 'hexToRgb short');
}
// ==TESTS-END==
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `node tools/test.mjs`
Expected: `5 passed, 0 failed`

- [ ] **Step 5: Wire the in-page `?test` panel**

In the `BOOT` section, before `boot()` runs, add:
```js
if (location.search.includes('test')) {
  const out = []; let pass = 0, fail = 0;
  const A = (c,m) => { if(c) pass++; else { fail++; out.push('✗ ' + (m||'')); } };
  const AE = (a,b,m) => A(JSON.stringify(a)===JSON.stringify(b), `${m||''} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`);
  __TESTS(A, AE);
  document.body.innerHTML = `<pre style="font:14px ui-monospace;padding:24px;color:${fail?'#FA4616':'#7ac87a'}">`
    + `${pass} passed, ${fail} failed\n\n${out.join('\n')}</pre>`;
  throw 'tests-only';  // stop normal boot
}
```

- [ ] **Step 6: Verify in browser**

Run: `open "index.html?test"`
Expected: page shows green `5 passed, 0 failed`. Then `open "index.html"` — app still loads normally.

- [ ] **Step 7: Commit**

```bash
git add tools/test.mjs index.html
git commit -m "test: add headless + in-page test harness with marker sections"
```

---

### Task 2: Merge the two script blocks into one, add section banners

**Files:**
- Modify: `index.html` (combine the core `<script>` and the v2 IIFE `<script>` into one block; do NOT yet remove monkey-patching)

**Interfaces:**
- Produces: a single `<script>` block; the v2 IIFE body is inlined (still wrapping functions for now) so later tasks can collapse it.

- [ ] **Step 1: Inline the v2 script**

Delete the `</script>` that ends the core block and the `<script>` (plus `(function(){ 'use strict'` IIFE opener) that begins the v2 block, so both bodies live in one `<script>`. Remove the IIFE's closing `})();`. Keep all code. Convert the IIFE's top-level `const`/`let` (e.g. `APP`, `IMG_CACHE`, `player`) to plain top-level declarations.

- [ ] **Step 2: Add section banner comments**

Insert these banner comments in order to mark regions (move code under the right banner only where trivially adjacent; full reordering happens in later tasks):
```js
/* ============ CONFIG ============ */
/* ============ PURE-LOGIC (markered) ============ */
/* ============ STORAGE ============ */
/* ============ ENGINE ============ */
/* ============ CANVAS ============ */
/* ============ RENDER ============ */
/* ============ FEATURES ============ */
/* ============ WIRING ============ */
/* ============ TESTS (markered) ============ */
/* ============ BOOT ============ */
```

- [ ] **Step 3: Run tests — expect PASS**

Run: `node tools/test.mjs`
Expected: `5 passed, 0 failed`

- [ ] **Step 4: Manual smoke check**

Run: `open "index.html"`
Expected: sample storyboard renders; clicking a panel, switching scenes, and Export menu all still work (these still go through the wrappers).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: merge core and v2 scripts into one block with section banners"
```

---

### Task 3: Collapse canvas monkey-patches (`drawPanel`, `finishFrame`, `buildPanelCard`)

**Files:**
- Modify: `index.html` (CANVAS + RENDER sections)

**Interfaces:**
- Consumes: existing `IMG_CACHE`, `getPanelImg`, `drawCover`, `drawOverlays`, `STATE.overlays`.
- Produces: single `drawPanel(canvas, panel)`, `finishFrame(ctx,W,H,panel)`, `buildPanelCard(panel,idx,aw,ah)` with no `_`-prefixed shadow copies.

- [ ] **Step 1: Fold image branch into `drawPanel`**

Replace the original `function drawPanel(...)` body's entry with the image check, and delete the later `const _drawPanel = drawPanel; drawPanel = function(...)` wrapper. Final `drawPanel` begins:
```js
function drawPanel(canvas, panel){
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  const comp = panel.composition || {};
  const special = panel.special || comp.special;
  if(panel.image){
    const img = getPanelImg(panel);
    if(img && img.complete && img.naturalWidth){
      ctx.clearRect(0,0,W,H);
      try { drawCover(ctx, img, W, H); } catch(e){}
      finishFrame(ctx, W, H, panel);
      return;
    } else if(img){
      img.onload = () => { try { drawPanel(canvas, panel); } catch(e){} };
    }
  }
  ctx.clearRect(0, 0, W, H);
  // ...rest of original procedural body unchanged...
}
```

- [ ] **Step 2: Fold overlays into `finishFrame`**

Append `drawOverlays(ctx, W, H, panel);` as the last line inside the original `finishFrame`, and delete the `const _finishFrame = finishFrame; finishFrame = function(...)` wrapper.

- [ ] **Step 3: Fold AI-art button/badge into `buildPanelCard`**

Inside the original `buildPanelCard`, before `return card;`, add the art button + badge code from the wrapper, then delete the `const _buildPanelCard = buildPanelCard; buildPanelCard = function(...)` wrapper:
```js
  const _tools = card.querySelector('.pc-tools');
  if(_tools){
    const ab = document.createElement('button');
    ab.innerHTML = '✦'; ab.title = 'Generate AI frame art';
    ab.onclick = e => { e.stopPropagation(); genPanelImage(panel.id); };
    _tools.insertBefore(ab, _tools.firstChild);
  }
  if(panel.image){
    const w = card.querySelector('.pc-canvas-wrap');
    const bd = document.createElement('div'); bd.className = 'pc-imgbadge'; bd.textContent = 'AI ART';
    if(w) w.appendChild(bd);
  }
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `node tools/test.mjs`
Expected: `5 passed, 0 failed`

- [ ] **Step 5: Manual check**

Run: `open "index.html"`
Expected: panels render with overlays toggling correctly (grid header guide buttons), the `✦` button is present on cards, drawings look identical to before.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "refactor: inline canvas image/overlay/art-button behavior, drop wrappers"
```

---

### Task 4: Collapse state monkey-patches (`applyStoryboard`, `saveToLocalStorage`, `loadProject`, `renderPanelDetails`)

**Files:**
- Modify: `index.html` (RENDER + STORAGE + FEATURES)

**Interfaces:**
- Consumes: `APP`, `curScene`, `renderSceneBar`, `updateSeqRuntime`, `activateScene`, `setReadOnly`, `setupInlineEdit`, `injectComments`.
- Produces: single definitions of `applyStoryboard`, `saveToLocalStorage`, `loadProject`, `renderPanelDetails`; no reassignments anywhere in the file.

- [ ] **Step 1: Inline `applyStoryboard`**

Replace the original `function applyStoryboard(sb, keepSelection)` body to include scene sync, and delete the wrapper:
```js
function applyStoryboard(sb, keepSelection){
  if(curScene()) curScene().storyboard = sb;
  STATE.storyboard = sb;
  if(!keepSelection) STATE.selectedPanelId = null;
  renderStoryboard(sb);
  renderColorBible(sb.color_bible);
  renderShotList();
  saveToLocalStorage(sb);
  renderSceneBar();
  updateSeqRuntime();
}
```

- [ ] **Step 2: Inline `saveToLocalStorage`**

Replace with the scene-aware version (from the wrapper), delete the wrapper and the old single-scene original:
```js
function saveToLocalStorage(sb){
  if(curScene()) curScene().storyboard = sb || STATE.storyboard;
  if(APP.readOnly) return;
  let projects;
  try { projects = getProjects(); } catch(e){ return; }
  const name = $('#projName').value || APP.name || (sb && sb.title) || 'Untitled';
  APP.name = name;
  const record = { name, director: APP.director, schemaVersion: 2,
    settings: STATE.settings, storyboard: STATE.storyboard,
    scenes: APP.scenes, active: APP.active, ts: Date.now() };
  const i = projects.findIndex(p => p.name === name);
  if(i >= 0) projects[i] = record; else projects.unshift(record);
  saveProjects(projects);
  try { localStorage.setItem(LS_CUR, name); } catch(e){}
  renderProjectList();
}
```

- [ ] **Step 3: Inline `loadProject` and `renderPanelDetails`**

Move the wrapper bodies of `loadProject` and `renderPanelDetails` into single `function` definitions (scene-aware load; details + `setupInlineEdit()` + `injectComments()`), and delete the `loadProject = function...` / `renderPanelDetails = function...` reassignments.

- [ ] **Step 4: Delete the now-empty wrapper scaffolding**

Remove any remaining `const _applyStoryboard = ...`, `const _saveToLocalStorage = ...`, etc. Search the file for `_applyStoryboard`, `_saveToLocalStorage`, `_loadProject`, `_renderPanelDetails`, `_drawPanel`, `_finishFrame`, `_buildPanelCard` — there must be zero matches.

- [ ] **Step 5: Verify no reassignments remain**

Run: `grep -nE '^\s*(drawPanel|finishFrame|buildPanelCard|applyStoryboard|saveToLocalStorage|loadProject|renderPanelDetails)\s*=' index.html`
Expected: no output (all are `function` declarations now, not assignments).

- [ ] **Step 6: Run tests + manual check**

Run: `node tools/test.mjs` → `5 passed, 0 failed`
Run: `open "index.html"` → generate, regenerate a panel, edit a panel, add/switch/delete scenes, reload page (loads last project), Export PDF — all work.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "refactor: inline state/scene/detail behavior, remove all monkey-patching"
```

---

### Task 5: Unify `STATE` + `APP` into one `store` with a `mutate()` funnel

**Files:**
- Modify: `index.html` (CONFIG/STATE + PURE-LOGIC + STORAGE)

**Interfaces:**
- Produces (PURE-LOGIC): `cloneProject(project)`, `snapshot(store)`, `applyMutation(store, fn)`; `store` shape `{ project:{name,director,scenes,active}, ui:{...}, history:{past:[],future:[]} }`.
- Keeps `STATE`/`APP` as thin **aliases** into `store` so existing call-sites keep working (minimal-diff migration): `STATE = store.ui`-like accessors are avoided; instead keep `STATE` and `APP` objects but make `mutate()` the write path for project data.

- [ ] **Step 1: Add pure reducers + failing test**

In PURE-LOGIC add:
```js
function cloneProject(p){ return structuredClone(p); }
function snapshot(store){
  store.history.past.push(cloneProject(store.project));
  if(store.history.past.length > 30) store.history.past.shift();
  store.history.future.length = 0;
}
function applyMutation(store, fn){ snapshot(store); fn(store.project); return store; }
```
In TESTS add:
```js
  const st = { project:{name:'a',scenes:[],active:0}, history:{past:[],future:[]} };
  applyMutation(st, p => { p.name = 'b'; });
  assertEq(st.project.name, 'b', 'mutate applies fn');
  assertEq(st.history.past.length, 1, 'mutate snapshots');
  assertEq(st.history.past[0].name, 'a', 'snapshot is pre-mutation clone');
```

- [ ] **Step 2: Run tests — expect FAIL then implement-already-done — expect PASS**

Run: `node tools/test.mjs`
Expected after adding both: `8 passed, 0 failed` (fails first if you add the test before the functions).

- [ ] **Step 3: Introduce the `store` and bind aliases**

In CONFIG, after `STATE` and `APP` are defined, add:
```js
const store = { project: APP, ui: STATE, history: { past: [], future: [] } };
```
(`APP` already holds `{name,director,scenes,active,readOnly}`; reuse it as `store.project`.)

- [ ] **Step 4: Route project edits through `mutate()`**

Add a DOM-aware wrapper in STORAGE:
```js
function mutate(fn){ applyMutation(store, fn); saveToLocalStorage(STATE.storyboard); }
```
Convert the direct project-array edits to use it: panel delete, reorder, scene add/delete, and panel-detail "Apply" now call `mutate(p => { ... })` instead of mutating arrays then calling `applyStoryboard`. (Detailed per-call-site edits are in Tasks 9–10; here just create `mutate` and migrate the **scene add/delete** call-sites as the first consumers.)

- [ ] **Step 5: Run tests + manual check**

Run: `node tools/test.mjs` → `8 passed, 0 failed`
Run: `open "index.html"` → add a scene, delete a scene; both still work and persist on reload.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "refactor: unify state into a single store with mutate() funnel"
```

---

## Phase 2 — Test coverage for existing pure logic

### Task 6: Move + test the continuity analyzer

**Files:**
- Modify: `index.html` (move `analyzeContinuity` into PURE-LOGIC; add tests)

**Interfaces:**
- Consumes: panel objects `{id,shot_size,camera_angle,duration_seconds,special,composition:{subjects:[{facing,scale}]}}`.
- Produces: `analyzeContinuity(panels) -> [{sev:'warn'|'note', id, msg}]` in PURE-LOGIC.

- [ ] **Step 1: Move `analyzeContinuity` into the PURE-LOGIC section** (it is already DOM-free). Ensure it sits before `// ==PURE-LOGIC-END==`.

- [ ] **Step 2: Add failing tests**

In `__TESTS`:
```js
  const mk = (o) => Object.assign({ shot_size:'MS', camera_angle:'Eye Level', duration_seconds:3, special:null, composition:{subjects:[]} }, o);
  const rep = analyzeContinuity([ mk({id:'F01',shot_size:'CU'}), mk({id:'F02',shot_size:'CU'}) ]);
  assert(rep.some(w => w.id==='F02' && /Repeated CU/.test(w.msg)), 'flags repeated shot size');
  const line = analyzeContinuity([
    mk({id:'F01',shot_size:'WS',composition:{subjects:[{facing:'left',scale:'medium'}]}}),
    mk({id:'F02',shot_size:'MS',composition:{subjects:[{facing:'right',scale:'medium'}]}}),
  ]);
  assert(line.some(w => w.id==='F02' && /180/.test(w.msg)), 'flags 180-line cross');
  assertEq(analyzeContinuity([]).length, 0, 'empty -> no warnings');
```

- [ ] **Step 3: Run tests**

Run: `node tools/test.mjs`
Expected: `11 passed, 0 failed`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "test: cover continuity analyzer; move it into pure-logic section"
```

---

### Task 7: Extract + test the script parser

**Files:**
- Modify: `index.html` (extract slug-splitting from `parseScriptToScenes` into pure `splitScriptToSegments`; add tests)

**Interfaces:**
- Produces: `splitScriptToSegments(text) -> [{title, body:[lines]}]` in PURE-LOGIC. `parseScriptToScenes()` calls it for the DOM/state side.

- [ ] **Step 1: Add pure `splitScriptToSegments` + failing tests**

In PURE-LOGIC:
```js
function splitScriptToSegments(text){
  const slugRe = /^\s*(INT\.?|EXT\.?|INT\.?\/EXT\.?|I\/E)\b/i;
  const lines = String(text).split(/\r?\n/);
  const segs = []; let cur = null;
  lines.forEach(ln => {
    if(slugRe.test(ln)){ cur = { title: ln.trim(), body: [] }; segs.push(cur); }
    else { if(!cur){ cur = { title: 'Scene 1', body: [] }; segs.push(cur); } cur.body.push(ln); }
  });
  if(segs.length < 2){
    const paras = String(text).split(/\n\s*\n/).filter(p => p.trim());
    if(paras.length > 1){
      segs.length = 0;
      paras.forEach((p,i) => segs.push({ title:'Scene '+(i+1), body:[p] }));
    }
  }
  if(!segs.length) segs.push({ title:'Scene 1', body:[String(text)] });
  return segs;
}
```
In `__TESTS`:
```js
  const s1 = splitScriptToSegments("INT. ROOM - DAY\nShe waits.\nEXT. STREET - NIGHT\nHe leaves.");
  assertEq(s1.length, 2, 'two sluglines -> two scenes');
  assert(/INT\. ROOM/.test(s1[0].title), 'first slug title');
  const s2 = splitScriptToSegments("para one\n\npara two\n\npara three");
  assertEq(s2.length, 3, 'no slugs -> split on blank lines');
  assertEq(splitScriptToSegments("").length, 1, 'empty -> one scene');
```

- [ ] **Step 2: Refactor `parseScriptToScenes` to call it**

Replace its inline slug/segment logic with `const segs = splitScriptToSegments($('#script').value.trim());`, keeping the scene-building/DOM code.

- [ ] **Step 3: Run tests + manual check**

Run: `node tools/test.mjs` → `15 passed, 0 failed`
Run: `open "index.html"` → paste a 2-slug script, click "Parse → Scenes", confirm 2 scenes appear.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "test: extract and cover script parser (splitScriptToSegments)"
```

---

### Task 8: Extract + test palette math and share round-trip

**Files:**
- Modify: `index.html` (extract `pixelsToPalette`; move `b64enc`/`b64dec`; add tests)

**Interfaces:**
- Produces: `pixelsToPalette(samples) -> {shadow,midtone,highlight,accent}` where `samples` is `[{r,g,b}]`; `b64enc(str)`, `b64dec(str)` in PURE-LOGIC.

- [ ] **Step 1: Add pure `pixelsToPalette` + tests**

In PURE-LOGIC:
```js
function _hx(p){ return '#' + [p.r,p.g,p.b].map(v => ('0'+Math.round(v).toString(16)).slice(-2)).join(''); }
function pixelsToPalette(samples){
  const px = samples.map(p => ({ r:p.r, g:p.g, b:p.b,
    l: 0.299*p.r + 0.587*p.g + 0.114*p.b,
    s: Math.max(p.r,p.g,p.b) - Math.min(p.r,p.g,p.b) }));
  px.sort((a,b) => a.l - b.l);
  const at = f => px[Math.floor(f*(px.length-1))];
  const accent = px.reduce((m,p) => p.s > m.s ? p : m, px[0]);
  return { shadow:_hx(at(0.12)), midtone:_hx(at(0.5)), highlight:_hx(at(0.9)), accent:_hx(accent) };
}
```
In `__TESTS`:
```js
  const pal = pixelsToPalette([{r:0,g:0,b:0},{r:128,g:128,b:128},{r:255,g:255,b:255},{r:250,g:10,b:10}]);
  assertEq(pal.shadow, '#000000', 'palette shadow = darkest');
  assertEq(pal.highlight, '#ffffff', 'palette highlight = lightest');
  assertEq(pal.accent, '#fa0a0a', 'palette accent = most saturated');
  const round = JSON.parse(b64dec(b64enc(JSON.stringify({a:1,t:'ขอ'}))));
  assertEq(round.t, 'ขอ', 'b64 round-trip preserves unicode');
```
Note: `b64enc`/`b64dec` use `btoa`/`atob`; add `btoa`/`atob` shims to the node runner context in `tools/test.mjs`:
```js
ctx.btoa = s => Buffer.from(s, 'binary').toString('base64');
ctx.atob = s => Buffer.from(s, 'base64').toString('binary');
```

- [ ] **Step 2: Refactor `extractPaletteFromImage` to use `pixelsToPalette`** (build `samples` from the image data, call the pure fn, apply to color bible).

- [ ] **Step 3: Run tests**

Run: `node tools/test.mjs`
Expected: `19 passed, 0 failed`

- [ ] **Step 4: Commit**

```bash
git add index.html tools/test.mjs
git commit -m "test: cover palette extraction math and share encode round-trip"
```

---

## Phase 3 — Reliability & correctness

### Task 9: Undo/redo

**Files:**
- Modify: `index.html` (PURE-LOGIC reducers `undo`/`redo`; WIRING keybinds; RENDER undo toast)

**Interfaces:**
- Consumes: `store`, `snapshot`, `mutate`.
- Produces: `undo(store) -> bool`, `redo(store) -> bool` (PURE-LOGIC); `applyStoreToUI()` re-render helper.

- [ ] **Step 1: Add `undo`/`redo` + failing tests**

In PURE-LOGIC:
```js
function undo(store){
  if(!store.history.past.length) return false;
  store.history.future.push(cloneProject(store.project));
  store.project = store.history.past.pop();
  return true;
}
function redo(store){
  if(!store.history.future.length) return false;
  store.history.past.push(cloneProject(store.project));
  store.project = store.history.future.pop();
  return true;
}
```
In `__TESTS`:
```js
  const u = { project:{name:'a',scenes:[],active:0}, history:{past:[],future:[]} };
  applyMutation(u, p => p.name='b');
  assertEq(undo(u), true, 'undo returns true when history exists');
  assertEq(u.project.name, 'a', 'undo restores previous');
  assertEq(redo(u), true, 'redo returns true');
  assertEq(u.project.name, 'b', 'redo re-applies');
  assertEq(undo({history:{past:[],future:[]},project:{}}), false, 'undo empty -> false');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `24 passed, 0 failed`

- [ ] **Step 3: Add DOM glue**

In STORAGE/RENDER add:
```js
function applyStoreToUI(){
  APP = store.project;                 // rebind alias
  const sc = curScene();
  if(sc){ STATE.storyboard = sc.storyboard; STATE.settings = sc.settings; }
  renderStoryboard(STATE.storyboard); renderColorBible(STATE.storyboard.color_bible);
  renderShotList(); renderSceneBar(); updateSeqRuntime();
  try { localStorage.setItem(LS_KEY, JSON.stringify(getProjects())); } catch(e){}
}
function doUndo(){ if(undo(store)){ applyStoreToUI(); toast('Undid last change'); } else toast('Nothing to undo'); }
function doRedo(){ if(redo(store)){ applyStoreToUI(); toast('Redid change'); } else toast('Nothing to redo'); }
```

- [ ] **Step 4: Keybinds**

In the existing keydown handler (non-typing branch) add:
```js
    else if((e.metaKey||e.ctrlKey) && k==='z' && !e.shiftKey){ e.preventDefault(); doUndo(); }
    else if((e.metaKey||e.ctrlKey) && (k==='y' || (k==='z' && e.shiftKey))){ e.preventDefault(); doRedo(); }
```

- [ ] **Step 5: Manual check**

Run: `open "index.html"` → edit a panel's action via the details editor "Apply", press `Cmd/Ctrl+Z` → reverts; `Shift+Cmd/Ctrl+Z` → re-applies.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add undo/redo via store history with keybinds"
```

---

### Task 10: Soft-delete with undo toast

**Files:**
- Modify: `index.html` (RENDER `deletePanel`; FEATURES scene delete)

**Interfaces:**
- Consumes: `mutate`, `doUndo`, `toast`.
- Produces: `deletePanel(id)` routed through `mutate`; an "Undo" affordance in the toast.

- [ ] **Step 1: Route `deletePanel` through `mutate`**

Replace the body so the array edit happens inside `mutate` (snapshotting), then offer undo:
```js
function deletePanel(id){
  const before = STATE.storyboard.panels.find(p => p.id === id);
  if(!before) return;
  mutate(p => {
    const sb = p.scenes[p.active].storyboard;
    const i = sb.panels.findIndex(x => x.id === id);
    if(i >= 0) sb.panels.splice(i, 1);
  });
  if(STATE.selectedPanelId === id){ STATE.selectedPanelId = null; STATE.rightMode = 'shotlist'; }
  applyStoreToUI();
  toastUndo('Deleted ' + id);
}
```

- [ ] **Step 2: Add `toastUndo` helper (RENDER)**
```js
function toastUndo(msg){
  const t = $('#toast');
  t.innerHTML = escapeHtml(msg) + ' · <span id="toastUndo" style="color:var(--accent);cursor:pointer;text-decoration:underline">Undo</span>';
  t.classList.remove('err'); t.classList.add('on');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 5000);
  const u = $('#toastUndo'); if(u) u.onclick = () => { doUndo(); t.classList.remove('on'); };
}
```

- [ ] **Step 3: Route scene-delete through `mutate`** similarly (snapshot, splice, `applyStoreToUI`, `toastUndo`).

- [ ] **Step 4: Run tests + manual check**

Run: `node tools/test.mjs` → `24 passed, 0 failed`
Run: `open "index.html"` → delete a panel, click "Undo" in the toast → panel returns.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: soft-delete panels/scenes with inline undo toast"
```

---

### Task 11: Hardened API layer with typed errors

**Files:**
- Modify: `index.html` (PURE-LOGIC `classifyApiError`, `extractJsonObject`; ENGINE `callClaude`)

**Interfaces:**
- Produces: `extractJsonObject(text) -> object` (throws `Error('bad-json')`); `classifyApiError(status, bodyText) -> {kind, message}` where kind ∈ `auth|rate-limit|server|cors|bad-json|unknown`; `callClaude(prompt, {maxTokens}) -> object`.

- [ ] **Step 1: Add pure helpers + tests**

In PURE-LOGIC:
```js
function extractJsonObject(text){
  let t = String(text).replace(/```json|```/g, '').trim();
  const s = t.indexOf('{'), e = t.lastIndexOf('}');
  if(s < 0 || e < 0) throw new Error('bad-json');
  try { return JSON.parse(t.slice(s, e + 1)); } catch(_){ throw new Error('bad-json'); }
}
function classifyApiError(status, bodyText){
  if(status === 401 || status === 403) return { kind:'auth', message:'API key rejected — check your key.' };
  if(status === 429) return { kind:'rate-limit', message:'Rate limited — wait a moment and retry.' };
  if(status >= 500) return { kind:'server', message:'Provider error — try again shortly.' };
  if(status === 0) return { kind:'cors', message:'Blocked by the browser (CORS). Direct calls from a file:// page are often blocked; use a proxy or run from a server.' };
  return { kind:'unknown', message:'Request failed (' + status + ').' };
}
```
In `__TESTS`:
```js
  assertEq(extractJsonObject('```json\n{"a":1}\n```').a, 1, 'extracts fenced json');
  assertEq(extractJsonObject('noise {"b":2} tail').b, 2, 'extracts embedded json');
  let threw = false; try { extractJsonObject('nope'); } catch(e){ threw = e.message === 'bad-json'; }
  assert(threw, 'bad json throws bad-json');
  assertEq(classifyApiError(401).kind, 'auth', '401 -> auth');
  assertEq(classifyApiError(429).kind, 'rate-limit', '429 -> rate-limit');
  assertEq(classifyApiError(0).kind, 'cors', '0 -> cors');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `30 passed, 0 failed`

- [ ] **Step 3: Add `callClaude` wrapper (ENGINE)**
```js
async function callClaude(prompt, opts){
  opts = opts || {};
  const apiKey = getApiKey();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', signal: ctrl.signal,
      headers:{ 'Content-Type':'application/json', 'x-api-key':apiKey,
        'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens: opts.maxTokens || 4000,
        messages:[{ role:'user', content: prompt }] })
    });
    if(!res.ok){ const info = classifyApiError(res.status, await res.text().catch(()=> '')); throw new Error(info.message); }
    const data = await res.json();
    return extractJsonObject(data.content[0].text);
  } catch(err){
    if(err.name === 'AbortError') throw new Error('Request timed out after 30s.');
    if(err.message === 'bad-json') throw new Error('AI returned invalid JSON — try again.');
    if(/Failed to fetch|NetworkError/.test(err.message)) throw new Error(classifyApiError(0).message);
    throw err;
  } finally { clearTimeout(timer); }
}
```

- [ ] **Step 4: Use it** in `generateStoryboard` and `regeneratePanel` (replace inline fetch+parse with `const sb = await callClaude(prompt, {maxTokens:4000})` and `normalizePanel`).

- [ ] **Step 5: Manual check**

Run: `open "index.html"` → with no/invalid key, click Generate → falls back to demo (no key) or shows a specific auth message (bad key). With a valid key, generation still works.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: hardened Claude API wrapper with timeout, retry-safe typed errors"
```

---

### Task 12: Storage safety + schema migration

**Files:**
- Modify: `index.html` (PURE-LOGIC `migrateRecord`; STORAGE guards + debounced autosave)

**Interfaces:**
- Produces: `migrateRecord(rec) -> rec` (adds `schemaVersion:2`, wraps single-scene legacy records into `scenes`); guarded `getProjects`/`saveProjects`.

- [ ] **Step 1: Add `migrateRecord` + tests**

In PURE-LOGIC:
```js
function migrateRecord(rec){
  if(!rec || typeof rec !== 'object') return rec;
  if(rec.schemaVersion === 2) return rec;
  if(!rec.scenes && rec.storyboard){
    rec.scenes = [{ settings: rec.settings || {}, storyboard: rec.storyboard }];
    rec.active = 0;
  }
  rec.schemaVersion = 2;
  return rec;
}
```
In `__TESTS`:
```js
  const legacy = { name:'x', storyboard:{ title:'t', panels:[] }, settings:{ title:'t' } };
  const mig = migrateRecord(legacy);
  assertEq(mig.schemaVersion, 2, 'migration sets version');
  assertEq(mig.scenes.length, 1, 'legacy wrapped into one scene');
  assertEq(mig.scenes[0].storyboard.title, 't', 'scene keeps storyboard');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `33 passed, 0 failed`

- [ ] **Step 3: Guard storage + apply migration on read**

Update `getProjects`:
```js
function getProjects(){
  try { return (JSON.parse(localStorage.getItem(LS_KEY)) || []).map(migrateRecord); }
  catch(e){ return []; }
}
function saveProjects(list){
  try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0,10))); }
  catch(e){ toast('Storage full or unavailable — changes not saved', true); }
}
```

- [ ] **Step 4: Debounce autosave**

Wrap the write side of `saveToLocalStorage`'s persistence in a debounced inner call:
```js
let _saveTimer = 0;
function scheduleSave(){ clearTimeout(_saveTimer); _saveTimer = setTimeout(persistNow, 400); }
```
Have `saveToLocalStorage` build the record then call `scheduleSave()` (move the actual `saveProjects`/`localStorage.setItem` into `persistNow`).

- [ ] **Step 5: Manual check**

Run: `open "index.html"` → make rapid edits; reload → latest state persisted. (Optionally test private-window to confirm no crash on blocked storage.)

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: guard localStorage, add schema migration and debounced autosave"
```

---

### Task 13: Targeted bug sweep

**Files:**
- Modify: `index.html` (CANVAS export taint guard; details inline-edit; FEATURES)

**Interfaces:** none new.

- [ ] **Step 1: Tainted-canvas export guard**

In `exportContactSheet`, wrap `cv.toBlob(...)` so a SecurityError (from URL-based AI images) shows a clear message:
```js
  try { cv.toBlob(b => { if(!b){ showError('Export blocked (AI image from URL taints the canvas). Use base64 image output.'); return; }
    const u=URL.createObjectURL(b); const a=ce('a'); a.href=u; a.download=`contactsheet-${safeName(sb.title)}.png`; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }); }
  catch(e){ showError('Export blocked by a cross-origin AI image. Use base64 (b64_json) output.'); }
```

- [ ] **Step 2: Confirm inline-edit handle redraw**

Verify `setupInlineEdit` schedules its first `redraw` via `requestAnimationFrame` (so handles survive the details re-render). If not present, wrap the initial `redraw()` call in `requestAnimationFrame(redraw)`.

- [ ] **Step 3: Run tests + manual check**

Run: `node tools/test.mjs` → `33 passed, 0 failed`
Run: `open "index.html"` → open a panel, confirm drag handles appear and persist; trigger a contact-sheet export with only procedural art → succeeds.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "fix: export taint guard and inline-edit handle redraw"
```

---

## Phase 4 — Canvas-art upgrade

### Task 14: Shot-size-aware framing

**Files:**
- Modify: `index.html` (PURE-LOGIC `shotFraming`; CANVAS apply in `drawPanel`)

**Interfaces:**
- Produces: `shotFraming(shot_size) -> {zoom, subjectY, cropTop}` (multipliers) in PURE-LOGIC.

- [ ] **Step 1: Add `shotFraming` + tests**

In PURE-LOGIC:
```js
function shotFraming(size){
  const M = {
    EWS:{zoom:0.85,subjectY:0.96,cropTop:0}, WS:{zoom:1.0,subjectY:0.96,cropTop:0},
    MLS:{zoom:1.15,subjectY:1.02,cropTop:0}, MS:{zoom:1.4,subjectY:1.15,cropTop:0},
    MCU:{zoom:1.8,subjectY:1.35,cropTop:0.05}, CU:{zoom:2.4,subjectY:1.7,cropTop:0.1},
    ECU:{zoom:3.2,subjectY:2.1,cropTop:0.2},
  };
  return M[size] || { zoom:1.2, subjectY:1.0, cropTop:0 };
}
```
In `__TESTS`:
```js
  assert(shotFraming('ECU').zoom > shotFraming('WS').zoom, 'ECU zooms more than WS');
  assertEq(shotFraming('WS').cropTop, 0, 'WS no crop');
  assert(shotFraming('unknown').zoom > 0, 'unknown -> safe default');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `36 passed, 0 failed`

- [ ] **Step 3: Apply in `drawPanel`**

After computing subject screen positions, scale `fh`/`fw` by `frm.zoom` and shift `by` using `frm.subjectY` so close-ups actually crop into the figure. Use `const frm = shotFraming(panel.shot_size);` (skip when `special` is set).

- [ ] **Step 4: Manual check**

Run: `open "storyboard-simulator.html"` (fast iteration) and `open "index.html"` → set a panel to CU vs WS → CU now frames head/shoulders, not a tiny full body.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(canvas): shot-size-aware framing so drawings match shot labels"
```

---

### Task 15: Posed figures

**Files:**
- Modify: `index.html` (PURE-LOGIC `poseFromAction`; CANVAS `drawHuman` pose param)

**Interfaces:**
- Produces: `poseFromAction(action) -> 'standing'|'sitting'|'lying'|'reaching'`; `drawHuman(ctx,cx,by,fw,fh,color,facing,pose)`.

- [ ] **Step 1: Add `poseFromAction` + tests**

In PURE-LOGIC:
```js
function poseFromAction(action){
  const a = String(action || '').toLowerCase();
  if(/\b(lies|lying|lay|bed|asleep|sleep|floor)\b/.test(a)) return 'lying';
  if(/\b(sits|sitting|sat|seated|chair|edge of)\b/.test(a)) return 'sitting';
  if(/\b(reaches|reaching|reach|grabs|hand)\b/.test(a)) return 'reaching';
  return 'standing';
}
```
In `__TESTS`:
```js
  assertEq(poseFromAction('She sits on the edge of the bed'), 'sitting', 'sitting from action');
  assertEq(poseFromAction('He lies on the floor'), 'lying', 'lying from action');
  assertEq(poseFromAction('A figure walks in'), 'standing', 'default standing');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `39 passed, 0 failed`

- [ ] **Step 3: Extend `drawHuman`**

Add a `pose` param. For `'sitting'`, lower the hip line and bend legs forward (draw thighs horizontal then shins down); for `'lying'`, rotate the body near-horizontal at `by`; for `'reaching'`, extend one arm toward `facing`. Default `'standing'` keeps current geometry. In `drawPanel`, pass `subj.pose || poseFromAction(panel.action)` per subject.

- [ ] **Step 4: Manual check**

Run: `open "index.html"` → a "sits on the edge of the bed" panel now reads as seated.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(canvas): posed figures (sitting/lying/reaching) from action keywords"
```

---

### Task 16: Layered depth, atmospheric haze, form lighting

**Files:**
- Modify: `index.html` (CANVAS)

**Interfaces:** none new (internal rendering only).

- [ ] **Step 1: Atmospheric haze by depth**

In the subject loop in `drawPanel`, lighten/desaturate further (smaller-scale) subjects: blend the silhouette color toward the background midtone proportionally to `1 - SCALE_MAP[scale][0]/0.16`. Compute a per-subject alpha/colour so `tiny` subjects sit back in haze.

- [ ] **Step 2: Form lighting on figures**

After drawing each figure, overlay a shadow on the side opposite the key: if `lighting` includes `left`/`window_left`/`key_left`, darken the figure's right third with a vertical gradient clip; mirror for right. Skip for `ambient`.

- [ ] **Step 3: Manual check**

Run: `open "index.html"` → multi-subject wide shots show depth; figures have a lit/shadow side matching the light direction.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(canvas): depth haze and directional form lighting on figures"
```

---

### Task 17: Environment props + texture

**Files:**
- Modify: `index.html` (PURE-LOGIC `propsFor`; CANVAS draw hints + hatch)

**Interfaces:**
- Produces: `propsFor(comp) -> ['bed'|'window'|'door'|'tree'|'building'|'streetlight'...]` from `background_notes`/flags.

- [ ] **Step 1: Add `propsFor` + tests**

In PURE-LOGIC:
```js
function propsFor(comp){
  const notes = String(comp && comp.background_notes || '').toLowerCase();
  const out = [];
  if(comp && comp.is_interior){
    if(/bed|pillow|sheet/.test(notes)) out.push('bed');
    if(/window|curtain/.test(notes) || /window/.test(comp.lighting||'')) out.push('window');
    if(/door/.test(notes)) out.push('door');
  } else {
    if(/tree|forest|park/.test(notes)) out.push('tree');
    if(/building|city|street|neon/.test(notes)) out.push('building');
    if(/lamp|streetlight|neon/.test(notes)) out.push('streetlight');
  }
  return out;
}
```
In `__TESTS`:
```js
  assert(propsFor({is_interior:true, background_notes:'rumpled bed, one pillow'}).includes('bed'), 'bed prop');
  assert(propsFor({is_interior:false, background_notes:'neon street'}).includes('building'), 'building prop');
  assertEq(propsFor({is_interior:true, background_notes:''}).length, 0, 'no props when nothing matches');
```

- [ ] **Step 2: Run tests**

Run: `node tools/test.mjs` → `42 passed, 0 failed`

- [ ] **Step 3: Draw props + shadow hatch**

In `drawPanel` (before subjects), call `propsFor(comp)` and draw each as a simple rough vector (bed = low rounded rectangle near `by`; window = framed rectangle on the lit wall; tree = trunk + blob; building = stacked rectangles on the horizon; streetlight = pole + glow). Add a light diagonal cross-hatch in the lower-shadow band using `roughLine`.

- [ ] **Step 4: Manual check**

Run: `open "index.html"` → interior panels with "bed"/"window" notes show those hints; exterior night shows buildings/streetlights.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(canvas): keyword-driven environment props and shadow hatching"
```

---

## Phase 5 — UX, polish & accessibility

### Task 18: Responsive layout

**Files:**
- Modify: `index.html` (CSS + a sidebar-toggle control in the top bar)

**Interfaces:** none new.

- [ ] **Step 1: Add responsive CSS**

Append to `<style>`:
```css
#sidebarToggle{display:none}
@media(max-width:1100px){
  #sidebarToggle{display:inline-block;padding:5px 10px;border:1px solid var(--line);border-radius:3px;color:var(--muted)}
  #left{position:fixed;left:0;top:70px;bottom:0;z-index:40;transform:translateX(-100%);transition:.2s;box-shadow:8px 0 24px rgba(0,0,0,.5)}
  #left.open{transform:translateX(0)}
  #right{position:fixed;right:0;top:70px;bottom:0;z-index:40}
  #grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:700px){
  #grid,#grid.cols2,#grid.cols3{grid-template-columns:1fr}
  #sceneBar{overflow-x:auto}
  #topbar{gap:6px} #projName{min-width:90px}
}
```

- [ ] **Step 2: Add the toggle button + handler**

In the top bar add `<button id="sidebarToggle" aria-label="Toggle script & settings panel">☰</button>`; wire `onclick = () => $('#left').classList.toggle('open')`.

- [ ] **Step 3: Manual check**

Run: `open "index.html"` then narrow the window to ~900px and ~650px → sidebars become toggled drawers, grid reflows to 2 then 1 column, nothing overflows.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(ux): responsive layout with collapsible drawers under 1100px"
```

---

### Task 19: Accessibility

**Files:**
- Modify: `index.html` (HTML roles/labels + CSS focus/contrast/reduced-motion)

**Interfaces:** none new.

- [ ] **Step 1: Contrast + focus + reduced-motion CSS**

In `:root` change `--muted:#555555;` to `--muted:#9a9a9a;`. Append:
```css
:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition:none!important}}
```

- [ ] **Step 2: Landmarks + labels**

Add `role="banner"` to `#topbar`, `role="navigation"` to `#sceneBar`, `role="main"` to `#center`, `role="complementary"` to `#left` and `#right`. Add `aria-label` to every icon-only button (`✦`,`↻`,`✎`,`✕`, overlay toggles, animatic controls, export menu) describing its action.

- [ ] **Step 3: Keyboard panel move**

In the keydown handler (when a panel is selected, non-typing): `ArrowLeft`/`ArrowRight` reorder the selected panel via `mutate` + `applyStoreToUI`.

- [ ] **Step 4: Manual check**

Run: `open "index.html"` → Tab through controls (visible focus rings), screen-reader/inspect confirms icon buttons have names, arrow keys move a selected panel.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(a11y): contrast, focus rings, ARIA landmarks/labels, keyboard reorder"
```

---

### Task 20: State feedback & interaction polish

**Files:**
- Modify: `index.html` (RENDER empty/skeleton/error; CSS animations; drag placeholder; toast queue)

**Interfaces:**
- Produces: `renderEmptyState()`, `renderSkeleton(n)`, `renderErrorCard(msg, retryFn)`.

- [ ] **Step 1: Empty + skeleton + error**

Add to RENDER:
```js
function renderEmptyState(){ $('#grid').innerHTML =
  `<div class="empty-state" style="grid-column:1/-1"><div class="big">✦</div>
   <h2>No storyboard yet</h2><p>Write a scene on the left and press <b>✦ Generate</b> (or G).</p></div>`; }
function renderSkeleton(n){ $('#grid').innerHTML = Array.from({length:n}, () =>
  `<div class="panel-card"><div class="pc-canvas-wrap" style="aspect-ratio:16/9;background:linear-gradient(90deg,#111,#161616,#111);background-size:200% 100%;animation:shimmer 1.2s infinite"></div></div>`).join(''); }
function renderErrorCard(msg, retry){ $('#grid').innerHTML =
  `<div class="empty-state" style="grid-column:1/-1"><div class="big" style="color:var(--secondary)">⚠</div>
   <h2>Generation failed</h2><p>${escapeHtml(msg)}</p><button id="retryGen" class="tab-btn" style="margin-top:12px">↻ Retry</button></div>`;
  const r = $('#retryGen'); if(r && retry) r.onclick = retry; }
```
Add CSS `@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`.

- [ ] **Step 2: Use them** — call `renderSkeleton(parseInt(settings.panelCount)||8)` when generation starts; `renderErrorCard(err.message, generateStoryboard)` on failure; `renderEmptyState()` when a project has zero panels.

- [ ] **Step 3: Drag placeholder + panel enter animation**

Add CSS `.panel-card{animation:cardIn .25s ease both}@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}` and a `.drop-target{outline:2px dashed var(--accent)}` applied during dragover.

- [ ] **Step 4: Manual check**

Run: `open "index.html"` → empty project shows the empty state; starting a generation shows shimmer; a forced error shows the retry card; dragging a panel shows a dashed drop target.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(ux): empty/skeleton/error states, drag placeholder, panel animations"
```

---

### Task 21: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document new capabilities** — add an "Updates" section noting undo/redo (`Cmd/Ctrl+Z`), responsive/accessible UI, hardened API errors, the upgraded renderer, and the dev test runner usage:
```bash
node tools/test.mjs      # headless logic tests
open "index.html?test"   # in-browser test panel
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document hardening-pass changes and test runner"
```

---

### Task 22: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: All tests green**

Run: `node tools/test.mjs`
Expected: `42 passed, 0 failed`

- [ ] **Step 2: In-browser test panel**

Run: `open "index.html?test"` → green summary.

- [ ] **Step 3: Manual flow checklist** (`open "index.html"`), confirm each:
  - [ ] Sample loads on first open
  - [ ] Generate (demo, no key) produces panels
  - [ ] Regenerate a panel (demo) updates it
  - [ ] Edit panel via details → Apply persists; drag handles pose subjects
  - [ ] Delete panel → Undo toast restores it; `Cmd/Ctrl+Z`/redo work
  - [ ] Add / switch / delete scenes; sequence runtime updates
  - [ ] Overlays (thirds/center/safe/FOV) toggle on canvas
  - [ ] Animatic plays with motion; continuity check lists warnings
  - [ ] Reference-image palette updates the color bible
  - [ ] Parse-script creates scenes
  - [ ] Share link round-trips to a read-only view
  - [ ] Exports: Storyboard PDF, contact sheet PNG, call sheet PDF, CSVs, Fountain, JSON
  - [ ] Reload page → last project restored (migration safe)
  - [ ] Narrow window → responsive drawers + reflow
  - [ ] Tab navigation shows focus rings; icon buttons have names

- [ ] **Step 4: Report results honestly**, then use `superpowers:finishing-a-development-branch` to decide merge/PR for `hardening-pass`.

---

## Self-Review

**Spec coverage:**
- §4.1 remove monkey-patching → Tasks 3–4. ✓
- §4.2 single store / mutate → Task 5. ✓
- §4.3 pure-logic extraction → Tasks 1,5,6,7,8,11,12,14,15,17. ✓
- §5.1 reliability (undo, soft-delete, API, storage, bug sweep) → Tasks 9,10,11,12,13. ✓
- §5.2 UX/a11y → Tasks 18,19,20. ✓
- §5.3 canvas art (depth, pose, framing, props, lighting, texture) → Tasks 14,15,16,17. ✓
- §5.4 test harness → Task 1 (+ growth across phases). ✓
- §6 verification → Task 22. ✓
- §7 sequencing → phases match the spec order (refactor → tests → reliability → art → UX). ✓

**Placeholder scan:** No "TBD"/"handle edge cases"/"similar to Task N". Code shown for each code step. Mechanical refactor tasks reference exact function names and exact before/after patterns. ✓

**Type consistency:** `mutate(fn)`, `applyMutation(store,fn)`, `snapshot(store)`, `undo(store)/redo(store)`, `applyStoreToUI()`, `shotFraming(size)→{zoom,subjectY,cropTop}`, `poseFromAction(action)`, `propsFor(comp)`, `pixelsToPalette(samples)`, `classifyApiError(status,body)→{kind,message}`, `extractJsonObject(text)`, `migrateRecord(rec)`, `splitScriptToSegments(text)` — names are used consistently across tasks. ✓

**Note on test counts:** the running totals (5→8→11→15→19→24→30→33→36→39→42) assume tests are added cumulatively in the stated order. If executed out of order, treat "0 failed" as the gate, not the absolute count.
