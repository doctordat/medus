-- Draft seed only. Review title/caption/attribution before applying.
-- Do not run in production without owner + medical review confirmation.
insert into public.clinical_problem_resources (
  clinical_problem_id, section_key, resource_type, title, url, caption,
  attribution_license, source_id, source_locator, sort_order,
  access_level, medical_review_status
) values (
  2,
  'mechanism',
  'youtube',
  'Video tham khảo: tiếp cận bệnh nhân sốt',
  'https://youtu.be/EfpEu86BqRI',
  'Video tham khảo — cần reviewer xác nhận nội dung trước khi publish',
  'YouTube creator attribution — verify before publication',
  '39a03cbd-0af5-4f64-8f1e-68388026a84a',
  'CP2 fever PDF · Mechanism / page 2',
  2,
  'public',
  'draft'
);
