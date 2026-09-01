-- PROPOSAL ONLY: review in staging before applying.
-- The table migration intentionally enabled RLS but did not create policies.
create policy "resources_public_published_read" on public.clinical_problem_resources
for select to anon, authenticated
using (medical_review_status = 'published' and access_level = 'public');
create policy "resources_staff_all" on public.clinical_problem_resources
for all to authenticated
using (public.is_medus_staff()) with check (public.is_medus_staff());
grant select on public.clinical_problem_resources to anon, authenticated;
grant insert, update, delete on public.clinical_problem_resources to authenticated;
