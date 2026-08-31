# P0 QA checklist

## Static checks completed
- [x] Learn has canonical order list of 13 keys.
- [x] Public query filters `medical_review_status = published`.
- [x] Normalize creates 13 draft rows only after all 13 pass.
- [x] Draft rows retain `source_id` and page locator.
- [x] Config no longer shadows strict Normalize `analyze()`.
- [x] Markdown renderer handles paragraphs, unordered/ordered lists, checklist syntax, image URLs, YouTube URLs, and external links.
- [x] Responsive CSS has mobile breakpoints for Learn and Review/Normalize.

## Runtime checks still required with authenticated reviewer
- [ ] Upload canonical PDF for Sốt and Đau ngực.
- [ ] Extract text and verify page markers/searchability.
- [ ] Normalize both through the same UI engine: 13/13.
- [ ] Create 13 drafts each; verify source IDs and locators.
- [ ] Review all 26 sections; publish only through Review.
- [ ] Confirm public Learn displays 13/13 for both without duplicate headings/footer metadata.
- [ ] Verify media URLs and Vietnamese Unicode on desktop/mobile.
- [ ] Verify anon cannot read draft/review/rejected rows and non-staff cannot mutate.

## Blocker
The shell lacks Node (`node: command not found`), so JavaScript test execution and browser-based local runtime QA are not available from this environment. Supabase E2E also requires an authenticated reviewer session and explicit approval before any production publish/backfill.
