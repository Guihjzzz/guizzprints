import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { amountToCents, fetchMercadoPagoOrder, orderEventStatus, validatePaidAmount, validatePixPayment } from '@/lib/mercadopago-webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_ORDERS_PER_CALL = 20;
const RECONCILIATION_DEADLINE_MS = 45_000;
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

type ReconciliationOrder = {
  external_id?: unknown;
  provider_checkout_id?: unknown;
  product_id?: unknown;
  price_cents?: unknown;
  dev_mode?: unknown;
  status?: unknown;
};

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

function requestedLimit(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('limit');
  if (raw === null) return MAX_ORDERS_PER_CALL;
  if (!/^(?:[1-9]|1\d|20)$/.test(raw)) return null;
  return Number(raw);
}

function safeProviderId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value);
}

function increment(reasons: Record<string, number>, reason: string) {
  reasons[reason] = (reasons[reason] ?? 0) + 1;
}

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireAdmin(request);
  } catch {
    return reply({ error: 'Unable to authorize administrator.' }, 503);
  }
  if (!admin) return reply({ error: 'Administrator access required.' }, 403);

  const limit = requestedLimit(request);
  if (limit === null) return reply({ error: 'Invalid reconciliation limit.' }, 400);

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) return reply({ error: 'Payment provider is not configured.' }, 503);

  try {
    // This is deliberately the only order query and is hard-capped so an
    // operator invocation cannot fan out into an unbounded provider scan.
    const { data, error } = await admin.supabase
      .from('vip_orders')
      .select('external_id, provider_checkout_id, product_id, price_cents, dev_mode, status')
      .eq('status', 'checkout_created')
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) return reply({ error: 'Unable to load orders for reconciliation.' }, 503);

    const orders = (Array.isArray(data) ? data : []) as ReconciliationOrder[];
    let reconciled = 0;
    let skipped = 0;
    let failed = 0;
    const skippedReasons: Record<string, number> = {};
    const failedReasons: Record<string, number> = {};
    const startedAt = Date.now();

    for (const [index, storedOrder] of orders.entries()) {
      if (Date.now() - startedAt >= RECONCILIATION_DEADLINE_MS) {
        failed += orders.length - index;
        increment(failedReasons, 'reconciliation_deadline');
        break;
      }
      const providerId = storedOrder.provider_checkout_id;
      const externalId = storedOrder.external_id;
      const priceCents = storedOrder.price_cents;
      if (!safeProviderId(providerId)) {
        skipped += 1;
        increment(skippedReasons, 'invalid_provider_id');
        continue;
      }
      if (typeof externalId !== 'string' || !externalId
        || typeof priceCents !== 'number' || !Number.isSafeInteger(priceCents) || priceCents <= 0
        || typeof storedOrder.product_id !== 'string' || !storedOrder.product_id
        || typeof storedOrder.dev_mode !== 'boolean') {
        skipped += 1;
        increment(skippedReasons, 'invalid_stored_order');
        continue;
      }
      // Sandbox orders are recorded for diagnostics only. Never send them
      // through this operator's live reconciliation path.
      if (storedOrder.dev_mode) {
        skipped += 1;
        increment(skippedReasons, 'sandbox_order');
        continue;
      }

      let providerOrder;
      try {
        providerOrder = await fetchMercadoPagoOrder(token, providerId);
      } catch {
        failed += 1;
        increment(failedReasons, 'provider_unavailable');
        continue;
      }

      // Every binding is checked against the server-owned row before the RPC.
      // The provider ID comparison is exact; no browser value is trusted.
      if (providerOrder.id !== providerId) {
        skipped += 1;
        increment(skippedReasons, 'provider_id_mismatch');
        continue;
      }
      if (providerOrder.external_reference !== externalId) {
        skipped += 1;
        increment(skippedReasons, 'external_reference_mismatch');
        continue;
      }
      const amountCents = amountToCents(providerOrder.total_amount);
      if (!amountCents) {
        skipped += 1;
        increment(skippedReasons, 'invalid_amount');
        continue;
      }
      if (amountCents !== priceCents) {
        skipped += 1;
        increment(skippedReasons, 'amount_mismatch');
        continue;
      }

      const status = orderEventStatus(providerOrder.status, providerOrder.status_detail);
      if (!status) {
        skipped += 1;
        increment(skippedReasons, 'unsupported_status');
        continue;
      }
      if (status === 'PAID') {
        const paidAmount = validatePaidAmount(providerOrder.total_amount, providerOrder.total_paid_amount, priceCents);
        if (!paidAmount.ok) {
          skipped += 1;
          increment(skippedReasons, paidAmount.reason);
          continue;
        }
      }

      const paymentMethod = validatePixPayment(providerOrder);
      if (!paymentMethod.ok) {
        skipped += 1;
        increment(skippedReasons, paymentMethod.reason);
        continue;
      }

      try {
        const { data: rpcData, error: rpcError } = await admin.supabase.rpc('apply_vip_payment_checked', {
          p_external_id: externalId,
          p_provider_checkout_id: providerId,
          p_status: status,
          p_product_id: storedOrder.product_id,
          p_amount_cents: amountCents,
          p_dev_mode: Boolean(storedOrder.dev_mode),
          p_paid_at: status === 'PAID' ? new Date().toISOString() : null,
        });
        if (rpcError?.code === 'P0002') {
          skipped += 1;
          increment(skippedReasons, 'order_not_found');
          continue;
        }
        if (rpcError) throw new Error('payment_application_failed');
        const applied = Array.isArray(rpcData) ? rpcData[0]?.applied : rpcData?.applied;
        if (applied !== true) {
          skipped += 1;
          increment(skippedReasons, 'not_applied');
          continue;
        }
        reconciled += 1;
      } catch {
        failed += 1;
        increment(failedReasons, 'payment_application_failed');
      }
    }

    return reply({ ok: true, scanned: orders.length, reconciled, skipped, failed, skippedReasons, failedReasons });
  } catch {
    return reply({ error: 'Unable to reconcile VIP orders.' }, 503);
  }
}
