'use client';
import { useState } from 'react';
export function LoginForm({ configured }: { configured: boolean }) {
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
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
    {!configured && <p>Presenter login needs private local setup. Run <code>npm run storydogs:setup</code> in this project’s terminal.</p>}
    <label htmlFor="presenter-email">Email</label><input id="presenter-email" name="email" type="email" autoComplete="username" required defaultValue="Mark@chevertonauthorvisits.com" />
    <label htmlFor="presenter-password">Password</label><input id="presenter-password" name="password" type="password" autoComplete="current-password" required maxLength={512} />
    <button className="sd-button sd-gold" type="submit" disabled={busy || !configured}>{busy ? 'Signing in…' : 'Presenter Login'}</button><p role="status">{message}</p>
  </form>;
}
