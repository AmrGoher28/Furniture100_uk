
-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_handle TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  variant_id TEXT,
  variant_title TEXT,
  original_price NUMERIC(10,2) NOT NULL,
  offer_amount NUMERIC(10,2) NOT NULL,
  counter_amount NUMERIC(10,2),
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'countered', 'declined', 'counter_accepted', 'counter_declined', 'completed')),
  admin_notes TEXT,
  shopify_draft_order_id TEXT,
  shopify_invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (buyers submitting offers without auth)
CREATE POLICY "Anyone can submit an offer"
  ON public.offers FOR INSERT
  WITH CHECK (true);

-- Allow buyers to check their own offer status by email
CREATE POLICY "Buyers can view their own offers"
  ON public.offers FOR SELECT
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
