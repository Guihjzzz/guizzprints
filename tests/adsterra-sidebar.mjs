// Isolated test: never fetches vendor ads or generates impressions.
// Usage: node tests/adsterra-sidebar.mjs <temporary node_modules directory>
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

const slotStyles = readFileSync('src/app/[locale]/site-motion.css', 'utf8');
const placeholderSource = readFileSync('src/components/AdPlaceholder.tsx', 'utf8');
assert.match(placeholderSource, /ad-slot-shell/);
assert.match(slotStyles, /\.ad-slot-shell,[\s\S]*?\.adsterra-inline-slot\s*\{[\s\S]*?min-height:\s*92px/);
assert.match(slotStyles, /data-ad-placement="rectangle"[\s\S]*?min-height:\s*284px/);
assert.match(slotStyles, /data-ad-placement="leaderboard"[\s\S]*?min-height:\s*124px/);
assert.match(slotStyles, /data-ad-placement="download-banner"[\s\S]*?min-height:\s*94px/);
assert.match(slotStyles, /@media\s*\(max-width:\s*727px\)[\s\S]*?data-ad-placement="leaderboard"[\s\S]*?min-height:\s*92px/);

let onChange;
let listenerRemoved = false;
const media = {
  matches: false,
  addEventListener: (_event, fn) => { onChange = fn; },
  removeEventListener: (_event, fn) => { listenerRemoved = fn === onChange; },
};

let mountedScripts = [];
global.document = {
  createElement(type) {
    assert.equal(type, 'script');
    return { type, dataset: {} };
  },
};

const source = ts.transpileModule(readFileSync('src/components/AdsterraSidebar.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
assert.match(source, /text-zinc-400/, 'Advertisement labels must use the accessible muted token');
assert.match(source, /canvassanymorephotography\.com/, 'Use the Anti-Adblock-approved Adsterra script origin');
assert.doesNotMatch(source, /highrevenueformat\.com/, 'Do not regress to the pre-Anti-Adblock script origin');
const exports = {};
new Function('require', 'exports', source)(name => {
  if (name === 'react') return React;
  if (name === 'react/jsx-runtime') return require(path.join(deps, 'react/jsx-runtime'));
  if (name === 'next-intl') return { useTranslations: () => () => 'Advertisement' };
  throw new Error(name);
}, exports);

const hostMock = width => ({
  getBoundingClientRect: () => ({ width }),
  replaceChildren: (...children) => {
    mountedScripts = children;
    if (children[1]?.onload) children[1].onload();
  },
});
const createNodeMock = () => hostMock(800);

global.window = { setTimeout, clearTimeout, matchMedia: query => {
  assert.equal(query, '(min-width: 1280px)');
  return media;
} };

let tree;
await act(async () => { tree = create(React.createElement(exports.AdsterraSidebar), { createNodeMock }); });
assert.equal(tree.toJSON(), null, 'Mobile must not mount an ad host');
await act(async () => { media.matches = true; onChange(); });
const sidebarHost = tree.root.findByProps({ 'data-adsterra-key': 'd498287420805f4ce1f6cf9ee43ff613' });
assert.deepEqual(sidebarHost.props.style, { width: 160, height: 600 });
assert.equal(mountedScripts.length, 2, 'The page host receives the config and invoke scripts');
assert.match(mountedScripts[0].textContent, /window\.atOptions/);
assert.match(mountedScripts[0].textContent, /"height":600/);
assert.match(mountedScripts[1].src, /^https:\/\/canvassanymorephotography\.com\/d498287420805f4ce1f6cf9ee43ff613\/invoke\.js\?guizz_mount=\d+$/);
assert.equal(mountedScripts[1].async, false);
assert.equal(mountedScripts[1].dataset.cfasync, 'false');
assert.equal(mountedScripts[1].referrerPolicy, 'strict-origin-when-cross-origin');
assert.equal(tree.root.findAllByType('iframe').length, 0, 'React must not wrap the vendor in a nested iframe');
await act(async () => { media.matches = false; onChange(); });
assert.equal(tree.toJSON(), null);
await act(async () => tree.unmount());
assert.ok(listenerRemoved);
console.log('PASS: desktop-only direct DOM mount, exact sidebar configuration, no nested iframe and cleanup.');

let width = 350;
let resize;
let disconnected = false;
listenerRemoved = false;
media.matches = true;
global.window.matchMedia = query => {
  assert.equal(query, '(max-width: 1279px)');
  return media;
};
global.ResizeObserver = class {
  constructor(callback) { resize = callback; }
  observe() {}
  disconnect() { disconnected = true; }
};
const inlineMock = () => ({
  getBoundingClientRect: () => ({ width }),
  replaceChildren: (...children) => {
    mountedScripts = children;
    if (children[1]?.onload) children[1].onload();
  },
});

await act(async () => {
  tree = create(React.createElement(exports.AdsterraMobileBanner), { createNodeMock: inlineMock });
});
const mobileHost = tree.root.findByProps({ 'data-adsterra-key': 'e38f2eb225dc7b388c95229b924021ae' });
assert.deepEqual(mobileHost.props.style, { width: 320, height: 50 });
assert.match(mountedScripts[1].src, /e38f2eb225dc7b388c95229b924021ae\/invoke\.js(?:\?.*)?$/);
assert.match(mountedScripts[0].textContent, /"height":50/);
await act(async () => { width = 319; resize(); });
assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'e38f2eb225dc7b388c95229b924021ae' }).length, 0, 'Do not overflow narrow containers');
await act(async () => { width = 320; resize(); });
assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'e38f2eb225dc7b388c95229b924021ae' }).length, 1);
await act(async () => { media.matches = false; onChange(); });
assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'e38f2eb225dc7b388c95229b924021ae' }).length, 0, 'Do not load mobile ads on desktop');
await act(async () => tree.unmount());
assert.ok(disconnected && listenerRemoved);
console.log('PASS: mobile direct DOM key/dimensions, responsive guard, desktop suppression and cleanup.');

