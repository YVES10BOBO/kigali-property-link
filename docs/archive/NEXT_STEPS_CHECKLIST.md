# ✅ Next Steps Checklist - Before Debugging

## 🗄️ Database Migrations (Required)

Run these SQL migrations in your Supabase SQL Editor:

### 1. Blog Posts Table
```sql
-- Run: supabase/migrations/011_add_blog_posts_table.sql
```
**Status:** ⬜ Not Run / ✅ Complete

### 2. Calendar Events Table
```sql
-- Run: supabase/migrations/012_add_calendar_events_table.sql
```
**Status:** ⬜ Not Run / ✅ Complete

---

## 🔧 Environment Setup (Optional but Recommended)

### 1. Translation API (Optional - Works without it)
```env
# .env.local
# Option A: Google Translate (better quality)
GOOGLE_TRANSLATE_API_KEY=your-key-here

# Option B: LibreTranslate (free, no key needed)
# NEXT_PUBLIC_LIBRETRANSLATE_URL=https://libretranslate.com/translate
```
**Status:** ⬜ Not Set / ✅ Complete

**Note:** Auto-translation works with LibreTranslate by default (no setup needed)

---

## 🧪 Testing Checklist

### 1. Test Multi-Language Support
- [ ] Visit homepage
- [ ] Click EN/RW toggle in navbar
- [ ] Verify navigation menu changes language
- [ ] Verify homepage content changes language
- [ ] Check if language preference is saved (refresh page)

### 2. Test Auto-Translation (if API configured)
- [ ] Go to a property detail page
- [ ] Switch language (EN ↔ RW)
- [ ] Verify property title translates
- [ ] Verify property description translates
- [ ] Verify location translates

### 3. Test Blog Management
- [ ] Go to `/dashboard/blog`
- [ ] Create a new blog post
- [ ] Publish the blog post
- [ ] Visit `/blog` and see the post
- [ ] Click on blog post and view details

### 4. Test Calendar Integration
- [ ] Go to `/dashboard/calendar`
- [ ] Create a new event
- [ ] Go to `/dashboard/inquiries`
- [ ] Click "Schedule Viewing" on an inquiry
- [ ] Verify event appears in calendar

### 5. Test Dashboard Translations
- [ ] Go to `/dashboard`
- [ ] Switch language (EN ↔ RW)
- [ ] Verify sidebar menu items translate
- [ ] Check all dashboard pages

---

## 🐛 Common Issues to Check

### 1. Language Switcher Not Working
- Check if `LanguageProvider` is in `src/app/layout.tsx`
- Check browser console for errors
- Verify `LanguageSwitcher` is in Navbar

### 2. Auto-Translation Not Working
- Check browser console for API errors
- Verify translation API endpoint is accessible
- Check if API key is set (if using Google Translate)
- Try LibreTranslate (works without API key)

### 3. Dashboard Errors
- Check if all imports are correct
- Verify `useLanguage` is imported where used
- Check for missing dependencies

### 4. Database Errors
- Verify migrations are run
- Check Supabase connection
- Verify RLS policies are correct

---

## 📋 Quick Test Commands

```bash
# 1. Start dev server
npm run dev

# 2. Check for TypeScript errors
npm run build

# 3. Check for linting errors
npm run lint
```

---

## 🎯 Priority Order

1. **Run Database Migrations** (Required)
   - Blog posts table
   - Calendar events table

2. **Test Basic Functionality**
   - Language switcher
   - Navigation
   - Dashboard access

3. **Test New Features**
   - Blog management
   - Calendar integration
   - Auto-translation

4. **Fix Any Issues**
   - Debug errors
   - Fix missing imports
   - Test edge cases

---

## 📝 What We've Built Today

✅ **Blog Management System**
- Database table
- Admin dashboard
- Public blog pages
- CRUD operations

✅ **Calendar Integration**
- Database table
- Calendar dashboard
- Inquiry integration
- Event management

✅ **Multi-Language Support**
- English/Kinyarwanda
- Language switcher
- Manual translations
- Auto-translation ready

✅ **Design Improvements**
- Dark mode toggle
- Theme provider

---

## 🚀 Ready to Test?

1. **First:** Run database migrations
2. **Then:** Test language switcher
3. **Next:** Test blog & calendar features
4. **Finally:** Debug any issues

---

**Let me know when you're ready to test, and I'll help debug any issues!** 🐛
