# 🗄️ Database Setup Instructions

## Step 1: Run the SQL Migration

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

---

## Step 2: Verify Tables Were Created

1. Go to **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `properties`
   - ✅ `inquiries`
   - ✅ `users`
   - ✅ `commissions`

---

## Step 3: Set Up Environment Variables

1. In your project root, create a file called `.env.local`
2. Add these lines (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Where to find these:**
   - Go to Supabase Dashboard → Settings → API
   - Copy "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 4: Test the Connection

After setting up, we'll test by:
1. Adding a test property to the database
2. Querying it from your Next.js app
3. Making sure everything works

---

## Next Steps After Setup:

1. ✅ Insert sample properties into database
2. ✅ Connect homepage to fetch from Supabase
3. ✅ Connect contact forms to save inquiries
4. ✅ Build dashboard to view inquiries

---

**Ready?** Follow the steps above and let me know when you're done!

