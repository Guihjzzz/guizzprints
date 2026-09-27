-- Prevent a user from opening more than one unresolved checkout for a plan
-- within the same provider environment. Sandbox and Live orders are isolated.
-- Completed, refunded, disputed, failed, and cancelled orders are not covered
-- so a legitimate later purchase remains possible after reconciliation.
begin;

create unique index if not exists vip_orders_one_open_plan_idx
  on public.vip_orders (user_id, plan_id, dev_mode)
  where status in ('pending', 'checkout_created');

comment on index public.vip_orders_one_open_plan_idx is
  'Only one pending or checkout-created VIP order per user, plan, and environment; preserves later repurchase after resolution.';

commit;
