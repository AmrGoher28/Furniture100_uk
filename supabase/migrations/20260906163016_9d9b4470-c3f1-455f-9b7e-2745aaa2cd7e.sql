insert into public.product_reviews
  (id, product_handle, rating, title, body, author_name, source, variant_label, verified, incentivised, country, helpful_up, reviewed_at, status, admin_notes)
values
  ('c62498ba-1e2b-42df-9e5a-2edf2414eebf', 'furniture100-set-of-2-camden-grey-stitched-dining-chair', 5,
   'Great value and product',
   'Here''s pictures of the light gray chairs, I wanted to post some images as I was really on the fence about buying them as there is next to no pictures of these chairs in the flesh, I''d say they are more of an earthy clay gray rather then a clean silver gray, they are good quality, feel nice and easy to attach the legs, they have rubber on the bottom to stop scratching, they look expensive and came well packaged.. for the price you really cant complain!',
   'gerria', 'amazon', null, true, false, 'GB', 15, null, 'approved',
   'Amazon UK review, verified purchase, Colour Name: Light Grey, 2PCS. Amazon date 2021-11-08, not shown. Imported 7 Sep 2026.'),
  ('09ed8cda-eea0-4737-952d-fb05006c00c7', 'furniture100-set-of-2-camden-cream-stitched-dining-chair', 5,
   'Beautiful chair''s',
   'Beautiful looking chairs, sturdy and pretty simple to put together. They look way more expensive than they were and love the material as it will be easy to clean. Really comfortable too 👏',
   'Anonymous', 'amazon', null, true, false, 'GB', 0, null, 'approved',
   'Amazon UK review, verified purchase, Colour Name: Cream, 2PCS. No reviewer name in the paste. Amazon date 2024-09-19, not shown. Imported 7 Sep 2026.'),
  ('74376457-f1e5-4bc0-8f21-ec4f9adbdce8', 'furniture100-set-of-2-camden-cream-stitched-dining-chair', 4,
   'Good chairs',
   'Nice chairs with a sort of pleather material.

The seat is a little hard but slightly softer than wood chairs. Well made and sturdy.

The materials cleans well but beware if you have cats. I thought these were a fabric material (my cat isn''t a fan of scratching suede/velvet type material) however they''re not and material cat has absolutely destroyed these.',
   'Jennifer Lincoln', 'amazon', null, true, false, 'GB', 0, null, 'approved',
   'Amazon UK review, verified purchase, Colour Name: Cream, 2PCS. Amazon date 2025-03-22, not shown. Imported 7 Sep 2026.'),
  ('1ac95c26-337c-4541-b1b7-6e040a476d46', 'furniture100-set-of-2-camden-grey-stitched-dining-chair', 4,
   'Great chairs',
   'These are great chairs for the price, feel very sturdy and look great. There is a slight wobble in each of them but nothing of consequence. Really pleased with them.',
   'Ros Allen', 'amazon', null, true, false, 'GB', 0, null, 'approved',
   'Amazon UK review, verified purchase, Colour Name: Light Grey, 4PCS. Amazon date 2021-07-07, not shown. Imported 7 Sep 2026.'),
  ('6d2e31f8-5310-4c8b-b0fc-d6fb3118b214', 'furniture100-set-of-2-camden-cream-stitched-dining-chair', 4,
   'Generally good although the screw holes are a bit wanky',
   'Looks good, feels comfortable when sit on. But when I assemble them, I found it’s a tricky to line up to the screw holes. At the end, I gave up on one of the chairs, instead of 4 screws I’ve only been able to line up 3 screws, still feels sturdy but it’s not most ideal.',
   'ProductOpinions', 'amazon', null, true, false, 'GB', 0, null, 'approved',
   'Amazon UK review, verified purchase, Colour Name: Cream, 2PCS. Title is mildly crude; kept verbatim, flagged for the owner. Amazon date 2022-05-11, not shown. Imported 7 Sep 2026.')
on conflict (id) do nothing;

insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/camden-stitched-dining-chair-review-1.webp","/reviews/camden-stitched-dining-chair-review-2.webp","/reviews/camden-stitched-dining-chair-review-3.webp","/reviews/camden-stitched-dining-chair-review-4.webp","/reviews/camden-stitched-dining-chair-review-5.webp","/reviews/camden-stitched-dining-chair-review-6.webp","/reviews/camden-stitched-dining-chair-review-7.webp","/reviews/camden-stitched-dining-chair-review-8.webp","/reviews/camden-stitched-dining-chair-review-9.webp"]'
from unnest(array[
  'furniture100-set-of-2-camden-cream-stitched-dining-chair',
  'furniture100-set-of-2-camden-grey-stitched-dining-chair'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;