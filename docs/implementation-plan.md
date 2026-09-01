# MEDUS Learner Phased Implementation Plan v1

## Phase 0 — Contracts (current checkpoint)
- Approve `information-architecture.md`, `WIREFRAMES_P0.md`, `design-tokens.md`, `component-inventory.md`.
- Acceptance: owner direction approved; no route/code migration yet.

## Phase 1 — Shared shell + tokens
- Extract pure HTML/JS shell helpers and migrate Home/Learn first.
- Add desktop sidebar, topbar, mobile bottom nav, focus shell.
- QA: route links, `aria-current`, keyboard/focus, 44px targets, 390px/1280px screenshots.
- Rollback: keep page-specific markup/styles until each route passes.

## Phase 2 — Home + Learn Library
- Replace static/demo progress with derived view model where data exists.
- Clinical Problem cards show exact published `N/13` and one next action.
- QA: loading/empty/error/incomplete/locked; no fake metrics.

## Phase 3 — Clinical Problem Hub + resources
- Add left TOC/center article/right action rail desktop.
- Mobile collapse TOC and inline resource/practice cards.
- Resource cards consume typed manifest; HTTPS/same-origin sanitizer; published/public entitlement.
- QA: image/PDF/YouTube/link states, attribution, accessibility, scroll restoration.

## Phase 4 — QBank focus + remediation
- Hide sidebar in focus mode.
- Explanation blocks: correct/incorrect, why options fail, exact Learn anchor, resource/case CTA.
- Persist unsaved/attempt state safely; no silent loss.
- QA: answer states, refresh/back, sync error, premium gate.

## Phase 5 — Cases
- Human review CP2 before learner publish.
- Dynamic 3–5 step case renderer, decision feedback and case attempt mapping.
- QA: published-only, progressive reveal, mobile timeline, retry/remediation.

## Phase 6 — Mastery
- Derived weak areas and one prioritized next action.
- Learn → Resource → QBank/Case remediation path.
- QA: no-attempt/insufficient-data/error states; numerator/denominator context.

## Phase 7 — Tools/Store/Premium/Mock
- Add placeholders and entitlement abstraction without payment scope creep.
- Mock uses focus shell; Tools/Store use shared access gate.

## Release gates per phase
1. Local static tests pass.
2. Browser desktop/mobile smoke pass.
3. Data states verified against runtime schema/RLS.
4. Medical review/publish semantics unchanged.
5. Diff reviewed; reversible commit; owner approval before production push.

## Regression checklist
- Published-only queries.
- 13-section count accuracy.
- URL/resource sanitization.
- QBank/Case attempts ownership.
- Weak-area deep links.
- Admin separation.
- No secret/service-role key in client.
- No production data mutation during UI-only phases.
