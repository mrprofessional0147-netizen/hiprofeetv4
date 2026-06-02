-- Fix "column reference id is ambiguous" — the RETURNS TABLE columns named
-- `id` and `percent_off` clashed with the coupons table columns inside the
-- function body. Rename output columns to disambiguate.
DROP FUNCTION IF EXISTS public.redeem_coupon(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.redeem_coupon(
  _code TEXT,
  _service_id TEXT,
  _platform TEXT
)
RETURNS TABLE (coupon_id UUID, coupon_percent_off INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;

  SELECT * INTO c FROM public.coupons
  WHERE upper(code) = upper(_code) AND active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid coupon code';
  END IF;

  IF c.service_id IS NOT NULL AND c.service_id <> _service_id THEN
    RAISE EXCEPTION 'Coupon not valid for this service';
  END IF;

  IF c.platform IS NOT NULL AND c.platform <> _platform THEN
    RAISE EXCEPTION 'Coupon not valid for this platform';
  END IF;

  IF c.used_count >= c.max_uses THEN
    RAISE EXCEPTION 'Coupon fully claimed';
  END IF;

  IF EXISTS (SELECT 1 FROM public.coupon_redemptions r WHERE r.coupon_id = c.id AND r.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You have already used this coupon';
  END IF;

  INSERT INTO public.coupon_redemptions (coupon_id, user_id) VALUES (c.id, auth.uid());
  UPDATE public.coupons SET used_count = used_count + 1 WHERE coupons.id = c.id;

  coupon_id := c.id;
  coupon_percent_off := c.percent_off;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_coupon(TEXT, TEXT, TEXT) TO authenticated;