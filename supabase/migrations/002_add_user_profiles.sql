-- Migration to ensure existing auth users have profiles
-- Run this manually in Supabase SQL Editor for each existing user

-- For your existing user (replace with your email):
-- This will create a profile with admin role if you're the first user

-- Check if you're the first user
DO $$
DECLARE
  user_count INTEGER;
  user_email TEXT := 'your-email@example.com'; -- REPLACE WITH YOUR EMAIL
  user_id UUID;
  user_name TEXT;
BEGIN
  -- Get count of existing users
  SELECT COUNT(*) INTO user_count FROM users;
  
  -- Get user info from auth.users (you need to know your email)
  -- Since we can't directly query auth.users easily, we'll use a manual approach
  
  -- If no users exist, create admin profile
  -- If users exist, create agent profile
  
  -- Note: You need to manually insert your profile:
  -- 1. Get your user ID from Supabase Auth → Users
  -- 2. Run the INSERT statement below with your details
END $$;

-- Manual insert for existing user (REPLACE VALUES):
-- Replace 'your-user-id-from-auth' with your auth.users.id
-- Replace 'your-email@example.com' with your email
-- Replace 'Your Name' with your name

INSERT INTO users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
  CASE 
    WHEN (SELECT COUNT(*) FROM users) = 0 THEN 'admin'
    ELSE 'agent'
  END as role
FROM auth.users
WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
ON CONFLICT (email) DO UPDATE
SET role = CASE 
  WHEN (SELECT COUNT(*) FROM users WHERE email != 'your-email@example.com') = 0 
  THEN 'admin' 
  ELSE users.role 
END;

