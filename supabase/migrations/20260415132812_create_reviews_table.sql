/*
  # Create reviews table for internal feedback

  ## Purpose
  Stores negative/neutral review feedback (1-3 stars) submitted through the
  review page's internal form. Positive reviews (4-5 stars) are redirected
  to Google Reviews and not stored here.

  ## New Tables
  - `reviews`
    - `id` (uuid, primary key)
    - `naam` (text) - reviewer's name
    - `email` (text) - reviewer's email
    - `rating` (integer, 1-3) - star rating given
    - `feedback` (text) - detailed feedback message
    - `created_at` (timestamptz) - submission timestamp

  ## Security
  - RLS enabled
  - INSERT policy: anyone can submit a review (public form)
  - SELECT/UPDATE/DELETE: only authenticated users (internal staff)
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 3),
  feedback text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (rating >= 1 AND rating <= 3);

CREATE POLICY "Authenticated users can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);
