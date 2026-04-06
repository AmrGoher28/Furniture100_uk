
-- 1. Fix offers SELECT policy: restrict to matching buyer email for authenticated users
DROP POLICY IF EXISTS "Buyers can view their own offers" ON public.offers;
CREATE POLICY "Buyers can view their own offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (auth.email() = buyer_email);

CREATE POLICY "Service role full access on offers"
  ON public.offers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit an offer" ON public.offers;
CREATE POLICY "Anyone can submit an offer"
  ON public.offers FOR INSERT
  TO public
  WITH CHECK (status = 'pending');

-- 2. Fix product_categories: restrict writes to service_role only
DROP POLICY IF EXISTS "Anyone can insert product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Anyone can update product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Anyone can delete product categories" ON public.product_categories;

CREATE POLICY "Service role can insert product categories"
  ON public.product_categories FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update product categories"
  ON public.product_categories FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete product categories"
  ON public.product_categories FOR DELETE
  TO service_role
  USING (true);

-- 3. Fix reviews: require authentication for inserts
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Fix function search paths
CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
  RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
  RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
  RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
  RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN PERFORM pgmq.create(dlq_name); EXCEPTION WHEN OTHERS THEN NULL; END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN PERFORM pgmq.delete(source_queue, message_id); EXCEPTION WHEN undefined_table THEN NULL; END;
  RETURN new_id;
END;
$function$;
