CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating TEXT NOT NULL DEFAULT 'Positive',
  feedback TEXT NOT NULL,
  item_title TEXT,
  price TEXT,
  period TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK (true);