insert into public.product_reviews
  (id, product_handle, rating, title, body, author_name, source, variant_label, verified, incentivised, reviewed_at, status, admin_notes)
values
  ('4897f757-ea37-4e23-9077-e21c02e05131', 'aston-black-swivel-office-chair-with-chrome-arms', 5,
   'Great back supporr',
   'Used it for a while now and am very happy with this chair. Great seat and back support.',
   'AJ', 'amazon', null, true, false, '2026-02-07', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.'),
  ('46809392-cda8-405d-b8bf-b9fc582119d2', 'aston-black-swivel-office-chair-with-chrome-arms', 4,
   'Good, but started falling aprat',
   'Good, but have the buttons coming off now...',
   'Anna', 'amazon', 'Black', true, false, '2026-01-20', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.'),
  ('6cfdf95a-fa3a-4c77-a58e-9c06b849e674', 'aston-black-swivel-office-chair-with-chrome-arms', 5,
   'Comfortable and good for larger people',
   'I bought this chair for my husband who works 12 hour night shifts and used to sit on the dining chairs! It is so wide and load bearing and very comfortable he sits in it all night now without getting numb 😅 I put it together myself for him as a surprise and it was very easy, even when juggling two young children. Highly recommend, and the colour and style fit perfect in a small living room and left out all the time.',
   'Abi', 'amazon', null, true, false, '2025-10-19', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.'),
  ('dab3cf3a-cc13-42e4-a6e5-7c301f087783', 'aston-black-swivel-office-chair-with-chrome-arms', 5,
   'Stylish looks and executive comfort.',
   'Absolutely gorgeous chair. I''ve been looking for an Eames-esque office chair for a while, and this one came across my radar (200 chrome tabs later). Took about 20 minutes to put together solo and fits perfectly under my desk. Literally cannot fault any of it. Well worth the price.

This chair doesn’t just complete my workspace—it elevates it. The black PU leather has that quiet confidence: sleek, understated, sharp as a tailored suit. The chrome accents catch the light just enough to make a statement without shouting. It’s comfort meets class. Every time I sit down, it feels like I’m stepping into a boardroom, even if it’s just a Zoom call.

There’s a certain romance in finding the right piece—when form and function shake hands and agree to stay awhile. This chair gets it. It''s not trying to be something else. It knows what it is, and that’s exactly what I needed.',
   'Retailtherapy', 'amazon', 'Black', true, false, '2025-04-17', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.'),
  ('78e0adf0-283b-4967-82aa-39ba0a8cf510', 'aston-black-swivel-office-chair-with-chrome-arms', 5,
   'easy to assemble',
   'easy to assemble, very comfortable',
   'grandma Beaver', 'amazon', null, true, false, '2025-07-31', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.'),
  ('cff9408e-1add-4497-8422-adc6ab61c8ef', 'aston-black-swivel-office-chair-with-chrome-arms', 5,
   'Good made',
   'I’m very happy with this chair. Well made with good quality. The colour is nice. The seating part is nice and wide, the cushion is thick and soft. I feel very comfortable sitting on it. Just Hope it can last.',
   'D.W', 'amazon', null, true, false, '2025-03-12', 'approved',
   'Amazon UK review, verified purchase. Imported 7 Sep 2026.')
on conflict (id) do nothing;

insert into public.product_overrides (product_handle, field_key, field_value)
values (
  'aston-black-swivel-office-chair-with-chrome-arms',
  'review_photos',
  '["/reviews/aston-black-swivel-office-chair-review-1.webp","/reviews/aston-black-swivel-office-chair-review-2.webp","/reviews/aston-black-swivel-office-chair-review-3.webp"]'
)
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;