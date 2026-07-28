-- 1. diagnoses
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  report_token TEXT UNIQUE,
  name TEXT,
  email TEXT,
  business_name TEXT,
  industry TEXT,
  revenue_band TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER,
  pillar_scores JSONB,
  report JSONB,
  status TEXT NOT NULL DEFAULT 'in_progress',
  source TEXT,
  ip TEXT,
  user_agent TEXT,
  verified_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.diagnoses TO authenticated;
GRANT ALL ON public.diagnoses TO service_role;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage diagnoses" ON public.diagnoses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX diagnoses_created_at_idx ON public.diagnoses(created_at DESC);
CREATE INDEX diagnoses_status_idx ON public.diagnoses(status);
CREATE INDEX diagnoses_email_idx ON public.diagnoses(email);
CREATE TRIGGER diagnoses_updated_at BEFORE UPDATE ON public.diagnoses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. email_verifications
CREATE TABLE public.email_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosis_id UUID NOT NULL REFERENCES public.diagnoses(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.email_verifications TO authenticated;
GRANT ALL ON public.email_verifications TO service_role;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view email verifications" ON public.email_verifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX email_verifications_diagnosis_idx ON public.email_verifications(diagnosis_id, created_at DESC);

-- 3. consultation_requests
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosis_id UUID NOT NULL REFERENCES public.diagnoses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage consultation requests" ON public.consultation_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX consultation_requests_created_at_idx ON public.consultation_requests(created_at DESC);
CREATE TRIGGER consultation_requests_updated_at BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. app_config (singleton)
CREATE TABLE public.app_config (
  id TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
  require_email_verification BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT app_config_singleton CHECK (id = 'singleton')
);
GRANT SELECT, UPDATE ON public.app_config TO authenticated;
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read app_config" ON public.app_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update app_config" ON public.app_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER app_config_updated_at BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.app_config (id, require_email_verification) VALUES ('singleton', true);