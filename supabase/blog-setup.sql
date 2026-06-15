-- Blog: admin-authored posts rendered server-side for SEO.
-- Run in the Supabase SQL editor (Dashboard → SQL Editor → New query),
-- or: supabase db query --file supabase/blog-setup.sql --linked
--
-- Posts are stored as Markdown. Only admins (public.is_admin()) can write;
-- anyone can read published posts. Cover/inline images live in the public
-- `blog-images` Storage bucket.

create table if not exists public.blog_posts (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  excerpt      text        not null default '',
  body         text        not null default '',          -- Markdown
  cover_image  text        not null default '',           -- public URL
  lang         text        not null default 'en',         -- ko / en / de / es / fr ...
  status       text        not null default 'draft' check (status in ('draft', 'published')),
  author_id    uuid        references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_status_pub on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_lang on public.blog_posts (lang);

alter table public.blog_posts enable row level security;

-- Anyone can read published posts; admins can read everything (incl. drafts).
drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts" on public.blog_posts
  for select using (status = 'published' or public.is_admin());

-- Only admins may create / edit / delete.
drop policy if exists "Admins insert posts" on public.blog_posts;
create policy "Admins insert posts" on public.blog_posts
  for insert with check (public.is_admin());

drop policy if exists "Admins update posts" on public.blog_posts;
create policy "Admins update posts" on public.blog_posts
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete posts" on public.blog_posts;
create policy "Admins delete posts" on public.blog_posts
  for delete using (public.is_admin());

-- Keep updated_at fresh on edits.
create or replace function public.blog_posts_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.blog_posts_touch_updated_at();

-- ─────────────────────────────────────────────────
-- Storage: public bucket for blog images
-- ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images" on storage.objects
  for select using (bucket_id = 'blog-images');

drop policy if exists "Admins upload blog images" on storage.objects;
create policy "Admins upload blog images" on storage.objects
  for insert with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins update blog images" on storage.objects;
create policy "Admins update blog images" on storage.objects
  for update using (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins delete blog images" on storage.objects;
create policy "Admins delete blog images" on storage.objects
  for delete using (bucket_id = 'blog-images' and public.is_admin());
