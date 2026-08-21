#!/usr/bin/env node
// check-tokens.mjs — enforce the single source of truth for design tokens
// and for the typeface.
//
// design-system/src/tokens.css is authoritative. index.html must ship a byte-
// equivalent copy of that :root{} block, because the app has no build step and
// cannot @import across files without breaking file:// use. This script is the
// thing that keeps the copy honest: change a value in the design system and
// forget to mirror it, and the build fails here instead of silently drifting.
//
// The same argument applies to the font files. design-system/src/fonts/*.woff2
// are authoritative; index.html embeds them as data: URIs. Swap a .woff2 in the
// design system and forget to re-embed, and the app quietly ships the old
// outlines — so the bytes are compared here too.
//
// Finally it enforces that no stylesheet re-hardcodes a colour that already has
// a token. rgba(255,199,44,.4) and var(--accent) are the same yellow today, but
// only one of them follows when the owner changes the yellow.
//
// Usage: node tools/check-tokens.mjs   (exit 0 = in sync, 1 = drifted)

import { readFileSync, readdirSync } from 'node:fs';

const SOURCE = 'design-system/src/tokens.css';
const TARGET = 'index.html';
const FONT_SOURCE = 'design-system/src/fonts.css';

/** Pull the first :root{...} declaration block out of a CSS-ish string. */
function readRootBlock(text, label) {
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const at = stripped.indexOf(':root');
  if (at === -1) throw new Error(`${label}: no :root{} block found`);
  const open = stripped.indexOf('{', at);
  const close = stripped.indexOf('}', open);
  if (open === -1 || close === -1) throw new Error(`${label}: malformed :root{} block`);
  return stripped.slice(open + 1, close);
}

/** Map of custom-property name -> normalised value. */
function parseTokens(block) {
  const out = new Map();
  for (const decl of block.split(';')) {
    const i = decl.indexOf(':');
    if (i === -1) continue;
    const name = decl.slice(0, i).trim();
    if (!name.startsWith('--')) continue;
    out.set(name, decl.slice(i + 1).trim().replace(/\s+/g, ' ').toLowerCase());
  }
  return out;
}

/**
 * Every @font-face in a stylesheet, as { weight, file, base64 }. `file` is set
 * when the src is a relative url(), `base64` when it is a data: URI — fonts.css
 * yields the former, index.html the latter.
 */
function parseFontFaces(text, label) {
  const faces = [];
  for (const chunk of text.split('@font-face').slice(1)) {
    const body = chunk.slice(chunk.indexOf('{') + 1, chunk.indexOf('}'));
    const weight = body.match(/font-weight\s*:\s*(\d+)/)?.[1];
    if (!weight) throw new Error(`${label}: @font-face with no numeric font-weight`);
    const base64 = body.match(/url\(\s*data:font\/woff2;base64,([A-Za-z0-9+/=]+)\s*\)/)?.[1];
    const file = body.match(/url\(\s*['"]?\.\/([^'")]+\.woff2)['"]?\s*\)/)?.[1];
    faces.push({ weight, file, base64 });
  }
  return faces;
}

const source = parseTokens(readRootBlock(readFileSync(SOURCE, 'utf8'), SOURCE));
const target = parseTokens(readRootBlock(readFileSync(TARGET, 'utf8'), TARGET));

if (source.size === 0) {
  console.error(`FAIL  ${SOURCE} defines no tokens`);
  process.exit(1);
}

const errors = [];
for (const [name, value] of source) {
  if (!target.has(name)) {
    errors.push(`missing in ${TARGET}: ${name} (${SOURCE} has "${value}")`);
  } else if (target.get(name) !== value) {
    errors.push(`value drift: ${name} — ${SOURCE} has "${value}", ${TARGET} has "${target.get(name)}"`);
  }
}

