"use client"
import { useTranslations } from 'next-intl';
import { Mail, Github } from 'lucide-react';
import { useState } from 'react';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'clashconverter@gmail.com';

// Simple email obfuscation to avoid spam bots
const obfuscateEmail = (email: string) => {
  return email.replace('@', ' at ').replace('.', ' dot ');
};

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();
  const [showEmail, setShowEmail] = useState(false);

  return (
    <footer className="w-full border-t border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          {/* Copyright */}
          <p>
            © {currentYear} ClashConverter. {t('rights')}
          </p>

          {/* Contact & GitHub */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
            <button
              onClick={() => setShowEmail(true)}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-md px-2 py-1"
              type="button"
              aria-label="Show contact email"
            >
              <Mail className="h-4 w-4" />
              <span>{showEmail ? CONTACT_EMAIL : t('contact')}</span>
            </button>

            <a
              href="https://github.com/sunway910/clashconverter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-md px-2 py-1"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
