-- Admin credit tools (dashboard Phase 1)
-- Run after supabase/ai-credits-setup.sql.
--   supabase db query --file supabase/admin-credits.sql --linked
--
-- These are SECURITY DEFINER functions gated by public.is_admin() (which checks
-- the CALLER's JWT via auth.uid()), so the browser can call them with the admin
-- user's token but a non-admin gets nothing / an error. They let the admin
-- dashboard read every user's balance, view one user's ledger, and grant or
-- deduct credits manually (refunds, support, compensation).

-- All users' current balances (admin only).
create or replace function public.admin_credit_balances()
returns table (user_id uuid, balance integer)
language sql
security definer
set search_path = public
stable
as $$
  select e.user_id, coalesce(sum(e.amount), 0)::integer
  from public.ai_credit_entries e
  where public.is_admin()
    and (e.expires_at is null or e.expires_at > now())
  group by e.user_id;
$$;

revoke execute on function public.admin_credit_balances() from public, anon;
grant execute on function public.admin_credit_balances() to authenticated;

-- One user's full ledger (admin only).
create or replace function public.admin_credit_ledger(p_user_id uuid)
returns table (id bigint, amount integer, kind text, note text, ref text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select e.id, e.amount, e.kind, e.tool as note, e.ref, e.created_at
  from public.ai_credit_entries e
  where public.is_admin()
    and e.user_id = p_user_id
  order by e.created_at desc
  limit 200;
$$;

revoke execute on function public.admin_credit_ledger(uuid) from public, anon;
grant execute on function public.admin_credit_ledger(uuid) to authenticated;

-- Manually grant (+) or deduct (-) credits for a user (admin only).
-- The reason is stored in the `tool` column so it shows up in the ledger.
-- Balance is never allowed to go below zero. Returns the new balance.
create or replace function public.admin_adjust_credits(
  p_user_id uuid,
  p_amount integer,
  p_reason text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_user_id is null then
    raise exception 'A target user is required.';
  end if;
  if p_amount is null or p_amount = 0 then
    raise exception 'Adjustment amount must be a non-zero integer.';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select coalesce(sum(amount), 0)
  into current_balance
  from public.ai_credit_entries
  where user_id = p_user_id
    and (expires_at is null or expires_at > now());

  if current_balance + p_amount < 0 then
    raise exception 'Adjustment would make the balance negative (current %).', current_balance;
  end if;

  insert into public.ai_credit_entries (user_id, amount, kind, tool, ref)
  values (p_user_id, p_amount, 'admin', nullif(btrim(coalesce(p_reason, '')), ''), 'admin:' || gen_random_uuid());

  return current_balance + p_amount;
end;
$$;

revoke execute on function public.admin_adjust_credits(uuid, integer, text) from public, anon;
grant execute on function public.admin_adjust_credits(uuid, integer, text) to authenticated;

notify pgrst, 'reload schema';
