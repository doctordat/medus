/* MEDUS AI V1 client helpers
 * Browser code never contains provider secrets. It only calls a server-side
 * Supabase Edge Function with the learner's current access token.
 */
(function () {
  'use strict';

  const DEFAULT_FUNCTION = 'qbank-ai-explain';

  function getSupabaseClient() {
    return window.medusSupabase || window.supabaseClient || window._supabase || null;
  }

  async function getAccessToken() {
    const client = getSupabaseClient();
    if (!client?.auth?.getSession) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data?.session?.access_token || null;
  }

  function getFunctionUrl(functionName) {
    const cfg = window.MEDUS_SUPABASE_CONFIG || window.SUPABASE_CONFIG || {};
    const base = cfg.url || cfg.supabaseUrl || window.SUPABASE_URL || '';
    if (!base) throw new Error('MEDUS Supabase URL is not configured.');
    return `${base.replace(/\/$/, '')}/functions/v1/${functionName}`;
  }

  async function explainQBankAnswer(payload, options) {
    const token = await getAccessToken();
    if (!token) {
      const error = new Error('Bạn cần đăng nhập MEDUS để dùng Hỏi MEDUS AI.');
      error.code = 'AUTH_REQUIRED';
      throw error;
    }

    const functionName = options?.functionName || DEFAULT_FUNCTION;
    const response = await fetch(getFunctionUrl(functionName), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    let body = null;
    try { body = await response.json(); } catch (_) { /* no-op */ }

    if (!response.ok) {
      const error = new Error(body?.error || 'MEDUS AI hiện chưa phản hồi được.');
      error.status = response.status;
      error.code = body?.code || 'AI_REQUEST_FAILED';
      throw error;
    }

    return body;
  }

  function buildQBankPayload(question, selectedIndex) {
    if (!question) throw new Error('Question context is required.');
    const selectedLetter = String.fromCharCode(65 + selectedIndex);
    const correctLetter = String.fromCharCode(65 + question.correct);

    return {
      question_id: question.id,
      selected_option: selectedLetter,
      correct_option: correctLetter,
      clinical_problem_id: question.clinicalProblemId || 2,
      section_key: question.sectionKey || null,
      section_label: question.section || null,
      competency: question.comp || null,
      stem: question.stem,
      options: question.options,
      reviewed_takeaway: question.takeaway,
      reviewed_rationale: question.rationale,
      learn_ref: question.learnRef || null
    };
  }

  window.MedusAI = Object.freeze({
    explainQBankAnswer,
    buildQBankPayload
  });
})();