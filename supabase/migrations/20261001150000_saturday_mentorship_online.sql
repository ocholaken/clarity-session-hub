CREATE TABLE IF NOT EXISTS public.saturday_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  platform text DEFAULT 'Zoom',
  is_online boolean DEFAULT true,
  schedule text,
  price integer DEFAULT 2000,
  max_participants integer DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.saturday_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.saturday_sessions TO anon, authenticated;
GRANT ALL ON public.saturday_sessions TO service_role;

DROP POLICY IF EXISTS "Anyone can view Saturday sessions" ON public.saturday_sessions;
CREATE POLICY "Anyone can view Saturday sessions"
  ON public.saturday_sessions FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage Saturday sessions" ON public.saturday_sessions;
CREATE POLICY "Admins manage Saturday sessions"
  ON public.saturday_sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS is_online boolean NOT NULL DEFAULT false;
