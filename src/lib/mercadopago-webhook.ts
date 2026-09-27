import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const MERCADO_PAGO_WEBHOOK_EVENTS = new Set(['order']);

export type MercadoPagoOrder = {
  id?: unknown;
  external_reference?: unknown;
  total_amount?: unknown;
  total_paid_amount?: unknown;
  status?: unknown;
  status_detail?: unknown;
  transactions?: { payments?: Array<{
    amount?: unknown;
    payment_method?: { id?: unknown; type?: unknown };
  }> };
};

/** Fetch an Order server-side without ever returning the provider token. */
export async function fetchMercadoPagoOrder(token: string, orderId: string): Promise<MercadoPagoOrder> {
  let response: Response;
  try {
    response = await fetch(`https://api.mercadopago.com/v1/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET', cache: 'no-store', redirect: 'error',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error('provider_unavailable');
  }
  if (!response.ok) throw new Error('provider_unavailable');
  try { return await response.json() as MercadoPagoOrder; } catch { throw new Error('provider_invalid'); }
}

export function webhookPayloadHash(rawBody: string) {
  return createHash('sha256').update(rawBody, 'utf8').digest('hex');
}

function signatureParts(value: string) {
  const parts = new Map(value.split(',').map(part => {
    const [key, ...rest] = part.trim().split('=');
    return [key, rest.join('=')];
  }));
  const ts = parts.get('ts') ?? '';
  const v1 = parts.get('v1') ?? '';
  return /^\d{1,20}$/.test(ts) && /^[a-f0-9]{64}$/i.test(v1) ? { ts, v1 } : null;
}

/** Validate the x-signature manifest documented for Mercado Pago Orders. */
export function verifyMercadoPagoWebhookSignature(signature: string, requestId: string, dataId: string, secret: string, now = Date.now()) {
  if (!signature || !requestId || !dataId || !secret) return false;
  const parts = signatureParts(signature);
  if (!parts) return false;
  const timestamp = Number(parts.ts);
  // The provider sends milliseconds. A five-minute replay window is enough
  // for normal retries while preventing an old signed request being replayed.
  if (!Number.isSafeInteger(timestamp) || Math.abs(now - timestamp) > 5 * 60 * 1000) return false;
  // Mercado Pago sends Order identifiers in uppercase, but its documented
  // manifest uses the `data.id` query value lowercased. Keep the original ID
  // for the API lookup; normalize only the value that is signed.
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac('sha256', secret).update(manifest, 'utf8').digest('hex');
  const received = Buffer.from(parts.v1.toLowerCase(), 'utf8');
  const generated = Buffer.from(expected, 'utf8');
  return received.length === generated.length && timingSafeEqual(received, generated);
}

export function orderEventStatus(status: unknown, statusDetail?: unknown) {
  if (status === 'processed' && statusDetail === 'accredited') return 'PAID' as const;
  if (status === 'refunded' || status === 'processed' && statusDetail === 'partially_refunded') return 'REFUNDED' as const;
  if (status === 'charged_back') return 'DISPUTED' as const;
  if (status === 'canceled' || status === 'expired' || status === 'failed') return 'CANCELLED' as const;
  return null;
}

export function amountToCents(value: unknown) {
  if (typeof value !== 'string' || !/^\d{1,9}\.\d{2}$/.test(value)) return null;
  const [whole, fraction] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

/**
 * A paid Order must prove that the amount actually settled is the same as
 * both the Order total and the server-owned amount recorded at checkout.
 * Refund/cancel notifications intentionally do not use this check because
 * their settled amount may legitimately be partial or absent.
 */
export function validatePaidAmount(totalAmount: unknown, totalPaidAmount: unknown, expectedPriceCents: unknown) {
  const totalCents = amountToCents(totalAmount);
  const paidCents = amountToCents(totalPaidAmount);
  const expectedCents = typeof expectedPriceCents === 'number'
    && Number.isSafeInteger(expectedPriceCents)
    && expectedPriceCents > 0
    ? expectedPriceCents
    : null;

  if (!totalCents || !paidCents || !expectedCents) {
    return { ok: false as const, reason: 'invalid_amount' as const };
  }
  if (paidCents !== totalCents || paidCents !== expectedCents) {
    return { ok: false as const, reason: 'amount_mismatch' as const };
  }
  return { ok: true as const, amountCents: paidCents };
}

/**
 * Checkout creation is PIX-only. A provider status by itself is not enough
 * proof of method, since Mercado Pago can report the same accredited status
 * for other payment methods. Require exactly one PIX bank-transfer payment.
 */
export function validatePixPayment(order: MercadoPagoOrder) {
  const payments = order.transactions?.payments;
  if (!Array.isArray(payments) || payments.length !== 1) {
    return { ok: false as const, reason: 'invalid_payment_method' as const };
  }
  const payment = payments[0];
  if (payment?.payment_method?.id !== 'pix' || payment.payment_method?.type !== 'bank_transfer') {
    return { ok: false as const, reason: 'payment_method_mismatch' as const };
  }
  if (payment.amount !== order.total_amount) {
    return { ok: false as const, reason: 'payment_amount_mismatch' as const };
  }
  return { ok: true as const };
}
