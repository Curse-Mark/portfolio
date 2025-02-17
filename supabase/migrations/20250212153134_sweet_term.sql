/*
  # Create storage bucket for uploads

  1. Storage
    - Create a new storage bucket for uploaded images
    - Set up public access policies
*/

-- Create a new storage bucket for uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-uploads', 'portfolio-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-uploads');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-uploads');

-- Allow authenticated users to update and delete their own files
CREATE POLICY "Authenticated users can update and delete their files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'portfolio-uploads')
WITH CHECK (bucket_id = 'portfolio-uploads');