-- MEDUS Source Extraction v1
-- Run once in Supabase SQL Editor after migration_source_storage_v1.sql

alter table public.sources add column if not exists extracted_text text;
alter table public.sources add column if not exists page_count integer;
alter table public.sources add column if not exists char_count integer;
alter table public.sources add column if not exists extraction_meta jsonb not null default '{}'::jsonb;

comment on column public.sources.extracted_text is 'Raw source-derived text extracted from the uploaded document. Not final MEDUS content.';
comment on column public.sources.extraction_meta is 'Extraction metadata such as extractor name/version and timestamps.';
