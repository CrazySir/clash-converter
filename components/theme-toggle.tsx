'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme for immediate feedback during transition
  const currentTheme = resolvedTheme || theme || 'light';

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="group size-10 rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-out flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95"
      aria-label="Toggle theme"
      type="button"
    >
      {/* Render icons on server and hydrate without flicker */}
      <span className="dark:hidden">
        <Moon className="size-5 transition-transform group-hover:scale-110" />
      </span>
      <span className="hidden dark:inline">
        <Sun className="size-5 transition-transform group-hover:scale-110" />
      </span>
    </button>
  );
}
