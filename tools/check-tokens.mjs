// Enforces the single source of truth for design tokens.
//
// design-system/src/tokens.css owns the values. index.html carries a verbatim
// copy of the same :root block, because the app must stay a single file that
// opens over file:// with no build step and no @import. This check fails if
// the two ever drift, so "edit the token in one place" stays true in practice.
//
// Formatting (indentation, comments, line breaks) is ignored; only the set of
// custom properties and their values is compared.

import fs from 'node:fs';

const SOURCE = new URL('../design-system/src/tokens.css', import.meta.url);
const MIRROR = new URL('../index.html', import.meta.url);

function rootBlock(file, label){
  const text = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const m = text.match(/:root\s*\{([^}]*)\}/);
  if(!m) throw new Error(`No :root block found in ${label}`);
  return m[1];
}

function declarations(block){
  const map = new Map();
  for(const decl of block.split(';')){
    const i = decl.indexOf(':');
    if(i < 0) continue;
    const name = decl.slice(0, i).trim();
    if(!name.startsWith('--')) continue;
    map.set(name, decl.slice(i + 1).trim().replace(/\s+/g, ' '));
  }
  return map;
}

const source = declarations(rootBlock(SOURCE, 'design-system/src/tokens.css'));
const mirror = declarations(rootBlock(MIRROR, 'index.html'));

const problems = [];
for(const [name, value] of source){
  if(!mirror.has(name)) problems.push(`missing from index.html: ${name}:${value}`);
  else if(mirror.get(name) !== value)
    problems.push(`value drift: ${name} is "${value}" in tokens.css but "${mirror.get(name)}" in index.html`);
}
for(const name of mirror.keys()){
  if(!source.has(name)) problems.push(`only in index.html, not in tokens.css: ${name}`);
}

if(problems.length){
  console.log(`\n${problems.length} token mismatch(es) between design-system/src/tokens.css and index.html:`);
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log('\nFix: copy the whole :root block from design-system/src/tokens.css over the');
  console.log('one in index.html (see README, "Design tokens - single source of truth").');
  process.exit(1);
}

console.log(`tokens in sync: ${source.size} custom properties match between tokens.css and index.html`);
