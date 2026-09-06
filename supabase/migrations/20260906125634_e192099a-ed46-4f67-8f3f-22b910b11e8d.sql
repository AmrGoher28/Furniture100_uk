insert into public.product_reviews
  (id, product_handle, rating, body, author_name, source, verified, incentivised, country, reviewed_at, status, admin_notes)
values
  ('0bfd0bd7-7d62-44ff-8683-a0f86412aaf6', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'They are amazing! I got 6 of them xx So happy!',
   'Anonymous', 'wayfair', true, false, null, '2026-05-17', 'approved',
   'Wayfair UK review, verified purchase, no location. Had one customer photo. Imported 7 Sep 2026.'),
  ('bacea500-f212-44c6-b25b-c1f68dd90fcd', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'Beautiful chairs and pairs well with our Wayfair table too. Feels like quality fabric in a lovely neutral linen effect. Very happy',
   'Lydia', 'wayfair', true, false, 'GB', '2026-08-08', 'approved',
   'Wayfair UK review, verified purchase, GB. Had three customer photos. Imported 7 Sep 2026.'),
  ('cfd57212-3e64-422c-ac35-1849ace0b4d3', 'henley-set-of-2-scandi-beige-dining-chairs', 3,
   'The colour matches the website - perfect',
   'Alexander Pepe', 'wayfair', true, false, 'IE', '2026-06-07', 'approved',
   'Wayfair UK review, verified purchase, Wicklow, Ireland. Had one customer photo. Imported 7 Sep 2026.'),
  ('d910d291-eb14-45f8-8711-303676bed2b1', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'Considering the price we paid for these chairs they exceeded pur expectation! They fit our midcentury home perfectly, and were so easy to build. The in-laws have complimented them so much!',
   'Emma', 'wayfair', true, false, 'GB', '2026-03-28', 'approved',
   'Wayfair UK review, verified purchase, Polegate. Had one customer photo. Imported 7 Sep 2026.'),
  ('4ba344e5-fa18-436d-b5ef-db9339a24aea', 'henley-set-of-2-scandi-beige-dining-chairs', 4,
   'great chairs! make sure you take out all of the parts of the box before trying to assemble it. can be confusing.',
   'Anonymous', 'wayfair', true, false, null, '2026-07-19', 'approved',
   'Wayfair UK review, verified purchase, no location. Imported 7 Sep 2026.'),
  ('697953b0-0e2f-4481-930e-5e0b424e6837', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'As in the Photos, very happy with them',
   'Anonymous', 'wayfair', true, false, null, '2026-07-17', 'approved',
   'Wayfair UK review, verified purchase, no location. Imported 7 Sep 2026.'),
  ('a08e9912-0c4a-4306-a7a0-5c094b919682', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'Really good quality and so easy to put together however the instructions could be more clear but not that big of an issue as it it really easy to assemble. Size and quality is amazing for the price',
   'Anonymous', 'wayfair', true, false, null, '2026-07-16', 'approved',
   'Wayfair UK review, verified purchase, no location. Imported 7 Sep 2026.'),
  ('3c4ffe1b-932e-4686-8fbf-e501824974cc', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'They look cute and just like the picture. They’re also sturdy. It’s made of wood and not metal like another review had suggested.',
   'Sodaba', 'wayfair', true, false, 'GB', '2026-07-06', 'approved',
   'Wayfair UK review, verified purchase, London, GB. Imported 7 Sep 2026.'),
  ('ef25dc66-b018-4b56-9d1c-5525fe0af3d6', 'henley-set-of-2-scandi-beige-dining-chairs', 4,
   'Some screws have come loose after a few weeks and it doesn’t look steady enough though they look beautiful.',
   'Sa', 'wayfair', true, false, 'GB', '2026-06-06', 'approved',
   'Wayfair UK review, verified purchase, Houghton Regis. Imported 7 Sep 2026.'),
  ('b2ee43a1-5504-4188-9848-522f969c1eca', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'Good quality easy assembly and Sarah was amazing in dealing with my issues!',
   'Sumayyah', 'wayfair', true, false, 'GB', '2026-05-23', 'approved',
   'Wayfair UK review, verified purchase, Crayford Dartford, GB. Imported 7 Sep 2026.'),
  ('5abf490f-b070-4ae4-874d-58ad19e014ef', 'henley-set-of-2-scandi-beige-dining-chairs', 5,
   'Pleased with the dinning chair. Lovely fabric, comfortable to sit on and quite sturdy.',
   'Anonymous', 'wayfair', true, false, null, '2026-05-23', 'approved',
   'Wayfair UK review, verified purchase, no location. Imported 7 Sep 2026.')
on conflict (id) do nothing;

insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/henley-scandi-dining-chair-review-1.webp","/reviews/henley-scandi-dining-chair-review-2.webp","/reviews/henley-scandi-dining-chair-review-3.webp","/reviews/henley-scandi-dining-chair-review-4.webp","/reviews/henley-scandi-dining-chair-review-5.webp","/reviews/henley-scandi-dining-chair-review-6.webp","/reviews/henley-scandi-dining-chair-review-7.webp","/reviews/henley-scandi-dining-chair-review-8.webp","/reviews/henley-scandi-dining-chair-review-9.webp","/reviews/henley-scandi-dining-chair-review-10.webp"]'
from unnest(array[
  'henley-set-of-2-scandi-beige-dining-chairs',
  'henley-set-of-2-scandi-camel-dining-chairs'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;