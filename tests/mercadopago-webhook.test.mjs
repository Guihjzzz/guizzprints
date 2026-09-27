import assert from 'node:assert/strict';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function load(path) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === 'server-only') return {};
    if (name === 'node:crypto') return { createHash, createHmac, timingSafeEqual };
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports;
}

const webhook = load('src/lib/mercadopago-webhook.ts');

test('Mercado Pago x-signature validates the documented manifest and rejects replay/tampering', () => {
  const secret = 'webhook-secret';
  const requestId = 'request-123';
  const dataId = 'ORD01TEST';
  const now = Date.now();
  const ts = String(now);
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const v1 = createHmac('sha256', secret).update(manifest).digest('hex');
  const signature = `ts=${ts},v1=${v1}`;
  assert.equal(webhook.verifyMercadoPagoWebhookSignature(signature, requestId, dataId, secret, now), true);
  assert.equal(webhook.verifyMercadoPagoWebhookSignature(signature, requestId, dataId.toLowerCase(), secret, now), true);
  assert.equal(webhook.verifyMercadoPagoWebhookSignature(signature, requestId, 'ORD01OTHER', secret, now), false);
  assert.equal(webhook.verifyMercadoPagoWebhookSignature(signature, requestId, dataId, secret, now + 301000), false);
  assert.equal(webhook.verifyMercadoPagoWebhookSignature(`ts=${ts},v1=${'0'.repeat(64)}`, requestId, dataId, secret, now), false);
});

const paidOrderFixture = {
  id: 'ORD01TEST',
  total_amount: '20.00',
  total_paid_amount: '20.00',
  status: 'processed',
  status_detail: 'accredited',
  transactions: { payments: [{ amount: '20.00', payment_method: { id: 'pix', type: 'bank_transfer' } }] },
};

test('Order statuses are conservative and amounts require exact BRL cents', () => {
  assert.equal(webhook.orderEventStatus(paidOrderFixture.status, paidOrderFixture.status_detail), 'PAID');
  assert.equal(webhook.orderEventStatus('refunded', 'refunded'), 'REFUNDED');
  assert.equal(webhook.orderEventStatus('processed', 'partially_refunded'), 'REFUNDED');
  assert.equal(webhook.orderEventStatus('charged_back', 'in_process'), 'DISPUTED');
  assert.equal(webhook.orderEventStatus('expired', 'expired'), 'CANCELLED');
  assert.equal(webhook.orderEventStatus('action_required', 'waiting_transfer'), null);
  assert.equal(webhook.amountToCents('6.70'), 670);
  assert.equal(webhook.amountToCents('20.00'), 2000);
  assert.equal(webhook.amountToCents('6.7'), null);
  assert.equal(webhook.amountToCents(6.70), null);
  assert.equal(webhook.amountToCents('9999999999.99'), null);
});

test('accredited Orders require a settled amount matching the total and persisted price', () => {
  assert.deepEqual(webhook.validatePaidAmount(paidOrderFixture.total_amount, paidOrderFixture.total_paid_amount, 2000), {
    ok: true,
    amountCents: 2000,
  });
  assert.deepEqual(webhook.validatePaidAmount(paidOrderFixture.total_amount, undefined, 2000), {
    ok: false,
    reason: 'invalid_amount',
  });
  assert.deepEqual(webhook.validatePaidAmount(paidOrderFixture.total_amount, '19.99', 2000), {
    ok: false,
    reason: 'amount_mismatch',
  });
  assert.deepEqual(webhook.validatePaidAmount(paidOrderFixture.total_amount, '20.00', 1999), {
    ok: false,
    reason: 'amount_mismatch',
  });
});

test('payment method validation accepts only one PIX bank transfer with matching amount', () => {
  assert.deepEqual(webhook.validatePixPayment(paidOrderFixture), { ok: true });
  assert.deepEqual(webhook.validatePixPayment({ ...paidOrderFixture, transactions: undefined }), {
    ok: false, reason: 'invalid_payment_method',
  });
  assert.deepEqual(webhook.validatePixPayment({
    ...paidOrderFixture,
    transactions: { payments: [{ amount: '20.00', payment_method: { id: 'visa', type: 'credit_card' } }] },
  }), { ok: false, reason: 'payment_method_mismatch' });
  assert.deepEqual(webhook.validatePixPayment({
    ...paidOrderFixture,
    transactions: { payments: [{ amount: '19.99', payment_method: { id: 'pix', type: 'bank_transfer' } }] },
  }), { ok: false, reason: 'payment_amount_mismatch' });
});
