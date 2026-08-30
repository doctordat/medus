-- MEDUS pre-launch waitlist v1
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  role_label text,
  school_or_workplace text,
  target_exam text,
  interests text[] not null default '{}',
  consent_updates boolean not null default true,
  source text not null default 'medus_homepage',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_unique
  on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

drop policy if exists "public can join waitlist" on public.waitlist_signups;
create policy "public can join waitlist"
on public.waitlist_signups
for insert
to anon, authenticated
with check (
  email is not null
  and length(trim(email)) between 5 and 254
  and consent_updates = true
);

drop policy if exists "staff can read waitlist" on public.waitlist_signups;
create policy "staff can read waitlist"
on public.waitlist_signups
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('editor','reviewer','admin')
  )
);

comment on table public.waitlist_signups is 'Pre-launch MEDUS users requesting product launch updates.';