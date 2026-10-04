/* eslint-disable @typescript-eslint/no-require-imports -- Private live verification. */
// Default mode prompts privately for the real password. --session-only instead
// seals a test token using the already configured local secret; it does NOT test login.
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const { sealData, unsealData } = require('iron-session');
const base = 'https://www.markcheverton.com';
const seconds = 8 * 60 * 60;
function hiddenPassword() {
  if (!process.stdin.isTTY) throw Error('Run in an interactive terminal; password input is hidden.');
  return new Promise((resolve, reject) => {
    let value = ''; process.stdout.write('Presenter password (input hidden): ');
    process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
    const finish = () => { process.stdin.removeListener('data', input); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); };
    const input = chunk => { for (const char of chunk) {
      if (char === '\u0003') { finish(); reject(Error('Cancelled')); return; }
      if (char === '\r' || char === '\n') { finish(); resolve(value); return; }
      if (char === '\u007f' || char === '\b') value = value.slice(0, -1); else if (char >= ' ') value += char;
    } };
    process.stdin.on('data', input);
  });
}
const post = (route, body, cookie = '', origin = base) => fetch(base + '/api/story-dogs/presenter/' + route, {
  method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { Origin: origin, Cookie: cookie, 'Content-Type': route === 'login' ? 'application/x-www-form-urlencoded' : 'application/json' },
  body: route === 'login' ? new URLSearchParams(body) : JSON.stringify(body),
});
(async () => {
  const config = JSON.parse(await fs.readFile('.local/storydogs-presenter.json', 'utf8'));
  const sessionOnly = process.argv.includes('--session-only');
  const form = await (await fetch(base + '/story-dogs/presenter/login')).text();
  assert.ok(form.includes('id="presenter-password"'), 'Live login form is unavailable.');
  assert.ok(!form.includes('/Users/') && !form.includes('npm run'));
  assert.equal((await post('punctuate', { passage: 'hello' })).status, 401);
  let cookie;
  if (sessionOnly) {
    const issuedAt = Date.now();
    cookie = 'sd_presenter=' + await sealData({ version: 2, email: 'mark@chevertonauthorvisits.com', issuedAt, expires: issuedAt + seconds * 1000 }, { password: config.cookieSecret, ttl: seconds });
  } else {
    let password = await hiddenPassword();
    const response = await post('login', { email: 'Mark@chevertonauthorvisits.com', password }); password = '';
    assert.equal(response.status, 200, 'Login failed; check the entered password or host settings.');
    const header = response.headers.get('set-cookie');
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Max-Age=28800']) assert.match(header, new RegExp(flag, 'i'));
    cookie = header.split(';')[0];
  }
  const data = await unsealData(cookie.slice(cookie.indexOf('=') + 1), { password: config.cookieSecret, ttl: seconds });
  assert.equal(data.expires - data.issuedAt, seconds * 1000);
  assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
  assert.equal((await fetch(base + '/story-dogs/presenter/login', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
  assert.equal((await post('punctuate', { passage: 'hello' }, cookie, 'https://example.invalid')).status, 403);
  const expired = 'sd_presenter=' + await sealData({ ...data, issuedAt: Date.now() - seconds * 1000 - 1000, expires: Date.now() - 1000 }, { password: config.cookieSecret, ttl: seconds });
  assert.equal((await post('punctuate', { passage: 'hello' }, expired)).status, 401);
  assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: expired }, redirect: 'manual' })).status, 307);
  const raw = 'zorblyn found a tiny door under the school library then pip brought a map they wondered where the stairs went';
  const response = await post('punctuate', { passage: raw }, cookie);
  const result = await response.json();
  if (!response.ok) throw Error(`Live AI failed: HTTP ${response.status}, category ${result.category || 'authentication-or-configuration'}.`);
  const words = text => text.match(/[\p{L}\p{N}]+/gu).map(w => w.toLowerCase()).join(' ');
  assert.equal(words(result.text), words(raw)); assert.match(result.text, /[.!?]/);
  const logout = await post('logout', {}, cookie);
  assert.equal(logout.status, 303); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal((await fetch(base + '/story-dogs/presenter', { redirect: 'manual' })).status, 307);
  // A deliberately retained copy remains valid until expiry with stateless cookies.
  assert.equal((await fetch(base + '/story-dogs/presenter', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
  console.log(`PASS: live login form, ${sessionOnly ? 'privately sealed test token (password login NOT tested)' : 'real-password login and cookie flags'}, authenticated builder, eight-hour payload, expired-token rejection, cookie-clearing logout, copied-token limitation, public AI rejection, and real authenticated AI punctuation with words preserved. No secret values displayed; no microphone test performed.`);
})().catch(error => { console.error(error.message?.startsWith('Live AI failed:') ? error.message : 'Live verification failed. Check the password, hosting configuration, and deployment; no private values were printed.'); process.exitCode = 1; });
