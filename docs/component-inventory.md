# MEDUS Learner Component Inventory v1

Status: specification after current UI audit, IA, wireframes and tokens. Components are contracts, not a claim that every route is implemented.

## Shell/navigation

| Component | Responsibility | Props/data | Variants/states | Responsive/a11y |
|---|---|---|---|---|
| `AppShell` | Shared learner frame | activeRoute, user, entitlement | normal/focus/locked | landmark main; skip link |
| `Sidebar` | Desktop primary nav | navItems, activeRoute | expanded/collapsed | hidden in focus; `aria-current` |
| `Topbar` | Search/account/access | query, user, plan | normal/focus/auth | keyboard search, account menu |
| `MobileBottomNav` | 5 primary actions | activeRoute, moreItems | normal/More open | safe-area, 44px targets |
| `FocusHeader` | QBank/Mock distraction-free | progress, timer, exit | timer/paused/sync error | escape/back/unsaved warning |

## Navigation and progress

| Component | Responsibility | Props/data | States |
|---|---|---|---|
| `GlobalSearch` | Find CP/resource/question | query, results | loading/empty/error |
| `FilterChip` | Domain/status filter | label, selected, onSelect | default/active/disabled |
| `ClinicalProblemCard` | Scan a topic | title, domain, publishedCount, slug, nextAction | incomplete/locked/empty |
| `ContinueLearningCard` | Resume one action | lastRoute, section, progress | no activity/loading |
| `ProgressBar` | Numerator/denominator | current,total,label | zero/partial/complete |
| `MasteryBadge` | Semantic mastery state | score, context | unknown/weak/steady/strong |
| `CompetencyMeter` | Competency-level signal | competency, correct,total | empty/derived |
| `ActionCard` | One next best action | title, reason, href, icon | primary/secondary/locked |

## Article and Clinical Problem Hub

| Component | Responsibility | Props/data | States |
|---|---|---|---|
| `ClinicalProblemHeader` | Title/status/disclaimer | CP metadata, publishedCount | loading/incomplete/error |
| `StickyTOC` | Section navigation | orderedSections, activeKey | desktop sticky/mobile disclosure |
| `ArticleSection` | Render reviewed content | key,title,content_md | empty/error/published |
| `SafetyGate` | High-salience danger block | redFlags, sourceLocator | reviewed/warning |
| `DecisionPoint` | IF/THEN reasoning | condition, action, rationale | reviewed/needs-review |
| `ClinicalPearl` | High-yield summary | text, source | reviewed |
| `PitfallBlock` | Error prevention | text, severity | reviewed/warning |
| `ResourceRail` | Related actions/resources | resources, entitlement | empty/locked/loading |
| `PracticeCTA` | Link to QBank/Case | CP, sectionKey, target | available/locked |

## Resource/media

| Component | Responsibility | Props/data | Variants |
|---|---|---|---|
| `ResourceCard` | Unified resource surface | type,title,url,caption,access,status | image/youtube/pdf/link/tool |
| `FigureCard` | Image/diagram | url,alt,caption,attribution | loaded/error |
| `VideoCard` | Safe YouTube/external video | url,title,caption | safe/blocked |
| `PDFCard` | PDF link | url,title,source | safe/blocked |
| `ToolCard` | Clinical tool CTA | slug,title,access | public/free/premium |
| `AccessGate` | Entitlement boundary | accessLevel,reason,cta | free/premium/unauth |

All media URLs are sanitized; no arbitrary iframe/HTML. Image requires alt/caption/attribution before review. Resource `published + public` is the only learner-visible state.

## QBank

| Component | Responsibility | Props/data | States |
|---|---|---|---|
| `QuestionMeta` | CP/section/competency context | mapping, difficulty, bloom | visible/compact |
| `QuestionStem` | Primary question object | stem | loading/error |
| `AnswerOption` | Select one answer | label, selected, disabled | default/selected/correct/incorrect |
| `QuestionProgress` | Progress/timer | current,total,time | normal/paused |
| `SubmitBar` | Submit/next/flag | canSubmit, saving | disabled/syncing |
| `ExplanationBlock` | Why correct/incorrect | answer, rationale, alternatives | available/missing |
| `WeakAreaCTA` | Remediation action | CP,section,reason | learn/resource/case |
| `ReviewLaterControl` | Save revisit intent | questionId, saved | saved/unsaved |

QBank focus mode hides sidebar. Wrong answer preserves result and links to exact Learn anchor, optional published resource/case.

## Clinical Cases

| Component | Responsibility | Props/data | States |
|---|---|---|---|
| `CaseCard` | Case entry | title,summary,stepCount,access | published/locked |
| `CaseTimeline` | Step progress | steps,current | 1–5/complete |
| `RevealedData` | Progressive vignette/vitals | data,unit,label | hidden/revealed |
| `DecisionCard` | Step options | options,selected,correct | default/feedback |
| `CaseFeedback` | Reasoning feedback | feedback,source | correct/incorrect |
| `CaseSummary` | Result/remediation | score,missed,nextAction | empty/complete/sync error |

## Mastery

| Component | Responsibility | Props/data | States |
|---|---|---|---|
| `MasteryOverview` | Overall context | score,attempts,lastUpdated | empty/loading/error |
| `WeakAreaList` | Prioritized weaknesses | rows,threshold | empty/derived |
| `RecommendationCard` | One next action | reason,target,priority | actionable/insufficient data |
| `AttemptHistory` | Recent attempts | attempts | empty/paginated |
| `RemediationPath` | Learn → resource → practice | CP,section,targets | available/locked/fallback |

## Cross-cutting states

`LoadingState`, `EmptyState`, `ErrorState`, `IncompleteContentState`, `AccessGate`, `ReviewStatusBadge`, `SyncStatus`, `Toast`, `ConfirmationDialog`.

Every state needs accessible text, not color alone. Draft/review/rejected are editorial states and never appear as learner content. `N/13` must be derived from published rows.

## Reuse matrix

| Route | Shell | Cards | Article | Resources | QBank | Cases | Mastery |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | ✓ | ✓ | — | ✓ | CTA | CTA | snapshot |
| Learn Library | ✓ | CP | — | — | CTA | CTA | — |
| Clinical Hub | ✓ | — | ✓ | ✓ | CTA | CTA | — |
| QBank | focus | — | explanation | ✓ | ✓ | — | weak CTA |
| Cases | focus/normal | case | — | ✓ | related | ✓ | result CTA |
| Mastery | ✓ | action | — | ✓ | remediation | remediation | ✓ |

## Implementation status
- Existing static HTML pages: many provisional implementations with duplicated markup.
- Shared token CSS: compatibility layer, not full component migration.
- Resource/case/quiz contracts: partially backed by Supabase and review routes.
- AppShell, MobileBottomNav, full QBank focus, remediation path and Mastery recommendation: target phases.
