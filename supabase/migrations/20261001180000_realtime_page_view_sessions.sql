CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS page text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'visitor_id'
  ) THEN
    ALTER TABLE public.page_views ALTER COLUMN visitor_id DROP NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'page_url'
  ) THEN
    ALTER TABLE public.page_views ALTER COLUMN page_url DROP NOT NULL;
  END IF;
END $$;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.page_views TO authenticated;
GRANT INSERT ON public.page_views TO anon, authenticated;

DROP POLICY IF EXISTS "admins can view page views" ON public.page_views;
CREATE POLICY "admins can view page views"
  ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
CREATE POLICY "Public can insert page views"
  ON public.page_views FOR INSERT TO anon, authenticated
  WITH CHECK (
    page IS NOT NULL
    AND session_id IS NOT NULL
    AND char_length(session_id) BETWEEN 1 AND 200
  );

CREATE INDEX IF NOT EXISTS page_views_created_at_idx
  ON public.page_views (created_at DESC);

CREATE OR REPLACE FUNCTION public.count_active_page_view_sessions()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(DISTINCT session_id)
  FROM public.page_views
  WHERE created_at > now() - interval '5 minutes'
    AND session_id IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.count_active_page_view_sessions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_active_page_view_sessions() TO authenticated;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
