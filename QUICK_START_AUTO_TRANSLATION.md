# Quick Start: Auto-Translation Setup

## 🚀 3-Step Setup

### Step 1: Get API Key (Choose One)

**Option A: Google Translate (Recommended)**
1. Visit: https://console.cloud.google.com/
2. Create project → Enable "Cloud Translation API"
3. Create API key
4. Copy the key

**Option B: LibreTranslate (Free)**
- No API key needed! Works out of the box.

### Step 2: Add to Environment

Create/update `.env.local`:

```env
# For Google Translate (Option A)
GOOGLE_TRANSLATE_API_KEY=your-api-key-here

# OR for LibreTranslate (Option B - optional)
# NEXT_PUBLIC_LIBRETRANSLATE_URL=https://libretranslate.com/translate
```

### Step 3: Test It!

1. Start dev server: `npm run dev`
2. Go to any property page
3. Click EN/RW toggle in navbar
4. Watch content translate! ✨

## ✅ What's Already Translated

- ✅ Property titles
- ✅ Property locations  
- ✅ Property descriptions
- ✅ Property amenities
- ✅ Blog post titles
- ✅ Blog post content
- ✅ Blog post excerpts

## 💡 How It Works

1. User switches language (EN ↔ RW)
2. `AutoTranslatedText` component detects change
3. Calls translation API (or uses cache)
4. Displays translated content

## 🎯 That's It!

Your website now auto-translates all dynamic content. No manual translation needed!

---

**Need help?** Check `AUTO_TRANSLATION_GUIDE.md` for detailed documentation.
