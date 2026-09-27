// Isolated admin reconciliation checks: mocked provider/database only.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const PROVIDER_TOKEN = 'isolated-provider-token';

const NextResponse = {
  json(body, init = {}) {
    return new Response(JSON.stringify(body), {
      status: init.status ?? 200,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    });
  },
};

function loadModule(path, dependencies) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'server-only') return {};
    if (name === 'next/server') return { NextResponse };
    if (dependencies[name]) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports;
}

const webhook = loadModule('src/lib/mercadopago-webhook.ts', {
  'node:crypto': await import('node:crypto'),
});

function makeDatabase(rows) {
  const calls = [];
  const rpcCalls = [];
  const query = {
    select(columns) { calls.push(['select', columns]); return this; },
    eq(column, value) { calls.push(['eq', column, value]); return this; },
    order(column, options) { calls.push(['order', column, options]); return this; },
    limit(value) {
      calls.push(['limit', value]);
      return Promise.resolve({ data: rows.slice(0, value), error: null });
    },
  };
  return {
    from(table) {
      assert.equal(table, 'vip_orders');
      return query;
    },
    rpc: async (name, args) => {
      rpcCalls.push({ name, args });
      return { data: [{ applied: true }], error: null };
    },
    calls,
    rpcCalls,
  };
}

function loadRoute({ authorized = true, rows = [] } = {}) {
  const db = makeDatabase(rows);
  const route = loadModule('src/app/api/admin/vip/reconcile/route.ts', {
    '@/lib/admin-auth': { requireAdmin: async () => authorized ? { supabase: db } : null },
    '@/lib/mercadopago-webhook': webhook,
  });
  return { post: query => route.POST({ nextUrl: new URL(`https://www.guizz.xyz/api/admin/vip/reconcile${query}`), headers: new Headers() }), db };
}

const baseStoredOrder = {
  external_id: 'guizz-mp-live-reconcile-test',
  provider_checkout_id: 'ORDER-RECON-01',
  product_id: 'mp_monthly',
  price_cents: 2000,
  dev_mode: false,
  status: 'checkout_created',
};

function pixPayment(amount = '20.00') {
  return { transactions: { payments: [{ amount, payment_method: { id: 'pix', type: 'bank_transfer' } }] } };
}

async function withProvider(order, callback) {
  const previousToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const previousFetch = globalThis.fetch;
  process.env.MERCADOPAGO_ACCESS_TOKEN = PROVIDER_TOKEN;
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, init });
    const requestedId = String(url).split('/').at(-1);
    const responseOrder = typeof order === 'function' ? order(requestedId) : order;
    return new Response(JSON.stringify(responseOrder), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    return await callback(requests);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.MERCADOPAGO_ACCESS_TOKEN;
    else process.env.MERCADOPAGO_ACCESS_TOKEN = previousToken;
  }
}

test('reconciliation rejects unauthenticated administrators before querying or contacting Mercado Pago', async () => {
  const route = loadRoute({ authorized: false, rows: [baseStoredOrder] });
  const { response, requests } = await withProvider({}, async requests => ({ response: await route.post(''), requests }));
  assert.equal(response.status, 403);
  assert.equal(route.db.calls.length, 0);
  assert.equal(requests.length, 0);
});

test('reconciliation rejects a requested batch over the hard limit of 20', async () => {
  const route = loadRoute({ rows: [baseStoredOrder] });
  const { response, requests } = await withProvider({}, async requests => ({ response: await route.post('?limit=21'), requests }));
  assert.equal(response.status, 400);
  assert.equal(route.db.calls.length, 0);
  assert.equal(requests.length, 0);
});

