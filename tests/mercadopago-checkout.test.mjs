// Isolated fixtures only: no real Mercado Pago calls, credentials or orders.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const plans = [
  { id: 'daily', days: 1, priceCents: 199 },
  { id: 'weekly', days: 7, priceCents: 670 },
  { id: 'monthly', days: 30, priceCents: 1990 },
];

function load(path, modules, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', ...Object.keys(globals), code)(name => {
    if (name === 'server-only') return {};
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports, ...Object.values(globals));
  return exports;
}

class CheckoutError extends Error {
  constructor(code, status = 503) { super(code); this.code = code; this.status = status; }
}

function provider({ env = {}, status = 201, mutation = {}, broken = false } = {}) {
  const calls = [];
  const processEnv = {
    NODE_ENV: 'test', VERCEL_ENV: 'preview',
    MERCADOPAGO_ACCESS_TOKEN: 'test-access-token',
    MERCADOPAGO_TEST_CHECKOUT_ENABLED: 'true',
    MERCADOPAGO_TEST_USER_IDS: 'owner',
    MERCADOPAGO_TEST_PAYER_EMAIL: 'buyer@testuser.com',
    MERCADOPAGO_TEST_SITE_URL: 'https://preview.example',
    ...env,
  };
  const api = load('src/lib/mercadopago-checkout.ts', {
    'node:crypto': { randomUUID: () => 'test-uuid' },
    '@/lib/vip-plans': { vipPlans: plans },
    '@/lib/checkout-error': { CheckoutError },
    '@/lib/server-observability': { logServerFailure: () => {} },
  }, {
    process: { env: processEnv },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (broken) throw new Error('sensitive upstream detail');
      const body = JSON.parse(options.body);
      return Response.json({
        id: 'ORD01TEST', external_reference: body.external_reference,
        total_amount: body.total_amount, status: 'action_required',
        transactions: { payments: [{ amount: body.total_amount, payment_method: {
          id: 'pix', type: 'bank_transfer', ticket_url: 'https://www.mercadopago.com.br/sandbox/payments/PAY01TEST/ticket?hash=opaque',
        } }] },
        ...mutation,
      }, { status });
    },
  });
  return { api, calls };
}

test('Mercado Pago Orders adapter creates an idempotent PIX order and validates its ticket URL', async () => {
  const { api, calls } = provider();
  const result = await api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://preview.example');
  assert.equal(result.testMode, true);
  assert.equal(result.provider, 'mercadopago');
  assert.equal(result.url, 'https://www.mercadopago.com.br/sandbox/payments/PAY01TEST/ticket?hash=opaque');
  assert.equal(result.checkoutId, 'ORD01TEST');
  const call = calls[0];
  assert.equal(call.url, 'https://api.mercadopago.com/v1/orders');
  assert.equal(call.options.headers.Authorization, 'Bearer test-access-token');
  assert.equal(call.options.headers['X-Idempotency-Key'], JSON.parse(call.options.body).external_reference);
  assert.equal(call.options.redirect, 'error');
  const body = JSON.parse(call.options.body);
  assert.equal(body.type, 'online');
  assert.equal(body.processing_mode, 'automatic');
  assert.equal(body.total_amount, '19.90');
  assert.deepEqual(body.transactions.payments[0].payment_method, { id: 'pix', type: 'bank_transfer' });
  assert.equal(body.payer.email, 'buyer@testuser.com');
});

test('weekly checkout keeps the server-owned total at R$6.70', async () => {
  const { api, calls } = provider();
  await api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'weekly', 'pt', 'https://preview.example');
  assert.equal(JSON.parse(calls[0].options.body).total_amount, '6.70');
});

test('sandbox integration mode uses the documented predefined provider amount without changing plan pricing', async () => {
  const { api, calls } = provider({ env: { MERCADOPAGO_TEST_ORDER_AMOUNT: '50.00' } });
  await api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://preview.example');
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.total_amount, '50.00');
  assert.equal(body.transactions.payments[0].amount, '50.00');
  assert.equal(body.payer.first_name, 'APRO');
});

