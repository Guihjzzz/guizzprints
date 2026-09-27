import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { VipPlanId } from '@/lib/vip-plans';

type OrderClient = Pick<SupabaseClient, 'from'>;

const OPEN_ORDER_STATUSES = ['pending', 'checkout_created'] as const;

/** A second checkout for the same user/plan would leave two valid payment paths open. */
export class VipOrderPendingError extends Error {
  readonly externalId: string;

  constructor(externalId: string) {
    super('vip_order_pending');
    this.name = 'VipOrderPendingError';
    this.externalId = externalId;
  }
}

/** Persistence failed after the provider may have accepted the order. */
export class VipOrderPersistenceError extends Error {
  constructor() {
    super('vip_order_persistence');
    this.name = 'VipOrderPersistenceError';
  }
}

export type VipOrderDraft = {
  userId: string;
  planId: VipPlanId;
  productId: string;
  priceCents: number;
  days: number;
  externalId: string;
  devMode: boolean;
};

function canWrite(client: unknown): client is OrderClient {
  return Boolean(client && typeof (client as OrderClient).from === 'function');
}

/** Test stubs without a database intentionally skip persistence. Production and Preview use the admin client. */
export async function createVipOrder(client: unknown, draft: VipOrderDraft): Promise<boolean> {
  if (!canWrite(client)) return false;
  const { error } = await client.from('vip_orders').insert({
    user_id: draft.userId,
    plan_id: draft.planId,
    product_id: draft.productId,
    price_cents: draft.priceCents,
    days: draft.days,
    external_id: draft.externalId,
    status: 'pending',
    currency: 'BRL',
    dev_mode: draft.devMode,
  });
  if (error) {
    // The partial unique index is the race-safe guard. The follow-up lookup
    // distinguishes that expected conflict from an unavailable database or
    // an unrelated uniqueness failure without exposing provider details.
    if (error.code === '23505') {
      const { data: openOrder, error: lookupError } = await client.from('vip_orders')
        .select('external_id')
        .eq('user_id', draft.userId)
        .eq('plan_id', draft.planId)
        .eq('dev_mode', draft.devMode)
        .in('status', [...OPEN_ORDER_STATUSES])
        .limit(1)
        .maybeSingle();
      if (!lookupError && typeof openOrder?.external_id === 'string') {
        throw new VipOrderPendingError(openOrder.external_id);
      }
    }
    throw new Error('vip_order_unavailable');
  }
  return true;
}

export async function markVipOrderCheckoutCreated(client: unknown, externalId: string, checkoutId: string) {
  if (!canWrite(client)) return;
  const { error } = await client.from('vip_orders').update({
    provider_checkout_id: checkoutId,
    status: 'checkout_created',
    updated_at: new Date().toISOString(),
  }).eq('external_id', externalId).in('status', ['pending', 'checkout_created']);
  if (error) throw new VipOrderPersistenceError();
}

export async function markVipOrderFailed(client: unknown, externalId: string) {
  if (!canWrite(client)) return;
  const { error } = await client.from('vip_orders').update({
    status: 'failed',
    updated_at: new Date().toISOString(),
  }).eq('external_id', externalId).eq('status', 'pending');
  if (error) throw new VipOrderPersistenceError();
}
