(async function(){
  if(!window.supabase||!window.MEDUS_SUPABASE_URL||!window.MEDUS_SUPABASE_PUBLISHABLE_KEY)return;
  const cp=Number(document.body.dataset.clinicalProblemId||2);
  const db=window.supabase.createClient(window.MEDUS_SUPABASE_URL,window.MEDUS_SUPABASE_PUBLISHABLE_KEY);
  const {data,error}=await db.from('content_sections').select('section_key,title,content_md,published_at').eq('clinical_problem_id',cp).eq('medical_review_status','published').order('published_at',{ascending:true});
  if(error||!data?.length)return;
  const map={mechanism:'physio',safety_gate:'safety',history:'history',physical_exam:'exam',investigations:'dx',management:'manage',pitfalls:'pitfall',checklist:'check'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function md(src=''){
    let lines=String(src).replace(/^> Draft[^\n]*\n+/,'').split(/\n/),out=[],list=false;
    for(const raw of lines){const line=raw.trim();if(!line){if(list){out.push('</ul>');list=false}continue}
      if(/^###\s+/.test(line)){if(list){out.push('</ul>');list=false}out.push('<h3>'+inline(line.replace(/^###\s+/,''))+'</h3>');continue}
      if(/^##\s+/.test(line)){if(list){out.push('</ul>');list=false}out.push('<h3>'+inline(line.replace(/^##\s+/,''))+'</h3>');continue}
      if(/^#\s+/.test(line)){if(list){out.push('</ul>');list=false}out.push('<h3>'+inline(line.replace(/^#\s+/,''))+'</h3>');continue}
      if(/^[-*•]\s+/.test(line)){if(!list){out.push('<ul>');list=true}out.push('<li>'+inline(line.replace(/^[-*•]\s+/,''))+'</li>');continue}
      if(/^\d+[.)]\s+/.test(line)){if(list){out.push('</ul>');list=false}out.push('<p>'+inline(line)+'</p>');continue}
      if(/^>\s?/.test(line)){if(list){out.push('</ul>');list=false}out.push('<div class="call">'+inline(line.replace(/^>\s?/,''))+'</div>');continue}
      if(line==='---'){if(list){out.push('</ul>');list=false}out.push('<hr>');continue}
      if(list){out.push('</ul>');list=false}out.push('<p>'+inline(line)+'</p>')
    }
    if(list)out.push('</ul>');return out.join('')
  }
  function inline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>')}
  let applied=0,extra=[];
  for(const x of data){const id=map[x.section_key];if(id&&document.getElementById(id)){
      const el=document.getElementById(id);el.innerHTML='<div class="k">MEDUS CLOUD · REVIEWED</div><h2>'+esc(x.title||x.section_key)+'</h2>'+md(x.content_md)+'<p class="small">Nội dung đã publish từ MEDUS Admin.</p>';applied++
    }else extra.push(x)
  }
  if(extra.length){const test=document.getElementById('test');for(const x of extra){const sec=document.createElement('section');sec.id='cloud-'+x.section_key;sec.innerHTML='<div class="k">MEDUS CLOUD · REVIEWED</div><h2>'+esc(x.title||x.section_key)+'</h2>'+md(x.content_md)+'<p class="small">Nội dung đã publish từ MEDUS Admin.</p>';test?.parentNode?.insertBefore(sec,test);applied++}}
  if(applied){const tag=document.querySelector('nav .tag');if(tag)tag.textContent='LIVE CONTENT';const note=document.createElement('div');note.className='call blue';note.innerHTML='<div class="k">MEDUS CLOUD</div>'+applied+' section trên trang này đang đọc trực tiếp từ nội dung đã được review và publish trong Supabase.';document.querySelector('.article')?.prepend(note)}
})();