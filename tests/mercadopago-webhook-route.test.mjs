// Isolated webhook-route checks: mocked provider/database, no production calls.
import assert from 'node:assert/strict';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const WEBHOOK_SECRET = 'isolated-webhook-secret';
const PROVIDER_TOKEN = 'isolated-provider-token';

const NextResponse = {
  json(body, init = {}) {
    return new Response(JSON.stringify(body), {
      status: init.status ?? 200,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    });
  },
};

function loadWebhook() {
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/lib/mercadopago-webhook.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'server-only') return {};
    if (name === 'node:crypto') return { createHash, createHmac, timingSafeEqual };
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports;
}

const webhook = loadWebhook();

function loadRoute(db) {
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/app/api/vip/webhook/mercadopago/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'next/server') return { NextResponse };
    if (name === '@/lib/supabase-admin') return { getSupabaseAdmin: () => db };
    if (name === '@/lib/mercadopago-webhook') return webhook;
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports.POST;
}

function database(storedOrder) {
  const eventUpdates = [];
  const rpcCalls = [];
  const eventTable = {
    insert: async () => ({ error: null }),
    update(values) { eventUpdates.push(values); return this; },
    select() { return this; },
    eq() { return this; },
    maybeSingle: async () => ({ data: null }),
  };
  const orderTable = {
    select() { return this; },
    eq() { return this; },
    maybeSingle: async () => ({ data: storedOrder, error: null }),
  };
  return {
    from(table) {
      if (table === 'vip_webhook_events') return eventTable;
      if (table === 'vip_orders') return orderTable;
      throw new Error(`Unexpected table: ${table}`);
    },
    rpc: async (name, args) => { rpcCalls.push({ name, args }); return { error: null }; },
    eventUpdates,
    rpcCalls,
  };
}

function request(orderId, payloadOrder, extraHeaders = {}) {
  const requestId = 'request-route-test';
  const timestamp = String(Date.now());
  const payload = {
    id: 'event-route-test',
    type: 'order',
    action: 'order.processed',
    live_mode: false,
    data: { id: orderId },
  };
  const manifest = `id:${orderId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
  const signature = createHmac('sha256', WEBHOOK_SECRET).update(manifest).digest('hex');
  return {
    headers: new Headers({ 'x-request-id': requestId, 'x-signature': `ts=${timestamp},v1=${signature}`, ...extraHeaders }),
    nextUrl: new URL(`https://www.guizz.xyz/api/vip/webhook/mercadopago?data.id=${encodeURIComponent(orderId)}`),
    text: async () => JSON.stringify({ ...payload, ...(payloadOrder ? { data: { ...payload.data, ...payloadOrder } } : {}) }),
  };
}

test('a declared oversized webhook is rejected before provider or database work', async () => {
  const db = database(storedOrder);
  const response = await loadRoute(db)(request('ORDROUTE-LARGE', null, {
    'content-length': String(256 * 1024 + 1),
  }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: 'payload_too_large' });
  assert.equal(db.rpcCalls.length, 0);
});

function pixPayment(amount = '20.00') {
  return { transactions: { payments: [{ amount, payment_method: { id: 'pix', type: 'bank_transfer' } }] } };
}

async function invoke(order, storedOrder, payloadOrder) {
  process.env.MERCADOPAGO_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.MERCADOPAGO_ACCESS_TOKEN = PROVIDER_TOKEN;
  const db = database(storedOrder);
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(order), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  try {
    const response = await loadRoute(db)(request(String(order.id), payloadOrder));
    return { response, db };
  } finally {
    globalThis.fetch = previousFetch;
  }
}

const storedOrder = {
  id: 'stored-order-route-test',
  product_id: 'prod-route-test',
  price_cents: 2000,
  dev_mode: true,
};

test('an accredited Order without total_paid_amount cannot apply VIP', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE01',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, storedOrder);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(db.rpcCalls.length, 0);
  assert.equal(db.eventUpdates.at(-1).last_error, 'invalid_amount');
});

test('an accredited Order with a divergent settled amount cannot apply VIP', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE02',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    total_paid_amount: '19.99',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, storedOrder);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(db.rpcCalls.length, 0);
  assert.equal(db.eventUpdates.at(-1).last_error, 'amount_mismatch');
});

test('an accredited Order with matching total_paid_amount reaches the entitlement RPC', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE03',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, storedOrder);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(db.rpcCalls.length, 1);
  assert.equal(db.rpcCalls[0].name, 'apply_vip_payment_checked');
  assert.equal(db.rpcCalls[0].args.p_amount_cents, 2000);
});

test('refund notifications keep their existing path without requiring total_paid_amount', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE04',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    status: 'refunded',
    status_detail: 'refunded',
    ...pixPayment(),
  }, storedOrder);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(db.rpcCalls.length, 1);
  assert.equal(db.rpcCalls[0].args.p_status, 'REFUNDED');
});

test('a non-PIX accredited Order cannot apply VIP', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE05',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    transactions: { payments: [{ amount: '20.00', payment_method: { id: 'visa', type: 'credit_card' } }] },
  }, storedOrder);
  assert.equal(response.status, 200);
  assert.equal(db.rpcCalls.length, 0);
  assert.equal(db.eventUpdates.at(-1).last_error, 'payment_method_mismatch');
});

test('a notification for a different provider checkout cannot apply the stored order', async () => {
  const { response, db } = await invoke({
    id: 'ORDROUTE06',
    external_reference: 'external-route-test',
    total_amount: '20.00',
    total_paid_amount: '20.00',
    status: 'processed',
    status_detail: 'accredited',
    ...pixPayment(),
  }, { ...storedOrder, provider_checkout_id: 'ORDROUTE-BOUND' });
  assert.equal(response.status, 200);
  assert.equal(db.rpcCalls.length, 0);
  assert.equal(db.eventUpdates.at(-1).last_error, 'provider_checkout_mismatch');
});
