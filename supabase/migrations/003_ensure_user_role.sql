-- Migration to ensure 'user' role is available in the users table
-- This is safe to run multiple times (idempotent)

-- Check if the constraint already allows 'user' role
-- If your database was created before the 'user' role was added, this will update it

-- First, let's check the current constraint (you can run this to see):
-- SELECT con.conname, pg_get_constraintdef(con.oid) 
-- FROM pg_constraint con
-- JOIN pg_class rel ON rel.oid = con.conrelid
-- WHERE rel.relname = 'users' AND con.contype = 'c';

-- Drop the old constraint if it exists (without 'user')
DO $$
BEGIN
  -- Try to drop constraint that doesn't include 'user'
  -- We'll recreate it with 'user' included
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'users'::regclass 
    AND conname LIKE '%role%'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  END IF;
END $$;

-- Recreate the constraint with 'user' role included
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'agent', 'user'));

-- Update default to 'user' if it's not already set
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- Verify the constraint (run this to check):
-- SELECT con.conname, pg_get_constraintdef(con.oid) 
-- FROM pg_constraint con
-- JOIN pg_class rel ON rel.oid = con.conrelid
-- WHERE rel.relname = 'users' AND con.contype = 'c';

