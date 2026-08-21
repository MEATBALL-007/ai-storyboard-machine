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
// Usage: node tools/check-tokens.mjs   (exit 0 = in sync, 1 = drifted)

import { readFileSync } from 'node:fs';

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
