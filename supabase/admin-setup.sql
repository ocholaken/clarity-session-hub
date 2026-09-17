-- Admin dashboard setup. Run in the Supabase SQL editor.
-- The existing schema already has profiles.role, bookings, and payments.

alter table public.profiles add column if not exists role text not null default 'client';
update public.profiles set role = 'client' where role is null;

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles for select to authenticated using (public.is_admin() or auth.uid() = id);
drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage bookings" on public.bookings;
create policy "Admins manage bookings" on public.bookings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments" on public.payments for all to authenticated using (public.is_admin()) with check (public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.bookings;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.payments;
exception when duplicate_object then null; end $$;