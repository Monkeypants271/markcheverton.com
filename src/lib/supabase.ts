import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key. Bypasses Row
 * Level Security — use ONLY from route handlers and server components,
 * never expose to the browser.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

export type DBComment = {
  id: number;
  post_id: number | null;
  post_slug: string;
  post_type: string;
  parent_id: number | null;
  author: string;
  author_email: string | null;
  ip_address: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  action_token: string;
  created_at: string;
  moderated_at: string | null;
};

export type DBIpBan = {
  ip_address: string;
  reason: string | null;
  banned_at: string;
};
