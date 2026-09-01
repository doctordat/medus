# MEDUS Learner Gap Analysis v1

Baseline: `origin/main` deployed vs `audit/p0-handover` branch vs Supabase/runtime evidence.

| Area | Current evidence | Target | Gap | Priority | Action |
|---|---|---|---|---|---|
| Shell | Per-page static nav/CSS | Shared AppShell/sidebar/topbar/mobile nav | No shared runtime component | P1 | Extract pure HTML/render helpers + tokens |
| Home | Command-center copy/cards, some static metrics | Real next action from mastery/attempts | Data model/query thin | P1 | Add derived view model, preserve empty state |
| Learn Library | Search/domain filters, published counts | Clinical Problem hub entry + continue | Continue/remediation partial | P1 | Add action rail contracts |
| Clinical Hub | Article/TOC/resource cards | Left TOC/center/right action rail | Right rail and section actions partial | P1 | Refactor section/resource components |
| QBank | Interactive, dynamic published CP2 + fallback | Focus mode + full explanation/remediation | Fallback/hard-coded CP2, focus shell partial | P1 | Make data-driven question model |
| Cases | Dynamic published query + fallback demo | Progressive case UX + attempts | No published Case, fallback dominates | P1 | Human review CP2, then dynamic learner QA |
| Mastery | Own data/local fallback | Prioritized remediation path | Recommendation model thin | P1 | Define derived recommendation contract |
| Resources | Table/RLS/UI/learner cards | Reusable typed resource system | YouTube pending, review flow partial | P1 | Complete review/access states |
| Tools/Store | Placeholder routes/spec | Future-ready access layer | No real entitlement/product model | P2 | Placeholder shell only |
| Mock | Placeholder | Focus exam flow | Not implemented | P2 | After QBank focus contract |
| Medical gate | Draft/review/publish policies/docs | Human gate everywhere | Case/quiz/resource review UI partial | P0 | Never bypass; add audit trail |
| Provenance | Article/case fields; quiz backfill | Exact source/locator per claim | Candidate locators need human verify | P0 | Human review/backfill correction |
| Tests | Python/Node contract tests | Browser/E2E + visual/accessibility | Runtime coverage incomplete | P0 | Add fixtures and browser checks |

## Keep/refactor/build-new
- **Keep:** existing MEDUS palette, content 13-section contract, Supabase RLS, Learn Markdown sanitizer, QBank/Case domain tables.
- **Refactor:** duplicated nav/card/status/loading CSS, hard-coded fallback data, per-page Supabase initialization, inconsistent route aliases.
- **Build new:** shared shell helpers, resource/access view model, remediation view model, Case/Quiz Review UI, focus mode, Mastery recommendations.

## Data gaps
- Resource table exists with RLS, but typed learner/admin adapter is partial.
- Case/quiz review metadata exists partly after migration; full review/publish audit UI is missing.
- No canonical remediation table/view; derive from attempts + mappings first.
- No entitlement abstraction runtime beyond access-level field.

## Risks and migration strategy
- Treat branch UI/token work as provisional until wireframe/component contracts are approved.
- Ship route-by-route, never big-bang.
- Each phase must preserve published-only filters and medical review gates.
- Before production content mutations: snapshot, narrow allowlist, read-back, rollback SQL.
