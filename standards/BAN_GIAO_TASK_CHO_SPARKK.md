# BÀN GIAO TASK CHO SPARKK — MEDUS SPRINT 1 BỔ SUNG

**Người giao:** MEDUS System Agent  
**Người thực hiện:** Sparkk  
**Ngày:** 05/09/2026  
**Mục tiêu:** Bổ sung các file còn thiếu cho 2 chuyên đề CP04 và CP05 để MEDUS có thể kiểm định và tích hợp.

---

## 1. VỊ TRÍ THƯ MỤC GOOGLE DRIVE

Mở thư mục Drive:

```text
ÔN ĐGNL - COWORK/
└── 03_COMPLETED_CONTENT/
```

Trong `03_COMPLETED_CONTENT/`, tạo hoặc mở đúng 2 thư mục sau:

```text
03_COMPLETED_CONTENT/
├── CP_04_tiep-can-dau-bung-cap/
└── CP_05_tiep-can-benh-nhan-soc/
```

Không đổi tên thư mục. Không đặt file ở thư mục gốc `ÔN ĐGNL - COWORK`.

---

## 2. TASK CP04 — TIẾP CẬN ĐAU BỤNG CẤP

Thư mục nộp:

```text
ÔN ĐGNL - COWORK/03_COMPLETED_CONTENT/CP_04_tiep-can-dau-bung-cap/
```

### File cần tạo số 1

```text
03_CLINICAL_CASE_5_STEPS.json
```

### Nội dung Case bắt buộc

Soạn 1 ca bệnh **thủng ổ loét dạ dày–tá tràng gây viêm phúc mạc toàn thể**, có thể diễn tiến đến sốc nhiễm khuẩn.

JSON phải có dạng tổng quát:

```json
{
  "id": "CASE-CP04-01",
  "clinical_problem_id": 4,
  "title": "...",
  "difficulty": "Apply+",
  "steps": [
    {
      "step": 1,
      "name": "Tiếp nhận cấp cứu & Primary Survey",
      "scenario": "...",
      "vitals": {
        "bp": "...",
        "hr": "...",
        "rr": "...",
        "spo2": "...",
        "temp": "..."
      },
      "prompt": "...",
      "options": ["A...", "B...", "C...", "D..."],
      "correct_index": 0,
      "feedback": "...",
      "medical_review": "NEEDS_MEDICAL_REVIEW"
    }
  ]
}
```

### 5 bước bắt buộc của CP04

1. **Tiếp nhận cấp cứu:** đau bụng như dao đâm, bụng cứng như gỗ, đánh giá ABCDE và sốc.
2. **Cận lâm sàng:** X-quang bụng đứng tìm liềm hơi; CT khi bệnh nhân ổn định hoặc chẩn đoán chưa rõ; CTM, lactate, điện giải, chức năng thận.
3. **Chẩn đoán & phân tầng:** thủng tạng rỗng/viêm phúc mạc; phân biệt viêm tụy, tắc ruột, thiếu máu mạc treo, thai ngoài tử cung vỡ.
4. **Xử trí:** NPO, sonde dạ dày khi phù hợp, dịch tinh thể có đánh giá lại, kháng sinh theo phác đồ, hội chẩn ngoại khoa và kiểm soát nguồn.
5. **Đánh giá lại & hậu phẫu:** huyết áp/MAP, nước tiểu, lactate, nhiễm trùng ổ bụng, H. pylori và kế hoạch theo dõi.

Mỗi bước phải có **4 phương án A/B/C/D**, chỉ một đáp án đúng, feedback giải thích lý do lâm sàng.

### File cần tạo số 2

```text
04_SOURCE_NOTES_CHECKLIST.md
```

File này phải có:

- Danh sách nguồn đã dùng: giáo trình ĐHYD TP.HCM, guideline ngoại khoa/tiêu hóa, Tokyo Guidelines hoặc nguồn tương đương có thật.
- Năm xuất bản, tên tài liệu, URL/DOI nếu có; không tự bịa DOI.
- Bảng ánh xạ claim → section Learn: `safety_gate`, `mechanism`, `investigations`, `management`, `decision_points`.
- Các claim cần Medical Review: liều kháng sinh, chỉ định mổ, sonde dạ dày, truyền dịch, xử trí sốc.
- Media đề xuất: X-quang liềm hơi, sơ đồ đau tạng/đau thành, CT viêm tụy; ghi `source_url`, `license` hoặc `rights_status`, `alt_text`, `caption`.

