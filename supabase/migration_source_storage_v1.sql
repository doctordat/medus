-- MEDUS Source Storage v1
-- Run once in Supabase SQL Editor.
-- Private bucket for medical source files uploaded by editor/reviewer/admin.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medus-sources',
  'medus-sources',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.sources add column if not exists storage_bucket text;
alter table public.sources add column if not exists storage_path text;
alter table public.sources add column if not exists original_filename text;
alter table public.sources add column if not exists mime_type text;
alter table public.sources add column if not exists file_size_bytes bigint;
alter table public.sources add column if not exists extraction_status text not null default 'not_started';
alter table public.sources add column if not exists extraction_error text;
alter table public.sources add column if not exists extracted_at timestamptz;

-- Admin roles are stored server-side in public.profiles.
drop policy if exists "medus source files staff read" on storage.objects;
create policy "medus source files staff read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'medus-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  )
);

drop policy if exists "medus source files staff insert" on storage.objects;
create policy "medus source files staff insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'medus-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  )
);

drop policy if exists "medus source files staff update" on storage.objects;
create policy "medus source files staff update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'medus-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  )
)
with check (
  bucket_id = 'medus-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  )
);

drop policy if exists "medus source files admin delete" on storage.objects;
create policy "medus source files admin delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'medus-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

comment on column public.sources.storage_path is 'Private Supabase Storage object path. Never a public URL.';
comment on column public.sources.extraction_status is 'not_started | queued | extracting | extracted | failed | normalized';