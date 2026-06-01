const assert = require('assert');
const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase-setup.sql'), 'utf8');

assert(
  sql.includes('create table if not exists public.conversion_history'),
  'Supabase setup should create the conversion_history table.',
);

assert(
  sql.includes('user_id uuid not null references auth.users(id) on delete cascade'),
  'Conversion history rows should belong to an auth user and clean up with that user.',
);

assert(
  sql.includes("metadata jsonb not null default '{}'::jsonb"),
  'Conversion history should include metadata for future storage links and options.',
);

assert(
  sql.includes("check (status in ('started', 'completed', 'failed'))"),
  'Conversion history should constrain status values.',
);

assert(
  sql.includes('conversion_history_user_created_idx') &&
    sql.includes('on public.conversion_history (user_id, created_at desc)'),
  'Conversion history should be indexed for per-user account history views.',
);

assert(
  sql.includes('alter table public.conversion_history enable row level security'),
  'Conversion history should enable row level security.',
);

assert(
  sql.includes('Users can read own conversion history') &&
    sql.includes('auth.uid() = user_id or public.is_admin()'),
  'Users should only read their own conversion history unless they are admins.',
);

assert(
  sql.includes('Users can insert own conversion history') &&
    sql.includes('with check (auth.uid() = user_id)'),
  'Users should only insert conversion history for their own account.',
);

console.log('conversion history schema tests passed');