const extras = [...target.keys()].filter((n) => !source.has(n));
for (const name of extras) {
  console.warn(`warn  ${TARGET} defines ${name}, which is not in ${SOURCE}`);
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL  ${e}`);
  console.error(`\n${errors.length} token(s) out of sync. Copy the :root{} block from ${SOURCE} into the <style> block of ${TARGET}.`);
  process.exit(1);
}

console.log(`tokens in sync: ${source.size}/${source.size} from ${SOURCE} present and identical in ${TARGET}`);

// --- fonts ---------------------------------------------------------------

const sourceFaces = parseFontFaces(readFileSync(FONT_SOURCE, 'utf8'), FONT_SOURCE);
const targetFaces = parseFontFaces(readFileSync(TARGET, 'utf8'), TARGET);
const fontErrors = [];

if (sourceFaces.length === 0) fontErrors.push(`${FONT_SOURCE} declares no @font-face`);

for (const { weight, file } of sourceFaces) {
  if (!file) {
    fontErrors.push(`${FONT_SOURCE}: @font-face ${weight} has no relative .woff2 url()`);
    continue;
  }
  const embedded = targetFaces.find((f) => f.weight === weight)?.base64;
  if (!embedded) {
    fontErrors.push(`missing in ${TARGET}: no @font-face weight ${weight} with a data:font/woff2 src`);
    continue;
  }
  const onDisk = readFileSync(`design-system/src/${file}`);
  if (!onDisk.equals(Buffer.from(embedded, 'base64'))) {
    fontErrors.push(`font drift: weight ${weight} embedded in ${TARGET} is not the bytes of design-system/src/${file}`);
  }
}

if (fontErrors.length) {
  for (const e of fontErrors) console.error(`FAIL  ${e}`);
  console.error(`\n${fontErrors.length} font(s) out of sync. Re-embed design-system/src/fonts/*.woff2 into the <style> block of ${TARGET} as data: URIs (see the "Design tokens" section of README.md).`);
  process.exit(1);
}

console.log(`fonts in sync: ${sourceFaces.length}/${sourceFaces.length} from ${FONT_SOURCE} embedded byte-identical in ${TARGET}`);

// --- derived-colour literals ---------------------------------------------
//
// A colour that has a token must never be written out longhand again. The
// translucent shades are the ones that tempt you, because CSS cannot add alpha
// to a hex custom property — hence the channel tokens (--accent-rgb), which
// exist precisely so rgba(var(--accent-rgb),.4) can replace rgba(255,199,44,.4).
// Leave the literal in and the app follows a re-tint while the library strands
// on the old hue, which is the "change it in one place" property inverted.
//
// Exempt: tokens.css and the :root{} block of index.html. Those two *are* the
// declaration of the palette, and the checks above already prove they agree.
// Untouched on purpose: literals with no token behind them — rgba(0,0,0,…),
// rgba(255,255,255,…), #7ac87a, #ffb4a0, #0a0a0a. Giving those a token would
// widen the design language, which is the owner's call, not this script's.

const CSS_ROOT = 'design-system/src';

/** Every .css file under `dir`, recursively. */
function cssFilesUnder(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) cssFilesUnder(full, out);
    else if (entry.name.endsWith('.css')) out.push(full);
  }
  return out;
}

/** '#abc' -> '#aabbcc'. Other lengths are only lowercased. */
function normaliseHex(hex) {
  const h = hex.toLowerCase();
  return h.length === 4 ? `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}` : h;
}

/** Replace every match with spaces, so line and column numbers still line up. */
function blankOut(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
}

