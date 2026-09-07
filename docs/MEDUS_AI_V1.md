# MEDUS AI V1 — Adaptive Learning Core

## Goal
Turn the current MEDUS flow `Learn → QBank → Cases → Mastery` into a closed adaptive loop without rewriting the existing static MVP.

## V1 scope

### 1. QBank AI Explain (P0)
After a learner submits an answer, add `Hỏi MEDUS AI` next to the reviewed explanation.

Input contract:
- user_id
- question_id
- selected_option
- correct_option
- clinical_problem_id
- section_key
- competency
- reviewed_explanation

Output contract:
- verdict_summary
- reasoning_gap
- why_correct
- why_selected_is_wrong
- one_rule_to_remember
- citations[]
- confidence

Rules:
- AI supplements, never replaces, the Medical Review explanation.
- Decision-changing medical claims require citations.
- If retrieval is weak, return `insufficient_evidence`; do not invent an answer.

### 2. Mastery Coach (P0)
Use the learner's recent QBank/case attempts plus current `mastery` rows to create one `Next Best Action` object.

Output:
- priority_clinical_problem_id
- priority_section_key
- priority_competency
- reason
- recommended_activity (`learn|qbank|case|review`)
- target_count
- target_difficulty

The existing dashboard remains the source of truth for observed performance; AI only ranks the next action.

### 3. Adaptive QBank (P1)
Create a selector that ranks published questions by:
1. weak section
2. weak competency
3. spaced repetition due date
4. difficulty fit
5. recent-exposure penalty

V1 must not allow the model to generate publishable questions on the fly. Questions still follow the existing Draft → Medical Review → Publish lifecycle.

### 4. AI Clinical Examiner (P1)
Add an oral/free-text mode to `cases/`.

The examiner:
- reveals the case progressively;
- asks one question at a time;
- scores against a fixed reviewed rubric;
- records missed competency/section signals back to mastery;
- does not disclose the final answer before completion.

### 5. Retrieval + citation layer (P0 infrastructure)
Knowledge is indexed from published MEDUS content only.

Required metadata per chunk:
- source_id
- source_title
- source_locator
- clinical_problem_id
- section_key
- version
- medical_review_status
- published_at

Only `medical_review_status = published` is retrievable in learner-facing AI.

## Data model additions
See `supabase/migrations/20260907_medus_ai_v1.sql`.

Tables:
- `ai_interactions`: trace every learner-facing AI response.
- `ai_citations`: exact source rows attached to a response.
- `learner_recommendations`: generated Next Best Action snapshots.
- `review_schedule`: spaced-repetition state per learner/question.

## Architecture

```text
Static MEDUS frontend
      |
      v
Supabase Auth + existing attempts/mastery
      |
      +--> AI API / Edge Function
               |
               +--> retrieval over published MEDUS content
               +--> model provider
               +--> structured response + citations
               |
               +--> ai_interactions / ai_citations

QBank/Case result --> mastery --> recommendation --> next activity
```

## Safety contract
- Never expose provider secrets in browser JS.
- No client-side OpenAI/Gemini/Cohere key.
- AI-generated medical content is not auto-published.
- Learner-facing clinical explanations must be grounded in reviewed/published MEDUS sources.
- `insufficient_evidence` is a valid outcome.
- Existing `MEDUS_CANONICAL_RULES.md` remains authoritative.

## Delivery order

### V1.0
- schema + security contract
- QBank AI Explain endpoint contract
- interaction logging
- citation object

### V1.1
- QBank UI button + grounded explanation drawer
- retrieval for one Clinical Problem first (CP02 Sốt)

### V1.2
- Mastery Coach replacing the current deterministic single weak-section recommendation with ranked Next Best Action

### V1.3
- Adaptive QBank selector
- spaced repetition

### V1.4
- AI Clinical Examiner for one reviewed case

## Acceptance criteria
- No provider key exists in public repo/client source.
- A wrong QBank answer can request a structured explanation with at least one source citation when evidence exists.
- Every AI response is attributable to user + question/case + model + citations.
- Mastery continues to work if AI is unavailable.
- AI outage never blocks QBank or Cases.
- No generated question/case is auto-published.
