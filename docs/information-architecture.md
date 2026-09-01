# MEDUS Information Architecture & Navigation v1

## Product shell
MEDUS Learner is one clinical learning system, not a set of disconnected pages. Admin is a separate console and never appears in learner navigation.

## Sitemap / ownership

```text
Learner shell
├── /home/                 Home / Dashboard
├── /hoc/                  Learn Library
│   └── /hoc/<problem>/    Clinical Problem Hub
├── /qbank/                QBank (focus mode)
├── /cases/                Progressive Clinical Cases
├── /mock/                 Mock Exam (focus mode)
├── /mastery/              Mastery / remediation
├── /tools/                Clinical Tools (future-ready)
├── /store/                MEDUS Store (future-ready)
├── /auth/                 Account / Auth
└── /more/                 Mobile overflow for secondary modules

Admin console (separate)
└── /admin/
    ├── /admin/problems/
    ├── /admin/normalize/
    ├── /admin/review/
    ├── /admin/authoring/
    ├── /admin/resources/
    ├── /admin/review-assessments/
    └── /admin/review-resources/
```

Current static route aliases may remain during migration, but new links should use this ownership model.

## Desktop navigation
Persistent sidebar for normal learner workspace:
1. Home
2. Learn
3. QBank
4. Cases
5. Mock
6. Mastery
7. Tools
8. Store

Topbar: global search, account/avatar, plan/access badge and contextual action. Admin link is not a default learner nav item; it may appear only for authorized staff in an account menu.

## Mobile navigation
Bottom nav prioritizes the learning loop:
- Home
- Learn
- QBank
- Cases
- More

More contains Mastery, Tools, Store and Account. Do not make mobile a shrunken desktop sidebar. Keep primary action buttons reachable with a minimum 44px target.

## Focus modes
QBank and Mock hide the persistent sidebar and reduce topbar to logo/back, progress/timer, flag and account-safe controls. Exiting focus mode returns to the previous route without losing question state.

## Clinical Problem Hub navigation
Desktop layout:
- Left: section TOC and progress.
- Center: article/clinical reasoning content.
- Right: resource, QBank, Case and Tool actions.

Mobile layout:
- Compact section selector after header.
- Resource/practice actions as cards or accordion after the relevant section.
- Safety disclaimer and published count always remain visible.

## CTA/deep-link rules
- Home Continue → exact Learn problem/section.
- Quiz wrong answer → exact Learn section + related resource/case.
- Learn section → focused QBank or Case using `clinical_problem_id` + `section_key`.
- Mastery weak area → one prioritized next action, never a dead-end chart.
- Resource links preserve access state and open external targets safely.

## Access states
All modules use an entitlement abstraction, not scattered login checks:
- `public`: visible to everyone when published.
- `free`: visible to authenticated free users when published.
- `premium`: show metadata/upgrade gate unless entitled.

Draft/review/rejected content is never learner-visible. Medical review status is independent from access level.

## State conventions
Every route needs loading, empty, error, incomplete-content and access-denied states. Never show a fake 13/13 or fake mastery percentage. Admin errors must not leak into learner UI.

## Canonical routes and legacy redirects
- Learner entry point: `/home/` (GitHub Pages root may redirect to `/home/` during migration).
- Learn library: `/hoc/`; Clinical Problem canonical URL: `/hoc/?slug=<clinical-problem-slug>`.
- Legacy `/hoc/<slug>/` pages redirect or link to the canonical query URL; no new feature should depend on duplicate article paths.
- Admin remains under `/admin/` and is never a learner nav destination.

## Route-state matrix

| Route | Data source | Access | Loading/empty/error/locked | Current status |
|---|---|---|---|---|
| `/home/` | local + future profile/mastery | public/auth | graceful demo/empty; never fake mastery | partial/provisional |
| `/hoc/` | published CP/sections/resources | public + entitlement | loading, no published content, query error, premium gate | live MVP |
| `/qbank/` | published questions + own attempts | public/auth for attempts | no questions, sync failure, focus/resume state | live MVP |
| `/cases/` | published cases/steps + own attempts | public/auth for attempts | no cases, draft hidden, sync failure | fallback + dynamic prototype |
| `/mastery/` | own mastery/attempts | authenticated | unauthenticated CTA, empty mastery, query error | partial |
| `/tools/`, `/store/` | future resource/entitlement model | public/auth/premium | locked metadata/upgrade state | target/placeholder |

## Remediation contract
`question_id → clinical_problem_id → section_key → Learn URL anchor`; optional related resource/case is selected only when it is `published` and permitted by access level. If the section is missing/archived, fall back to the Clinical Problem hub; if premium, show an entitlement gate rather than leaking content. Wrong-answer CTA must preserve the question result until the learner leaves or resumes.

## Mobile collapse rules
Clinical Problem Hub order on mobile: header/status → compact TOC selector → article section → section resources → related QBank/Case CTA. The left TOC becomes a disclosure/select; the right rail becomes inline cards/accordion after the relevant section. Keep the active section and scroll position on close/open where possible.

## Focus-mode rules
QBank/Mock focus mode has a visible exit-to-previous-route action, browser Back returns to the prior route, refresh resumes only from persisted state, and unsaved answer state must be visibly indicated. No silent loss of a selected answer.

## Accessibility rules
Use skip-to-content, semantic landmarks, `aria-current` for active nav, logical keyboard order, focus restoration after mobile menu/TOC close, visible focus rings, safe-area padding for mobile bottom nav, and minimum 44px touch targets. These are acceptance requirements, not optional polish.

## Implementation status
The route/state/remediation rules above are target contracts. Existing static pages implement only part of them; wireframes and implementation must mark unsupported states rather than implying they already work.

## Migration notes
- Current Home/Learn/QBank/Cases/Mastery routes are static HTML; implement shell incrementally.
- `/tools/` and `/store/` can begin as placeholders with correct nav ownership.
- QBank/Mock focus mode should be implemented before broad visual polish.
- Preserve Draft → Medical Review → Publish and RLS semantics throughout navigation changes.
