---
name: vietnam-medical-authoring
description: Chuẩn hóa quy trình biên soạn tài liệu y khoa, ngân hàng câu hỏi Apply+, ca lâm sàng mô phỏng và chuỗi quyết định 13 bước theo Quyết định 22/QĐ-HĐYKQG năm 2026 của Hội đồng Y khoa Quốc gia và Giáo trình Các Vấn Đề Lâm Sàng Thiết Yếu ĐHYD TP.HCM.
triggers:
  - 'soạn câu hỏi y khoa'
  - 'soạn tình huống lâm sàng'
  - 'soạn bài học y khoa'
  - 'chuẩn quyết định 22'
  - 'test blueprint hdykqg'
  - 'biên soạn medus'
---

# SKILL: VIETNAM MEDICAL CONTENT & EXAM AUTHORING (CHUẨN HỘI ĐỒNG Y KHOA QUỐC GIA 2026)

Skill này cung cấp các nguyên tắc, cấu trúc chuẩn hóa và bộ khung dữ liệu bắt buộc khi biên soạn:
1. **Bài học lâm sàng 13 bước (MEDUS Learn)**
2. **Câu hỏi trắc nghiệm ứng dụng lâm sàng (QBank Apply+)**
3. **Ca lâm sàng mô phỏng mở dữ kiện theo thời gian thực (Clinical Cases 5 Steps)**
4. **Thẻ ghi nhớ ngắt quãng phản xạ cấp cứu (Smart Review Flashcards)**

---

## 1. CĂN CỨ PHÁP LÝ & TÀI LIỆU CHUẨN MỰC
- **Quyết định số 22/QĐ-HĐYKQG ngày 22/4/2026** của Hội đồng Y khoa Quốc gia về hình thức câu hỏi kiểm tra, miền năng lực, danh mục các vấn đề chuyên môn cốt lõi và cấu trúc đề kiểm tra (Test Blueprint) cho đối tượng Bác sĩ Y khoa.
- **Giáo trình Các Vấn Đề Lâm Sàng Thiết Yếu của Chương Trình Đào Tạo Bác Sĩ Y Khoa** (Đại học Y Dược TP.HCM - NXB Y Học, Chủ biên: GS.TS. Vương Thị Ngọc Lan, PGS.TS. Phùng Nguyễn Thế Nguyên, PGS.TS. Huỳnh Nghĩa, PGS.TS. Trần Công Thắng).
- **File gốc lưu trữ trong hệ thống:** `/Users/ledat/.openclaw/workspace-dev/standards/Quyet_dinh_22_HDYKQG_2026_Test_Blueprint.pdf`

---

## 2. CHUẨN CẤU TRÚC BÀI HỌC 13 BƯỚC (MEDUS LEARN SPEC)
Mỗi vấn đề lâm sàng trong danh mục 128 bài bắt buộc phải tuân theo thứ tự 13 section:
1. `overview` — **Tổng quan:** Định nghĩa, phạm vi ca bệnh và dịch tễ học lâm sàng.
2. `learning_objectives` — **Mục tiêu học tập:** 2–4 mục tiêu hành động cụ thể.
3. `safety_gate` — **Safety Gate / Red Flags:** Các dấu hiệu báo động đe dọa tính mạng (Big 5, shock, suy hô hấp) cần loại trừ khẩn cấp trước khi nghĩ đến nguyên nhân lành tính.
4. `mechanism` — **Cơ chế / Sinh lý bệnh:** Giải thích bản chất bệnh sinh làm cơ sở cho quyết định điều trị.
5. `history` — **Bệnh sử có mục tiêu:** Khai thác theo OPQRST/SOCRATES; mỗi câu hỏi phải làm thay đổi xác suất chẩn đoán hoặc xử trí.
6. `physical_exam` — **Khám lâm sàng:** Sinh hiệu, tưới máu mô (CRT, tri giác) và khám cơ quan trọng điểm.
7. `differential` — **Chẩn đoán phân biệt:** Phân tầng theo mức độ nguy hiểm (Nhóm cần loại trừ trước ➔ Nhóm thường gặp).
8. `investigations` — **Cận lâm sàng:** Chỉ định test theo câu hỏi lâm sàng cụ thể; nắm vững test nào làm thay đổi quyết định tiếp theo.
9. `management` — **Xử trí ban đầu:** Phân loại bệnh nhân ổn định vs không ổn định (ABCDE first); phác đồ can thiệp chuẩn.
10. `decision_points` — **Decision Points (IF-THEN):** Các nút ra quyết định rẽ nhánh lâm sàng rõ ràng.
11. `pitfalls` — **Bẫy lâm sàng:** Các sai lầm kinh điển thường gặp dẫn đến chẩn đoán sót hoặc dùng sai thuốc.
12. `clinical_pearls` — **Viên ngọc lâm sàng:** Các nguyên lý vàng cô đọng, cốt lõi.
13. `checklist` — **Bảng kiểm thực hành:** Danh sách các đầu mục kiểm tra trước khi chuyển viện/cho xuất viện.

