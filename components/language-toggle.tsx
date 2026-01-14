'use client';

import * as React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '@/components/language-provider';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className="size-9 rounded-md border border-stone-200 dark:border-stone-800 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center text-sm font-medium"
      aria-label="Toggle language"
    >
      {language === 'en' ? 'CN' : 'EN'}
    </button>
  );
}
