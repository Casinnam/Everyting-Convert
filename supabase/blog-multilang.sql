-- Multilingual blog: one row per language, linked by group_id, served at
-- /blog/<lang>/<slug>. Run after supabase/blog-setup.sql.
--   supabase db query --file supabase/blog-multilang.sql --linked
--
-- A post now exists as up to 5 rows (en/ko/de/es/fr) that share the same
-- group_id and slug but differ by lang/title/excerpt/body. The slug is unique
-- per language (so the same slug can appear once for each language).

alter table public.blog_posts
  add column if not exists group_id uuid not null default gen_random_uuid();

-- Drop the global-unique slug; make it unique per language instead.
alter table public.blog_posts drop constraint if exists blog_posts_slug_key;
drop index if exists blog_posts_slug_idx;
create unique index if not exists blog_posts_slug_lang_idx on public.blog_posts (slug, lang);
create index if not exists blog_posts_group_idx on public.blog_posts (group_id);

notify pgrst, 'reload schema';
