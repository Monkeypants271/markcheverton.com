import assert from 'node:assert/strict';
import test from 'node:test';
import { sameWords } from '../src/lib/storydogs-punctuation';
test('punctuation accepts capitalization, sentence boundaries, and invented names without rewriting', () => {
  assert.ok(sameWords('pip and zorblyn find moon seeds then they smile', 'Pip and Zorblyn find moon seeds. Then they smile!'));
  assert.ok(sameWords("juno can't wait", 'Juno can’t wait.'));
  for (const changed of ['Pip finds magic moon seeds.', 'Pip finds seeds.', 'Seeds find Pip moon.', 'Pip discovers moon seeds.']) assert.equal(sameWords('pip finds moon seeds', changed), false);
});

import { punctuationProviderError } from '../src/lib/storydogs-provider-errors';
test('provider failures are categorized without echoing provider messages or credentials', () => {
  assert.equal(punctuationProviderError(401).category, 'provider-authentication');
  assert.equal(punctuationProviderError(429, 'insufficient_quota').category, 'billing-quota');
  assert.equal(punctuationProviderError(404, 'model_not_found').category, 'model-access');
  assert.equal(punctuationProviderError(400).category, 'integration');
  assert.equal(punctuationProviderError(429).category, 'provider-rate-limit');
  assert.equal(punctuationProviderError(503).category, 'provider-service');
});
