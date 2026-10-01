CREATE TABLE IF NOT EXISTS public.saturday_free_pilot_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  mpesa_phone text NOT NULL,
  intent text NOT NULL DEFAULT 'Saturday mentorship',
  service_type text NOT NULL DEFAULT 'saturday_mentorship',
  is_online boolean NOT NULL DEFAULT true,
  is_free_pilot boolean NOT NULL DEFAULT true,
  price integer NOT NULL DEFAULT 0,
  deposit integer NOT NULL DEFAULT 200,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.saturday_free_pilot_registrations
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS mpesa_phone text,
  ADD COLUMN IF NOT EXISTS intent text DEFAULT 'Saturday mentorship',
  ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'saturday_mentorship',
  ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_free_pilot boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS price integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit integer DEFAULT 200,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.saturday_free_pilot_registrations ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.saturday_free_pilot_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.saturday_free_pilot_registrations TO authenticated;
GRANT ALL ON public.saturday_free_pilot_registrations TO service_role;

DROP POLICY IF EXISTS "Public can insert Saturday free pilot registrations" ON public.saturday_free_pilot_registrations;
CREATE POLICY "Public can insert Saturday free pilot registrations"
  ON public.saturday_free_pilot_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (
    service_type = 'saturday_mentorship'
    AND is_online = true
    AND is_free_pilot = true
    AND price = 0
    AND deposit = 200
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "Admins manage Saturday free pilot registrations" ON public.saturday_free_pilot_registrations;
CREATE POLICY "Admins manage Saturday free pilot registrations"
  ON public.saturday_free_pilot_registrations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS is_online boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_free_pilot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price integer,
  ADD COLUMN IF NOT EXISTS deposit integer,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS client_phone text,
  ADD COLUMN IF NOT EXISTS mpesa_phone text,
  ADD COLUMN IF NOT EXISTS intent text,
  ADD COLUMN IF NOT EXISTS notes text;