disconnected = false;
width = 300;
media.matches = false;
await act(async () => {
  tree = create(React.createElement(exports.AdsterraRectangleBanner), { createNodeMock: inlineMock });
});
const rectangleHost = tree.root.findByProps({ 'data-adsterra-key': 'db577e1e1923cb961ba383c563b67ca0' });
assert.deepEqual(rectangleHost.props.style, { width: 300, height: 250 });
assert.match(mountedScripts[1].src, /db577e1e1923cb961ba383c563b67ca0\/invoke\.js(?:\?.*)?$/);
assert.match(mountedScripts[0].textContent, /"height":250/);
await act(async () => { media.matches = true; onChange(); });
assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'db577e1e1923cb961ba383c563b67ca0' }).length, 1, 'Rectangle also works on mobile when it fits');
await act(async () => { width = 299; resize(); });
assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'db577e1e1923cb961ba383c563b67ca0' }).length, 0);
await act(async () => { width = 500; resize(); });
assert.equal(tree.root.findByProps({ 'data-adsterra-key': 'db577e1e1923cb961ba383c563b67ca0' }).props.style.width, 300, 'Never stretch creative to container width');
await act(async () => tree.unmount());
assert.ok(disconnected && listenerRemoved);
console.log('PASS: rectangle key/dimensions, mobile/desktop eligibility and cleanup.');

for (const format of ['download-banner', 'leaderboard']) {
  width = 800;
  media.matches = false;
  await act(async () => {
    tree = create(React.createElement(exports.AdsterraInlineBanner, { format }), { createNodeMock: inlineMock });
  });
  const expected = format === 'leaderboard'
    ? '144aab28723bcc0b9866fc7bbe23e955'
    : '31e6a10533838c0d6eb12ad0ddba95c7';
  assert.equal(tree.root.findByProps({ 'data-adsterra-key': expected }).props.style.width, format === 'leaderboard' ? 728 : 468);
  assert.match(mountedScripts[1].src, new RegExp(`${expected}/invoke\\.js(?:\\?.*)?$`));
  await act(async () => { width = 500; resize(); });
  assert.equal(tree.root.findByProps({ 'data-adsterra-size': '468x60' }).props.style.width, 468);
  await act(async () => { width = 350; resize(); });
  assert.equal(tree.root.findByProps({ 'data-adsterra-size': '320x50' }).props.style.width, 320);
  await act(async () => { width = 319; resize(); });
  assert.equal(tree.root.findAllByProps({ 'data-adsterra-key': 'e38f2eb225dc7b388c95229b924021ae' }).length, 0);
  await act(async () => tree.unmount());
}
console.log('PASS: 728/468 exact keys, responsive 468/320 fallbacks and no overflow.');
