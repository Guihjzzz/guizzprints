-- Run once in the Supabase SQL Editor, after migrations 01 and 02.
-- Public catalog columns remain readable. Download destinations and all
-- client-side writes remain forbidden, including for signed-in admins.
begin;

revoke all privileges on table public.mods from public, anon, authenticated;

-- Table-level REVOKE does not remove older column-level grants.
do $$
declare
  column_list text;
begin
  select string_agg(quote_ident(attname), ', ')
    into column_list
    from pg_attribute
    where attrelid = 'public.mods'::regclass
      and attnum > 0 and not attisdropped;
  execute format(
    'revoke all privileges (%s) on table public.mods from public, anon, authenticated',
    column_list
  );
end;
$$;

alter table public.mods enable row level security;
drop policy if exists public_catalog_read on public.mods;
create policy public_catalog_read on public.mods
  for select to anon, authenticated using (true);

-- Only columns already included in public_mods. Never grant table-wide SELECT.
grant select (
  id, title, author, category, subcategory, description, version, file_size,
  price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, downloads, rating, created_at
) on public.mods to anon, authenticated;

alter view public.public_mods set (security_invoker = true, security_barrier = true);
revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on public.public_mods to anon, authenticated;
comment on view public.public_mods is
  'Public catalog using caller permissions, RLS and explicit column grants. Download URLs remain private.';

-- Fail the whole transaction if a role still inherits sensitive access.
do $$
declare
  reader text;
  col record;
  migration_role text := current_user;
  expected_count bigint;
  visible_count bigint;
begin
  select count(*) into expected_count from public.mods;
  foreach reader in array array['anon', 'authenticated'] loop
    if has_table_privilege(reader, 'public.mods', 'SELECT')
      or has_table_privilege(reader, 'public.mods', 'INSERT,UPDATE,DELETE,TRUNCATE')
      or has_column_privilege(reader, 'public.mods', 'terabox_url', 'SELECT') then
      raise exception 'Unexpected private catalog permissions for %', reader;
    end if;
    for col in select attname from pg_attribute
      where attrelid = 'public.mods'::regclass and attnum > 0 and not attisdropped loop
      if has_column_privilege(reader, 'public.mods', col.attname, 'INSERT,UPDATE,REFERENCES') then
        raise exception 'Unexpected writable column % for %', col.attname, reader;
      end if;
    end loop;
    -- Check the actual invoker view under each reader role. Existing restrictive
    -- policies must not silently hide catalog entries after this migration.
    execute format('set local role %I', reader);
    select count(*) into visible_count from public.public_mods;
    execute format('set local role %I', migration_role);
    if visible_count <> expected_count then
      raise exception 'Catalog visibility changed for %; inspect existing restrictive RLS policies', reader;
    end if;
  end loop;
end;
$$;

notify pgrst, 'reload schema';
commit;
