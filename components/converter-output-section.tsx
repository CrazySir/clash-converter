import { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import { PreviewEditor, type LanguageType } from '@/components/preview/preview-editor';
import { FormatSelector } from './converter-format-selector';
import { ActionButtons } from './converter-action-buttons';
import { SwapButton } from './converter-swap-button';
import { KernelFeatures } from './converter-kernel-features';
import { FormatType } from '@/lib/parser';

interface OutputSectionProps {
  output: string;
  outputFormat: FormatType;
  outputLanguage: LanguageType;
  outputPlaceholder: string;
  itemCount: number;
  kernelTitle: string;
  kernelDescription: string;
  kernelFeatures: string[];
  onCopy: () => void;
  onDownload: () => void;
  onSwapFormat: () => void;
  onFormatChange: (value: FormatType) => void;
  formatOptions: Array<{ value: FormatType; label: string }>;
  labels: {
    outputLabel: string;
    formatTypes: Record<string, string>;
    download: string;
    copy: string;
    swapDirection: string;
  };
}

export const OutputSection = memo(({
  output,
  outputFormat,
  outputLanguage,
  outputPlaceholder,
  itemCount,
  kernelTitle,
  kernelDescription,
  kernelFeatures: kernelFeaturesList,
  onCopy,
  onDownload,
  onSwapFormat,
  onFormatChange,
  formatOptions,
  labels,
}: OutputSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const infoButton = (
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full hover:bg-lavender-200 hover:text-lavender-600 transition-all duration-300"
      >
        <Info className="w-4 h-4" />
      </Button>
    </DialogTrigger>
  );

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card className="neo-card relative overflow-hidden rounded-[2.5rem] bg-lavender-50 border-white/60 transition-all duration-300 hover:neo-card-hover h-full flex flex-col">
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle
                className="flex items-center gap-2 cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 focus-visible:ring-offset-2 rounded-[2.5rem] px-2 py-1"
                onClick={() => setDialogOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDialogOpen(true);
                  }
                }}
                title="Click to view kernel features"
                aria-label={`View kernel features for ${labels.outputLabel}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 neo-button transition-all duration-300 group-hover:scale-105">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-lavender-600 transition-colors duration-300"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {labels.outputLabel}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <FormatSelector
                  value={outputFormat}
                  onChange={onFormatChange}
                  options={formatOptions}
                  infoButton={infoButton}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">
            <PreviewEditor
              key={outputFormat}
              value={output}
              language={outputLanguage}
              height="300px"
              placeholder={outputPlaceholder}
              className="flex-1"
            />
            <ActionButtons
              onDownload={onDownload}
              onCopy={onCopy}
              disabled={itemCount === 0}
              downloadLabel={labels.download}
              copyLabel={labels.copy}
            />
            {/* Mobile swap button */}
            <SwapButton
              variant="mobile"
              onClick={onSwapFormat}
              disabled={!output || itemCount === 0}
              label={labels.swapDirection}
            />
          </CardContent>
        </Card>
        <DialogContent className="max-w-md rounded-[2.5rem] border-white/60 bg-lavender-50 neo-card">
          <DialogHeader>
            <DialogTitle
              className="text-xl font-black text-slate-700"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Kernel Features
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Supported features for this kernel
            </DialogDescription>
          </DialogHeader>
          <KernelFeatures
            title={kernelTitle}
            description={kernelDescription}
            features={kernelFeaturesList}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

OutputSection.displayName = 'OutputSection';
