import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function loadRoute(entitlement) {
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/app/api/vip/status/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'next/server') return { NextResponse };
    if (name === '@/lib/vip-entitlement') return { getRequestVipEntitlement: async () => entitlement };
    if (name === '@/lib/server-observability') return { logServerFailure: () => {} };
    throw new Error(name);
  }, exports);
  return exports.GET;
}

const NextResponse = {
  json(body, init = {}) {
    return new Response(JSON.stringify(body), {
      status: init.status ?? 200,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    });
  },
};

test('VIP status fails closed and does not expose entitlement details to anonymous callers', async () => {
  const response = await loadRoute(null)({ headers: new Headers() });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { vip: false });
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
});

test('VIP status returns only the active plan and expiry', async () => {
  const response = await loadRoute({ id: 'internal-id', planId: 'monthly', startsAt: '2026-09-16T00:00:00.000Z', expiresAt: '2026-10-16T00:00:00.000Z' })({ headers: new Headers() });
  assert.deepEqual(await response.json(), { vip: true, planId: 'monthly', expiresAt: '2026-10-16T00:00:00.000Z' });
});
