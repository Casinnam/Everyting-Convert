create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists username text;

alter table public.profiles
add column if not exists role text not null default 'user'
check (role in ('user', 'admin'));

create unique index if not exists profiles_username_unique
on public.profiles (lower(username))
where username is not null and username <> '';

alter table public.profiles enable row level security;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where (id = user_id or lower(email) = lower(auth.jwt()->>'email'))
      and role = 'admin'
  );
$$;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id or lower(email) = lower(auth.jwt()->>'email'));

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Users can update own email only" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update own username" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.default_username(email text, user_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select left(
    regexp_replace(
      coalesce(nullif(split_part(email, '@', 1), ''), 'user'),
      '[^A-Za-z0-9_]',
      '_',
      'g'
    ),
    15
  ) || '_' || left(user_id::text, 8);
$$;

create or replace function public.update_own_username(new_username text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_username text := trim(new_username);
  updated_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if cleaned_username !~ '^[A-Za-z0-9_]{3,24}$' then
    raise exception '유저 ID는 영문, 숫자, 밑줄(_)만 사용해서 3~24자로 입력해 주세요.';
  end if;

  update public.profiles
  set username = cleaned_username,
      updated_at = now()
  where id = auth.uid()
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception '프로필을 찾을 수 없습니다.';
  end if;

  return updated_profile;
exception
  when unique_violation then
    raise exception '이미 사용 중인 유저 ID입니다.';
end;
$$;

grant execute on function public.update_own_username(text) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, plan)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), public.default_username(new.email, new.id)),
    'free'
  )
  on conflict (id) do update
    set email = excluded.email,
        username = coalesce(public.profiles.username, excluded.username),
        updated_at = now();
  return new;
end;
$$;

update public.profiles
set username = public.default_username(email, id),
    updated_at = now()
where username is null or username = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 프로 회원으로 승격할 때 Supabase SQL Editor에서 실행:
-- update public.profiles set plan = 'pro', updated_at = now() where email = 'user@example.com';

-- 첫 관리자를 지정할 때 Supabase SQL Editor에서 실행:
-- update public.profiles set role = 'admin', updated_at = now() where email = 'hijacker05@gmail.com';

-- First admin bootstrap.
-- Run this whole file in Supabase SQL Editor after signing up with hijacker05@gmail.com.
-- If the auth user already exists, this creates/updates the matching profile as admin.
insert into public.profiles (id, email, plan, role)
select id, email, 'pro', 'admin'
from auth.users
where email = 'hijacker05@gmail.com'
on conflict (id) do update
set email = excluded.email,
    plan = 'pro',
    role = 'admin',
    updated_at = now();

create table if not exists public.usage_counters (
  identity text primary key,
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.usage_counters enable row level security;

create or replace function public.record_usage_conversion(
  usage_identity text,
  usage_limit integer default 10
)
returns table (
  identity text,
  count integer,
  remaining integer,
  allowed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.usage_counters (identity, count)
  values (usage_identity, 0)
  on conflict (identity) do nothing;

  select usage_counters.count
  into current_count
  from public.usage_counters
  where usage_counters.identity = usage_identity
  for update;

  if current_count >= usage_limit then
    return query
    select
      usage_identity,
      current_count,
      0,
      false;
    return;
  end if;

  update public.usage_counters
  set count = count + 1,
      updated_at = now()
  where usage_counters.identity = usage_identity
  returning usage_counters.count into current_count;

  return query
  select
    usage_identity,
    current_count,
    greatest(usage_limit - current_count, 0),
    true;
end;
$$;

create extension if not exists pgcrypto;

create table if not exists public.conversion_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  tool_id text not null,
  tool_name text not null,
  source_filename text,
  output_filename text,
  source_size bigint check (source_size is null or source_size >= 0),
  output_size bigint check (output_size is null or output_size >= 0),
  status text not null default 'completed'
    check (status in ('started', 'completed', 'failed')),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.conversion_history
add column if not exists user_email text;

alter table public.conversion_history
add column if not exists tool_id text;

alter table public.conversion_history
add column if not exists tool_name text;

alter table public.conversion_history
add column if not exists source_filename text;

alter table public.conversion_history
add column if not exists output_filename text;

alter table public.conversion_history
add column if not exists source_size bigint;

alter table public.conversion_history
add column if not exists output_size bigint;

alter table public.conversion_history
add column if not exists status text not null default 'completed';

alter table public.conversion_history
add column if not exists error_message text;

alter table public.conversion_history
add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.conversion_history
add column if not exists completed_at timestamptz;

create index if not exists conversion_history_user_created_idx
on public.conversion_history (user_id, created_at desc);

create index if not exists conversion_history_tool_created_idx
on public.conversion_history (tool_id, created_at desc);

alter table public.conversion_history enable row level security;

drop policy if exists "Users can read own conversion history" on public.conversion_history;
create policy "Users can read own conversion history"
on public.conversion_history
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can insert own conversion history" on public.conversion_history;
create policy "Users can insert own conversion history"
on public.conversion_history
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own conversion history" on public.conversion_history;
create policy "Users can update own conversion history"
on public.conversion_history
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can delete own conversion history" on public.conversion_history;
create policy "Users can delete own conversion history"
on public.conversion_history
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin());

comment on table public.conversion_history is
'Stores lightweight conversion activity records only. Converted files are not stored here.';

comment on column public.conversion_history.metadata is
'Optional JSON for future result links, Google Drive file IDs, conversion options, or retention data.';
