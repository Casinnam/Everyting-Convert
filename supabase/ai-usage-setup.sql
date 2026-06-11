-- AI Tools: daily usage limits
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
--
-- Unlike public.usage_counters (lifetime totals for file conversions),
-- this table counts per-day usage so free AI quotas reset every day (UTC).

create table if not exists public.ai_usage_counters (
  identity   text        not null,
  day        date        not null default (now() at time zone 'utc')::date,
  tool       text        not null,
  count      integer     not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (identity, day, tool)
);

alter table public.ai_usage_counters enable row level security;
-- No policies on purpose: only the service role (Edge Functions) may touch this table.

create index if not exists ai_usage_counters_day on public.ai_usage_counters (day);

create or replace function public.record_ai_usage(
  usage_identity text,
  usage_tool text,
  usage_limit integer default 3
)
returns table (
  identity text,
  tool text,
  count integer,
  remaining integer,
  allowed boolean
)
language plpgsql
security definer
set search_path = public
as $$
-- The RETURNS TABLE columns shadow ai_usage_counters columns inside the
-- function body; without this directive the ON CONFLICT target is ambiguous.
#variable_conflict use_column
declare
  today date := (now() at time zone 'utc')::date;
  current_count integer;
begin
  insert into public.ai_usage_counters (identity, day, tool, count)
  values (usage_identity, today, usage_tool, 0)
  on conflict (identity, day, tool) do nothing;

  select ai_usage_counters.count
  into current_count
  from public.ai_usage_counters
  where ai_usage_counters.identity = usage_identity
    and ai_usage_counters.day = today
    and ai_usage_counters.tool = usage_tool
  for update;

  if current_count >= usage_limit then
    return query
    select usage_identity, usage_tool, current_count, 0, false;
    return;
  end if;

  update public.ai_usage_counters
  set count = ai_usage_counters.count + 1,
      updated_at = now()
  where ai_usage_counters.identity = usage_identity
    and ai_usage_counters.day = today
    and ai_usage_counters.tool = usage_tool
  returning ai_usage_counters.count into current_count;

  return query
  select usage_identity, usage_tool, current_count, greatest(usage_limit - current_count, 0), true;
end;
$$;

-- Block direct calls from browser clients so the counter cannot be inflated.
-- Revoking from PUBLIC also strips service_role, so grant it back explicitly:
-- Edge Functions call this RPC through the service role key.
revoke execute on function public.record_ai_usage(text, text, integer) from public;
revoke execute on function public.record_ai_usage(text, text, integer) from anon;
revoke execute on function public.record_ai_usage(text, text, integer) from authenticated;
grant execute on function public.record_ai_usage(text, text, integer) to service_role;

-- Make PostgREST pick up the new function immediately.
notify pgrst, 'reload schema';

-- Optional housekeeping: rows older than 7 days are useless.
-- If pg_cron is enabled (see AI-TOOLS-SETUP.md Step 8):
-- select cron.schedule(
--   'delete-old-ai-usage',
--   '30 3 * * *',
--   $$delete from public.ai_usage_counters where day < (now() at time zone 'utc')::date - 7$$
-- );
