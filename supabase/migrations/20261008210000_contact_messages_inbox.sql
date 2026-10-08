BEGIN;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.messages TO authenticated;

DROP POLICY IF EXISTS "Anyone can send a message" ON public.messages;
CREATE POLICY "Anyone can send a message"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage messages" ON public.messages;
CREATE POLICY "Admins manage messages"
  ON public.messages
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

NOTIFY pgrst, 'reload schema';

COMMIT;
