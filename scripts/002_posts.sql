-- Board1: Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

-- All authenticated users can view posts
create policy "posts_select_all" on public.posts
  for select using (auth.role() = 'authenticated');

-- Authenticated users can insert their own posts
create policy "posts_insert_own" on public.posts
  for insert with check (auth.uid() = user_id);

-- Any authenticated user can delete any post
create policy "posts_delete_any" on public.posts
  for delete using (auth.role() = 'authenticated');

-- Post images table
create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  created_at timestamptz default now()
);

alter table public.post_images enable row level security;

create policy "post_images_select_all" on public.post_images
  for select using (auth.role() = 'authenticated');

create policy "post_images_insert_auth" on public.post_images
  for insert with check (auth.role() = 'authenticated');

create policy "post_images_delete_any" on public.post_images
  for delete using (auth.role() = 'authenticated');
