/* eslint-disable @typescript-eslint/no-require-imports -- Private CLI configuration transfer. */
// Sends existing private values directly to this project's Production environment.
// Never prints values, pulls .env.local, or provisions services.
const fs = require('node:fs/promises');
const path = require('node:path');
const projectId = 'prj_UBFDYIuagK8fbLSiVQ3T2ER7cEB3';
const teamId = 'team_9oyFl4zqMKtTegoBu6Uj8mPV';
(async () => {
  const auth = JSON.parse(await fs.readFile(path.join(process.env.HOME, 'Library/Application Support/com.vercel.cli/auth.json'), 'utf8'));
  const config = JSON.parse(await fs.readFile('.local/storydogs-presenter.json', 'utf8'));
  const localEnv = await fs.readFile('.env.local', 'utf8');
  const value = key => localEnv.match(new RegExp('^' + key + '=(.*)$', 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  if (!/^scrypt-32768-8-3\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(config.passwordHash) || config.cookieSecret?.length < 32) throw Error('Local private presenter configuration is incomplete.');
  const apiKey = value('STORYDOGS_OPENAI_API_KEY'); const model = value('STORYDOGS_OPENAI_MODEL');
  if (!apiKey || !model || !auth.token) throw Error('Local provider configuration or Vercel authorization is incomplete.');
  const values = { STORYDOGS_PRESENTER_EMAIL: 'Mark@chevertonauthorvisits.com', STORYDOGS_PASSWORD_HASH: config.passwordHash, STORYDOGS_SESSION_SECRET: config.cookieSecret, STORYDOGS_OPENAI_API_KEY: apiKey, STORYDOGS_OPENAI_MODEL: model };
  const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`, {
    method: 'POST', headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
    body: JSON.stringify(Object.entries(values).map(([key, value]) => ({ key, value, type: 'sensitive', target: ['production'] }))),
  });
  const data = await response.json();
  if (!response.ok || data.error || data.errors?.length) throw Error(`Hosting configuration failed (${response.status}); no private values were printed.`);
  const check = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env?teamId=${teamId}`, { headers: { Authorization: `Bearer ${auth.token}` }, signal: AbortSignal.timeout(15000) });
  const result = await check.json();
  if (!check.ok || Object.keys(values).some(key => !(result.envs || []).some(v => v.key === key && v.target?.includes('production') && v.type === 'sensitive'))) throw Error('Private hosting variable verification failed.');
  console.log('PASS: five private Production variables transferred and verified as sensitive. Values were not displayed. Redeploy to load them. No service was provisioned.');
})().catch(() => { console.error('Private transfer failed. Check Vercel authorization and local configuration; no secret values were displayed.'); process.exitCode = 1; });
