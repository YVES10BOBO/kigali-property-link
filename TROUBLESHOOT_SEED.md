# 🔧 Troubleshooting Seed Data

## Issue: "No rows returned" when running seed.sql

This is actually **normal**! INSERT statements don't return rows unless you use `RETURNING`.

## ✅ How to Verify Data Was Inserted

1. **Check the Table Editor:**
   - Go to Supabase Dashboard → **Table Editor**
   - Click on **"properties"** table
   - You should see 6 properties listed!

2. **Or Run This Query:**
   ```sql
   SELECT COUNT(*) FROM properties;
   ```
   Should return: `6`

3. **Or See All Properties:**
   ```sql
   SELECT id, title, price, price_type FROM properties;
   ```

---

## 🐛 If No Data Appears

### Check 1: Tables Exist
Run this to verify tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `properties`, `inquiries`, `users`, `commissions`

### Check 2: Run Migration First
If tables don't exist, run `001_initial_schema.sql` first!

### Check 3: Check for Errors
Look at the error message in Supabase. Common issues:
- **Constraint violation** - Check that values match the schema
- **Column doesn't exist** - Make sure migration ran successfully
- **Data type mismatch** - Verify price is a number, booleans are true/false

---

## 🧪 Test with Single Insert

Try inserting one property first:

```sql
INSERT INTO properties (title, description, price, price_type, location, bedrooms, bathrooms, area, furnished, parking, security, generator, amenities, status, images) 
VALUES (
  'Test Property',
  'This is a test property',
  500,
  'rent',
  'Kigali',
  2,
  1,
  100,
  true,
  true,
  true,
  false,
  ARRAY['Test'],
  'available',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']
) RETURNING *;
```

If this works, the full seed.sql should work too!

---

## ✅ Success Indicators

After running seed.sql, you should:
1. See "Success. No rows returned" (this is OK!)
2. Go to Table Editor → properties → See 6 rows
3. Visit your website → See properties displayed

---

**The most important thing: Check the Table Editor to see if data is there!**

