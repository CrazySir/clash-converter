'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseMultipleProxies } from '@/lib/parsers';
import { generateSimpleYaml } from '@/lib/yaml-generator';
import { Download, FileText, Copy, Check } from 'lucide-react';

export function Converter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const proxies = useMemo(() => {
    if (!input.trim()) return [];
    return parseMultipleProxies(input);
  }, [input]);

  const yaml = useMemo(() => {
    return generateSimpleYaml(proxies);
  }, [proxies]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clash-config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          2Clash
        </h1>
        <p className="text-muted-foreground">
          Convert proxy configurations to Clash YAML format
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Input
            </CardTitle>
            <CardDescription>
              Paste your proxy links (SS, SSR, Vmess, Trojan, Hysteria, VLESS, HTTP, SOCKS5) - one per line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="ss://...
vmess://...
trojan://..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{proxies.length} proxy(ies) found</span>
              {input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput('')}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Output (Clash YAML)
            </CardTitle>
            <CardDescription>
              Preview and download your Clash configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="min-h-[400px] w-full rounded-md border border-stone-200 bg-stone-50 p-4 text-xs font-mono overflow-auto dark:border-stone-800 dark:bg-stone-950">
                {yaml || '# Your Clash config will appear here'}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleDownload}
                disabled={proxies.length === 0}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={proxies.length === 0}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supported Protocols */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">SS</span>
              <span className="text-muted-foreground">Shadowsocks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">SSR</span>
              <span className="text-muted-foreground">ShadowsocksR</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">Vmess</span>
              <span className="text-muted-foreground">VMess</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">VLESS</span>
              <span className="text-muted-foreground">VLESS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">Trojan</span>
              <span className="text-muted-foreground">Trojan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">Hysteria</span>
              <span className="text-muted-foreground">Hysteria</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">HTTP</span>
              <span className="text-muted-foreground">HTTP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">SOCKS5</span>
              <span className="text-muted-foreground">SOCKS5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
