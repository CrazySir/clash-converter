"use client"
import { useTranslations } from 'next-intl';
import { Mail, Github, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'clashconverter@gmail.com';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();
  const [showEmail, setShowEmail] = useState(false);

  return (
    <footer className="w-full py-8 md:py-12 bg-neo-card/50 dark:bg-neo-card-dark/50 backdrop-blur-sm border-t border-neo-border dark:border-neo-border-dark">
      <div className="mx-auto max-w-6xl px-4 md:px-8">

        {/* Main Footer Content - Clean horizontal layout */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-3">
            {/* Brand */}
            <span className="neo-label text-neo-muted dark:text-neo-muted-light tracking-wide">
              CLASH CONVERTER
            </span>

            {/* Copyright */}
            <p className="text-sm text-neo-muted dark:text-neo-muted-light font-medium">
              © {currentYear} {t('rights')}
            </p>
          </div>

          {/* Center: Description (hidden on small mobile) */}
          <div className="hidden md:block flex-1 max-w-md">
            <p className="text-xs text-neo-muted/80 dark:text-neo-muted-light/80 text-center leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Email Button */}
            <button
              onClick={() => setShowEmail(true)}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-neo-muted dark:text-neo-muted-light hover:text-neo-foreground dark:hover:text-white transition-all duration-200 border border-neo-border dark:border-neo-border-dark hover:border-neo-foreground/30 dark:hover:border-white/30 rounded-md"
              type="button"
              aria-label={showEmail ? 'Hide contact email' : 'Show contact email'}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showEmail ? CONTACT_EMAIL : t('contact')}
              </span>
            </button>

            {/* GitHub Button */}
            <a
              href="https://github.com/sunway910/clashconverter"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-neo-muted dark:text-neo-muted-light hover:text-neo-foreground dark:hover:text-white transition-all duration-200 border border-neo-border dark:border-neo-border-dark hover:border-neo-foreground/30 dark:hover:border-white/30 rounded-md"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
          </div>
        </div>

        {/* Bottom Bar - Structural divider with status */}
        <div className="mt-8 pt-6 border-t border-neo-border dark:border-neo-border-dark">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neo-success animate-pulse" />
              <span className="neo-label text-[10px] text-neo-muted/70 dark:text-neo-muted-light/70 tracking-wider">
                SYSTEM OPERATIONAL
              </span>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-neo-muted/70 dark:text-neo-muted-light/70 font-medium">
                Built with Next.js 16
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
