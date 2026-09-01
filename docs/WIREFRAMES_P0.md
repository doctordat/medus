# MEDUS P0 Learner Wireframes

Low/mid-fi product wireframe pack. **Not final visual implementation.** Desktop is 1280px; mobile is 390px. Use MEDUS tokens and IA spec.

## 1. Home / Dashboard

**Primary task:** know what to do next in under 5 seconds.

Desktop:
```text
┌ Sidebar: Home Learn QBank Cases Mock Mastery Tools Store ┐
│ Topbar: MEDUS | Search | Account/PRO                    │
│ Goal header: Kỳ ĐGNL 2027 · [Continue learning]         │
│ ┌ Continue card ─────────────┐ ┌ Today / mastery ─────┐ │
│ │ Sốt · section 3/13         │ │ Overall —             │ │
│ │ [Continue Learn]            │ │ Weak area: —         │ │
│ └────────────────────────────┘ │ [Practice now]       │ │
│ ┌ Clinical Problems ─────────────────────────────────┐ │
│ │ [Sốt 8/13] [Đau ngực 11/13] [Browse library]       │ │
│ └─────────────────────────────────────────────────────┘ │
│ Next loop: Learn → QBank → Case → Mastery               │
└────────────────────────────────────────────────────────┘
```
Mobile: topbar + goal header → Continue card → one priority action → horizontal CP cards → bottom nav Home/Learn/QBank/Cases/More.

States: loading skeleton; no activity → Start with Learn; incomplete CP → show `8/13`, never fake complete; auth/premium gates are explicit.

## 2. Learn Library

**Primary task:** find a Clinical Problem and choose the next action.

Desktop: topbar/search → title + published count → filters/domain chips → 3-column CP cards (title/domain/progress/next action) → optional Continue strip.
Mobile: search → filter button → one-column cards → sticky bottom nav.

Card: `Clinical Problem`, title, domain, `N/13 sections`, status, `[Open]`.
States: loading cards; empty search; query error retry; unpublished/incomplete content visibly labeled.

## 3. Clinical Problem Hub

**Primary task:** reason through one problem and move to practice.

Desktop:
```text
┌ Sidebar/TOC ┐ ┌ Article center ───────────────┐ ┌ Action rail ┐
│ Overview    │ │ Status 8/13 · disclaimer      │ │ Resources   │
│ Safety Gate │ │ Safety Gate                   │ │ [Quiz]      │
│ Mechanism   │ │ body / figure / pearl         │ │ [Case]      │
│ ...         │ │ Decision point                │ │ [PDF/video] │
└─────────────┘ └──────────────────────────────┘ └─────────────┘
```
Mobile: header/status → collapsible TOC → article section → section resources → Quiz/Case CTA. Right rail becomes inline cards; preserve scroll position.

States: section loading; no published content; incomplete N/13; resource locked/premium; source/review metadata never shown as learner editorial noise.

## 4. QBank Question (focus mode)

**Primary task:** answer without distraction.

Desktop: minimal header (back/progress/timer/flag) → question metadata → stem → large answer options → submit/next. Sidebar hidden.
Mobile: compact progress/timer → stem → full-width 44px options → fixed bottom submit.

States: loading; no questions; selected-but-unsaved warning; sync failure keeps local answer; premium locked.
Accessibility: keyboard order stem → options → submit, `aria-current` progress, visible selected/focus state.

## 5. QBank Explanation

**Primary task:** understand the decision and remediate weakness.

Desktop: result banner → correct answer → why correct → why alternatives fail → decision point → weak area card → `[Review Learn section]` `[Watch resource]` `[Try focused questions]`.
Mobile: result → rationale accordion → weak-area CTA stack → related resource/case.

States: correct/incorrect; explanation unavailable; resource unavailable/locked; attempt sync pending/error. Do not expose unreviewed draft explanations.

## 6. Mastery

**Primary task:** choose the highest-value next study action.

Desktop: overall progress + goal → priority action card → CP/section table → competency breakdown → recent attempts → `[Start remediation]`.
Mobile: priority card first → progress strip → weak-area accordion → one primary CTA; charts only when they change the action.

States: unauthenticated CTA; empty mastery → start QBank; loading; sync error with local snapshot; premium locked. Never present a score without numerator/denominator/context.

## Cross-screen CTA contract
- Every primary screen has one dominant CTA.
- Wrong quiz answer links to `/hoc/?slug=<slug>#<section_key>` and preserves result.
- Hub links to QBank/Case with CP + section context.
- Mastery emits one prioritized next action.
- All surfaces preserve published-only/RLS and human medical review constraints.

## Accessibility and responsive acceptance
- Skip link and semantic landmarks.
- `aria-current` on active nav/TOC.
- Focus restored after mobile TOC/menu close.
- 44px minimum touch targets.
- Safe-area padding for bottom nav.
- No critical disclaimer/status hidden on mobile.
