-- New public VIP catalog. Legacy IDs remain valid for historical orders and
-- entitlements, but the application no longer offers them for new checkout.
begin;

alter table public.vip_orders
  drop constraint if exists vip_orders_plan_id_check;
alter table public.vip_orders
  add constraint vip_orders_plan_id_check
  check (plan_id in ('daily', 'weekly', 'monthly', 'fortnightly', 'quarterly', 'yearly'));

alter table public.vip_entitlements
  drop constraint if exists vip_entitlements_plan_id_check;
alter table public.vip_entitlements
  add constraint vip_entitlements_plan_id_check
  check (plan_id in ('daily', 'weekly', 'monthly', 'fortnightly', 'quarterly', 'yearly'));

notify pgrst, 'reload schema';
commit;
