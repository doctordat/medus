# MEDUS Content Ingestion Standard v1.0

> Data contract cho **Learn → Test → Cases → Mastery**.

## Mục tiêu
Mọi nguồn đầu vào (PDF, DOCX, Google Doc, paste text, CSV/XLSX) phải được chuẩn hóa về cùng một schema MEDUS trước khi xuất bản. File nguồn là đầu vào/tham khảo, không phải cấu trúc lưu trữ cuối cùng.

## 1. Nguyên tắc bắt buộc
- Một schema dùng chung cho Article, QBank, Cases, Mock và Mastery.
- Clinical Problem là đơn vị kiến thức gốc; 128 vấn đề là khung kiến thức, không giới hạn số câu hỏi/case.
- Mỗi nội dung phải truy ngược được về nguồn, phiên bản và ngày cập nhật.
- AI chỉ tạo **Draft**. Nội dung y khoa phải qua **Medical Review** trước khi **Published**.
- Không sao chép nguyên văn tài liệu có bản quyền để tái phân phối; MEDUS tạo nội dung chuyển hóa/biên soạn độc lập.
- Mỗi question/case phải map về `clinical_problem + section + competency` để phục vụ weak-area training.

## 2. Pipeline nhập nội dung
`Upload/Paste → Extract → Normalize → Map Clinical Problem → Generate Draft → Medical Review → Publish → Index Learn/QBank/Cases/Mock/Mastery`

Input hỗ trợ: PDF, DOCX, Google Doc, plain text. CSV/XLSX dùng cho bulk import câu hỏi và metadata.

## 3. Clinical Problem schema
### Metadata
`clinical_problem_id`, `title`, `domain`, `slug`, `tags`, `priority`, `source_refs`, `version`, `updated_at`, `status`.

### Learning Article — thứ tự chuẩn
1. Tổng quan & mục tiêu học
2. Safety Gate / Red flags
3. Cơ chế / sinh lý bệnh cần biết
4. Bệnh sử có mục tiêu
5. Khám lâm sàng
6. Chẩn đoán phân biệt ưu tiên
7. Xét nghiệm & cách diễn giải
8. Xử trí ban đầu
9. Decision points
10. Pitfalls
11. Clinical pearls
12. Checklist
13. Case walkthrough (khi phù hợp)
14. Test ứng dụng & CTA sang QBank/Cases

## 4. Question / QBank schema
Tối thiểu:
`question_id`, `clinical_problem_id`, `section_id`, `stem`, `options`, `correct_answer`, `explanation_correct`, `explanation_options`, `competency`, `bloom_level`, `difficulty`, `question_type`, `tags`, `source_refs`, `status`.

**Rule:** câu sai phải trỏ ngược về đúng section của bài học, không chỉ toàn bộ chủ đề.

## 5. Clinical Case schema
`case_id`, `clinical_problem_id`, `title`, `case_stem`, `steps[]`, `data_reveal`, `question`, `options/decision`, `correct_decision`, `feedback`, `competency`, `difficulty`, `related_section_id`, `source_refs`, `status`.

Case hỗ trợ dữ kiện mở dần; mỗi step là một decision point và có feedback.

## 6. Mastery Mapping
Đơn vị phân tích: `User × Clinical Problem × Section × Competency`.

Output sau lượt làm bài: điểm, câu sai, competency yếu, section cần đọc lại và 3–5 câu/case tiếp theo được đề xuất.

## 7. AI + Medical Review
1. AI extract nguồn và giữ reference tới trang/đoạn nguồn nếu có.
2. AI phân loại vào Clinical Problem + section chuẩn.
3. AI tạo Draft Article, Draft MCQ, Draft Case.
4. Reviewer kiểm tra chính xác, cập nhật, ngưỡng/liều/phác đồ và bản quyền.
5. Chỉ reviewer/admin được chuyển sang Published.
6. Khi nguồn/guideline đổi: tạo version mới, không âm thầm ghi đè lịch sử.

## 8. Bulk Import CSV/XLSX
Template tối thiểu:
`clinical_problem_id | section | content | source | question | option_a | option_b | option_c | option_d | correct | explanation | competency | bloom | difficulty | tags | status`

Import phải validate ID, đáp án, competency, Bloom, difficulty và status trước khi ghi database.

## 9. Content lifecycle
`Draft → Reviewed → Published → Archived`

Draft không xuất hiện trên public site. Archived giữ lịch sử và source/version.

## 10. Data contract cho MEDUS Admin
Admin, Learn, QBank, Cases, Mock và Dashboard phải đọc cùng data model. Không tạo schema riêng theo từng màn hình. Import Center chỉ là lớp chuyển nguồn đầu vào thành schema này.

## 11. Acceptance criteria
- [ ] Nạp PDF/DOC khác nhau nhưng output cùng schema/section.
- [ ] Question truy được Clinical Problem + section + competency.
- [ ] User error sinh được recommendation học lại cụ thể.
- [ ] Draft không public nếu chưa Review.
- [ ] Nội dung y khoa có source/version/update date.
- [ ] Scale 10 → 10,000+ câu mà không đổi schema lõi.

---
**MEDUS · Medical Education & Assessment Platform**
