import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { QBankRegistry } from '../_shared/qbank-registry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' };

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function sanitizeText(value: unknown, max = 12000) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function parseModelJson(value: unknown) {
  if (typeof value !== 'string') return null;
  try { return JSON.parse(value); } catch (_) { return null; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const providerUrl = Deno.env.get('MEDUS_AI_API_URL');
  const providerKey = Deno.env.get('MEDUS_AI_API_KEY');
  const model = Deno.env.get('MEDUS_AI_MODEL') || 'medus-ai-default';

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json(503, { error: 'MEDUS AI backend is not configured.', code: 'SERVER_CONFIG_MISSING' });
  }

  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Bạn cần đăng nhập MEDUS.', code: 'AUTH_REQUIRED' });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false }
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  const user = userData?.user;
  if (userError || !user) return json(401, { error: 'Phiên đăng nhập không hợp lệ.', code: 'AUTH_INVALID' });

  let input: Record<string, unknown>;
  try { input = await req.json(); } catch (_) {
    return json(400, { error: 'JSON body không hợp lệ.', code: 'BAD_JSON' });
  }

  const questionId = sanitizeText(input.question_id, 120);
  const selectedOption = sanitizeText(input.selected_option, 1).toUpperCase();
  if (!questionId || !['A','B','C','D'].includes(selectedOption)) {
    return json(400, { error: 'Thiếu context câu hỏi bắt buộc.', code: 'INVALID_INPUT' });
  }

  const trustedQuestion = QBankRegistry[questionId];
  if (!trustedQuestion) {
    return json(409, {
      error: 'Câu hỏi này chưa được MEDUS AI V1.1 bật hỗ trợ.',
      code: 'QUESTION_NOT_ENABLED'
    });
  }

  // V1.1 is intentionally constrained to CP02 until the end-to-end path is medically reviewed.
  if (trustedQuestion.clinical_problem_id !== 2) {
    return json(409, { error: 'MEDUS AI V1.1 hiện chỉ mở cho CP02 — Tiếp cận bệnh nhân sốt.', code: 'CP_NOT_ENABLED' });
  }

  const clinicalProblemId = trustedQuestion.clinical_problem_id;
  const sectionKey = trustedQuestion.section_key;
  const competency = trustedQuestion.competency;
  const correctOption = trustedQuestion.correct_option;

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  let sourceQuery = admin
    .from('content_sections')
    .select('id,clinical_problem_id,section_key,title,content_md,source_title,source_locator,medical_review_status,updated_at')
    .eq('clinical_problem_id', clinicalProblemId)
    .eq('medical_review_status', 'published')
    .order('sort_order', { ascending: true })
    .limit(4);

  if (sectionKey) sourceQuery = sourceQuery.eq('section_key', sectionKey);
  let { data: sources, error: sourceError } = await sourceQuery;

  // If the exact section has no published row, broaden to the same published clinical problem.
  if (!sourceError && (!sources || sources.length === 0) && sectionKey) {
    const broad = await admin
      .from('content_sections')
      .select('id,clinical_problem_id,section_key,title,content_md,source_title,source_locator,medical_review_status,updated_at')
      .eq('clinical_problem_id', clinicalProblemId)
      .eq('medical_review_status', 'published')
      .order('sort_order', { ascending: true })
      .limit(4);
    sources = broad.data;
    sourceError = broad.error;
  }

  if (sourceError || !sources?.length) {
    return json(422, {
      insufficient_evidence: true,
      error: 'MEDUS chưa có đủ nguồn đã Medical Review để AI giải thích an toàn.',
      code: 'INSUFFICIENT_EVIDENCE',
      citations: []
    });
  }

  const evidence = sources.map((s, i) => ({
    ref: `S${i + 1}`,
    source_id: s.id,
    source_title: s.source_title || s.title || `MEDUS section ${s.section_key}`,
    source_locator: s.source_locator || s.section_key,
    section_key: s.section_key,
    content: sanitizeText(s.content_md, 7000)
  }));

  if (!providerUrl || !providerKey) {
    return json(503, {
      error: 'Model provider chưa được cấu hình trên server.',
      code: 'AI_PROVIDER_NOT_CONFIGURED',
      citations: evidence.map(({ content, ...c }) => c)
    });
  }

  const systemPrompt = `Bạn là MEDUS AI, trợ giảng y khoa cho bác sĩ học thi. Chỉ dùng EVIDENCE đã được Medical Review bên dưới. Không thêm guideline, liều, tiêu chuẩn hoặc khẳng định quyết định điều trị nếu không có trong evidence. Nếu evidence không đủ, trả insufficient_evidence=true. Không thay thế bác sĩ điều trị. Trả JSON hợp lệ với đúng keys: verdict_summary, reasoning_gap, why_correct, why_selected_is_wrong, one_rule_to_remember, citation_refs, confidence, insufficient_evidence. citation_refs chỉ chứa ref dạng S1, S2... có thật.`;

  const questionContext = {
    question_id: trustedQuestion.id,
    selected_option: selectedOption,
    correct_option: correctOption,
    stem: trustedQuestion.stem,
    options: trustedQuestion.options,
    reviewed_takeaway: trustedQuestion.reviewed_takeaway,
    reviewed_rationale: trustedQuestion.reviewed_rationale,
    section_key: sectionKey,
    competency
  };

  const startedAt = Date.now();
  let providerResponse: Response;
  try {
    providerResponse = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ question: questionContext, evidence }) }
        ]
      })
    });
  } catch (_) {
    return json(502, { error: 'Không kết nối được model provider.', code: 'AI_PROVIDER_UNAVAILABLE' });
  }

  if (!providerResponse.ok) {
    return json(502, { error: 'Model provider trả lỗi.', code: 'AI_PROVIDER_ERROR', provider_status: providerResponse.status });
  }

  const raw = await providerResponse.json();
  const modelText = raw?.choices?.[0]?.message?.content ?? raw?.output_text ?? null;
  const output = typeof modelText === 'object' ? modelText : parseModelJson(modelText);
  if (!output) return json(502, { error: 'Model không trả structured JSON hợp lệ.', code: 'AI_BAD_OUTPUT' });

  const validRefs = new Set(evidence.map(e => e.ref));
  const requestedRefs = Array.isArray(output.citation_refs)
    ? output.citation_refs.filter((r: unknown) => typeof r === 'string' && validRefs.has(r))
    : [];
  const citedEvidence = evidence.filter(e => requestedRefs.includes(e.ref));
  const insufficientEvidence = Boolean(output.insufficient_evidence) || citedEvidence.length === 0;

  const safeOutput = {
    verdict_summary: sanitizeText(output.verdict_summary, 1500),
    reasoning_gap: sanitizeText(output.reasoning_gap, 2500),
    why_correct: sanitizeText(output.why_correct, 3500),
    why_selected_is_wrong: sanitizeText(output.why_selected_is_wrong, 3500),
    one_rule_to_remember: sanitizeText(output.one_rule_to_remember, 1200),
    confidence: Math.max(0, Math.min(1, Number(output.confidence || 0))),
    insufficient_evidence: insufficientEvidence
  };

  const { data: interaction, error: interactionError } = await admin
    .from('ai_interactions')
    .insert({
      user_id: user.id,
      interaction_type: 'qbank_explain',
      clinical_problem_id: clinicalProblemId,
      question_id: trustedQuestion.id,
      section_key: sectionKey,
      competency,
      model_provider: 'configured',
      model_name: model,
      input_payload: questionContext,
      output_payload: safeOutput,
      confidence: safeOutput.confidence,
      insufficient_evidence: insufficientEvidence,
      latency_ms: Date.now() - startedAt
    })
    .select('id')
    .single();

  if (interactionError || !interaction) {
    return json(500, { error: 'Không lưu được AI trace.', code: 'TRACE_WRITE_FAILED' });
  }

  const citationRows = citedEvidence.map(c => ({
    interaction_id: interaction.id,
    source_id: String(c.source_id),
    source_title: c.source_title,
    source_locator: c.source_locator,
    clinical_problem_id: clinicalProblemId,
    section_key: c.section_key,
    content_version: null,
    quoted_text: null,
    relevance_score: null
  }));
  if (citationRows.length) {
    const { error: citationError } = await admin.from('ai_citations').insert(citationRows);
    if (citationError) {
      return json(500, { error: 'Không lưu được citation trace.', code: 'CITATION_WRITE_FAILED' });
    }
  }

  return json(200, {
    interaction_id: interaction.id,
    ...safeOutput,
    citations: citedEvidence.map(({ content, ...c }) => c)
  });
});
