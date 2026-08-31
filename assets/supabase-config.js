window.MEDUS_SUPABASE_URL='https://dyghkjnfdpxybutitizo.supabase.co';
window.MEDUS_SUPABASE_PUBLISHABLE_KEY='sb_publishable_GVszrRWXpoM_NzXUFDcP1w_kgFbEWqi';

(()=>{
  const path=location.pathname;
  const isAdminHome=/\/medus\/admin\/(?:index\.html)?$/.test(path);
  const isNormalize=/\/medus\/admin\/normalize\//.test(path);
  const isReview=/\/medus\/admin\/review\//.test(path);

  function canonicalAdminGuard(){
    if(!isAdminHome)return;

    window.normalizeDraft=id=>{
      location.href='./normalize/?source='+encodeURIComponent(id||'');
    };

    const patch=()=>{
      document.querySelectorAll('button[onclick*="normalizeDraft"]').forEach(b=>{
        b.textContent='Normalize v3 → 13/13 Gate';
        b.title='Canonical pipeline only: đủ 13/13 section mới được tạo Draft';
      });

      const status=document.getElementById('reviewStatus');
      const pub=status?.querySelector('option[value="published"]');
      if(pub){
        pub.disabled=true;
        pub.textContent='Published — chỉ qua Review Editor';
      }

      const reviewPanel=document.getElementById('review');
      if(reviewPanel&&!document.getElementById('canonicalReviewLink')){
        const a=document.createElement('a');
        a.id='canonicalReviewLink';
        a.href='./review/';
        a.textContent='Mở Medical Review Editor →';
        a.style.cssText='display:inline-block;margin:0 0 14px;padding:10px 14px;border-radius:10px;background:#007f89;color:white;font-weight:800;text-decoration:none';
        reviewPanel.querySelector('.card')?.before(a);
      }

      const sourcesPanel=document.getElementById('sources');
      if(sourcesPanel&&!document.getElementById('canonicalPipelineNotice')){
        const n=document.createElement('div');
        n.id='canonicalPipelineNotice';
        n.className='notice';
        n.innerHTML='<b>Canonical pipeline duy nhất:</b> Upload PDF → Extract → <b>Normalize v3 (13/13)</b> → Draft → Medical Review → Publish. Không dùng normalizer cũ, không publish trực tiếp từ Content.';
        sourcesPanel.querySelector('.grid')?.before(n);
      }
    };

    document.addEventListener('DOMContentLoaded',()=>{
      const oldSave=window.saveSection;
      if(typeof oldSave==='function'){
        window.saveSection=async function(){
          const st=document.getElementById('reviewStatus')?.value;
          if(st==='published'){
            alert('Publish bị khóa tại Content. Hãy dùng Medical Review Editor để giữ đúng source-grounded gate.');
            location.href='./review/';
            return;
          }
          return oldSave.apply(this,arguments);
        };
      }
      patch();
      new MutationObserver(patch).observe(document.body,{childList:true,subtree:true});
    });
  }

  function normalizeDeepLinkAndFlatParser(){
    if(!isNormalize)return;

    const titles=[
      ['overview','Overview'],
      ['learning_objectives','Learning objectives'],
      ['safety_gate','Safety Gate / Red flags'],
      ['mechanism','Mechanism / Pathophysiology'],
      ['history','Targeted history'],
      ['physical_exam','Physical exam'],
      ['differential','Differential diagnosis'],
      ['investigations','Investigations'],
      ['management','Initial management'],
      ['decision_points','Decision points'],
      ['pitfalls','Pitfalls'],
      ['clinical_pearls','Clinical pearls'],
      ['checklist','Checklist']
    ];

    const escapeRe=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');
    const stripEditorial=s=>String(s||'')
      .replace(/--- PAGE \d+ ---/gi,' ')
      .replace(/MEDUS\s*[·•]\s*Draft first\s*[·•]\s*Medical Review before publish\.?/gi,'')
      .replace(/\s+/g,' ')
      .trim();

    function pageAt(raw,index){
      let page=1,m,re=/--- PAGE (\d+) ---/gi;
      while((m=re.exec(raw))&&m.index<index)page=+m[1];
      return page;
    }

    function parseFlat(raw){
      const hits=[];
      for(let i=0;i<titles.length;i++){
        const num=i+1,title=titles[i][1];
        const re=new RegExp('(?:^|\\s)'+num+'\\s*[.)]\\s*'+escapeRe(title)+'(?=\\s|$)','i');
        const m=re.exec(raw);
        hits.push(m?{start:m.index+(m[0].match(/^\s/)?.[0]?.length||0),end:m.index+m[0].length,page:pageAt(raw,m.index)}:null);
      }

      let ordered=true,last=-1;
      for(const h of hits){
        if(!h||h.start<=last){ordered=false;break}
        last=h.start;
      }

      return titles.map((d,i)=>{
        const h=hits[i];
        if(!h)return{key:d[0],title:d[1],text:'',page:null,words:0,pass:false,reason:'MISSING HEADING'};
        const end=(i<titles.length-1&&hits[i+1])?hits[i+1].start:raw.length;
        let body=stripEditorial(raw.slice(h.end,end));
        const words=body.split(/\s+/).filter(Boolean).length;
        const pass=ordered&&words>=8;
        return{key:d[0],title:d[1],text:body,page:h.page,words,pass,reason:!ordered?'WRONG ORDER':words<8?'TOO SHORT':'PASS'};
      });
    }

    document.addEventListener('DOMContentLoaded',()=>{
      const wanted=new URLSearchParams(location.search).get('source');
      if(wanted){
        let tries=0;
        const timer=setInterval(()=>{
          const sel=document.getElementById('source');
          if(sel&&[...sel.options].some(o=>o.value===wanted)){
            sel.value=wanted;
            clearInterval(timer);
            document.querySelector('button[onclick="analyze()"]')?.focus();
          }else if(++tries>40)clearInterval(timer);
        },150);
      }

      // The legacy PDF extractor flattens each page to one text line. Override v3 analysis
      // so canonical numbered headings are detected in the full raw stream, not only at line starts.
      window.analyze=function(){
        const sel=document.getElementById('source');
        const x=(typeof sources!=='undefined'?sources:[]).find(s=>s.id===sel?.value);
        if(!x)return;
        analysis=parseFlat(x.extracted_text||'');
        const pass=analysis.filter(a=>a.pass).length,all=pass===13;
        const summaryEl=document.getElementById('summary'),resultsEl=document.getElementById('results');
        if(summaryEl)summaryEl.innerHTML='<div class="'+(all?'good':'warn')+'"><span class="score">'+pass+'/13</span><br>'+(all?'Canonical format PASS.':'Chưa đạt canonical format. Không tạo Draft cho tới khi đủ 13/13.')+'</div><button class="btn" '+(!all?'disabled':'')+' onclick="createDrafts()">Tạo 13 Draft canonical</button>';
        if(resultsEl)resultsEl.innerHTML=analysis.map((a,i)=>'<div class="row '+(a.pass?'':'bad')+'"><div><b>'+(i+1)+'. '+a.title+'</b> <span class="badge">'+a.reason+'</span></div><div class="small">'+a.words+' từ · '+(a.page?'page '+a.page:'no locator')+'</div>'+(a.text?'<details><summary>Xem nội dung</summary><div class="preview">'+String(a.text).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))+'</div></details>':'')+'</div>').join('');
      };
    });
  }

  function reviewMediaHelpers(){
    if(!isReview)return;
    const insert=(kind)=>{
      const ta=document.getElementById('eContent');
      if(!ta)return;
      const url=prompt(kind==='image'?'Dán URL ảnh (https://...)':kind==='youtube'?'Dán link YouTube':'Dán URL bài viết/tài liệu');
      if(!url||!/^https?:\/\//i.test(url.trim()))return;
      let label='';
      if(kind==='image')label=prompt('Caption / mô tả ảnh','Hình minh họa')||'Hình minh họa';
      else if(kind==='youtube')label=prompt('Tên video','Xem video MEDUS')||'Xem video MEDUS';
      else label=prompt('Tên link','Đọc thêm')||'Đọc thêm';
      const md=kind==='image'?'!['+label+']('+url.trim()+')':'['+label+']('+url.trim()+')';
      const before=ta.value.trimEnd();
      ta.value=before+(before?'\n\n':'')+md+'\n';
      ta.focus();
      ta.selectionStart=ta.selectionEnd=ta.value.length;
    };

    const patch=()=>{
      const ta=document.getElementById('eContent');
      if(!ta||document.getElementById('medusMediaToolbar'))return;
      const bar=document.createElement('div');
      bar.id='medusMediaToolbar';
      bar.style.cssText='display:flex;gap:7px;flex-wrap:wrap;margin:7px 0 4px';
      bar.innerHTML='<button type="button" data-media="image">＋ Ảnh URL</button><button type="button" data-media="youtube">▶ YouTube</button><button type="button" data-media="link">↗ Link bài viết</button><span style="font-size:10px;color:#667b80;align-self:center">Chỉ lưu URL, không upload media lên MEDUS.</span>';
      bar.querySelectorAll('button').forEach(b=>{
        b.style.cssText='border:1px solid #dcebed;background:#fff;color:#103e47;border-radius:8px;padding:7px 9px;font-weight:750;cursor:pointer';
        b.onclick=()=>insert(b.dataset.media);
      });
      ta.parentElement?.insertBefore(bar,ta);
    };

    document.addEventListener('DOMContentLoaded',()=>{
      patch();
      new MutationObserver(patch).observe(document.body,{childList:true,subtree:true});
    });
  }

  canonicalAdminGuard();
  normalizeDeepLinkAndFlatParser();
  reviewMediaHelpers();
})();
