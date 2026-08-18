create table if not exists public.product_views (
  id         bigint generated always as identity primary key,
  handle     text        not null,
  viewed_at  timestamptz not null default now()
);

create index if not exists product_views_handle_viewed_at_idx
  on public.product_views (handle, viewed_at desc);

alter table public.product_views enable row level security;

-- No policies on purpose: see the header comment.

-- Record one view. Rejects anything that is not shaped like a Shopify handle so
-- the table cannot be used as a scratchpad, and caps the length for the same
-- reason. Returns nothing: the caller does not need to know it worked.

create or replace function public.record_product_view(p_handle text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_handle is null or length(p_handle) > 200 or p_handle !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    return;
  end if;
  insert into public.product_views (handle) values (p_handle);
end;
$$;

-- Views of one product in the trailing 24 hours. A rolling window rather than
-- "today", so the figure does not reset to nothing at midnight and read "1
-- person" at five past.

create or replace function public.product_views_last_24h(p_handle text)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.product_views
  where handle = p_handle
    and viewed_at >= now() - interval '24 hours';
$$;

revoke all on function public.record_product_view(text) from public;
revoke all on function public.product_views_last_24h(text) from public;
grant execute on function public.record_product_view(text) to anon, authenticated;
grant execute on function public.product_views_last_24h(text) to anon, authenticated;

comment on table public.product_views is
  'Anonymous product page views: handle and time only. Read and written solely through record_product_view and product_views_last_24h.';