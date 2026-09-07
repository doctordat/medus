-- MEDUS AI V1
-- Additive schema only. Existing mastery/qbank/case tables remain authoritative.

create table if not exists public.ai_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  interaction_type text not null check (interaction_type in ('qbank_explain','mastery_coach','case_examiner')),
  clinical_problem_id bigint,
  question_id text,
  case_id text,
  section_key text,
  competency text,
  model_provider text,
  model_name text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  confidence numeric,
  insufficient_evidence boolean not null default false,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists ai_interactions_user_created_idx
  on public.ai_interactions(user_id, created_at desc);
create index if not exists ai_interactions_problem_idx
  on public.ai_interactions(clinical_problem_id, section_key);

create table if not exists public.ai_citations (
  id uuid primary key default gen_random_uuid(),
  interaction_id uuid not null references public.ai_interactions(id) on delete cascade,
  source_id text not null,
  source_title text,
  source_locator text not null,
  clinical_problem_id bigint,
  section_key text,
  content_version text,
  quoted_text text,
  relevance_score numeric,
  created_at timestamptz not null default now()
);

create index if not exists ai_citations_interaction_idx
  on public.ai_citations(interaction_id);

create table if not exists public.learner_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  priority_clinical_problem_id bigint,
  priority_section_key text,
  priority_competency text,
  reason text not null,
  recommended_activity text not null check (recommended_activity in ('learn','qbank','case','review')),
  target_count integer,
  target_difficulty text,
  source_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','completed','dismissed','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists learner_recommendations_user_idx
  on public.learner_recommendations(user_id, status, created_at desc);

create table if not exists public.review_schedule (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  clinical_problem_id bigint,
  section_key text,
  competency text,
  ease_factor numeric not null default 2.5,
  interval_days integer not null default 0,
  repetitions integer not null default 0,
  due_at timestamptz not null default now(),
  last_result boolean,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.ai_interactions enable row level security;
alter table public.ai_citations enable row level security;
alter table public.learner_recommendations enable row level security;
alter table public.review_schedule enable row level security;

-- Learners can read their own AI traces and recommendations.
create policy "ai_interactions_select_own" on public.ai_interactions
for select using (auth.uid() = user_id);

create policy "learner_recommendations_select_own" on public.learner_recommendations
for select using (auth.uid() = user_id);

create policy "review_schedule_select_own" on public.review_schedule
for select using (auth.uid() = user_id);

-- Citations are visible only when parent interaction belongs to the current learner.
create policy "ai_citations_select_own" on public.ai_citations
for select using (
  exists (
    select 1 from public.ai_interactions i
    where i.id = ai_citations.interaction_id
      and i.user_id = auth.uid()
  )
);

-- Writes are intentionally not granted to browser clients here.
-- Server-side Edge Functions/service role should own inserts/updates for AI tables.
