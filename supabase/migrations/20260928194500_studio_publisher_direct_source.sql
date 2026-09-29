begin;

alter table public.mods
  add column if not exists guide_mcstructure_url text;

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
  showcase_cover_url, guide_mcstructure_url, guide_schem_url, spin_video_url,
  studio_board_url, available_formats, downloads, rating, created_at
) on public.mods to anon, authenticated;

notify pgrst, 'reload schema';
commit;
