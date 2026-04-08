CREATE POLICY "Authenticated users can view all offers"
ON public.offers
FOR SELECT
TO authenticated
USING (true);