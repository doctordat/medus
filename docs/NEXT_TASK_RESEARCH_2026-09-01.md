# MEDUS next-task research — 2026-09-01

## Current baseline
- Static GitHub Pages app; no build/package test harness.
- P0 pipeline remains incomplete: Learn shows Sốt 8/13 and Đau ngực 11/13 published sections.
- Case CP2 exists with 3 steps, provenance, status `review`; human medical review is still required before publish.
- Resource table/RLS is applied; one CP2 image resource is published. YouTube seed exists locally but was not reliably applied because SQL/browser session became unstable.
- Admin routes now include authoring, resource library, assessment review and resource review.
- Pre-Reviewer agent exists read-only for structural/provenance checks.

## Priority options and dependencies
| Priority | Recommended next work | Dependencies | Risk |
|---|---|---|---|
| P0 correctness | Complete 13/13 Sốt + Đau ngực | Canonical sources, human review, stable ingestion | Highest medical/content risk |
| Governance | Quiz provenance remediation | Human reviewer + exact source locators | Existing published quizzes lack locators |
| UX | Learner Case/Quiz interaction polish | Published reviewed fixtures | Can hide correctness gaps |
| Content media | Apply YouTube draft + add PDF | Stable Supabase session + URLs/license | Public media/license risk |
| Platform | Mastery remediation | Attempt schema + section mappings | Cross-module coupling |

## Recommendation
1. Do not apply more content mutations while SQL/browser session is unstable.
2. Human reviewer should review Case CP2 using `docs/CASE_CP2_HUMAN_MEDICAL_REVIEW.md`.
3. In parallel, add local automated tests for URL allowlists, resource visibility, case step ordering and published-only queries.
4. Then run a precise quiz provenance audit and prepare a remediation migration; do not silently unpublish existing questions.
5. Resume YouTube/PDF only with a clean SQL tab and idempotent seed/read-back.

## Known documentation drift
`docs/P0_AUDIT.md` still contains early statements saying no Supabase writes/migrations occurred. Those statements describe the initial audit, not the current overall state; a follow-up status section should distinguish initial audit from later approved production migrations/resource publish.
