-- ---------------------------------------------------------------------------
-- supplier_links: where we buy each product from.
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_links (
  id uuid primary key default gen_random_uuid(),
  product_handle text not null,
  url text not null,
  supplier_name text,
  cost numeric(10, 2),
  currency text not null default 'GBP',
  notes text,
  is_primary boolean not null default false,
  check_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_links TO authenticated;
GRANT ALL ON public.supplier_links TO service_role;

create index if not exists supplier_links_handle_idx
  on public.supplier_links (product_handle);

create unique index if not exists supplier_links_one_primary_idx
  on public.supplier_links (product_handle)
  where is_primary;

create unique index if not exists supplier_links_unique_url_idx
  on public.supplier_links (product_handle, url);

-- ---------------------------------------------------------------------------
-- supplier_stock_checks: one row per link per check.
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_stock_checks (
  id uuid primary key default gen_random_uuid(),
  supplier_link_id uuid not null
    references public.supplier_links (id) on delete cascade,
  checked_at timestamptz not null default now(),
  status text not null
    check (status in ('in_stock', 'out_of_stock', 'unknown', 'error')),
  confidence text not null default 'low'
    check (confidence in ('high', 'medium', 'low')),
  evidence text,
  error_detail text,
  source text not null default 'ai'
    check (source in ('ai', 'manual')),
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.supplier_stock_checks TO authenticated;
GRANT ALL ON public.supplier_stock_checks TO service_role;

create index if not exists supplier_stock_checks_link_idx
  on public.supplier_stock_checks (supplier_link_id, checked_at desc);

-- ---------------------------------------------------------------------------
-- RLS. Admin-only, both tables.
-- ---------------------------------------------------------------------------
alter table public.supplier_links enable row level security;
alter table public.supplier_stock_checks enable row level security;

drop policy if exists "Admins manage supplier links" on public.supplier_links;
create policy "Admins manage supplier links"
  on public.supplier_links
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins read stock checks" on public.supplier_stock_checks;
create policy "Admins read stock checks"
  on public.supplier_stock_checks
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins insert stock checks" on public.supplier_stock_checks;
create policy "Admins insert stock checks"
  on public.supplier_stock_checks
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- Keep updated_at honest.
-- ---------------------------------------------------------------------------
create or replace function public.supplier_links_touch()
returns trigger
language plpgsql
set search_path = 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists supplier_links_touch_trg on public.supplier_links;
create trigger supplier_links_touch_trg
  before update on public.supplier_links
  for each row
  execute function public.supplier_links_touch();

-- ---------------------------------------------------------------------------
-- Latest check per link, for the dashboard.
-- ---------------------------------------------------------------------------
create or replace view public.supplier_links_with_status as
select
  l.*,
  c.status       as last_status,
  c.confidence   as last_confidence,
  c.evidence     as last_evidence,
  c.error_detail as last_error_detail,
  c.source       as last_source,
  c.checked_at   as last_checked_at
from public.supplier_links l
left join lateral (
  select status, confidence, evidence, error_detail, source, checked_at
  from public.supplier_stock_checks
  where supplier_link_id = l.id
  order by checked_at desc
  limit 1
) c on true;

GRANT SELECT ON public.supplier_links_with_status TO authenticated;
GRANT SELECT ON public.supplier_links_with_status TO service_role;