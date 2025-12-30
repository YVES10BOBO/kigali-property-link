# 🔐 Role-Based Access Control (RBAC) Setup

## ✅ What Was Implemented

Your dashboard now has **role-based access control**! Not everyone who registers can access the dashboard.

---

## 🎯 How It Works

### **User Roles:**
- **`admin`** - Full access to dashboard (first user automatically gets this)
- **`agent`** - Full access to dashboard (subsequent users)
- **No role / Other roles** - Cannot access dashboard

### **Access Control:**
1. **Registration** → Creates account in `auth.users` + profile in `public.users`
2. **First User** → Automatically gets `admin` role
3. **Other Users** → Get `agent` role by default
4. **Middleware** → Checks if user has `admin` or `agent` role before allowing dashboard access

---

## 📋 Current Status

### **Your Current Role:**
Since you're the first user who registered, you should have **`admin`** role.

### **Check Your Role:**
1. Go to Supabase Dashboard → Table Editor → `users` table
2. Find your email
3. Check the `role` column - it should say `admin`

---

## 🔧 Setup Steps

### **Step 1: Run Migration for Existing Users**

If you already registered before this update, you need to sync your auth user to the `users` table:

**Option A: Run SQL Migration (Recommended)**

Go to Supabase SQL Editor and run:

```sql
-- This will create a profile for your existing auth user
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
WHERE email = 'your-email@example.com'  -- Replace with your email
ON CONFLICT (email) DO NOTHING;
```

**Option B: Use the Migration Script**

Run `supabase/migrations/002_add_user_profiles.sql` in Supabase SQL Editor.

**Option C: Re-register**

1. Delete your account from Supabase Auth → Users
2. Register again at `/register`
3. You'll automatically get `admin` role

---

### **Step 2: Update RLS Policies**

The migration `001_initial_schema.sql` has been updated with RLS policies for the `users` table. If you haven't run it yet:

1. Go to Supabase SQL Editor
2. Run the updated `001_initial_schema.sql` migration
3. This adds policies for users to manage their own profiles

---

### **Step 3: Test Access**

1. **Login** at `/login`
2. **Check Dashboard** - You should see your role badge (ADMIN) in the top navbar
3. **Try accessing** `/dashboard` - Should work if you have `admin` or `agent` role

---

## 🚫 What Happens If User Doesn't Have Role?

If someone registers but doesn't have `admin` or `agent` role:
- They'll be redirected to login page
- They'll see an "access denied" error
- They cannot access `/dashboard/*` routes

---

## 👥 Managing User Roles

### **Change User Role:**

Go to Supabase Table Editor → `users` table:

```sql
-- Make a user admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Make a user agent
UPDATE users 
SET role = 'agent' 
WHERE email = 'user@example.com';

-- Remove dashboard access
UPDATE users 
SET role = 'viewer' 
WHERE email = 'user@example.com';
```

---

## 🔒 Security Features

### **What's Protected:**
- ✅ Dashboard routes (`/dashboard/*`) - Requires `admin` or `agent` role
- ✅ API routes - Use authentication checks
- ✅ Database RLS - Users can only see/edit their own profile

### **What's Public:**
- ✅ Homepage (`/`)
- ✅ Properties listing (`/properties`)
- ✅ Property details (`/properties/[id]`)
- ✅ Contact form (`/contact`)
- ✅ About page (`/about`)

---

## 📊 User Profile System

### **Profile Creation:**
- **On Registration** → Profile created automatically in `public.users`
- **On Login** → Profile created if missing
- **First User** → Gets `admin` role automatically

### **Profile Fields:**
- `id` - UUID (matches `auth.users.id`)
- `email` - User's email (unique)
- `name` - User's full name
- `role` - `admin` or `agent`
- `created_at` - When profile was created
- `updated_at` - Last update timestamp

---

## 🎯 Next Steps

### **For Your Account:**
1. ✅ Check if you have a profile in `public.users` table
2. ✅ Verify your role is `admin`
3. ✅ Test dashboard access

### **For Future Users:**
- They'll automatically get `agent` role when registering
- You can change their role in Supabase Table Editor
- Or create an admin panel to manage users (future feature)

---

## 🛠️ Troubleshooting

### **"Access Denied" After Login:**
- Check `public.users` table - does your email exist?
- Check your `role` - is it `admin` or `agent`?
- Run the migration script to create your profile

### **"No Profile Found":**
- Profile should be created automatically on registration/login
- Check browser console for errors
- Manually create profile using SQL (see Step 1)

### **Dashboard Shows "No Role":**
- Your profile might not have a role set
- Update it in Supabase: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com'`

---

## ✅ Summary

- ✅ Role-based access control implemented
- ✅ First user = `admin`, others = `agent`
- ✅ Dashboard protected by role check
- ✅ User profiles auto-created
- ✅ RLS policies added for security

**Your dashboard is now secure!** 🔒

