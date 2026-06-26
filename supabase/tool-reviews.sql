-- Tool reviews: a star rating (1-5) and optional short comment left from the
-- shared download-completion card after a successful conversion. Comments are
-- PRIVATE — they are never shown on the public site, only in the admin
-- dashboard. Writes go through /api/tool-review (service role); reads are
-- admin-only via security-definer functions that gate on is_admin().

create table if not exists public.tool_reviews (
  id uuid primary key default gen_random_uuid(),
  tool_id text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,                                  -- nullable; trimmed/capped by the API
  account_type text not null default 'guest',    -- guest | free | pro | admin
  identity text,                                  -- user-<uuid> or ip-<hash> (dedupe/abuse signal)
  user_id uuid references auth.users(id) on delete set null,
  hidden boolean not null default false,          -- admin can soft-hide spam/abuse
  created_at timestamptz not null default now()
);

create index if not exists tool_reviews_created_idx on public.tool_reviews (created_at desc);
create index if not exists tool_reviews_tool_idx on public.tool_reviews (tool_id);

alter table public.tool_reviews enable row level security;
-- No public policies: anon/authenticated cannot read or write directly.
-- All writes use the service role (bypasses RLS); all reads use the
-- security-definer admin functions below.

-- ── Record one review (called by /api/tool-review via the service role) ──
create or replace function public.record_tool_review(
  p_tool_id text,
  p_rating integer,
  p_comment text,
  p_account_type text,
  p_identity text,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tool text := left(coalesce(nullif(trim(p_tool_id), ''), 'unknown'), 64);
  v_type text := lower(coalesce(nullif(trim(p_account_type), ''), 'guest'));
  v_rating smallint := greatest(1, least(5, coalesce(p_rating, 0)));
  v_comment text := nullif(left(trim(coalesce(p_comment, '')), 500), '');
begin
  if v_type not in ('guest', 'free', 'pro', 'admin') then
    v_type := 'guest';
  end if;

  insert into public.tool_reviews (tool_id, rating, comment, account_type, identity, user_id)
  values (v_tool, v_rating, v_comment, v_type, left(coalesce(trim(p_identity), ''), 80), p_user_id);
end;
$$;

revoke execute on function public.record_tool_review(text, integer, text, text, text, uuid) from public, anon;
grant execute on function public.record_tool_review(text, integer, text, text, text, uuid) to service_role;

-- ── Admin read: recent reviews (most recent first) ──
create or replace function public.admin_tool_reviews(p_days integer default 30, p_limit integer default 200)
returns table (
  id uuid,
  tool_id text,
  rating smallint,
  comment text,
  account_type text,
  hidden boolean,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select r.id, r.tool_id, r.rating, r.comment, r.account_type, r.hidden, r.created_at
  from public.tool_reviews r
  where public.is_admin()
    and r.created_at >= (now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365))))
  order by r.created_at desc
  limit greatest(1, least(coalesce(p_limit, 200), 1000));
$$;

revoke execute on function public.admin_tool_reviews(integer, integer) from public, anon;
grant execute on function public.admin_tool_reviews(integer, integer) to authenticated;

-- ── Admin read: per-tool rating summary (avg + count, all-time) ──
create or replace function public.admin_tool_review_stats(p_days integer default 30)
returns table (
  tool_id text,
  reviews bigint,
  avg_rating numeric,
  with_comment bigint
)
language sql
security definer
set search_path = public
stable
as $$
  select r.tool_id,
         count(*)::bigint as reviews,
         round(avg(r.rating)::numeric, 2) as avg_rating,
         count(*) filter (where r.comment is not null)::bigint as with_comment
  from public.tool_reviews r
  where public.is_admin()
    and r.created_at >= (now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365))))
  group by r.tool_id
  order by reviews desc;
$$;

revoke execute on function public.admin_tool_review_stats(integer) from public, anon;
grant execute on function public.admin_tool_review_stats(integer) to authenticated;

-- ── Admin action: soft-hide / unhide a review ──
create or replace function public.admin_set_review_hidden(p_id uuid, p_hidden boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  update public.tool_reviews set hidden = coalesce(p_hidden, true) where id = p_id;
end;
$$;

revoke execute on function public.admin_set_review_hidden(uuid, boolean) from public, anon;
grant execute on function public.admin_set_review_hidden(uuid, boolean) to authenticated;