// Split the palette into the two shapes a stylesheet can spell it: channel
// triples (for rgba()) and hex (for everything else).
const channelToken = new Map();
const hexToken = new Map();
for (const [name, value] of source) {
  const flat = value.replace(/\s+/g, '');
  if (/^\d{1,3},\d{1,3},\d{1,3}$/.test(flat)) channelToken.set(flat, name);
  else if (/^#[0-9a-f]{3,8}$/.test(flat)) hexToken.set(normaliseHex(flat), name);
}

const html = readFileSync(TARGET, 'utf8');
const styleMatch = html.match(/(<style[^>]*>)([\s\S]*?)<\/style>/i);
if (!styleMatch) throw new Error(`${TARGET}: no <style> block found`);

// index.html is thousands of lines long, so a line number that is relative to
// the <style> block instead of the file is worse than no line number at all.
// Count the lines above the block and add them back when reporting.
const styleLineOffset = html.slice(0, styleMatch.index + styleMatch[1].length).split('\n').length - 1;

/**
 * The CSS that lives in `style="…"` attributes, as a string the same length as
 * `text` with everything else blanked — so line numbers still point at the file.
 *
 * The <style> block is not the only CSS in index.html. Every style attribute in
 * the body is a declaration list too, and until this target existed no check
 * could see one: the export button on line 616 spells border-radius, background,
 * colour and font-weight, and was correct only because an earlier round fixed it
 * by hand. Nothing stopped `style="border-radius:3px"` being typed back in.
 *
 * <script> is blanked before the attributes are located, and that is load-bearing
 * rather than tidy. index.html builds markup from template strings, and two of
 * those strings hold colours that DO have tokens — `#111` in the shimmer
 * gradient and `#FA4616` in the self-test banner — so scanning the whole file
 * would fail the colour check on JavaScript that is doing nothing wrong.
 */
function styleAttrSource(text) {
  const markup = blankOut(
    blankOut(text, /<style[^>]*>[\s\S]*?<\/style>/gi),
    /<script[^>]*>[\s\S]*?<\/script>/gi
  );
  // Start from an all-blank copy and splice each attribute's contents back in at
  // its own offset; blankOut is length-preserving, so those offsets still hold.
  const out = markup.replace(/[^\n]/g, ' ').split('');
  for (const m of markup.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) {
    const start = m.index + m[0].indexOf('"') + 1;
    for (let k = 0; k < m[1].length; k++) out[start + k] = m[1][k];
  }
  return out.join('');
}

const scanTargets = [
  ...cssFilesUnder(CSS_ROOT)
    .filter((f) => f !== SOURCE)
    .map((f) => ({ label: f, text: readFileSync(f, 'utf8'), lineOffset: 0 })),
  { label: TARGET, text: styleMatch[2], lineOffset: styleLineOffset },
  { label: TARGET, text: styleAttrSource(html), lineOffset: 0 },
];

const literalErrors = [];
for (const { label, text, lineOffset } of scanTargets) {
  const scrubbed = blankOut(blankOut(text, /\/\*[\s\S]*?\*\//g), /:root\s*\{[^}]*\}/g);
  scrubbed.split('\n').forEach((line, i) => {
    const at = `${label}:${lineOffset + i + 1}`;
    for (const m of line.matchAll(/\brgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*[,)]/g)) {
      const token = channelToken.get(`${+m[1]},${+m[2]},${+m[3]}`);
      if (token) {
        literalErrors.push(`${at}: "${m[0]}" hardcodes ${SOURCE} ${token} — write rgba(var(${token}),<alpha>)`);
      }
    }
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const token = hexToken.get(normaliseHex(m[0]));
      if (token) {
        literalErrors.push(`${at}: "${m[0]}" hardcodes ${SOURCE} ${token} — write var(${token})`);
      }
    }
  });
}

if (literalErrors.length) {
  for (const e of literalErrors) console.error(`FAIL  ${e}`);
  console.error(`\n${literalErrors.length} hardcoded colour(s) that already have a token. Replace each with the token shown, so re-tinting ${SOURCE} moves the whole system at once.`);
  process.exit(1);
}

console.log(`no derived-colour literals: ${scanTargets.length} CSS source(s) scanned, none re-hardcode a tokenised colour`);

// --- font weights that actually exist -------------------------------------
//
// Self-hosting the typeface turned "which weights exist" from an open question
// into a closed set: whatever design-system/src/fonts/*.woff2 ships, and nothing
// else. A rule asking for a weight outside that set does not error — CSS font
// matching quietly substitutes the nearest available face, and for a *lighter*
// request it will not even synthesize one. So `font-weight:300` renders as 400
// and looks fine, which is why it survived six rounds of CSS work unnoticed.
//
// fonts.css is the inventory for both sides: the byte check above already proves
// index.html embeds exactly the weights fonts.css declares, so one list is enough.
//
// Scanned here: numeric weights plus the two keywords that resolve to numbers.
// Not scanned: @font-face blocks (those *declare* the inventory rather than draw
// on it) and the `ctx.font` strings in the canvas code, which are JavaScript and
// out of scope. Neither stylesheet uses the `font:` shorthand today; if one ever
// does, its weight will slip past this check.

const KEYWORD_WEIGHT = { normal: '400', bold: '700' };
const availableWeights = new Set(sourceFaces.map((f) => f.weight));
const weightList = [...availableWeights].sort().join(', ');
const weightErrors = [];

for (const { label, text, lineOffset } of scanTargets) {
  const scrubbed = blankOut(blankOut(text, /\/\*[\s\S]*?\*\//g), /@font-face\s*\{[^}]*\}/g);
  scrubbed.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/font-weight\s*:\s*([A-Za-z0-9]+)/g)) {
      const asked = m[1].toLowerCase();
      const weight = KEYWORD_WEIGHT[asked] ?? (/^\d+$/.test(asked) ? asked : null);
      if (weight === null) continue; // bolder/lighter/inherit — relative, nothing to check
      if (!availableWeights.has(weight)) {
        weightErrors.push(
          `${label}:${lineOffset + i + 1}: "${m[0]}" asks for a weight with no @font-face — ${FONT_SOURCE} ships ${weightList}`
        );
      }
    }
  });
}

