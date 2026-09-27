import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

const rows = Array.from({ length: 125 }, (_, index) => ({
  id: String(index), title: `Mod ${index}`, category: index % 2 ? 'skins' : 'maps',
  version: '1.0.8', file_size: '12 MB',
  subcategory: index === 0 ? 'textures' : null,
}));

function loadRoute(authorized = true, databaseError = null) {
  const calls = [];
  const database = {
    from(table) {
      calls.push(['from', table]);
      let results = rows;
      return {
        select(columns) { calls.push(['select', columns]); return this; },
        or(expression) {
          calls.push(['or', expression]);
          const category = expression.split(',')[0].split('.').at(-1);
          results = results.filter(row => row.category === category || row.subcategory === category);
          return this;
        },
        ilike(column, pattern) {
          calls.push(['ilike', column, pattern]);
          if (column === 'category') results = results.filter(row => row.category === pattern);
          if (column === 'title') results = results.filter(row => row.title.includes(pattern.slice(1, -1)));
          return this;
        },
        order(column, options) { calls.push(['order', column, options]); return this; },
        range(from, to) { calls.push(['range', from, to]); return Promise.resolve({ data: databaseError ? null : results.slice(from, to + 1), error: databaseError }); },
        eq(_column, id) { results = results.filter(row => row.id === id); return this; },
        maybeSingle() { return Promise.resolve({ data: databaseError ? null : results[0] || null, error: databaseError }); },
      };
    },
  };
  const source = ts.transpileModule(readFileSync(path.resolve('src/app/api/admin/mods/route.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', source)(name => {
    if (name === 'next/server') return { NextResponse: Response };
    if (name === '@/lib/admin-auth') return { requireAdmin: async () => authorized ? { supabase: database } : null };
    // GET never invokes these mutation validators.
    if (name === '@/lib/download-url' || name === '@/lib/mod-version') return {};
    throw new Error(`Unexpected import: ${name}`);
  }, exports);
  return {
    calls,
    get: query => exports.GET({ nextUrl: new URL(`http://localhost/api/admin/mods${query}`) }),
    post: (body, headers = { 'content-type': 'application/json' }) => exports.POST({ headers: new Headers(headers), text: async () => body }),
  };
}

test('Catalog returns only one bounded page, with version and size and no expensive full count', async () => {
  const route = loadRoute();
  const response = await route.get('');
  const { data } = await response.json();
  assert.equal(data.items.length, 20);
  assert.equal(data.hasMore, true);
  assert.equal(data.items[0].version, '1.0.8');
  assert.equal(data.items[0].file_size, '12 MB');
  assert.equal(data.items[0].subcategory, 'textures');
  assert.ok(route.calls.find(call => call[0] === 'select')[1].includes('subcategory'));
  assert.deepEqual(route.calls.find(call => call[0] === 'range'), ['range', 0, 20]);
  assert.ok(!route.calls.find(call => call[0] === 'select')[1].includes('terabox_url'));
  assert.deepEqual(route.calls.filter(call => call[0] === 'order').map(call => call[1]), ['created_at', 'id']);
});

test('Category filter includes matching subcategories without duplicating items', async () => {
  const route = loadRoute();
  const { data } = await (await route.get('?category=textures')).json();
  assert.deepEqual(data.items.map(row => row.id), ['0']);
  assert.equal(data.items[0].category, 'maps');
  assert.equal(data.hasMore, false);
  assert.deepEqual(route.calls.find(call => call[0] === 'or'), ['or', 'category.ilike.textures,subcategory.ilike.textures']);
});

test('Category, title, page size and page offset are applied before retrieving results', async () => {
  const route = loadRoute();
  const { data } = await (await route.get('?category=skins&pageSize=10&page=2&sort=title')).json();
  assert.equal(data.items.length, 10);
  assert.ok(data.items.every(row => row.category === 'skins'));
  assert.equal(data.items[0].id, '21');
  assert.deepEqual(route.calls.find(call => call[0] === 'range'), ['range', 10, 20]);
  const search = loadRoute();
  const result = await (await search.get('?q=Mod%20124')).json();
  assert.deepEqual(result.data.items.map(row => row.id), ['124']);
  assert.equal(result.data.hasMore, false);
});

test('Last and empty pages end pagination and malformed limits cannot request the whole catalog', async () => {
  const route = loadRoute();
  assert.equal((await (await route.get('?page=7')).json()).data.items.length, 5);
  assert.equal((await (await route.get('?page=8')).json()).data.hasMore, false);
  for (const query of ['?page=0', '?page=-1', '?page=1.5', '?page=Infinity', '?pageSize=10000', '?sort=__proto__', '?category=unknown']) {
    assert.equal((await route.get(query)).status, 400, query);
  }
});

test('Auth protection and individual edit lookup remain intact', async () => {
  const denied = loadRoute(false);
  assert.equal((await denied.get('')).status, 403);
  assert.equal(denied.calls.length, 0);
  const edit = loadRoute();
  assert.equal((await (await edit.get('?id=12')).json()).data.id, '12');
  assert.equal((await edit.get('?id=missing')).status, 404);
});

test('Search treats wildcard characters literally', async () => {
  const route = loadRoute();
  await route.get('?q=100%25_pack');
  assert.deepEqual(route.calls.find(call => call[0] === 'ilike'), ['ilike', 'title', '%100\\%\\_pack%']);
});

test('Database failures return generic admin errors without exposing provider details', async () => {
  const route = loadRoute(true, { code: '42P01', message: 'private schema and connection details' });
  const response = await route.get('');
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error, 'Unable to load the admin catalog.');
  assert.doesNotMatch(JSON.stringify(body), /private schema|connection details/u);
});

test('Mutation bodies require JSON and stay bounded before parsing', async () => {
  const route = loadRoute();
  const invalidType = await route.post(JSON.stringify({ title: 'x' }), { 'content-type': 'text/plain' });
  assert.equal(invalidType.status, 400);
  assert.equal((await invalidType.json()).error, 'Invalid request body.');
  const oversized = await route.post('x'.repeat(64 * 1024 + 1));
  assert.equal(oversized.status, 400);
  assert.equal((await oversized.json()).error, 'Invalid request body.');
});
