import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ADMIN_COOKIE, makeCookieValue } from "@/lib/admin-auth";
import { escapeHtml } from "@/lib/mail";

function htmlPage(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1.5rem; color: #1a1a2e; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .err { color: #b94a3c; }
    a { color: #e07a3c; }
    button { font: inherit; cursor: pointer; padding: 12px 24px; border: none; border-radius: 999px; background: #1e3a5f; color: #fff; font-weight: 600; }
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function getToken(url: URL): string {
  return (url.searchParams.get("token") || "").trim();
}

/**
 * GET renders a confirmation page only — it does NOT consume the token or
 * sign anyone in. This stops email security scanners / link prefetchers from
 * burning the one-time token before the admin actually clicks through.
 */
export async function GET(req: Request) {
  const token = getToken(new URL(req.url));
  if (!token || token.length < 32) {
    return htmlPage("Bad link", `<h1 class="err">That sign-in link is invalid.</h1>`, 400);
  }

  const postAction = `/admin/magic?token=${encodeURIComponent(token)}`;
  return htmlPage(
    "Sign in",
    `<h1>Sign in to the admin panel?</h1>
     <p>Click below to complete sign-in. This link works only once.</p>
     <form method="post" action="${escapeHtml(postAction)}">
       <button type="submit">Sign me in</button>
     </form>`
  );
}

export async function POST(req: Request) {
  const token = getToken(new URL(req.url));

  if (!token || token.length < 32) {
    return htmlPage("Bad link", `<h1 class="err">That sign-in link is invalid.</h1>`, 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return htmlPage("Not configured", `<h1 class="err">Admin isn't configured on the server.</h1>`, 503);
  }

  const { data: row } = await supabase
    .from("admin_magic_tokens")
    .select("token, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (!row) {
    return htmlPage(
      "Invalid link",
      `<h1 class="err">That sign-in link is invalid or has been used already.</h1>
       <p><a href="/admin/forgot">Request a new one</a>.</p>`,
      403
    );
  }

  if (row.used_at) {
    return htmlPage(
      "Already used",
      `<h1 class="err">That sign-in link has already been used.</h1>
       <p><a href="/admin/forgot">Request a new one</a>.</p>`,
      403
    );
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return htmlPage(
      "Expired",
      `<h1 class="err">That sign-in link has expired.</h1>
       <p><a href="/admin/forgot">Request a new one</a>.</p>`,
      403
    );
  }

  // Atomically mark the token used (the `is used_at null` guard makes this a
  // one-shot even under concurrent requests).
  const { data: claimed, error: markErr } = await supabase
    .from("admin_magic_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)
    .is("used_at", null)
    .select("token")
    .maybeSingle();

  if (markErr) {
    console.error("Magic token claim failed", markErr);
    return htmlPage("Error", `<h1 class="err">Couldn't complete sign-in. Please request a new link.</h1>`, 500);
  }

  if (!claimed) {
    // Another request already claimed it between our read and update.
    return htmlPage(
      "Already used",
      `<h1 class="err">That sign-in link has already been used.</h1>
       <p><a href="/admin/forgot">Request a new one</a>.</p>`,
      403
    );
  }

  const value = await makeCookieValue();
  if (!value) {
    return htmlPage(
      "Not configured",
      `<h1 class="err">No admin secret is set on the server, so no session cookie can be issued.</h1>`,
      503
    );
  }

  const c = await cookies();
  c.set({
    name: ADMIN_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL("/admin", req.url), 303);
}
