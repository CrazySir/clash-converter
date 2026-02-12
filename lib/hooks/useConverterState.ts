import { useState, useMemo, useRef } from 'react';
import { convert, FormatType } from '@/lib/parser';
import { parseInput } from '@/lib/parser';
import { useTranslations } from 'next-intl';
import {
  getLanguageForFormat,
  getInputPlaceholder,
  getOutputPlaceholder,
} from '@/lib/utils/converter';

export function useConverterState() {
  const t = useTranslations();

  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState<FormatType>('txt');
  const [outputFormat, setOutputFormat] = useState<FormatType>('clash-meta');

  // Ref for pending input after format change
  const pendingInputRef = useRef<string | null>(null);

  // Parse input and generate output based on formats
  const result = useMemo(() => {
    if (!input.trim()) {
      return { output: '', filteredCounts: {}, isJson: false, unsupported: [] };
    }
    return convert(input, inputFormat, outputFormat);
  }, [input, inputFormat, outputFormat]);

  const output = result.output;
  const filteredCounts = result.filteredCounts;
  const unsupported = result.unsupported;

  // Compute input/output languages for syntax highlighting
  const inputLanguage = useMemo(() => {
    return getLanguageForFormat(inputFormat);
  }, [inputFormat]);

  const outputLanguage = useMemo(() => {
    return getLanguageForFormat(outputFormat);
  }, [outputFormat]);

  // Compute placeholders
  const inputPlaceholder = useMemo(() => {
    return getInputPlaceholder(inputFormat, t);
  }, [inputFormat, t]);

  const outputPlaceholder = useMemo(() => {
    return getOutputPlaceholder(outputFormat, t);
  }, [outputFormat, t]);

  // Compute item count
  const itemCount = useMemo(() => {
    const parseResult = parseInput(input, inputFormat);
    return parseResult.proxies.length;
  }, [input, inputFormat]);

  // Get kernel description for output format
  const kernelTitle = t.raw(`kernelDescriptions.${outputFormat}.title` as any);
  const kernelDescription = t.raw(`kernelDescriptions.${outputFormat}.description` as any);
  const kernelFeatures = t.raw(`kernelDescriptions.${outputFormat}.features` as any) as string[];

  return {
    // State
    input,
    setInput,
    inputFormat,
    setInputFormat,
    outputFormat,
    setOutputFormat,
    pendingInputRef,

    // Computed values
    output,
    filteredCounts,
    unsupported,
    inputLanguage,
    outputLanguage,
    inputPlaceholder,
    outputPlaceholder,
    itemCount,
    kernelTitle,
    kernelDescription,
    kernelFeatures,
  };
}
