# MEDUS Canonical Content Rules v1

## Contract
Mỗi Clinical Problem có đúng 13 section, đúng thứ tự và dùng đúng `section_key`:

1. `overview` — Overview
2. `learning_objectives` — Learning objectives
3. `safety_gate` — Safety Gate / Red flags
4. `mechanism` — Mechanism / Pathophysiology
5. `history` — Targeted history
6. `physical_exam` — Physical exam
7. `differential` — Differential diagnosis
8. `investigations` — Investigations
9. `management` — Initial management
10. `decision_points` — Decision points
11. `pitfalls` — Pitfalls
12. `clinical_pearls` — Clinical pearls
13. `checklist` — Checklist

## Formatting rules
- Mỗi heading phải nằm trên một dòng riêng, giữ nguyên số + tên tiếng Anh như trên.
- Nội dung learner dùng Markdown UTF-8; không chèn AI notes, REVIEW FLAGS, đường dẫn file nội bộ hoặc metadata xử lý nguồn vào `content_md`.
- Mỗi section phải có nội dung có ý nghĩa; section rỗng/thiếu/đảo thứ tự phải BLOCK.
- Claim lâm sàng làm thay đổi quyết định phải có `source_id` + `source_locator`; chưa trace được phải đánh dấu `NEEDS MEDICAL REVIEW`.
- Media chỉ dùng URL HTTPS; image/YouTube/PDF/external link phải có label/caption phù hợp.
- Không hard-code theo một Clinical Problem; validator và renderer dùng contract chung.

## Pipeline gate
`Canonical Source → Upload → Extract → Normalize v3 → 13/13 Gate → Draft → Medical Review → Publish → Learn`

Không tạo Draft nếu không đạt 13/13. Không publish từ Content editor. AI/parser không auto-publish. Public chỉ đọc row đã `medical_review_status = published`.

## Review checklist
Reviewer kiểm tra source, locator, clinical accuracy, scope, guideline currency, Unicode/Markdown, media URL và safety disclaimer. Chỉ sau khi đủ 13 section được reviewer xác nhận mới chuyển `reviewed`; publish là bước riêng.

## Draft status
Mọi bản do AI soạn phải giữ banner `AI DRAFT — NEEDS MEDICAL REVIEW`, không được coi là hướng dẫn điều trị cuối cùng.

## Learning hub resources
Mỗi Clinical Problem phải có resource manifest riêng, không nhồi toàn bộ metadata vào `content_md`:
- Tối thiểu 1 `image` URL HTTPS có `title`, `caption` hoặc `alt`; ảnh phải được reviewer kiểm tra nguồn/bản quyền.
- Có thể thêm `youtube`, `pdf`, `external_link`, `internal_article`, `clinical_tool`, `qbank`, `case`, `download`.
- Mỗi resource có `access_level` (`public|free|premium`) và `status` (`draft|published|archived`).
- Admin cần CRUD resource URL/metadata; sửa resource không được làm mất trạng thái medical review của article.
- Resource y khoa cũng đi qua Draft → Medical Review → Publish; URL lỗi/không rõ nguồn phải block.

## Admin case and quiz requirements
Admin phải có module riêng cho `Cases` và `Quiz/QBank`, không nhập tay vào article:
- Case hỗ trợ progressive 3–5 bước; mỗi bước có prompt, lựa chọn/quyết định, giải thích, `clinical_problem_id`, `section_key`, competency và source locator.
- Quiz có stem, options, đáp án, explanation, difficulty, Bloom, competency, `clinical_problem_id`, `section_key`, source locator và status.
- Case/quiz phải liên kết được từ learning hub và dùng chung mapping section để remediation/mastery.
- Case, quiz và explanation đều bắt buộc Medical Review trước publish; không auto-publish.

## Parser compatibility and lifecycle
- Exported source headings must be plain numbered lines (`1. Overview`), not Markdown `##` prefixes, because Normalize v3 currently matches exact heading lines. The learner renderer may add visual heading markup later.
- Article, resource, case and quiz lifecycle: `draft → medical_review → published → archived`, with reviewer identity, timestamps, version and source locator retained.
- Image resources require `alt`, `caption`, `source/license/attribution`, review status and HTTPS allowlist. Renderers must sanitize URLs and must not render arbitrary iframe/HTML.
