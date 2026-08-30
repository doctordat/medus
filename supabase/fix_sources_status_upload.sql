-- MEDUS hotfix: frontend upload must use an allowed sources.status value.
-- Run once in Supabase SQL Editor if an upload failed with sources_status_check.

-- The original sources table allows:
-- uploaded, extracted, normalized, draft_generated, reviewed, published, archived
-- No schema change is required. This query is intentionally safe and verifies the constraint state.

select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.sources'::regclass
  and conname = 'sources_status_check';