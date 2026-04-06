
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle text NOT NULL UNIQUE,
  category_slug text NOT NULL,
  subcategory_slug text,
  is_best_seller boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product categories"
  ON public.product_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert product categories"
  ON public.product_categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update product categories"
  ON public.product_categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete product categories"
  ON public.product_categories FOR DELETE
  TO public
  USING (true);

CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
