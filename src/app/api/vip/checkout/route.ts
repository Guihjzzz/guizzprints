import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { vipPlans } from '@/lib/vip-plans';
import { CheckoutError } from '@/lib/checkout-error';
import { createMercadoPagoExternalId, createMercadoPagoLiveCheckout, createMercadoPagoTestCheckout, isMercadoPagoCheckoutTester, mercadoPagoLiveCheckoutEnabled, mercadoPagoSiteOrigin, mercadoPagoTestCheckoutEnabled } from '@/lib/mercadopago-checkout';
import { createVipOrder, markVipOrderCheckoutCreated, markVipOrderFailed, VipOrderPendingError, VipOrderPersistenceError } from '@/lib/vip-orders';
import { logServerFailure } from '@/lib/server-observability';

export const runtime = 'nodejs';
const MAX_BODY_BYTES = 1024;

function result(body: object, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  let stage = 'gate';
  let mode: 'test' | 'live' | 'none' = 'none';
  try {
    const testMode = mercadoPagoTestCheckoutEnabled();
    const liveMode = !testMode && mercadoPagoLiveCheckoutEnabled();
    mode = testMode ? 'test' : liveMode ? 'live' : 'none';
    if (!testMode && !liveMode) throw new CheckoutError('disabled');
    // Only the configured origin or this exact Vercel Preview deployment, never arbitrary return URLs.
    stage = 'origin';
    const requestOrigin = request.headers.get('origin');
    if (!requestOrigin) throw new CheckoutError('invalid_origin', 403);
    mercadoPagoSiteOrigin(testMode ? 'test' : 'live', requestOrigin);
    stage = 'request';
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ') || !authorization.slice(7).trim()) return result({ error: 'login_required' }, 401);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return result({ error: 'invalid_request' }, 400);
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return result({ error: 'invalid_request' }, 400);
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return result({ error: 'invalid_request' }, 400);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return result({ error: 'invalid_request' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return result({ error: 'invalid_request' }, 400);
    const input = body as { planId?: unknown; locale?: unknown };
    const plan = vipPlans.find(item => item.id === input.planId);
    if (!plan || !['en', 'pt', 'es'].includes(String(input.locale))
      || Object.keys(body).some(key => !['planId', 'locale'].includes(key))) return result({ error: 'invalid_request' }, 400);
    stage = 'auth';
    const admin = getSupabaseAdmin();
    const { data: { user }, error } = await admin.auth.getUser(authorization.slice(7).trim());
    if (error || !user) return result({ error: 'login_required' }, 401);
    if (testMode && !isMercadoPagoCheckoutTester(user.id)) return result({ error: 'tester_only' }, 403);
    // Mercado Pago Orders have no provider-side product ID. Keep a stable
    // server-owned plan marker in the order row; the amount and external
    // reference are verified again when the signed Order webhook arrives.
    const productId = `mp_${plan.id}`;
    stage = 'order-persist';
    let externalId = createMercadoPagoExternalId(testMode ? 'test' : 'live');
    let orderPersisted = false;
    let reusedOrder = false;
    if (productId) {
      try {
        orderPersisted = await createVipOrder(admin, {
          userId: user.id, planId: plan.id, productId,
          priceCents: plan.priceCents, days: plan.days, externalId, devMode: testMode,
        });
      } catch (error) {
        // Reuse the existing provider idempotency key on a retry. This lets
        // Mercado Pago return the same checkout when a previous request timed
        // out after creating the provider order, without opening a duplicate.
        if (error instanceof VipOrderPendingError) {
          externalId = error.externalId;
          orderPersisted = true;
          reusedOrder = true;
        } else {
          return result({ error: 'order_unavailable' }, 503);
        }
      }
    }
    try {
      stage = 'provider';
      const checkout = testMode
        ? await createMercadoPagoTestCheckout(user.id, user.email ?? '', plan.id, String(input.locale), requestOrigin, externalId)
        : await createMercadoPagoLiveCheckout(user.id, user.email ?? '', plan.id, String(input.locale), requestOrigin, externalId);
      if (orderPersisted) await markVipOrderCheckoutCreated(admin, externalId, checkout.checkoutId);
      return result(checkout, 200);
    } catch (error) {
      stage = 'order-finalize';
      if (error instanceof VipOrderPersistenceError) return result({ error: 'order_unavailable' }, 503);
      // A provider timeout or a retry of an existing order can have left a
      // provider-side checkout alive; preserve that order for idempotent retry
      // or webhook reconciliation instead of opening a second payment path.
      if (orderPersisted && !reusedOrder && !(error instanceof CheckoutError && error.code === 'provider_unavailable')) {
        try { await markVipOrderFailed(admin, externalId); } catch { return result({ error: 'order_unavailable' }, 503); }
      }
      throw error;
    }
  } catch (error) {
    // Never return provider payloads, credentials, auth data or internal errors.
    const code = error instanceof CheckoutError ? error.code : 'not_configured';
    if (code !== 'disabled' && code !== 'invalid_request' && code !== 'login_required') {
      // Keep production diagnostics bounded to an enum and a phase. Never log
      // tokens, user data, provider payloads, or the provider order reference.
      logServerFailure('vip-checkout', `${mode}-${stage}`, code);
    }
    return result({ error: code }, error instanceof CheckoutError ? error.status : 503);
  }
}
