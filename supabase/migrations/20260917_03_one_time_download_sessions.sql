-- One server-owned download session per issued nonce. A signed browser cookie
-- is not enough on its own: without this ledger it could be replayed until it
-- expires. The table is intentionally private to service_role.
begin;

create table if not exists public.download_access_sessions (
  nonce text primary key check (nonce ~ '^[A-Za-z0-9_-]{1,120}$'),
  mod_id text not null check (char_length(mod_id) between 1 and 200),
  ready_at timestamptz not null,
  expires_at timestamptz not null check (expires_at > ready_at),
  vip boolean not null default false,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists download_access_sessions_expiry_idx
  on public.download_access_sessions (expires_at);

alter table public.download_access_sessions enable row level security;
drop policy if exists download_access_sessions_no_client on public.download_access_sessions;
create policy download_access_sessions_no_client on public.download_access_sessions
  for all to anon, authenticated using (false) with check (false);

revoke all privileges on table public.download_access_sessions from public, anon, authenticated;
grant select, insert, update, delete on table public.download_access_sessions to service_role;

comment on table public.download_access_sessions is
  'Private one-time download session ledger. A nonce can be consumed once after its server-side wait.';

commit;
