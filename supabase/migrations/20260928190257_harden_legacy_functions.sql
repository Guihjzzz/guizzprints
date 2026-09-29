-- Legacy functions from the predecessor schema are not part of Guizzprints.
-- They remain available for their existing database triggers, but cannot be
-- invoked through the public Data API.
begin;

revoke all on function public.handle_deleted_supabase_user() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.increment_item_download(uuid) from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;

notify pgrst, 'reload schema';
commit;
