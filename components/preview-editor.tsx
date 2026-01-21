// preview-editor.tsx

'use client';

import * as React from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import {
  EditorView,
  keymap,
  drawSelection,
  dropCursor,
  placeholder as placeholderExt,
  lineNumbers,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  bracketMatching,
  indentOnInput,
  foldGutter,
  syntaxHighlighting,
  defaultHighlightStyle,
  HighlightStyle,
} from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { tags as t } from '@lezer/highlight';
import { useTheme } from 'next-themes';

// ============================================================================
// Type Definitions
// ============================================================================

interface PreviewEditorProps {
  value: string;
  language: LanguageType;
  height?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  key?: string;
}

type LanguageType = 'json' | 'yaml' | 'plaintext';
type ThemeMode = 'light' | 'dark';

interface EditorCompartments {
  readOnly: Compartment;
  placeholder: Compartment;
  theme: Compartment;
  highlightStyle: Compartment;
  language: Compartment;
}

// ============================================================================
// Constants - Theme Styles
// ============================================================================

const DARK_HIGHLIGHT_COLORS = {
  keyword: '#ff7b72',
  string: '#a5d6ff',
  number: '#79c0ff',
  propertyName: '#d2a8ff',
  comment: '#8b949e',
  punctuation: '#c9d1d9',
  selectionBg: '#264f78',
  selectionBgFocused: '#264f78',
  bg: '#09090b',
  gutter: '#09090b',
  gutterText: '#8b949e',
  foldPlaceholder: '#264f78',
  foldPlaceholderText: '#a5d6ff',
} as const;

const LIGHT_HIGHLIGHT_COLORS = {
  keyword: '#cf222e',
  string: '#0a3069',
  number: '#0550ae',
  propertyName: '#8250df',
  comment: '#6e7781',
  punctuation: '#24292f',
  selectionBg: '#b4d5fe',
  selectionBgFocused: '#d7d4f0',
  bg: '#ffffff',
  gutter: '#ffffff',
  gutterText: '#6e7781',
  foldPlaceholder: '#d7d4f0',
  foldPlaceholderText: '#0a3069',
} as const;

// ============================================================================
// Memoized Style Creators
// ============================================================================

/**
 * Cached highlight styles to avoid recreation on every render
 */
const highlightStyleCache = new Map<ThemeMode, ReturnType<typeof HighlightStyle.define>>();

/**
 * Creates or retrieves a cached highlight style for the given theme
 */
function getHighlightStyle(isDark: boolean): ReturnType<typeof HighlightStyle.define> {
  const themeMode: ThemeMode = isDark ? 'dark' : 'light';

  let highlightStyle = highlightStyleCache.get(themeMode);
  if (!highlightStyle) {
    const colors = isDark ? DARK_HIGHLIGHT_COLORS : LIGHT_HIGHLIGHT_COLORS;

    highlightStyle = HighlightStyle.define([
      { tag: t.keyword, color: colors.keyword, fontWeight: 'bold' },
      { tag: t.string, color: colors.string },
      { tag: t.number, color: colors.number },
      { tag: t.bool, color: colors.number },
      { tag: t.null, color: colors.number },
      { tag: t.propertyName, color: colors.propertyName },
      { tag: t.comment, color: colors.comment, fontStyle: 'italic' },
      { tag: t.variableName, color: colors.number },
      { tag: t.typeName, color: colors.propertyName },
      { tag: t.operator, color: colors.keyword },
      { tag: t.punctuation, color: colors.punctuation },
      { tag: t.bracket, color: colors.punctuation },
    ]);

    highlightStyleCache.set(themeMode, highlightStyle);
  }

  return highlightStyle;
}

/**
 * Cached theme extensions to avoid recreation on every render
 */
const themeExtensionCache = new Map<string, ReturnType<typeof EditorView.theme>>();

/**
 * Creates or retrieves a cached theme extension for the given theme and height
 */
function getThemeExtension(isDark: boolean, height: string): ReturnType<typeof EditorView.theme> {
  const cacheKey = `${isDark ? 'dark' : 'light'}:${height}`;

  let themeExtension = themeExtensionCache.get(cacheKey);
  if (!themeExtension) {
    const colors = isDark ? DARK_HIGHLIGHT_COLORS : LIGHT_HIGHLIGHT_COLORS;

    themeExtension = EditorView.theme({
      '&': {
        height,
        fontSize: '12px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        backgroundColor: colors.bg,
      },
      '&.cm-focused': { outline: 'none' },
      '.cm-scroller': {
        overflow: 'auto',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace"
      },
      '.cm-content': { padding: '12px 0' },
      '.cm-line': { padding: '0 4px', lineHeight: '18px' },
      '.cm-selectionBackground': { background: colors.selectionBg },
      '&.cm-focused .cm-selectionBackground': { background: colors.selectionBgFocused },
      '.cm-gutters': {
        backgroundColor: colors.gutter,
        color: colors.gutterText,
        border: 'none',
      },
      '.cm-gutterElement': {
        padding: '0 4px',
        minWidth: '20px',
        textAlign: 'right',
        fontSize: '11px',
        lineHeight: '18px',
      },
      '.cm-foldGutter': {
        width: '20px',
      },
      '.cm-foldPlaceholder': {
        backgroundColor: colors.foldPlaceholder,
        border: 'none',
        color: colors.foldPlaceholderText,
        padding: '0 4px',
        margin: '0 2px',
        borderRadius: '2px',
        fontSize: '11px',
      },
    });

    themeExtensionCache.set(cacheKey, themeExtension);
  }

  return themeExtension;
}

