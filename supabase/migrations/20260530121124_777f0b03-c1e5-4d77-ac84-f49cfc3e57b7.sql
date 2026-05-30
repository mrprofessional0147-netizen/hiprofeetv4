-- Coupons for promotional discounts with redemption limits
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  percent_off INTEGER NOT NULL CHECK (percent_off > 0 AND percent_off <= 100),
  max_uses INTEGER NOT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  service_id TEXT,
  platform TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
ON public.coupons FOR SELECT
USING (active = true);

CREATE POLICY "Admins manage coupons"
ON public.coupons FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Track each redemption (one per user per coupon)
CREATE TABLE public.coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, user_id)
);

GRANT SELECT, INSERT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions"
ON public.coupon_redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all redemptions"
ON public.coupon_redemptions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Atomic claim function: checks limit + inserts redemption in one transaction.
-- Returns the coupon row if successful, raises exception otherwise.
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  _code TEXT,
  _service_id TEXT,
  _platform TEXT
)
RETURNS TABLE (id UUID, percent_off INTEGER)
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

  -- Lock the coupon row to prevent race conditions
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

  -- Prevent same user claiming twice
  IF EXISTS (SELECT 1 FROM public.coupon_redemptions WHERE coupon_id = c.id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You have already used this coupon';
  END IF;

  INSERT INTO public.coupon_redemptions (coupon_id, user_id) VALUES (c.id, auth.uid());
  UPDATE public.coupons SET used_count = used_count + 1 WHERE id = c.id;

  RETURN QUERY SELECT c.id, c.percent_off;
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_coupon(TEXT, TEXT, TEXT) TO authenticated;

-- Seed the SNAPORA giveaway coupon: 100% off, TikTok followers only, 2 winners.
INSERT INTO public.coupons (code, percent_off, max_uses, service_id, platform)
VALUES ('SNAPORA', 100, 2, 'followers', 'TikTok');

-- Add coupon tracking columns to orders
ALTER TABLE public.orders
  ADD COLUMN coupon_code TEXT,
  ADD COLUMN discount_amount INTEGER NOT NULL DEFAULT 0;
