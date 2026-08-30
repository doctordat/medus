-- MEDUS Supabase Schema v1.1
-- Core tables for Learn, QBank, Cases, Attempts and Mastery.
-- Safe to re-run: policies are dropped before recreation.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'learner' check (role in ('learner','editor','reviewer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clinical_problems (
  id integer primary key,
  slug text unique not null,
  title text not null,
  domain text not null,
  blueprint_min_pct numeric,
  blueprint_max_pct numeric,
  priority integer not null default 0,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  clinical_problem_id integer not null references public.clinical_problems(id) on delete cascade,
  section_key text not null,
  title text,
  content_md text,
  source_title text,
  source_locator text,
  medical_review_status text not null default 'draft' check (medical_review_status in ('draft','reviewed','published','rejected')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(clinical_problem_id, section_key)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  clinical_problem_id integer not null references public.clinical_problems(id) on delete cascade,
  section_key text,
  stem text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A','B','C','D')),
  explanation_a text,
  explanation_b text,
  explanation_c text,
  explanation_d text,
  competency text not null check (competency in ('basic_science','diagnosis','management','practice_learning_improvement','communication_professionalism','systems_patient_safety')),
  bloom text not null default 'apply' check (bloom in ('apply','analyze','evaluate','create')),
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  tags text[] not null default '{}',
  source_title text,
  source_locator text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  clinical_problem_id integer not null references public.clinical_problems(id) on delete cascade,
  title text not null,
  summary text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_steps (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  step_order integer not null,
  section_key text,
  competency text not null check (competency in ('basic_science','diagnosis','management','practice_learning_improvement','communication_professionalism','systems_patient_safety')),
  prompt text not null,
  revealed_data jsonb not null default '{}'::jsonb,
  options jsonb not null,
  correct_index integer not null,
  feedback text,
  created_at timestamptz not null default now(),
  unique(case_id, step_order)
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option text not null check (selected_option in ('A','B','C','D')),
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create table if not exists public.case_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  score integer not null,
  total integer not null,
  missed jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

create table if not exists public.mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  clinical_problem_id integer not null references public.clinical_problems(id) on delete cascade,
  section_key text not null,
  competency text not null,
  correct_count integer not null default 0,
  attempt_count integer not null default 0,
  mastery_score numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, clinical_problem_id, section_key, competency)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.clinical_problems enable row level security;
alter table public.content_sections enable row level security;
alter table public.questions enable row level security;
alter table public.cases enable row level security;
alter table public.case_steps enable row level security;
alter table public.question_attempts enable row level security;
alter table public.case_attempts enable row level security;
alter table public.mastery enable row level security;

-- Drop/recreate policies so this migration can safely be run again.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "published_clinical_problems_read" on public.clinical_problems;
drop policy if exists "published_content_read" on public.content_sections;
drop policy if exists "published_questions_read" on public.questions;
drop policy if exists "published_cases_read" on public.cases;
drop policy if exists "published_case_steps_read" on public.case_steps;
drop policy if exists "question_attempts_select_own" on public.question_attempts;
drop policy if exists "question_attempts_insert_own" on public.question_attempts;
drop policy if exists "case_attempts_select_own" on public.case_attempts;
drop policy if exists "case_attempts_insert_own" on public.case_attempts;
drop policy if exists "mastery_select_own" on public.mastery;
drop policy if exists "mastery_insert_own" on public.mastery;
drop policy if exists "mastery_update_own" on public.mastery;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "published_clinical_problems_read" on public.clinical_problems for select using (status = 'published');
create policy "published_content_read" on public.content_sections for select using (medical_review_status = 'published');
create policy "published_questions_read" on public.questions for select using (status = 'published');
create policy "published_cases_read" on public.cases for select using (status = 'published');
create policy "published_case_steps_read" on public.case_steps for select using (exists (select 1 from public.cases c where c.id = case_id and c.status = 'published'));
create policy "question_attempts_select_own" on public.question_attempts for select using (auth.uid() = user_id);
create policy "question_attempts_insert_own" on public.question_attempts for insert with check (auth.uid() = user_id);
create policy "case_attempts_select_own" on public.case_attempts for select using (auth.uid() = user_id);
create policy "case_attempts_insert_own" on public.case_attempts for insert with check (auth.uid() = user_id);
create policy "mastery_select_own" on public.mastery for select using (auth.uid() = user_id);
create policy "mastery_insert_own" on public.mastery for insert with check (auth.uid() = user_id);
create policy "mastery_update_own" on public.mastery for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.clinical_problems (id, slug, title, domain, blueprint_min_pct, blueprint_max_pct, priority, status)
values (2, 'tiep-can-benh-nhan-sot', 'Tiếp cận bệnh nhân sốt', 'Hệ Miễn dịch', 3, 5, 5, 'published')
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  domain = excluded.domain,
  blueprint_min_pct = excluded.blueprint_min_pct,
  blueprint_max_pct = excluded.blueprint_max_pct,
  priority = excluded.priority,
  status = excluded.status,
  updated_at = now();
