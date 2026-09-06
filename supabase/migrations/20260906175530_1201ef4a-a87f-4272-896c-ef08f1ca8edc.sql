CREATE UNIQUE INDEX appointments_scheduled_unique
  ON public.appointments (scheduled_at)
  WHERE status <> 'cancelled';

CREATE OR REPLACE FUNCTION public.booked_times(_from timestamptz, _to timestamptz)
RETURNS TABLE (scheduled_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.scheduled_at
  FROM public.appointments a
  WHERE a.status <> 'cancelled'
    AND a.scheduled_at >= _from
    AND a.scheduled_at < _to
$$;

REVOKE EXECUTE ON FUNCTION public.booked_times(timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.booked_times(timestamptz, timestamptz) TO anon, authenticated;