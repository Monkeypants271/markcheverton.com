/* eslint-disable @typescript-eslint/no-require-imports -- Standalone production HTTP regression. */
// Uses temporary random credentials and simulated Redis. Never changes the owner's configuration.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { sealData, unsealData } = require('iron-session');
const base = 'http://127.0.0.1:3031';
const origin = 'https://127.0.0.1:3031';
let child;
async function stop() {
  if (child && child.exitCode === null) { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)); }
}
async function start(env) {
  child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3031'], { env: { ...process.env, NODE_ENV: 'production', ...env }, stdio: 'ignore' });
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error('Production test server failed to start.');
    try { const response = await fetch(base + '/story-dogs/presenter/login'); if (response.status === 200) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw Error('Production test server timed out.');
}
const post = (route, body, cookie = '', requestOrigin = origin, ip = '198.51.100.5') => fetch(base + '/api/story-dogs/presenter/' + route, {
  method: 'POST', redirect: 'manual', headers: { Origin: requestOrigin, Cookie: cookie, 'x-vercel-forwarded-for': ip, 'Content-Type': route === 'login' ? 'application/x-www-form-urlencoded' : 'application/json' },
  body: route === 'login' ? new URLSearchParams(body) : JSON.stringify(body),
});
(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'storydogs-production-check-'));
  try {
    await start({ STORYDOGS_PASSWORD_HASH: '', STORYDOGS_SESSION_SECRET: '', STORYDOGS_REDIS_REST_URL: '', STORYDOGS_REDIS_REST_TOKEN: '' });
    const unavailable = await (await fetch(base + '/story-dogs/presenter/login')).text();
    assert.ok(unavailable.includes('Private StoryDogs is temporarily unavailable'));
    assert.ok(!unavailable.includes('/Users/')); assert.ok(!unavailable.includes('npm run')); assert.ok(!unavailable.includes('id="presenter-password"'));
    assert.equal((await post('login', { email: 'nobody@example.com', password: 'invalid' })).status, 503);
    await stop();
    const preload = path.join(directory, 'redis-mock.cjs');
    await fs.writeFile(preload, `const originalFetch=global.fetch; const entries=new Map();
      global.fetch=async(url,init)=>{if(String(url)!=='https://storydogs-redis-test.invalid')return originalFetch(url,init);
      const a=JSON.parse(init.body), key=a[0]==='EVAL'?a[3]:a[1];let result=null;
      if(entries.get(key)?.until<=Date.now())entries.delete(key);
      if(a[0]==='SET'){entries.set(key,{value:a[2],until:Date.now()+a[4]});result='OK';}
      if(a[0]==='GET')result=entries.get(key)?.value??null;
      if(a[0]==='DEL'){entries.delete(key);result=1;}
      if(a[0]==='EVAL'){const prior=entries.get(key),n=Number(prior?.value||0);result=n<a[4]?1:0;if(result)entries.set(key,{value:String(n+1),until:prior?.until||Date.now()+a[5]});}
      return Response.json({result});};`);
    const password = crypto.randomBytes(24).toString('base64url');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = `scrypt-32768-8-3$${salt}$${crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }).toString('hex')}`;
    const secret = crypto.randomBytes(48).toString('base64url');
    await start({ VERCEL: '1', STORYDOGS_PASSWORD_HASH: hash, STORYDOGS_SESSION_SECRET: secret, STORYDOGS_PRESENTER_EMAIL: 'test-presenter@example.com', STORYDOGS_REDIS_REST_URL: 'https://storydogs-redis-test.invalid', STORYDOGS_REDIS_REST_TOKEN: 'test-only', STORYDOGS_REDIS_NAMESPACE: 'isolated-test', STORYDOGS_OPENAI_API_KEY: '', STORYDOGS_OPENAI_MODEL: '', NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --require ${preload}` });
    assert.ok((await (await fetch(base + '/story-dogs/presenter/login')).text()).includes('id="presenter-password"'));
    assert.equal((await post('punctuate', { passage: 'hello' })).status, 401);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password }, '', 'https://evil.example')).status, 403);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 401);
    const login = await post('login', { email: 'TEST-PRESENTER@EXAMPLE.COM', password }); assert.equal(login.status, 200);
    const cookieHeader = login.headers.get('set-cookie');
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict']) assert.match(cookieHeader, new RegExp(flag, 'i'));
    const cookie = cookieHeader.split(';')[0];
    assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
    assert.equal((await fetch(base + '/story-dogs/presenter/login', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
    assert.equal((await post('punctuate', { passage: 'hello' }, cookie)).status, 503);
    const data = await unsealData(cookie.slice(cookie.indexOf('=') + 1), { password: secret, ttl: 14400 });
    const expired = 'sd_presenter=' + await sealData({ ...data, expires: Date.now() - 1 }, { password: secret, ttl: 14400 });
    assert.equal((await post('punctuate', { passage: 'hello' }, expired)).status, 401);
    assert.equal((await post('logout', {}, cookie)).status, 303);
    assert.equal((await post('punctuate', { passage: 'hello' }, cookie)).status, 401);
    for (let i = 0; i < 2; i++) assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 401);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 429);
    const attempts = await Promise.all(Array.from({ length: 12 }, (_, i) => post('login', { email: 'test-presenter@example.com', password: 'wrong' }, '', origin, `198.51.100.${20 + i}`)));
    assert.equal(attempts.filter(r => r.status === 429).length, 8);
    console.log('PASS: production missing-config fallback without Mac instructions; configured login form; real temporary-password login; protected builder; Secure cookies; CSRF; expiry; logout/replay; concurrent global and Vercel-IP throttling. Redis is simulated, no live production login or microphone test is claimed.');
  } finally { await stop(); await fs.rm(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
