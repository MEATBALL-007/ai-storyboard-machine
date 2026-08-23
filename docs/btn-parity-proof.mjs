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

function readSource(ref) {
  if (existsSync(ref)) return readFileSync(ref, 'utf8');
  if (!ref.includes(':')) throw new Error(`no such file: ${ref}`);
  return execFileSync('git', ['show', ref], { encoding: 'utf8', maxBuffer: 1 << 28 });
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

const REFACTORS = {
  buttons: BUTTONS,
  segmented: SEGMENTED,
  toast: TOAST,
  'toast-hit': TOAST_HIT,
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

const sources = { before: readSource(beforeRef), after: readSource(afterRef) };
const versions = {};
for (const key of ['before', 'after']) {
  const rules = [];
  parseRules(extractStyle(sources[key]), null, rules);
  versions[key] = rules;
}

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
for (const t of [...oldTokens].sort()) {
  const n = sources.after.split(t).length - 1;
  if (n) { markupErrors++; console.log(`✗ old class token "${t}" still appears ${n}x in the after source`); }
}
/* An element that gives up its inline style must really have given it up: with the class added
 * but the `style=` left in place the cascade diff below still reads 0, because the harness takes
 * the inline text from this table rather than from the file. */
for (const el of ELEMENTS) {
  if (!el.beforeInline || el.afterInline) continue;
  const n = sources.after.split(el.beforeInline).length - 1;
  if (n) { markupErrors++; console.log(`✗ ${el.name} still carries its old inline style ${n}x in the after source`); }
}
const wanted = new Map();
for (const el of ELEMENTS) {
  if (el.before.join(' ') === el.after.join(' ')) continue;
  const attr = `class="${el.after.join(' ')}"`;
  wanted.set(attr, (wanted.get(attr) ?? 0) + 1);
}
for (const [attr, n] of wanted) {
  const got = sources.after.split(attr).length - 1;
  if (got !== n) { markupErrors++; console.log(`✗ expected ${n}x ${attr} in the after source, found ${got}`); }
}
console.log(markupErrors
  ? `\nmarkup coverage FAILED (${markupErrors} problem(s)) — the cascade diff below is meaningless`
  : `markup coverage OK — ${oldTokens.size} old class tokens gone, ${wanted.size} new class attributes at the expected counts`);

let mismatches = 0;
let compared = 0;
const mediaHits = new Set();

for (const el of ELEMENTS) {
  for (const state of STATES) {
    const b = computed(versions.before, { ...el, classes: el.before, ancestors: el.beforeAncestors ?? el.ancestors,
      inline: 'beforeInline' in el ? el.beforeInline : el.inline }, state);
    const a = computed(versions.after, { ...el, classes: el.after, ancestors: el.afterAncestors ?? el.ancestors,
      inline: 'afterInline' in el ? el.afterInline : el.inline }, state);
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
if (mediaHits.size) {
  console.log('media-conditional rules that matched a test element:');
  for (const m of mediaHits) console.log('  ' + m);
} else {
  console.log('no @media rule matched any test element');
}

if (mismatches || markupErrors) {
  console.log(`\nFAIL — ${mismatches} declaration(s) differ, ${markupErrors} markup problem(s). The refactor moves pixels; revert it.`);
  process.exit(1);
}
console.log('\nPASS — every element computes an identical declaration set before and after.');
