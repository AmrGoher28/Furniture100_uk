INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for review images" ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
