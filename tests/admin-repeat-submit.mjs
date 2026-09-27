// Isolated component test: no real account, API or database is used.
// Usage: node tests/admin-repeat-submit.mjs <temporary node_modules directory>
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createRequire } from 'node:module';
const loadDependency = createRequire(import.meta.url);
const deps = process.argv[2];
const React = loadDependency(path.join(deps, 'react'));
const { create, act } = loadDependency(path.join(deps, 'react-test-renderer'));
global.IS_REACT_ACT_ENVIRONMENT = true;
global.window = { setTimeout, clearTimeout, confirm: () => true };
const router = { replace() {} };
const posts = [];
const catalogRequests = [];
let catalog = Array.from({ length: 41 }, (_, index) => ({ id: String(index), title: `Mod ${index}`, category: index % 2 ? 'skins' : 'maps', subcategory: index === 0 ? 'textures' : null, version: '1.0.8', file_size: '12 MB', downloads: index, rating: 4, created_at: '2026-09-09' }));
let delayMaps = false;
let releaseMaps;
let failNext = false;
global.fetch = async (_url, options) => {
  const params = new URL(_url, 'http://localhost').searchParams;
  if (options.method === 'DELETE') catalog = catalog.filter(row => row.id !== params.get('id'));
  if (options.method === 'POST') {
    if (failNext) {
      failNext = false;
      return { ok: false, status: 400, json: async () => ({ error: 'Test rejection' }) };
    }
    posts.push(JSON.parse(options.body));
  }
  let rows = catalog;
  if (!options.method) catalogRequests.push(params);
  if (params.get('category') && params.get('category') !== 'all') rows = rows.filter(row => row.category === params.get('category') || row.subcategory === params.get('category'));
  if (params.get('q')) rows = rows.filter(row => row.title.includes(params.get('q')));
  const page = Number(params.get('page') || 1);
  const pageSize = Number(params.get('pageSize') || 20);
  const from = (page - 1) * pageSize;
  const response = { ok: true, status: 200, json: async () => ({ data: { items: rows.slice(from, from + pageSize), hasMore: rows.length > from + pageSize, page } }) };
  if (delayMaps && params.get('category') === 'maps') {
    return new Promise(resolve => { releaseMaps = () => resolve(response); });
  }
  return response;
};
function compile(file) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function('require', 'module', 'exports', source)((name) => {
    if (name === 'react') return React;
    if (name === 'react/jsx-runtime') return loadDependency(path.join(deps, 'react/jsx-runtime'));
    if (name === '@/lib/supabase') return { supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'test-only' } } }) } } };
    if (name === '@/lib/mod-version') return compile(path.resolve('src/lib/mod-version.ts'));
    if (name === '@/lib/catalog-csv') return compile(path.resolve('src/lib/catalog-csv.ts'));
    if (name === 'next/navigation') return { useRouter: () => router, useParams: () => ({ locale: 'en' }) };
    if (name === 'next/link') return { __esModule: true, default: 'a' };
    if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
    throw new Error(`Unexpected dependency: ${name}`);
  }, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
