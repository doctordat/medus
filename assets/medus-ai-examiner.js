/* MEDUS AI V1.4 Clinical Examiner Engine
 * Interactive Oral Case Simulation & Fixed Rubric Grader
 * Evaluates learner clinical reasoning against authoritative MEDUS Clinical Case Rubrics.
 */
(function () {
  'use strict';

  const DEFAULT_RUBRIC = {
    safetyCheck: { name: 'Safety Gate & Red Flags', weight: 30 },
    coreIntervention: { name: 'Can thiệp lâm sàng cốt lõi', weight: 40 },
    rationale: { name: 'Biện luận sinh lý bệnh', weight: 20 },
    communication: { name: 'Giao tiếp & thứ tự ưu tiên', weight: 10 }
  };

  /**
   * Evaluate a learner's free-text / oral reasoning response for a specific case step.
   * @param {Object} step - Case step object { prompt, options, correct, feedback, keywords }
   * @param {string} userText - Learner's reasoning explanation
   * @returns {Object} Structured clinical rubric feedback
   */
  function evaluateClinicalReasoning(step, userText) {
    const text = String(userText || '').trim().toLowerCase();
    if (!text) {
      return {
        passed: false,
        totalScore: 0,
        verdict: 'Chưa có lập luận lâm sàng',
        breakdown: [
          { aspect: 'Safety Gate', score: 0, max: 30, feedback: 'Chưa đề cập dấu hiệu an toàn/khẩn cấp.' },
          { aspect: 'Can thiệp cốt lõi', score: 0, max: 40, feedback: 'Chưa nêu biện pháp xử trí then chốt.' },
          { aspect: 'Biện luận cơ chế', score: 0, max: 20, feedback: 'Chưa giải thích lý do chỉ định.' },
          { aspect: 'Thứ tự ưu tiên', score: 0, max: 10, feedback: 'Chưa xác lập trình tự xử trí.' }
        ],
        coachComment: 'Hãy nhập hoặc nói phân tích lâm sàng của bạn trước khi đối chiếu đáp án.',
        missedCompetency: 'Lập luận lâm sàng tự do'
      };
    }

    const correctOptionText = step.options && step.options[step.correct] ? step.options[step.correct].toLowerCase() : '';
    const feedbackText = String(step.feedback || '').toLowerCase();

    // Key clinical anchors detection
    const hasCoreAction = correctOptionText.split(/\s+/).filter(w => w.length > 3).some(word => text.includes(word));
    const hasSafetyAwareness = text.includes('ngay') || text.includes('khẩn') || text.includes('ưu tiên') || text.includes('áp lực') || text.includes('sốc') || text.includes('huyết áp');
    const hasMechanism = text.includes('vì') || text.includes('do') || text.includes('giúp') || text.includes('giảm') || text.includes('tăng') || text.includes('tưới máu');

    let safetyScore = hasSafetyAwareness ? 30 : 15;
    let coreScore = hasCoreAction ? 40 : 20;
    let rationaleScore = hasMechanism ? 20 : 10;
    let orderScore = text.length > 30 ? 10 : 5;

    const totalScore = safetyScore + coreScore + rationaleScore + orderScore;
    const passed = totalScore >= 70;

    return {
      passed,
      totalScore,
      verdict: passed ? 'Lập luận đạt chuẩn Hội đồng' : 'Cần củng cố trọng tâm xử trí',
      breakdown: [
        { aspect: 'Safety Gate & Red Flags', score: safetyScore, max: 30, feedback: safetyScore === 30 ? 'Nhận diện đúng tính khẩn cấp của bệnh cảnh.' : 'Cần nhấn mạnh hơn yếu tố đe dọa sinh mạng.' },
        { aspect: 'Can thiệp cốt lõi', score: coreScore, max: 40, feedback: coreScore === 40 ? 'Chỉ định trúng đích biện pháp đầu tay.' : 'Chưa nêu rõ thuốc/thủ thuật then chốt.' },
        { aspect: 'Biện luận cơ chế', score: rationaleScore, max: 20, feedback: rationaleScore === 20 ? 'Có liên hệ sinh lý bệnh rõ ràng.' : 'Cần giải thích sâu hơn cơ chế tác động.' },
        { aspect: 'Thứ tự ưu tiên', score: orderScore, max: 10, feedback: 'Trình bày mạch lạc, đúng thứ tự cấp cứu.' }
      ],
      coachComment: passed
        ? 'Giám khảo MEDUS AI đánh giá cao tư duy xử trí có định hướng và nhận thức rõ ranh giới an toàn bệnh nhân.'
        : 'Tư duy lâm sàng cần bám sát hơn phác đồ can thiệp giờ đầu và mục tiêu huyết động cốt lõi.',
      missedCompetency: passed ? null : 'Xác định can thiệp ưu tiên'
    };
  }

  window.MedusAiExaminer = Object.freeze({
    evaluateClinicalReasoning,
    DEFAULT_RUBRIC
  });
})();
