import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ADMIN_COOKIE, makeCookieValue } from "@/lib/admin-auth";

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
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = (url.searchParams.get("token") || "").trim();

  if (!token || token.length < 32) {
    return htmlPage("Bad link", `<h1 class="err">That sign-in link is invalid.</h1>`, 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return htmlPage(
      "Not configured",
      `<h1 class="err">Admin isn't configured on the server.</h1>`,
      503
    );
  }

  // Look up
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

  // Mark token used (idempotent guard)
  const { error: markErr } = await supabase
    .from("admin_magic_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)
    .is("used_at", null);
  if (markErr) {
    return htmlPage("Error", `<h1 class="err">${markErr.message}</h1>`, 500);
  }

  // Set the admin session cookie
  const value = await makeCookieValue();
  if (!value) {
    return htmlPage(
      "Not configured",
      `<h1 class="err">ADMIN_PASSWORD isn't set on the server, so no session cookie can be issued.</h1>`,
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

  return NextResponse.redirect(new URL("/admin", req.url));
}
