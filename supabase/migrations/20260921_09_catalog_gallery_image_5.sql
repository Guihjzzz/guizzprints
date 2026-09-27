-- Add one optional gallery slot without exposing private download fields.
-- Run this migration before the application deployment that writes image_url_5.
begin;

alter table public.mods
  add column if not exists image_url_5 text;

-- PostgreSQL permits adding a column at the end of CREATE OR REPLACE VIEW.
-- Keep the public projection explicit so Terabox and Marketplace metadata stay
-- private while the fifth optional image is available to public item pages.
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
  downloads,
  rating,
  created_at,
  image_url_5
from public.mods;

alter view public.public_mods owner to postgres;
alter view public.public_mods set (security_invoker = true, security_barrier = true);

revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on table public.public_mods to anon, authenticated;
grant select (id, title, author, category, subcategory, description, version,
  file_size, price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, image_url_5, downloads, rating, created_at)
  on public.mods to anon, authenticated;

comment on view public.public_mods is
  'Public mod catalog with five optional gallery images. Download destinations remain private.';

notify pgrst, 'reload schema';
commit;
