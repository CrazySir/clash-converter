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
import { PreviewEditor } from '@/components/preview/preview-editor';
import { FormatSelector } from './converter-format-selector';
import { ActionButtons } from './converter-action-buttons';
import { SwapButton } from './converter-swap-button';
import { KernelFeatures } from './converter-kernel-features';
import { FormatType } from '@/lib/parser';

interface OutputSectionProps {
  output: string;
  outputFormat: FormatType;
  outputLanguage: string;
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
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
        <Info className="w-4 h-4" />
      </Button>
    </DialogTrigger>
  );

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle
                className="flex items-center gap-2 cursor-pointer hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
                onClick={() => setDialogOpen(true)}
              >
                <Download className="w-5 h-5" />
                {labels.outputLabel}
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
          <CardContent>
            <PreviewEditor
              key={outputFormat}
              value={output}
              language={outputLanguage}
              height="300px"
              placeholder={outputPlaceholder}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kernel Features</DialogTitle>
            <DialogDescription>Supported features for this kernel</DialogDescription>
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
