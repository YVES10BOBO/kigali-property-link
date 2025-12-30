-- Fix infinite recursion in users table RLS policy
-- The "Admins can view all users" policy was querying the users table itself,
-- causing infinite recursion. 
-- 
-- Solution: Remove the admin policy since admin access is handled in application code.
-- The API routes already check for admin role, so we don't need RLS for this.
-- Users can still view their own profile via the existing policy.

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Drop the function if it exists (we won't need it)
DROP FUNCTION IF EXISTS is_admin();

-- Ensure users can view their own profile (this doesn't cause recursion)
-- This is the main use case - users viewing their own data
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Note: Admin access to view all users is handled in application code (API routes),
-- not through RLS policies. This avoids the recursion issue entirely.
