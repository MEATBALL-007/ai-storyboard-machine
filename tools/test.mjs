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

// Single source of truth for design tokens: design-system/src/tokens.css.
// The app inlines a copy in index.html's :root (it must stay build-free), so this
// compares the two declaration-by-declaration. Lives here, not in the marker
// sections, because the vm sandbox below has no fs.
const tokensCss = fs.readFileSync(new URL('../design-system/src/tokens.css', import.meta.url), 'utf8');
function parseRoot(css, source){
  const m = css.match(/:root\s*\{([\s\S]*?)\}/);
  if(!m) throw new Error('No :root block found in ' + source);
  return m[1].split(';')
    .map(d => d.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map(d => {
      const i = d.indexOf(':');
      if(i < 0) throw new Error('Malformed declaration in ' + source + ': ' + d);
      return [d.slice(0, i).trim(), d.slice(i + 1).trim()];
    });
}
function diffTokens(){
  const want = new Map(parseRoot(tokensCss, 'design-system/src/tokens.css'));
  const got = new Map(parseRoot(html, 'index.html'));
  const problems = [];
  for(const [name, value] of want){
    if(!got.has(name)) problems.push(`index.html :root is missing ${name}:${value}`);
    else if(got.get(name) !== value) problems.push(`${name} is ${got.get(name)} in index.html but ${value} in tokens.css`);
  }
  for(const name of got.keys()){
    if(!want.has(name)) problems.push(`index.html :root declares ${name} which tokens.css does not`);
  }
  return problems;
}

// docs/design-parity.md §7.1 option A′: the 15 translucent accents in index.html's CSS
// are written `rgba(var(--accent-rgb),α)`, so --accent-rgb has to hold exactly the
// channels of --accent. That is the one documented cost of A′ — a single color with two
// spellings and nothing in CSS to keep them equal — so it is pinned here. Checked against
// tokens.css, the declared source of truth; index.html inherits it through diffTokens().
function accentChannels(css, source){
  const root = new Map(parseRoot(css, source));
  const hex = root.get('--accent'), rgb = root.get('--accent-rgb');
  if(!hex || !rgb) throw new Error(`${source} :root must declare both --accent and --accent-rgb`);
  const m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if(!m) throw new Error(`${source}: --accent must be a 6-digit hex for this check, got ${hex}`);
  return {
    fromHex: [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)),
    fromRgb: rgb.split(',').map(n => Number(n.trim())),
  };
}

// docs/design-parity.md §7.1, the canvas half: a 2D context has no cascade, so the ten
// accent-coloured strokes and fills in the drawing code cannot use var(--accent) and have
// to be handed the value as a string. index.html reads it once at load into ACCENT /
// ACCENT_RGB. Two things can silently undo that and neither shows up as a failing render,
// so both are pinned here: an accent literal creeping back into the drawing code, and a
// getComputedStyle call moving into a draw function (it forces a style recalc, and these
// call sites re-run on every re-render — correct output, dropped frames).
// The TESTS marker section is cut out first: hexToRgb('#FFC72C') there is a fixture.
const drawingCode = html.slice(html.indexOf('</style>'))
  .replace(/\/\/ ==TESTS-START==[\s\S]*?\/\/ ==TESTS-END==/, '');

// The `||` fallbacks in the accent read are the one place the literal legitimately
// survives in JS. A stale fallback is invisible until the day it is used, so it is
// pinned to tokens.css like everything else.
function accentFallback(prop){
  const m = drawingCode.match(new RegExp("cssVar\\('" + prop + "',\\s*'([^']*)'\\)"));
  if(!m) throw new Error(`index.html must read ${prop} via cssVar('${prop}', <fallback>)`);
  return m[1];
}

// Same idea one level down, for component CSS: .chip in index.html must not drift
// from .pui-chip on the properties the two are meant to agree on. Only `cursor` is
// enforced — the rest still differs deliberately (docs/design-parity.md §2).
const chipCss = fs.readFileSync(new URL('../design-system/src/components/Chip/Chip.css', import.meta.url), 'utf8');
function ruleProp(css, selector, prop, source){
  const m = css.match(new RegExp('(?<![\\w-])' + selector.replace('.', '\\.') + '\\s*\\{([^}]*)\\}'));
  if(!m) throw new Error('No ' + selector + ' rule found in ' + source);
  const d = m[1].match(new RegExp('(?:^|;)\\s*' + prop + '\\s*:\\s*([^;]+)'));
  return d ? d[1].trim() : null;
}

