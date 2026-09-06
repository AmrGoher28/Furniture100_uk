insert into public.product_reviews
  (id, product_handle, rating, title, body, author_name, source, verified, incentivised, country, helpful_up, reviewed_at, status, admin_notes)
values
  ('fe6d7cc2-0c1e-48f2-81f7-5b25a88ffc59', 'furniture100-brown-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf', 5,
   '☺️',
   'Absolutely love it. It’s such a lovely sophisticated table. Thank you so much.',
   'Mrs B.', 'amazon', true, false, 'GB', 1, '2026-06-04', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Brown. Imported 7 Sep 2026.'),
  ('cb24030a-918a-4884-889a-299f60396791', 'furniture100-black-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf', 3,
   'Flimsy',
   'Lovely looking table, not very sturdy and draw areas flimsy to open',
   'Debs N', 'amazon', false, false, 'GB', 0, '2026-07-31', 'approved',
   'Amazon UK review, NOT marked verified purchase, Colour Name: Black. Imported 7 Sep 2026.'),
  ('2e79b498-14ad-4238-b74a-0b3dd8a4b1b2', 'furniture100-brown-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf', 5,
   'Beautiful',
   'Straight forward to put together and looks immaculate',
   'Anonymous', 'amazon', true, false, 'GB', 1, '2026-05-28', 'approved',
   'Amazon UK review, verified purchase, shown as "Amazon Customer", Colour Name: Brown. Imported 7 Sep 2026.'),
  ('908b5e1a-40d5-4542-852a-e85ff657f607', 'furniture100-brown-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf', 5,
   null,
   'It’s beautiful',
   'kaveh', 'amazon', true, false, 'GB', 3, '2026-02-18', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Brown. Title-only on Amazon; the title is the body here. Imported 7 Sep 2026.'),
  ('423e2f9c-8e97-4215-bfcd-aef3c05405dc', 'furniture100-black-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf', 5,
   'Stunning',
   'Beautiful and very sturdy, has nice weight to it it’s not flimsy at all.',
   'Barbien', 'amazon', true, false, 'GB', 1, '2026-06-05', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Black. Imported 7 Sep 2026.')
on conflict (id) do nothing;

-- The customer photo strip, on both colours of the console.
insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/fitzroy-fluted-console-table-review-1.webp","/reviews/fitzroy-fluted-console-table-review-2.webp","/reviews/fitzroy-fluted-console-table-review-3.webp"]'
from unnest(array[
  'furniture100-black-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf',
  'furniture100-brown-fluted-console-table-with-sliding-tambour-doors-and-storage-shelf'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;