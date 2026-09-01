# Quiz provenance remediation plan — CP2 Sốt

**Scope:** 5 existing `published` questions identified in read-only audit.
**Current risk:** all have `source_id = null` and `source_locator = null`.
**Rule:** Candidate locators were hypotheses for reviewer navigation. Owner approved applying them; they were backfilled in one narrow transaction on 2026-09-01. They still require subsequent human medical verification.

## Candidate mapping for human verification

| Question ID | Section | Claim/decision focus | Candidate source area | Required reviewer check |
|---|---|---|---|---|
| `00000000-0000-4000-8000-000000000001` | `safety_gate` | ABCDE, shock, hypoxemia, altered mental status | Fever PDF page 3; related sepsis case pages 6–7 | Confirm option B is best first action and exact wording/thresholds |
| `00000000-0000-4000-8000-000000000002` | `safety_gate` | qSOFA is not a sepsis rule-out test | Fever PDF page 3 | Confirm source explicitly supports this explanation and current guideline scope |
| `00000000-0000-4000-8000-000000000003` | `special_cases` | Dengue warning signs, dynamic Hct/platelets, perfusion | Fever PDF page 7 | Confirm day-of-illness context and local dengue guidance |
| `00000000-0000-4000-8000-000000000004` | `special_cases` | Febrile neutropenia as urgent infection risk | Fever PDF page 7 | Confirm ANC threshold and urgency wording against current protocol |
| `00000000-0000-4000-8000-000000000005` | `investigations` | Test must answer a clinical question/change management | Fever PDF page 5 | Confirm source wording and ensure no overclaim about test selection |

## Human review workflow

1. Open the canonical source and locate the claim; if the flattened extraction prevents exact location, obtain the original canonical file.
2. Reviewer checks stem, every option, correct answer, explanation, section mapping, competency/Bloom/difficulty and clinical scope.
3. Reviewer records exact `source_id` and locator (page + heading/paragraph where possible), not just a guessed page.
4. Reviewer records identity/time and approves a narrow backfill list.
5. Apply one transaction updating only the approved IDs; preserve `status` unless reviewer separately decides otherwise.
6. Read back all five rows and verify no ID outside the approved allowlist changed.
7. Keep an audit export/rollback snapshot.

## Backfill SQL shape (proposal, do not run)

```sql
-- Replace placeholders only after reviewer signs off.
update public.questions
set source_id = '<verified-source-uuid>',
    source_locator = '<verified-page-and-heading>',
    reviewed_by = '<reviewer-uuid>',
    reviewed_at = now(),
    updated_at = now()
where id = '<approved-question-id>'
  and status = 'published';
```

## Rollback
Before mutation, export the five current rows. Rollback restores only the previous `source_id`, `source_locator`, `reviewed_by`, `reviewed_at` and `updated_at` values by question ID. Never use a broad section/status update.

**Decision:** blocked pending human source verification. No production mutation performed by this plan.
