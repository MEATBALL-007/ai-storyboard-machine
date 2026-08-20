#!/usr/bin/env node
// check-tokens.mjs — enforce the single source of truth for design tokens.
//
// design-system/src/tokens.css is authoritative. index.html must ship a byte-
// equivalent copy of that :root{} block, because the app has no build step and
// cannot @import across files without breaking file:// use. This script is the
// thing that keeps the copy honest: change a value in the design system and
// forget to mirror it, and the build fails here instead of silently drifting.
//
// Usage: node tools/check-tokens.mjs   (exit 0 = in sync, 1 = drifted)

import { readFileSync } from 'node:fs';

const SOURCE = 'design-system/src/tokens.css';
const TARGET = 'index.html';

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
