-- Bind every payment application to the provider checkout ID persisted for
-- the server-owned order. A NULL stored ID remains valid only for the narrow
-- recovery case where the provider response could not be persisted.
begin;

create or replace function public.apply_vip_payment_checked(
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
  v_provider_checkout_id text;
begin
  select o.provider_checkout_id
    into v_provider_checkout_id
    from public.vip_orders as o
   where o.external_id = p_external_id
   for update;

  if not found then
    raise exception 'payment order not found' using errcode = 'P0002';
  end if;

  if v_provider_checkout_id is not null
     and v_provider_checkout_id <> p_provider_checkout_id then
    raise exception 'provider checkout does not match order' using errcode = '22023';
  end if;

  return query
    select * from public.apply_vip_payment(
      p_external_id,
      p_provider_checkout_id,
      p_status,
      p_product_id,
      p_amount_cents,
      p_dev_mode,
      p_paid_at
    );
end;
$$;

revoke all on function public.apply_vip_payment_checked(text, text, text, text, integer, boolean, timestamptz)
  from public, anon, authenticated;
grant execute on function public.apply_vip_payment_checked(text, text, text, text, integer, boolean, timestamptz)
  to service_role;

comment on function public.apply_vip_payment_checked(text, text, text, text, integer, boolean, timestamptz)
  is 'Applies a Mercado Pago payment only when its provider checkout remains bound to the server-owned order.';

notify pgrst, 'reload schema';
commit;
