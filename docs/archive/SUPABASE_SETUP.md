# 🗄️ Supabase Setup Guide

## Step 1: Create Supabase Account & Project

1. Go to: **https://supabase.com**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (easiest) or email
4. Click **"New Project"**
5. Fill in:
   - **Organization:** Create new or use existing
   - **Project Name:** `kigali-property-link`
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to Rwanda (or default)
   - **Pricing Plan:** Free tier is fine to start
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your Credentials

Once project is ready:

1. Go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL** (something like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (keep this secret!)

3. **Copy these** - you'll need them!

---

## Step 3: Create Database Tables

We need to create these tables:
- `properties` - Store property listings
- `inquiries` - Store contact/inquiry forms
- `users` - Store agent/admin users (optional for now)

---

## Step 4: Set Up Environment Variables

Create `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Next Steps After Setup:

1. ✅ Create database schema
2. ✅ Connect forms to save data
3. ✅ Replace mock data with real queries
4. ✅ Set up email notifications

---

**Ready to start?** 

1. First, create your Supabase account and project
2. Get your credentials
3. Then tell me and I'll help you set up the database schema!


