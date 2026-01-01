"use client";

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { Language } from '@/lib/i18n/translations';

/**
 * Hook for auto-translating dynamic content
 * Uses the translation API endpoint
 */
export function useAutoTranslate() {
  const { language } = useLanguage();
  const [translating, setTranslating] = useState(false);
  const [cache, setCache] = useState<Map<string, string>>(new Map());

  const translate = useCallback(
    async (text: string, from: Language = 'en'): Promise<string> => {
      // Return original if same language or empty
      if (from === language || !text.trim()) return text;
      
      // Check cache
      const cacheKey = `${from}-${language}-${text}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }
      
      try {
        setTranslating(true);
        
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            from,
            to: language,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Translation failed');
        }
        
        const { translatedText } = await response.json();
        
        // Cache the translation
        setCache(prev => new Map(prev).set(cacheKey, translatedText));
        
        return translatedText;
      } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original on error
      } finally {
        setTranslating(false);
      }
    },
    [language, cache]
  );

  const translateBatch = useCallback(
    async (texts: string[], from: Language = 'en'): Promise<string[]> => {
      if (from === language) return texts;
      
      try {
        setTranslating(true);
        
        // Translate all at once
        const translations = await Promise.all(
          texts.map(text => translate(text, from))
        );
        
        return translations;
      } catch (error) {
        console.error('Batch translation error:', error);
        return texts;
      } finally {
        setTranslating(false);
      }
    },
    [language, translate]
  );

  return {
    translate,
    translateBatch,
    translating,
    clearCache: () => setCache(new Map()),
  };
}
