
CREATE TABLE public.product_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle text NOT NULL,
  field_key text NOT NULL,
  field_value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_handle, field_key)
);

ALTER TABLE public.product_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage overrides"
ON public.product_overrides FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read overrides"
ON public.product_overrides FOR SELECT TO public
USING (true);
