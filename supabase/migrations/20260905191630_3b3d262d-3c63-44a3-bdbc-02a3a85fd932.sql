create table if not exists public.product_reviews (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  product_handle text not null,
  rating         smallint not null check (rating between 1 and 5),
  title          text check (char_length(title) <= 120),
  body           text not null check (char_length(body) between 2 and 2000),
  author_name    text not null check (char_length(author_name) between 1 and 80),
  email          text check (char_length(email) <= 255),
  source         text not null default 'site'
                 check (source in ('site', 'ebay', 'amazon', 'wayfair', 'supplier', 'other')),
  source_label   text check (char_length(source_label) <= 60),
  variant_label  text check (char_length(variant_label) <= 60),
  verified       boolean not null default false,
  reviewed_at    timestamptz,
  images         text[] not null default '{}',
  status         text not null default 'pending'
                 check (status in ('pending', 'approved', 'rejected')),
  admin_notes    text
);

create index if not exists product_reviews_handle_approved_idx
  on public.product_reviews (product_handle)
  where status = 'approved';

create index if not exists product_reviews_status_created_idx
  on public.product_reviews (status, created_at desc);

grant usage on schema public to anon, authenticated;
grant insert on public.product_reviews to anon, authenticated;
grant select, update, delete on public.product_reviews to authenticated;
grant all on public.product_reviews to service_role;

alter table public.product_reviews enable row level security;

drop policy if exists "anyone can leave a review" on public.product_reviews;
create policy "anyone can leave a review"
  on public.product_reviews for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and source = 'site'
    and verified = false
    and cardinality(images) = 0
  );

drop policy if exists "admins read reviews" on public.product_reviews;
create policy "admins read reviews"
  on public.product_reviews for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins write reviews" on public.product_reviews;
create policy "admins write reviews"
  on public.product_reviews for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins delete reviews" on public.product_reviews;
create policy "admins delete reviews"
  on public.product_reviews for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins import reviews" on public.product_reviews;
create policy "admins import reviews"
  on public.product_reviews for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

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
    created_at
  from public.product_reviews
  where status = 'approved';

grant select on public.product_reviews_public to anon, authenticated;

create or replace view public.product_review_stats as
  select
    product_handle,
    count(*)::int                as review_count,
    round(avg(rating)::numeric, 2) as average_rating
  from public.product_reviews
  where status = 'approved'
  group by product_handle;

grant select on public.product_review_stats to anon, authenticated;

comment on table public.product_reviews is
  'Product reviews from the site form and imported from other channels. Only approved rows are public, via product_reviews_public.';

comment on column public.product_reviews.source is
  'Where the review was left. Shown on the page so an import is never presented as a site review.';

comment on column public.product_reviews.reviewed_at is
  'When the review was written, if known. Null for imports without a date; created_at is when the row was added here.';

insert into public.product_reviews
  (id, product_handle, rating, body, author_name, source, variant_label, verified, reviewed_at, status, admin_notes)