(async () => {
  const Page = compile(path.resolve('src/app/[locale]/upload/page.tsx')).default;
  let tree;
  await act(async () => { tree = create(React.createElement(Page)); });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 25)); });
  const buttons = () => tree.root.findAllByType('button');
  const text = (node) => typeof node === 'string' ? node : (node.children || []).map(text).join('');
  const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 25)); });
  const click = async label => {
    await act(async () => { buttons().find(button => text(button) === label).props.onClick(); });
    await settle();
  };
  const choose = async (label, value) => {
    await act(async () => { tree.root.findAllByType('select').find(select => select.props['aria-label'] === label).props.onChange({ target: { value } }); });
    await settle();
  };
  const rowCount = () => tree.root.findByType('tbody').findAllByType('tr').length;
  assert.equal(rowCount(), 20);
  assert.ok(text(tree.root).includes('# v1.0.8'));
  assert.ok(text(tree.root).includes('12 MB'));
  const firstRows = tree.root.findByType('tbody').findAllByType('tr');
  assert.equal(text(firstRows[0]).split('Subcategoria: Textures').length - 1, 2, 'Subcategory is rendered in desktop and mobile layouts');
  assert.ok(!text(firstRows[1]).includes('Subcategoria:'), 'Empty subcategory does not render a label');
  await choose('Categoria do catálogo', 'textures');
  assert.equal(rowCount(), 1);
  assert.ok(text(tree.root.findByType('tbody')).includes('Mod 0'));
  await click('Limpar filtros');
  await click('Próxima');
  assert.equal(catalogRequests.at(-1).get('page'), '2');
  await choose('Categoria do catálogo', 'skins');
  assert.equal(catalogRequests.at(-1).get('page'), '1');
  assert.equal(rowCount(), 20);
  await choose('Itens por página', '10');
  assert.equal(rowCount(), 10);
  await choose('Ordenar catálogo', 'title');
  assert.equal(catalogRequests.at(-1).get('sort'), 'title');
  const requestsBeforeTyping = catalogRequests.length;
  await act(async () => { tree.root.findByType('input').props.onChange({ target: { value: 'Mod 39' } }); });
  assert.equal(catalogRequests.length, requestsBeforeTyping);
  await act(async () => { tree.root.findByType('form').props.onSubmit({ preventDefault() {} }); });
  await settle();
  assert.equal(rowCount(), 1);
  assert.equal(catalogRequests.at(-1).get('q'), 'Mod 39');
  await click('Limpar filtros');
  delayMaps = true;
  await choose('Categoria do catálogo', 'maps');
  await choose('Categoria do catálogo', 'skins');
  await act(async () => { releaseMaps(); });
  assert.ok(tree.root.findByType('tbody').findAllByType('tr').every(row => text(row).includes('skins')));
  delayMaps = false;
  await click('Limpar filtros');
  await click('Próxima');
  await click('Próxima');
  assert.equal(rowCount(), 1);
  await act(async () => { await buttons().find(button => button.props.title === 'Excluir').props.onClick(); });
  await settle();
  assert.equal(catalogRequests.at(-1).get('page'), '2');
  assert.equal(rowCount(), 20);
  const beforePublishing = catalogRequests.length;
  await act(async () => { buttons().find(b => text(b).includes('Publicar')).props.onClick(); });
  await act(async () => { buttons().find(b => text(b).includes('Mash-up')).props.onClick(); });
  const change = async (name, value) => act(async () => {
    tree.root.findAllByType('input').find(input => input.props.name === name).props.onChange({ target: { name, value } });
  });
  const submit = async () => act(async () => tree.root.findByType('form').props.onSubmit({ preventDefault() {} }));
  const input = name => tree.root.findAllByType('input').find(i => i.props.name === name).props.value;
  for (const title of ['First', 'Second']) {
    await change('title', title);
    await change('terabox_url', 'https://1024terabox.com/s/test');
    await change('version', '1.0.8-beta');
    await submit();
    assert.equal(input('title'), '');
    assert.equal(tree.root.findByType('fieldset').props.disabled, false);
  }
  assert.deepEqual(posts.map(p => p.title), ['First', 'Second']);
  assert.ok(posts.every(p => p.version === '1.0.8-beta' && p.category === 'mash-up'));
  await change('title', 'Retry');
  await change('terabox_url', 'https://1024terabox.com/s/test');
  failNext = true;
  await submit();
  assert.equal(input('title'), 'Retry');
  assert.equal(tree.root.findByType('fieldset').props.disabled, false);
  await submit();
  assert.equal(posts.length, 3);
  assert.equal(catalogRequests.length, beforePublishing, 'Hidden catalog must not refetch after publishing');
  await act(async () => tree.unmount());
  console.log('PASS: pagination, filters, search on submit, stale-response rejection, last-row deletion, version/size, consecutive publishing and no hidden catalog fetches.');
})().catch(error => { console.error(error); process.exitCode = 1; });
