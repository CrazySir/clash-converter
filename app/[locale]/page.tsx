import { Converter } from '@/components/converter';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Info, Download } from 'lucide-react';
import { JSONLDStructuredData } from '@/components/seo/seo-head';
import { locales } from '@/i18n';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale and set request locale for next-intl
  if (!locales.includes(locale as any)) {
    return <div>Unsupported locale</div>;
  }

  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Simplified Background - Stitch-inspired radial gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="blob w-[500px] h-[500px] bg-primary/10 top-[-100px] left-[-100px]" />
        <div className="blob w-[400px] h-[400px] bg-primary/10 bottom-[10%] right-[10%]" />
        <div className="blob w-[300px] h-[300px] bg-primary/10 top-[40%] left-[20%]" />
      </div>

      {/* Simplified Header - neo-card style */}
      <header className="sticky top-0 z-50 w-full neo-card border-0 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:max-w-6xl">
          <div className="flex items-center gap-2">
            <Image
              src="/clash_converter_linear.svg"
              alt="ClashConverter"
              width={180}
              height={60}
              className="max-w-[140px] md:max-w-none hover:opacity-80 transition-opacity duration-300"
            />
          </div>
          <nav className="flex items-center gap-2 md:gap-3" aria-label="Main navigation">
            <Link href="/resources">
              <button
                className="neo-button group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 min-h-[44px] rounded-full"
                aria-label={t('resources.menuTitle')}
              >
                <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">{t('resources.menuTitle')}</span>
              </button>
            </Link>
            <Link href="/about">
              <button
                className="neo-button group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 min-h-[44px] rounded-full"
                aria-label={t('about')}
              >
                <Info className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">{t('about')}</span>
              </button>
            </Link>
            <div className="w-px h-5 bg-border mx-1 hidden sm:block" aria-hidden="true" />
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-0">
        <Converter />
        <JSONLDStructuredData locale={locale} type="all" pageType="home" />
      </main>
    </div>
  );
}
