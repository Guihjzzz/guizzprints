-- Persist source metadata returned by the official Minecraft Marketplace API.
--
-- These fields deliberately use the source_ prefix and are not added to
-- public.public_mods.  The public catalog view has an explicit column list,
-- and the private mods table is already locked to the server role by the
-- preceding catalog migrations.
alter table public.mods
  add column if not exists source_creator text,
  add column if not exists source_tags jsonb,
  add column if not exists source_published_at timestamptz;

alter table public.mods
  drop constraint if exists mods_source_tags_array_check;

alter table public.mods
  add constraint mods_source_tags_array_check
  check (source_tags is null or jsonb_typeof(source_tags) = 'array');

comment on column public.mods.source_creator is
  'Private creator or author name reported by the official Marketplace source.';
comment on column public.mods.source_tags is
  'Private JSON array of normalized tags reported by the official Marketplace source.';
comment on column public.mods.source_published_at is
  'Private publication timestamp reported by the official Marketplace source.';
