UPDATE public.services
SET price = LEAST(3500, GREATEST(2500, price))
WHERE price < 2500 OR price > 3500;

ALTER TABLE public.services
  DROP CONSTRAINT IF EXISTS services_price_range_check;
ALTER TABLE public.services
  ADD CONSTRAINT services_price_range_check
  CHECK (price BETWEEN 2500 AND 3500);