---

## 3. TASK CP05 — TIẾP CẬN BỆNH NHÂN SỐC

Thư mục nộp:

```text
ÔN ĐGNL - COWORK/03_COMPLETED_CONTENT/CP_05_tiep-can-benh-nhan-soc/
```

### File cần tạo số 1

```text
03_CLINICAL_CASE_5_STEPS.json
```

### Nội dung Case bắt buộc

Soạn 1 ca bệnh **sốc nhiễm khuẩn nguồn đường mật do sỏi ống mật chủ**, có thể có ngũ chứng Reynolds.

JSON dùng cùng cấu trúc CP04, với `clinical_problem_id: 5`.

### 5 bước bắt buộc của CP05

1. **Tiếp nhận cấp cứu:** sốt rét run, vàng da, đau hạ sườn phải, tụt huyết áp, lơ mơ; đánh giá ABCDE.
2. **Cận lâm sàng & POCUS:** khí máu toan lactic, lactate động học, CTM, chức năng gan/thận, siêu âm giãn đường mật.
3. **Chẩn đoán & huyết động:** sốc nhiễm khuẩn; phân biệt sốc tim, giảm thể tích, phản vệ, tắc nghẽn; ghi rõ MAP và tưới máu.
4. **Hour-1 Bundle & Source Control:** dịch tinh thể có đánh giá lại, kháng sinh sớm theo phác đồ cơ sở, Noradrenaline khi cần, hội chẩn ERCP/dẫn lưu.
5. **Đánh giá lại:** MAP, CRT, nước tiểu, lactate clearance, chức năng cơ quan và thời điểm kiểm soát ổ nhiễm.

Không đưa liều thuốc hoặc ngưỡng điều trị nếu không có nguồn xác minh. Claim chưa chắc chắn phải gắn `NEEDS_MEDICAL_REVIEW`.

### File cần tạo số 2

```text
04_SOURCE_NOTES_CHECKLIST.md
```

File này phải có:

- Nguồn Surviving Sepsis Campaign bản cụ thể, hướng dẫn Bộ Y tế/Thông tư cụ thể, nguồn bệnh đường mật/ERCP có thật.
- Năm, URL/DOI nếu có; không bịa nguồn.
- Bảng ánh xạ claim → `safety_gate`, `mechanism`, `investigations`, `management`, `decision_points`.
- Các điểm bắt buộc Medical Review: 30 mL/kg, Noradrenaline, kháng sinh, mục tiêu MAP, lactate clearance, ERCP/source control.
- Media đề xuất: RUSH Protocol, sơ đồ 4 loại sốc, siêu âm đường mật; phải ghi quyền sử dụng và metadata ảnh/video.

---

## 4. QUY TẮC CHẤT LƯỢNG BẮT BUỘC

- Không viết nội dung tư vấn cho một bệnh nhân cụ thể.
- Không bịa nguồn, số trang, DOI, liều thuốc hoặc số liệu.
- Không ghi `Medical Review: PASS`; chỉ được ghi `NEEDS_MEDICAL_REVIEW` nếu chưa có người duyệt y khoa.
- Không copy nguyên văn tài liệu có bản quyền.
- JSON phải parse được bằng parser chuẩn, không comment, không trailing comma.
- Mỗi Case phải có đúng 5 step và mỗi step có 4 options.
- Các file đã có trong folder thì không sửa hoặc ghi đè nếu chưa báo trước.

---

## 5. CHECKLIST TRƯỚC KHI NỘP

```text
[ ] Đúng folder CP04 hoặc CP05
[ ] Đúng tên file 03_CLINICAL_CASE_5_STEPS.json
[ ] Đúng tên file 04_SOURCE_NOTES_CHECKLIST.md
[ ] JSON parse hợp lệ
[ ] Có đúng 5 step
[ ] Mỗi step có 4 options A/B/C/D
[ ] Có feedback cho từng step
[ ] Có nguồn thật và URL/DOI được kiểm tra
[ ] Có claim mapping về Learn section
[ ] Có media metadata: alt_text, caption, source_url, license/rights_status
[ ] Đã đánh dấu NEEDS_MEDICAL_REVIEW cho claim nhạy cảm
```

Sau khi upload xong cả 4 file, nhắn lại đúng câu:

```text
Đã nộp CP04/CP05 Case + Source Notes lên Drive.
```

MEDUS System Agent sẽ kiểm tra rồi mới tích hợp vào Learn, QBank và Clinical Cases. Không tự động publish.