// docs/design-parity.md §4: the modal CSS already matches property-for-property, so
// the only thing left to bring across from Modal.tsx is its a11y contract —
// role="dialog", aria-modal="true", and aria-labelledby pointing at the real title.
// Checked as text on both sides (this harness has no DOM), and in both directions:
// if the design system ever drops the contract, that is a failure too.
const modalTsx = fs.readFileSync(new URL('../design-system/src/components/Modal/Modal.tsx', import.meta.url), 'utf8');
function modalRegion(id, source){
  const at = source.indexOf(`id="${id}"`);
  if(at < 0) throw new Error(`No #${id} found in index.html`);
  const end = source.indexOf('<!--', at);           // markup after this modal starts with a section comment
  return source.slice(at, end < 0 ? source.length : end);
}
function dialogAttrs(id){
  const region = modalRegion(id, html);
  const box = region.match(/<div class="modal(?: [^"]*)?"([^>]*)>/);  // the .modal box, not the .modal-bg backdrop
  if(!box) throw new Error(`No .modal box inside #${id}`);
  const attrs = {};
  for(const a of box[1].matchAll(/([\w-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
  return { attrs, region };
}

const ctx = { console, Math, JSON, Array, Object, String, Number, structuredClone };
ctx.btoa = s => Buffer.from(s, 'binary').toString('base64');
ctx.atob = s => Buffer.from(s, 'base64').toString('binary');
vm.createContext(ctx);
vm.runInContext(extract('PURE-LOGIC') + '\n' + extract('TESTS'), ctx);
ctx.__TESTS(assert, assertEq);

const tokenProblems = diffTokens();
assert(tokenProblems.length === 0,
  'index.html :root is out of sync with design-system/src/tokens.css — ' +
  'copy the tokens.css :root block over it. ' + tokenProblems.join('; '));

const accent = accentChannels(tokensCss, 'design-system/src/tokens.css');
assertEq(accent.fromRgb, accent.fromHex,
  '--accent-rgb must be the channels of --accent in design-system/src/tokens.css — ' +
  'rgba(var(--accent-rgb),α) is meant to BE the accent at alpha, so if these drift the app ' +
  'renders one yellow for solid accents and a different one for every glow and tint —');

assert(!/rgba\(\s*255\s*,\s*199\s*,\s*44/.test(drawingCode),
  "index.html's drawing code still hard-codes rgba(255,199,44,α) — use accentA(α), which " +
  'is built from --accent-rgb, or changing --accent leaves the canvas painting the old yellow');
assert(!/(?:fill|stroke)Style\s*=\s*['"]#FFC72C['"]/i.test(drawingCode),
  "index.html assigns the literal '#FFC72C' to a canvas fillStyle/strokeStyle — use ACCENT");
assert((drawingCode.match(/getComputedStyle\(/g) || []).length === 1,
  'index.html must call getComputedStyle exactly once (inside cssVar); got ' +
  (drawingCode.match(/getComputedStyle\(/g) || []).length +
  ' — reading it per draw forces a style recalc every frame');
assert((drawingCode.match(/cssVar\(/g) || []).length === 2,
  'cssVar must only be called for the two top-level accent constants; got ' +
  (drawingCode.match(/cssVar\(/g) || []).length +
  ' calls — a call inside a draw function is the per-frame recalc this caches away');
assert(/const accentA = a => `rgba\(\$\{ACCENT_RGB\},\$\{a\}\)`/.test(drawingCode),
  'index.html must build translucent canvas accents from ACCENT_RGB via accentA(α)');

const tokenRoot = new Map(parseRoot(tokensCss, 'design-system/src/tokens.css'));
assertEq(accentFallback('--accent'), tokenRoot.get('--accent'),
  "the '#FFC72C' fallback in index.html's accent read vs --accent in tokens.css —");
assertEq(accentFallback('--accent-rgb'), tokenRoot.get('--accent-rgb'),
  "the '255,199,44' fallback in index.html's accent read vs --accent-rgb in tokens.css —");

const appChipCursor = ruleProp(html, '.chip', 'cursor', 'index.html');
const dsChipCursor = ruleProp(chipCss, '.pui-chip', 'cursor', 'design-system Chip.css');
assertEq(appChipCursor, dsChipCursor,
  '.chip cursor in index.html vs .pui-chip in design-system/src/components/Chip/Chip.css —');

assertEq(['role="dialog"', 'aria-modal="true"', 'aria-labelledby'].filter(a => modalTsx.includes(a)),
  ['role="dialog"', 'aria-modal="true"', 'aria-labelledby'],
  'design-system Modal.tsx must still guarantee the a11y contract #regenModal mirrors —');

const regen = dialogAttrs('regenModal');
assertEq(regen.attrs.role, 'dialog',
  '#regenModal .modal role= (Modal.tsx puts role="dialog" on the .pui-modal box, not the backdrop) —');
assertEq(regen.attrs['aria-modal'], 'true',
  '#regenModal .modal aria-modal= (Modal.tsx sets aria-modal="true") —');
assert(regen.attrs['aria-labelledby'] && regen.region.includes(`id="${regen.attrs['aria-labelledby']}"`),
  '#regenModal .modal needs aria-labelledby pointing at an id that exists inside the modal ' +
  '(Modal.tsx points it at the title element); got ' + JSON.stringify(regen.attrs['aria-labelledby'] ?? null));
assert(/e\.key === 'Escape'\s*\)\s*\{[^}]*closeRegen\(\)/.test(html),
  "index.html's global keydown handler must close #regenModal on Escape (Modal.tsx binds Escape to onClose)");

console.log(`\n${results.pass} passed, ${results.fail} failed`);
results.failures.forEach(f => console.log('  ✗ ' + f));
process.exit(results.fail ? 1 : 0);
