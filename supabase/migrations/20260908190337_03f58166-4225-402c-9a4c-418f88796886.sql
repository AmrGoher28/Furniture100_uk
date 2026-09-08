drop policy if exists "staging uploads: insert own folder" on storage.objects;

create policy "staging uploads: insert own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'staging-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "staging uploads: read own folder" on storage.objects;

create policy "staging uploads: read own folder"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'staging-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "staging uploads: admins read all" on storage.objects;

create policy "staging uploads: admins read all"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'staging-uploads'
    and public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "staging uploads: admins delete" on storage.objects;

create policy "staging uploads: admins delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'staging-uploads'
    and public.has_role(auth.uid(), 'admin')
  );