values
  ('c8dcf732-b938-412d-bf8b-2b1d06d0511f', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Side chairs in a busy spa - holding up just fine after 7 months. Narrow and compact.',
   'Tori', 'wayfair', null, true, '2026-05-10', 'approved',
   'Wayfair review (Wayfair Professional), Ellicott City, MD. Imported 5 Sep 2026.'),
  ('5fbec549-2433-4785-ae4e-94836c90c9d3', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Smaller chairs so they''re ideal for smaller spaces but very nice! lightweight, easy to put together.',
   'Jillian', 'wayfair', null, true, '2026-04-06', 'approved',
   'Wayfair review (Wayfair Professional), Somers, NY. Imported 5 Sep 2026.'),
  ('5e938908-9ec4-4d02-9c32-bc047deef1d8', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 4,
   'Comfortable and sturdy. Good basic.',
   'Justine', 'wayfair', 'Beige', true, '2026-01-08', 'approved',
   'Wayfair review (Wayfair Professional), Jamestown, RI. Imported 5 Sep 2026.'),
  ('30fa63ea-25f7-468f-8031-9124efa83f40', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Great product and very reasonably priced',
   'Marina', 'wayfair', null, true, '2026-06-17', 'approved',
   'Wayfair review (Wayfair Professional), Porters Lake, NS. Imported 5 Sep 2026.'),
  ('77d566cf-1bef-4c45-afcc-198c1ce88351', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'These chairs are perfect. Easy to put together and surprisingly comfy with the padding on the seats.',
   'Morgan', 'wayfair', 'Beige', true, '2025-08-07', 'approved',
   'Wayfair review (Wayfair Professional), Richmond, VA. Had one customer photo on Wayfair; which of the eight is not known. Imported 5 Sep 2026.'),
  ('45e161c5-298c-488f-813c-9f66eb01a6fa', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 3,
   'Not quite what we were looking for for our space.',
   'Caitlin', 'wayfair', 'Light Gray', true, '2026-02-12', 'approved',
   'Wayfair review (Wayfair Professional), Virginia Beach, VA. Imported 5 Sep 2026.'),
  ('7bc8fd35-5555-4989-851b-792ad7249f03', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 4,
   'I love the look of the chair and the color/fabric was exactly what I was ooking for. However, the chairs look cushioned and comfortable but they are VERY hard.',
   'Christina', 'wayfair', 'Green', true, '2026-02-08', 'approved',
   'Wayfair review (Wayfair Professional), South Windsor, CT. Imported 5 Sep 2026.'),
  ('a7b124bb-cfa2-4373-814f-04f360a96554', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Beautiful high-end looking chairs!',
   'Elisandro', 'wayfair', 'Camel', true, '2025-12-12', 'approved',
   'Wayfair review (Wayfair Professional), Houston, TX. Imported 5 Sep 2026.'),
  ('26d9702b-a7d4-4d13-9bc6-7d78c52f55a1', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Just got them and were easy to put together. On the smaller side which is what we wanted due to how we are going to use them. Nice chairs for a good price.',
   'George', 'wayfair', 'Light Gray', true, '2025-12-08', 'approved',
   'Wayfair review (Wayfair Professional), West Linn, OR. Imported 5 Sep 2026.'),
  ('da4eef60-1c3b-4494-8c8c-0aca9ceaf58c', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'Great chairs at a great price. Easy to assemble and they look lovely.',
   'Helen', 'wayfair', 'Beige', true, '2025-08-08', 'approved',
   'Wayfair review (Wayfair Professional), Atlanta, GA. Imported 5 Sep 2026.'),
  ('2644230a-1daa-430e-ad3c-1c40eacdd423', 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric', 5,
   'These dining chairs are extremly well made - better than I expected! The fabric is the perfect color for my decor and they look very much like expensive dining chairs. The leg color is darker than I wanted - but a small can of paint will take care of that! I highly recommend these chairs. They have a low back which is what I wanted in my very open plan home. Unfortunately I ended up returning them as the paint store told me the legs and trim would not take paint and they were too dark. It was an easy return and I will continue to shop',
   'Diane', 'wayfair', 'Beige', true, null, 'approved',
   'Wayfair review (Wayfair Professional), NC. No date in the source; last sentence cut off in the paste. Imported 5 Sep 2026.')
on conflict (id) do nothing;

insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/dany-walnut-dining-chair-review-1.webp","/reviews/dany-walnut-dining-chair-review-2.webp","/reviews/dany-walnut-dining-chair-review-3.webp","/reviews/dany-walnut-dining-chair-review-4.webp","/reviews/dany-walnut-dining-chair-review-5.webp","/reviews/dany-walnut-dining-chair-review-6.webp","/reviews/dany-walnut-dining-chair-review-7.webp","/reviews/dany-walnut-dining-chair-review-8.webp"]'
from unnest(array[
  'dany-set-of-2-walnut-dining-chairs-in-cream-fabric',
  'dany-set-of-2-walnut-dining-chairs-in-black-fabric',
  'dany-set-of-2-walnut-dining-chairs-in-blue-fabric'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;