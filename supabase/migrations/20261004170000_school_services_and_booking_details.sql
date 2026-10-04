BEGIN;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'clinical',
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS audience text,
  ADD COLUMN IF NOT EXISTS price_label text,
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS service_category text NOT NULL DEFAULT 'clinical',
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS client_phone text,
  ADD COLUMN IF NOT EXISTS school_name text,
  ADD COLUMN IF NOT EXISTS contact_role text,
  ADD COLUMN IF NOT EXISTS student_count integer,
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;

GRANT INSERT ON public.bookings TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can create own bookings" ON public.bookings;
CREATE POLICY "Authenticated users can create own bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

WITH school_services(name, description, duration_minutes, price, price_label, badge, audience) AS (
  VALUES
    ('Personal Development Mastery', 'Transformative program cultivating self-awareness, emotional intelligence, and a growth mindset, aligned with CBC.', 120, 15000::numeric, 'KSh 15,000 / Session (Up to 100 students)', 'Most Requested', 'Primary - High School'),
    ('Motivational Keynote Speaking', 'High-energy keynote designed to move students from apathy to purpose, delivered by a clinical psychologist.', 90, 25000::numeric, 'KSh 25,000 / Keynote', 'Premium', 'School Assembly / Prize Giving'),
    ('Peak Performance: Exam Resilience Clinic', 'A CBT-informed intervention helping KCSE candidates turn anxiety into resilient exam performance.', 180, 12000::numeric, 'KSh 12,000 / Class', 'Results-Driven', 'Candidate Classes'),
    ('Leadership & Prefects Executive Training', 'A practical leadership lab that equips student councils to lead with service and accountability.', 480, 18000::numeric, 'KSh 18,000 / Cohort', 'Leadership', 'Prefects & Council'),
    ('Teachers Wellness & Burnout Prevention', 'Confidential wellbeing and burnout-prevention support for teachers navigating CBC and workplace pressures.', 120, 20000::numeric, 'KSh 20,000 / Staff Session', 'For Educators', 'Teaching Staff'),
    ('Anti-Bullying & Peer Mediation System', 'A whole-school peer-support and mediation system informed by established bullying-prevention practice.', 960, 30000::numeric, 'KSh 30,000 / Setup', 'System-Level', 'Whole School')
)
INSERT INTO public.services (
  name, description, duration_minutes, price, category, badge, audience, price_label, is_free, is_active
)
SELECT
  seed.name,
  seed.description,
  seed.duration_minutes,
  seed.price,
  'schools',
  seed.badge,
  seed.audience,
  seed.price_label,
  false,
  true
FROM school_services AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM public.services AS existing
  WHERE lower(existing.name) = lower(seed.name)
);

COMMIT;
