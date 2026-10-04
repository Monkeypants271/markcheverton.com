import { isIP } from 'node:net';
import { boundedBody } from '@/lib/storydogs-server/request';
import { NextResponse } from 'next/server';
import { presenterEmail, presenterSession, verifyPassword, loginSession, sameOrigin, privateHeaders } from '@/lib/storydogs-server/auth';
import { allowed } from '@/lib/storydogs-server/throttle';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  if (Number(request.headers.get('content-length') || 0) > 4096) return new Response(null, { status: 413 });
  try {
    if (!await presenterSession()) return NextResponse.json({ error: 'Private StoryDogs is temporarily unavailable.' }, { status: 503, headers: privateHeaders });
    // Trust only Vercel's edge-provided identity, never arbitrary proxy headers on other hosts.
    if (process.env.VERCEL === '1') {
      const ip = (request.headers.get('x-vercel-forwarded-for') || '').split(',')[0].trim();
      if (!await allowed('presenter-login-ip:' + (isIP(ip) ? ip : 'unknown'), 4, 15 * 60 * 1000)) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: privateHeaders });
    }
    if (!await allowed('presenter-login', 8, 15 * 60 * 1000)) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: privateHeaders });
    const body = await boundedBody(request, 4096); if (body.length > 4096) return new Response(null, { status: 413 });
    const form = new URLSearchParams(body); const email = (form.get('email') || '').trim().toLowerCase(); const password = form.get('password') || '';
    const context = await presenterSession();
    const valid = context && await verifyPassword(password, context.config.passwordHash);
    if (!valid || email !== presenterEmail) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401, headers: privateHeaders });
    await loginSession(context); return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch { return NextResponse.json({ error: 'Login is not available. Please try again later.' }, { status: 503, headers: privateHeaders }); }
}
