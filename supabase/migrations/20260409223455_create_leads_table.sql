/*
  # Create leads table for Lekkage Expert

  ## Summary
  Creates the `leads` table to store all form submissions from the multi-step lead form on the website.
  This acts as a backup alongside the n8n webhook.

  ## New Tables
  - `leads`
    - `id` (uuid, primary key)
    - `categorie` (text) - Type of problem: waterlekkage, warmteverlies, etc.
    - `locatie_probleem` (text) - Location of the problem within the property
    - `type_pand` (text) - Type of property: woning, appartement, etc.
    - `urgentie` (text) - Urgency level
    - `verzekering` (text) - Whether insurance has been notified
    - `voorkeurs_datum` (text) - Preferred appointment date
    - `voornaam` (text) - First name (required)
    - `achternaam` (text) - Last name (required)
    - `telefoon` (text) - Phone number (required)
    - `email` (text) - Email address (required)
    - `adres` (text) - Street address (required)
    - `postcode` (text) - Postal code (required)
    - `plaats` (text) - City (required)
    - `opmerkingen` (text) - Optional notes
    - `bijlage_url` (text) - Optional photo attachment URL
    - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Row Level Security enabled
  - Anonymous users can INSERT (submit forms)
  - No SELECT/UPDATE/DELETE allowed for anon users (data stays private)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie text DEFAULT '',
  locatie_probleem text DEFAULT '',
  type_pand text DEFAULT '',
  urgentie text DEFAULT '',
  verzekering text DEFAULT '',
  voorkeurs_datum text DEFAULT '',
  voornaam text NOT NULL DEFAULT '',
  achternaam text NOT NULL DEFAULT '',
  telefoon text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  adres text NOT NULL DEFAULT '',
  postcode text NOT NULL DEFAULT '',
  plaats text NOT NULL DEFAULT '',
  opmerkingen text DEFAULT '',
  bijlage_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
