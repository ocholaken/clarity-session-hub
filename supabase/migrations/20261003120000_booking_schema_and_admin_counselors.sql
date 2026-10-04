ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS is_online boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_free_pilot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price integer,
  ADD COLUMN IF NOT EXISTS deposit integer,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS client_phone text,
  ADD COLUMN IF NOT EXISTS service_name text,
  ADD COLUMN IF NOT EXISTS mpesa_phone text,
  ADD COLUMN IF NOT EXISTS intent text,
  ADD COLUMN IF NOT EXISTS notes text;

GRANT INSERT ON public.bookings TO anon;

DROP POLICY IF EXISTS "Anyone can reserve free online coaching" ON public.bookings;
CREATE POLICY "Anyone can reserve free online coaching"
  ON public.bookings FOR INSERT TO anon
  WITH CHECK (
    user_id IS NULL
    AND service_name = 'Online Coaching'
    AND service_type = 'online_coaching'
    AND price = 0
    AND is_online = true
    AND is_free_pilot = true
  );

CREATE TABLE IF NOT EXISTS public.counselors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  gender text CHECK (gender IN ('Male', 'Female')),
  specialty text,
  phone text,
  email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.counselors TO authenticated;
GRANT ALL ON public.counselors TO service_role;

DROP POLICY IF EXISTS "Admins manage counselors" ON public.counselors;
CREATE POLICY "Admins manage counselors"
  ON public.counselors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.counselors (full_name, gender, specialty, is_active)
SELECT 'Example Male Counselor', 'Male', 'General Counseling', false
WHERE NOT EXISTS (
  SELECT 1 FROM public.counselors WHERE full_name = 'Example Male Counselor'
);

INSERT INTO public.counselors (full_name, gender, specialty, is_active)
SELECT 'Example Female Counselor', 'Female', 'General Counseling', false
WHERE NOT EXISTS (
  SELECT 1 FROM public.counselors WHERE full_name = 'Example Female Counselor'
);

NOTIFY pgrst, 'reload schema';