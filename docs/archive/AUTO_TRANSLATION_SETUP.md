# Auto-Translation Setup Guide

## Overview

This guide explains how to set up automatic translation for dynamic content (property descriptions, blog posts, etc.) using translation APIs.

## Current Implementation

### Manual Translations (Current)
- ✅ **No API needed** - Translations are pre-written
- ✅ **Fast** - No API calls
- ✅ **Accurate** - Human-reviewed translations
- ❌ **Requires maintenance** - Need to add translations manually

### Auto-Translation (Optional)
- ✅ **Automatic** - Translates dynamic content on-the-fly
- ✅ **No manual work** - Works for any text
- ❌ **Requires API key** - Needs Google Translate API or similar
- ❌ **Cost** - API calls may have costs
- ❌ **Less accurate** - Machine translation quality

## Setup Options

### Option 1: Google Translate API (Recommended for Production)

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing
   - Enable "Cloud Translation API"
   - Create credentials (API Key)
   - Copy the API key

2. **Add to Environment:**
   ```env
   # .env.local
   GOOGLE_TRANSLATE_API_KEY=your-api-key-here
   ```

3. **Cost:** ~$20 per million characters

### Option 2: LibreTranslate (Free Alternative)

1. **Use Public API:**
   - No API key needed
   - Uses public LibreTranslate instance
   - Free but may be slower

2. **Or Self-Host:**
   ```bash
   docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
   ```

3. **Add to Environment:**
   ```env
   # .env.local (optional, uses public by default)
   NEXT_PUBLIC_LIBRETRANSLATE_URL=http://localhost:5000/translate
   ```

### Option 3: MyMemory Translation API (Free Tier)

1. **Sign up:** https://mymemory.translated.net/
2. **Get API key** (free tier: 10,000 words/day)
3. **Add to environment:**
   ```env
   MYMEMORY_API_KEY=your-key-here
   ```

## Usage

### For Static Content (Current - Recommended)
Use manual translations in `src/lib/i18n/translations.ts`:
```typescript
const { t } = useLanguage();
<h1>{t.home.hero.title}</h1>
```

### For Dynamic Content (Auto-Translation)
Use the `AutoTranslatedText` component:
```tsx
import AutoTranslatedText from '@/components/property/AutoTranslatedText';

<AutoTranslatedText 
  text={property.description} 
  from="en"
/>
```

Or use the hook:
```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

const { translate } = useAutoTranslate();
const translated = await translate(property.description);
```

## Recommendation

**For your use case, I recommend:**

1. **Keep manual translations** for:
   - UI elements (buttons, labels, navigation)
   - Common phrases
   - Homepage content

2. **Use auto-translation** for:
   - Property descriptions (from database)
   - Blog post content
   - User-generated content

3. **Hybrid approach:**
   - Pre-translate important content manually
   - Use auto-translation as fallback for dynamic content

## Files Created

- `src/lib/i18n/autoTranslate.ts` - Translation utility functions
- `src/app/api/translate/route.ts` - Server-side translation API
- `src/hooks/useAutoTranslate.ts` - React hook for translations
- `src/components/property/AutoTranslatedText.tsx` - Auto-translate component

## Testing

1. **Without API Key:**
   - Auto-translation will return original text
   - Manual translations still work

2. **With API Key:**
   - Test with a property description
   - Switch language and see auto-translation

## Cost Considerations

- **Google Translate:** ~$20 per million characters
- **LibreTranslate:** Free (self-hosted) or public API
- **MyMemory:** Free tier available

For a property website, you might translate:
- Property descriptions: ~500 words each
- 100 properties = 50,000 words
- Cost: ~$1 per full translation cycle

## Next Steps

1. **If you want auto-translation:**
   - Choose an API provider
   - Add API key to `.env.local`
   - Start using `AutoTranslatedText` component

2. **If you prefer manual:**
   - Keep current setup (no changes needed)
   - Add more translations to `translations.ts` as needed

## Questions?

- **Do I need this?** Only if you have lots of dynamic content
- **Is it free?** LibreTranslate is free, Google Translate has costs
- **Is it accurate?** Manual translations are more accurate, but auto-translation is good for dynamic content
