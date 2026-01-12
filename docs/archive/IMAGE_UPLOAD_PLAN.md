# 📸 Image Upload Implementation Plan

## 🎯 Goal

Replace URL input fields with **direct image upload** to Supabase Storage.

---

## 📦 Where Images Will Be Stored

### **Supabase Storage** (Recommended)

**Why Supabase Storage?**
- ✅ Already part of your Supabase project
- ✅ Free tier: 1GB storage
- ✅ Easy integration
- ✅ CDN included (fast image delivery)
- ✅ Secure (private/public buckets)
- ✅ No additional service needed

**Storage Structure:**
```
supabase-storage/
└── property-images/
    ├── property-{id}/
    │   ├── image-1.jpg
    │   ├── image-2.jpg
    │   └── image-3.jpg
    └── ...
```

---

## 🏗️ Implementation Steps

### **Step 1: Create Storage Bucket in Supabase**

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Click **"New bucket"**
4. Name: `property-images`
5. Settings:
   - ✅ Public bucket (so images can be viewed)
   - ✅ File size limit: 5MB (adjustable)
   - ✅ Allowed MIME types: `image/jpeg, image/png, image/webp`

---

### **Step 2: Update Database Schema (Optional)**

**Current:** `images TEXT[]` (stores URLs)

**Option A:** Keep as is (store Supabase Storage URLs)
- Images stored in: `https://{project}.supabase.co/storage/v1/object/public/property-images/...`
- No schema change needed!

**Option B:** Add storage paths (if you want to track storage paths separately)
- Add column: `image_paths TEXT[]`
- Keep `images` for public URLs

**Recommendation:** Option A (simpler, no changes needed)

---

### **Step 3: Create Upload API Route**

**File:** `src/app/api/upload/route.ts`

**Features:**
- Accept image file
- Upload to Supabase Storage
- Return public URL
- Validate file type & size
- Handle errors

---

### **Step 4: Update Add/Edit Property Forms**

**Changes Needed:**
- Replace URL input with file input
- Add drag & drop interface
- Show image preview
- Upload on file select
- Store returned URLs in database

**Files to Update:**
- `src/app/dashboard/properties/add/page.tsx`
- `src/app/dashboard/properties/edit/[id]/page.tsx`

---

### **Step 5: Image Upload Component**

**Create:** `src/components/forms/ImageUpload.tsx`

**Features:**
- Drag & drop
- Multiple file selection
- Image preview
- Progress indicator
- Remove images
- Validation (size, type)

---

## 📋 What Needs to Be Built

### **1. Storage Bucket Setup** (Manual - You do this)
- Create bucket in Supabase Dashboard
- Configure permissions

### **2. Upload API Route** (Code - I'll build)
- `src/app/api/upload/route.ts`
- Handles file upload to Supabase Storage

### **3. Image Upload Component** (Code - I'll build)
- `src/components/forms/ImageUpload.tsx`
- Reusable component for file uploads

### **4. Update Property Forms** (Code - I'll build)
- Replace URL inputs with file uploads
- Integrate ImageUpload component

### **5. Storage Policies** (SQL - I'll provide)
- RLS policies for storage access
- Public read access for images

---

## 🔒 Security Considerations

### **Storage Policies Needed:**

```sql
-- Allow public read access to property images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

---

## 💰 Storage Costs

**Supabase Free Tier:**
- 1GB storage included
- 2GB bandwidth/month
- Perfect for starting out!

**If you need more:**
- $0.021 per GB/month (storage)
- $0.09 per GB (bandwidth)

**Example:** 100 properties × 5 images × 500KB = ~250MB
- Well within free tier! ✅

---

## 🎨 User Experience

### **Before (Current):**
1. User finds image URL
2. Copies URL
3. Pastes into form
4. Repeats for each image

### **After (With Upload):**
1. User clicks "Upload Images"
2. Selects files from computer
3. Drags & drops images
4. Images upload automatically
5. Preview shown immediately

**Much easier!** 🎉

---

## 📝 Implementation Checklist

- [ ] Create `property-images` bucket in Supabase
- [ ] Set bucket to public
- [ ] Create upload API route
- [ ] Create ImageUpload component
- [ ] Update Add Property form
- [ ] Update Edit Property form
- [ ] Add storage policies (SQL)
- [ ] Test upload functionality
- [ ] Test image display
- [ ] Test image deletion

---

## 🚀 Ready to Build?

**I can build all the code parts for you!**

You just need to:
1. Create the storage bucket in Supabase (2 minutes)
2. Run the storage policies SQL (1 minute)

**Should I start building the image upload feature now?** 📸