if (weightErrors.length) {
  for (const e of weightErrors) console.error(`FAIL  ${e}`);
  console.error(`\n${weightErrors.length} font-weight(s) with no font file behind them. Either use one of the embedded weights (${weightList}), or add the missing .woff2 to design-system/src/fonts/ and fonts.css and re-embed it in ${TARGET}.`);
  process.exit(1);
}

console.log(`font weights available: ${scanTargets.length} CSS source(s) scanned, every font-weight is one of ${weightList}`);

// --- corner radii that already have a token --------------------------------
//
// Same argument as the colour check, one axis over. The radius scale was named
// in the 2026-08-21 round and every one of the 61 literals in index.html plus
// the 9 in the component CSS now points at --r-xs..--r-full — but nothing stops
// `border-radius:3px` being typed back in tomorrow, and it would look identical
// until the day the owner decides corners should be rounder. Then the app moves
// and the stray literal does not.
//
// Deliberately narrow: only the value side of a `border-*-radius` declaration is
// read. A bare `3px` elsewhere in the file is very likely padding, gap or
// font-size, and spacing is NOT tokenised on purpose (the scale is a continuum,
// not a ladder — see AUTOPILOT.md), so a file-wide \d+px sweep would produce
// hundreds of false positives. The canvas code's roundRect()/arc() radii are out
// of reach for the same reason as everything else here: scanTargets hands over
// stylesheets and style attributes, never the <script>.

const radiusToken = new Map();
for (const [name, value] of source) {
  if (name.startsWith('--r-')) radiusToken.set(value.replace(/\s+/g, ''), name);
}
if (radiusToken.size === 0) {
  console.error(`FAIL  ${SOURCE} defines no --r-* radius tokens; this check has nothing to enforce`);
  process.exit(1);
}
const radiusList = [...radiusToken].map(([v, n]) => `${v} (${n})`).join(', ');

// (?<![-\w]) keeps a custom property named --border-radius out of it: declaring a
// value is not the same as re-hardcoding one. Vendor prefixes are spelled out so
// they stay in scope rather than slipping through that same lookbehind.
const RADIUS_DECL = /(?<![-\w])((?:-webkit-|-moz-)?border-(?:[a-z]+-[a-z]+-)?radius)\s*:\s*([^;}\n]*)/gi;
const ZERO = /^0(px|rem|em|%)?$/;
const LENGTH = /^\d*\.?\d+(px|rem|em|%)$/;
const radiusErrors = [];

for (const { label, text, lineOffset } of scanTargets) {
  const scrubbed = blankOut(text, /\/\*[\s\S]*?\*\//g);
  scrubbed.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(RADIUS_DECL)) {
      const [, prop, rawValue] = m;
      const raw = rawValue.trim();
      // calc() contains its own spaces, so the split below would shred it. Rare
      // enough (zero uses today) to skip rather than half-parse.
      if (!raw || raw.includes('calc(')) continue;
      const at = `${label}:${lineOffset + i + 1}`;
      // Elliptical radii are written `<horizontal> / <vertical>`; both sides are
      // ordinary lengths, so splitting on the slash too is enough.
      for (const part of raw.toLowerCase().split(/[\s/]+/)) {
        if (!part || part.startsWith('var(')) continue;
        if (ZERO.test(part)) continue; // square corner, not a design value
        if (!LENGTH.test(part)) continue; // inherit/initial/unset and friends
        const token = radiusToken.get(part);
        radiusErrors.push(
          token
            ? `${at}: "${prop}: ${raw}" hardcodes ${SOURCE} ${token} — write var(${token})`
            : `${at}: "${prop}: ${raw}" uses ${part}, which matches no radius token — ${SOURCE} offers ${radiusList}`
        );
      }
    }
  });
}

if (radiusErrors.length) {
  for (const e of radiusErrors) console.error(`FAIL  ${e}`);
  console.error(`\n${radiusErrors.length} hardcoded corner radi${radiusErrors.length === 1 ? 'us' : 'i'}. Replace each with the token shown; if none fits, the owner has to add a token to ${SOURCE} first — inventing one here would widen the design language by stealth.`);
  process.exit(1);
}

console.log(`no radius literals: ${scanTargets.length} CSS source(s) scanned, every border-radius reads a --r-* token`);
