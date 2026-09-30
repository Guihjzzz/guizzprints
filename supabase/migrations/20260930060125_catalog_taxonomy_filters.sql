begin;

-- A shared classification is stored on each half of a Bedrock + Java pair.
-- Arrays keep multi-theme and multi-category filtering simple and indexable.
alter table public.mods
  add column if not exists content_themes text[] not null default '{}'::text[],
  add column if not exists content_size text,
  add column if not exists content_categories text[] not null default '{}'::text[];

alter table public.mods
  drop constraint if exists mods_content_themes_allowed,
  drop constraint if exists mods_content_size_allowed,
  drop constraint if exists mods_content_categories_allowed;

alter table public.mods
  add constraint mods_content_themes_allowed check (
    content_themes <@ array['Ancestral', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Outro']::text[]
  ),
  add constraint mods_content_size_allowed check (
    content_size is null or content_size in ('Pequeno', 'Médio', 'Grande', 'Enorme')
  ),
  add constraint mods_content_categories_allowed check (
    content_categories <@ array[
      'Arenas', 'Castelos', 'Masmorras', 'Jogos', 'Casas e lojas', 'Variado',
      'Pedra vermelha', 'Templos', 'Torres', 'Cidades', 'Ilhas Flutuantes',
      'Jardins', 'Ilhas', 'Arte em pixel', 'Estátuas e esculturas', 'Barcos',
      'Máquinas Voadoras', 'Veículos terrestres'
    ]::text[]
  );

create index if not exists mods_catalog_content_themes_idx
  on public.mods using gin (content_themes);
create index if not exists mods_catalog_content_categories_idx
  on public.mods using gin (content_categories);
create index if not exists mods_catalog_content_size_recent_idx
  on public.mods (content_size, created_at desc, id);

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
  guide_schem_url,
  spin_video_url,
  studio_board_url,
  available_formats,
  downloads,
  rating,
  created_at,
  -- Keep the historic public-view order intact; new columns are appended.
  guide_mcstructure_url,
  content_themes,
  content_size,
  content_categories
from public.mods;

-- public_mods is security_invoker, so its public columns must also be
-- explicitly readable from the backing table. Download URLs stay private.
grant select (
  id, title, author, category, subcategory, description, version, file_size,
  price, youtube_trailer_url, image_url_1, image_url_2, image_url_3,
  image_url_4, image_url_5, image_url_6, image_url_7, image_url_8,
  showcase_cover_url, guide_mcstructure_url, guide_schem_url, spin_video_url,
  studio_board_url, available_formats, content_themes, content_size,
  content_categories, downloads, rating, created_at
) on public.mods to anon, authenticated;

revoke all privileges on table public.public_mods from public, anon, authenticated;
grant select on public.public_mods to anon, authenticated;

notify pgrst, 'reload schema';
commit;
