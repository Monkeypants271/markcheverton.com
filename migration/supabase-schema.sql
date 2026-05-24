-- Run this once in your Supabase project:
--   Supabase dashboard → SQL Editor → New query → paste this → Run
--
-- Creates the two tables Phase 6 needs.
-- Safe to re-run; "if not exists" guards prevent errors.

create table if not exists public.comments (
  id           bigserial primary key,
  post_id      integer,                              -- legacy WP post ID if known
  post_slug    text not null,                        -- the MDX slug, e.g. "here-is-something-new-from-ethan"
  post_type    text not null default 'fanfic',       -- 'fanfic' | 'blog' | etc
  parent_id    bigint references public.comments(id) on delete cascade,
  author       text not null,
  author_email text,
  ip_address   text,                                 -- captured at submit time
  content      text not null,
  status       text not null default 'pending'       -- 'pending' | 'approved' | 'rejected'
                check (status in ('pending', 'approved', 'rejected')),
  action_token text not null,                        -- random token used by email moderation links
  created_at   timestamptz not null default now(),
  moderated_at timestamptz
);

create index if not exists comments_post_slug_status_idx
  on public.comments (post_slug, status, created_at desc);

create index if not exists comments_status_idx
  on public.comments (status, created_at desc);

create table if not exists public.ip_bans (
  ip_address text primary key,
  reason     text,
  banned_at  timestamptz not null default now()
);

create table if not exists public.admin_magic_tokens (
  token       text primary key,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Fan fiction submissions awaiting moderation.
-- Slug is assigned at approval time so we can dedupe against existing MDX.
create table if not exists public.fanfic_submissions (
  id           bigserial primary key,
  slug         text unique,
  title        text not null,
  author       text not null,
  author_email text,
  ip_address   text,
  content      text not null,
  status       text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  action_token text not null,
  created_at   timestamptz not null default now(),
  moderated_at timestamptz
);

create index if not exists fanfic_submissions_status_idx
  on public.fanfic_submissions (status, created_at desc);

create index if not exists fanfic_submissions_slug_idx
  on public.fanfic_submissions (slug)
  where status = 'approved';

-- Row Level Security: we'll always go through the service role from our API
-- routes, so block all anonymous direct access.
alter table public.comments             enable row level security;
alter table public.ip_bans              enable row level security;
alter table public.admin_magic_tokens   enable row level security;
alter table public.fanfic_submissions   enable row level security;

-- No anon policies = anon clients can read/write nothing directly.
-- The service role bypasses RLS, which is what our server routes use.
