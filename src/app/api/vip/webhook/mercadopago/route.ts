import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { amountToCents, fetchMercadoPagoOrder, MERCADO_PAGO_WEBHOOK_EVENTS, orderEventStatus, validatePaidAmount, validatePixPayment, verifyMercadoPagoWebhookSignature, webhookPayloadHash, type MercadoPagoOrder } from '@/lib/mercadopago-webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 256 * 1024;
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

type NotificationPayload = {
  id?: unknown;
  type?: unknown;
  action?: unknown;
  live_mode?: unknown;
  data?: { id?: unknown };
};

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

async function setEventStatus(db: ReturnType<typeof getSupabaseAdmin>, eventId: string, status: 'processed' | 'ignored' | 'failed', lastError?: string) {
  await db.from('vip_webhook_events').update({ status, processed_at: new Date().toISOString(), last_error: lastError ?? null }).eq('event_id', eventId);
}

export async function POST(request: NextRequest) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  const requestId = request.headers.get('x-request-id')?.trim() ?? '';
  const dataId = request.nextUrl.searchParams.get('data.id')?.trim() ?? '';
  const signature = request.headers.get('x-signature')?.trim() ?? '';
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return reply({ error: 'payload_too_large' }, 413);
  }
  if (!secret || !token || !verifyMercadoPagoWebhookSignature(signature, requestId, dataId, secret)) {
    return reply({ error: 'unauthorized' }, 401);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) return reply({ error: 'payload_too_large' }, 413);
  let payload: NotificationPayload;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== 'object') return reply({ error: 'invalid_payload' }, 400);
    payload = parsed as NotificationPayload;
  } catch { return reply({ error: 'invalid_payload' }, 400); }

  const notificationId = typeof payload.id === 'string' || typeof payload.id === 'number' ? String(payload.id).trim() : '';
  const orderId = typeof payload.data?.id === 'string' ? payload.data.id.trim() : '';
  const eventType = typeof payload.type === 'string' ? payload.type : '';
  const liveMode = payload.live_mode === true;
  if (!notificationId || !/^[A-Za-z0-9_-]{1,120}$/.test(notificationId)
    || !orderId || !/^[A-Za-z0-9_-]{1,120}$/.test(orderId)
    || dataId !== orderId || !MERCADO_PAGO_WEBHOOK_EVENTS.has(eventType)) {
    return reply({ error: 'invalid_payload' }, 400);
  }
  // The ledger key is provider-scoped so duplicate Mercado Pago events cannot collide.
  const eventId = `mp_${notificationId}_${orderId}`.slice(0, 160);
  const db = getSupabaseAdmin();
  const { error: claimError } = await db.from('vip_webhook_events').insert({
    event_id: eventId,
    event: typeof payload.action === 'string' ? payload.action : eventType,
    api_version: 1,
    dev_mode: !liveMode,
    status: 'processing',
    payload_hash: webhookPayloadHash(rawBody),
  });
  if (claimError) {
    if (claimError.code !== '23505') return reply({ error: 'temporarily_unavailable' }, 503);
    const { data: existing } = await db.from('vip_webhook_events').select('status').eq('event_id', eventId).maybeSingle();
    if (existing?.status === 'processed' || existing?.status === 'ignored') return reply({ ok: true });
    await db.from('vip_webhook_events').update({ status: 'processing', last_error: null }).eq('event_id', eventId);
  }

  let order: MercadoPagoOrder;
  try { order = await fetchMercadoPagoOrder(token, orderId); } catch {
    await setEventStatus(db, eventId, 'failed', 'provider_unavailable');
    return reply({ error: 'temporarily_unavailable' }, 503);
  }
  if (order.id !== orderId || typeof order.external_reference !== 'string') {
    await setEventStatus(db, eventId, 'ignored', 'invalid_order_shape');
    return reply({ ok: true });
  }

  const externalId = order.external_reference.trim();
  const amountCents = amountToCents(order.total_amount);
  if (!externalId || !amountCents) {
    await setEventStatus(db, eventId, 'ignored', 'invalid_order_shape');
    return reply({ ok: true });
  }
  const { data: storedOrder, error: orderError } = await db.from('vip_orders')
    .select('id, product_id, price_cents, dev_mode, provider_checkout_id')
    .eq('external_id', externalId).maybeSingle();
  if (orderError) {
    await setEventStatus(db, eventId, 'failed', 'order_lookup_failed');
    return reply({ error: 'temporarily_unavailable' }, 503);
  }
  if (!storedOrder) {
    await setEventStatus(db, eventId, 'ignored', 'order_not_found');
    return reply({ ok: true });
  }
  // A provider ID may be absent only for the narrow recovery case where the
  // checkout was created but persistence of the provider response failed.
  // Once stored, it is an immutable binding and must match this notification.
  if (storedOrder.provider_checkout_id && storedOrder.provider_checkout_id !== orderId) {
    await setEventStatus(db, eventId, 'ignored', 'provider_checkout_mismatch');
    return reply({ ok: true });
  }
  // A live notification must belong to an order created in live mode, and a
  // sandbox notification must belong to a test order. Never infer this from
  // the browser or from the return URL.
  if (Boolean(storedOrder.dev_mode) === liveMode || storedOrder.price_cents !== amountCents) {
    await setEventStatus(db, eventId, 'ignored', 'order_mismatch');
    return reply({ ok: true });
  }
  const status = orderEventStatus(order.status, order.status_detail);
  if (!status) {
    await setEventStatus(db, eventId, 'ignored');
    return reply({ ok: true });
  }

  const paymentMethod = validatePixPayment(order);
  if (!paymentMethod.ok) {
    await setEventStatus(db, eventId, 'ignored', paymentMethod.reason);
    return reply({ ok: true });
  }

  // Only an accredited payment can create VIP access. Require the provider's
  // settled amount and compare it with both the Order total and our persisted
  // price before handing the event to the entitlement RPC. Refunds,
  // disputes, and cancellations retain their existing reconciliation path.
  if (status === 'PAID') {
    const paidAmount = validatePaidAmount(order.total_amount, order.total_paid_amount, storedOrder.price_cents);
    if (!paidAmount.ok) {
      await setEventStatus(db, eventId, 'ignored', paidAmount.reason);
      return reply({ ok: true });
    }
  }

  try {
    const { error } = await db.rpc('apply_vip_payment_checked', {
      p_external_id: externalId,
      p_provider_checkout_id: orderId,
      p_status: status,
      p_product_id: storedOrder.product_id,
      p_amount_cents: amountCents,
      p_dev_mode: Boolean(storedOrder.dev_mode),
      p_paid_at: status === 'PAID' ? new Date().toISOString() : null,
    });
    if (error?.code === 'P0002') {
      await setEventStatus(db, eventId, 'ignored', 'order_not_found');
      return reply({ ok: true });
    }
    if (error) {
      await setEventStatus(db, eventId, 'failed', 'payment_application_failed');
      return reply({ error: 'temporarily_unavailable' }, 503);
    }
    await setEventStatus(db, eventId, 'processed');
    return reply({ ok: true });
  } catch {
    await setEventStatus(db, eventId, 'failed', 'payment_application_failed');
    return reply({ error: 'temporarily_unavailable' }, 503);
  }
}