// ============================================================================
// Language Extensions
// ============================================================================

/**
 * Memoized language extensions
 */
const languageExtensions = {
  json: json(),
  yaml: yaml(),
  plaintext: [],
} as const;

function getLanguageExtension(lang: LanguageType) {
  return languageExtensions[lang];
}

// ============================================================================
// Compartment Factory
// ============================================================================

function createEditorCompartments(): EditorCompartments {
  return {
    readOnly: new Compartment(),
    placeholder: new Compartment(),
    theme: new Compartment(),
    highlightStyle: new Compartment(),
    language: new Compartment(),
  };
}

// ============================================================================
// Main Component
// ============================================================================

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

  // Refs
  const compartmentsRef = React.useRef<EditorCompartments>(createEditorCompartments());
  const editorRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);

  // Memoized theme state
  const themeState = React.useMemo(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return {
      isDark: currentTheme === 'dark',
      resolvedTheme: currentTheme as 'light' | 'dark' | undefined,
    };
  }, [theme, systemTheme]);

  // Memoized base extensions that don't change
  const baseExtensions = React.useMemo(() => [
    keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
    history(),
    drawSelection(),
    dropCursor(),
    lineNumbers(),
    highlightSelectionMatches(),
  ], []);

  // Memoized fold gutter config
  const foldGutterExt = React.useMemo(() => foldGutter({
    openText: '▼',
    closedText: '▶',
  }), []);

  // Memoized bracket matching and indent extensions
  const structuralExtensions = React.useMemo(() =>
    language !== 'plaintext'
      ? [bracketMatching(), indentOnInput()]
      : [],
  [language]);

  // Update onChange ref without causing re-renders
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Handle hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize CodeMirror editor
  React.useEffect(() => {
    if (!mounted || !editorRef.current) return;

    const { isDark } = themeState;
    const themeExtension = getThemeExtension(isDark, height);
    const highlightStyle = getHighlightStyle(isDark);
    const languageExtension = getLanguageExtension(language);

    const compartments = compartmentsRef.current;

    const extensions = [
      ...baseExtensions,
      foldGutterExt,
      ...structuralExtensions,
      // Language-specific extensions
      compartments.language.of(languageExtension),
      // Syntax highlighting
      compartments.highlightStyle.of(syntaxHighlighting(highlightStyle)),
      // Theme
      compartments.theme.of(themeExtension),
      // Read-only state
      compartments.readOnly.of(EditorState.readOnly.of(!onChange)),
      // Placeholder
      compartments.placeholder.of(placeholderExt(placeholder || '')),
      // Update listener for onChange
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChangeRef.current) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
    ];

    const startState = EditorState.create({
      doc: value || '',
      extensions,
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only re-initialize on mount or editorKey change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, editorKey]);

  // Update language when it changes
  React.useEffect(() => {
    if (!viewRef.current || !mounted) return;

    const languageExtension = getLanguageExtension(language);
    viewRef.current.dispatch({
      effects: compartmentsRef.current.language.reconfigure(languageExtension),
    });
  }, [language, mounted]);

  // Update document value from outside changes
  React.useEffect(() => {
    if (!viewRef.current) return;

    const currentValue = viewRef.current.state.doc.toString();
    if (currentValue !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value || '',
        },
      });
    }
  }, [value]);

  // Update theme, highlight style, and structural extensions together
  React.useEffect(() => {
    if (!viewRef.current || !mounted) return;

    const { isDark } = themeState;
    const themeExtension = getThemeExtension(isDark, height);
    const highlightStyle = getHighlightStyle(isDark);

    viewRef.current.dispatch({
      effects: [
        compartmentsRef.current.theme.reconfigure(themeExtension),
        compartmentsRef.current.highlightStyle.reconfigure(syntaxHighlighting(highlightStyle)),
      ],
    });
  }, [themeState.isDark, height, mounted]);

  // Update read-only state
  React.useEffect(() => {
    if (!viewRef.current) return;

    viewRef.current.dispatch({
      effects: compartmentsRef.current.readOnly.reconfigure(EditorState.readOnly.of(!onChange)),
    });
  }, [onChange]);

  // Update placeholder
  React.useEffect(() => {
    if (!viewRef.current) return;

    viewRef.current.dispatch({
      effects: compartmentsRef.current.placeholder.reconfigure(placeholderExt(placeholder || '')),
    });
  }, [placeholder]);

  return (
    <div
      className={`rounded-md border overflow-hidden ${
        themeState.isDark
          ? 'border-stone-800 bg-stone-950'
          : 'border-stone-200 bg-white'
      }`}
      style={{ height }}
    >
      {!mounted && (
        <div className="flex items-center justify-center h-full py-20">
          <div className="text-stone-500 text-sm">Loading editor...</div>
        </div>
      )}
      <div ref={editorRef} className="h-full" />
    </div>
  );
}
