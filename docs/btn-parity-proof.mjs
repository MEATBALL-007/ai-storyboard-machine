/*
 * btn-parity-proof.mjs — proof harness for base-class refactors of `index.html`'s CSS.
 *
 * NOT part of the Verify command and NOT a checker to keep green. It exists so a
 * reviewer without a browser can re-run the argument a given round rests on:
 * "collapsing these elements onto a base class + modifiers does not move a single pixel."
 *
 * It builds, for every element touched by a refactor, the exact set of winning CSS
 * declarations (cascade: specificity, then source order, then the inline style=)
 * in each interaction state, from BEFORE and AFTER copies of index.html, and diffs them.
 *
 *   node docs/btn-parity-proof.mjs <refactor> <before> <after>
 *
 * <refactor> is a key of REFACTORS below — one entry per round that used this harness.
 * <before>/<after> are each either a file path or a git revision of the form
 * `<rev>:<path>`, read with `git show`. The runs recorded in SUMMARY.md were:
 *   node docs/btn-parity-proof.mjs buttons   2488f2d:index.html 9fab5c9:index.html
 *   node docs/btn-parity-proof.mjs segmented 021b966:index.html index.html
 *
 * A source may be the app (`index.html`, whose <style> block is the stylesheet) or the
 * LIBRARY (`design-system/src/styles.css`, whose stylesheet is that file plus everything
 * it @imports, spliced in at the point of the @import — see buildStylesheet). Both forms
 * take a `<rev>:` prefix. The library form exists because every case decision 7 asks about
 * is decided by SOURCE ORDER, not specificity, so reading one component file in isolation —
 * or reading several in the wrong order — would answer confidently and wrongly.
 *
 * Scope of the model (deliberately small, and honest about it):
 *   - descendant combinators only; `>` `+` `~` are reported as unsupported, not silently ignored
 *   - `::pseudo-elements` never contribute to an element's own box -> treated as non-matching
 *   - structural pseudo-classes (:last-child, :nth-*) -> reported as unsupported, non-matching
 *   - @media blocks ARE parsed and applied unconditionally, and every match is reported,
 *     so a rule hiding behind a media query cannot slip through the diff
 *   - @font-face / @keyframes are skipped
 *   - shorthands are NOT expanded to longhands: declarations are compared by property name.
 *     Sound here only because the refactor never trades a shorthand for a longhand.
 */

import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

/* Every source carries a path, and the path decides two things: how the text becomes a
 * stylesheet, and where a relative @import inside it points. So keep them apart rather
 * than passing the raw `<rev>:<path>` string around. */
function splitRef(ref) {
  if (existsSync(ref)) return { rev: null, path: ref.replace(/\\/g, '/') };
  const colon = ref.indexOf(':');
  if (colon < 0) throw new Error(`no such file: ${ref}`);
  return { rev: ref.slice(0, colon), path: ref.slice(colon + 1) };
}

function readRef({ rev, path }) {
  if (rev === null) {
    if (!existsSync(path)) throw new Error(`no such file: ${path}`);
    return readFileSync(path, 'utf8');
  }
  try {
    return execFileSync('git', ['show', `${rev}:${path}`], { encoding: 'utf8', maxBuffer: 1 << 28 });
  } catch {
    throw new Error(`git show ${rev}:${path} failed — no such path at that revision`);
  }
}

/* POSIX-style, so the same code resolves an @import against a working-tree path and
 * against a path inside a git revision (where separators are always '/'). */
function joinPath(fromPath, rel) {
  const segs = fromPath.replace(/\\/g, '/').split('/').slice(0, -1);
  for (const seg of rel.replace(/\\/g, '/').split('/')) {
    if (seg === '' || seg === '.') continue;
    else if (seg === '..') segs.pop();
    else segs.push(seg);
  }
  return segs.join('/');
}

/* Splice each @import in at the point where it appears, depth first — that is the order the
 * browser lays the rules down, and the only order in which source-order ties resolve the way
 * they really do. A missing file throws rather than being skipped: a silently short
 * stylesheet still produces a confident-looking 0-diff. `trail` doubles as the cycle guard,
 * and entries leave it on the way out, because importing one file twice down two different
 * paths is legal CSS (the rules simply appear twice) and only a true cycle is an error. */
