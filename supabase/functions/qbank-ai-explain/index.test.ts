import { assertEquals, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { QBankRegistry } from '../_shared/qbank-registry.ts';

Deno.test('CP02-AP01 is server-authoritative and internally consistent', () => {
  const q = QBankRegistry['CP02-AP01'];
  assert(q);
  assertEquals(q.clinical_problem_id, 2);
  assertEquals(q.section_key, 'safety_gate');
  assertEquals(q.competency, 'management');
  assertEquals(q.correct_option, 'B');
  assertEquals(q.options.length, 4);
  assert(q.stem.length > 40);
  assert(q.reviewed_takeaway.length > 40);
  assertEquals(q.reviewed_rationale.length, 4);
});

Deno.test('V1.1 trusted registry exposes only CP02 questions', () => {
  for (const [id, q] of Object.entries(QBankRegistry)) {
    assert(id.startsWith('CP02-'));
    assertEquals(q.clinical_problem_id, 2);
  }
});
