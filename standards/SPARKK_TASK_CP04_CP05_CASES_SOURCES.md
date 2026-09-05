# PHIẾU GIAO TASK CHO SPARKK — BỔ SUNG PACKAGE CP04 & CP05

**Ngày giao:** 05/09/2026  
**Người giao:** MEDUS System Agent  
**Chuẩn tham chiếu:** QĐ 22/QĐ-HĐYKQG 2026 · MEDUS Clinical OS · Giáo trình Các Vấn Đề Lâm Sàng Thiết Yếu ĐHYD TP.HCM

## Mục tiêu
Bổ sung các deliverable còn thiếu để hoàn thiện package Sprint 1 cho hai chuyên đề:

- `CP_04_tiep-can-dau-bung-cap`
- `CP_05_tiep-can-benh-nhan-soc`

Mỗi chuyên đề phải có đủ 4 file:

```text
CP_XX_slug/
├── 01_LEARN_13_SECTIONS.md       # đã có — không cần viết lại
├── 02_QBANK_APPLY_PLUS.json      # đã có — không cần viết lại
├── 03_CLINICAL_CASE_5_STEPS.json # CẦN BỔ SUNG
└── 04_SOURCE_NOTES_CHECKLIST.md  # CẦN BỔ SUNG
```

---

## TASK A — CP04: TIẾP CẬN ĐAU BỤNG CẤP

### File bắt buộc
`03_CLINICAL_CASE_5_STEPS.json`

### Kịch bản đề xuất
Ca bệnh **thủng ổ loét dạ dày–tá tràng gây viêm phúc mạc toàn thể**, có thể mở rộng biến chứng sốc nhiễm khuẩn.

### 5 bước bắt buộc
1. **Tiếp nhận cấp cứu & Primary Survey:** đau như dao đâm, bụng cứng như gỗ, sinh hiệu, ABCDE.
2. **Cận lâm sàng:** X-quang bụng đứng tìm liềm hơi; CT khi bệnh nhân ổn định hoặc chẩn đoán chưa rõ; CTM/lactate/điện giải.
3. **Chẩn đoán & phân tầng:** thủng tạng rỗng, viêm phúc mạc, phân biệt viêm tụy/tắc ruột/thiếu máu mạc treo/thai ngoài tử cung vỡ.
4. **Can thiệp:** NPO, sonde dạ dày khi phù hợp, dịch tinh thể, kháng sinh theo phác đồ cơ sở, hội chẩn ngoại khoa và mổ kiểm soát nguồn.
5. **Đánh giá lại & hậu phẫu:** huyết động, nước tiểu, lactate, nhiễm trùng ổ bụng, H. pylori và kế hoạch theo dõi.

### Mỗi step phải có
- `step`, `name`, `scenario`, `vitals`, `prompt`, `options`, `correct_index`, `feedback`.
- 4 phương án A/B/C/D, chỉ một đáp án đúng.
- Feedback giải thích logic; không viết như khuyến cáo cá nhân cho người bệnh.

### File bắt buộc
`04_SOURCE_NOTES_CHECKLIST.md`

Phải ghi rõ:
- Nguồn giáo trình/khuyến cáo đã dùng, năm và link/DOI nếu có.
- Các claim chính ánh xạ tới section Learn.
- Các điểm cần Medical Review trước publish: liều kháng sinh, chỉ định mổ, NPO/sonde, xử trí sốc.
- Media đề xuất: X-quang liềm hơi, sơ đồ đau tạng–đau thành, CT viêm tụy; chỉ dùng ảnh có quyền sử dụng hoặc link nguồn rõ ràng.

---

## TASK B — CP05: TIẾP CẬN BỆNH NHÂN SỐC

### File bắt buộc
`03_CLINICAL_CASE_5_STEPS.json`

### Kịch bản đề xuất
Ca bệnh **sốc nhiễm khuẩn nguồn đường mật do sỏi ống mật chủ**, có thể có ngũ chứng Reynolds.

### 5 bước bắt buộc
1. **Tiếp nhận cấp cứu:** sốt rét run, vàng da, đau hạ sườn phải, tụt HA, lơ mơ; ABCDE.
2. **Cận lâm sàng & POCUS:** khí máu toan lactic, lactate động học, CTM, chức năng gan/thận, siêu âm giãn đường mật.
3. **Chẩn đoán & huyết động:** sốc nhiễm khuẩn; phân biệt sốc tim, giảm thể tích, phản vệ, tắc nghẽn; ghi rõ MAP và tưới máu.
4. **Hour-1 Bundle & Source Control:** dịch tinh thể có đánh giá lại, kháng sinh sớm theo phác đồ cơ sở, Noradrenaline khi cần, hội chẩn ERCP/dẫn lưu.
5. **Đánh giá lại:** MAP, CRT, nước tiểu, lactate clearance, chức năng cơ quan và thời điểm kiểm soát ổ nhiễm.

### Mỗi step phải có
- `step`, `name`, `scenario`, `vitals`, `prompt`, `options`, `correct_index`, `feedback`.
- 4 phương án A/B/C/D, chỉ một đáp án đúng.
- Không đưa liều thuốc hoặc ngưỡng điều trị nếu không có nguồn xác minh.

### File bắt buộc
`04_SOURCE_NOTES_CHECKLIST.md`

Phải ghi rõ:
- Surviving Sepsis Campaign bản nào, hướng dẫn Bộ Y tế/Thông tư nào, nguồn bệnh đường mật nào.
- Claim ánh xạ vào `safety_gate`, `mechanism`, `investigations`, `management`, `decision_points`.
- Các điểm bắt buộc Medical Review: 30 mL/kg, vận mạch, kháng sinh, ERCP/source control, mục tiêu MAP/lactate.
- Media đề xuất: RUSH protocol, sơ đồ 4 loại sốc, siêu âm đường mật; chỉ dùng media có quyền sử dụng.

---

## QUY TẮC CHẤT LƯỢNG CHUNG

- Không bịa nguồn, DOI, số trang hoặc khuyến cáo.
- Không dùng nội dung chưa kiểm chứng để ghi là “đã Medical Review”.
- Không copy nguyên văn tài liệu có bản quyền; tóm tắt và trích dẫn nguồn hợp lệ.
- Nếu có bất đồng giữa giáo trình và guideline mới, đánh dấu `NEEDS_MEDICAL_REVIEW` và ghi rõ bất đồng.
- Media phải có `alt_text`, `caption`, `source_url`, `license` hoặc `rights_status`.
- JSON phải parse được bằng JSON parser chuẩn, không có comment trailing.
- Tải file vào Google Drive: `ÔN ĐGNL - COWORK/03_COMPLETED_CONTENT/CP_XX_slug/`.
- Sau khi upload, nhắn: **“Đã nộp CP04/CP05 Case + Source Notes”**.

## Tiêu chí nghiệm thu

- CP04 có đủ `03_CLINICAL_CASE_5_STEPS.json` và `04_SOURCE_NOTES_CHECKLIST.md`.
- CP05 có đủ `03_CLINICAL_CASE_5_STEPS.json` và `04_SOURCE_NOTES_CHECKLIST.md`.
- Hai JSON parse hợp lệ, mỗi file có đúng 5 step.
- Các claim nhạy cảm được đánh dấu cần Medical Review.
- Không tự động publish; MEDUS Agent sẽ kiểm định trước khi tích hợp.
