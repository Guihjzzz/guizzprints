-- Complete base schema for a fresh Guizzprints Supabase project.
-- Generated visual media and file payloads live in GitHub Releases; the
-- database stores only catalog data and private direct-download destinations.
begin;

create table if not exists public.mods (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  author text not null default 'Guizzprints' check (char_length(trim(author)) between 1 and 160),
  category text not null check (category in ('bedrock', 'java')),
  subcategory text not null check (char_length(trim(subcategory)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 12000),
  version text not null default '1.0.0' check (char_length(trim(version)) between 1 and 50),
  file_size text not null default 'N/A' check (char_length(file_size) <= 80),
  price text not null default 'Free' check (char_length(price) <= 80),
  terabox_url text not null check (char_length(trim(terabox_url)) between 1 and 2000),
  youtube_trailer_url text,
  image_url_1 text,
  image_url_2 text,
  image_url_3 text,
  image_url_4 text,
  image_url_5 text,
  image_url_6 text,
  image_url_7 text,
  image_url_8 text,
  showcase_cover_url text,
  guide_mcstructure_url text,
  guide_schem_url text,
  spin_video_url text,
  studio_board_url text,
  download_formats jsonb not null default '[]'::jsonb
    check (jsonb_typeof(download_formats) = 'array'),
  available_formats text[] not null default '{}'::text[],
  downloads integer not null default 0 check (downloads >= 0),
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  source_url text,
  source_provider text check (source_provider is null or source_provider = 'minecraft_marketplace'),
  source_synced_at timestamptz,
  source_fingerprint text,
  source_last_checked_at timestamptz,
  source_sync_status text check (source_sync_status is null or source_sync_status in ('ok', 'checking', 'error')),
  source_sync_error text,
  source_sync_failed_at timestamptz,
  source_creator text,
  source_tags jsonb check (source_tags is null or jsonb_typeof(source_tags) = 'array'),
  source_published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mods_catalog_recent_idx on public.mods (created_at desc, id);
create index if not exists mods_catalog_category_recent_idx on public.mods (category, created_at desc, id);
create index if not exists mods_catalog_downloads_idx on public.mods (downloads desc, id);
create index if not exists mods_minecraft_source_sync_idx
  on public.mods (source_synced_at nulls first, id)
  where source_provider = 'minecraft_marketplace' and source_url is not null;
create index if not exists mods_minecraft_source_health_idx
  on public.mods (source_last_checked_at nulls first, id)
  where source_provider = 'minecraft_marketplace' and source_url is not null;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  mod_id uuid not null references public.mods(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

-- This Supabase project already contained an empty favorites table from a
-- previous site. Keep its historical columns, while making the current app's
-- user_id/mod_id shape available without removing any existing rows.
alter table public.favorites add column if not exists id uuid default gen_random_uuid();
alter table public.favorites add column if not exists mod_id uuid references public.mods(id) on delete cascade;
alter table public.favorites alter column id set not null;
alter table public.favorites drop constraint if exists favorites_pkey;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'favorites' and column_name = 'item_id'
  ) then
    alter table public.favorites alter column item_id drop not null;
  end if;
end;
$$;
alter table public.favorites add primary key (id);
create unique index if not exists favorites_user_mod_id_idx
  on public.favorites (user_id, mod_id) where mod_id is not null;

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  mod_id uuid not null references public.mods(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

create table if not exists public.download_access_sessions (
  nonce text primary key check (nonce ~ '^[A-Za-z0-9_-]{1,120}$'),
  mod_id uuid not null references public.mods(id) on delete cascade,
  format_id text not null default 'default' check (char_length(format_id) between 1 and 32),
  ready_at timestamptz not null,
  expires_at timestamptz not null check (expires_at > ready_at),
  vip boolean not null default false,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists download_access_sessions_expiry_idx
  on public.download_access_sessions (expires_at);
create index if not exists download_access_sessions_mod_format_idx
  on public.download_access_sessions (mod_id, format_id, expires_at);

alter table public.mods enable row level security;
alter table public.admins enable row level security;
alter table public.favorites enable row level security;
alter table public.ratings enable row level security;
alter table public.download_access_sessions enable row level security;

drop policy if exists public_catalog_read on public.mods;
create policy public_catalog_read on public.mods
  for select to anon, authenticated using (true);

drop policy if exists favorites_select_own on public.favorites;
create policy favorites_select_own on public.favorites
  for select to authenticated using ((select auth.uid())::text = user_id);
drop policy if exists favorites_insert_own on public.favorites;
create policy favorites_insert_own on public.favorites
  for insert to authenticated with check ((select auth.uid())::text = user_id);
drop policy if exists favorites_delete_own on public.favorites;
create policy favorites_delete_own on public.favorites
  for delete to authenticated using ((select auth.uid())::text = user_id);

drop policy if exists ratings_select_own on public.ratings;
create policy ratings_select_own on public.ratings
  for select to authenticated using ((select auth.uid())::text = user_id);
drop policy if exists ratings_insert_own on public.ratings;
create policy ratings_insert_own on public.ratings
  for insert to authenticated with check ((select auth.uid())::text = user_id);
drop policy if exists ratings_update_own on public.ratings;
create policy ratings_update_own on public.ratings
  for update to authenticated using ((select auth.uid())::text = user_id)
  with check ((select auth.uid())::text = user_id);

drop policy if exists admins_no_client on public.admins;
create policy admins_no_client on public.admins
  for all to anon, authenticated using (false) with check (false);
drop policy if exists download_access_sessions_no_client on public.download_access_sessions;
create policy download_access_sessions_no_client on public.download_access_sessions
  for all to anon, authenticated using (false) with check (false);

revoke all privileges on table public.mods from public, anon, authenticated;
revoke all privileges on table public.admins from public, anon, authenticated;
revoke all privileges on table public.download_access_sessions from public, anon, authenticated;
revoke all privileges on table public.favorites from public, anon;
revoke all privileges on table public.ratings from public, anon;

grant select (
  id, title, author, category, subcategory, description, version, file_size,
  price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, image_url_5, image_url_6, image_url_7, image_url_8,
  showcase_cover_url, guide_mcstructure_url, guide_schem_url, spin_video_url, studio_board_url,
  available_formats, downloads, rating, created_at
) on public.mods to anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update on public.ratings to authenticated;
grant select, insert, update, delete on public.mods to service_role;
grant select, insert, update, delete on public.admins to service_role;
grant select, insert, update, delete on public.download_access_sessions to service_role;

create or replace view public.public_mods
with (security_barrier = true, security_invoker = true)
as
select
  id, title, author, category, subcategory, description, version, file_size,
  price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, image_url_5, image_url_6, image_url_7, image_url_8,
  showcase_cover_url, guide_mcstructure_url, guide_schem_url, spin_video_url, studio_board_url,
  available_formats, downloads, rating, created_at
from public.mods;

revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on public.public_mods to anon, authenticated;

create or replace function public.increment_download(mod_id uuid)
returns void
language sql
security invoker
set search_path = pg_catalog, public
as $$
  update public.mods
  set downloads = downloads + 1
  where id = mod_id;
$$;

revoke all on function public.increment_download(uuid) from public, anon, authenticated;
grant execute on function public.increment_download(uuid) to service_role;

comment on table public.mods is
  'Private Guizzprints catalog. Public clients use public.public_mods; external download URLs never leave this table.';
comment on table public.download_access_sessions is
  'Server-owned one-time download sessions. The service role is the only API caller.';
comment on view public.public_mods is
  'Public catalog projection. Direct download destinations and source metadata are excluded.';

notify pgrst, 'reload schema';
commit;
