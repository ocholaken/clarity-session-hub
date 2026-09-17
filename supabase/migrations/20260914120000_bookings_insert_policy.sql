drop policy if exists "Users can create own bookings" on public.bookings;

create policy "Users can create own bookings"
on public.bookings
for insert
with check (auth.uid() = user_id);