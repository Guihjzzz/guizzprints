import 'server-only';

import type { NextRequest } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  amountToCents,
  fetchMercadoPagoOrder,
  orderEventStatus,
  validatePaidAmount,
  validatePixPayment,
} from '@/lib/mercadopago-webhook';

type AdminClient = ReturnType<typeof getSupabaseAdmin>;
const LIVE_RECONCILE_COOLDOWN_MS = 30_000;
const LIVE_RECONCILE_MAX_USERS = 512;
const liveReconcileAttempts = new Map<string, number>();

export type ActiveVipEntitlement = {
  id: string;
  planId: string;
  startsAt: string;
  expiresAt: string;
};

function bearerToken(request: NextRequest) {
  const value = request.headers.get('authorization');
  if (!value?.startsWith('Bearer ')) return null;
  const token = value.slice('Bearer '.length).trim();
  return token || null;
}

/** Resolve the caller only from a bearer token supplied by the browser client. */
export async function getUserFromBearer(request: NextRequest, db: AdminClient = getSupabaseAdmin()): Promise<User | null> {
  const token = bearerToken(request);
  if (!token) return null;
  try {
    const { data: { user }, error } = await db.auth.getUser(token);
    return error || !user ? null : user;
  } catch {
    return null;
  }
}

/** Return only a currently active, server-created entitlement. */
export async function getActiveVipEntitlement(
  db: Pick<SupabaseClient, 'from'>,
  userId: string,
  now = new Date(),
): Promise<ActiveVipEntitlement | null> {
  const timestamp = now.toISOString();
  try {
    const { data, error } = await db
      .from('vip_entitlements')
      .select('id, plan_id, starts_at, expires_at')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lte('starts_at', timestamp)
      .gt('expires_at', timestamp)
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data || typeof data.id !== 'string' || typeof data.plan_id !== 'string'
      || typeof data.starts_at !== 'string' || typeof data.expires_at !== 'string') return null;

    return {
      id: data.id,
      planId: data.plan_id,
      startsAt: data.starts_at,
      expiresAt: data.expires_at,
    };
  } catch {
    return null;
  }
}

type PendingLiveVipOrder = {
  external_id?: unknown;
  provider_checkout_id?: unknown;
  product_id?: unknown;
  price_cents?: unknown;
  dev_mode?: unknown;
};

function isSafeProviderId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value);
}

function allowLiveReconcileAttempt(userId: string, now = Date.now()) {
  const lastAttempt = liveReconcileAttempts.get(userId);
  if (lastAttempt !== undefined && now - lastAttempt < LIVE_RECONCILE_COOLDOWN_MS) return false;

  liveReconcileAttempts.set(userId, now);
  const cutoff = now - LIVE_RECONCILE_COOLDOWN_MS;
  for (const [id, attemptedAt] of liveReconcileAttempts) {
    if (attemptedAt < cutoff) liveReconcileAttempts.delete(id);
  }
  while (liveReconcileAttempts.size > LIVE_RECONCILE_MAX_USERS) {
    const oldest = liveReconcileAttempts.keys().next().value;
    if (typeof oldest !== 'string') break;
    liveReconcileAttempts.delete(oldest);
  }
  return true;
}

/**
 * Recover a paid production order when the provider webhook was delayed or
 * dropped. This is deliberately scoped to the authenticated user, one open
 * order, and the same server-side proofs used by the signed webhook.
 */
async function reconcilePendingLiveVipOrder(db: AdminClient, userId: string) {
  if (process.env.VERCEL_ENV !== 'production') return;
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) return;
  // Status is polled by several authenticated surfaces. Do not let repeated
  // retries turn a delayed webhook into an avoidable provider-rate-limit sink.
  if (!allowLiveReconcileAttempt(userId)) return;

  try {
    const { data, error } = await db
      .from('vip_orders')
      .select('external_id, provider_checkout_id, product_id, price_cents, dev_mode')
      .eq('user_id', userId)
      .eq('dev_mode', false)
      .eq('status', 'checkout_created')
      .order('created_at', { ascending: true })
      .limit(3);
    if (error || !Array.isArray(data)) return;

    // Keep status requests bounded even if an account has several abandoned
    // plans. At most one provider lookup is made in this request.
    const storedOrder = data[0] as PendingLiveVipOrder | undefined;
    if (!storedOrder || !isSafeProviderId(storedOrder.provider_checkout_id)
      || typeof storedOrder.external_id !== 'string' || !storedOrder.external_id
      || typeof storedOrder.product_id !== 'string' || !storedOrder.product_id
      || typeof storedOrder.price_cents !== 'number'
      || !Number.isSafeInteger(storedOrder.price_cents) || storedOrder.price_cents <= 0) return;

    const providerOrder = await fetchMercadoPagoOrder(token, storedOrder.provider_checkout_id);
    if (providerOrder.id !== storedOrder.provider_checkout_id
      || providerOrder.external_reference !== storedOrder.external_id) return;

    const amountCents = amountToCents(providerOrder.total_amount);
    if (!amountCents || amountCents !== storedOrder.price_cents) return;

    const status = orderEventStatus(providerOrder.status, providerOrder.status_detail);
    if (!status || !validatePixPayment(providerOrder).ok) return;
    if (status === 'PAID'
      && !validatePaidAmount(providerOrder.total_amount, providerOrder.total_paid_amount, storedOrder.price_cents).ok) return;

    const { data: rpcData, error: rpcError } = await db.rpc('apply_vip_payment_checked', {
      p_external_id: storedOrder.external_id,
      p_provider_checkout_id: storedOrder.provider_checkout_id,
      p_status: status,
      p_product_id: storedOrder.product_id,
      p_amount_cents: amountCents,
      p_dev_mode: false,
      p_paid_at: status === 'PAID' ? new Date().toISOString() : null,
    });
    // The RPC is idempotent. A false result means an already-applied or
    // non-activating state and is intentionally treated as no recovery.
    const applied = Array.isArray(rpcData) ? rpcData[0]?.applied : rpcData?.applied;
    if (rpcError || applied !== true) return;
  } catch {
    // Status must remain fail-closed if the provider or database is unavailable.
  }
}

export async function getRequestVipEntitlement(request: NextRequest, db: AdminClient = getSupabaseAdmin()) {
  const user = await getUserFromBearer(request, db);
  if (!user) return null;
  const existing = await getActiveVipEntitlement(db, user.id);
  if (existing) return existing;

  await reconcilePendingLiveVipOrder(db, user.id);
  return getActiveVipEntitlement(db, user.id);
}
