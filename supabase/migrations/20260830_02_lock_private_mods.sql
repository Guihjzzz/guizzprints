-- Run this migration only AFTER the application update is live and the
-- catalog has been verified through public.public_mods.

-- Even if an old permissive RLS policy still exists, these roles can no
-- longer query or mutate the private table through the public API.
revoke all privileges on table public.mods from public, anon, authenticated;

-- Download counts are updated only by the protected server route. The loop
-- covers the function even if its argument type changes or it has overloads.
do $$
declare
  target_function regprocedure;
begin
  for target_function in
    select p.oid::regprocedure
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'increment_download'
  loop
    execute format(
      'revoke execute on function %s from public, anon, authenticated',
      target_function
    );
    execute format(
      'grant execute on function %s to service_role',
      target_function
    );
  end loop;
end;
$$;