function loadCss(ref, trail, loaded) {
  const key = `${ref.rev ?? ''}:${ref.path}`;
  if (trail.includes(key)) {
    throw new Error(`@import cycle: ${[...trail, key].map((k) => k.split(':').pop()).join(' -> ')}`);
  }
  trail.push(key);
  loaded.push(ref.path);
  const css = stripComments(readRef(ref));
  const re = /@import\s+(?:url\(\s*)?(['"])(.*?)\1\s*\)?\s*;/g;
  let out = '';
  let at = 0;
  let m;
  while ((m = re.exec(css))) {
    out += css.slice(at, m.index);
    out += loadCss({ rev: ref.rev, path: joinPath(ref.path, m[2]) }, trail, loaded);
    at = m.index + m[0].length;
  }
  out += css.slice(at);
  trail.pop();
  return out;
}

function buildStylesheet(ref) {
  if (ref.path.endsWith('.css')) {
    const loaded = [];
    return { mode: 'css', css: loadCss(ref, [], loaded), loaded, raw: null };
  }
  const raw = readRef(ref);
  return { mode: 'html', css: extractStyle(raw), loaded: [ref.path], raw };
}

/* ── the elements each refactor touches: class list before -> after ──────────────
 * `type` defaults to 'button'; give it explicitly for any subject that is not one
 * (the three segmented-control wrappers are divs). */

const TOPBAR = ['#topbar'];
const MODAL = ['.modal-bg', '.modal', '.modal-actions'];
const TOUR = ['#tourOverlay', '.tour-pop', '.tour-foot', '.tour-btns'];

const BUTTONS = [
  { name: '#undoBtn',        id: 'undoBtn',       ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: '#redoBtn',        id: 'redoBtn',       ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: 'tab SHOT LIST',   id: null,            ancestors: TOPBAR, before: ['tab-btn', 'active'], after: ['btn', 'btn--tab', 'active'] },
  { name: 'tab COLOR BIBLE', id: null,            ancestors: TOPBAR, before: ['tab-btn'],   after: ['btn', 'btn--tab'] },
  { name: '#animaticBtn',    id: 'animaticBtn',   ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: '#continuityBtn',  id: 'continuityBtn', ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: '#shareBtn',       id: 'shareBtn',      ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: '#helpBtn',        id: 'helpBtn',       ancestors: TOPBAR, before: ['icon-btn'],  after: ['btn', 'btn--icon'] },
  { name: '#collapseRight',  id: 'collapseRight', ancestors: ['#right'], inline: 'display:none',
    before: ['tab-btn'], after: ['btn', 'btn--tab'] },
  { name: '#retryGen',       id: 'retryGen',      ancestors: ['#grid', '.empty-state'], inline: 'margin-top:12px',
    before: ['tab-btn'], after: ['btn', 'btn--tab'] },
  { name: '#regenCancel',    id: 'regenCancel',   ancestors: MODAL, before: ['btn-ghost'],   after: ['btn', 'btn--ghost'] },
  { name: '#regenGo',        id: 'regenGo',       ancestors: MODAL, before: ['btn-primary'], after: ['btn', 'btn--primary'] },
  { name: '#scTour',         id: 'scTour',        ancestors: ['.modal-bg', '.modal', '.modal-wide', '.modal-actions'],
    before: ['btn-ghost'],   after: ['btn', 'btn--ghost'] },
  { name: '#scClose',        id: 'scClose',       ancestors: ['.modal-bg', '.modal', '.modal-wide', '.modal-actions'],
    before: ['btn-primary'], after: ['btn', 'btn--primary'] },
  { name: '#tourSkip',       id: 'tourSkip',      ancestors: TOUR, before: ['tour-skip'], after: ['btn', 'btn--ghost'] },
  { name: '#tourBack',       id: 'tourBack',      ancestors: TOUR, before: ['tour-back'], after: ['btn', 'btn--ghost'] },
  { name: '#tourNext',       id: 'tourNext',      ancestors: TOUR, before: ['tour-next', 'btn-primary'], after: ['btn', 'btn--primary'] },
];

/* The segmented-control refactor (2026-08-23) is the mirror image of the button one: the
 * three toggle groups keep their own class and GAIN a shared `.seg` base, so nothing is
 * renamed and the buttons' own class attributes never change — only their ancestor's do.
 * That is why these entries carry per-version ancestor chains. */

const GRID_HEADER = ['#center', '#gridView.view.on', '#gridHeader'];

/* A button inside one of the groups: its own classes are untouched, its parent gains `.seg`. */
const segBtn = (group, name, classes) => ({
  name, id: null, before: classes, after: classes,
  beforeAncestors: [...GRID_HEADER, `.${group}`],
  afterAncestors: [...GRID_HEADER, `.seg.${group}`],
});

const SEGMENTED = [
  { name: '#colToggle', type: 'div', id: 'colToggle', ancestors: GRID_HEADER,
    before: ['col-toggle'], after: ['seg', 'col-toggle'] },
  { name: '#dnToggle',  type: 'div', id: 'dnToggle',  ancestors: GRID_HEADER,
    before: ['dn-toggle'],  after: ['seg', 'dn-toggle'] },
  { name: '#ovlToggle', type: 'div', id: 'ovlToggle', ancestors: GRID_HEADER,
    before: ['ovl-toggle'], after: ['seg', 'ovl-toggle'] },

  segBtn('col-toggle', '#colToggle button',    []),
  segBtn('col-toggle', '#colToggle button.on', ['on']),
  segBtn('dn-toggle',  '#dnToggle button',     []),
  segBtn('dn-toggle',  '#dnToggle button.on',  ['on']),
  segBtn('ovl-toggle', '#ovlToggle button',    []),
  segBtn('ovl-toggle', '#ovlToggle button.on', ['on']),
];

/* The toast-action refactor (2026-08-23) moves declarations the other way round from the two
 * above: the span is built by a JS template string and carried its three declarations in an
 * inline `style=`, which is why `tools/check-tokens.mjs` never saw them (it blanks `<script>`
 * before scanning `style=` attributes). They now live in `.toast-act`, mirroring
 * `.pui-toast__action`. Hence the per-version inline: `beforeInline` -> no inline at all. */

const TOAST = [
  { name: '#toastUndo', type: 'span', id: 'toastUndo', ancestors: ['body', '#toast.on'],
    before: [], after: ['toast-act'],
    beforeInline: 'color:var(--accent);cursor:pointer;text-decoration:underline',
    afterInline: null },
];

/* The toast hit-target fix (2026-08-24) is not a refactor: no class moves and no declaration
 * is relocated — exactly one is ADDED. It is listed here so the run can show precisely that,
 * rather than the 0-diff the other keys aim for. Read the two rows together:
 *   #toast     — must be byte-identical, i.e. pointer-events:none was NOT taken off the
 *                container (doing that would make the toast swallow clicks for 5s)
 *   #toastUndo — gains pointer-events:auto and nothing else
 * The model carries no inheritance, so #toast's `none` never appears on the child's map; that
 * inheritance is the whole mechanism of the bug and is the one part this harness cannot show.
 * Markup coverage is vacuous here (no class token changes), so it proves nothing this round. */

const TOAST_HIT = [
  { name: '#toast', type: 'div', id: 'toast', ancestors: ['body'],
    before: ['on'], after: ['on'] },
  { name: '#toastUndo', type: 'span', id: 'toastUndo', ancestors: ['body', '#toast.on'],
    before: ['toast-act'], after: ['toast-act'] },
];

/* The first table whose subjects live in the LIBRARY, not the app. These are the three
 * controls named in decision 7 (README -> Open decisions): each declares nothing for
 * `:disabled:hover`, so the `:hover` rule's declarations survive onto a control that cannot
 * be clicked. Read the `:disabled:hover` rows of a run to see exactly which ones.
 *
 * Classes are identical before and after on purpose. Nothing has been decided yet, so a run
 * against today's tree is a 0-diff baseline; its job is to be re-run the moment Button.css /
 * Menu.css change, and to say precisely which declarations moved. Point it at the entry
 * point, never at one component file:
 *   node docs/btn-parity-proof.mjs ds-disabled-hover \
 *     <rev>:design-system/src/styles.css design-system/src/styles.css
 *
 * Known blind spot for the menu rows: `.pui-menu__item:last-child{border-bottom:none}` uses a
 * structural pseudo-class, which this model treats as never matching (see the header). A
 * change confined to that rule would be reported as 0 diff. */

const DS_MENU = ['body', '.pui-menu'];

const DS_DISABLED_HOVER = [
  { name: '.pui-btn--icon', ancestors: ['body'],
    before: ['pui-btn', 'pui-btn--icon'], after: ['pui-btn', 'pui-btn--icon'] },
  { name: '.pui-menu__item', ancestors: DS_MENU,
    before: ['pui-menu__item'], after: ['pui-menu__item'] },
  { name: '.pui-menu__item--danger', ancestors: DS_MENU,
    before: ['pui-menu__item', 'pui-menu__item--danger'],
    after: ['pui-menu__item', 'pui-menu__item--danger'] },
];

const REFACTORS = {
  buttons: BUTTONS,
  segmented: SEGMENTED,
  toast: TOAST,
  'toast-hit': TOAST_HIT,
  'ds-disabled-hover': DS_DISABLED_HOVER,
};

const STATES = ['', ':hover', ':disabled', ':disabled:hover', ':focus'];

/* ── CSS parsing ─────────────────────────────────────────────────────────────── */

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function matchingBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}' && --depth === 0) return i;
  }
  throw new Error('unbalanced brace at ' + open);
}

