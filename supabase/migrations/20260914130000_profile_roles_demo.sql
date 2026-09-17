ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- First admin setup: create admin@counseling.com / Admin123! in Supabase Auth,
-- then run: INSERT INTO profiles (id, email, role) VALUES ('<user_id_from_auth>', 'admin@counseling.com', 'admin');