ALTER TABLE public.site_analytics ADD COLUMN IF NOT EXISTS visitor_id uuid;

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.anonymous_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL UNIQUE,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  device text,
  browser text,
  os text,
  ip_address text,
  country text,
  city text,
  total_sessions integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  session_id text,
  page_url text,
  action_type text NOT NULL CHECK (action_type IN ('page_view', 'form_start', 'form_submit', 'button_click', 'chat_message')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.anonymous_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS anonymous_visitors_last_seen_idx
  ON public.anonymous_visitors (last_seen DESC);

CREATE INDEX IF NOT EXISTS interactions_visitor_id_idx
  ON public.interactions (visitor_id);

CREATE INDEX IF NOT EXISTS interactions_created_at_idx
  ON public.interactions (created_at DESC);

CREATE INDEX IF NOT EXISTS messages_message_fulltext_idx
  ON public.messages USING gin (to_tsvector('english', message));

ALTER TABLE public.anonymous_visitors OWNER TO postgres;
ALTER TABLE public.interactions OWNER TO postgres;

GRANT INSERT ON public.anonymous_visitors TO anon;
GRANT SELECT ON public.anonymous_visitors TO authenticated;
GRANT ALL ON public.anonymous_visitors TO service_role;

GRANT INSERT ON public.interactions TO anon;
GRANT SELECT ON public.interactions TO authenticated;
GRANT ALL ON public.interactions TO service_role;

GRANT INSERT, UPDATE, SELECT ON public.site_analytics TO anon;
GRANT SELECT ON public.site_analytics TO authenticated;
GRANT ALL ON public.site_analytics TO service_role;

DROP POLICY IF EXISTS "anon can insert analytics" ON public.site_analytics;
CREATE POLICY "anon can insert analytics" ON public.site_analytics FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "admins can view analytics" ON public.site_analytics;
CREATE POLICY "admins can view analytics" ON public.site_analytics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "anon can insert anonymous visitors" ON public.anonymous_visitors;
CREATE POLICY "anon can insert anonymous visitors" ON public.anonymous_visitors FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "admins can view anonymous visitors" ON public.anonymous_visitors;
CREATE POLICY "admins can view anonymous visitors" ON public.anonymous_visitors FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "anon can insert interactions" ON public.interactions;
CREATE POLICY "anon can insert interactions" ON public.interactions FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "admins can view interactions" ON public.interactions;
CREATE POLICY "admins can view interactions" ON public.interactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_visitors;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_analytics;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
