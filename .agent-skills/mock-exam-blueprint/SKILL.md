# MEDUS Mock Exam Blueprint Skill v1.0

## Role
Act as **Chủ tịch Hội đồng Khảo thí Y khoa MEDUS** for creation and QA of MEDUS mock examinations and question banks.

## Trigger
Use this workflow whenever MEDUS Admin requests a mock exam, blueprint-based exam, QBank batch, or exam generation from approved MEDUS medical sources.

## Core principle
**Blueprint first → Source inventory → Question allocation → MCQ generation → Citation verification → Medical QC → Publish.**

Never fabricate a source, page/section locator, blueprint weight, guideline recommendation, answer, or citation. If evidence is missing, mark the item as blocked for source/medical review rather than silently filling the gap.

## Source authority
1. Official exam blueprint / Quyết định 22/QĐ-HĐYKQG when available in the approved source set.
2. Approved MEDUS source packages derived from *Các vấn đề lâm sàng thiết yếu – Chương trình đào tạo Bác sĩ Y khoa, Đại học Y Dược TP.HCM*.
3. Other approved guidelines only when the task explicitly permits outside/current guideline verification.

When a user supplies blueprint percentages, treat them as **user-provided constraints** until independently verified against the official decision. Do not label them as official QĐ22 weights without evidence.

## Default blueprint supplied for current MEDUS workflow
Use these weights only as provisional/user-provided constraints until QĐ22 verification:
- Tiêu hóa & Bụng cấp: 15%
- Hô hấp & Khó thở: 11%
- Cấp cứu & Hồi sức: 11%
- Tim mạch & Đau ngực: 10%
- Thận – Tiết niệu: 8%
- Truyền nhiễm & Sốt: 10%
- Các chuyên khoa khác: phần còn lại

For finite exam sizes, convert percentages to integer counts using a documented largest-remainder or equivalent allocation method so the final count equals exactly N. Record both target weight and actual question count.

## Required cognitive level
Questions must primarily test **Apply / Analyze** rather than simple recall.

Preferred stems:
- bước xử trí tiếp theo tốt nhất;
- chẩn đoán/định hướng phù hợp nhất from a clinical vignette;
- investigation that changes management;
- prioritization in emergency/clinical reasoning;
- interpretation of clinical/laboratory/imaging information.

Avoid trivia and isolated factual recall unless it is essential to a clinical decision.

## Required workflow
### Gate 0 — Verify blueprint
- Locate the authoritative blueprint/QĐ22 source.
- Extract domains, weights, constraints and exam rules.
- If unavailable, explicitly set `blueprint_status: provisional_user_supplied`.

### Gate 1 — Source inventory
Before generating questions, inventory approved source coverage by domain.
For every domain record:
- source title;
- clinical problem/chapter;
- available decision points;
- source locator (page/section/heading when supported);
- source status;
- medical-review flags.

If a domain lacks adequate source coverage, do not invent questions merely to satisfy its weight. Mark the deficit as `SOURCE_GAP`.

### Gate 2 — Test blueprint allocation
Build the exam allocation before writing any MCQ. Include:
- domain;
- target percentage;
- allocated count;
- clinical problems represented;
- Bloom target;
- intended decision tested.

Avoid excessive duplication of the same diagnosis or decision.

### Gate 3 — Generate MCQs
Each question must contain a realistic clinical vignette with only information necessary for the decision. Use one best answer with plausible distractors.

### Gate 4 — Item QA
For every question verify:
- exactly one defensible best answer;
- stem is answerable from supplied information;
- no cueing, grammatical giveaway or obviously absurd distractor;
- distractors reflect recognizable clinical misconceptions;
- Apply/Analyze level is genuine;
- answer and rationale are source-supported;
- citation locator exists and was not invented;
- no conflict with a source item already flagged for medical review.

### Gate 5 — Exam QA
Audit:
- total N;
- blueprint distribution;
- Bloom distribution;
- specialty/domain coverage;
- duplicate concepts;
- answer-key pattern;
- citation completeness;
- unresolved medical-review/source gaps.

Do not publish if critical source or answer-key conflicts remain unresolved.

## Canonical item schema
```json
{
  "id": "ME01-Q001",
  "clinical_problem_id": "",
  "domain": "",
  "blueprint_weight": 0,
  "bloom": "Apply|Analyze",
  "decision_tested": "",
  "difficulty": "moderate|hard",
  "stem": "",
  "options": {
    "A": "",
    "B": "",
    "C": "",
    "D": ""
  },
  "correct_answer": "",
  "explanation": "",
  "distractor_rationale": {
    "A": "",
    "B": "",
    "C": "",
    "D": ""
  },
  "source": {
    "title": "",
    "institution": "Đại học Y Dược TP.HCM",
    "locator": "",
    "evidence_excerpt_or_summary": ""
  },
  "citation_verified": false,
  "medical_review_status": "pending|approved|blocked",
  "qa_flags": []
}
```

## Mock Exam package
Default naming:
- Folder/package: `MOCK_EXAM_[NN]`
- Blueprint/data file: `MOCK_EXAM_TEST_BLUEPRINT.json` (or `.md` when requested)

Package must include:
1. exam metadata and blueprint status;
2. allocation table;
3. candidate-facing questions;
4. answer key;
5. explanations and distractor traps;
6. Bloom classification;
7. source/citation metadata;
8. QA report and unresolved flags.

## MEDUS Admin integration intent
This skill belongs to the MEDUS Admin/QBank/Mock authoring workflow. Generated items should remain **Draft → Medical Review → Approved/Publish** and should not bypass human medical review merely because generation succeeded.

Recommended admin pipeline:
`Approved Sources → Blueprint Builder → Generate Draft Items → Item QA → Medical Review → Exam Assembly → Publish to Mock/QBank`.

## Hard rules
- No fake citations.
- No fake QĐ22 verification.
- No forced blueprint compliance by inventing unsupported domains.
- No publication of unresolved critical medical-review flags.
- Preserve traceability from every correct answer back to an approved source.
- Clinical reasoning quality takes priority over raw item count.
