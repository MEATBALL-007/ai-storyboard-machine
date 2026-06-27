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

console.log(`\n${results.pass} passed, ${results.fail} failed`);
results.failures.forEach(f => console.log('  ✗ ' + f));
process.exit(results.fail ? 1 : 0);
