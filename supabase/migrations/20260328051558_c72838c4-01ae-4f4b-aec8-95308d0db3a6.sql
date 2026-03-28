-- Add type and external_url columns to learning_resources
ALTER TABLE public.learning_resources ADD COLUMN IF NOT EXISTS type text DEFAULT 'link';
ALTER TABLE public.learning_resources ADD COLUMN IF NOT EXISTS external_url text;

-- Create tutorials_media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('tutorials-media', 'tutorials-media', true) ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read tutorials media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'tutorials-media');

-- Allow admin uploads
CREATE POLICY "Admin upload tutorials media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tutorials-media' AND public.has_role(auth.uid(), 'admin'));

-- Allow admin delete
CREATE POLICY "Admin delete tutorials media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tutorials-media' AND public.has_role(auth.uid(), 'admin'));