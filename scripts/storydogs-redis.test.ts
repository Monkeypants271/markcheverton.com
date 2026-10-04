import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Next aliases server-only during bundling; strip that marker only for this isolated adapter test.
test('shared store expires sessions, revokes logout, atomically limits concurrency, and fails closed', async () => {
  const source = (await readFile(new URL('../src/lib/storydogs-server/redis.ts', import.meta.url), 'utf8')).replace("import 'server-only';", '');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const adapter = await import('data:text/javascript;base64,' + Buffer.from(output).toString('base64'));
  const previous = { url: process.env.STORYDOGS_REDIS_REST_URL, token: process.env.STORYDOGS_REDIS_REST_TOKEN, fetch: globalThis.fetch };
  const entries = new Map<string, { value: string; expires: number }>();
  let unavailable = false;
  let sawExpiry = false;
  process.env.STORYDOGS_REDIS_REST_URL = 'https://redis.example.test';
  process.env.STORYDOGS_REDIS_REST_TOKEN = 'temporary-test-token';
  globalThis.fetch = (async (_url, init) => {
    if (unavailable) return new Response('{}', { status: 503 });
    const args = JSON.parse(String(init?.body));
    assert.ok((init?.headers as Record<string, string>).Authorization);
    let result: unknown = null;
    const key = args[0] === 'EVAL' ? args[3] : args[1];
    const entry = entries.get(key);
    if (entry && entry.expires <= Date.now()) entries.delete(key);
    if (args[0] === 'SET') { assert.equal(args[3], 'PX'); sawExpiry = true; entries.set(key, { value: args[2], expires: Date.now() + args[4] }); result = 'OK'; }
    if (args[0] === 'GET') result = entries.get(key)?.value ?? null;
    if (args[0] === 'DEL') { entries.delete(key); result = 1; }
    if (args[0] === 'EVAL') {
      assert.match(args[1], /INCR/); assert.match(args[1], /PEXPIRE/);
      const count = Number(entries.get(key)?.value || 0);
      result = count < args[4] ? 1 : 0;
      if (result) entries.set(key, { value: String(count + 1), expires: entries.get(key)?.expires || Date.now() + args[5] });
    }
    return Response.json({ result });
  }) as typeof fetch;
  try {
    assert.equal(adapter.redisConfigured(), true);
    await adapter.redisPut('session:test', { expires: Date.now() + 10000 });
    assert.ok(sawExpiry); assert.ok(await adapter.redisGet('session:test'));
    await adapter.redisRemove('session:test'); assert.equal(await adapter.redisGet('session:test'), null);
    await adapter.redisPut('session:expired', { expires: Date.now() - 100 });
    await new Promise(resolve => setTimeout(resolve, 5));
    assert.equal(await adapter.redisGet('session:expired'), null);
    const limits = await Promise.all(Array.from({ length: 32 }, () => adapter.redisAllowed('login', 8, 20)));
    assert.equal(limits.filter(Boolean).length, 8);
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.equal(await adapter.redisAllowed('login', 8, 20), true);
    unavailable = true;
    await assert.rejects(adapter.redisGet('session:test'), /unavailable/);
    await assert.rejects(adapter.redisAllowed('login', 8, 20), /unavailable/);
    process.env.STORYDOGS_REDIS_REST_TOKEN = '';
    assert.equal(adapter.redisConfigured(), false);
    await assert.rejects(adapter.redisGet('session:test'), /unavailable/);
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [key, value] of [['STORYDOGS_REDIS_REST_URL', previous.url], ['STORYDOGS_REDIS_REST_TOKEN', previous.token]]) {
      if (value === undefined) delete process.env[key!]; else process.env[key!] = value;
    }
  }
});
