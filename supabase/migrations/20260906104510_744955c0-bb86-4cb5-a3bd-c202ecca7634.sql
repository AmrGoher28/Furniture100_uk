alter table public.product_reviews
  add column if not exists country      text check (country ~ '^[A-Z]{2}$'),
  add column if not exists helpful_up   integer not null default 0 check (helpful_up >= 0),
  add column if not exists helpful_down integer not null default 0 check (helpful_down >= 0);

comment on column public.product_reviews.country is
  'ISO 3166 alpha-2 country of the reviewer, shown as a flag. Null when not known.';

update public.product_reviews set country = 'GB'
  where country is null
    and product_handle <> 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric';

update public.product_reviews set country = 'CA'
  where country is null and id = '30fa63ea-25f7-468f-8031-9124efa83f40';

update public.product_reviews set country = 'US'
  where country is null
    and product_handle = 'dany-set-of-2-walnut-dining-chairs-in-cream-fabric';

create or replace function public.vote_review(review_id uuid, up boolean)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_reviews
     set helpful_up   = helpful_up   + (case when up then 1 else 0 end),
         helpful_down = helpful_down + (case when up then 0 else 1 end)
   where id = review_id and status = 'approved';
$$;

revoke all on function public.vote_review(uuid, boolean) from public;
grant execute on function public.vote_review(uuid, boolean) to anon, authenticated;

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
    incentivised,
    country,
    helpful_up,
    helpful_down
  from public.product_reviews
  where status = 'approved';

grant select on public.product_reviews_public to anon, authenticated;

delete from public.product_reviews where id = '46809392-cda8-405d-b8bf-b9fc582119d2';

insert into public.product_reviews
  (id, product_handle, rating, title, body, author_name, source, verified, incentivised, country, helpful_up, reviewed_at, status, admin_notes)
