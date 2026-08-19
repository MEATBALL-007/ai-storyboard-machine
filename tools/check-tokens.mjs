// check-tokens.mjs — guards the one hand-copied thing in this repo.
//
// index.html must stay a single file that opens from file:// with no build step,
// so it cannot @import design-system/src/tokens.css. The `:root` block is therefore
// a manual copy. This script fails loudly the moment the copy drifts from the source.
//
// Source of truth: design-system/src/tokens.css
// Copy:            the `:root{...}` block inside <style> in index.html
//
// Usage: node tools/check-tokens.mjs   (exit 0 = in sync, exit 1 = drifted)

import fs from 'node:fs';

const SOURCE = 'design-system/src/tokens.css';
const COPY = 'index.html';

function read(rel) {
  return fs.readFileSync(new URL('../' + rel, import.meta.url), 'utf8');
}

/** Pull the body of the first `:root{ ... }` block out of a CSS or HTML file. */
function extractRootBlock(text, label) {
  const start = text.indexOf(':root');
  if (start === -1) throw new Error(`${label}: no :root block found`);
  const open = text.indexOf('{', start);
  if (open === -1) throw new Error(`${label}: :root has no opening brace`);
  const close = text.indexOf('}', open);
  if (close === -1) throw new Error(`${label}: :root block is never closed`);
  if (text.indexOf(':root', close) !== -1) {
    throw new Error(
      `${label}: more than one :root block — this checker assumes exactly one, ` +
      `so it can no longer tell which one holds the tokens`
    );
  }
  return text.slice(open + 1, close);
}

/** Parse `--name:value;` declarations into a Map, ignoring comments and whitespace. */
function parseTokens(body, label) {
  const tokens = new Map();
  for (const decl of body.replace(/\/\*[\s\S]*?\*\//g, '').split(';')) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const at = trimmed.indexOf(':');
    if (at === -1) throw new Error(`${label}: cannot parse declaration ${JSON.stringify(trimmed)}`);
    const name = trimmed.slice(0, at).trim();
    const value = trimmed.slice(at + 1).trim().replace(/\s+/g, ' ');
    if (!name.startsWith('--')) {
      throw new Error(`${label}: non-custom-property declaration in :root: ${JSON.stringify(trimmed)}`);
    }
    if (tokens.has(name)) throw new Error(`${label}: ${name} declared twice`);
    tokens.set(name, value);
  }
  if (tokens.size === 0) throw new Error(`${label}: :root block declares no tokens`);
  return tokens;
}

const source = parseTokens(extractRootBlock(read(SOURCE), SOURCE), SOURCE);
const copy = parseTokens(extractRootBlock(read(COPY), COPY), COPY);

const problems = [];
for (const [name, value] of source) {
  if (!copy.has(name)) problems.push(`missing in ${COPY}: ${name}: ${value}`);
  else if (copy.get(name) !== value) {
    problems.push(`value differs for ${name}: ${SOURCE} has "${value}", ${COPY} has "${copy.get(name)}"`);
  }
}
for (const [name, value] of copy) {
  if (!source.has(name)) problems.push(`extra in ${COPY} (not in ${SOURCE}): ${name}: ${value}`);
}

if (problems.length) {
  console.log(`\ntoken drift: ${problems.length} problem(s)`);
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log(
    `\nFix: edit tokens in ${SOURCE} only, then copy the whole :root{...} block ` +
    `over the one in ${COPY} and re-run this check.`
  );
  process.exit(1);
}

console.log(`\n${source.size} tokens in sync between ${SOURCE} and ${COPY}`);
process.exit(0);