function parseDeclarations(body) {
  const out = [];
  for (const chunk of body.split(';')) {
    const c = chunk.trim();
    if (!c) continue;
    const colon = c.indexOf(':');
    if (colon < 0) continue;
    out.push({ prop: c.slice(0, colon).trim(), value: c.slice(colon + 1).trim() });
  }
  return out;
}

function parseRules(css, media, sink) {
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const close = matchingBrace(css, open);
    const prelude = css.slice(i, open).trim();
    const body = css.slice(open + 1, close);
    if (prelude.startsWith('@')) {
      if (/^@media/i.test(prelude)) parseRules(body, prelude, sink);
      // @font-face / @keyframes / @supports contribute no declarations to our elements
    } else if (prelude) {
      for (const sel of prelude.split(',')) {
        const s = sel.trim();
        if (s) sink.push({ selector: s, media, decls: parseDeclarations(body), order: sink.length });
      }
    }
    i = close + 1;
  }
}

function extractStyle(html) {
  const open = html.indexOf('<style');
  const start = html.indexOf('>', open) + 1;
  const end = html.indexOf('</style>', start);
  return stripComments(html.slice(start, end));
}

/* ── selector matching ───────────────────────────────────────────────────────── */

const STRUCTURAL = /^(nth-|first-|last-|only-|not|is|where|has)/;

