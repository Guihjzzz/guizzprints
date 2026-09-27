-- Payment foundation for one-time Guizz VIP plans.
-- These tables are server-only. No browser role receives access.
begin;

create table if not exists public.vip_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('fortnightly', 'monthly', 'quarterly', 'yearly')),
  product_id text not null check (product_id ~ '^[A-Za-z0-9_-]{1,120}$'),
  price_cents integer not null check (price_cents > 0),
  days integer not null check (days > 0),
  external_id text not null unique check (external_id ~ '^[A-Za-z0-9_-]{1,120}$'),
  provider_checkout_id text unique,
  status text not null default 'pending'
    check (status in ('pending', 'checkout_created', 'paid', 'refunded', 'disputed', 'failed', 'cancelled')),
  currency text not null default 'BRL' check (currency = 'BRL'),
  dev_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists vip_orders_user_created_idx
  on public.vip_orders (user_id, created_at desc);
create index if not exists vip_orders_status_idx
  on public.vip_orders (status, created_at desc);

create table if not exists public.vip_webhook_events (
  event_id text primary key check (event_id ~ '^[A-Za-z0-9_-]{1,160}$'),
  event text not null,
  api_version integer not null,
  dev_mode boolean not null,
  status text not null default 'processing'
    check (status in ('processing', 'processed', 'ignored', 'failed')),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

create index if not exists vip_webhook_events_status_idx
  on public.vip_webhook_events (status, received_at desc);

create table if not exists public.vip_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null unique references public.vip_orders(id) on delete cascade,
  plan_id text not null check (plan_id in ('fortnightly', 'monthly', 'quarterly', 'yearly')),
  starts_at timestamptz not null,
  expires_at timestamptz not null check (expires_at > starts_at),
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists vip_entitlements_user_active_idx
  on public.vip_entitlements (user_id, status, expires_at desc);

alter table public.vip_orders enable row level security;
alter table public.vip_webhook_events enable row level security;
alter table public.vip_entitlements enable row level security;

-- Explicit deny policies document the browser boundary. Table privileges are
-- revoked below as a second layer; only the server's service_role can work
-- with these rows.
drop policy if exists vip_orders_no_client on public.vip_orders;
create policy vip_orders_no_client on public.vip_orders
  for all to anon, authenticated using (false) with check (false);
drop policy if exists vip_webhook_events_no_client on public.vip_webhook_events;
create policy vip_webhook_events_no_client on public.vip_webhook_events
  for all to anon, authenticated using (false) with check (false);
drop policy if exists vip_entitlements_no_client on public.vip_entitlements;
create policy vip_entitlements_no_client on public.vip_entitlements
  for all to anon, authenticated using (false) with check (false);

revoke all privileges on table public.vip_orders from public, anon, authenticated;
revoke all privileges on table public.vip_webhook_events from public, anon, authenticated;
revoke all privileges on table public.vip_entitlements from public, anon, authenticated;
grant select, insert, update, delete on table public.vip_orders to service_role;
grant select, insert, update, delete on table public.vip_webhook_events to service_role;
grant select, insert, update, delete on table public.vip_entitlements to service_role;

-- Runs as the calling service_role (SECURITY INVOKER), keeping the whole order
-- update and entitlement grant in one transaction. The unique order_id makes
-- repeated provider deliveries harmless.
create or replace function public.apply_vip_payment(
  p_external_id text,
  p_provider_checkout_id text,
  p_status text,
  p_product_id text,
  p_amount_cents integer,
  p_dev_mode boolean,
  p_paid_at timestamptz default null
)
returns table (order_id uuid, entitlement_id uuid, applied boolean)
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_order public.vip_orders%rowtype;
  v_entitlement public.vip_entitlements%rowtype;
  v_previous_expiry timestamptz;
  v_start timestamptz;
begin
  if p_status not in ('PAID', 'REFUNDED', 'DISPUTED', 'CANCELLED') then
    raise exception 'unsupported payment status' using errcode = '22023';
  end if;
  if p_external_id is null or p_provider_checkout_id is null
    or p_product_id is null or p_amount_cents is null then
    raise exception 'incomplete payment data' using errcode = '22023';
  end if;

  select o.* into v_order
    from public.vip_orders as o
   where o.external_id = p_external_id
   for update;

  if not found then
    raise exception 'payment order not found' using errcode = 'P0002';
  end if;
  if v_order.product_id <> p_product_id
    or v_order.price_cents <> p_amount_cents
    or v_order.dev_mode is distinct from p_dev_mode then
    raise exception 'payment data does not match order' using errcode = '22023';
  end if;
  -- A late/replayed completion must never reactivate an order that was already
  -- refunded, disputed, or cancelled.
  if p_status = 'PAID' and v_order.status in ('refunded', 'disputed', 'cancelled') then
    return query select v_order.id, null::uuid, false;
    return;
  end if;

  update public.vip_orders
     set provider_checkout_id = coalesce(provider_checkout_id, p_provider_checkout_id),
         status = lower(p_status),
         updated_at = now(),
         paid_at = case when p_status = 'PAID' then coalesce(p_paid_at, now()) else paid_at end
   where id = v_order.id;

  if p_status = 'PAID' then
    -- Sandbox events are recorded for reconciliation but can never grant VIP.
    if p_dev_mode then
      return query select v_order.id, null::uuid, false;
      return;
    end if;

    select e.* into v_entitlement
      from public.vip_entitlements as e
     where e.order_id = v_order.id
     for update;
    if found then
      return query select v_order.id, v_entitlement.id, false;
      return;
    end if;

    select max(e.expires_at) into v_previous_expiry
      from public.vip_entitlements as e
     where e.user_id = v_order.user_id
       and e.status = 'active'
       and e.expires_at > now();
    v_start := greatest(coalesce(v_previous_expiry, now()), now());

    insert into public.vip_entitlements (
      user_id, order_id, plan_id, starts_at, expires_at
    ) values (
      v_order.user_id,
      v_order.id,
      v_order.plan_id,
      v_start,
      v_start + make_interval(days => v_order.days)
    )
    returning * into v_entitlement;

    return query select v_order.id, v_entitlement.id, true;
    return;
  end if;

  if p_status in ('REFUNDED', 'DISPUTED', 'CANCELLED') then
    update public.vip_entitlements
       set status = 'revoked', revoked_at = coalesce(revoked_at, now()), updated_at = now()
     where public.vip_entitlements.order_id = v_order.id
       and public.vip_entitlements.status = 'active';
  end if;
  return query select v_order.id, null::uuid, false;
end;
$$;

revoke all on function public.apply_vip_payment(text, text, text, text, integer, boolean, timestamptz)
  from public, anon, authenticated;
grant execute on function public.apply_vip_payment(text, text, text, text, integer, boolean, timestamptz)
  to service_role;

comment on table public.vip_orders is
  'Server-only payment orders. Never expose through the browser Data API.';
comment on table public.vip_webhook_events is
  'Idempotency ledger for authenticated payment webhook deliveries.';
comment on table public.vip_entitlements is
  'Server-owned time-limited VIP access; only paid production webhooks may create rows.';

notify pgrst, 'reload schema';
commit;
