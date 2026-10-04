/* eslint-disable @typescript-eslint/no-require-imports -- Standalone production HTTP regression. */
// Uses temporary random credentials and stateless cookies. Never changes the owner's configuration.
const assert = require('node:assert/strict');
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
  try {
    await start({ STORYDOGS_PASSWORD_HASH: '', STORYDOGS_SESSION_SECRET: '' });
    const unavailable = await (await fetch(base + '/story-dogs/presenter/login')).text();
    assert.ok(unavailable.includes('Private StoryDogs is temporarily unavailable'));
    assert.ok(!unavailable.includes('/Users/')); assert.ok(!unavailable.includes('npm run')); assert.ok(!unavailable.includes('id="presenter-password"'));
    assert.equal((await post('login', { email: 'nobody@example.com', password: 'invalid' })).status, 503);
    await stop();
    const password = crypto.randomBytes(24).toString('base64url');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = `scrypt-32768-8-3$${salt}$${crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }).toString('hex')}`;
    const secret = crypto.randomBytes(48).toString('base64url');
    await start({ VERCEL: '1', STORYDOGS_PASSWORD_HASH: hash, STORYDOGS_SESSION_SECRET: secret, STORYDOGS_PRESENTER_EMAIL: 'test-presenter@example.com', STORYDOGS_OPENAI_API_KEY: '', STORYDOGS_OPENAI_MODEL: '' });
    assert.ok((await (await fetch(base + '/story-dogs/presenter/login')).text()).includes('id="presenter-password"'));
    assert.equal((await post('punctuate', { passage: 'hello' })).status, 401);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password }, '', 'https://evil.example')).status, 403);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 401);
    assert.equal((await post('login', { email: 'wrong@example.com', password }, '', origin, '198.51.100.9')).status, 401);
    const login = await post('login', { email: 'TEST-PRESENTER@EXAMPLE.COM', password }); assert.equal(login.status, 200);
    const cookieHeader = login.headers.get('set-cookie');
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict']) assert.match(cookieHeader, new RegExp(flag, 'i'));
    const cookie = cookieHeader.split(';')[0];
    assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
    assert.equal((await fetch(base + '/story-dogs/presenter/login', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
    assert.equal((await post('punctuate', { passage: 'hello' }, cookie)).status, 503);
    const data = await unsealData(cookie.slice(cookie.indexOf('=') + 1), { password: secret, ttl: 28800 });
    assert.equal(data.expires - data.issuedAt, 8 * 60 * 60 * 1000);
    assert.equal(data.version, 2);
    assert.ok(!JSON.stringify(data).includes(hash));
    assert.ok(!('sid' in data) && !('fingerprint' in data));
    const expired = 'sd_presenter=' + await sealData({ ...data, expires: Date.now() - 1 }, { password: secret, ttl: 28800 });
    assert.equal((await post('punctuate', { passage: 'hello' }, expired)).status, 401);
    const tooLong = 'sd_presenter=' + await sealData({ ...data, expires: data.issuedAt + 9 * 60 * 60 * 1000 }, { password: secret, ttl: 28800 });
    assert.equal((await post('punctuate', { passage: 'hello' }, tooLong)).status, 401);
    const tampered = cookie.replace(/^(sd_presenter=.{20})(.)/, (_, prefix, char) => prefix + (char === 'A' ? 'B' : 'A'));
    assert.equal((await post('punctuate', { passage: 'hello' }, tampered)).status, 401);
    const logout = await post('logout', {}, cookie);
    assert.equal(logout.status, 303); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
    assert.equal((await post('punctuate', { passage: 'hello' })).status, 401);
    // Stateless logout clears this browser's cookie; a copied token remains valid.
    assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
    for (let i = 0; i < 2; i++) assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 401);
    assert.equal((await post('login', { email: 'test-presenter@example.com', password: 'wrong' })).status, 429);
    const attempts = await Promise.all(Array.from({ length: 12 }, (_, i) => post('login', { email: 'test-presenter@example.com', password: 'wrong' }, '', origin, `198.51.100.${20 + i}`)));
    assert.equal(attempts.filter(r => r.status === 429).length, 9);
    await stop();
    await start({ STORYDOGS_PASSWORD_HASH: hash, STORYDOGS_SESSION_SECRET: crypto.randomBytes(48).toString('base64url'), STORYDOGS_PRESENTER_EMAIL: 'test-presenter@example.com', STORYDOGS_OPENAI_API_KEY: '', STORYDOGS_OPENAI_MODEL: '' });
    assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
    console.log('PASS: production missing-config fallback without Mac instructions; configured login form; real temporary-password login; protected builder; Secure cookies; CSRF; eight-hour expiry; logout clears the cookie but copied tokens remain valid; signing-secret rotation rejects old tokens; per-process global and Vercel-IP counters. No live production login or microphone test is claimed.');
  } finally { await stop();  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
