BEGIN;

CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'admin'
  ) OR public.has_role(_user_id, 'admin'::public.app_role);
$$;

REVOKE ALL ON FUNCTION public.is_admin_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid) TO authenticated;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon;

DO $$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.bookings', existing_policy.policyname);
  END LOOP;
END;
$$;

CREATE POLICY "Admins manage all bookings"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Users view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can reserve free online coaching"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL
    AND service_name = 'Online Coaching'
    AND service_type = 'online_coaching'
    AND price = 0
    AND is_online = true
    AND is_free_pilot = true
  );

NOTIFY pgrst, 'reload schema';

COMMIT;
