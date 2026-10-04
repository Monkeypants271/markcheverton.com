import { NextResponse } from 'next/server';
import { logoutSession, sameOrigin, privateHeaders } from '@/lib/storydogs-server/auth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  await logoutSession(); return NextResponse.redirect(new URL('/story-dogs/presenter/login', request.url), { status: 303, headers: privateHeaders });
}
