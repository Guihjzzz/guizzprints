-- Harden legacy public functions reported by the Supabase security advisor.
-- The server's service_role remains the only caller of increment_download;
-- trigger/event-trigger execution is unaffected by EXECUTE revocations.
begin;

alter function public.increment_download(uuid)
  set search_path = pg_catalog, public;
alter function public.update_mod_rating()
  set search_path = pg_catalog, public;

revoke execute on function public.rls_auto_enable()
  from public, anon, authenticated;
revoke execute on function public.update_mod_rating()
  from public, anon, authenticated;
revoke execute on function public.increment_download(uuid)
  from public, anon, authenticated;
grant execute on function public.increment_download(uuid) to service_role;

commit;
