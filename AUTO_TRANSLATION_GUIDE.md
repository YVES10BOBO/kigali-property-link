# Auto-Translation Implementation Guide

## ✅ What's Been Implemented

Auto-translation is now integrated into **all dynamic content** across your website:

### 1. **Property Cards** (`PropertyCard.tsx`)
- ✅ Property titles
- ✅ Property locations

### 2. **Property Detail Pages** (`PropertyDetail.tsx`)
- ✅ Property titles
- ✅ Property locations
- ✅ Property descriptions
- ✅ Amenities list

### 3. **Blog Posts** (`BlogPostClient.tsx`)
- ✅ Blog post titles
- ✅ Blog post content
- ✅ Blog post excerpts (in listing)

### 4. **Blog Listing** (`BlogPageClient.tsx`)
- ✅ Blog post titles
- ✅ Blog post excerpts

## How It Works

### Component: `AutoTranslatedText`

This component automatically translates any text based on the current language:

```tsx
import AutoTranslatedText from '@/components/property/AutoTranslatedText';

// Simple usage
<AutoTranslatedText text="Hello World" from="en" />

// With styling
<AutoTranslatedText 
  text={property.description} 
  from="en"
  className="text-lg"
/>
```

### Hook: `useAutoTranslate`

For more control, use the hook directly:

```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

function MyComponent() {
  const { translate, translating } = useAutoTranslate();
  const [translated, setTranslated] = useState('');
  
  useEffect(() => {
    translate(property.description).then(setTranslated);
  }, [property.description, translate]);
  
  return <p>{translating ? 'Translating...' : translated}</p>;
}
```

## Setup Instructions

### Step 1: Choose Translation API

**Option A: Google Translate (Recommended)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable "Cloud Translation API"
4. Create API key
5. Add to `.env.local`:
```env
GOOGLE_TRANSLATE_API_KEY=your-api-key-here
```

**Option B: LibreTranslate (Free)**
- No setup needed! Uses public API by default
- Or self-host for better performance:
```env
NEXT_PUBLIC_LIBRETRANSLATE_URL=http://localhost:5000/translate
```

### Step 2: Test It

1. Start your dev server: `npm run dev`
2. Navigate to a property page
3. Switch language using the EN/RW toggle
4. Watch the property description translate automatically!

## Where Auto-Translation is Used

### ✅ Already Implemented:

1. **Property Titles** - All property cards and detail pages
2. **Property Locations** - All property cards and detail pages
3. **Property Descriptions** - Property detail pages
4. **Property Amenities** - Property detail pages
5. **Blog Post Titles** - Blog listing and detail pages
6. **Blog Post Content** - Blog detail pages
7. **Blog Post Excerpts** - Blog listing page

### 🔄 How It Works:

1. **User switches language** → Language context updates
2. **Component detects language change** → `AutoTranslatedText` re-renders
3. **Translation API called** → Text translated (or from cache)
4. **Translated text displayed** → User sees content in their language

## Translation Caching

- Translations are cached in memory
- Same text won't be translated twice in the same session
- Cache clears on page refresh
- Reduces API calls and improves performance

## Performance Considerations

### Caching Strategy:
- ✅ Client-side cache (in-memory)
- ✅ Same text = instant display
- ✅ Batch translation support (for multiple texts)

### API Limits:
- **Google Translate**: ~$20 per million characters
- **LibreTranslate**: Free but may have rate limits
- **Recommendation**: Cache aggressively, translate on-demand

## Adding Auto-Translation to New Components

### Example 1: Simple Text
```tsx
import AutoTranslatedText from '@/components/property/AutoTranslatedText';

<p>
  <AutoTranslatedText text={dynamicContent} from="en" />
</p>
```

### Example 2: Multiple Texts
```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

function MyComponent({ items }) {
  const { translateBatch } = useAutoTranslate();
  const [translated, setTranslated] = useState([]);
  
  useEffect(() => {
    translateBatch(items.map(i => i.text)).then(setTranslated);
  }, [items, translateBatch]);
  
  return translated.map((text, i) => <p key={i}>{text}</p>);
}
```

### Example 3: With Loading State
```tsx
import AutoTranslatedText from '@/components/property/AutoTranslatedText';

<AutoTranslatedText 
  text={longDescription}
  from="en"
  fallback="Loading translation..."
/>
```

## Troubleshooting

### Translation Not Working?

1. **Check API Key**: Make sure `GOOGLE_TRANSLATE_API_KEY` is in `.env.local`
2. **Check Console**: Look for translation errors in browser console
3. **Fallback**: If API fails, original text is shown (no errors)
4. **Network**: Check if API endpoint is accessible

### Translation Slow?

1. **Use Caching**: Same text won't be translated twice
2. **Batch Requests**: Use `translateBatch` for multiple texts
3. **Pre-translate**: Consider pre-translating important content

### Want to Disable Auto-Translation?

Simply remove the `AutoTranslatedText` component and use the text directly:

```tsx
// Before (with auto-translation)
<AutoTranslatedText text={property.title} from="en" />

// After (no auto-translation)
{property.title}
```

## Best Practices

1. **Use Manual Translations for UI**: Buttons, labels, navigation
2. **Use Auto-Translation for Content**: Descriptions, blog posts, user content
3. **Cache Aggressively**: Don't translate the same text twice
4. **Handle Errors Gracefully**: Always show original text if translation fails
5. **Test Both Languages**: Make sure translations make sense

## Cost Estimation

For a property website with:
- 100 properties
- Average 500 words per description
- 50 blog posts
- Average 1000 words per post

**Total**: ~100,000 words
**Google Translate Cost**: ~$2 per full translation cycle
**Monthly**: Depends on traffic, but typically $5-20/month

## Next Steps

1. ✅ Add API key to `.env.local`
2. ✅ Test on a property page
3. ✅ Verify translations work
4. ✅ Monitor API usage
5. ✅ Adjust caching if needed

## Files Modified

- `src/components/property/PropertyCard.tsx` - Added auto-translation
- `src/components/property/PropertyDetail.tsx` - Added auto-translation
- `src/app/(main)/blog/[slug]/BlogPostClient.tsx` - Added auto-translation
- `src/app/(main)/blog/BlogPageClient.tsx` - Added auto-translation

## Files Created

- `src/lib/i18n/autoTranslate.ts` - Translation utilities
- `src/app/api/translate/route.ts` - Translation API endpoint
- `src/hooks/useAutoTranslate.ts` - React hook
- `src/components/property/AutoTranslatedText.tsx` - Auto-translate component

---

**Your website now automatically translates all dynamic content!** 🎉

Just add your API key and it's ready to go!
