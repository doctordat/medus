/* MEDUS AI V1.3 Adaptive QBank Selection Engine
 * Authoritative deterministic multi-factor question ranking model:
 * Score(q) = W_weak_section * S_section + W_weak_comp * S_comp + W_due * S_due + W_difficulty * S_diff - Penalty_recent
 * Deterministic, explainable, and fully compliant with MEDUS Canonical Rules.
 */
(function () {
  'use strict';

  const WEIGHTS = {
    WEAK_SECTION: 40,
    WEAK_COMPETENCY: 25,
    SPACED_DUE: 25,
    DIFFICULTY_FIT: 10,
    RECENT_PENALTY: 50
  };

  /**
   * Rank a pool of published questions for a learner.
   * @param {Array} questions - Candidate pool of questions.
   * @param {Object} context - Learner state { weakSections: {}, weakCompetencies: {}, recentQIds: [], reviewSchedule: {} }
   * @returns {Array} Sorted list of questions with rank score & pedagogical reason.
   */
  function rankAdaptiveQuestions(questions, context) {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const ctx = context || {};
    const weakSections = ctx.weakSections || {};
    const weakComps = ctx.weakCompetencies || {};
    const recentQIds = Array.isArray(ctx.recentQIds) ? ctx.recentQIds : [];
    const reviewSched = ctx.reviewSchedule || {};
    const targetDifficulty = ctx.targetDifficulty || 'Apply';

    const scored = questions.map(q => {
      let score = 0;
      const reasons = [];

      // 1. Weak Section Score (Max 40)
      const secKey = q.sectionKey || q.section || '';
      const secMisses = weakSections[secKey] || 0;
      if (secMisses > 0) {
        const secBonus = Math.min(WEIGHTS.WEAK_SECTION, secMisses * 15);
        score += secBonus;
        reasons.push(`Củng cố section yếu [${secKey}] (+${secBonus}đ)`);
      }

      // 2. Weak Competency Score (Max 25)
      const compKey = q.comp || q.competency || '';
      const compMisses = weakComps[compKey] || 0;
      if (compMisses > 0) {
        const compBonus = Math.min(WEIGHTS.WEAK_COMPETENCY, compMisses * 10);
        score += compBonus;
        reasons.push(`Bổ khuyết năng lực [${compKey}] (+${compBonus}đ)`);
      }

      // 3. Spaced Repetition Due (Max 25)
      const sched = reviewSched[q.id];
      if (sched) {
        const now = Date.now();
        const nextReview = sched.next_review_at ? new Date(sched.next_review_at).getTime() : now;
        if (now >= nextReview) {
          score += WEIGHTS.SPACED_DUE;
          reasons.push(`Đến hạn ôn tập ngắt quãng Spaced Repetition (+${WEIGHTS.SPACED_DUE}đ)`);
        }
      }

      // 4. Difficulty Fit (Max 10)
      if (q.bloom && q.bloom.includes(targetDifficulty)) {
        score += WEIGHTS.DIFFICULTY_FIT;
        reasons.push(`Độ khó phù hợp tầng nhận thức [${q.bloom}] (+${WEIGHTS.DIFFICULTY_FIT}đ)`);
      }

      // 5. Recent Exposure Penalty (Subtract 50)
      const recentIndex = recentQIds.indexOf(q.id);
      if (recentIndex !== -1) {
        const dist = recentQIds.length - recentIndex; // 1 = most recent
        if (dist <= 3) {
          score -= WEIGHTS.RECENT_PENALTY;
          reasons.push(`Trừ điểm tránh lặp câu vừa làm (-${WEIGHTS.RECENT_PENALTY}đ)`);
        }
      }

      return {
        question: q,
        adaptiveScore: score,
        adaptiveReason: reasons.length ? reasons.join(' · ') : 'Phân bố ngẫu nhiên theo Test Blueprint'
      };
    });

    // Sort descending by score, tie-break by ID
    scored.sort((a, b) => b.adaptiveScore - a.adaptiveScore || a.question.id.localeCompare(b.question.id));

    return scored;
  }

  window.MedusAdaptiveQBank = Object.freeze({
    rankAdaptiveQuestions,
    WEIGHTS
  });
})();
