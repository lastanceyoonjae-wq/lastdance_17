-- Create storage buckets for images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

-- Storage policies for post-images bucket
create policy "post_images_upload" on storage.objects
  for insert with check (
    bucket_id = 'post-images' and auth.role() = 'authenticated'
  );

create policy "post_images_read" on storage.objects
  for select using (bucket_id = 'post-images');

create policy "post_images_delete" on storage.objects
  for delete using (
    bucket_id = 'post-images' and auth.role() = 'authenticated'
  );

-- Storage policies for gallery-images bucket
create policy "gallery_images_upload" on storage.objects
  for insert with check (
    bucket_id = 'gallery-images' and auth.role() = 'authenticated'
  );

create policy "gallery_images_read" on storage.objects
  for select using (bucket_id = 'gallery-images');

create policy "gallery_images_delete" on storage.objects
  for delete using (
    bucket_id = 'gallery-images' and auth.role() = 'authenticated'
  );