function parseCompound(text) {
  const c = { type: '', id: null, classes: [], pseudos: [], pseudoElement: false, unsupported: false };
  const re = /::[\w-]+|:[\w-]+(\([^)]*\))?|\.[\w-]+|#[\w-]+|\*|[\w-]+/g;
  let m;
  while ((m = re.exec(text))) {
    const t = m[0];
    if (t.startsWith('::')) c.pseudoElement = true;
    else if (t.startsWith(':')) {
      const name = t.slice(1).replace(/\(.*/, '');
      if (STRUCTURAL.test(name)) c.unsupported = true;
      c.pseudos.push(name);
    } else if (t.startsWith('.')) c.classes.push(t.slice(1));
    else if (t.startsWith('#')) c.id = t.slice(1);
    else c.type = t;
  }
  return c;
}

function compoundMatchesElement(c, el, stateSet) {
  if (c.pseudoElement || c.unsupported) return false;
  if (c.type && c.type !== '*' && c.type !== (el.type ?? 'button')) return false;
  if (c.id && c.id !== el.id) return false;
  if (!c.classes.every((k) => el.classes.includes(k))) return false;
  if (!c.pseudos.every((p) => stateSet.has(p))) return false;
  return true;
}

function compoundMatchesAncestor(c, anc) {
  if (c.pseudoElement || c.unsupported || c.pseudos.length) return false;
  const a = parseCompound(anc);
  if (c.type && c.type !== '*' && c.type !== a.type) return false;
  if (c.id && c.id !== a.id) return false;
  return c.classes.every((k) => a.classes.includes(k));
}

function specificity(sel) {
  let a = 0, b = 0, c = 0;
  for (const part of sel.split(/\s+/)) {
    const cp = parseCompound(part);
    if (cp.id) a++;
    b += cp.classes.length + cp.pseudos.length;
    if (cp.pseudoElement) c++;
    if (cp.type && cp.type !== '*') c++;
  }
  return a * 10000 + b * 100 + c;
}

function ruleMatches(rule, el, stateSet) {
  const sel = rule.selector;
  if (/[>+~]/.test(sel)) return { matched: false, unsupported: true };
  const parts = sel.split(/\s+/);
  const subject = parseCompound(parts[parts.length - 1]);
  if (!compoundMatchesElement(subject, el, stateSet)) return { matched: false };
  let ai = el.ancestors.length - 1;
  for (let p = parts.length - 2; p >= 0; p--) {
    const cp = parseCompound(parts[p]);
    let found = false;
    while (ai >= 0) {
      const hit = compoundMatchesAncestor(cp, el.ancestors[ai]);
      ai--;
      if (hit) { found = true; break; }
    }
    if (!found) return { matched: false };
  }
  return { matched: true };
}

