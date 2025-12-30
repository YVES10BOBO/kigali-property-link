# 📸 Cloudinary Image Upload Setup

## ✅ Image Upload Feature Implemented!

The image upload feature is now built and ready to use. You just need to configure Cloudinary.

---

## 🚀 Setup Instructions

### **Step 1: Sign Up for Cloudinary**

1. Go to https://cloudinary.com
2. Click **"Sign Up Free"**
3. Create your account (free tier includes 25GB storage + 25GB bandwidth/month)

---

### **Step 2: Get Your API Credentials**

1. After signing up, you'll be taken to your dashboard
2. On the dashboard, you'll see:
   - **Cloud Name** (e.g., `dxyz12345`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

3. Copy these three values

---

### **Step 3: Add to Environment Variables**

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

### **Step 4: Restart Your Dev Server**

After adding the environment variables:

1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. The image upload will now work!

---

## 🎯 How It Works

### **Upload Process:**
1. User selects images (or drags & drops)
2. Images are uploaded to Cloudinary
3. Cloudinary automatically optimizes images
4. Returns optimized URLs
5. URLs are saved to your database

### **Features:**
- ✅ Drag & drop interface
- ✅ Multiple image upload
- ✅ Automatic image optimization
- ✅ Image preview
- ✅ Remove images
- ✅ Max 10 images per property
- ✅ Max 5MB per image
- ✅ Supports JPEG, PNG, WebP

---

## 📋 What's Been Built

### **1. Upload API Route** ✅
- **File:** `src/app/api/upload/route.ts`
- Handles file uploads to Cloudinary
- Validates file type and size
- Returns optimized image URLs

### **2. Image Upload Component** ✅
- **File:** `src/components/forms/ImageUpload.tsx`
- Drag & drop interface
- Image preview
- Upload progress
- Remove images

### **3. Updated Property Forms** ✅
- **Files:**
  - `src/app/dashboard/properties/add/page.tsx`
  - `src/app/dashboard/properties/edit/[id]/page.tsx`
- Replaced URL inputs with file uploads
- Integrated ImageUpload component

---

## 🧪 Testing

1. **Go to:** `/dashboard/properties/add`
2. **Scroll to:** "Property Images" section
3. **Click** the upload area or drag & drop images
4. **Select** images from your computer
5. **Wait** for upload (you'll see progress)
6. **See** image previews
7. **Submit** the form
8. **Check** your property - images should be there!

---

## 🔒 Security

- ✅ File type validation (only images)
- ✅ File size validation (max 5MB)
- ✅ Images stored securely in Cloudinary
- ✅ Automatic optimization
- ✅ CDN delivery (fast loading)

---

## 💰 Free Tier Limits

**Cloudinary Free Tier:**
- ✅ 25GB storage
- ✅ 25GB bandwidth/month
- ✅ Unlimited transformations
- ✅ Perfect for starting out!

**If you need more:**
- $89/month for next tier
- But free tier is generous for most use cases

---

## 🎨 Image Optimization

Cloudinary automatically:
- ✅ Optimizes image quality
- ✅ Converts to best format (WebP for modern browsers)
- ✅ Reduces file size
- ✅ Speeds up page loads

**Result:** Faster website, better user experience! 🚀

---

## 🔧 Troubleshooting

### **"Failed to upload image"**
- Check that Cloudinary credentials are in `.env.local`
- Restart dev server after adding credentials
- Check file size (must be under 5MB)
- Check file type (only JPEG, PNG, WebP)

### **"Invalid file type"**
- Only image files are allowed
- Supported: JPEG, JPG, PNG, WebP
- Convert other formats first

### **"File size too large"**
- Maximum file size: 5MB
- Compress images before uploading
- Or use Cloudinary's optimization (automatic)

---

## ✅ Status

- ✅ Upload API route created
- ✅ ImageUpload component created
- ✅ Add Property form updated
- ✅ Edit Property form updated
- ⏳ Waiting for you to add Cloudinary credentials

**Once you add the Cloudinary credentials, image upload will work!** 🎉

---

## 📝 Next Steps

1. Sign up for Cloudinary (free)
2. Get your API credentials
3. Add to `.env.local`
4. Restart dev server
5. Test image upload!

**That's it!** Your image upload feature is ready! 📸


