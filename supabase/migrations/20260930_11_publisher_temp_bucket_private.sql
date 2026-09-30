-- The publisher uses this bucket only for short-lived upload fragments.
-- Keep it private: the server reads fragments with the service key and then
-- removes them after forwarding the assembled file to GitHub Releases.
begin;

insert into storage.buckets (id, name, public, file_size_limit)
values ('guizz-publisher', 'guizz-publisher', false, 5242880)
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880;

drop policy if exists guizz_publisher_public_read on storage.objects;

commit;
