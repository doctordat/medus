from pathlib import Path
import re
root=Path(__file__).parents[1]
normalize=(root/'admin/normalize/index.html').read_text()
config=(root/'assets/supabase-config.js').read_text()
learn=(root/'assets/learn-public.js').read_text()
keys=['overview','learning_objectives','safety_gate','mechanism','history','physical_exam','differential','investigations','management','decision_points','pitfalls','clinical_pearls','checklist']
assert normalize.count('const defs=[')==1
for k in keys: assert re.search(r"['\"]"+k+r"['\"]",normalize)
assert "analysis.length!==13||analysis.some(a=>!a.pass)" in normalize
assert "medical_review_status:'draft'" in normalize and "source_id:x.id" in normalize
assert 'window.analyze=function' not in config
assert 'legacy flat parsing cannot shadow the canonical gate' in config
assert "ordered.length+'/13 mục'" in learn
assert "medical_review_status','published" in learn
for k in keys: assert re.search(r"['\"]"+k+r"['\"]",learn)
print('P0 regression checks passed')
