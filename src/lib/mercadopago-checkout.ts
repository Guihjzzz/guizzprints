import 'server-only';

import { randomUUID } from 'node:crypto';
import { vipPlans, type VipPlanId } from '@/lib/vip-plans';
import { CheckoutError } from '@/lib/checkout-error';
import { logServerFailure } from '@/lib/server-observability';

const MP_HOSTS = new Set(['www.mercadopago.com.br', 'mercadopago.com.br']);

/**
 * Mercado Pago's Orders API is intentionally PIX-only for this first rollout.
 * The flag and environment checks are separate for test and live rollout;
 * Mercado Pago is the only provider used by the application.
 */
export function mercadoPagoTestCheckoutEnabled() {
  return process.env.MERCADOPAGO_TEST_CHECKOUT_ENABLED === 'true'
    && process.env.VERCEL_ENV !== 'production'
    && (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development'
      || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
}

export function mercadoPagoLiveCheckoutEnabled() {
  return process.env.MERCADOPAGO_LIVE_CHECKOUT_ENABLED === 'true'
    && process.env.VERCEL_ENV === 'production'
    && process.env.NODE_ENV === 'production';
}

export function isMercadoPagoCheckoutTester(userId: string) {
  const configured = process.env.MERCADOPAGO_TEST_USER_IDS ?? '';
  return configured.split(',').map(id => id.trim()).includes(userId);
}

export function createMercadoPagoExternalId(mode: 'test' | 'live' = 'test') {
  return `guizz-mp-${mode}-${randomUUID()}`;
}

function parseOrigin(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    const local = ['localhost', '127.0.0.1'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:'))
      || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error();
    return url.origin;
  } catch {
    throw new CheckoutError('not_configured');
  }
}

function vercelPreviewOrigin() {
  const host = process.env.VERCEL_URL?.trim();
  if (!host || !/^[A-Za-z0-9.-]+\.vercel\.app$/.test(host)) return null;
  return `https://${host}`;
}

export function mercadoPagoSiteOrigin(mode: 'test' | 'live', requestOrigin?: string) {
  const configured = parseOrigin(mode === 'test'
    ? process.env.MERCADOPAGO_TEST_SITE_URL
    : process.env.MERCADOPAGO_SITE_URL);
  const deployment = mode === 'test' ? vercelPreviewOrigin() : null;
  const expected = configured ?? deployment;
  if (!expected) throw new CheckoutError('not_configured');
  if (requestOrigin && requestOrigin !== expected) throw new CheckoutError('invalid_origin', 403);
  if (mode === 'live' && !['guizz.xyz', 'www.guizz.xyz'].includes(new URL(expected).hostname)) {
    throw new CheckoutError('not_configured');
  }
  return requestOrigin ?? expected;
}

export function safeMercadoPagoCheckoutUrl(value: unknown) {
  if (typeof value !== 'string') throw new CheckoutError('provider_invalid', 502);
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !MP_HOSTS.has(url.hostname)
      || url.port || url.username || url.password
      || !/^\/(?:sandbox\/)?payments\/[A-Za-z0-9_-]+\/ticket\/?$/.test(url.pathname)) throw new Error();
    return url.href;
  } catch {
    throw new CheckoutError('provider_invalid', 502);
  }
}

function amountString(cents: number) {
  return (cents / 100).toFixed(2);
}

/**
 * Mercado Pago's PIX Sandbox only completes its documented integration test
 * with a predefined order amount. Keep that provider-only amount separate
 * from the server-owned commercial plan price; the live path never consults
 * this variable.
 */
