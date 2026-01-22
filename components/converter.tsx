'use client';

import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PreviewEditor } from '@/components/preview-editor';
import { parseMultipleProxies } from '@/lib/parsers';
import { parseYamlToProxies, proxiesToLinks } from '@/lib/yaml-parser';
import { generateSimpleYaml } from '@/lib/yaml-generator';
import { generateSingBoxConfig, SING_BOX_SUPPORTED_PROTOCOLS } from '@/lib/sing-box-generator';
import type { OutputFormat } from '@/lib/types';
import { Download, FileText, Copy, ArrowRightLeft, Info, Cpu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

type ConversionMode = 'proxies-to-yaml' | 'yaml-to-proxies';
type OutputFormatType = 'clash-meta' | 'clash-premium' | 'sing-box';

// js-set-map-lookups: Use Set for O(1) lookups instead of Array.includes()
const CLASH_PREMIUM_UNSUPPORTED_PROTOCOLS = new Set(['vless', 'hysteria', 'hysteria2']);

// rendering-hoist-jsx: Hoist static protocol cards outside component to avoid recreation
const PROTOCOL_CARDS = [
  { name: 'Shadowsocks' },
  { name: 'ShadowsocksR' },
  { name: 'Vmess' },
  { name: 'VLESS' },
  { name: 'Trojan' },
  { name: 'Hysteria' },
  { name: 'HTTP' },
  { name: 'SOCKS5' },
] as const;

// rendering-hoist-jsx: Memoize protocol cards component
const ProtocolCards = memo(() => (
  <div className="grid grid-cols-2 gap-3 text-sm">
    {PROTOCOL_CARDS.map((protocol) => (
      <div key={protocol.name} className="flex items-center gap-2 p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
        <span className="font-mono text-xs bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">
          {protocol.name}
        </span>
      </div>
    ))}
  </div>
));
ProtocolCards.displayName = 'ProtocolCards';

// rerender-memo: Memoize kernel features component to prevent unnecessary re-renders
interface KernelFeaturesProps {
  kernelType: OutputFormatType;
  features: string[];
  title: string;
  description: string;
}

const KernelFeatures = memo(({ title, description, features }: KernelFeaturesProps) => (
  <div className="space-y-3">
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    <ul className="space-y-1 text-sm">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-muted-foreground mt-0.5">•</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
));
KernelFeatures.displayName = 'KernelFeatures';

// Helper function to generate download filename
const generateTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
};