values
  ('a8689812-9585-469b-8576-7a1776e216af', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Slim hall table',
   'Beautiful hall table, great quality for the price.

It even has adjustable feet for floors which aren’t level.

Super easy to assemble and looks great; love it 😊

Definitely recommend 👍',
   'J Thirlaway', 'amazon', true, false, 'GB', 3, '2026-01-28', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Black. Imported 7 Sep 2026.'),
  ('94a8ef01-1be8-48e5-8eb5-dc66ab70dd10', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Gorgeous console',
   'Love this console table. Looks so expensive but was going at a discounted price when I bought it. So easy to build, wish all furniture was that easy.',
   'Amelia', 'amazon', true, false, 'GB', 0, '2026-08-17', 'approved',
   'Amazon UK review, verified purchase, no colour recorded. Imported 7 Sep 2026.'),
  ('a551681a-56a4-4bae-9db6-0bcc0ef57b14', 'furniture100-blue-console-table-with-2-drawers-and-shelf', 5,
   'Impressed!',
   'Really good quality, looks much more expensive than it was, very quick to assemble',
   'N. Patel', 'amazon', true, false, 'GB', 0, '2026-08-07', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Blue. Imported 7 Sep 2026.'),
  ('2f32ad28-8085-4d31-b0c0-61faa01bc3a5', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Great value',
   'Very pleased with this purchase. Package delivered earlier than expected, very well packaged.

Great quality for the price & very easy to assemble.

I would recommend this item.',
   'Harseeta Talsania', 'amazon', true, false, 'GB', 1, '2026-06-29', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Black. Imported 7 Sep 2026.'),
  ('81591f93-c7d1-491a-9bce-638ff25b70f0', 'furniture100-blue-console-table-with-2-drawers-and-shelf', 5,
   'Lovely',
   'Just assembled and really well packaged and realy nice quality

I highly recommend this table',
   'Michael Greenhaf', 'amazon', true, false, 'GB', 1, '2026-08-11', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Blue. Imported 7 Sep 2026.'),
  ('e556c419-6019-4758-9148-ff0104e77bbe', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Easy build and great quality',
   'Fantastic product, really impressed by the quality for the price - it was also the easiest furniture assembly I’ve had.',
   'Anonymous', 'amazon', true, false, 'GB', 1, '2026-06-15', 'approved',
   'Amazon UK review, verified purchase, shown as "Amazon Customer", no colour recorded. Imported 7 Sep 2026.'),
  ('2b29f0a3-0d5b-421a-b049-9570b135de8c', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Great quality for the price',
   'Worth every penny! Such a lovely console table and so easy to put together too. Did it by myself and very pleased with how smart it looks.',
   'Fran Lillie', 'amazon', true, false, 'GB', 1, '2026-04-10', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Black. Imported 7 Sep 2026.'),
  ('ef957a16-6726-4a11-adb2-4fff421338a1', 'furniture100-green-console-table-with-2-drawers-and-shelf', 5,
   'Holitico console table',
   'Love this console table I find that it adds abit of character to my living.',
   'Julie Simpson', 'amazon', true, false, 'GB', 0, '2026-06-01', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Green. Title names the supplier''s Amazon brand. Imported 7 Sep 2026.'),
  ('4f5a52da-35bb-4e22-abdc-5603d8757b89', 'furniture100-green-console-table-with-2-drawers-and-shelf', 5,
   'Cost',
   'It''s worth the money',
   'e f.', 'amazon', true, false, 'GB', 0, '2026-05-21', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Green. Imported 7 Sep 2026.'),
  ('77596574-60ef-427d-94b2-c3a76aca0ba4', 'furniture100-console-table-with-2-drawers-and-shelf', 5,
   'Good Quality & easy construction.',
   'Very well packaged, so very little chance of damage. Easy to construct & nice construction & finish. Only downside was when fully assembled there was a bit of wobble, but I put a washer on one leg under the shelf & that cured it. Very pleased with our purchase.',
   'John S', 'amazon', true, false, 'GB', 2, '2026-02-16', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Black. Imported 7 Sep 2026.'),
  ('c3df25ef-538c-44b9-a40c-d3c80ad8409a', 'furniture100-green-console-table-with-2-drawers-and-shelf', 5,
   'Good',
   'Good',
   'Anonymous', 'amazon', true, false, 'GB', 0, '2026-04-06', 'approved',
   'Amazon UK review, verified purchase, shown as "Amazon Customer", Colour Name: Green. Imported 7 Sep 2026.'),
  ('22696306-a176-49e8-a21f-c62e60220279', 'furniture100-green-console-table-with-2-drawers-and-shelf', 5,
   'Lovely , well priced table',
   'Lovely table.Very easy to put together.Well packaged.Very happy',
   'vicky p', 'amazon', true, false, 'GB', 0, '2026-03-04', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Green. Imported 7 Sep 2026.'),
  ('761f1039-a0d6-455e-b79d-4b215303cb19', 'furniture100-green-console-table-with-2-drawers-and-shelf', 5,
   'Great product',
   'Love it!! Easy to assemble and looks very classy',
   'Kavita', 'amazon', true, false, 'GB', 1, '2026-03-04', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Green. Imported 7 Sep 2026.'),
  ('ddd6a386-780e-44e9-b749-1eca453856d9', 'furniture100-blue-console-table-with-2-drawers-and-shelf', 5,
   'Lovely console table',
   'Looks lovely and very easy to assemble.',
   'Anonymous', 'amazon', true, false, 'GB', 0, '2026-03-01', 'approved',
   'Amazon UK review, verified purchase, shown as "Amazon Customer", Colour Name: Blue. Imported 7 Sep 2026.')
on conflict (id) do nothing;

insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/beaumont-console-table-review-1.webp","/reviews/beaumont-console-table-review-2.webp","/reviews/beaumont-console-table-review-3.webp","/reviews/beaumont-console-table-review-4.webp","/reviews/beaumont-console-table-review-5.webp","/reviews/beaumont-console-table-review-6.webp","/reviews/beaumont-console-table-review-7.webp"]'
from unnest(array[
  'furniture100-console-table-with-2-drawers-and-shelf',
  'furniture100-blue-console-table-with-2-drawers-and-shelf',
  'furniture100-green-console-table-with-2-drawers-and-shelf'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;