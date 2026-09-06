alter table public.product_reviews
  add column if not exists incentivised boolean not null default false;

comment on column public.product_reviews.incentivised is
  'The reviewer was given something for the review (marketplace "Incentivized Review"). Disclosed on the page.';

create or replace view public.product_reviews_public as
  select
    id,
    product_handle,
    rating,
    title,
    body,
    author_name,
    source,
    source_label,
    variant_label,
    verified,
    reviewed_at,
    images,
    created_at,
    incentivised
  from public.product_reviews
  where status = 'approved';

grant select on public.product_reviews_public to anon, authenticated;