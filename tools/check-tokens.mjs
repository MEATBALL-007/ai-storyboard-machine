/**
 * check-tokens.mjs — enforce that the app's design tokens really do have a single source.
 *
 * `design-system/src/tokens.css` is the source of truth. `index.html` cannot import it
 * (the app is deliberately one self-contained file with no build step), so it carries an
 * inlined copy inside its `<style>` block. This script proves the copy has not drifted.
 *
 * Exits 1 on any missing or divergent token. No dependencies — plain node.
 */
import fs from 'node:fs';

const tokensPath = new URL('../design-system/src/tokens.css', import.meta.url);
const htmlPath = new URL('../index.html', import.meta.url);

// Drop CSS comments first: index.html documents its token block in prose that itself
// mentions ":root{}", and without this the parser locks onto the comment and sees no tokens.
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Pull the first `:root{ ... }` declaration block out of a stylesheet-ish string. */
function rootBlock(source, label) {
  const m = stripComments(source).match(/:root\s*\{([^}]*)\}/);
  if (!m) throw new Error(`No :root{} block found in ${label}`);
  return m[1];
}

/** Parse `--name:value;` pairs into a Map, preserving declaration order. */
function parseTokens(block) {
  const out = new Map();
  for (const decl of block.split(';')) {
    const m = decl.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
    if (m) out.set(m[1], m[2]);
  }
  return out;
}

/**
 * Compare values the way a browser would: hex case is irrelevant and runs of
 * whitespace inside a font stack are irrelevant. Everything else must match exactly,
 * so a genuine value change is always caught.
 */
function normalize(value) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

const tokensCss = fs.readFileSync(tokensPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error('No <style> block found in index.html');

const source = parseTokens(rootBlock(tokensCss, 'design-system/src/tokens.css'));
const app = parseTokens(rootBlock(styleMatch[1], 'index.html <style>'));

// An empty parse on either side means the regex lost its grip, not that everything matches.
if (source.size === 0) throw new Error('design-system/src/tokens.css declares no tokens');
if (app.size === 0) throw new Error('index.html declares no tokens in its :root{} block');

const problems = [];
for (const [name, value] of source) {
  if (!app.has(name)) {
    problems.push(`missing in index.html: ${name} (source: ${value})`);
  } else if (normalize(app.get(name)) !== normalize(value)) {
    problems.push(`drifted: ${name}\n      tokens.css: ${value}\n      index.html: ${app.get(name)}`);
  }
}

// Tokens the app defines beyond the shared set are allowed, but worth surfacing:
// each one is a candidate for promotion into tokens.css.
const appOnly = [...app.keys()].filter(name => !source.has(name));

if (problems.length) {
  console.log(`\n✗ ${problems.length} token problem(s) — index.html has drifted from design-system/src/tokens.css`);
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log('\n  Fix: copy the :root{} block from design-system/src/tokens.css into the <style> block of index.html.');
  process.exit(1);
}

console.log(`${source.size} tokens in sync (design-system/src/tokens.css → index.html)`);
if (appOnly.length) {
  console.log(`  note: ${appOnly.length} app-only token(s) not in the design system: ${appOnly.join(', ')}`);
}
process.exit(0);
