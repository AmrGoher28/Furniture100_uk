
-- Replace permissive reviews insert with validated one
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;

CREATE POLICY "Authenticated users can insert validated reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    rating IN ('Positive', 'Neutral', 'Negative')
    AND char_length(feedback) <= 2000
    AND char_length(reviewer_name) <= 100
    AND (item_title IS NULL OR char_length(item_title) <= 255)
  );
