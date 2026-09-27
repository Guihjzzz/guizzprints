// Isolated route lifecycle test, no browser/ad/network dependencies.
// node tests/site-motion.mjs <temporary react-test-renderer node_modules>
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const deps = process.argv[2];
const React = require(path.join(deps, 'react'));
const { create, act } = require(path.join(deps, 'react-test-renderer'));
global.IS_REACT_ACT_ENVIRONMENT = true;
let pathname = '/en';
let animations = 0, cancellations = 0;
const listeners = new Set();
const preference = {
  matches: false,
  addEventListener: (_event, handler) => listeners.add(handler),
  removeEventListener: (_event, handler) => listeners.delete(handler),
};
const main = { animate: (frames, options) => {
  animations++;
  assert.deepEqual(frames, [{ opacity: 0.96 }, { opacity: 1 }]);
  assert.equal(options.duration, 220);
  assert.equal(options.fill, undefined, 'No retained compositor style after animation');
  return { cancel: () => { cancellations++; } };
}};
global.window = { matchMedia: () => preference };
global.document = { querySelector: () => main };
const compiled = {};
const code = ts.transpileModule(readFileSync('src/components/SiteMotion.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
new Function('require', 'exports', code)(name => {
  if (name === 'react') return React;
  if (name === 'next/navigation') return { usePathname: () => pathname };
  throw Error(name);
}, compiled);
let tree;
await act(async () => { tree = create(React.createElement(compiled.SiteMotion)); });
assert.equal(tree.toJSON(), null, 'No content wrapper, cloning or key remount');
assert.equal(animations, 0, 'SSR/hydration initially visible and unanimated');
async function navigate(next) {
  pathname = next;
  await act(async () => tree.update(React.createElement(compiled.SiteMotion)));
}
await navigate('/en/search');
assert.equal(animations, 1);
await navigate('/en/search');
assert.equal(animations, 1, 'Same route state updates do not replay');
await navigate('/en/category/maps');
assert.equal(animations, 2);
assert.equal(cancellations, 1, 'Rapid navigation cancels previous effect');
assert.equal(listeners.size, 1);
preference.matches = true;
listeners.forEach(listener => listener());
assert.equal(cancellations, 2, 'Runtime reduced motion cancels active animation');
await navigate('/en/vip');
assert.equal(animations, 2, 'Reduced motion prevents future animations');
assert.equal(listeners.size, 0);
preference.matches = false;
main.animate = undefined;
await navigate('/en/settings');
assert.equal(animations, 2, 'Browsers without WAAPI keep visible content');
await act(async () => tree.unmount());
assert.equal(listeners.size, 0);
console.log('PASS site motion: SSR visibility, route cleanup, reduced motion, WAAPI fallback');
