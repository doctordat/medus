import assert from 'node:assert/strict';
import fs from 'node:fs';

const normalize = fs.readFileSync('admin/normalize/index.html', 'utf8');
const config = fs.readFileSync('assets/supabase-config.js', 'utf8');
const learn = fs.readFileSync('assets/learn-public.js', 'utf8');

const canonical = [
  'overview','learning_objectives','safety_gate','mechanism','history',
  'physical_exam','differential','investigations','management','decision_points',
  'pitfalls','clinical_pearls','checklist'
];

assert.equal((normalize.match(/const defs=\[/g) || []).length, 1, 'Normalize has one canonical definition');
for (const key of canonical) assert.match(normalize, new RegExp(`['"]${key}['"]`), `missing canonical key: ${key}`);
assert.match(normalize, /if\(!x\|\|analysis\.length!==13\|\|analysis\.some\(a=>!a\.pass\)\)return/);
assert.match(normalize, /medical_review_status:'draft'/);
assert.match(normalize, /source_id:x\.id/);
assert.match(normalize, /source_locator:'page '\+a\.page/);
assert.doesNotMatch(config, /window\.analyze\s*=\s*function/, 'config must not shadow strict Normalize analyze');
assert.match(config, /legacy flat parsing cannot shadow the canonical gate/);
assert.match(learn, /heroCount.*ordered\.length\+'\/13 mục'/);
assert.match(learn, /medical_review_status.*published/);
for (const key of canonical) assert.match(learn, new RegExp(`['"]${key}['"]`), `Learn missing canonical key: ${key}`);
console.log('P0 regression checks passed: canonical gate, draft provenance, review status, and learner contract.');
