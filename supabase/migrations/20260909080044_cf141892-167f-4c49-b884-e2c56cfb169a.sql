
CREATE TYPE public.content_type AS ENUM ('video','article','guide');
CREATE TYPE public.subscription_status AS ENUM ('none','trialing','active','expired','cancelled');
ALTER TYPE public.payment_provider ADD VALUE IF NOT EXISTS 'paystack';

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  type public.content_type NOT NULL,
  category text,
  duration_label text,
  is_premium boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published content" ON public.content_items FOR SELECT TO anon, authenticated USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage content" ON public.content_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_content_items_updated BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.subscription_status NOT NULL DEFAULT 'none',
  phone text,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  provider public.payment_provider,
  last_receipt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users start own trial" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status IN ('none','trialing'));
CREATE POLICY "Users update own phone" ON public.subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND status IN ('none','trialing','active','expired','cancelled'));
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = _user_id
      AND s.status IN ('trialing','active')
      AND GREATEST(COALESCE(s.trial_ends_at, '-infinity'::timestamptz), COALESCE(s.current_period_end, '-infinity'::timestamptz)) > now()
  )
$$;

CREATE TABLE public.content_bodies (
  content_id uuid PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
  video_url text,
  file_url text,
  body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_bodies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_bodies TO authenticated;
GRANT ALL ON public.content_bodies TO service_role;
ALTER TABLE public.content_bodies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Free content bodies are public" ON public.content_bodies FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.content_items c WHERE c.id = content_id AND c.is_published AND NOT c.is_premium));
CREATE POLICY "Subscribers view premium bodies" ON public.content_bodies FOR SELECT TO authenticated
  USING (public.has_active_subscription(auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage content bodies" ON public.content_bodies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_content_bodies_updated BEFORE UPDATE ON public.content_bodies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'booking';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL;
