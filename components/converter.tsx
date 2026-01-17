'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { parseMultipleProxies } from '@/lib/parsers';
import { parseYamlToProxies, proxiesToLinks } from '@/lib/yaml-parser';
import { generateSimpleYaml } from '@/lib/yaml-generator';
import { Download, FileText, Copy, ArrowRightLeft, Info, Cpu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

type ConversionMode = 'proxies-to-yaml' | 'yaml-to-proxies';
type KernelType = 'clash-meta' | 'clash-premium';

// Protocols not supported by Clash Premium
const CLASH_PREMIUM_UNSUPPORTED_PROTOCOLS = ['vless', 'hysteria', 'hysteria2'];

export function Converter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('proxies-to-yaml');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [kernelType, setKernelType] = useState<KernelType>('clash-meta');
  const t = useTranslations();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingInputRef = useRef<string | null>(null);
  const previousFilteredCountRef = useRef<Record<string, number>>({});

  // Parse input based on mode
  const result = useMemo(() => {
    if (!input.trim()) return '';

    if (mode === 'proxies-to-yaml') {
      let proxies = parseMultipleProxies(input);

      // Filter protocols for Clash Premium
      if (kernelType === 'clash-premium') {
        const filteredCounts: Record<string, number> = {};
        const beforeCount = proxies.length;

        proxies = proxies.filter(proxy => {
          if (CLASH_PREMIUM_UNSUPPORTED_PROTOCOLS.includes(proxy.type)) {
            filteredCounts[proxy.type] = (filteredCounts[proxy.type] || 0) + 1;
            return false;
          }
          return true;
        });

        // Show toast warnings for filtered protocols
        Object.entries(filteredCounts).forEach(([protocol, count]) => {
          const key = `${input}-${protocol}`;
          // Only show toast if the count has changed since last render
          if (previousFilteredCountRef.current[protocol] !== count) {
            toast.warning(
              t('protocolFiltered', { count, protocol: t(`unsupportedProtocols.${protocol}` as any) })
            );
          }
        });

        // Update previous filtered counts
        previousFilteredCountRef.current = filteredCounts;
      } else {
        // Reset filtered counts when switching back to clash-meta
        previousFilteredCountRef.current = {};
      }

      return generateSimpleYaml(proxies);
    } else {
      const proxies = parseYamlToProxies(input);
      return proxiesToLinks(proxies).join('\n');
    }
  }, [input, mode, kernelType, t]);

  // Handle pending input after mode change
  useEffect(() => {
    if (pendingInputRef.current !== null) {
      setInput(pendingInputRef.current);
      pendingInputRef.current = null;
    }
  }, [mode]);

  // Reset textarea scroll position when mode or input changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated before resetting scroll
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollLeft = 0;
        textareaRef.current.scrollTop = 0;
      }
    });
  }, [mode, input]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success(t('copied'));
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: mode === 'proxies-to-yaml' ? 'text/yaml' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = t(`downloadFilename.${mode}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully');
  };

  const handleSwapMode = () => {
    // Capture the current result before any state changes
    const currentResult = result;
    const newMode = mode === 'proxies-to-yaml' ? 'yaml-to-proxies' : 'proxies-to-yaml';

    // Store the result to be applied after mode change
    pendingInputRef.current = currentResult;
    // Change mode first - the useEffect will then update the input
    setMode(newMode);
  };

  const itemCount = mode === 'proxies-to-yaml'
    ? parseMultipleProxies(input).length
    : parseYamlToProxies(input).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <Image src="/clash_converter.svg" alt={t('title')} width={200} height={66} className="mx-auto opacity-90" />
        <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 font-light">
          {t(`subtitle.${mode}`)}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_auto_1fr] items-start">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800/50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              </div>
              <h2 className="text-base font-medium text-stone-700 dark:text-stone-300">
                {t(`inputLabel.${mode}`)}
              </h2>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md w-[95vw] border-stone-200 dark:border-stone-800">
                <DialogHeader>
                  <DialogTitle className="text-stone-800 dark:text-stone-200">{t('supportedProtocols')}</DialogTitle>
                  <DialogDescription className="text-stone-500 dark:text-stone-400">
                    All proxy protocols are supported for conversion
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Shadowsocks', 'ShadowsocksR', 'Vmess', 'VLESS', 'Trojan', 'Hysteria', 'HTTP', 'SOCKS5'].map((protocol) => (
                    <div key={protocol} className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
                      <span className="font-mono text-xs text-stone-600 dark:text-stone-400">{protocol}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <Textarea
              ref={textareaRef}
              placeholder={t(`inputPlaceholder.${mode}`)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="!h-[300px] md:!h-[400px] resize-none font-mono text-xs md:text-sm border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950/50 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-700 transition-all overflow-auto whitespace-pre"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-stone-400 dark:text-stone-500">
                {t('itemsFound', { count: itemCount })}
              </span>
              {input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput('')}
                  className="h-7 text-xs text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
                >
                  {t('clear')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="hidden lg:flex items-center justify-center">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-12 w-12 p-0 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            onClick={handleSwapMode}
            title={t('swapDirection')}
          >
            <ArrowRightLeft className="w-5 h-5 text-stone-400" />
          </Button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800/50 flex items-center justify-center">
                <Download className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              </div>
              <h2 className="text-base font-medium text-stone-700 dark:text-stone-300">
                {t(`outputLabel.${mode}`)}
              </h2>
            </div>
            {mode === 'proxies-to-yaml' && (
              <div className="flex items-center gap-1.5 md:gap-2">
                <Cpu className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
                <Select value={kernelType} onValueChange={(value) => setKernelType(value as KernelType)}>
                  <SelectTrigger className="w-[140px] md:w-[160px] h-7 text-xs border-stone-200 dark:border-stone-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clash-meta">{t('kernelTypes.clash-meta')}</SelectItem>
                    <SelectItem value="clash-premium">{t('kernelTypes.clash-premium')}</SelectItem>
                  </SelectContent>
                </Select>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                      <Info className="w-3.5 h-3.5 text-stone-400" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 max-w-[90vw] border-stone-200 dark:border-stone-800">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">{t.raw(`kernelDescriptions.${kernelType}.title` as any)}</h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t.raw(`kernelDescriptions.${kernelType}.description` as any)}</p>
                      </div>
                      <ul className="space-y-1.5 text-sm text-stone-600 dark:text-stone-400">
                        {(t.raw(`kernelDescriptions.${kernelType}.features` as any) as string[]).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-stone-400 mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 overflow-hidden">
              <pre className="h-[300px] md:h-[400px] w-full p-4 text-[10px] md:text-xs font-mono overflow-auto text-stone-600 dark:text-stone-400 whitespace-pre">
                {result || <span className="text-stone-300 dark:text-stone-700">{t(`outputPlaceholder.${mode}`)}</span>}
              </pre>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleDownload}
                disabled={itemCount === 0}
                className="flex-1 h-9 text-xs font-medium bg-stone-800 dark:bg-stone-200 hover:bg-stone-700 dark:hover:bg-stone-300 text-white dark:text-stone-900 border-0"
                size="sm"
              >
                <Download className="w-3.5 h-3.5 md:mr-1.5" />
                <span>{t('download')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={itemCount === 0}
                className="h-9 px-3 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900"
                size="sm"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile swap button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full h-10 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900"
          onClick={handleSwapMode}
          disabled={!input || !result}
          size="sm"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          <span className="text-xs font-medium">{t('swapDirection')}</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-stone-400 dark:text-stone-600">
          Pure client-side conversion • Your data never leaves your browser
        </p>
      </div>
    </div>
  );
}
