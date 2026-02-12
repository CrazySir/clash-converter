import { useCallback } from 'react';
import { FormatType } from '@/lib/parser';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { getDownloadInfo } from '@/lib/utils/converter';

interface UseFileOperationsProps {
  output: string;
  outputFormat: FormatType;
  inputFormat: FormatType;
  setInputFormat: (format: FormatType) => void;
  setOutputFormat: (format: FormatType) => void;
  pendingInputRef: React.MutableRefObject<string | null>;
}

export function useFileOperations({
  output,
  outputFormat,
  inputFormat,
  setInputFormat,
  setOutputFormat,
  pendingInputRef,
}: UseFileOperationsProps) {
  const t = useTranslations();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t('copied'));
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy');
    }
  }, [output, t]);

  const handleDownload = useCallback(() => {
    const { filename, mimeType } = getDownloadInfo(outputFormat);

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Downloaded successfully');
  }, [output, outputFormat]);

  const handleSwapFormat = useCallback(() => {
    // Swap input and output formats
    const newInputFormat = outputFormat;
    const newOutputFormat = inputFormat;
    setInputFormat(newInputFormat);
    setOutputFormat(newOutputFormat);
    // Move current output to input for convenience
    pendingInputRef.current = output;
  }, [inputFormat, outputFormat, setInputFormat, setOutputFormat, pendingInputRef]);

  return {
    handleCopy,
    handleDownload,
    handleSwapFormat,
  };
}
