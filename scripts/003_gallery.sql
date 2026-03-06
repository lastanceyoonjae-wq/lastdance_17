-- Board2: Gallery images table
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.gallery_images enable row level security;

create policy "gallery_select_all" on public.gallery_images
  for select using (auth.role() = 'authenticated');

create policy "gallery_insert_own" on public.gallery_images
  for insert with check (auth.uid() = user_id);

create policy "gallery_delete_any" on public.gallery_images
  for delete using (auth.role() = 'authenticated');

-- Image tags (user tagging on gallery images)
create table if not exists public.image_tags (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.gallery_images(id) on delete cascade,
  tagged_user_id uuid not null references public.profiles(id) on delete cascade,
  unique(image_id, tagged_user_id)
);

alter table public.image_tags enable row level security;

create policy "tags_select_all" on public.image_tags
  for select using (auth.role() = 'authenticated');

create policy "tags_insert_auth" on public.image_tags
  for insert with check (auth.role() = 'authenticated');

create policy "tags_delete_any" on public.image_tags
  for delete using (auth.role() = 'authenticated');
