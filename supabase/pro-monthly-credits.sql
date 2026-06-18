-- Pro members get 300 AI credits every calendar month.
-- Lazy grant: topped up whenever the user's balance is read (ai_credit_balance),
-- so monthly AND yearly subscribers are handled uniformly with no cron job.
-- Idempotent per (user, month). Granted credits accumulate (no expiry) to keep
-- the ledger accounting simple.

-- Allow the new ledger kind.
alter table public.ai_credit_entries drop constraint if exists ai_credit_entries_kind_check;
alter table public.ai_credit_entries
  add constraint ai_credit_entries_kind_check
  check (kind in ('signup', 'pack', 'spend', 'refund', 'admin', 'pro_monthly'));

-- Grant this month's Pro allowance once (no-op if already granted or not Pro).
create or replace function public.ensure_pro_monthly_credits(p_user_id uuid default auth.uid())
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := coalesce(p_user_id, auth.uid());
  v_month text := to_char((now() at time zone 'utc'), 'YYYY-MM');
begin
  if v_uid is null then
    return;
  end if;
  if not public.is_pro(v_uid) then
    return;
  end if;

  insert into public.ai_credit_entries (user_id, amount, kind, tool, ref)
  values (v_uid, 300, 'pro_monthly', 'pro-plan',
          'pro-monthly:' || v_uid::text || ':' || v_month)
  on conflict (ref) do nothing;
end;
$$;

revoke execute on function public.ensure_pro_monthly_credits(uuid) from public, anon;
grant execute on function public.ensure_pro_monthly_credits(uuid) to authenticated, service_role;

-- Balance read now also tops up the caller's Pro monthly allowance.
-- (volatile because it may insert the monthly grant.)
create or replace function public.ai_credit_balance()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bal integer;
begin
  perform public.ensure_pro_monthly_credits(auth.uid());
  select coalesce(sum(amount), 0)::integer
  into v_bal
  from public.ai_credit_entries
  where user_id = auth.uid()
    and (expires_at is null or expires_at > now());
  return v_bal;
end;
$$;

revoke execute on function public.ai_credit_balance() from public, anon;
grant execute on function public.ai_credit_balance() to authenticated;

notify pgrst, 'reload schema';
