CREATE TABLE IF NOT EXISTS public.dropship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  business text NOT NULL,
  channel text NOT NULL,
  volume text,
  message text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text
);

GRANT INSERT ON public.dropship_applications TO anon;
GRANT INSERT ON public.dropship_applications TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.dropship_applications TO authenticated;
GRANT ALL ON public.dropship_applications TO service_role;

ALTER TABLE public.dropship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a dropship application"
  ON public.dropship_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON public.dropship_applications
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
  ON public.dropship_applications
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
  ON public.dropship_applications
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_dropship_applications_updated_at
  BEFORE UPDATE ON public.dropship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();