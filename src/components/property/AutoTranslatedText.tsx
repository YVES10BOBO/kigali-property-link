"use client";

import { useEffect, useState } from 'react';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface AutoTranslatedTextProps {
  text: string;
  from?: 'en' | 'rw';
  className?: string;
  fallback?: string;
}

/**
 * Component that automatically translates text based on current language
 * Useful for property descriptions, blog content, etc.
 */
export default function AutoTranslatedText({
  text,
  from = 'en',
  className = '',
  fallback,
}: AutoTranslatedTextProps) {
  const { language } = useLanguage();
  const { translate, translating } = useAutoTranslate();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    if (from === language || !text.trim()) {
      setTranslatedText(text);
      return;
    }

    translate(text, from).then(setTranslatedText);
  }, [text, from, language, translate]);

  if (translating && translatedText === text) {
    return (
      <span className={className}>
        {fallback || text}
        <span className="text-xs text-gray-400 ml-2">
          <i className="fas fa-spinner fa-spin"></i>
        </span>
      </span>
    );
  }

  // Check if text contains HTML tags
  const hasHTML = /<[^>]+>/g.test(text);
  
  if (hasHTML) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: translatedText.replace(/\n/g, '<br />') }}
      />
    );
  }
  
  return <span className={className}>{translatedText}</span>;
}
