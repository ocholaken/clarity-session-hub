CREATE TABLE IF NOT EXISTS public.saturday_sessions_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL DEFAULT 'saturday_mentorship'
    CHECK (service_type = 'saturday_mentorship'),
  is_online boolean NOT NULL DEFAULT true,
  price integer NOT NULL DEFAULT 0 CHECK (price = 0),
  deposit integer NOT NULL DEFAULT 200 CHECK (deposit = 200),
  is_free_pilot boolean NOT NULL DEFAULT true CHECK (is_free_pilot),
  status text NOT NULL DEFAULT 'pending' CHECK (status = 'pending'),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(trim(phone)) BETWEEN 7 AND 30),
  intent text NOT NULL CHECK (char_length(trim(intent)) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.saturday_sessions_registrations ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.saturday_sessions_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.saturday_sessions_registrations TO authenticated;
GRANT ALL ON public.saturday_sessions_registrations TO service_role;

DROP POLICY IF EXISTS "Anyone can reserve a Saturday pilot spot" ON public.saturday_sessions_registrations;
CREATE POLICY "Anyone can reserve a Saturday pilot spot"
  ON public.saturday_sessions_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (
    service_type = 'saturday_mentorship'
    AND is_online = true
    AND price = 0
    AND deposit = 200
    AND is_free_pilot = true
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "Admins manage Saturday pilot registrations" ON public.saturday_sessions_registrations;
CREATE POLICY "Admins manage Saturday pilot registrations"
  ON public.saturday_sessions_registrations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
