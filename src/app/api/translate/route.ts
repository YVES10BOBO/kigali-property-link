import { NextResponse } from 'next/server';

/**
 * Server-side translation API endpoint
 * Supports both Google Translate (paid) and LibreTranslate (free)
 * Automatically falls back to free option if Google API key not configured
 */
export async function POST(request: Request) {
  try {
    const { text, from = 'en', to } = await request.json();
    
    if (!text || !to) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }
    
    // Return original if same language
    if (from === to) {
      return NextResponse.json({ translatedText: text });
    }
    
    // Try Google Translate API first (if configured)
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (apiKey) {
      try {
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
          const translatedText = data.data.translations[0].translatedText;
          return NextResponse.json({ translatedText });
        }
      } catch (error) {
        console.error('Google Translate error:', error);
        // Fall through to LibreTranslate
      }
    }
    
    // Fallback to LibreTranslate (FREE, no API key needed)
    try {
      const libreTranslateUrl = process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';
      
      const response = await fetch(libreTranslateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: from === 'rw' ? 'rw' : 'en',
          target: to === 'rw' ? 'rw' : 'en',
          format: 'text',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const translatedText = data.translatedText;
        return NextResponse.json({ translatedText });
      }
    } catch (error) {
      console.error('LibreTranslate error:', error);
    }
    
    // Return original text if all translation methods fail
    return NextResponse.json({ translatedText: text });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
