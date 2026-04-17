/*
  # Fix leads table RLS policy conflict

  ## Problem
  Two conflicting INSERT policies existed on the leads table:
  1. "Anyone can submit a lead" - allows all anon inserts
  2. "Allow anonymous form submissions" - restricts inserts to rows where required fields are non-empty

  The second policy was blocking legitimate form submissions because when both
  policies exist, PostgreSQL requires ALL policies to pass (when using permissive policies
  in combination). The restrictive WITH CHECK was causing failures.

  ## Fix
  Drop the conflicting second policy, keeping only the simple permissive one.
*/

DROP POLICY IF EXISTS "Allow anonymous form submissions" ON leads;
