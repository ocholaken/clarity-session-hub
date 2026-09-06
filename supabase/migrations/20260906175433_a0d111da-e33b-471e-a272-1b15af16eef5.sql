-- Payment status
CREATE TYPE public.payment_status AS ENUM ('pending','successful','failed','cancelled','refunded');
CREATE TYPE public.payment_provider AS ENUM ('mpesa','stripe');

-- Bookable time slots
CREATE TABLE public.time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  counselor_name text,
  starts_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (starts_at, counselor_name)
);

GRANT SELECT ON public.time_slots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_slots TO authenticated;
GRANT ALL ON public.time_slots TO service_role;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view time slots" ON public.time_slots
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage time slots" ON public.time_slots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_time_slots_updated BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link appointments to a slot, one booking per slot
ALTER TABLE public.appointments
  ADD COLUMN slot_id uuid REFERENCES public.time_slots(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX appointments_slot_unique
  ON public.appointments(slot_id)
  WHERE slot_id IS NOT NULL AND status <> 'cancelled';

-- Payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id uuid,
  provider public.payment_provider NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  status public.payment_status NOT NULL DEFAULT 'pending',
  reference text,
  provider_reference text,
  payer_contact text,
  raw_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payments" ON public.payments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bootstrap the first administrator account
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT DO NOTHING;

  IF lower(NEW.email) = 'ocholakenna1@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $function$;