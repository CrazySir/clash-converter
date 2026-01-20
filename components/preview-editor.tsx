'use client';

import * as React from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface PreviewEditorProps {
  value: string;
  language: 'json' | 'yaml' | 'plaintext';
  height?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  key?: string; // Force remount on key change
}

export function PreviewEditor({
  value,
  language,
  height = '400px',
  onChange,
  placeholder,
  key: editorKey,
}: PreviewEditorProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Handle hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Map theme to Monaco theme
  const monacoTheme = React.useMemo(() => {
    if (!mounted) return 'vs-dark';
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return currentTheme === 'dark' ? 'vs-dark' : 'vs-light';
  }, [theme, systemTheme, mounted]);

  const displayValue = value || placeholder || '';

  return (
    <div className="rounded-md border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-950">
      <Editor
        key={editorKey}
        height={height}
        language={language}
        value={displayValue}
        theme={monacoTheme}
        onChange={onChange ? (val) => onChange(val || '') : undefined}
        options={{
          readOnly: !onChange, // Only read-only if no onChange handler
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          folding: true,
          lineNumbers: 'on',
          glyphMargin: false,
          fontSize: 12,
          lineHeight: 18,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          automaticLayout: true,
          wordWrap: 'off',
          bracketPairColorization: {
            enabled: true,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
        loading={
          <div className="flex items-center justify-center h-full py-20">
            <div className="text-stone-500 text-sm">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
}
