-- ════════════════════════════════════════════════════════════════════
-- Summer 2026 promotion — backend enablement
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- AFTER supabase/ai-credits-setup.sql and supabase/pro-monthly-credits.sql.
--
-- Covers promo items:
--   ② Credit 2× on purchase  → handled in the ai-checkout edge function
--                               (doubles metadata[credits]); no SQL needed here.
--   ③ New signup 20 credits   → grant_signup_credits() below (10 → 20 in window).
--   ④ Referral (B)            → referral_code on profiles + referrer lookup;
--                               reward granted by the ai-webhook edge function.
--
-- Everything is window-gated by is_summer_promo(): outside the window the
-- behaviour is identical to before, so this is safe to apply at any time.
-- Window = 2026-07-01 00:00 to 2026-08-31 23:59:59 (-07:00, matches the Stripe
-- coupon redeem-by). To change/extend the sale, edit ONE place: is_summer_promo().
-- ════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Promo window: single source of truth for "are we in the sale?"
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_summer_promo()
returns boolean
language sql
stable
set search_path = public
as $$
  select now() >= timestamptz '2026-07-01 00:00:00-07'
     and now() <= timestamptz '2026-08-31 23:59:59-07';
$$;

revoke execute on function public.is_summer_promo() from public;
grant execute on function public.is_summer_promo() to anon, authenticated, service_role;

-- ─────────────────────────────────────────────────────────────
-- Allow the new 'referral' ledger kind (keeps all existing kinds).
-- ─────────────────────────────────────────────────────────────
alter table public.ai_credit_entries drop constraint if exists ai_credit_entries_kind_check;
alter table public.ai_credit_entries
  add constraint ai_credit_entries_kind_check
  check (kind in ('signup', 'pack', 'spend', 'refund', 'admin', 'pro_monthly', 'referral'));

-- ─────────────────────────────────────────────────────────────
-- ③ Signup bonus: 20 credits during the promo, 10 otherwise.
-- Replaces the function body only; the existing
-- on_profile_created_grant_credits trigger keeps calling it.
-- ─────────────────────────────────────────────────────────────
create or replace function public.grant_signup_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_amount integer := case when public.is_summer_promo() then 20 else 10 end;
begin
  insert into public.ai_credit_entries (user_id, amount, kind, ref)
  values (new.id, v_amount, 'signup', 'signup:' || new.id)
  on conflict (ref) do nothing;
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- ④ Referral codes: every profile gets a short, shareable code.
-- Unambiguous alphabet (no 0/O/1/I) so codes are easy to read aloud.
-- ─────────────────────────────────────────────────────────────
create or replace function public.gen_referral_code()
returns text
language sql
volatile
as $$
  select string_agg(
           substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789',
                  (floor(random() * 30) + 1)::int, 1),
           '')
  from generate_series(1, 8);
$$;

alter table public.profiles add column if not exists referral_code text;

-- New rows auto-generate a code.
alter table public.profiles alter column referral_code set default public.gen_referral_code();

-- Backfill existing accounts (loop guards against the rare random collision).
do $$
declare
  r record;
  v_code text;
begin
  for r in select id from public.profiles where referral_code is null loop
    loop
      v_code := public.gen_referral_code();
      begin
        update public.profiles set referral_code = v_code where id = r.id;
        exit;
      exception when unique_violation then
        -- try a different code
      end;
    end loop;
  end loop;
end $$;

create unique index if not exists profiles_referral_code_unique
  on public.profiles (upper(referral_code));

-- Let a logged-in user read their own referral_code (so the site can show it).
-- (profiles already has an own-row SELECT policy; the column is covered by it.)

-- ─────────────────────────────────────────────────────────────
-- Referrer lookup: code → user id. SECURITY DEFINER so the
-- ai-checkout edge function can resolve a code with the service role
-- without exposing the whole profiles table. Case-insensitive.
-- ─────────────────────────────────────────────────────────────
create or replace function public.referrer_for_code(p_code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where upper(referral_code) = upper(trim(p_code))
  limit 1;
$$;

revoke execute on function public.referrer_for_code(text) from public, anon;
grant execute on function public.referrer_for_code(text) to authenticated, service_role;

notify pgrst, 'reload schema';
