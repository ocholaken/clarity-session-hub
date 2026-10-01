CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  visitor_id text,
  user_message text,
  message text,
  ai_response text,
  response text,
  page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_logs
  ADD COLUMN IF NOT EXISTS visitor_id text,
  ADD COLUMN IF NOT EXISTS user_message text,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS ai_response text,
  ADD COLUMN IF NOT EXISTS response text,
  ADD COLUMN IF NOT EXISTS page text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins can view ai chat logs" ON public.ai_chat_logs;
CREATE POLICY "admins can view ai chat logs"
  ON public.ai_chat_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public can insert ai chat logs" ON public.ai_chat_logs;
CREATE POLICY "public can insert ai chat logs"
  ON public.ai_chat_logs FOR INSERT TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL
    AND char_length(session_id) BETWEEN 1 AND 200
    AND (user_message IS NOT NULL OR ai_response IS NOT NULL)
  );

GRANT SELECT ON public.ai_chat_logs TO authenticated;
GRANT INSERT ON public.ai_chat_logs TO anon, authenticated;

CREATE INDEX IF NOT EXISTS ai_chat_logs_created_at_idx
  ON public.ai_chat_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS ai_chat_logs_session_id_idx
  ON public.ai_chat_logs (session_id, created_at DESC);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_chat_logs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