test('sandbox retries accept a pre-existing commercial-total order for the same plan', async () => {
  const { api } = provider({
    env: { MERCADOPAGO_TEST_ORDER_AMOUNT: '50.00' },
    mutation: {
      total_amount: '6.70',
      transactions: { payments: [{ amount: '6.70', payment_method: {
        id: 'pix', type: 'bank_transfer', ticket_url: 'https://www.mercadopago.com.br/sandbox/payments/PAY01TEST/ticket?hash=old-order',
      } }] },
    },
  });
  const result = await api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'weekly', 'pt');
  assert.match(result.url, /old-order$/);
});

test('invalid sandbox predefined amount falls back to the server-owned plan total', async () => {
  const { api, calls } = provider({ env: { MERCADOPAGO_TEST_ORDER_AMOUNT: 'R$50,00' } });
  await api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://preview.example');
  assert.equal(JSON.parse(calls[0].options.body).total_amount, '19.90');
});

test('sandbox requires a @testuser.com payer and never contacts the provider when configuration is unsafe', async () => {
  for (const env of [
    { MERCADOPAGO_TEST_PAYER_EMAIL: '' },
    { MERCADOPAGO_ACCESS_TOKEN: '' },
    { MERCADOPAGO_TEST_CHECKOUT_ENABLED: 'false' },
    { MERCADOPAGO_TEST_SITE_URL: 'https://preview.example/evil' },
    { MERCADOPAGO_TEST_USER_IDS: '' },
  ]) {
    const { api, calls } = provider({ env });
    await assert.rejects(api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://preview.example'));
    assert.equal(calls.length, 0);
  }
  const { api, calls } = provider();
  await assert.rejects(api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://evil.example'), { message: 'invalid_origin' });
  await assert.rejects(api.createMercadoPagoTestCheckout('stranger', 'owner@example.com', 'monthly', 'pt'), { message: 'tester_only' });
  assert.equal(calls.length, 0);
});

test('adapter rejects provider status, amount, identity and unsafe URL mutations', async () => {
  for (const mutation of [
    { total_amount: '1.00' },
    { external_reference: 'different' },
    { status: 'failed' },
    { transactions: { payments: [{ amount: '19.90', payment_method: { id: 'card', type: 'credit_card', ticket_url: 'https://www.mercadopago.com.br/sandbox/payments/PAY01TEST/ticket' } }] } },
    { transactions: { payments: [{ amount: '19.90', payment_method: { id: 'pix', type: 'bank_transfer', ticket_url: 'https://evil.example/payments/PAY01TEST/ticket' } }] } },
  ]) {
    await assert.rejects(provider({ mutation }).api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt'));
  }
  const broken = provider({ broken: true });
  await assert.rejects(broken.api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt'), { message: 'provider_unavailable' });
  assert.equal(broken.calls.length, 1);
  await assert.rejects(provider({ status: 401 }).api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt'), { message: 'provider_auth' });
  await assert.rejects(provider({ status: 403 }).api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt'), { message: 'provider_permission' });
  await assert.rejects(provider({ status: 400 }).api.createMercadoPagoTestCheckout('owner', 'owner@example.com', 'monthly', 'pt'), { message: 'provider_request' });
});

test('live adapter is separately gated and restricted to the official origin', async () => {
  const disabled = provider({ env: { MERCADOPAGO_TEST_CHECKOUT_ENABLED: 'false', MERCADOPAGO_LIVE_CHECKOUT_ENABLED: 'false' } });
  assert.equal(disabled.api.mercadoPagoLiveCheckoutEnabled(), false);
  await assert.rejects(disabled.api.createMercadoPagoLiveCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://www.guizz.xyz'));
  assert.equal(disabled.calls.length, 0);
  const active = provider({ env: {
    MERCADOPAGO_TEST_CHECKOUT_ENABLED: 'false', MERCADOPAGO_LIVE_CHECKOUT_ENABLED: 'true',
    NODE_ENV: 'production', VERCEL_ENV: 'production', MERCADOPAGO_SITE_URL: 'https://www.guizz.xyz',
  } });
  const result = await active.api.createMercadoPagoLiveCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://www.guizz.xyz');
  assert.equal(result.testMode, false);
  assert.match(JSON.parse(active.calls[0].options.body).external_reference, /^guizz-mp-live-/);
  await assert.rejects(active.api.createMercadoPagoLiveCheckout('owner', 'owner@example.com', 'monthly', 'pt', 'https://evil.example'), { message: 'invalid_origin' });
});