export function Converter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('proxies-to-yaml');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormatType>('clash-meta');
  const t = useTranslations();
  const pendingInputRef = useRef<string | null>(null);
  const previousFilteredCountRef = useRef<Record<string, number>>({});
  const previousUnsupportedProtocolsRef = useRef<Set<string>>(new Set());

  // Parse input based on mode
  const result = useMemo(() => {
    if (!input.trim()) {
      previousUnsupportedProtocolsRef.current = new Set();
      previousFilteredCountRef.current = {};
      return '';
    }

    if (mode === 'proxies-to-yaml') {
      const { proxies, unsupported } = parseMultipleProxies(input);
      let filteredProxies = proxies;
      let filteredCounts: Record<string, number> = {};

      if (outputFormat === 'clash-premium') {
        filteredProxies = proxies.filter(proxy => {
          if (CLASH_PREMIUM_UNSUPPORTED_PROTOCOLS.has(proxy.type)) {
            filteredCounts[proxy.type] = (filteredCounts[proxy.type] || 0) + 1;
            return false;
          }
          return true;
        });
        return { output: generateSimpleYaml(filteredProxies), filteredCounts, isJson: false };
      }

      if (outputFormat === 'sing-box') {
        // sing-box doesn't support SSR
        filteredProxies = proxies.filter(proxy => {
          if (!SING_BOX_SUPPORTED_PROTOCOLS.has(proxy.type)) {
            filteredCounts[proxy.type] = (filteredCounts[proxy.type] || 0) + 1;
            return false;
          }
          return true;
        });
        return { output: generateSingBoxConfig(filteredProxies), filteredCounts, isJson: true };
      }

      // clash-meta (default) - supports all protocols
      return { output: generateSimpleYaml(filteredProxies), filteredCounts: {}, isJson: false };
    } else {
      const proxies = parseYamlToProxies(input);
      return { output: proxiesToLinks(proxies).join('\n'), filteredCounts: {}, isJson: false };
    }
  }, [input, mode, outputFormat]);

  const output = typeof result === 'string' ? result : result.output;
  const filteredCounts = typeof result === 'string' ? {} : result.filteredCounts;
  const isJson = typeof result === 'string' ? false : result.isJson ?? false;
  const { proxies, unsupported } = useMemo(() => parseMultipleProxies(input), [input]);

  // Handle toasts
  useEffect(() => {
    if (!input.trim()) {
      previousUnsupportedProtocolsRef.current = new Set();
      previousFilteredCountRef.current = {};
      return;
    }

    const uniqueUnsupported = Array.from(new Set(unsupported));
    uniqueUnsupported.forEach(protocol => {
      if (!previousUnsupportedProtocolsRef.current.has(protocol)) {
        toast.error(`Unsupported protocol: ${protocol.toUpperCase()}`);
      }
    });
    previousUnsupportedProtocolsRef.current = new Set(uniqueUnsupported);

    if (mode === 'proxies-to-yaml' && outputFormat === 'clash-premium') {
      Object.entries(filteredCounts).forEach(([protocol, count]) => {
        if (previousFilteredCountRef.current[protocol] !== count) {
          toast.warning(`${count} ${protocol.toUpperCase()} node(s) filtered out`);
        }
      });
      previousFilteredCountRef.current = filteredCounts;
    } else if (mode === 'proxies-to-yaml' && outputFormat === 'sing-box') {
      Object.entries(filteredCounts).forEach(([protocol, count]) => {
        if (previousFilteredCountRef.current[protocol] !== count) {
          toast.warning(`${count} ${protocol.toUpperCase()} node(s) filtered out (not supported by sing-box)`);
        }
      });
      previousFilteredCountRef.current = filteredCounts;
    } else if (outputFormat === 'clash-meta') {
      previousFilteredCountRef.current = {};
    }
  }, [input, unsupported, filteredCounts, mode, outputFormat]);

  // Handle pending input after mode change
  useEffect(() => {
    if (pendingInputRef.current !== null) {
      setInput(pendingInputRef.current);
      pendingInputRef.current = null;
    }
  }, [mode]);

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
    const timestamp = generateTimestamp();
    let filename: string;
    let mimeType: string;

    if (mode === 'proxies-to-yaml') {
      if (outputFormat === 'sing-box') {
        filename = `sing-box-${timestamp}.json`;
        mimeType = 'application/json';
      } else {
        filename = `clashconvert-${timestamp}.yaml`;
        mimeType = 'text/yaml';
      }
    } else {
      filename = `proxies-${timestamp}.txt`;
      mimeType = 'text/plain';
    }

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
  }, [output, mode, outputFormat]);

  const handleSwapMode = useCallback(() => {
    const newMode = mode === 'proxies-to-yaml' ? 'yaml-to-proxies' : 'proxies-to-yaml';
    pendingInputRef.current = output;
    setMode(newMode);
  }, [mode, output]);

  const itemCount = useMemo(() => {
    if (mode === 'proxies-to-yaml') {
      return proxies.length;
    }
    return parseYamlToProxies(input).length;
  }, [mode, proxies.length, input]);

  const kernelTitle = t.raw(`kernelDescriptions.${outputFormat}.title` as any);
  const kernelDescription = t.raw(`kernelDescriptions.${outputFormat}.description` as any);
  const kernelFeatures = t.raw(`kernelDescriptions.${outputFormat}.features` as any) as string[];

  // Output language based on mode
  const outputLanguage = mode === 'proxies-to-yaml' ? (isJson ? 'json' : 'yaml') : 'plaintext';
  // Input language based on mode (plaintext for proxies, yaml for yaml-to-proxies mode)
  const inputLanguage = mode === 'proxies-to-yaml' ? 'plaintext' : 'yaml';

  return (
      <div className="w-full max-w-6xl mx-auto px-3 py-4 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 md:space-y-2">
          <Image src="/clash_converter.svg" alt={t('title')} width={240} height={80} className="mx-auto" />
          <p className="text-sm md:text-base text-muted-foreground">
            {t(`subtitle.${mode}`)}
          </p>
        </div>

        <div className="grid gap-4 md:gap-8 md:grid-cols-2 relative">
          {/* Input Section - Left Side */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 cursor-pointer hover:text-stone-600 dark:hover:text-stone-400 transition-colors" onClick={() => setDialogOpen(true)}>
                    <FileText className="w-5 h-5" />
                    {t(`inputLabel.${mode}`)}
                  </CardTitle>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Info className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                </div>
              </CardHeader>
              <CardContent>
                <PreviewEditor
                  value={input}
                  language={inputLanguage}
                  height="300px"
                  placeholder={t(`inputPlaceholder.${mode}`)}
                  onChange={(val) => setInput(val)}
                />
                <div className="mt-3 md:mt-4 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                  <span>{t('itemsFound', { count: itemCount })}</span>
                  {input && (
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs">
                      {t('clear')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('supportedProtocols')}</DialogTitle>
                <DialogDescription>
                  All proxy protocols are supported for conversion
                </DialogDescription>
              </DialogHeader>
              <ProtocolCards />
            </DialogContent>
          </Dialog>

          {/* Swap Button (centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
            <Button
                size="sm"
                variant="outline"
                className="rounded-full shadow-lg bg-background"
                onClick={handleSwapMode}
                title="Swap conversion direction"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Output Section - Right Side */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {t(`outputLabel.${mode}`)}
                </CardTitle>
                {mode === 'proxies-to-yaml' && (
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as OutputFormatType)}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clash-meta">{t('kernelTypes.clash-meta')}</SelectItem>
                          <SelectItem value="clash-premium">{t('kernelTypes.clash-premium')}</SelectItem>
                          <SelectItem value="sing-box">{t('kernelTypes.sing-box')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <KernelFeatures
                            kernelType={outputFormat}
                            title={kernelTitle}
                            description={kernelDescription}
                            features={kernelFeatures}
                          />
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <PreviewEditor
                key={mode === 'proxies-to-yaml' ? outputFormat : 'yaml-to-proxies'}
                value={output}
                language={outputLanguage}
                height="300px"
                placeholder={t(`outputPlaceholder.${mode}`)}
              />
              <div className="mt-3 md:mt-4 flex gap-2">
                <Button
                    onClick={handleDownload}
                    disabled={itemCount === 0}
                    className="flex-1 text-sm"
                    size="sm"
                >
                  <Download className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">{t('download')}</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCopy}
                    disabled={itemCount === 0}
                    size="sm"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden md:inline ml-1 md:ml-2">{t('copy')}</span>
                </Button>
              </div>
              {/* Mobile swap button */}
              <div className="mt-3 md:mt-4 md:hidden">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSwapMode}
                    disabled={!input || !output}
                    size="sm"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  {t('swapDirection')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
