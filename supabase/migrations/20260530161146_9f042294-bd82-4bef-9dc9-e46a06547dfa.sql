-- 1) Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on user_roles"
ON public.user_roles
FOR ALL
TO service_role
USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Seed admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('065eaf32-3cd1-4bc9-95c8-4223a1db71bd', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Tighten product_overrides: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can manage overrides" ON public.product_overrides;

CREATE POLICY "Admins can manage overrides"
ON public.product_overrides
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Restrict product_audits read access
DROP POLICY IF EXISTS "Authenticated users can view audits" ON public.product_audits;

CREATE POLICY "Admins can view audits"
ON public.product_audits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4) Tighten anonymous offer INSERT validation
DROP POLICY IF EXISTS "Anyone can submit an offer" ON public.offers;

CREATE POLICY "Anyone can submit a validated offer"
ON public.offers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND char_length(buyer_email) BETWEEN 3 AND 255
  AND buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (buyer_name IS NULL OR char_length(buyer_name) <= 120)
  AND char_length(product_handle) BETWEEN 1 AND 255
  AND char_length(product_title) BETWEEN 1 AND 500
  AND (variant_title IS NULL OR char_length(variant_title) <= 255)
  AND offer_amount > 0 AND offer_amount <= 1000000
  AND original_price > 0 AND original_price <= 1000000
  AND quantity BETWEEN 1 AND 999
  AND counter_amount IS NULL
  AND shopify_draft_order_id IS NULL
  AND shopify_invoice_url IS NULL
  AND admin_notes IS NULL
);

-- Admins can view all offers (in addition to buyers viewing their own)
CREATE POLICY "Admins can view all offers"
ON public.offers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5) Lock down SECURITY DEFINER queue helpers — backend only
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;