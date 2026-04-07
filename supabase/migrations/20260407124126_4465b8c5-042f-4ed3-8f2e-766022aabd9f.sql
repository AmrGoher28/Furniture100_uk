CREATE TABLE public.product_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle text NOT NULL,
  product_title text NOT NULL,
  product_image text,
  original_description text,
  suggested_description text,
  image_match_score integer,
  image_match_notes text,
  inferred_specs jsonb,
  flags text[],
  status text NOT NULL DEFAULT 'pending',
  audit_batch_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on product_audits"
  ON public.product_audits FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view audits"
  ON public.product_audits FOR SELECT TO authenticated
  USING (true);