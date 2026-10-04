import { randomBytes, scryptSync } from 'node:crypto';
import { mkdir, writeFile, chmod } from 'node:fs/promises';
import path from 'node:path';

if (!process.stdin.isTTY) throw Error('Run this command in an interactive terminal. Password input is not accepted from arguments or pipes.');
function hidden(prompt) {
  return new Promise((resolve, reject) => {
    let value = ''; process.stdout.write(prompt); process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
    const finish = () => { process.stdin.removeListener('data', input); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); };
    const input = chunk => {
      for (const char of chunk) {
        if (char === '\u0003') { finish(); reject(Error('Cancelled')); return; }
        if (char === '\r' || char === '\n') { finish(); resolve(value); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ') value += char;
      }
    };
    process.stdin.on('data', input);
  });
}
const password = await hidden('Presenter password (input hidden): ');
const confirmation = await hidden('Confirm password (input hidden): ');
if (password !== confirmation || password.length < 12) throw Error('Passwords must match and contain at least 12 characters.');
const salt = randomBytes(16).toString('hex');
const directory = path.join(process.cwd(), '.local'); await mkdir(directory, { recursive: true, mode: 0o700 }); await chmod(directory, 0o700);
await writeFile(path.join(directory, 'storydogs-presenter.json'), JSON.stringify({ passwordHash: `scrypt-32768-8-3$${salt}$${scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }).toString('hex')}`, cookieSecret: randomBytes(48).toString('base64url') }), { mode: 0o600 });
console.log('Presenter configured for Mark@chevertonauthorvisits.com. Only a password hash and random session secret were saved in ignored server-only configuration.');
