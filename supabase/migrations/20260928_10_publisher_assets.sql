-- Guizz Publisher: generated Guide 3D media stays public, while external
-- download destinations remain private in mods.download_formats.
begin;

alter table public.mods
  add column if not exists image_url_6 text,
  add column if not exists image_url_7 text,
  add column if not exists image_url_8 text,
  add column if not exists showcase_cover_url text,
  add column if not exists guide_mcstructure_url text,
  add column if not exists guide_schem_url text,
  add column if not exists spin_video_url text,
  add column if not exists studio_board_url text,
  add column if not exists download_formats jsonb not null default '[]'::jsonb,
  add column if not exists available_formats text[] not null default '{}'::text[];

alter table public.mods
  drop constraint if exists mods_download_formats_array;

alter table public.mods
  add constraint mods_download_formats_array
  check (jsonb_typeof(download_formats) = 'array');

alter table public.download_access_sessions
  add column if not exists format_id text not null default 'default';

create index if not exists download_access_sessions_mod_format_idx
  on public.download_access_sessions (mod_id, format_id, expires_at);

insert into storage.buckets (id, name, public, file_size_limit)
values ('guizz-publisher', 'guizz-publisher', true, 104857600)
on conflict (id) do update set public = true, file_size_limit = 104857600;

drop policy if exists guizz_publisher_public_read on storage.objects;
create policy guizz_publisher_public_read
  on storage.objects for select to public
  using (bucket_id = 'guizz-publisher');

-- Keep every download URL out of the visitor-facing projection. Visitors only
-- receive the identifiers that have a real file published for the item.
create or replace view public.public_mods
with (security_barrier = true, security_invoker = true)
as
select
  id,
  title,
  author,
  category,
  subcategory,
  description,
  version,
  file_size,
  price,
  youtube_trailer_url,
  image_url_1,
  image_url_2,
  image_url_3,
  image_url_4,
  image_url_5,
  image_url_6,
  image_url_7,
  image_url_8,
  showcase_cover_url,
  guide_mcstructure_url,
  guide_schem_url,
  spin_video_url,
  studio_board_url,
  available_formats,
  downloads,
  rating,
  created_at
from public.mods;

revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on public.public_mods to anon, authenticated;

grant select (
  id, title, author, category, subcategory, description, version, file_size,
  price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, image_url_5, image_url_6, image_url_7, image_url_8,
  showcase_cover_url, guide_mcstructure_url, guide_schem_url, spin_video_url, studio_board_url,
  available_formats, downloads, rating, created_at
) on public.mods to anon, authenticated;

notify pgrst, 'reload schema';
commit;