/* ── cascade ─────────────────────────────────────────────────────────────────── */

function computed(rules, el, state) {
  const stateSet = new Set(state.split(':').filter(Boolean));
  const hits = [];
  for (const rule of rules) {
    const r = ruleMatches(rule, el, stateSet);
    if (r.matched) hits.push(rule);
  }
  hits.sort((x, y) => specificity(x.selector) - specificity(y.selector) || x.order - y.order);
  const map = new Map();
  const from = new Map();
  for (const rule of hits) {
    for (const d of rule.decls) {
      const important = /!important$/.test(d.value);
      const prev = from.get(d.prop);
      if (prev && prev.important && !important) continue;
      map.set(d.prop, d.value);
      from.set(d.prop, { selector: rule.selector, media: rule.media, important });
    }
  }
  if (el.inline) {
    for (const d of parseDeclarations(el.inline)) {
      map.set(d.prop, d.value);
      from.set(d.prop, { selector: 'style=', media: null, important: false });
    }
  }
  return { map, from, hits };
}

/* ── run ─────────────────────────────────────────────────────────────────────── */

const [refactor, beforeRef, afterRef] = process.argv.slice(2);
if (!refactor || !beforeRef || !afterRef) {
  console.error('usage: node docs/btn-parity-proof.mjs <refactor> <before> <after>   (path or <rev>:<path>)');
  console.error(`       <refactor> is one of: ${Object.keys(REFACTORS).join(', ')}`);
  process.exit(2);
}
const ELEMENTS = REFACTORS[refactor];
if (!ELEMENTS) {
  console.error(`unknown refactor "${refactor}" — expected one of: ${Object.keys(REFACTORS).join(', ')}`);
  process.exit(2);
}

const sheets = { before: buildStylesheet(splitRef(beforeRef)), after: buildStylesheet(splitRef(afterRef)) };
if (sheets.before.mode !== sheets.after.mode) {
  console.error(`cannot compare a ${sheets.before.mode} source against a ${sheets.after.mode} one`);
  process.exit(2);
}
const versions = {};
for (const key of ['before', 'after']) {
  const rules = [];
  parseRules(sheets[key].css, null, rules);
  versions[key] = rules;
}

/* Print the assembly, in order. For a library source this IS the load-bearing claim — a run
 * that read the right files in the wrong order looks exactly like a correct one. */
if (sheets.before.loaded.join('\n') === sheets.after.loaded.join('\n')) {
  console.log(`stylesheet assembled from ${sheets.after.loaded.length} file(s), in @import order:`);
  sheets.after.loaded.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p}`));
} else {
  for (const key of ['before', 'after']) {
    console.log(`${key} stylesheet — ${sheets[key].loaded.length} file(s), in @import order:`);
    sheets[key].loaded.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p}`));
  }
}
console.log('');

/* ── phase 1: markup coverage ────────────────────────────────────────────────
 * The cascade diff below assumes each button really carries its `after` classes.
 * That assumption is only worth anything if the markup was actually rewritten, so
 * check it first: every DROPPED class token gone from the whole file (markup AND the JS
 * that builds markup from template strings), and every new class attribute present
 * exactly as many times as there are elements that should carry it.
 *
 * "Dropped" means present in `before` and absent from `after` — a token kept by the
 * refactor (`active`; every class in the segmented refactor) is not expected to vanish.
 * Elements whose class list is unchanged are skipped: there is no rewrite to verify. */

let markupErrors = 0;
const oldTokens = new Set();
for (const el of ELEMENTS) for (const c of el.before) if (!el.after.includes(c)) oldTokens.add(c);

/* A stylesheet contains no markup, so there is nothing here to check and saying "OK" would be
 * a lie. The library's markup lives in the .tsx files and its class lists are asserted by the
 * component tests, which is the reason a class-moving refactor cannot be proven from here. */
const cssMode = sheets.after.mode === 'css';
if (cssMode) {
  const moved = ELEMENTS.filter((el) => el.before.join(' ') !== el.after.join(' ') || 'beforeInline' in el);
  for (const el of moved) {
    markupErrors++;
    console.log(`✗ ${el.name} declares a class/inline change, which a stylesheet source cannot confirm`);
  }
  console.log(moved.length
    ? '\nmarkup coverage FAILED — move this element to an HTML source or drop the claim'
    : 'markup coverage N/A — the source is a stylesheet, and no element claims a class change');
}

