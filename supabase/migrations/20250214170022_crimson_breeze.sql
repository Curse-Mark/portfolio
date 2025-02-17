/*
  # Add Certifications Table

  1. New Tables
    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `issuer` (text, not null)
      - `date` (date, not null)
      - `credential_url` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `certifications` table
    - Add policy for public read access
    - Add policy for authenticated users to manage certifications
*/

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date date NOT NULL,
  credential_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access for certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access for certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);