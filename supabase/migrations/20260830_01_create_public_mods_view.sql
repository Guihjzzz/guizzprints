-- Run this migration BEFORE deploying the application update.
-- Public visitors will read this view instead of the private mods table.
-- terabox_url is deliberately omitted.
create or replace view public.public_mods
with (security_barrier = true, security_invoker = false)
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
  created_at
from public.mods;

alter view public.public_mods owner to postgres;

comment on view public.public_mods is
  'Public mod catalog. Download destinations are intentionally excluded.';

revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on table public.public_mods to anon, authenticated;
