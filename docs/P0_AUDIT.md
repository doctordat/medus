# MEDUS P0 Audit — 2026-08-31

## Scope and safety
- Source cloned from `https://github.com/doctordat/medus` at `8af8bed` into local `medus/`.
- Working branch: `audit/p0-handover`.
- No Supabase writes, migrations, content publish, or push performed during audit.
- Production references: GitHub Pages and Supabase project in README/config; publishable browser key only. No secret key inspected or added.

## Observed architecture
- Static GitHub Pages app; no package/build step.
- Admin routes: `/admin/`, `/admin/problems/`, `/admin/normalize/`, `/admin/review/`.
- Learner renderer: `assets/learn-public.js`; direct Supabase reads of published `clinical_problems` and `content_sections`.
- Schema/migrations under `supabase/`: core schema, admin content engine, source extraction/storage, waitlist.
- RLS core public policies restrict learner reads to published rows; staff policies are supplied by admin migration via `is_medus_staff()`.

## P0 findings
1. **Canonical parser is shadowed by a legacy/flat parser override.** `admin/normalize/index.html` defines strict `parseCanonical()` and `analyze()`, but `assets/supabase-config.js` later assigns `window.analyze = ...parseFlat(...)` on Normalize pages. This creates two competing engines and undermines the strict parser contract.
2. **Pipeline enforcement is primarily client-side.** The UI disables direct publish and routes through Review, but database policies/functions must be verified in the real project before relying on this as a hard gate.
3. **Learn article renders only sections that exist/publish.** It shows `N/13`, but does not block/flag an accidentally published incomplete Clinical Problem beyond the count; public policy filters status per row rather than enforcing an atomic 13/13 set.
4. **Grounding check is heuristic word matching.** Review uses token matches and can produce false confidence; acceptable as a visible preliminary check, not a substitute for reviewer confirmation.
5. **No package test harness or automated integration/regression tests are present in the repository.**
6. **Resource table abstraction is not present in current migrations.** Media helper currently inserts Markdown URLs; future resource metadata/access control needs a migration and must remain out of unapproved production changes.

## Immediate P0 implementation target
- Remove the Normalize-page `window.analyze` flat-parser override while retaining source deep-link behavior. The strict parser already lives in the Normalize page and must remain the only parser.
- Add local, dependency-free regression tests for canonical heading order/count and parser gate behavior using extracted fixtures for Fever and Chest Pain when available; do not fabricate clinical content or write to Supabase.
- Add learner safety assertion that an article visibly reports incomplete content and never claims a complete 13/13 set unless all canonical keys are present.

## Read-only browser evidence (2026-08-31)
- Local Normalize shell loaded at `/admin/normalize/index.html` and correctly showed `Chưa đăng nhập`; canonical parsing was not executed without an authenticated source.
- Public Learn queried the configured Supabase project and showed an incomplete published dataset: Fever `8/13` (missing `differential`, `investigations`, `decision_points`, `pitfalls`, `clinical_pearls`) and Chest Pain `11/13` (missing `overview`, `management`). The queries selected `content_sections` filtered by the relevant `clinical_problem_id` and `medical_review_status=published`; returned keys were distinct in these responses. This confirms incomplete public content, not the cause or whether re-ingestion is required; draft/review/RLS state remains unverified.
- The browser console output available included a stale 404 from an earlier port; no claim of a clean console is made for the corrected port.

## Production gates before any remote mutation
- Owner approval for exact migration/backfill/publish scope.
- Snapshot/backup and rollback SQL.
- Dry-run or staging verification.
- Review diff and Admin → Review → Publish → Learn E2E with authenticated reviewer.
