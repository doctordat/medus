(()=>{
  function getBasePath() {
    return location.pathname.startsWith('/medus/') ? '/medus/' : '/';
  }

  function getLearnUrl(slug) {
    const base = getBasePath();
    return slug ? `${base}hoc/?slug=${encodeURIComponent(slug)}` : `${base}hoc/`;
  }
  const cfg = {
    order: [
      'overview',
      'learning_objectives',
      'safety_gate',
      'mechanism',
      'history',
      'physical_exam',
      'differential',
      'investigations',
      'management',
      'decision_points',
      'pitfalls',
      'clinical_pearls',
      'checklist'
    ],
    labels: {
      overview: 'Tổng quan',
      learning_objectives: 'Mục tiêu học tập',
      safety_gate: 'Safety Gate / Red flags',
      mechanism: 'Cơ chế / Sinh lý bệnh',
      history: 'Bệnh sử có mục tiêu',
      physical_exam: 'Khám lâm sàng',
      differential: 'Chẩn đoán phân biệt',
      investigations: 'Cận lâm sàng',
      management: 'Xử trí ban đầu',
      decision_points: 'Decision points',
      pitfalls: 'Pitfalls',
      clinical_pearls: 'Clinical pearls',
      checklist: 'Checklist'
    },
    icons: {
      overview: '📖',
      learning_objectives: '🎯',
      safety_gate: '🚨',
      mechanism: '🧬',
      history: '🗣️',
      physical_exam: '🩺',
      differential: '⚖️',
      investigations: '🔬',
      management: '⚡',
      decision_points: '🔀',
      pitfalls: '⚠️',
      clinical_pearls: '💎',
      checklist: '✅'
    },
    fallback: {
      1: { id: 1, slug: 'tiep-can-kho-tho-cap', title: 'Tiếp cận bệnh nhân khó thở cấp', domain: 'Hô hấp & Cấp cứu' },
      2: { id: 2, slug: 'tiep-can-benh-nhan-sot', title: 'Tiếp cận bệnh nhân sốt', domain: 'Truyền nhiễm & Miễn dịch' },
      3: { id: 3, slug: 'tiep-can-benh-nhan-dau-nguc', title: 'Tiếp cận bệnh nhân đau ngực', domain: 'Tim mạch & Cấp cứu' },
      4: { id: 4, slug: 'tiep-can-dau-bung-cap', title: 'Tiếp cận đau bụng cấp', domain: 'Tiêu hóa & Ngoại khoa' },
      5: { id: 5, slug: 'tiep-can-benh-nhan-soc', title: 'Tiếp cận bệnh nhân sốc', domain: 'Hồi sức cấp cứu' }
    }
  };

  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();

  const safeUrl = u => {
    try {
      const x = new URL(String(u || '').trim(), location.href);
      return ['http:', 'https:'].includes(x.protocol) ? x.href : '';
    } catch { return ''; }
  };

  const yt = u => {
    try {
      const x = new URL(u);
      if (x.hostname === 'youtu.be') return x.pathname.slice(1);
      if (x.hostname.includes('youtube.com')) return x.searchParams.get('v') || ((x.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/) || [])[1] || '');
      return '';
    } catch { return ''; }
  };

  function clean(s = '', key = '', title = '') {
    let x = String(s || '').replace(/\r/g, '').replace(/MEDUS\s*[·•]\s*Draft first\s*[·•]\s*Medical Review before publish\.?/gi, '').trim();
    const names = [title, cfg.labels[key], key.replace(/_/g, ' ')].filter(Boolean).map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (names.length) {
      const re = new RegExp('^\\s*(?:\\d{1,2}[.)]\\s*)?(?:' + names.join('|') + ')\\s*[:.-]?\\s*', 'i');
      for (let i = 0; i < 2; i++) x = x.replace(re, '');
    }
    x = x.replace(/^\s*(?:Red flags|Learning objectives|Clinical pearls|Checklist|Decision points|Pitfalls)\s+/i, '').replace(/\s+(?:1[0-3]|[1-9])\.\s*$/, '').trim();
    return x;
  }

  function inline(raw) {
    let s = String(raw || ''), tokens = [];
    s = s.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g, (m, alt, url, cap) => {
      let u = safeUrl(url);
      if (!u) return m;
      let id = '@@M' + tokens.length + '@@';
      tokens.push('<figure class="medus-image"><img src="' + esc(u) + '" alt="' + esc(alt) + '" loading="lazy" referrerpolicy="no-referrer">' + ((cap || alt) ? '<figcaption>' + esc(cap || alt) + '</figcaption>' : '') + '</figure>');
      return id;
    });
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, label, url) => {
      let u = safeUrl(url);
      if (!u) return m;
      let id = '@@M' + tokens.length + '@@', vid = yt(u), pdf = /\.pdf(?:$|[?#])/i.test(u);
      tokens.push(vid ? '<a class="youtube-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span class="yt-icon">▶</span><span><b>' + esc(label) + '</b><small>Mở trên YouTube ↗</small></span></a>' : pdf ? '<a class="resource-card pdf-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span>▣</span><span><b>' + esc(label) + '</b><small>Mở tài liệu PDF ↗</small></span></a>' : '<a class="ext-link" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>');
      return id;
    });
    let out = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    tokens.forEach((t, i) => out = out.replace('@@M' + i + '@@', t));
    return out;
  }

  // Section-aware Medical Formatter to prevent dense text blocks
  function formatMedicalSection(raw, key, title) {
    const text = clean(raw, key, title);
    if (!text) return '<div class="empty-section">Chưa có nội dung cho mục này.</div>';

    // 1. SAFETY GATE / RED FLAGS
    if (key === 'safety_gate') {
      const items = splitSentencesOrBullets(text);
      return `
        <div class="med-alert-box red-flag-box">
          <div class="med-alert-header">
            <span class="alert-badge">🚨 RED FLAGS — CẦN LOẠI TRỪ KHẨN CẤP</span>
          </div>
          <div class="red-flag-grid">
            ${items.map(it => `<div class="red-flag-item"><span class="rf-icon">⚠️</span><div class="rf-text">${inline(it)}</div></div>`).join('')}
          </div>
        </div>`;
    }

    // 2. DECISION POINTS (IF - THEN logic)
    if (key === 'decision_points') {
      const steps = parseDecisionSteps(text);
      if (steps.length > 0) {
        return `
          <div class="decision-flow-container">
            <div class="flow-lead">Chuỗi phân nhánh quyết định hành động lâm sàng:</div>
            <div class="decision-steps">
              ${steps.map((st, idx) => `
                <div class="decision-step-card">
                  <div class="step-num">BƯỚC ${idx + 1}</div>
                  <div class="step-body">
                    ${st.cond ? `<div class="if-tag"><span>IF</span> ${inline(st.cond)}</div>` : ''}
                    ${st.action ? `<div class="then-tag"><span>THEN</span> ${inline(st.action)}</div>` : ''}
                    ${st.details ? `<div class="step-details">${inline(st.details)}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>`;
      }
    }

    // 3. PITFALLS (Bẫy lâm sàng)
    if (key === 'pitfalls') {
      const items = splitSentencesOrBullets(text);
      return `
        <div class="pitfalls-container">
          <div class="pitfalls-grid">
            ${items.map(it => `
              <div class="pitfall-card">
                <div class="pitfall-header"><span class="pf-icon">⚠️</span> <b>Bẫy thường gặp:</b></div>
                <div class="pf-content">${inline(it)}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    // 4. CLINICAL PEARLS (Viên ngọc lâm sàng)
    if (key === 'clinical_pearls') {
      const items = splitSentencesOrBullets(text);
      return `
        <div class="pearls-container">
          <div class="pearls-grid">
            ${items.map(it => `
              <div class="pearl-card">
                <div class="pearl-icon">💎</div>
                <div class="pearl-text">${inline(it)}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    // 5. CHECKLIST (Interactive checklist)
    if (key === 'checklist') {
      const items = splitChecklist(text);
      return `
        <div class="interactive-checklist-box">
          <div class="cl-header">
            <div>
              <h3>Bảng kiểm thực hành lâm sàng</h3>
              <p>Tick vào từng mục để kiểm tra mức độ sẵn sàng xử trí:</p>
            </div>
            <div class="cl-counter" id="clCounter">0 / ${items.length} hoàn thành</div>
          </div>
          <div class="cl-items">
            ${items.map((it, idx) => `
              <label class="cl-item">
                <input type="checkbox" class="med-checkbox" data-idx="${idx}">
                <span class="cl-custom-check"></span>
                <span class="cl-text">${inline(it)}</span>
              </label>
            `).join('')}
          </div>
        </div>`;
    }

    // 6. LEARNING OBJECTIVES
    if (key === 'learning_objectives') {
      const items = splitSentencesOrBullets(text);
      return `
        <div class="objectives-box">
          <ul class="obj-list">
            ${items.map(it => `<li><span class="obj-dot">✓</span><span>${inline(it)}</span></li>`).join('')}
          </ul>
        </div>`;
    }

    // DEFAULT STANDARD SECTIONS (Overview, Mechanism, History, Exam, Differential, Investigations, Management)
    return parseStandardMarkdown(text);
  }

  function splitChecklist(raw) {
    let lines = raw.split(/[\n☐]/).map(s => s.trim().replace(/^[-*•]?\s*\[[ xX]?\]\s*/, '').replace(/^[-*•]\s+/, '')).filter(Boolean);
    if (lines.length <= 1) {
      lines = raw.split(/(?=[☐\n]|\s{2,})/).map(s => s.trim().replace(/^[☐\-\*•]\s*/, '')).filter(s => s.length > 5);
    }
    return lines.length ? lines : [raw];
  }

  function splitSentencesOrBullets(raw) {
    let lines = raw.split('\n').map(s => s.trim().replace(/^[-*•\d+.)]\s*/, '')).filter(Boolean);
    if (lines.length <= 2 && raw.length > 100) {
      // Split by sentences or numbered points
      const byNums = raw.split(/(?=\d+[.)]\s+)/).map(s => s.trim().replace(/^\d+[.)]\s+/, '')).filter(Boolean);
      if (byNums.length > 1) return byNums;
      const byPeriod = raw.split(/(?<=[.!?])\s+(?=[A-ZĐÀ-Ỹ0-9])/).map(s => s.trim()).filter(s => s.length > 15);
      if (byPeriod.length > 1) return byPeriod;
    }
    return lines.length ? lines : [raw];
  }

  function parseDecisionSteps(raw) {
    const lines = raw.split('\n').map(s => s.trim()).filter(Boolean);
    const textToParse = lines.join(' ');
    // Split by numbered items or IF patterns
    const chunks = textToParse.split(/(?=\d+[.)]\s+IF\s+|\bIF\s+)/i).map(s => s.trim().replace(/^\d+[.)]\s*/, '')).filter(Boolean);
    const steps = [];

    for (const chunk of chunks) {
      const ifThenMatch = chunk.match(/^IF\s+(.+?)\s+THEN\s+(.+)$/i);
      if (ifThenMatch) {
        const cond = ifThenMatch[1].trim();
        const actionPart = ifThenMatch[2].trim();
        const actionSentences = actionPart.split(/(?<=[.!?])\s+/);
        const action = actionSentences[0];
        const details = actionSentences.slice(1).join(' ');
        steps.push({ cond, action, details });
      } else {
        steps.push({ cond: '', action: chunk, details: '' });
      }
    }
    return steps;
  }

  function parseStandardMarkdown(raw) {
    let out = [], list = null;
    const close = () => { if (list) { out.push('</' + list + '>'); list = null; } };

    for (let line of raw.split('\n')) {
      line = line.trim();
      if (!line) { close(); continue; }

      const img = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)$/);
      if (img) { close(); out.push(inline(line)); continue; }

      const plainUrl = line.match(/^https?:\/\/\S+$/);
      if (plainUrl) {
        close();
        let u = safeUrl(line), v = yt(u);
        out.push(v ? '<a class="youtube-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span class="yt-icon">▶</span><span><b>Xem video MEDUS</b><small>Mở trên YouTube ↗</small></span></a>' : '<p><a class="ext-link" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Mở tài liệu liên quan ↗</a></p>');
        continue;
      }

      if (/^#{2,3}\s+/.test(line)) {
        close();
        out.push('<h3 class="med-subheading">' + inline(line.replace(/^#{2,3}\s+/, '')) + '</h3>');
        continue;
      }

      if (/^>\s?/.test(line)) {
        close();
        out.push('<blockquote class="med-callout">' + inline(line.replace(/^>\s?/, '')) + '</blockquote>');
        continue;
      }

      if (/^[-*•]\s+/.test(line)) {
        if (list !== 'ul') { close(); out.push('<ul class="med-bullet-list">'); list = 'ul'; }
        out.push('<li>' + inline(line.replace(/^[-*•]\s+/, '')) + '</li>');
        continue;
      }

      if (/^\d+[.)]\s+/.test(line)) {
        if (list !== 'ol') { close(); out.push('<ol class="med-num-list">'); list = 'ol'; }
        out.push('<li>' + inline(line.replace(/^\d+[.)]\s+/, '')) + '</li>');
        continue;
      }

      close();
      out.push('<p class="med-para">' + inline(line) + '</p>');
    }
    close();
    return out.join('');
  }

  function slugFromPath() {
    const q = new URLSearchParams(location.search).get('slug');
    if (q) return q;
    const m = location.pathname.match(/\/hoc\/([^/?#]+)\/?$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  async function init() {
    if (!window.supabase || !window.MEDUS_SUPABASE_URL) return fail('Không tải được MEDUS Cloud.');
    const db = supabase.createClient(window.MEDUS_SUPABASE_URL, window.MEDUS_SUPABASE_PUBLISHABLE_KEY);
    const slug = slugFromPath();
    if (!slug) return renderCatalog(db);
    return renderArticleBySlug(db, slug);
  }

  async function renderCatalog(db) {
    $('#catalogMode').style.display = 'block';
    $('#articleMode').style.display = 'none';

    const localPkgs = window.MEDUS_LOCAL_PACKAGES || {};
    const { data: sectionRows, error: sErr } = await db.from('content_sections').select('clinical_problem_id,section_key').eq('medical_review_status', 'published');
    
    const counts = {};
    (sectionRows || []).forEach(x => counts[x.clinical_problem_id] = (counts[x.clinical_problem_id] || 0) + 1);

    // Merge local packages count
    Object.values(localPkgs).forEach(pkg => {
      counts[pkg.id] = Object.keys(pkg.sections || {}).length || 13;
    });

    const ids = Object.keys(counts).map(Number);
    if (!ids.length) return drawCatalog([], counts);

    const { data: problems } = await db.from('clinical_problems').select('id,slug,title,domain,priority,status').in('id', ids);
    const map = new Map((problems || []).map(x => [x.id, x]));
    ids.forEach(id => { 
      if (!map.has(id)) {
        if (localPkgs[id]) map.set(id, localPkgs[id]);
        else if (cfg.fallback[id]) map.set(id, cfg.fallback[id]);
      }
    });

    const items = [...map.values()].filter(x => counts[x.id] > 0).sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.id - b.id);
    drawCatalog(items, counts);
  }

  function drawCatalog(items, counts) {
    $('#catalogCount').textContent = items.length + ' bài học';
    const cards = $('#learnCards'), input = $('#learnSearch'), filters = $('#domainFilters'), counter = $('#resultCount');
    const domains = ['Tất cả', ...new Set(items.map(x => x.domain || 'Khác'))];
    let active = 'Tất cả';

    filters.innerHTML = domains.map((d, i) => '<button class="chip ' + (i === 0 ? 'active' : '') + '" data-domain="' + esc(d) + '">' + esc(d) + '</button>').join('');

    function draw() {
      const q = norm(input.value);
      const view = items.filter(x => (active === 'Tất cả' || (x.domain || 'Khác') === active) && (!q || norm((x.title || '') + ' ' + (x.domain || '')).includes(q)));
      counter.textContent = 'Hiển thị ' + view.length + ' / ' + items.length + ' bài học';
      cards.innerHTML = view.length ? view.map(x => {
        const c = counts[x.id] || 0;
        const pct = Math.round((c / 13) * 100);
        const isPriority = (x.priority && x.priority >= 8) || x.id === 3 || x.id === 2;
        return `
          <a class="cpCard" href="${getLearnUrl(x.slug)}">
            <div class="cpTop">
              <span class="badge-tag">Clinical Problem #${String(x.id).padStart(2, '0')}</span>
              ${isPriority ? '<span class="p0-badge">⚡ Khẩn/Ưu tiên</span>' : '<span class="count">' + c + '/13 mục</span>'}
            </div>
            <h3>${esc(x.title)}</h3>
            <div class="meta-row">
              <span class="domain-pill">🏥 ${esc(x.domain || 'Lâm sàng')}</span>
              <span class="time-est">⏱ ~15-20 phút</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${pct}%"></div>
            </div>
            <div class="card-footer">
              <span class="status-lbl">${c}/13 mục đã duyệt</span>
              <span class="open">Vào bài học →</span>
            </div>
          </a>`;
      }).join('') : '<div class="empty"><b>Không tìm thấy bài phù hợp.</b><p>Thử tìm theo từ khóa hoặc chọn chuyên khoa khác.</p></div>';
    }

    input.addEventListener('input', draw);
    filters.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      active = b.dataset.domain;
      filters.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === b));
      draw();
    });
    draw();
  }

  async function renderArticleBySlug(db, slug) {
    $('#catalogMode').style.display = 'none';
    $('#articleMode').style.display = 'block';

    const localPkgs = window.MEDUS_LOCAL_PACKAGES || {};
    const localPkg = Object.values(localPkgs).find(x => x.slug === slug);

    let problem = null;
    const { data: p } = await db.from('clinical_problems').select('id,slug,title,domain,status').eq('slug', slug).maybeSingle();
    problem = p || localPkg || Object.values(cfg.fallback).find(x => x.slug === slug) || null;
    if (!problem) return articleMissing('Clinical Problem chưa public metadata hoặc slug không đúng.');

    let sections = [];
    if (localPkg && localPkg.sections) {
      sections = Object.values(localPkg.sections);
    } else {
      const { data: secData, error } = await db.from('content_sections').select('section_key,title,content_md,source_title,source_locator,updated_at').eq('clinical_problem_id', problem.id).eq('medical_review_status', 'published');
      if (error && !localPkg) return articleMissing(error.message);
      sections = secData || [];
    }

    const { data: resources } = await db.from('clinical_problem_resources').select('resource_type,title,url,alt_text,caption,access_level,section_key,sort_order').eq('clinical_problem_id', problem.id).eq('medical_review_status', 'published').eq('access_level', 'public').order('sort_order', { ascending: true });
    const { data: quizRows } = await db.from('questions').select('id,section_key,stem,option_a,option_b,option_c,option_d,competency,bloom,difficulty,status').eq('clinical_problem_id', problem.id).eq('status', 'published').order('updated_at', { ascending: false }).limit(6);
    const { data: caseRows } = await db.from('cases').select('id,title,summary,status').eq('clinical_problem_id', problem.id).eq('status', 'published').order('updated_at', { ascending: false }).limit(3);
    const caseIds = (caseRows || []).map(x => x.id);
    const { data: caseSteps } = caseIds.length ? await db.from('case_steps').select('case_id,step_order,section_key,prompt,options,feedback').in('case_id', caseIds).order('step_order', { ascending: true }) : { data: [] };

    document.title = problem.title + ' | MEDUS Learner';
    $('#articleEy').textContent = 'MEDUS Learn · Clinical Problem ' + String(problem.id).padStart(2, '0');
    $('#articleTitle').textContent = problem.title;
    $('#articleSubtitle').textContent = 'Học theo chuỗi quyết định chuẩn hoá 13 bước từ nội dung đã Medical Review.';

    const map = new Map((sections || []).map(x => [x.section_key, x]));
    const ordered = cfg.order.map(k => map.get(k)).filter(Boolean);

    $('#heroCount').textContent = ordered.length + '/13 mục';
    $('#cloudText').innerHTML = `<strong>${ordered.length}/13 mục lâm sàng</strong> đã sẵn sàng học tập. Hoàn tất chuỗi quyết định để nắm vững ca bệnh.`;

    // Table of Contents
    $('#toc').innerHTML = `
      <a class="toc-back-btn" href="${getLearnUrl()}">← Danh sách bài học</a>
      <div class="toc-group-title">CÁC MỤC LÂM SÀNG</div>
      ${ordered.map((x, idx) => `
        <a class="toc-link" href="#${esc(x.section_key)}" data-section="${esc(x.section_key)}">
          <span class="toc-num">${String(idx + 1).padStart(2, '0')}</span>
          <span class="toc-icon">${cfg.icons[x.section_key] || '•'}</span>
          <span class="toc-text">${esc(cfg.labels[x.section_key] || x.title || x.section_key)}</span>
        </a>
      `).join('')}
    `;

    const resourceHtml = (resources || []).map(r => {
      let u = safeUrl(r.url);
      if (!u) return '';
      if (r.resource_type === 'image') return '<a class="resource-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(u) + '" alt="' + esc(r.alt_text || r.title) + '" loading="lazy"><span><b>' + esc(r.title) + '</b><small>' + esc(r.caption || 'Mở hình minh họa ↗') + '</small></span></a>';
      return '<a class="resource-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span><b>' + esc(r.title) + '</b><small>' + esc(r.caption || r.resource_type + ' ↗') + '</small></span></a>';
    }).join('');

    const sectionsHtml = ordered.length ? ordered.map((x, idx) => `
      <section class="section section-${esc(x.section_key)}" id="${esc(x.section_key)}">
        <div class="section-badge-header">
          <span class="step-pill">BƯỚC ${idx + 1} / ${ordered.length}</span>
          <span class="key-pill">${cfg.icons[x.section_key] || '•'} ${esc(x.section_key)}</span>
        </div>
        <h2 class="section-title">${esc(cfg.labels[x.section_key] || x.title || x.section_key)}</h2>
        <div class="section-body">
          ${formatMedicalSection(x.content_md || '', x.section_key, x.title || '')}
        </div>
        ${x.source_locator ? `
          <div class="source-footnote">
            <span class="fn-icon">📚</span> Nguồn tham khảo: <strong>${esc(x.source_title || 'MEDUS source')}</strong> (Trích xuất: ${esc(x.source_locator)})
          </div>` : ''}
      </section>
    `).join('') : '<div class="empty"><h2>Chưa có nội dung learner</h2><p>Bài này chưa có section Published.</p></div>';

    const quizHtml = (quizRows || []).length ? `
      <section class="section section-qbank" id="related-quiz">
        <div class="section-badge-header"><span class="step-pill">LUYỆN TẬP</span><span class="key-pill">📝 QBank Quiz</span></div>
        <h2 class="section-title">Câu hỏi kiểm tra nhanh</h2>
        <div class="quiz-grid">
          ${quizRows.map((q, idx) => `
            <div class="quiz-card">
              <div class="q-num">CÂU ${idx + 1}</div>
              <div class="q-stem">${esc(q.stem)}</div>
              <div class="q-meta">${esc([q.section_key || 'Chung', q.competency, q.bloom, q.difficulty].filter(Boolean).join(' • '))}</div>
            </div>
          `).join('')}
        </div>
      </section>` : '';

    const casesHtml = (caseRows || []).length ? `
      <section class="section section-cases" id="related-cases">
        <div class="section-badge-header"><span class="step-pill">LÂM SÀNG</span><span class="key-pill">👥 Clinical Cases</span></div>
        <h2 class="section-title">Ca bệnh mô phỏng</h2>
        <div class="cases-grid">
          ${caseRows.map(c => `
            <div class="case-card">
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.summary || 'Ca lâm sàng từng bước ra quyết định.')}</p>
              <span class="case-badge">${(caseSteps || []).filter(s => s.case_id === c.id).length} bước quyết định</span>
            </div>
          `).join('')}
        </div>
      </section>` : '';

    $('#content').innerHTML = sectionsHtml + (resourceHtml ? `
      <section class="section section-resources" id="resources">
        <div class="section-badge-header"><span class="step-pill">TÀI LIỆU</span><span class="key-pill">📂 Resources</span></div>
        <h2 class="section-title">Tài liệu & Hình minh họa</h2>
        <div class="resource-grid">${resourceHtml}</div>
      </section>` : '') + quizHtml + casesHtml;

    initInteractiveFeatures();
  }

  function initInteractiveFeatures() {
    // 1. Checklist Counter & Interactivity
    const checkboxes = document.querySelectorAll('.med-checkbox');
    const counter = $('#clCounter');
    if (checkboxes.length && counter) {
      function updateCl() {
        const checked = document.querySelectorAll('.med-checkbox:checked').length;
        counter.textContent = `${checked} / ${checkboxes.length} hoàn thành`;
        if (checked === checkboxes.length) {
          counter.classList.add('all-done');
        } else {
          counter.classList.remove('all-done');
        }
      }
      checkboxes.forEach(cb => cb.addEventListener('change', updateCl));
    }

    // 2. ScrollSpy for Table of Contents
    const sections = document.querySelectorAll('section.section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (sections.length && tocLinks.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  function articleMissing(msg) {
    $('#catalogMode').style.display = 'none';
    $('#articleMode').style.display = 'block';
    $('#articleTitle').textContent = 'Không tìm thấy bài Learn';
    $('#articleSubtitle').textContent = msg || 'Bài chưa sẵn sàng.';
    $('#heroCount').textContent = '0/13 mục';
    $('#toc').innerHTML = '<a href="' + getLearnUrl() + '">← Tất cả bài học</a>';
    $('#content').innerHTML = '<div class="empty"><b>Chưa có nội dung public.</b></div>';
  }

  function fail(msg) {
    const c = $('#learnCards') || $('#content');
    if (c) c.innerHTML = '<div class="empty"><b>Không tải được MEDUS Learn.</b><p>' + esc(msg) + '</p></div>';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
