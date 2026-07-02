
-- 1. Extend conversations
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS route text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS industry text;

-- Allow user_id to be null for anonymous chats
ALTER TABLE public.conversations ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.messages ALTER COLUMN user_id DROP NOT NULL;

-- 2. growth_reviews
CREATE TABLE IF NOT EXISTS public.growth_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  business_name text,
  industry text,
  review_json jsonb NOT NULL,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.growth_reviews TO authenticated;
GRANT ALL ON public.growth_reviews TO service_role;
ALTER TABLE public.growth_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own reviews"
  ON public.growth_reviews FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners insert own reviews"
  ON public.growth_reviews FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 3. assessment_uploads
CREATE TABLE IF NOT EXISTS public.assessment_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  kind text NOT NULL CHECK (kind IN ('url','file')),
  value text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.assessment_uploads TO authenticated;
GRANT ALL ON public.assessment_uploads TO service_role;
ALTER TABLE public.assessment_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own uploads"
  ON public.assessment_uploads FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert their own uploads"
  ON public.assessment_uploads FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 4. Storage policies for assessment-uploads bucket
CREATE POLICY "Users read own assessment files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assessment-uploads' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Users upload own assessment files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assessment-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
