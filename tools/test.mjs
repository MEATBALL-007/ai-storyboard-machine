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

const ctx = { console, Math, JSON, Array, Object, String, Number, structuredClone };
ctx.btoa = s => Buffer.from(s, 'binary').toString('base64');
ctx.atob = s => Buffer.from(s, 'base64').toString('binary');
vm.createContext(ctx);
vm.runInContext(extract('PURE-LOGIC') + '\n' + extract('TESTS'), ctx);
ctx.__TESTS(assert, assertEq);

// Token parity: design-system/src/tokens.css is the single source of truth for colours.
// index.html carries a verbatim copy (indented 2 extra spaces) instead of an @import,
// because the app must stay one file openable straight from file:// with no build/serve.
// Copies drift silently, so this check makes the duplication enforced rather than lucky.
const tokensCss = fs.readFileSync(new URL('../design-system/src/tokens.css', import.meta.url), 'utf8');
function rootBlock(css, where){
  const start = css.indexOf(':root{');
  if(start < 0) throw new Error('Missing :root{ block in ' + where);
  const end = css.indexOf('}', start);
  if(end < 0) throw new Error('Unterminated :root{ block in ' + where);
  return css.slice(start, end + 1).split('\n').map(l => l.replace(/\r$/, ''));
}
{
  const want = rootBlock(tokensCss, 'design-system/src/tokens.css');
  // index.html nests the block one level deeper inside <style>; strip that one level.
  const got = rootBlock(html, 'index.html').map(l => l.startsWith('  ') ? l.slice(2) : l);
  let diff = -1;
  for(let i = 0; i < Math.max(want.length, got.length); i++){ if(want[i] !== got[i]){ diff = i; break; } }
  assert(diff === -1, diff === -1 ? '' :
    `token drift at :root line ${diff + 1}\n` +
    `      tokens.css : ${JSON.stringify(want[diff])}\n` +
    `      index.html : ${JSON.stringify(got[diff])}\n` +
    `      fix: copy the :root block from design-system/src/tokens.css into index.html (README → Design tokens)`);
}

console.log(`\n${results.pass} passed, ${results.fail} failed`);
results.failures.forEach(f => console.log('  ✗ ' + f));
process.exit(results.fail ? 1 : 0);
