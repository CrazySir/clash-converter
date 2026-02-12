import { FormatType } from '@/lib/parser';

/**
 * Generate timestamp for download filename
 * @returns Formatted timestamp string (YYYY_MM_DD_HH_MM_SS)
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}

/**
 * Get CodeMirror language for a given format
 */
export function getLanguageForFormat(format: FormatType): string {
  switch (format) {
    case 'sing-box':
      return 'json';
    case 'txt':
    case 'subscribe-url':
      return 'plaintext';
    default:
      return 'yaml';
  }
}

/**
 * Get input placeholder text for a given format
 */
export function getInputPlaceholder(format: FormatType, t: (key: string) => string): string {
  switch (format) {
    case 'subscribe-url':
      return t('inputPlaceholder.subscribe-url');
    case 'txt':
      return t('inputPlaceholder.txt');
    case 'sing-box':
      return t('inputPlaceholder.sing-box');
    default:
      return t('inputPlaceholder.clash');
  }
}

/**
 * Get output placeholder text for a given format
 */
export function getOutputPlaceholder(format: FormatType, t: (key: string) => string): string {
  switch (format) {
    case 'txt':
      return t('outputPlaceholder.txt');
    case 'sing-box':
      return t('outputPlaceholder.sing-box');
    case 'loon':
      return '# Your Loon configuration will appear here';
    default:
      return t('outputPlaceholder.clash');
  }
}

/**
 * Get download filename and MIME type for a given format
 */
export function getDownloadInfo(format: FormatType): { filename: string; mimeType: string } {
  const timestamp = generateTimestamp();

  switch (format) {
    case 'sing-box':
      return {
        filename: `sing-box-${timestamp}.json`,
        mimeType: 'application/json',
      };
    case 'txt':
      return {
        filename: `proxies-${timestamp}.txt`,
        mimeType: 'text/plain',
      };
    case 'loon':
      return {
        filename: `loon-${timestamp}.conf`,
        mimeType: 'text/plain',
      };
    case 'clash-meta':
    case 'clash-premium':
    default:
      return {
        filename: `clashconvert-${timestamp}.yaml`,
        mimeType: 'text/yaml',
      };
  }
}

/**
 * Get format options array for selectors
 */
export function getInputFormatOptions(t: (key: string) => string): Array<{ value: FormatType; label: string }> {
  return [
    { value: 'subscribe-url', label: t('formatTypes.subscribe-url') },
    { value: 'txt', label: t('formatTypes.txt') },
    { value: 'clash-meta', label: t('formatTypes.clash-meta') },
    { value: 'clash-premium', label: t('formatTypes.clash-premium') },
    { value: 'sing-box', label: t('formatTypes.sing-box') },
    { value: 'loon', label: t('formatTypes.loon') },
  ];
}

/**
 * Get format options array for output selectors (excludes subscribe-url)
 */
export function getOutputFormatOptions(t: (key: string) => string): Array<{ value: FormatType; label: string }> {
  return [
    { value: 'txt', label: t('formatTypes.txt') },
    { value: 'clash-meta', label: t('formatTypes.clash-meta') },
    { value: 'clash-premium', label: t('formatTypes.clash-premium') },
    { value: 'sing-box', label: t('formatTypes.sing-box') },
    { value: 'loon', label: t('formatTypes.loon') },
  ];
}
