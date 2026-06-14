-- AI Credits: ledger, balance, spend, grant, and signup bonus
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- after supabase-setup.sql and supabase/ai-tools-setup.sql.
--
-- Model: an append-only ledger. Positive entries grant credits (signup bonus,
-- purchased packs), negative entries record spends. The balance is the sum of
-- non-expired entries. v1 credits do not expire (expires_at stays NULL); the
-- column exists so expiry can be added later without a migration.

create table if not exists public.ai_credit_entries (
  id          bigint generated always as identity primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  amount      integer     not null,           -- +grant / -spend
  kind        text        not null check (kind in ('signup', 'pack', 'spend', 'refund', 'admin')),
  tool        text,                           -- for spends: 'transcription' | 'remove-bg' | ...
  ref         text unique,                    -- idempotency key (stripe session id, 'signup:<uid>')
  expires_at  timestamptz,                    -- NULL = never expires (v1)
  created_at  timestamptz not null default now()
);

create index if not exists ai_credit_entries_user on public.ai_credit_entries (user_id);

alter table public.ai_credit_entries enable row level security;

-- A logged-in user may read their own ledger; nobody may write through the API
-- (all writes go through SECURITY DEFINER functions called by the service role).
drop policy if exists "Users read own credit entries" on public.ai_credit_entries;
create policy "Users read own credit entries"
  on public.ai_credit_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Balance: current spendable credits for the calling user.
-- Called from the browser with the user's JWT.
-- ─────────────────────────────────────────────────────────────
create or replace function public.ai_credit_balance()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(amount), 0)::integer
  from public.ai_credit_entries
  where user_id = auth.uid()
    and (expires_at is null or expires_at > now());
$$;

revoke execute on function public.ai_credit_balance() from public;
grant execute on function public.ai_credit_balance() to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Spend: atomically deduct credits for one operation.
-- Service-role only (called by the ai-redeem-credit edge function).
-- Returns the new balance and whether the spend was allowed.
-- ─────────────────────────────────────────────────────────────
drop function if exists public.record_ai_credit_spend(uuid, integer, text);

create or replace function public.record_ai_credit_spend(
  p_user_id uuid,
  p_cost integer,
  p_tool text default null,
  p_ref text default null
)
returns table (balance integer, allowed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
  existing_spend integer;
begin
  if p_cost is null or p_cost <= 0 then
    raise exception 'Spend cost must be a positive integer.';
  end if;

  -- Serialize concurrent spends for this user so the balance check is atomic.
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  if p_ref is not null then
    select amount
    into existing_spend
    from public.ai_credit_entries
    where user_id = p_user_id
      and kind = 'spend'
      and ref = p_ref;

    if found then
      select coalesce(sum(amount), 0)
      into current_balance
      from public.ai_credit_entries
      where user_id = p_user_id
        and (expires_at is null or expires_at > now());

      return query select current_balance, true;
      return;
    end if;
  end if;

  select coalesce(sum(amount), 0)
  into current_balance
  from public.ai_credit_entries
  where user_id = p_user_id
    and (expires_at is null or expires_at > now());

  if current_balance < p_cost then
    return query select current_balance, false;
    return;
  end if;

  insert into public.ai_credit_entries (user_id, amount, kind, tool, ref)
  values (p_user_id, -p_cost, 'spend', p_tool, p_ref);

  return query select current_balance - p_cost, true;
end;
$$;

revoke execute on function public.record_ai_credit_spend(uuid, integer, text, text) from public;
revoke execute on function public.record_ai_credit_spend(uuid, integer, text, text) from anon;
revoke execute on function public.record_ai_credit_spend(uuid, integer, text, text) from authenticated;
grant execute on function public.record_ai_credit_spend(uuid, integer, text, text) to service_role;

-- ─────────────────────────────────────────────────────────────
-- Grant: add credits (purchased pack, refund, admin adjustment).
-- Idempotent on p_ref so Stripe webhook retries do not double-grant.
-- Service-role only (called by the ai-webhook edge function).
-- ─────────────────────────────────────────────────────────────
create or replace function public.grant_ai_credits(
  p_user_id uuid,
  p_amount integer,
  p_kind text,
  p_ref text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'Grant amount must be a positive integer.';
  end if;

  insert into public.ai_credit_entries (user_id, amount, kind, ref)
  values (p_user_id, p_amount, p_kind, p_ref)
  on conflict (ref) do nothing;
end;
$$;

revoke execute on function public.grant_ai_credits(uuid, integer, text, text) from public;
revoke execute on function public.grant_ai_credits(uuid, integer, text, text) from anon;
revoke execute on function public.grant_ai_credits(uuid, integer, text, text) from authenticated;
grant execute on function public.grant_ai_credits(uuid, integer, text, text) to service_role;

-- ─────────────────────────────────────────────────────────────
-- Signup bonus: 10 free credits when a profile is first created.
-- ref = 'signup:<uid>' keeps it to exactly one grant per user.
-- ─────────────────────────────────────────────────────────────
create or replace function public.grant_signup_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_credit_entries (user_id, amount, kind, ref)
  values (new.id, 10, 'signup', 'signup:' || new.id)
  on conflict (ref) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_grant_credits on public.profiles;
create trigger on_profile_created_grant_credits
  after insert on public.profiles
  for each row execute procedure public.grant_signup_credits();

-- One-time backfill: give existing accounts their signup bonus too.
insert into public.ai_credit_entries (user_id, amount, kind, ref)
select id, 10, 'signup', 'signup:' || id
from public.profiles
on conflict (ref) do nothing;

notify pgrst, 'reload schema';
