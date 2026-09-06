insert into public.product_reviews
  (id, product_handle, rating, title, body, author_name, source, variant_label, verified, incentivised, country, helpful_up, reviewed_at, status, admin_notes)
values
  ('058bc7f5-99d6-4d46-ac4d-e74a10e65244', 'nordic-camel-set-of-2-dining-chair', 5,
   'Lovely dining chairs, easy to assemble',
   'Brilliant dining chairs. Easy to put together, very comfy, seat is well sprung and wide. Seem very sturdy and they look nice too! Very pleased with my purchase.',
   'Claire B.', 'amazon', null, true, false, 'GB', 1, '2026-06-30', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Camel, Set of 4. Imported 7 Sep 2026.'),
  ('7f873c09-bfe8-4763-9aaf-b732c5396640', 'nordic-beige-set-of-2-dining-chair', 5,
   'A must buy.',
   'I absolutely love these. Just fits perfectly. Fantastic price. Easy to put together. Very comfortable, supportive. Looks amazing.',
   'Jacqui', 'amazon', null, true, false, 'GB', 0, '2026-06-26', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Beige01, Set of 2. Beige01 is Amazon''s own code for a beige; filed on our beige. Imported 7 Sep 2026.'),
  ('88ee20f7-0848-43d2-bcdd-9d8295921815', 'nordic-camel-set-of-2-dining-chair', 5,
   'Looks to expensive and very comfortable',
   'Great product, quality and so comfortable to seat. Arrived earlier that expected. Was easy to assemble.',
   'Mira Anafina', 'amazon', null, true, false, 'GB', 0, '2026-08-22', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Camel, Set of 2. Imported 7 Sep 2026.'),
  ('acc6b785-400d-4c8b-9f70-ca08b6413fd2', 'nordic-moss-dining-chair', 5,
   'Comfortable',
   'Totally love these chairs. Really comfortable and they look just right at our small table . Seat and back are well cushioned.',
   'HC', 'amazon', null, true, false, 'GB', 0, '2026-06-27', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Green, Set of 2. Filed on the moss, which is our green. Imported 7 Sep 2026.'),
  ('eb673761-e832-48f2-bf69-c8f597b44502', 'nordic-beige-set-of-2-dining-chair', 5,
   'High quality for the price',
   'Beautiful chairs study and solid the material is of high quality and the walnut wooden legs complement the dinning table (which is also brought from Amazon along with a matching bench in the other side) the chairs are comfy and the seats are well padded! 😊',
   'Anonymous', 'amazon', null, true, false, 'GB', 4, '2026-08-06', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Beige, Set of 4. Posted as "Amazon Customer". Mentions buying the table from Amazon; kept verbatim, flagged for the owner. Imported 7 Sep 2026.'),
  ('0b0afb85-86aa-419a-bb7a-77cb73432a81', 'nordic-beige-set-of-2-dining-chair', 5,
   'Beige 4 pack chairs',
   'Very sturdy, comfy and fluffy! Super happy with this purchase. Definitely a 2 person job as it’s very fiddly and comes with 100 pieces. Good value for money.',
   'Phoebe Shayle', 'amazon', null, true, false, 'GB', 0, '2026-08-25', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Beige, Set of 4. Imported 7 Sep 2026.'),
  ('c1df64e9-9f7b-4781-a761-264243184058', 'nordic-beige-set-of-2-dining-chair', 5,
   'Dining chairs',
   'I''m very pleased with the chairs. They are excellent quality and look easy to assemble.',
   'Ruth Kenyon', 'amazon', 'Oatmeal', true, false, 'GB', 0, '2026-08-23', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Oatmeal, Set of 4. Oatmeal is not a colourway we sell. Imported 7 Sep 2026.'),
  ('2b7d4e16-01ae-403f-a11b-81e331d66d3b', 'nordic-beige-set-of-2-dining-chair', 5,
   'Lovely chairs',
   'These chairs look lovely.',
   'Margemob', 'amazon', 'Grey', true, false, 'GB', 0, '2026-09-03', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Grey, Set of 2. Grey is not a colourway we sell. Imported 7 Sep 2026.'),
  ('a2f0d510-06aa-4148-aa25-1b6118f65ff1', 'nordic-moss-dining-chair', 1,
   'Front legs unstable/moving',
   'The front legs on these are not stable, there is movement and a lot of it. We tried adjusting/tightening but the legs move again. They constantly look and feel odd. We have used those for only four weeks and reckon they won’t last very long at all.',
   'Joanna Drobniak', 'amazon', 'Dark Green', true, false, 'GB', 1, '2026-08-29', 'approved',
   'Amazon UK review, verified purchase, Colour Name: Dark Green, Set of 6. Dark Green is not a colourway we sell. Imported 7 Sep 2026.')
on conflict (id) do nothing;

-- The customer photo strip, on every colour of the chair.
insert into public.product_overrides (product_handle, field_key, field_value)
select handle, 'review_photos', '["/reviews/astrid-dining-chair-review-1.webp","/reviews/astrid-dining-chair-review-2.webp","/reviews/astrid-dining-chair-review-3.webp","/reviews/astrid-dining-chair-review-4.webp"]'
from unnest(array[
  'nordic-beige-set-of-2-dining-chair',
  'nordic-camel-set-of-2-dining-chair',
  'nordic-moss-dining-chair'
]) as handle
on conflict (product_handle, field_key) do update set field_value = excluded.field_value;