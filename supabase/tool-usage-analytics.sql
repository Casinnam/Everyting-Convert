-- Tool usage analytics: count every successful conversion (all tools, guests
-- included) so the admin dashboard can show how many people use each tool.
-- This is separate from usage_counters (which enforces the free-tier limit) —
-- here we only COUNT, with no limit and no exemptions.

-- ── Daily aggregate: one row per (day, tool, account type) ──
create table if not exists public.tool_usage_daily (
  day date not null,
  tool_id text not null,
  account_type text not null default 'guest',  -- guest | free | pro | admin
  conversions integer not null default 0 check (conversions >= 0),
  updated_at timestamptz not null default now(),
  primary key (day, tool_id, account_type)
);

alter table public.tool_usage_daily enable row level security;

-- ── Distinct visitor identities per day (for a rough unique-user count) ──
create table if not exists public.tool_usage_visitors (
  day date not null,
  identity text not null,           -- user-<uuid> or ip-<hash>
  primary key (day, identity)
);

alter table public.tool_usage_visitors enable row level security;

-- ── Record one successful conversion (called by /api/track-conversion via the
--    service role; security definer so it can write past RLS) ──
create or replace function public.record_tool_usage(
  p_tool_id text,
  p_account_type text,
  p_identity text,
  p_day date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tool text := coalesce(nullif(trim(p_tool_id), ''), 'unknown');
  v_type text := lower(coalesce(nullif(trim(p_account_type), ''), 'guest'));
  v_day date := coalesce(p_day, (now() at time zone 'utc')::date);
begin
  if v_type not in ('guest', 'free', 'pro', 'admin') then
    v_type := 'guest';
  end if;
  -- keep tool ids short/sane
  v_tool := left(v_tool, 64);

  insert into public.tool_usage_daily (day, tool_id, account_type, conversions)
  values (v_day, v_tool, v_type, 1)
  on conflict (day, tool_id, account_type)
  do update set conversions = public.tool_usage_daily.conversions + 1,
                updated_at = now();

  if p_identity is not null and trim(p_identity) <> '' then
    insert into public.tool_usage_visitors (day, identity)
    values (v_day, left(trim(p_identity), 80))
    on conflict (day, identity) do nothing;
  end if;
end;
$$;

revoke execute on function public.record_tool_usage(text, text, text, date) from public, anon;
grant execute on function public.record_tool_usage(text, text, text, date) to service_role;

-- ── Admin read: per-(day, tool, account type) conversions for the last N days ──
create or replace function public.admin_tool_usage_daily(p_days integer default 30)
returns table (day date, tool_id text, account_type text, conversions integer)
language sql
security definer
set search_path = public
stable
as $$
  select d.day, d.tool_id, d.account_type, d.conversions
  from public.tool_usage_daily d
  where public.is_admin()
    and d.day >= ((now() at time zone 'utc')::date - greatest(1, least(coalesce(p_days, 30), 365)))
  order by d.day desc, d.conversions desc;
$$;

revoke execute on function public.admin_tool_usage_daily(integer) from public, anon;
grant execute on function public.admin_tool_usage_daily(integer) to authenticated;

-- ── Admin read: distinct visitor count per day for the last N days ──
create or replace function public.admin_tool_usage_visitors(p_days integer default 30)
returns table (day date, visitors bigint)
language sql
security definer
set search_path = public
stable
as $$
  select v.day, count(*)::bigint as visitors
  from public.tool_usage_visitors v
  where public.is_admin()
    and v.day >= ((now() at time zone 'utc')::date - greatest(1, least(coalesce(p_days, 30), 365)))
  group by v.day
  order by v.day desc;
$$;

revoke execute on function public.admin_tool_usage_visitors(integer) from public, anon;
grant execute on function public.admin_tool_usage_visitors(integer) to authenticated;
