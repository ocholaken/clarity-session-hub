CREATE TABLE IF NOT EXISTS public.site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path text NOT NULL,
  time_spent integer NOT NULL DEFAULT 0,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.site_analytics TO authenticated;
GRANT ALL ON public.site_analytics TO service_role;
ALTER TABLE public.site_analytics DISABLE ROW LEVEL SECURITY;