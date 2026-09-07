# MEDUS AI V1 — Adaptive Learning Core

## Goal
Turn the current MEDUS flow `Learn → QBank → Cases → Mastery` into a closed adaptive loop without rewriting the existing static MVP.

The existing MEDUS content-review contract remains authoritative. AI augments reviewed material; it does not replace Medical Review and does not auto-publish medical content.

## V1 scope

### 1. QBank AI Explain (P0)
After a learner submits an answer, add `Hỏi MEDUS AI` next to the reviewed explanation.

Input contract:
- user_id — derived server-side from Supabase auth
- question_id
- selected_option
- correct_option
- clinical_problem_id
- section_key
- competency
- reviewed question context / explanation metadata

Output contract:
- verdict_summary
- reasoning_gap
- why_correct
- why_selected_is_wrong
- one_rule_to_remember
- citations[]
- confidence
- insufficient_evidence

AI supplements, never replaces, the Medical Review explanation. Decision-changing claims require citations. Weak retrieval must return `insufficient_evidence` rather than hallucinating.

### 2. Mastery Coach (P0/P1)
Use learner attempts + mastery to return one concrete next action:
- priority_clinical_problem_id
- priority_section_key
- priority_competency
- reason
- recommended_activity (`learn|qbank|case|review`)
- target_count
- target_difficulty

The current deterministic Mastery fallback remains available if AI is unavailable.

### 3. Adaptive QBank (P1)
Question ranking priority:
1. weak section
2. weak competency
3. spaced-repetition due date
4. difficulty fit
5. recent-exposure penalty

Only published/reviewed questions are eligible. AI-generated questions cannot enter the learner pool without Medical Review.

### 4. AI Clinical Examiner (P1)
Use existing reviewed cases and fixed rubrics. The examiner should:
- progress one prompt at a time
- avoid revealing the final answer before completion
- score against reviewed criteria
- record missed section/competency back into mastery
- cite reviewed MEDUS source material for decision-changing feedback

### 5. Retrieval + citations (P0 infrastructure)
Learner-facing AI retrieves only reviewed/published MEDUS content. Retrieval metadata should include:
- source_id
- source_title
- source_locator
- clinical_problem_id
- section_key
- version
- medical_review_status
- published_at

## V1.1 implementation status

In progress on `medus-ai-v1-implementation`.

Completed code slices:
- `assets/medus-ai.js`: authenticated browser client for `Hỏi MEDUS AI`; no provider secret is exposed client-side.
- `supabase/functions/qbank-ai-explain/index.ts`: CP02-only server-side grounded explanation path.
- published-only retrieval from `content_sections`.
- explicit insufficient-evidence path.
- structured explanation contract.
- trace write to `ai_interactions` and citations to `ai_citations`.

Still required before V1.1 is considered complete:
- wire the `Hỏi MEDUS AI` UI into `qbank/index.html`.
- deploy/apply the additive AI migration to the Supabase project.
- deploy the Edge Function and configure provider secrets server-side.
- run end-to-end QA on CP02 and verify citation behavior.

## Architecture

`Static frontend → Supabase Auth/attempts/mastery → server-side AI endpoint / Edge Function → retrieval over published MEDUS content → model → structured response + citations → AI trace tables`

## Safety and security

- Never expose provider secrets in browser JavaScript.
- No client-side model-provider key.
- No AI auto-publish.
- Learner explanations must be grounded in reviewed MEDUS content.
- `insufficient_evidence` is a valid and preferred failure mode.
- Existing canonical MEDUS Medical Review rules remain authoritative.
- AI outage must never block QBank, Cases, Learn, or Mastery.

## Delivery plan

### V1.0 — foundation
- schema/security/trace contract
- AI architecture contract

### V1.1 — QBank AI Explain
- CP02 first
- `Hỏi MEDUS AI` UI after answer submission
- grounded explanation + citations
- graceful fallback to reviewed static explanation

### V1.2 — Mastery Coach
- Next Best Action ranking
- deterministic fallback

### V1.3 — Adaptive QBank
- spaced repetition
- weakness-aware question ranking

### V1.4 — AI Clinical Examiner
- progressive free-text/oral viva on reviewed cases
- fixed reviewed rubric

## Acceptance criteria

- no provider key in public repo/client
- a wrong QBank answer can request a structured cited explanation
- every AI response is traceable to user/question/case/model/citations
- Mastery continues to work if AI is unavailable
- AI outage never blocks QBank/Cases
- no generated question/case is auto-published
