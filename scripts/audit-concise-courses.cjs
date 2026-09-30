const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};

const { courses } = require('teaching-cpd/lib/catalogue.ts');
const { conciseCourse, completedModuleCount } = require('../lib/conciseCourses.ts');
const rows = courses.map(original => {
  const concise = conciseCourse(original);
  const retained = new Set(concise.modules.map(module => module.id));
  assert.equal(concise.id, original.id);
  assert.deepEqual(concise.objectives, original.objectives);
  assert.equal(concise.modules[0], original.modules[0]);
  assert.equal(concise.modules.at(-1), original.modules.at(-1));
  assert.equal(retained.size, concise.modules.length);
  assert.deepEqual(conciseCourse(concise), concise, 'Compaction must be idempotent');
  for (const module of original.modules) {
    // Every explanation, assessment, subject-specific module and first full case
    // stays byte-for-byte identical. Only the explicit optional groups may go.
    if (module.type === 'content' || module.type === 'quiz' || module.type === 'scenario'
      || module.id.startsWith(`overhaul4-case-${original.id}-1-`)) {
      assert.ok(retained.has(module.id), `${original.id}: missing ${module.id}`);
    }
  }
  for (const type of ['content', 'visual', 'quiz', 'scenario', 'activity', 'checklist', 'reflection']) {
    if (original.modules.some(module => module.type === type)) {
      assert.ok(concise.modules.some(module => module.type === type), `${original.id}: missing ${type}`);
    }
  }
  assert.ok(concise.modules.length < original.modules.length);
  assert.ok(concise.duration < original.duration);
  const oldIds = original.modules.map(module => module.id);
  assert.equal(completedModuleCount(concise, [...oldIds, ...oldIds, 'deleted-old-id']), concise.modules.length);
  assert.equal(completedModuleCount(concise, oldIds.filter(id => !retained.has(id))), 0);
  for (const module of concise.modules) assert.equal(module, original.modules.find(item => item.id === module.id));
  return { course: concise.title, originalSlides: original.modules.length, conciseSlides: concise.modules.length,
    originalMinutes: original.duration, conciseMinutes: concise.duration,
    reductionPercent: Math.round(100 * (1 - concise.modules.length / original.modules.length)) };
});
const removed = rows.reduce((sum, row) => sum + row.originalSlides - row.conciseSlides, 0);
console.log(JSON.stringify({ courses: rows.length, removedRequiredSlides: removed,
  reductionRange: [Math.min(...rows.map(row => row.reductionPercent)), Math.max(...rows.map(row => row.reductionPercent))],
  averageReduction: Math.round(rows.reduce((sum, row) => sum + row.reductionPercent, 0) / rows.length),
  rows }, null, 2));