---

## 3. CHUẨN BIÊN SOẠN CÂU HỎI TRẮC NGHIỆM QBANK APPLY+ (MCQ BLUEPRINT)
Không soạn câu hỏi thuộc lòng, nhớ định nghĩa đơn thuần. 100% câu hỏi QBank phải là **Tình huống lâm sàng Apply+**:
- **Cấu trúc Stem (Tình huống):** Nêu rõ Tuổi + Giới tính + Tiền sử bệnh + Triệu chứng khởi phát + Dữ kiện Sinh hiệu (HA, Mạch, SpO2) + Dấu hiệu thực thể và Cận lâm sàng ban đầu.
- **Câu hỏi dẫn (Lead-in):** Trực diện: *Hành động ưu tiên tiếp theo là gì? / Chỉ định cận lâm sàng nào có giá trị nhất? / Thuốc nào là chống chỉ định tuyệt đối?*
- **4 Phương án A, B, C, D:** Các phương án nhiễu phải hợp lý và phản ánh các bẫy lâm sàng thực tế ngoài đời.
- **Phần giải thích bắt buộc (In-depth Rationale):**
  1. `Key Clinical Takeaway`: Đóng khung điểm then chốt cốt lõi (1–2 câu).
  2. `Phân tích từng phương án`: Giải thích cặn kẽ *TẠI SAO A/B/C/D ĐÚNG hoặc SAI*.
  3. `Learn Ref Link`: Liên kết neo trực tiếp về Section bài học tương ứng (VD: `#safety_gate`, `#decision_points`).

---

## 4. CHUẨN BIÊN SOẠN CA LÂM SÀNG MÔ PHỎNG 5 BƯỚC (CLINICAL CASES)
Ca lâm sàng mô phỏng diễn tiến thời gian thực mở dữ kiện dần qua 5 bước:
- **Bước 1 (Triage & Primary Survey):** Đánh giá mức độ ổn định ABCDE, xử trí cấp cứu ngay phút đầu.
- **Bước 2 (Investigations Decision):** Lựa chọn cận lâm sàng khẩn cấp làm thay đổi quyết định.
- **Bước 3 (Differential & Diagnosis):** Đưa ra chẩn đoán xác định và phân tầng nguy cơ.
- **Bước 4 (Management & Intervention):** Phác đồ kiểm soát huyết động và can thiệp ban đầu.
- **Bước 5 (Reassessment & Follow-up):** Đánh giá lại đáp ứng điều trị và rút ra bài học lâm sàng.

---

## 5. BỘ GỢI Ý CHUYÊN MÔN CỐT LÕI (CORE BLUEPRINT TOPICS)
- **Cấp cứu & Hồi sức:** Ngừng tuần hoàn hô hấp, Sốc (tim, nhiễm khuẩn, giảm thể tích, phản vệ), Tràn khí màng phổi áp lực.
- **Tim mạch:** Đau ngực cấp, Hội chứng vành cấp (STEMI/NSTEMI), Bóc tách động mạch chủ ngực, Cơn tăng huyết áp cấp cứu, Suy tim cấp.
- **Hô hấp:** Khó thở cấp, Hen ác tính, Đợt cấp COPD, Thuyên tắc phổi (PE), Viêm phổi cộng đồng nặng.
- **Tiêu hóa & Bụng cấp:** Đau bụng cấp, Xuất huyết tiêu hóa, Viêm tụy cấp, Thủng tạng rỗng, Viêm ruột thừa cấp.
- **Thần kinh:** Đột quỵ thiếu máu não / Xuất huyết não, Co giật, Hôn mê, Viêm màng não mủ.
- **Truyền nhiễm & Miễn dịch:** Tiếp cận sốt cấp, Nhiễm khuẩn huyết, Sốt xuất huyết Dengue có dấu cảnh báo, Sốt giảm bạch cầu hạt.
