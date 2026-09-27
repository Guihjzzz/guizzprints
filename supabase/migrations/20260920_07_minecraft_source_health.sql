-- Health state for procedural Marketplace refreshes.
-- The source URL and diagnostics remain private on public.mods.
alter table public.mods
  add column if not exists source_last_checked_at timestamptz,
  add column if not exists source_sync_status text,
  add column if not exists source_sync_error text,
  add column if not exists source_sync_failed_at timestamptz;

alter table public.mods
  drop constraint if exists mods_source_sync_status_check;

alter table public.mods
  add constraint mods_source_sync_status_check
  check (source_sync_status is null or source_sync_status in ('ok', 'checking', 'error'));

-- Rows imported before this health state existed are considered healthy until
-- their first scheduled or on-demand check proves otherwise.
update public.mods
set source_sync_status = 'ok'
where source_provider = 'minecraft_marketplace'
  and source_url is not null
  and source_sync_status is null;

create index if not exists mods_minecraft_source_health_idx
  on public.mods (source_last_checked_at nulls first, id)
  where source_provider = 'minecraft_marketplace' and source_url is not null;

comment on column public.mods.source_last_checked_at is
  'Private timestamp of the latest Marketplace refresh attempt, successful or failed.';
comment on column public.mods.source_sync_status is
  'Private refresh state: ok, checking, or error.';
comment on column public.mods.source_sync_error is
  'Private generic operator-facing refresh failure reason; never shown publicly.';
comment on column public.mods.source_sync_failed_at is
  'Private timestamp of the latest failed Marketplace refresh.';
