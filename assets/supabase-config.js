window.MEDUS_SUPABASE_URL='https://dyghkjnfdpxybutitizo.supabase.co';
window.MEDUS_SUPABASE_PUBLISHABLE_KEY='sb_publishable_GVszrRWXpoM_NzXUFDcP1w_kgFbEWqi';

(()=>{
  const path=location.pathname;
  const isAdminHome=/\/medus\/admin\/(?:index\.html)?$/.test(path);
  const isNormalize=/\/medus\/admin\/normalize\//.test(path);
  const isReview=/\/medus\/admin\/review\//.test(path);

  function canonicalAdminGuard(){
    if(!isAdminHome)return;

    // Kill the legacy keyword-snippet normalizer. Every source must pass Normalize v3.
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

    // Functions in admin/index.html are declared after this shared config file.
    // Patch them after parsing is complete and whenever source cards rerender.
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

  function normalizeDeepLink(){
    if(!isNormalize)return;
    document.addEventListener('DOMContentLoaded',()=>{
      const wanted=new URLSearchParams(location.search).get('source');
      if(!wanted)return;
      let tries=0;
      const timer=setInterval(()=>{
        const sel=document.getElementById('source');
        if(sel&&[...sel.options].some(o=>o.value===wanted)){
          sel.value=wanted;
          clearInterval(timer);
          document.querySelector('button[onclick="analyze()"]')?.focus();
        }else if(++tries>40)clearInterval(timer);
      },150);
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
  normalizeDeepLink();
  reviewMediaHelpers();
})();
