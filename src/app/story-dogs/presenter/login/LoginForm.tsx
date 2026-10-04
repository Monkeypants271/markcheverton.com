'use client';
import { useState } from 'react';
export function LoginForm({ configured }: { configured: boolean }) {
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  if (!configured) return <section role="alert" className="sd-login-setup">
    <h2>Set your presenter password first</h2>
    <p>No presenter password has been saved for this website yet. Entering a password on this page cannot create the account.</p>
    <p>In your terminal, run these commands:</p>
    <pre><code>{'cd /Users/markcheverton/Desktop/markcheverton.com\nnpm run storydogs:setup'}</code></pre>
    <p>Enter your chosen password twice. Use at least 12 characters. Nothing appears while you type; that is normal. Do not send your password in chat.</p>
    <p>When the terminal says “Presenter configured,” click below to load the login form.</p>
    <button type="button" className="sd-button sd-gold" onClick={() => window.location.reload()}>I Finished Setup — Refresh Login</button>
  </section>;
  return <form onSubmit={async event => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch('/api/story-dogs/presenter/login', { method: 'POST', body: new URLSearchParams({ email: String(form.get('email')), password: String(form.get('password')) }) });
      if (response.ok) window.location.assign('/story-dogs/presenter');
      else setMessage((await response.json()).error || 'Invalid email or password.');
    } catch { setMessage('Login is unavailable. Please try again.'); }
    finally { setBusy(false); }
  }}>
    <label htmlFor="presenter-email">Email</label><input id="presenter-email" name="email" type="email" autoComplete="username" required defaultValue="Mark@chevertonauthorvisits.com" />
    <label htmlFor="presenter-password">Password</label><input id="presenter-password" name="password" type="password" autoComplete="current-password" required maxLength={512} />
    <button className="sd-button sd-gold" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Presenter Login'}</button><p role="status">{message}</p>
  </form>;
}
