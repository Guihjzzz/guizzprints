-- Keep the official Marketplace source private while allowing the admin
-- workflow and the daily Vercel sync to refresh imported media.
alter table public.mods
  add column if not exists source_url text,
  add column if not exists source_provider text,
  add column if not exists source_synced_at timestamptz,
  add column if not exists source_fingerprint text;

alter table public.mods
  drop constraint if exists mods_source_provider_check;

alter table public.mods
  add constraint mods_source_provider_check
  check (source_provider is null or source_provider = 'minecraft_marketplace');

create index if not exists mods_minecraft_source_sync_idx
  on public.mods (source_synced_at nulls first, id)
  where source_provider = 'minecraft_marketplace' and source_url is not null;

comment on column public.mods.source_url is
  'Private canonical URL used to refresh imported Marketplace metadata.';
comment on column public.mods.source_provider is
  'Private importer identifier; currently minecraft_marketplace only.';
