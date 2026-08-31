-- PROPOSAL ONLY: do not apply without owner approval, backup and staging.
create table if not exists public.clinical_problem_resources (
  id uuid primary key default gen_random_uuid(),
  clinical_problem_id integer not null references public.clinical_problems(id) on delete cascade,
  section_key text,
  resource_type text not null check (resource_type in ('image','youtube','pdf','external_link','internal_link','clinical_tool','qbank','case','download')),
  title text not null,
  url text not null,
  alt_text text,
  caption text,
  attribution_license text,
  source_id uuid references public.sources(id) on delete set null,
  source_locator text,
  sort_order integer not null default 0,
  access_level text not null default 'public' check (access_level in ('public','free','premium')),
  medical_review_status text not null default 'draft' check (medical_review_status in ('draft','reviewed','published','rejected')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  content_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.clinical_problem_resources enable row level security;
-- Policies/grants must be reviewed and added in staging; no policy is auto-applied by this proposal.