for (const t of cssMode ? [] : [...oldTokens].sort()) {
  const n = sheets.after.raw.split(t).length - 1;
  if (n) { markupErrors++; console.log(`✗ old class token "${t}" still appears ${n}x in the after source`); }
}
/* An element that gives up its inline style must really have given it up: with the class added
 * but the `style=` left in place the cascade diff below still reads 0, because the harness takes
 * the inline text from this table rather than from the file. */
for (const el of cssMode ? [] : ELEMENTS) {
  if (!el.beforeInline || el.afterInline) continue;
  const n = sheets.after.raw.split(el.beforeInline).length - 1;
  if (n) { markupErrors++; console.log(`✗ ${el.name} still carries its old inline style ${n}x in the after source`); }
}
const wanted = new Map();
for (const el of cssMode ? [] : ELEMENTS) {
  if (el.before.join(' ') === el.after.join(' ')) continue;
  const attr = `class="${el.after.join(' ')}"`;
  wanted.set(attr, (wanted.get(attr) ?? 0) + 1);
}
for (const [attr, n] of wanted) {
  const got = sheets.after.raw.split(attr).length - 1;
  if (got !== n) { markupErrors++; console.log(`✗ expected ${n}x ${attr} in the after source, found ${got}`); }
}
if (!cssMode) {
  console.log(markupErrors
    ? `\nmarkup coverage FAILED (${markupErrors} problem(s)) — the cascade diff below is meaningless`
    : `markup coverage OK — ${oldTokens.size} old class tokens gone, ${wanted.size} new class attributes at the expected counts`);
}

let mismatches = 0;
let compared = 0;
const mediaHits = new Set();

/* An element whose selectors never match anything computes an empty declaration set in both
 * versions and therefore diffs clean — a typo in the table above reads as proof. In HTML mode
 * markup coverage catches that; in stylesheet mode there is no markup to check against, so
 * this is the only thing standing between a wrong table and a confident PASS. */
const unmatched = [];

for (const el of ELEMENTS) {
  let hitsHere = 0;
  for (const state of STATES) {
    const b = computed(versions.before, { ...el, classes: el.before, ancestors: el.beforeAncestors ?? el.ancestors,
      inline: 'beforeInline' in el ? el.beforeInline : el.inline }, state);
    const a = computed(versions.after, { ...el, classes: el.after, ancestors: el.afterAncestors ?? el.ancestors,
      inline: 'afterInline' in el ? el.afterInline : el.inline }, state);
    hitsHere += b.hits.length + a.hits.length;
    if (state === STATES[STATES.length - 1] && hitsHere === 0) unmatched.push(el.name);
    compared++;
    for (const rule of [...b.hits, ...a.hits]) if (rule.media) mediaHits.add(`${rule.media} { ${rule.selector} }`);

    const props = [...new Set([...b.map.keys(), ...a.map.keys()])].sort();
    const diffs = props.filter((p) => b.map.get(p) !== a.map.get(p));
    if (diffs.length) {
      mismatches += diffs.length;
      console.log(`\n✗ ${el.name}${state || ' (base)'}`);
      for (const p of diffs) {
        console.log(`    ${p}`);
        console.log(`      before: ${b.map.get(p) ?? '(unset)'}   <- ${b.from.get(p)?.selector ?? '-'}`);
        console.log(`      after : ${a.map.get(p) ?? '(unset)'}   <- ${a.from.get(p)?.selector ?? '-'}`);
      }
    }
  }
}

console.log(`\ncompared ${compared} (element, state) pairs across ${ELEMENTS.length} "${refactor}" elements`);
for (const name of unmatched) {
  console.log(`✗ ${name} matched no rule in either version — its row in the table is wrong, not proven`);
}
if (mediaHits.size) {
  console.log('media-conditional rules that matched a test element:');
  for (const m of mediaHits) console.log('  ' + m);
} else {
  console.log('no @media rule matched any test element');
}

if (mismatches || markupErrors || unmatched.length) {
  console.log(`\nFAIL — ${mismatches} declaration(s) differ, ${markupErrors} markup problem(s), ${unmatched.length} unmatched element(s). The refactor moves pixels; revert it.`);
  process.exit(1);
}
console.log('\nPASS — every element computes an identical declaration set before and after.');
