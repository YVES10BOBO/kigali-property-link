/**
 * Auto-translation utility using Google Translate API
 * 
 * To use this, you need to:
 * 1. Get a Google Cloud API key with Translation API enabled
 * 2. Add GOOGLE_TRANSLATE_API_KEY to your .env.local
 * 
 * Alternative: Use a free service like LibreTranslate or MyMemory
 */

type Language = 'en' | 'rw';

interface TranslateOptions {
  text: string;
  from?: Language;
  to: Language;
}

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

/**
 * Translate text using Google Translate API
 */
export async function translateText({ text, from = 'en', to }: TranslateOptions): Promise<string> {
  // Return original if same language
  if (from === to) return text;
  
  // Check cache
  const cacheKey = `${from}-${to}-${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    // Option 1: Google Translate API (requires API key)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    
    if (apiKey) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: from === 'rw' ? 'rw' : 'en',
            target: to === 'rw' ? 'rw' : 'en',
            format: 'text',
          }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const translated = data.data.translations[0].translatedText;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
    
    // Option 2: LibreTranslate (free, self-hosted or public API)
    const libreTranslateUrl = process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';
    
    const libreResponse = await fetch(libreTranslateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: from === 'rw' ? 'rw' : 'en',
        target: to === 'rw' ? 'rw' : 'en',
        format: 'text',
      }),
    });
    
    if (libreResponse.ok) {
      const data = await libreResponse.json();
      const translated = data.translatedText;
      translationCache.set(cacheKey, translated);
      return translated;
    }
    
    // Fallback: Return original text if translation fails
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original on error
  }
}

/**
 * Translate multiple texts at once (more efficient)
 */
export async function translateBatch(
  texts: string[],
  from: Language = 'en',
  to: Language
): Promise<string[]> {
  if (from === to) return texts;
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    
    if (apiKey) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: texts,
            source: from === 'rw' ? 'rw' : 'en',
            target: to === 'rw' ? 'rw' : 'en',
            format: 'text',
          }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.data.translations.map((t: any) => t.translatedText);
      }
    }
    
    // Fallback: Translate one by one
    return Promise.all(texts.map(text => translateText({ text, from, to })));
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}
