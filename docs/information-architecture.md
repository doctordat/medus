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

## Migration notes
- Current Home/Learn/QBank/Cases/Mastery routes are static HTML; implement shell incrementally.
- `/tools/` and `/store/` can begin as placeholders with correct nav ownership.
- QBank/Mock focus mode should be implemented before broad visual polish.
- Preserve Draft → Medical Review → Publish and RLS semantics throughout navigation changes.
