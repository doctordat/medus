-- MEDUS starter fever QBank seed
-- Safe to re-run.

insert into public.questions (
  id, clinical_problem_id, section_key, stem,
  option_a, option_b, option_c, option_d, correct_option,
  explanation_a, explanation_b, explanation_c, explanation_d,
  competency, bloom, difficulty, tags, status
) values
('00000000-0000-4000-8000-000000000001',2,'safety_gate','Nam 68 tuổi sốt, HA 86/52, RR 30, SpO₂ 89%, lơ mơ, CRT 4 giây. Ưu tiên đầu tiên?','CT ngực trước','ABCDE + hồi sức, đồng thời đánh giá sepsis','Chờ đủ xét nghiệm rồi xử trí','Hạ sốt trước','B',null,'Bệnh nhân có nhiều dấu hiệu nguy kịch. Ưu tiên là ổn định ABCDE và xử trí song song, không chờ chẩn đoán hoàn chỉnh.',null,null,'management','apply','medium',array['fever','sepsis','safety_gate'],'published'),
('00000000-0000-4000-8000-000000000002',2,'safety_gate','qSOFA = 0 ở bệnh nhân nghi nhiễm trùng. Kết luận phù hợp nhất?','Loại trừ sepsis','Không cần đánh giá cơ quan','qSOFA không dùng để loại trừ sepsis','Có thể cho về ngay','C',null,null,'qSOFA là tín hiệu nguy cơ tại giường, không phải test loại trừ sepsis.',null,'diagnosis','apply','medium',array['fever','sepsis','qsofa'],'published'),
('00000000-0000-4000-8000-000000000003',2,'special_cases','Nữ 24 tuổi ngày 4 sốt, đau bụng tăng, Hct tăng, tiểu cầu giảm. Điều cần ưu tiên?','Chỉ theo dõi nhiệt độ','Dùng NSAID','Đánh giá dengue dấu cảnh báo và tưới máu','Hết sốt là an toàn','C',null,null,'Ngày bệnh, Hct động học và dấu cảnh báo quan trọng hơn việc nhiệt độ giảm.',null,'management','apply','medium',array['fever','dengue','warning_signs'],'published'),
('00000000-0000-4000-8000-000000000004',2,'special_cases','Bệnh nhân hóa trị, sốt 38,5°C, ANC 0,2 ×10⁹/L, chưa thấy ổ.','Chờ ổ nhiễm rõ','Sốt giảm bạch cầu là cấp cứu nhiễm trùng tiềm ẩn','Chỉ hạ sốt','Không cần cấy','B',null,'Vật chủ giảm bạch cầu có thể ít dấu khu trú; cần đánh giá và khởi trị khẩn theo phác đồ.',null,null,'management','apply','medium',array['fever','febrile_neutropenia'],'published'),
('00000000-0000-4000-8000-000000000005',2,'investigations','Trước khi chỉ định một xét nghiệm ở bệnh nhân sốt, câu hỏi tốt nhất là gì?','Xét nghiệm nào phổ biến nhất?','Panel nào đầy đủ nhất?','Kết quả này sẽ thay đổi xử trí nào?','Xét nghiệm nào nhạy nhất?','C',null,null,'Một xét nghiệm có giá trị khi trả lời câu hỏi lâm sàng và có khả năng thay đổi quyết định.',null,'diagnosis','apply','medium',array['fever','investigations','clinical_reasoning'],'published')
on conflict (id) do update set
  stem=excluded.stem,
  option_a=excluded.option_a,
  option_b=excluded.option_b,
  option_c=excluded.option_c,
  option_d=excluded.option_d,
  correct_option=excluded.correct_option,
  explanation_a=excluded.explanation_a,
  explanation_b=excluded.explanation_b,
  explanation_c=excluded.explanation_c,
  explanation_d=excluded.explanation_d,
  competency=excluded.competency,
  bloom=excluded.bloom,
  difficulty=excluded.difficulty,
  tags=excluded.tags,
  status=excluded.status,
  updated_at=now();
