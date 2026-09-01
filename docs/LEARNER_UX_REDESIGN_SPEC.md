# MEDUS Learner UX Redesign Spec v1

## Benchmark note
Direct web search was unavailable during this pass, so this spec uses broadly observed Vietnamese exam-prep patterns rather than copying any specific site: clear exam goal/countdown, dashboard-first progress, topic cards, short action CTAs, practice loops, visible weak-area remediation, mobile-first dense controls, and clear locked/published states.

## Product stance
MEDUS is not a generic question bank. The primary loop is **Clinical Problem → Learn → Quiz → Weak section → Case → Mastery**. Every screen should move the learner toward the next reasoning action.

## Information architecture
- Home: goal/countdown, continue learning, priority weak area, quick actions.
- Learn: searchable Clinical Problem cards, domain filters, published section count, resource/case/quiz links.
- Quiz: one question per screen, progress, answer feedback, remediation CTA.
- Cases: progressive steps, decision feedback, completion summary.
- Mastery: problem/section/competency progress and next recommended action.

## Design tokens
- Navy `#0b3440`: primary text/strong headings.
- Teal `#008d98`: action/links/progress.
- Cyan soft `#eaf8f9`: selected states and info cards.
- Warm warning `#fff7e7`: review/attention states.
- Red `#fff0ee`: errors and safety warnings.
- Surface: white cards, 14–22px radius, restrained shadow.
- Typography: large editorial heading, 15–16px learner body, 11–12px metadata.

## Component rules
- `GoalHeader`: one clear goal, one primary CTA, compact progress.
- `ContinueCard`: last activity + next action; never fake progress.
- `ClinicalProblemCard`: title, domain, published count/13, next action.
- `ResourceCard`: type, title, thumbnail/icon, caption, access and review state.
- `ProgressBar`: always show numerator/denominator; incomplete content must be explicit.
- `FeedbackPanel`: correct/incorrect, reasoning, exact Learn section link.
- `EmptyState`: explain why content is unavailable and next safe action.

## Responsive rules
- Mobile width: one-column cards; sticky/compact action bar; buttons min 44px.
- Desktop: max-width 1180px, two-column article shell, three-column catalog cards.
- Never hide safety disclaimer or content status on mobile.

## Non-negotiables
- Learner reads only published rows under RLS.
- Never claim 13/13 when fewer sections exist.
- Draft/review/rejected content is not learner-visible.
- Medical content/resource/case/quiz publish remains human-gated.
