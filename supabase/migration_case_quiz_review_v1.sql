-- PROPOSAL ONLY: do not apply without owner + medical review approval.
-- Adds provenance/review fields missing from current cases/case_steps/questions.

alter table public.cases add column if not exists source_id uuid references public.sources(id) on delete set null;
alter table public.cases add column if not exists source_locator text;
alter table public.cases add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.cases add column if not exists reviewed_at timestamptz;
alter table public.cases add column if not exists published_at timestamptz;
alter table public.cases add column if not exists content_version integer not null default 1;

alter table public.case_steps add column if not exists source_locator text;
alter table public.case_steps add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.case_steps add column if not exists reviewed_at timestamptz;

alter table public.questions add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.questions add column if not exists reviewed_at timestamptz;
alter table public.questions add column if not exists published_at timestamptz;
alter table public.questions add column if not exists content_version integer not null default 1;

-- Existing staff CRUD policies can cover these fields; verify RLS/grants in staging first.
-- No automatic status transition is defined here. Publish remains a separate Review action.
