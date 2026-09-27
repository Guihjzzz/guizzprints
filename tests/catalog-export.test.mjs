import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function compile(file, imports = {}) {
  const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', source)(name => {
    if (!(name in imports)) throw new Error(`Unexpected import ${name}`);
    return imports[name];
  }, exports);
  return exports;
}
const { collectCatalogCsv, catalogCsvRows } = compile('src/lib/catalog-csv.ts');
const rows = Array.from({ length: 1205 }, (_, index) => ({
  id: `00000000-0000-0000-0000-${String(index).padStart(12, '0')}`,
  title: `Mod ${index}`, category: index % 2 ? 'skins' : 'mash-up', version: '1.0.8', created_at: '2026-09-09T15:00:00Z',
  subcategory: index % 2 ? 'Personagens' : null,
}));

function exportRoute(authorized = true) {
  const calls = [];
  const route = compile('src/app/api/admin/mods/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/admin-auth': { requireAdmin: async () => authorized ? { supabase: {
      from() {
        let after = ''; let limit = 0;
        return {
          select(columns) { calls.push(columns); return this; },
          order(column) { assert.equal(column, 'id'); return this; },
          limit(value) { limit = value; return this; },
          gt(column, value) { assert.equal(column, 'id'); after = value; return this; },
          then(resolve, reject) { return Promise.resolve({ data: rows.filter(row => row.id > after).slice(0, Math.min(limit, 137)), error: null }).then(resolve, reject); },
        };
      },
    } } : null },
    '@/lib/download-url': {}, '@/lib/mod-version': {},
  });
  return { calls, get: query => route.GET({ nextUrl: new URL(`http://localhost/api/admin/mods?export=1${query}`) }) };
}

test('Exports all 1205 records even when server caps batches, ignoring screen filters', async () => {
  const route = exportRoute();
  const progress = [];
  const result = await collectCatalogCsv(async cursor => {
    const response = await route.get(`&category=skins&q=missing&page=4&pageSize=10${cursor ? `&after=${cursor}` : ''}`);
    assert.equal(response.status, 200);
    return (await response.json()).data;
  }, count => progress.push(count), new AbortController().signal);
  assert.equal(result.count, 1205);
  const csv = result.parts.join('');
  assert.equal(csv.split('\r\n').length, 1207);
  for (let i = 0; i < 1205; i++) assert.equal(csv.split(`"Mod ${i}";`).length - 1, 1);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"09/09/2026, 12:00:00"'));
  assert.equal(progress.at(-1), 1205);
  assert.ok(csv.startsWith('\uFEFFTítulo do Mod;Categoria;Subcategoria;Versão;'));
  assert.ok(csv.includes('"Skins";"Personagens";"# v1.0.8"'));
  assert.ok(csv.includes('"Mash-up";"";"# v1.0.8"'));
  assert.ok(route.calls.every(columns => columns === 'id, title, category, subcategory, version, created_at'));
});

test('CSV escapes quotes, separators, newlines and formula-like titles', () => {
  const csv = catalogCsvRows([{ ...rows[0], title: 'Um; "mod"\nnovo', version: '# vBeta' }, { ...rows[1], title: '=1+1' }]);
  assert.ok(csv.includes('"Um; ""mod""\nnovo"'));
  assert.ok(csv.includes('"# vBeta"'));
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(catalogCsvRows([{ ...rows[0], subcategory: 'A; "B"' }]).includes('"A; ""B"""'));
});

test('Empty catalogs still have headers; errors and cancellation never return a partial file', async () => {
  const empty = await collectCatalogCsv(async () => ({ items: [], nextCursor: null }), () => {}, new AbortController().signal);
  assert.equal(empty.count, 0);
  assert.equal(empty.parts.join('').split('\r\n').length, 2);
  let calls = 0;
  await assert.rejects(collectCatalogCsv(async () => {
    if (calls++) throw new Error('Database unavailable');
    return { items: [rows[0]], nextCursor: rows[0].id };
  }, () => {}, new AbortController().signal), /Database unavailable/);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(collectCatalogCsv(async () => { throw new Error('Should not fetch'); }, () => {}, controller.signal), { name: 'AbortError' });
});

test('Export denies unauthorized requests and rejects invalid cursors', async () => {
  const denied = exportRoute(false);
  assert.equal((await denied.get('')).status, 403);
  assert.equal(denied.calls.length, 0);
  assert.equal((await exportRoute().get('&after=invalid')).status, 400);
});
