import { Converter } from '@/components/converter';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Info, Download } from 'lucide-react';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur supports-[backdrop-filter]:bg-stone-50/60 dark:border-stone-800 dark:bg-stone-950/80 dark:supports-[backdrop-filter]:bg-stone-950/60">
        <div className="mx-auto flex h-14 items-center justify-between px-4 md:px-8 lg:max-w-6xl">
          <div className="flex items-center gap-2">
            <Image src="/clash_converter_linear.svg" alt="ClashConverter" width={180} height={60} />
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Link href="/resources">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors rounded-md hover:bg-stone-100 dark:hover:bg-stone-800">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('resources.menuTitle')}</span>
              </button>
            </Link>
            <Link href="/about">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors rounded-md hover:bg-stone-100 dark:hover:bg-stone-800">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">{t('about')}</span>
              </button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div id="converter">
        <Converter />
      </div>
    </div>
  );
}
