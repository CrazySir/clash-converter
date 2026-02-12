import { useEffect, useRef } from 'react';
import { FormatType } from '@/lib/parser';
import { toast } from 'sonner';

interface UseConverterToastsProps {
  input: string;
  unsupported: string[];
  filteredCounts: Record<string, number>;
  outputFormat: FormatType;
}

export function useConverterToasts({
  input,
  unsupported,
  filteredCounts,
  outputFormat,
}: UseConverterToastsProps) {
  const previousFilteredCountRef = useRef<Record<string, number>>({});
  const previousUnsupportedProtocolsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!input.trim()) {
      previousUnsupportedProtocolsRef.current = new Set();
      previousFilteredCountRef.current = {};
      return;
    }

    // Show unsupported protocol toasts
    const uniqueUnsupported = Array.from(new Set(unsupported));
    uniqueUnsupported.forEach((protocol) => {
      if (!previousUnsupportedProtocolsRef.current.has(protocol)) {
        toast.error(`Unsupported protocol: ${protocol.toUpperCase()}`);
      }
    });
    previousUnsupportedProtocolsRef.current = new Set(uniqueUnsupported);

    // Show filtering notifications for formats that don't support all protocols
    if (outputFormat === 'clash-premium') {
      Object.entries(filteredCounts).forEach(([protocol, count]) => {
        if (previousFilteredCountRef.current[protocol] !== count) {
          toast.warning(
            `${count} ${protocol.toUpperCase()} node(s) filtered out (not supported by Clash Premium)`
          );
        }
      });
      previousFilteredCountRef.current = { ...filteredCounts };
    } else if (outputFormat === 'sing-box') {
      Object.entries(filteredCounts).forEach(([protocol, count]) => {
        if (previousFilteredCountRef.current[protocol] !== count) {
          toast.warning(
            `${count} ${protocol.toUpperCase()} node(s) filtered out (not supported by Sing-Box)`
          );
        }
      });
      previousFilteredCountRef.current = { ...filteredCounts };
    } else if (outputFormat === 'loon') {
      Object.entries(filteredCounts).forEach(([protocol, count]) => {
        if (previousFilteredCountRef.current[protocol] !== count) {
          toast.warning(
            `${count} ${protocol.toUpperCase()} node(s) filtered out (not supported by Loon)`
          );
        }
      });
      previousFilteredCountRef.current = { ...filteredCounts };
    } else {
      // Reset for clash-meta and txt which support all protocols
      previousFilteredCountRef.current = {};
    }
  }, [input, unsupported, filteredCounts, outputFormat]);
}
