/*
  # Add projects table and update existing tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `date` (date)
      - `tags` (text[])
      - `created_at` (timestamptz)

  2. Updates to Existing Tables
    - `achievements`: Add `image_url` column

  3. Security
    - Enable RLS on `projects` table
    - Add policies for public read access
    - Add policies for authenticated write access
*/

-- Add image_url to achievements if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE achievements ADD COLUMN image_url text;
  END IF;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  date date NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Allow public read access for projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access for projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);