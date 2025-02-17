/*
  # Initial Schema Setup

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `proficiency` (integer)
    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('technical', 'soft')),
  proficiency integer NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for skills
CREATE POLICY "Allow public read access for skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access for skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for achievements
CREATE POLICY "Allow public read access for achievements"
  ON achievements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access for achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);