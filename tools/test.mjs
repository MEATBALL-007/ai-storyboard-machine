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

console.log(`\n${results.pass} passed, ${results.fail} failed`);
results.failures.forEach(f => console.log('  ✗ ' + f));
process.exit(results.fail ? 1 : 0);
