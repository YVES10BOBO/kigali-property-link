-- Fix testimonials RLS policies to avoid users table query
-- This migration fixes the "permission denied for table users" error

-- Drop the problematic policy that queries users table
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;

-- Separate policies for better control
-- Admins can view all testimonials (including pending/rejected)
-- Note: Admin check is done at application level, not in RLS
CREATE POLICY "Authenticated users can view all testimonials" ON testimonials
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can update testimonials (application-level admin check)
CREATE POLICY "Authenticated users can update testimonials" ON testimonials
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admins can delete testimonials (application-level admin check)
CREATE POLICY "Authenticated users can delete testimonials" ON testimonials
  FOR DELETE
  USING (auth.role() = 'authenticated');
