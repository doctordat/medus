export type TrustedQuestion = {
  id: string;
  clinical_problem_id: number;
  section_key: string;
  competency: string;
  stem: string;
  options: string[];
  correct_option: 'A' | 'B' | 'C' | 'D';
  reviewed_takeaway: string;
  reviewed_rationale: string[];
};

// V1.1 intentionally contains only the first CP02 question that is exposed by
// the static QBank. This registry is server-side so the browser cannot alter
// the correct answer, stem, competency, or medical-review context supplied to AI.
export const QBankRegistry: Record<string, TrustedQuestion> = {
  'CP02-AP01': {
    id: 'CP02-AP01',
    clinical_problem_id: 2,
    section_key: 'safety_gate',
    competency: 'management',
    stem: 'Bệnh nhân nữ 70 tuổi sốt cao 39.2°C, mạch 125 l/p, HA 80/50 mmHg, SpO2 93%, tri giác lơ mơ. Đã truyền nhanh 30ml/kg dịch tinh thể nhưng HA vẫn duy trì ở mức 82/52 mmHg, Lactate máu 4.2 mmol/L. Chẩn đoán xác định và can thiệp mạch tiếp theo là gì?',
    options: [
      'Nhiễm trùng huyết (Sepsis) đơn thuần — Tiếp tục truyền thêm 3000ml dịch',
      'Sốc nhiễm khuẩn (Septic Shock) — Khởi động thuốc vận mạch (Noradrenaline) đích MAP ≥ 65 mmHg',
      'Sốc phản vệ — Tiêm Adrenaline bắp liều 0.5mg',
      'Chỉ hạ sốt bằng Paracetamol truyền tĩnh mạch và chờ kết quả cấy máu'
    ],
    correct_option: 'B',
    reviewed_takeaway: 'Sốc nhiễm khuẩn được định nghĩa khi tụt huyết áp kéo dài cần thuốc vận mạch để duy trì MAP ≥ 65 mmHg và Lactate > 2 mmol/L dù đã bù đủ thể tích dịch. Vận mạch đầu tay là Noradrenaline.',
    reviewed_rationale: [
      'A. Sai: Đã đáp ứng tiêu chuẩn sốc nhiễm khuẩn; tiếp tục bù dịch ồ ạt có nguy cơ quá tải dịch.',
      'B. Đúng: Cần khởi động Noradrenaline sớm để đạt mục tiêu tưới máu.',
      'C. Sai: Bệnh cảnh phù hợp nhiễm trùng tiến triển, không có dữ kiện chính gợi phản vệ.',
      'D. Sai: Chỉ hạ sốt và chờ kết quả làm trì hoãn xử trí sốc.'
    ]
  }
};
