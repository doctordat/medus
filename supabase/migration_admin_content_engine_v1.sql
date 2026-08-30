-- MEDUS Admin + Content Engine v1
-- Run once in Supabase SQL Editor after schema.sql v1.1

create or replace function public.is_medus_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  );
$$;

-- Remove unsafe self-update policy: learners must not be able to promote their own role.
drop policy if exists "profiles_update_own" on public.profiles;

-- Staff can read profiles for editorial/admin workflows.
drop policy if exists "profiles_staff_read" on public.profiles;
create policy "profiles_staff_read" on public.profiles
for select using (auth.uid() = id or public.is_medus_staff());

-- Source registry: PDFs, Word docs, guidelines, URLs and notes are INPUTS only.
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  clinical_problem_id integer references public.clinical_problems(id) on delete set null,
  source_type text not null check (source_type in ('pdf','word','google_doc','url','notes','guideline','other')),
  source_title text not null,
  source_url text,
  source_date date,
  source_version text,
  storage_path text,
  status text not null default 'uploaded' check (status in ('uploaded','extracted','normalized','draft_generated','reviewed','published','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sources enable row level security;
drop policy if exists "sources_staff_all" on public.sources;
create policy "sources_staff_all" on public.sources
for all using (public.is_medus_staff()) with check (public.is_medus_staff());

-- Audit fields used by the ingestion standard.
alter table public.content_sections add column if not exists source_id uuid references public.sources(id) on delete set null;
alter table public.content_sections add column if not exists content_version integer not null default 1;
alter table public.content_sections add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.content_sections add column if not exists reviewed_at timestamptz;
alter table public.content_sections add column if not exists published_at timestamptz;

alter table public.questions add column if not exists source_id uuid references public.sources(id) on delete set null;
alter table public.questions add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.questions add column if not exists reviewed_at timestamptz;
alter table public.questions add column if not exists published_at timestamptz;

alter table public.cases add column if not exists source_id uuid references public.sources(id) on delete set null;
alter table public.cases add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.cases add column if not exists reviewed_at timestamptz;
alter table public.cases add column if not exists published_at timestamptz;

-- Staff CRUD policies for CMS-managed content.
do $$
declare
  t text;
begin
  foreach t in array array['clinical_problems','content_sections','questions','cases','case_steps']
  loop
    execute format('drop policy if exists %I on public.%I', t || '_staff_all', t);
    execute format('create policy %I on public.%I for all using (public.is_medus_staff()) with check (public.is_medus_staff())', t || '_staff_all', t);
  end loop;
end $$;

-- Prevent client-side role changes. Role promotion remains a deliberate SQL/admin operation.
revoke update(role) on public.profiles from authenticated;

grant select on public.profiles to authenticated;
grant select on public.clinical_problems to anon, authenticated;
grant select on public.content_sections to anon, authenticated;
grant select on public.questions to anon, authenticated;
grant select on public.cases to anon, authenticated;
grant select on public.case_steps to anon, authenticated;
grant select, insert, update, delete on public.sources to authenticated;
grant insert, update, delete on public.clinical_problems to authenticated;
grant insert, update, delete on public.content_sections to authenticated;
grant insert, update, delete on public.questions to authenticated;
grant insert, update, delete on public.cases to authenticated;
grant insert, update, delete on public.case_steps to authenticated;
