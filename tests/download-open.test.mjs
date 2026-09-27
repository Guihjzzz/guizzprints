// Independent route checks: isolated database, no production calls or secrets.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { NextResponse } from 'next/server.js';
import * as access from '../src/lib/download-access.ts';
import { parseAllowedDownloadUrl } from '../src/lib/download-url.ts';

function route({ missing = false, invalid = false } = {}) {
  let increments = 0;
  let consumed = 0;
  const session = { ready_at: new Date(Date.now() - 1000).toISOString(), expires_at: new Date(Date.now() + 60000).toISOString() };
  const makeQuery = table => {
    let operation = 'select';
    const query = {
      select() { return query; },
      update() { operation = 'update'; return query; },
      eq() { return query; },
      is() { return query; },
      lte() { return query; },
      gt() { return query; },
      maybeSingle: async () => {
        if (table === 'mods') return { data: missing ? null : { terabox_url: invalid ? 'https://evil.example/file' : 'https://1024terabox.com/s/example' } };
        if (operation === 'update') {
          if (consumed) return { data: null, error: null };
          consumed = 1;
          return { data: { nonce: 'test' }, error: null };
        }
        return { data: consumed ? null : session, error: null };
      },
    };
    return query;
  };
  const db = {
    from: table => makeQuery(table),
    rpc: async () => { increments++; return {}; },
  };
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/app/api/download/open/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'next/server') return { NextResponse };
    if (name === '@/lib/download-access') return access;
    if (name === '@/lib/download-url') return { parseAllowedDownloadUrl };
    if (name === '@/lib/supabase-admin') return { getSupabaseAdmin: () => db };
    if (name === '@/lib/server-observability') return { logServerFailure: () => {} };
    throw new Error(name);
  }, exports);
  return { get: exports.GET, increments: () => increments };
}

function request({ token, check = false, headers = {} } = {}) {
  return { nextUrl: new URL(`http://localhost/api/download/open?mod=test-id${check ? '&check=1' : ''}`),
    headers: new Headers(headers),
    cookies: { get: name => name === access.downloadAccessCookie('test-id') && token ? { value: token } : undefined } };
}

test('download gate rejects absent, forged, early and expired sessions before database use', async () => {
  process.env.DOWNLOAD_TOKEN_SECRET = 'isolated-test-secret-not-for-production-0123456789';
  const now = Date.now();
  const token = overrides => access.createDownloadAccessToken({ modId: 'test-id', readyAt: now - 1000, expiresAt: now + 60000, nonce: 'test', ...overrides });
  const api = route();
  for (const [value, status] of [[undefined, 403], ['forged.invalid', 403], [token({ readyAt: now + 20000 }), 425], [token({ expiresAt: now - 1 }), 401]]) {
    assert.equal((await api.get(request({ token: value, check: true }))).status, status);
  }
  assert.equal(api.increments(), 0);
});

test('preflight validates availability without counting, consuming, or disclosing the destination', async () => {
  const token = access.createDownloadAccessToken({ modId: 'test-id', readyAt: Date.now() - 1000, expiresAt: Date.now() + 60000, nonce: 'test' });
  const api = route();
  const check = await api.get(request({ token, check: true }));
  assert.equal(check.status, 200);
  assert.deepEqual(await check.json(), { ready: true });
  assert.equal(check.headers.get('set-cookie'), null);
  assert.equal(api.increments(), 0);
  for (const options of [{ missing: true }, { invalid: true }]) assert.equal((await route(options).get(request({ token, check: true }))).status, 404);
  const open = await api.get(request({ token }));
  assert.equal(open.status, 302);
  assert.equal(open.headers.get('location'), 'https://1024terabox.com/s/example');
  assert.equal(open.headers.get('referrer-policy'), 'no-referrer');
  assert.match(open.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal(api.increments(), 1);
  assert.equal((await api.get(request({ token }))).status, 401);
  assert.equal(api.increments(), 1);
});

test('cross-site download opens are rejected before consuming the signed session', async () => {
  const token = access.createDownloadAccessToken({ modId: 'test-id', readyAt: Date.now() - 1000, expiresAt: Date.now() + 60000, nonce: 'test' });
  const api = route();
  const response = await api.get(request({ token, headers: { 'sec-fetch-site': 'cross-site' } }));
  assert.equal(response.status, 403);
  assert.equal(api.increments(), 0);
});
