
-- Allow authenticated users to insert, update, and delete product categories
CREATE POLICY "Authenticated users can insert product categories"
  ON public.product_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product categories"
  ON public.product_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product categories"
  ON public.product_categories FOR DELETE
  TO authenticated
  USING (true);
