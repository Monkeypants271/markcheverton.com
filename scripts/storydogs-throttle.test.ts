import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

test('per-process counters enforce local limits, expire, bound memory, and are not shared across instances', async () => {
  const source = (await readFile(new URL('../src/lib/storydogs-server/throttle.ts', import.meta.url), 'utf8')).replace("import 'server-only';", '');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const url = 'data:text/javascript;base64,' + Buffer.from(output).toString('base64');
  const first = await import(url + '#first');
  const second = await import(url + '#second');
  const results = await Promise.all(Array.from({ length: 32 }, () => first.allowed('login', 8, 20)));
  assert.equal(results.filter(Boolean).length, 8);
  assert.equal(await second.allowed('login', 8, 20), true, 'another instance has independent counters');
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.equal(await first.allowed('login', 8, 20), true);
  const bounded = await import(url + '#bounded');
  for (let i = 0; i < 2048; i++) assert.equal(await bounded.allowed('ip:' + i, 4, 60000), true);
  assert.equal(await bounded.allowed('another-ip', 4, 60000), false);
  assert.equal(await bounded.allowed('ip:0', 4, 60000), true);
});
