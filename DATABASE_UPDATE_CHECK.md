# 🔍 Database Update Check

## ✅ Current Schema Status

Your `001_initial_schema.sql` file **already includes** the `'user'` role:

```sql
-- Line 49 in 001_initial_schema.sql
role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user'))
```

This means:
- ✅ The schema definition is **correct**
- ✅ New databases created with this migration will have `'user'` role support
- ✅ Default role for new users is `'user'`

---

## 🔧 Do You Need to Update Your Database?

### **Option 1: Check Your Current Database**

Run this query in Supabase SQL Editor to check if your constraint includes `'user'`:

```sql
SELECT con.conname, pg_get_constraintdef(con.oid) 
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'users' AND con.contype = 'c';
```

**Expected output:**
```
conname              | pg_get_constraintdef
---------------------|--------------------------------------------------
users_role_check     | CHECK ((role = ANY (ARRAY['admin'::text, 'agent'::text, 'user'::text])))
```

If you see `'user'` in the array → **✅ No update needed!**

If you DON'T see `'user'` → **Run the migration below**

---

### **Option 2: Safe Migration (Run This If Needed)**

If your database was created **before** the `'user'` role was added, run:

**File:** `supabase/migrations/003_ensure_user_role.sql`

This script:
- ✅ Safely updates the constraint to include `'user'`
- ✅ Sets default role to `'user'`
- ✅ Is **idempotent** (safe to run multiple times)

**How to run:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/003_ensure_user_role.sql`
3. Paste and run
4. Verify with the check query above

---

## 📊 Summary

| Item | Status | Action Needed |
|------|--------|---------------|
| Schema file | ✅ Correct | None |
| Database constraint | ⚠️ Check | Run check query above |
| Migration script | ✅ Created | Run if constraint missing `'user'` |

---

## 🎯 Next Steps

1. **Check your database** with the query above
2. **If needed**, run `003_ensure_user_role.sql`
3. **Test** by registering a new user (should get `role = 'user'` by default)

---

**Note:** Even if you don't run the migration, the code will still work because:
- New users created via `/register` will automatically get `role = 'user'` (handled in code)
- The API checks for role existence before assigning defaults