test('matching PAID Order is applied through the entitlement RPC and never returns the provider token', async () => {
  const route = loadRoute({ rows: [baseStoredOrder] });
  const response = await withProvider({
    id: 'ORDER-RECON-01',
    external_reference: 'guizz-mp-live-reconcile-test',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, async requests => {
    const result = await route.post('');
    assert.equal(requests.length, 1);
    assert.equal(requests[0].init.headers.Authorization, `Bearer ${PROVIDER_TOKEN}`);
    return result;
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, {
    ok: true, scanned: 1, reconciled: 1, skipped: 0, failed: 0,
    skippedReasons: {}, failedReasons: {},
  });
  assert.equal(route.db.rpcCalls.length, 1);
  assert.equal(route.db.rpcCalls[0].name, 'apply_vip_payment_checked');
  assert.equal(route.db.rpcCalls[0].args.p_status, 'PAID');
  assert.equal(JSON.stringify(body).includes(PROVIDER_TOKEN), false);
});

test('mismatched provider bindings never reach the RPC', async () => {
  const rows = [
    baseStoredOrder,
    { ...baseStoredOrder, external_id: 'guizz-mp-live-reconcile-test-2', provider_checkout_id: 'ORDER-RECON-02' },
    { ...baseStoredOrder, external_id: 'guizz-mp-live-reconcile-test-3', provider_checkout_id: 'ORDER-RECON-03' },
  ];
  const route = loadRoute({ rows });
  const response = await withProvider({
    id: 'ORDER-RECON-01',
    external_reference: 'wrong-external-reference',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
  }, async () => route.post(''));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.reconciled, 0);
  assert.equal(body.skipped, 3);
  assert.equal(route.db.rpcCalls.length, 0);
  assert.equal(body.skippedReasons.external_reference_mismatch, 1);
  assert.equal(body.skippedReasons.provider_id_mismatch, 2);
});

test('PAID reconciliation requires total_paid_amount to match both total and stored price', async () => {
  const rows = [
    baseStoredOrder,
    { ...baseStoredOrder, external_id: 'guizz-mp-live-reconcile-test-2', provider_checkout_id: 'ORDER-RECON-02' },
  ];
  const route = loadRoute({ rows });
  const response = await withProvider(providerId => providerId.endsWith('01') ? {
    id: 'ORDER-RECON-01', external_reference: 'guizz-mp-live-reconcile-test',
    total_amount: '20.00', status: 'processed', status_detail: 'accredited', ...pixPayment(),
  } : {
    id: 'ORDER-RECON-02', external_reference: 'guizz-mp-live-reconcile-test-2',
    total_amount: '20.00', total_paid_amount: '19.99', status: 'processed', status_detail: 'accredited', ...pixPayment(),
  }, async () => route.post(''));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.reconciled, 0);
  assert.equal(body.skipped, 2);
  assert.equal(body.skippedReasons.invalid_amount, 1);
  assert.equal(body.skippedReasons.amount_mismatch, 1);
  assert.equal(route.db.rpcCalls.length, 0);
});

test('a non-PIX accredited Order is skipped before the entitlement RPC', async () => {
  const route = loadRoute({ rows: [baseStoredOrder] });
  const response = await withProvider({
    id: 'ORDER-RECON-01',
    external_reference: 'guizz-mp-live-reconcile-test',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    transactions: { payments: [{ amount: '20.00', payment_method: { id: 'visa', type: 'credit_card' } }] },
  }, async () => route.post(''));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.reconciled, 0);
  assert.equal(body.skippedReasons.payment_method_mismatch, 1);
  assert.equal(route.db.rpcCalls.length, 0);
});

test('the provider lookup is capped at 20 rows per call', async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    ...baseStoredOrder,
    external_id: `guizz-mp-live-reconcile-test-${index}`,
    provider_checkout_id: `ORDER-RECON-${index}`,
  }));
  const route = loadRoute({ rows });
  const response = await withProvider({
    id: 'ORDER-RECON-0',
    external_reference: 'not-the-row-reference',
    total_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, async requests => {
    const result = await route.post('');
    assert.equal(requests.length, 20);
    return result;
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).scanned, 20);
  assert.deepEqual(route.db.calls.find(call => call[0] === 'limit'), ['limit', 20]);
  assert.equal(route.db.rpcCalls.length, 0);
});
