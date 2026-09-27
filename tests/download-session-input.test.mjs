import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const NextResponse = {
  json(body, init = {}) {
    const response = new Response(JSON.stringify(body), {
      status: init.status ?? 200,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    });
    response.cookies = { set() {} };
    return response;
  },
};

function loadRoute({ allowValid = false, existing = false, vip = false, existingVip = false } = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/app/api/download/session/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  let databaseCalls = 0;
  let insertedSession = null;
  const db = {
    from(table) {
      databaseCalls += 1;
      if (!allowValid) throw new Error('database should not be reached for invalid input');
      if (table === 'mods') return {
        select() { return this; }, eq() { return this; },
        maybeSingle: async () => ({ data: { id: 'mod-1' }, error: null }),
      };
      if (table === 'download_access_sessions') return {
        select() { return this; }, eq() { return this; }, is() { return this; },
        maybeSingle: async () => existing ? {
          data: { ready_at: new Date(Date.now() - 1000).toISOString(), expires_at: new Date(Date.now() + 60000).toISOString(), vip: existingVip }, error: null,
        } : { data: null, error: null },
        insert: async value => { insertedSession = value; return { error: null }; },
      };
      throw new Error(`unexpected table: ${table}`);
    },
  };
  new Function('require', 'exports', code)(name => {
    if (name === 'node:crypto') return { randomUUID: () => 'test-nonce' };
    if (name === 'next/server') return { NextRequest: class {}, NextResponse };
    if (name === '@/lib/download-access') return {
      createDownloadAccessToken: () => 'token',
      downloadAccessCookie: () => 'cookie',
      readDownloadAccessToken: () => existing ? { modId: 'mod-1', readyAt: Date.now() - 1000, expiresAt: Date.now() + 60000, nonce: 'existing' } : null,
      DOWNLOAD_ACCESS_TTL_SECONDS: 600,
      DOWNLOAD_WAIT_MS: 24000,
    };
    if (name === '@/lib/supabase-admin') return {
      getSupabaseAdmin: () => db,
    };
    if (name === '@/lib/vip-entitlement') return {
      getActiveVipEntitlement: async () => vip ? {
        id: 'entitlement-1', planId: 'weekly', startsAt: new Date(Date.now() - 1000).toISOString(),
        expiresAt: new Date(Date.now() + 60000).toISOString(),
      } : null,
      getUserFromBearer: async () => vip ? { id: 'vip-user' } : null,
    };
    if (name === '@/lib/server-observability') return { logServerFailure: () => {} };
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return { post: exports.POST, databaseCalls: () => databaseCalls, insertedSession: () => insertedSession };
}

function request(body, headers = {}, cookie) {
  const merged = new Headers(headers);
  return {
    nextUrl: new URL('http://localhost/api/download/session'),
    headers: merged,
    cookies: { get: () => cookie ? { value: cookie } : undefined },
    text: async () => body,
  };
}

test('download session rejects non-JSON, oversized and malformed bodies before database access', async () => {
  const api = loadRoute();
  assert.equal((await api.post(request('{}'))).status, 400);
  assert.equal((await api.post(request('x'.repeat(2049), {
    'content-type': 'application/json', 'content-length': '2049',
  }))).status, 413);
  assert.equal((await api.post(request('x'.repeat(2049), {
    'content-type': 'application/json',
  }))).status, 413);
  assert.equal((await api.post(request('{', { 'content-type': 'application/json' }))).status, 400);
  assert.equal(api.databaseCalls(), 0);
});

test('download session rejects explicit cross-site signals before database access', async () => {
  const api = loadRoute();
  const crossSiteFetch = await api.post(request('{"modId":"mod-1"}', {
    'content-type': 'application/json', 'sec-fetch-site': 'cross-site',
  }));
  assert.equal(crossSiteFetch.status, 403);
  const crossSiteOrigin = await api.post(request('{"modId":"mod-1"}', {
    'content-type': 'application/json', 'origin': 'https://attacker.example',
  }));
  assert.equal(crossSiteOrigin.status, 403);
  assert.equal(api.databaseCalls(), 0);
});

test('a valid session creates a server-side nonce ledger entry before issuing the cookie', async () => {
  process.env.DOWNLOAD_TOKEN_SECRET = 'isolated-test-secret-not-for-production-0123456789';
  const api = loadRoute({ allowValid: true });
  const response = await api.post(request('{"modId":"mod-1"}', { 'content-type': 'application/json' }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.vip, false);
  assert.equal(body.readyAt - body.serverTime, 24000);
  assert.equal(body.expiresAt - body.serverTime, 600000);
  const row = api.insertedSession();
  assert.equal(row.nonce, 'test-nonce');
  assert.equal(row.mod_id, 'mod-1');
  assert.equal(row.vip, false);
  assert.equal(Date.parse(row.ready_at), body.readyAt);
  assert.equal(Date.parse(row.expires_at), body.expiresAt);
});

test('an active browser session is reused instead of issuing duplicate wait tokens', async () => {
  const api = loadRoute({ allowValid: true, existing: true });
  const response = await api.post(request('{"modId":"mod-1"}', { 'content-type': 'application/json' }, 'existing-cookie'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.vip, false);
  assert.equal(body.readyAt < body.expiresAt, true);
  assert.equal(api.insertedSession(), null);
});

test('an active VIP entitlement replaces a stale non-VIP wait session', async () => {
  const api = loadRoute({ allowValid: true, existing: true, vip: true, existingVip: false });
  const response = await api.post(request('{"modId":"mod-1"}', { 'content-type': 'application/json' }, 'existing-cookie'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.vip, true);
  assert.equal(body.readyAt, body.serverTime);
  assert.equal(api.insertedSession().vip, true);
});

test('a revoked VIP entitlement replaces a stale no-wait session', async () => {
  const api = loadRoute({ allowValid: true, existing: true, vip: false, existingVip: true });
  const response = await api.post(request('{"modId":"mod-1"}', { 'content-type': 'application/json' }, 'existing-cookie'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.vip, false);
  assert.equal(body.readyAt - body.serverTime, 24000);
  assert.equal(api.insertedSession().vip, false);
});

test('an active VIP session is reused only while the entitlement remains active', async () => {
  const api = loadRoute({ allowValid: true, existing: true, vip: true, existingVip: true });
  const response = await api.post(request('{"modId":"mod-1"}', { 'content-type': 'application/json' }, 'existing-cookie'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.vip, true);
  assert.equal(api.insertedSession(), null);
});
