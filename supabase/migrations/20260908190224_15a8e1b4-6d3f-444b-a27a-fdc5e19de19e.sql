create table if not exists public.staging_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  company       text,
  role          text,
  space         text,
  products      text,
  message       text,
  image_paths   text[] not null default '{}',
  images_failed integer not null default 0,
  status        text not null default 'new',
  admin_notes   text
);

alter table public.staging_requests enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.staging_requests to anon, authenticated;

drop policy if exists "anyone can request staging" on public.staging_requests;
create policy "anyone can request staging"
  on public.staging_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read staging requests" on public.staging_requests;
create policy "admins read staging requests"
  on public.staging_requests for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins update staging requests" on public.staging_requests;
create policy "admins update staging requests"
  on public.staging_requests for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

comment on table public.staging_requests is
  'Virtual staging requests from /virtual-staging. The row is the record; the notification email is only the alert. Photographs live in the private staging-uploads bucket, referenced by image_paths.';