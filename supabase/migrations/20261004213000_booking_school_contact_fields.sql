BEGIN;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS school_name text,
  ADD COLUMN IF NOT EXISTS contact_role text,
  ADD COLUMN IF NOT EXISTS student_count integer,
  ADD COLUMN IF NOT EXISTS amount_due numeric,
  ADD COLUMN IF NOT EXISTS service_id text;

NOTIFY pgrst, 'reload schema';

COMMIT;
