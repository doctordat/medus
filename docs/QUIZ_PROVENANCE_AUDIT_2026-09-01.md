# Quiz provenance audit — 2026-09-01

## Scope
Read-only query of `public.questions` with `status = 'published'`, selecting mapping and provenance fields. No update, delete, unpublish or publish performed.

## Findings
Five published CP2/Sốt questions were returned. All five have `source_id = null` and `source_locator = null` in the response:

| Question ID | Section | Competency | Bloom | Difficulty | Status | Provenance |
|---|---|---|---|---|---|---|
| 00000000-0000-4000-8000-000000000001 | safety_gate | management | apply | medium | published | BLOCK: no source/locator |
| 00000000-0000-4000-8000-000000000002 | safety_gate | diagnosis | apply | medium | published | BLOCK: no source/locator |
| 00000000-0000-4000-8000-000000000003 | special_cases | management | apply | medium | published | BLOCK: no source/locator |
| 00000000-0000-4000-8000-000000000004 | special_cases | management | apply | medium | published | BLOCK: no source/locator |
| 00000000-0000-4000-8000-000000000005 | investigations | diagnosis | apply | medium | published | BLOCK: no source/locator |

## Recommendation
- Do not silently invent locators or mark these questions reviewed.
- Human reviewer should map each question to the canonical Fever source and verify stem, options, answer and explanation.
- After provenance is confirmed, use a narrowly scoped backfill/update with an explicit audit trail; consider temporarily quarantining/unpublishing only with owner approval and rollback plan.
- The existing QBank learner can still render these rows, but their provenance gap must be visible to editorial/admin users.
