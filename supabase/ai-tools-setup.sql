-- AI Tools: job tracking table
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.ai_jobs (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references auth.users(id) on delete set null,
  tool          text        not null check (tool in ('transcription', 'remove-bg', 'smart-ocr')),
  status        text        not null default 'processing'
                            check (status in ('processing', 'preview_ready', 'paid', 'complete', 'failed', 'expired')),
  stripe_session_id text,
  input_path    text,       -- Supabase Storage path of the uploaded file
  output_path   text,       -- Supabase Storage path for the full result (private)
  preview_data  jsonb       not null default '{}',
  result_meta   jsonb       not null default '{}',
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default now() + interval '24 hours'
);

alter table public.ai_jobs enable row level security;

-- Only service role (used by Edge Functions) can write.
-- Anyone who knows the UUID (random 128-bit) can read their job status.
create policy "Public read ai_jobs by id" on public.ai_jobs
  for select using (true);

-- Useful indexes
create index if not exists ai_jobs_stripe_session on public.ai_jobs (stripe_session_id)
  where stripe_session_id is not null;
create index if not exists ai_jobs_expires_at on public.ai_jobs (expires_at);
create index if not exists ai_jobs_user on public.ai_jobs (user_id)
  where user_id is not null;


-- ─────────────────────────────────────────────────
-- Storage buckets  (run from Dashboard → Storage,
--  or via Supabase CLI: supabase storage create)
-- ─────────────────────────────────────────────────
-- Bucket: ai-uploads   (public:false, file_size_limit: 50MB)
--   Policy: allow INSERT for anon role (anyone can upload)
--   Policy: allow SELECT for service role only
--
-- Bucket: ai-results   (public:false, file_size_limit: 100MB)
--   Policy: service role only (Edge Functions access results)
--
-- See AI-TOOLS-SETUP.md → Step 4 for exact policy SQL.
