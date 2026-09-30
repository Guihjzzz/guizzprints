// Isolated route tests: no real account, Firebase token, or database writes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const modId = '3334cd28-7029-4ea8-a09a-64dd33a6e641';

function loadRoute({ user = { id: 'firebase-user', email: 'player@example.test' }, loadError = null, writeError = null } = {}) {
  const calls = [];
  const database = {
    from(table) {
      calls.push({ name: 'from', table });
      if (table !== 'favorites') throw new Error(`Unexpected table: ${table}`);
      return {
        select(columns) { calls.push({ name: 'select', columns }); return this; },
        eq(column, value) { calls.push({ name: 'eq', column, value }); return this; },
        order(column, options) {
          calls.push({ name: 'order', column, options });
          return Promise.resolve({ data: loadError ? null : [{ mod_id: modId }], error: loadError });
        },
        insert(rows) { calls.push({ name: 'insert', rows }); return Promise.resolve({ error: writeError }); },
        delete() { calls.push({ name: 'delete' }); return this; },
      };
    },
  };
  const source = ts.transpileModule(readFileSync('src/app/api/favorites/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', 'Buffer', source)(name => {
    if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
    if (name === '@/lib/user-auth') return { requireAuthenticatedUser: async () => user };
    if (name === '@/lib/supabase-admin') return { getSupabaseAdmin: () => database };
    if (name === '@/lib/server-observability') return { logServerFailure: (...entry) => calls.push({ name: 'log', entry }) };
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports, Buffer);
  const request = (method, body, headers = {}) => new Request('https://guizzprints.test/api/favorites', {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { calls, get: () => exports.GET(request('GET')), post: (body, headers) => exports.POST(request('POST', body, headers)) };
}

test('favorites list is limited to the verified Firebase identity and is never cached', async () => {
  const route = loadRoute();
  const response = await route.get();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.deepEqual(await response.json(), { ids: [modId] });
  assert.deepEqual(route.calls.filter(call => call.name === 'eq'), [{ name: 'eq', column: 'user_id', value: 'firebase-user' }]);
});

test('favorite insert uses only the verified account id and does not accept a client user id', async () => {
  const route = loadRoute();
  const response = await route.post({ modId, favorite: true, userId: 'another-user' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { favorited: true });
  assert.deepEqual(route.calls.find(call => call.name === 'insert').rows, [{ user_id: 'firebase-user', mod_id: modId }]);
});

test('favorite removal is scoped to the verified account and mod id', async () => {
  const route = loadRoute();
  const response = await route.post({ modId, favorite: false });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { favorited: false });
  assert.deepEqual(route.calls.filter(call => call.name === 'eq'), [
    { name: 'eq', column: 'user_id', value: 'firebase-user' },
    { name: 'eq', column: 'mod_id', value: modId },
  ]);
});

test('the endpoint rejects guests and malformed requests before touching storage', async () => {
  const guest = loadRoute({ user: null });
  assert.equal((await guest.get()).status, 401);
  assert.equal((await guest.post({ modId, favorite: true })).status, 401);
  assert.equal(guest.calls.length, 0);

  const malformed = loadRoute();
  assert.equal((await malformed.post({ modId: 'not-a-uuid', favorite: true })).status, 400);
  assert.equal((await malformed.post({ modId, favorite: 'true' })).status, 400);
  assert.equal((await malformed.post({ modId, favorite: true }, { 'content-type': 'text/plain' })).status, 400);
  assert.equal(malformed.calls.length, 0);
});

test('provider errors are logged safely and return generic errors', async () => {
  const route = loadRoute({ writeError: { code: '42501', message: 'private database message' } });
  const response = await route.post({ modId, favorite: true });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Unable to update favorites.' });
  assert.deepEqual(route.calls.find(call => call.name === 'log').entry, ['favorites', 'add', 'database']);
});
