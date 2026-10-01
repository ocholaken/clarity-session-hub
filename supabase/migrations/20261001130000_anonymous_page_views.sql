ALTER TABLE public.anonymous_visitors
  ADD COLUMN IF NOT EXISTS last_page text,
  ADD COLUMN IF NOT EXISTS pages_viewed integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES public.anonymous_visitors(visitor_id) ON DELETE CASCADE,
  page_url text NOT NULL,
  counselor_id text,
  device text,
  referrer text,
  event_type text NOT NULL DEFAULT 'page_view'
    CHECK (event_type IN ('page_view', 'counselor_view', 'scroll_depth')),
  scroll_depth integer CHECK (scroll_depth IS NULL OR scroll_depth BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS page_views_created_at_idx
  ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_visitor_id_created_at_idx
  ON public.page_views (visitor_id, created_at DESC);

GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

DROP POLICY IF EXISTS "admins can view page views" ON public.page_views;
CREATE POLICY "admins can view page views"
  ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.interactions
  DROP CONSTRAINT IF EXISTS interactions_action_type_check;
ALTER TABLE public.interactions
  ADD CONSTRAINT interactions_action_type_check
  CHECK (action_type IN ('page_view', 'form_start', 'form_submit', 'button_click', 'chat_message', 'counselor_view', 'scroll_depth'));

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;