function providerAmount(mode: 'test' | 'live', planCents: number) {
  if (mode !== 'test') return amountString(planCents);
  const configured = process.env.MERCADOPAGO_TEST_ORDER_AMOUNT?.trim() ?? '';
  if (/^\d+\.\d{2}$/.test(configured) && Number(configured) > 0) return configured;
  return amountString(planCents);
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function providerErrorKind(error: unknown) {
  if (!(error instanceof Error)) return 'unknown';
  const message = error.message.toLowerCase();
  if (message.includes('header')) return 'invalid-header';
  if (message.includes('timeout') || message.includes('aborted')) return 'timeout';
  if (message.includes('fetch failed')) {
    const causeCode = typeof (error as { cause?: { code?: unknown } }).cause?.code === 'string'
      ? (error as { cause: { code: string } }).cause.code
      : '';
    if (/^(?:ECONNRESET|ECONNREFUSED|ENETUNREACH|EHOSTUNREACH|ETIMEDOUT|UND_ERR_[A-Z_]+)$/.test(causeCode)) return `network-${causeCode.toLowerCase()}`;
    return 'fetch-failed';
  }
  if (message.includes('url')) return 'invalid-url';
  return error.name.toLowerCase();
}

type MercadoOrder = {
  id?: unknown;
  external_reference?: unknown;
  total_amount?: unknown;
  status?: unknown;
  transactions?: { payments?: Array<{
    amount?: unknown;
    payment_method?: { id?: unknown; type?: unknown; ticket_url?: unknown };
  }> };
};

async function createProviderOrder(mode: 'test' | 'live', userId: string, userEmail: string, planId: VipPlanId, locale: string, requestOrigin?: string, suppliedExternalId?: string) {
  const plan = vipPlans.find(item => item.id === planId);
  if (!plan || !['en', 'pt', 'es'].includes(locale)) throw new CheckoutError('invalid_request', 400);
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) throw new CheckoutError('not_configured');
  mercadoPagoSiteOrigin(mode, requestOrigin);
  const externalId = suppliedExternalId ?? createMercadoPagoExternalId(mode);
  if (!new RegExp(`^guizz-mp-${mode}-[A-Za-z0-9-]{1,80}$`).test(externalId)) throw new CheckoutError('invalid_request', 400);
  const payerEmail = (mode === 'test' ? process.env.MERCADOPAGO_TEST_PAYER_EMAIL : userEmail)?.trim() ?? '';
  if (!validEmail(payerEmail) || (mode === 'test' && !/@testuser\.com$/i.test(payerEmail))) {
    throw new CheckoutError('not_configured');
  }
  const amount = providerAmount(mode, plan.priceCents);
  let response: Response;
  try {
    response = await fetch('https://api.mercadopago.com/v1/orders', {
      method: 'POST', cache: 'no-store', redirect: 'error',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Reusing the order reference makes retries safe and deterministic.
        'X-Idempotency-Key': externalId,
      },
      body: JSON.stringify({
        type: 'online',
        total_amount: amount,
        external_reference: externalId,
        processing_mode: 'automatic',
        transactions: {
          payments: [{
            amount,
            payment_method: { id: 'pix', type: 'bank_transfer' },
            expiration_time: 'P1D',
          }],
        },
        payer: mode === 'test' ? { email: payerEmail, first_name: 'APRO' } : { email: payerEmail },
        // The API does not accept arbitrary metadata; the external reference
        // is the signed server-owned binding to the authenticated order.
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    // Keep diagnostics bounded to a sanitized provider error class. Never log
    // the token, request body, payer data, exception message or provider response.
    logServerFailure('mercadopago-checkout', mode, providerErrorKind(error));
    throw new CheckoutError('provider_unavailable', 502);
  }
  let payload: MercadoOrder;
  try { payload = await response.json() as MercadoOrder; } catch { throw new CheckoutError('provider_invalid', 502); }
  if (!response.ok) {
    const code = response.status === 401 ? 'provider_auth'
      : response.status === 403 ? 'provider_permission'
        : response.status === 400 || response.status === 422 ? 'provider_request' : 'provider_unavailable';
    throw new CheckoutError(code, 502);
  }
  const payment = payload.transactions?.payments?.length === 1 ? payload.transactions.payments[0] : null;
  if (!payment?.payment_method) throw new CheckoutError('provider_invalid', 502);
  const paymentMethod = payment.payment_method;
  const ticketUrl = paymentMethod.ticket_url;
  // A retry may reuse an order created before the Preview-only predefined
  // amount was configured. Accept that order's server-owned commercial total
  // as well as the current Sandbox amount; the external reference still
  // binds the response to the persisted plan and no duplicate is opened.
  const acceptedAmounts = new Set([amount, amountString(plan.priceCents)]);
  const returnedAmount = typeof payload.total_amount === 'string' ? payload.total_amount : '';
  const returnedPaymentAmount = typeof payment?.amount === 'string' ? payment.amount : '';
  if (typeof payload.id !== 'string' || !payload.id
    || payload.external_reference !== externalId
    || !acceptedAmounts.has(returnedAmount)
    || returnedPaymentAmount !== returnedAmount
    || paymentMethod.id !== 'pix'
    || paymentMethod.type !== 'bank_transfer'
    || (payload.status !== 'action_required' && payload.status !== 'processed')
    || !ticketUrl) {
    throw new CheckoutError('provider_invalid', 502);
  }
  return {
    url: safeMercadoPagoCheckoutUrl(ticketUrl),
    testMode: mode === 'test',
    checkoutId: payload.id,
    provider: 'mercadopago' as const,
  };
}

export async function createMercadoPagoTestCheckout(userId: string, userEmail: string, planId: VipPlanId, locale: string, requestOrigin?: string, suppliedExternalId?: string) {
  if (!mercadoPagoTestCheckoutEnabled()) throw new CheckoutError('disabled');
  if (!isMercadoPagoCheckoutTester(userId)) throw new CheckoutError('tester_only', 403);
  return createProviderOrder('test', userId, userEmail, planId, locale, requestOrigin, suppliedExternalId);
}

export async function createMercadoPagoLiveCheckout(userId: string, userEmail: string, planId: VipPlanId, locale: string, requestOrigin?: string, suppliedExternalId?: string) {
  if (!mercadoPagoLiveCheckoutEnabled()) throw new CheckoutError('disabled');
  return createProviderOrder('live', userId, userEmail, planId, locale, requestOrigin, suppliedExternalId);
}
