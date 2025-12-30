-- ============================================
-- CREATE YOUR ADMIN PROFILE (AUTO VERSION)
-- ============================================
-- Run this WHOLE file in Supabase SQL Editor.
-- It will:
--  - Find your auth user by email
--  - Create a profile in public.users if missing
--  - Make you admin if you're the first user
--  - Otherwise make you agent
-- ============================================

-- Create or update your profile based on auth.users
INSERT INTO users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) AS name,
  CASE 
    WHEN (SELECT COUNT(*) FROM users) = 0 THEN 'admin'
    ELSE 'user'
  END AS role
FROM auth.users
WHERE email = 'yvesrutembeza@gmail.com'  -- Your email (already set)
ON CONFLICT (email) DO UPDATE
SET 
  name = EXCLUDED.name,
  role = CASE 
    WHEN (SELECT COUNT(*) FROM users WHERE email != EXCLUDED.email) = 0 
    THEN 'admin' 
    ELSE COALESCE(users.role, 'user')
  END;

-- ============================================
-- After running, check your profile:
-- ============================================
SELECT * FROM users WHERE email = 'yvesrutembeza@gmail.com';
-- You should see your profile with role = 'admin' (if you're the first user)
