import { useState, useEffect, useRef, useCallback } from 'react';
import { isSubscriptionLink } from '@/lib/subscription';
import { FormatType } from '@/lib/parser';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface UseSubscriptionDetectionProps {
  input: string;
  setInput: (value: string) => void;
  setInputFormat: (format: FormatType) => void;
  setOutputFormat: (format: FormatType) => void;
}

export function useSubscriptionDetection({
  input,
  setInput,
  setInputFormat,
  setOutputFormat,
}: UseSubscriptionDetectionProps) {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [pendingSubscriptionUrl, setPendingSubscriptionUrl] = useState('');
  const t = useTranslations();
  const lastProcessedInputRef = useRef<string>('');

  // Detect subscription link and show dialog
  useEffect(() => {
    // Skip if input is empty or already processed
    const trimmedInput = input.trim();
    if (!trimmedInput || trimmedInput === lastProcessedInputRef.current) {
      return;
    }

    // Check if input is a single subscription URL (not already processed content)
    const lines = trimmedInput.split(/[\r\n]+/).filter((line) => line.trim());
    if (lines.length === 1 && isSubscriptionLink(lines[0])) {
      // Store the URL and show dialog
      setPendingSubscriptionUrl(lines[0]);
      setSubscriptionDialogOpen(true);
      // Mark as processed to avoid showing dialog again
      lastProcessedInputRef.current = trimmedInput;
    }
  }, [input]);

  // Handle subscription conversion callback
  const handleSubscriptionConvert = useCallback(
    (content: string, detectedInputFormat: string, suggestedOutputFormat?: string) => {
      // Set the converted content as input
      setInput(content);
      setInputFormat(detectedInputFormat as FormatType);

      // Set suggested output format if provided
      if (suggestedOutputFormat) {
        setOutputFormat(suggestedOutputFormat as FormatType);
      }

      // Update last processed input to avoid re-triggering
      lastProcessedInputRef.current = content;

      toast.success(t('subscription.successToast'));
    },
    [t, setInput, setInputFormat, setOutputFormat]
  );

  return {
    subscriptionDialogOpen,
    setSubscriptionDialogOpen,
    pendingSubscriptionUrl,
    handleSubscriptionConvert,
  };
}
