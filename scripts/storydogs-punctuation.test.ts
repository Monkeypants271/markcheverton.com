import assert from 'node:assert/strict';
import test from 'node:test';
import { sameWords } from '../src/lib/storydogs-punctuation';
test('punctuation accepts capitalization, sentence boundaries, and invented names without rewriting', () => {
  assert.ok(sameWords('pip and zorblyn find moon seeds then they smile', 'Pip and Zorblyn find moon seeds. Then they smile!'));
  assert.ok(sameWords("juno can't wait", 'Juno can’t wait.'));
  for (const changed of ['Pip finds magic moon seeds.', 'Pip finds seeds.', 'Seeds find Pip moon.', 'Pip discovers moon seeds.']) assert.equal(sameWords('pip finds moon seeds', changed), false);
});
