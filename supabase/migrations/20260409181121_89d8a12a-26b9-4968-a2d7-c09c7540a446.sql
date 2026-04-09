
-- 1. Remove overly permissive offers SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view all offers" ON public.offers;

-- 2. Remove authenticated user write policies on product_categories (service_role policies already exist)
DROP POLICY IF EXISTS "Authenticated users can insert product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can update product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can delete product categories" ON public.product_categories;

-- 3. Add write protection for review-images storage bucket (service role only)
CREATE POLICY "Only service role can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can update review images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'review-images' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can delete review images"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-images' AND auth.role() = 'service_role');

-- 4. Drop misleading dead-code email table policies (service_role bypasses RLS anyway)
DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can insert send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can update send log" ON public.email_send_log;

DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;

DROP POLICY IF EXISTS "Service role can read tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can mark tokens as used" ON public.email_unsubscribe_tokens;

DROP POLICY IF EXISTS "Service role can read suppressed emails" ON public.suppressed_emails;
DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
