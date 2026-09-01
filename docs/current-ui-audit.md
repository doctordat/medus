# MEDUS Current UI Audit — Task 1

Date: 2026-09-02
Scope: current repository branch `audit/p0-handover`; read-only audit, no production mutation.

## Route map

| Area | Route/file | Current role | Data/dependency | Gap/risk |
|---|---|---|---|---|
| Learner | `/home/` | Landing/command center | local countdown, static CTAs | Progress surfaces partly demo/static |
| Learner | `/hoc/` | Learn catalog/article | Supabase published CP/sections/resources | Clinical hub still article-first; right action rail incomplete |
| Learner | `/qbank/` | Interactive starter QBank | Supabase published questions; attempts/mastery | Focus mode not isolated; remediation partly hard-coded CP2 |
| Learner | `/cases/` | Progressive case | Supabase published case fallback demo; attempts | Fallback demo remains; no full dynamic case UX for draft/review |
| Learner | `/mastery/` | Mastery dashboard | Supabase mastery + local fallback | Next-action/remediation model is thin |
| Learner | `/mock/` | Mock placeholder | static shell | Not implemented |
| Learner | `/tai-lieu/` | Resource placeholder | static shell | Not connected to resource/store model |
| Learner | `/auth/` | OAuth/account entry | Supabase Auth/Google | Auth state shared by origin; local port instability |
| Admin | `/admin/` | CMS dashboard | staff Supabase reads/writes | Single-file monolith; many responsibilities mixed |
| Admin | `/admin/normalize/` | Canonical normalize | sources/content_sections | Strict gate exists; extraction integration needs E2E |
| Admin | `/admin/review/` | Article review/publish | content_sections/sources | Heuristic grounding; phrase-level review missing |
| Admin | `/admin/authoring/` | Case/Quiz draft prototype | cases/questions/case_steps | Production Save; schema/review gaps remain |
| Admin | `/admin/resources/` | Resource draft library | clinical_problem_resources | Edit/list/filter exists; UI needs full review lifecycle |
| Admin | `/admin/review-assessments/` | Case/Quiz review audit | cases/questions/case_steps | Partial status workflow; quiz review remains read-only |
| Admin | `/admin/review-resources/` | Resource review audit | resources | Read-only only |
| Admin | `/admin/problems/` | CP metadata CRUD | clinical_problems | Needs unified shell and safe role UX |

## Component map

### Existing/reusable
- App-like sidebar/header patterns exist in Home/Admin, but are not shared components.
- `ClinicalProblemCard`, catalog filters, article section/TOC, progress bars, chips/badges.
- Resource renderers: image, YouTube card, PDF card, external link.
- QBank question/answer/feedback/weak-area blocks.
- Case step/vitals/options/feedback/result blocks.
- Auth/session guard and Supabase client initialization repeated per page.
- CSS tokens now shared via `assets/learner-tokens.css`, with page-specific overrides.

### Duplicated/inconsistent
- Inline CSS and inline JS in every HTML route; no component build system.
- Repeated nav/header, card, button, badge, empty/error patterns.
- Hard-coded CP2/Sốt fallback content in QBank/Cases/Home.
- Different status names/labels between article, assessment and resource review.
- Learner data loading and fallback behavior differs by route.
- Review/provenance checks are not one shared adapter.

## Target gap matrix

| Target | Current | Action |
|---|---|---|
| Persistent desktop shell | Partial, page-specific | Refactor gradually after IA approval |
| Mobile bottom nav | Not present consistently | Phase 1 shell work |
| Clinical Problem learning hub | Article + resource section | Add section action rail and related practice cards |
| QBank focus mode | Interactive page with global nav | Add distraction-free mode |
| Wrong answer remediation | Basic anchor CTA | Add shared weak-area action contract |
| Mastery next action | Basic dashboard | Define remediation data model before UI |
| Resource component system | Image/PDF/YouTube cards | Unify types/access/review state |
| Tools/Store/Premium IA | Routes/spec only | Placeholders first; no scattered access if/else |
| Human medical gate | Present in policy/docs | Preserve; never move into client-only styling |

## Risk list
1. Published CP2 quiz content previously lacked provenance; now backfilled with candidate locators requiring human confirmation.
2. Learn Sốt/Đau ngực remain incomplete at 8/13 and 11/13; redesign must not mask this.
3. Supabase auth/session and local server ports are unstable for browser E2E.
4. Static single-file architecture increases regression risk; avoid big-bang rewrite.
5. Resource/case/quiz review metadata depends on migrations and RLS already partly applied.
6. Demo fallbacks can be mistaken for production content; labels must remain explicit.
7. Medical claims, media attribution and guideline currency require human review.

## Baseline matrix: deployed vs branch vs runtime

| Surface | `origin/main` deployed baseline | `audit/p0-handover` branch | Production/runtime evidence |
|---|---|---|---|
| Learner Home/Learn/QBank/Cases/Mastery | Existing static MVP | Includes provisional UX/token/dynamic-renderer changes | Route load and selected Supabase reads observed; branch not deployed |
| Admin pipeline | Existing Admin/Normalize/Review | Adds authoring, resource, assessment-review and extractor changes | Authenticated admin reads observed intermittently; E2E session unstable |
| Resource table/RLS | Not in original deployed baseline | Migration/proposals and resource UI present | Resource table/RLS applied in Supabase; one image published, YouTube seed not confirmed applied |
| Case provenance/review | Legacy fields/partial review | Provenance migration + partial Review Queue | CP2 exists in `review`, not published; human medical review pending |
| Quiz provenance | Published rows lacked provenance | Five CP2 rows backfilled with candidate locators | Read-back showed 5/5 fields present; human content verification pending |
| UI redesign | Existing production styling | Provisional branch-only polish/tokens/spec | No GitHub Pages deploy of branch; live production remains `origin/main` |

**Evidence rule:** claims above distinguish source files, branch-only code, and observed production data. Unknowns remain marked unverified when browser/session instability prevented direct confirmation.

## Design direction
Use MEDUS clinical/professional visual language: off-white/light blue-gray background, teal/navy, white surfaces, restrained borders/shadows, dense but readable information, no purple AI SaaS/neon/cartoon gamification. Benchmark patterns are used for information architecture only, not visual cloning.
