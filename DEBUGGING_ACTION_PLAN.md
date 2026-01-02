# 🐛 Debugging Action Plan

## ✅ Step 1: Verify Provider Fixes (Just Fixed!)

**Status:** ✅ Fixed
- [x] LanguageProvider always provides context
- [x] ThemeProvider always provides context

**Action:** Refresh your browser and verify:
- [ ] No more "useLanguage must be used within a LanguageProvider" error
- [ ] No more "useTheme must be used within a ThemeProvider" error
- [ ] Language switcher works in navbar
- [ ] Theme toggle works in navbar

---

## 🗄️ Step 2: Run Database Migrations (REQUIRED)

### Migration 1: Blog Posts Table
**File:** `supabase/migrations/011_add_blog_posts_table.sql`

**Action:**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the entire content of `supabase/migrations/011_add_blog_posts_table.sql`
4. Paste and run it
5. Verify success ✅

**Status:** ⬜ Not Run / ✅ Complete

---

### Migration 2: Calendar Events Table
**File:** `supabase/migrations/012_add_calendar_events_table.sql`

**Action:**
1. In Supabase SQL Editor
2. Copy the entire content of `supabase/migrations/012_add_calendar_events_table.sql`
3. Paste and run it
4. Verify success ✅

**Status:** ⬜ Not Run / ✅ Complete

---

## 🧪 Step 3: Test Core Features

### 3.1 Test Language & Theme
- [ ] Visit homepage (`/`)
- [ ] Click **EN/RW** toggle → Should change language
- [ ] Click **🌙/☀️** toggle → Should change theme
- [ ] Refresh page → Preferences should persist
- [ ] Check browser console → No errors

### 3.2 Test Navigation
- [ ] Click all navbar links (Home, Properties, Services, Blog, About, Contact)
- [ ] Verify all pages load without errors
- [ ] Check language switcher on each page

### 3.3 Test Dashboard Access
- [ ] Go to `/dashboard` (login if needed)
- [ ] Verify sidebar menu loads
- [ ] Check language switcher in dashboard
- [ ] Verify all dashboard pages accessible

---

## 🆕 Step 4: Test New Features

### 4.1 Blog Management (After Migration 1)
- [ ] Go to `/dashboard/blog`
- [ ] Click "Add New Post"
- [ ] Create a test blog post:
  - Title: "Test Blog Post"
  - Slug: "test-blog-post"
  - Content: "This is a test"
  - Status: "Published"
- [ ] Save and verify it appears in list
- [ ] Visit `/blog` → Should see the post
- [ ] Click on post → Should view details

**Status:** ⬜ Not Tested / ✅ Working / ❌ Error

---

### 4.2 Calendar Integration (After Migration 2)
- [ ] Go to `/dashboard/calendar`
- [ ] Click "Add Event" or "New Event"
- [ ] Create a test event:
  - Title: "Test Viewing"
  - Date/Time: Tomorrow
  - Location: "Test Location"
- [ ] Save and verify it appears
- [ ] Go to `/dashboard/inquiries`
- [ ] Click "Schedule Viewing" on an inquiry
- [ ] Verify event is created

**Status:** ⬜ Not Tested / ✅ Working / ❌ Error

---

### 4.3 Auto-Translation
- [ ] Go to a property detail page (`/properties/[id]`)
- [ ] Switch language (EN ↔ RW)
- [ ] Check if property title/description translates
- [ ] Check browser console for translation errors

**Status:** ⬜ Not Tested / ✅ Working / ❌ Error

---

## 🔍 Step 5: Check for Errors

### 5.1 Build Check
```bash
npm run build
```
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Warnings are acceptable

### 5.2 Lint Check
```bash
npm run lint
```
- [ ] No critical linting errors
- [ ] Fix any easy warnings

### 5.3 Runtime Check
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab → No red errors
- [ ] Check Network tab → No failed requests
- [ ] Test all major pages

---

## 📋 Step 6: Report Issues

If you find any errors, note them here:

### Error 1:
- **Page:** 
- **Error Message:** 
- **Steps to Reproduce:** 
- **Screenshot/Console Log:** 

### Error 2:
- **Page:** 
- **Error Message:** 
- **Steps to Reproduce:** 
- **Screenshot/Console Log:** 

---

## 🎯 Quick Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npm run build

# Check for linting errors
npm run lint

# Check for type errors only
npx tsc --noEmit
```

---

## ✅ Completion Checklist

- [ ] Step 1: Provider fixes verified
- [ ] Step 2: Database migrations run
- [ ] Step 3: Core features tested
- [ ] Step 4: New features tested
- [ ] Step 5: Errors checked
- [ ] Step 6: Issues documented (if any)

---

## 🚀 Next Steps After Testing

Once everything is tested and working:
1. **Fix any bugs found**
2. **Optimize performance** (if needed)
3. **Add more features** (if desired)
4. **Prepare for deployment**

---

**Ready to start? Begin with Step 1 (refresh browser) and work through each step!** 🎯
