alter table public.submissions
  add column if not exists icon_url text;

alter table public.companies
  add column if not exists icon_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-icons',
  'project-icons',
  true,
  1048576,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "project_icons_public_insert" on storage.objects;

create policy "project_icons_public_insert"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'project-icons');
