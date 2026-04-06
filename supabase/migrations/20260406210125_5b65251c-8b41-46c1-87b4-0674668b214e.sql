DROP POLICY IF EXISTS "Authenticated users can insert product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can update product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can delete product categories" ON public.product_categories;

CREATE POLICY "Authenticated users can insert product categories"
  ON public.product_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product categories"
  ON public.product_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product categories"
  ON public.product_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);