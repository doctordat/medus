/* MEDUS Ingestion & Parser Engine
 * Handles dragging/dropping files (.md, .json, .txt) and parsing them
 * into standardized MCQ Questions and 5-Step Clinical Cases.
 */
(function () {
  'use strict';

  function parseJsonContent(text) {
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        // Could be array of questions or cases
        if (data[0] && (data[0].stem || data[0].question || data[0].options)) {
          return { type: 'qbank', items: normalizeQuestions(data) };
        }
        if (data[0] && (data[0].steps || data[0].scenario)) {
          return { type: 'cases', items: normalizeCases(data) };
        }
      }
      if (typeof data === 'object') {
        if (data.questions || data.qbank) {
          return { type: 'qbank', items: normalizeQuestions(data.questions || data.qbank) };
        }
        if (data.cases || data.steps) {
          const caseList = Array.isArray(data.cases) ? data.cases : [data];
          return { type: 'cases', items: normalizeCases(caseList) };
        }
      }
    } catch (e) {
      // Not JSON, continue to text/md parser
    }
    return null;
  }

  function normalizeQuestions(rawList) {
    return rawList.map((q, idx) => {
      let options = q.options;
      if (!Array.isArray(options)) {
        options = [q.option_a || 'A', q.option_b || 'B', q.option_c || 'C', q.option_d || 'D'].filter(Boolean);
      }
      let correctIdx = 0;
      if (typeof q.correct === 'number') correctIdx = q.correct;
      else if (typeof q.correct_option === 'string') {
        correctIdx = Math.max(0, ['A', 'B', 'C', 'D'].indexOf(q.correct_option.toUpperCase()));
      }

      return {
        id: q.id || `IMPORT-MCQ-${Date.now()}-${idx + 1}`,
        cat: q.cat || 'CUSTOM',
        problem: q.problem || q.topic || 'Chuyên đề Tự Chọn',
        section: q.section || q.section_key || 'Safety Gate & Lâm Sàng',
        bloom: q.bloom || 'Áp dụng',
        comp: q.comp || q.competency || 'Chẩn đoán & Xử trí',
        stem: q.stem || q.question || 'Nội dung câu hỏi lâm sàng',
        options: options.length >= 2 ? options : ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
        correct: correctIdx,
        peer: q.peer || '90% học viên chọn đúng',
        takeaway: q.takeaway || q.reviewed_takeaway || 'Điểm then chốt lâm sàng cần ghi nhớ.',
        rationale: Array.isArray(q.rationale) ? q.rationale : [
          'A. Phân tích phương án A',
          'B. Phân tích phương án B',
          'C. Phân tích phương án C',
          'D. Phân tích phương án D'
        ],
        learnRef: q.learnRef || '../hoc/'
      };
    });
  }

  function normalizeCases(rawList) {
    return rawList.map((c, idx) => {
      const steps = (c.steps || []).map((s, sIdx) => ({
        name: s.name || `Bước ${sIdx + 1}. Xử trí lâm sàng`,
        vitals: s.vitals || { bp: '120/80', hr: '80 l/p', rr: '18 l/p', spo2: '98%', temp: '37.0 °C', bpDanger: false },
        scenario: s.scenario || s.prompt || 'Diễn tiến ca bệnh lâm sàng.',
        prompt: s.prompt || s.question || 'Hành động lâm sàng tiếp theo là gì?',
        options: Array.isArray(s.options) ? s.options : ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C'],
        correct: typeof s.correct === 'number' ? s.correct : (s.correct_index || 0),
        feedback: s.feedback || 'Biện luận lâm sàng chuẩn y khoa.'
      }));

      return {
        id: c.id || `IMPORT-CASE-${Date.now()}-${idx + 1}`,
        tag: c.tag || '🩺 CASE TỰ CHỌN · LÂM SÀNG',
        title: c.title || 'Ca Lâm Sàng Mở Rộng',
        steps: steps.length ? steps : [
          {
            name: '1. Tiếp nhận Cấp cứu',
            vitals: { bp: '130/80', hr: '85 l/p', rr: '18 l/p', spo2: '97%', temp: '37.0 °C', bpDanger: false },
            scenario: 'Bệnh nhân vào viện với tình trạng cấp tính.',
            prompt: 'Bước xử trí ban đầu ưu tiên là gì?',
            options: ['Đánh giá đường thở và tuần hoàn', 'Chờ làm xét nghiệm thường quy', 'Cho xuất viện'],
            correct: 0,
            feedback: 'Luôn ưu tiên nguyên tắc ABC trong cấp cứu ban đầu.'
          }
        ]
      };
    });
  }

  function parseMarkdownOrText(text) {
    const lines = text.split('\n');
    const questions = [];
    let curQ = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Detect Question Start (e.g., "Câu 1:", "Question 1:", "### 1.", "1.")
      const qMatch = line.match(/^(?:Câu\s*\d+[:.]|Question\s*\d+[:.]|###?\s*\d+[.:]|\d+[.:])\s*(.*)$/i);
      if (qMatch) {
        if (curQ && curQ.options.length >= 2) questions.push(curQ);
        curQ = {
          id: `IMPORT-MCQ-${Date.now()}-${questions.length + 1}`,
          cat: 'CUSTOM',
          problem: 'Câu hỏi Import',
          section: 'Safety Gate & Lâm Sàng',
          bloom: 'Áp dụng',
          comp: 'Chẩn đoán & Xử trí',
          stem: qMatch[1] || line,
          options: [],
          correct: 0,
          peer: '88% chọn đúng',
          takeaway: 'Ghi nhớ nguyên tắc chẩn đoán và xử trí cốt lõi.',
          rationale: [],
          learnRef: '../hoc/'
        };
        continue;
      }

      // Detect Options (A., B., C., D. or [A], [B])
      const optMatch = line.match(/^([A-D])[.:\)]\s*(.*)$/i);
      if (optMatch && curQ) {
        curQ.options.push(optMatch[2]);
        curQ.rationale.push(`<b>${optMatch[1].toUpperCase()}.</b> ${optMatch[2]}`);
        continue;
      }

      // Detect Correct Answer (e.g., "Đáp án: B", "Key: A", "Answer: C")
      const ansMatch = line.match(/^(?:Đáp án|Key|Answer|Correct)[:\s]*([A-D])/i);
      if (ansMatch && curQ) {
        curQ.correct = ['A', 'B', 'C', 'D'].indexOf(ansMatch[1].toUpperCase());
        continue;
      }

      // Detect Takeaway / Explanation
      const expMatch = line.match(/^(?:Giải thích|Takeaway|Rationale)[:\s]*(.*)$/i);
      if (expMatch && curQ) {
        curQ.takeaway = expMatch[1] || line;
        continue;
      }

      // Append to stem if options not started
      if (curQ && curQ.options.length === 0) {
        curQ.stem += ' ' + line;
      }
    }

    if (curQ && curQ.options.length >= 2) questions.push(curQ);

    if (questions.length > 0) {
      return { type: 'qbank', items: questions };
    }

    // Default fallback: wrap single text into 1 question
    return {
      type: 'qbank',
      items: [{
        id: `IMPORT-MCQ-${Date.now()}-1`,
        cat: 'CUSTOM',
        problem: 'Nội dung văn bản tự do',
        section: 'Safety Gate',
        bloom: 'Áp dụng',
        comp: 'Chẩn đoán & Xử trí',
        stem: text.slice(0, 300) + '...',
        options: ['Phương án A', 'Phương án B (Đúng)', 'Phương án C', 'Phương án D'],
        correct: 1,
        peer: '90% chọn đúng',
        takeaway: 'Điểm then chốt lâm sàng từ văn bản trích xuất.',
        rationale: ['A. Sai', 'B. Đúng', 'C. Sai', 'D. Sai'],
        learnRef: '../hoc/'
      }]
    };
  }

  function parseFile(fileContent) {
    const jsonRes = parseJsonContent(fileContent);
    if (jsonRes) return jsonRes;
    return parseMarkdownOrText(fileContent);
  }

  /**
   * Save imported items into browser LocalStorage so Learner QBank and Cases can read immediately
   */
  function saveToLearnerPool(parsedResult) {
    if (!parsedResult || !parsedResult.items) return 0;
    if (parsedResult.type === 'qbank') {
      const existing = JSON.parse(localStorage.getItem('medus_imported_qbank') || '[]');
      const merged = [...existing, ...parsedResult.items];
      localStorage.setItem('medus_imported_qbank', JSON.stringify(merged));
      return parsedResult.items.length;
    }
    if (parsedResult.type === 'cases') {
      const existing = JSON.parse(localStorage.getItem('medus_imported_cases') || '[]');
      const merged = [...existing, ...parsedResult.items];
      localStorage.setItem('medus_imported_cases', JSON.stringify(merged));
      return parsedResult.items.length;
    }
    return 0;
  }

  window.MedusAdminImporter = Object.freeze({
    parseFile,
    saveToLearnerPool
  });
})();
