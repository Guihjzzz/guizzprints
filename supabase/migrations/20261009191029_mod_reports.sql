begin;

-- Reports belong to one public catalog entry. Bedrock and Java are separate
-- rows, so a report never silently applies to both editions.
create table public.mod_reports (
  id uuid primary key default gen_random_uuid(),
  mod_id uuid references public.mods(id) on delete set null,
  mod_title text not null check (char_length(trim(mod_title)) between 1 and 200),
  edition text not null check (edition in ('bedrock', 'java')),
  category text not null default '' check (char_length(category) <= 100),
  reason text not null check (reason in (
    'download_broken', 'wrong_file', 'wrong_images',
    'wrong_description', 'wrong_edition_or_version', 'other'
  )),
  details text not null default '' check (char_length(details) <= 1500),
  reporter_id text not null check (char_length(trim(reporter_id)) between 1 and 255),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mod_reports_created_at_idx on public.mod_reports (created_at desc, id);
create index mod_reports_status_created_at_idx on public.mod_reports (status, created_at desc, id);
create index mod_reports_mod_created_at_idx on public.mod_reports (mod_id, created_at desc);
create index mod_reports_reporter_created_at_idx on public.mod_reports (reporter_id, created_at desc);

alter table public.mod_reports enable row level security;
revoke all privileges on table public.mod_reports from public, anon, authenticated;
grant select, insert, update on table public.mod_reports to service_role;

notify pgrst, 'reload schema';

commit;
