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
import { FileText, Info } from 'lucide-react';
import { PreviewEditor, type LanguageType } from '@/components/preview/preview-editor';
import { FormatSelector } from './converter-format-selector';
import { ItemCount } from './converter-item-count';
import { ProtocolCards } from './converter-protocol-cards';
import { FormatType } from '@/lib/parser';

interface InputSectionProps {
  input: string;
  inputFormat: FormatType;
  inputLanguage: LanguageType;
  inputPlaceholder: string;
  itemCount: number;
  onInputChange: (value: string) => void;
  onFormatChange: (value: FormatType) => void;
  onClear: () => void;
  formatOptions: Array<{ value: FormatType; label: string }>;
  labels: {
    inputLabel: string;
    supportedProtocols: string;
    formatTypes: Record<string, string>;
    clear: string;
    itemsFound: string;
  };
}

export const InputSection = memo(({
  input,
  inputFormat,
  inputLanguage,
  inputPlaceholder,
  itemCount,
  onInputChange,
  onFormatChange,
  onClear,
  formatOptions,
  labels,
}: InputSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const infoButton = (
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
        <Info className="w-4 h-4" />
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle
              className="flex items-center gap-2 cursor-pointer hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
              onClick={() => setDialogOpen(true)}
            >
              <FileText className="w-5 h-5" />
              {labels.inputLabel}
            </CardTitle>
            <FormatSelector
              value={inputFormat}
              onChange={onFormatChange}
              options={formatOptions}
              infoButton={infoButton}
            />
          </div>
        </CardHeader>
        <CardContent>
          <PreviewEditor
            value={input}
            language={inputLanguage}
            height="300px"
            placeholder={inputPlaceholder}
            onChange={onInputChange}
          />
          <ItemCount
            count={itemCount}
            onClear={onClear}
            clearLabel={labels.clear}
            countLabel={labels.itemsFound}
          />
        </CardContent>
      </Card>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{labels.supportedProtocols}</DialogTitle>
          <DialogDescription>All proxy protocols are supported for conversion</DialogDescription>
        </DialogHeader>
        <ProtocolCards />
      </DialogContent>
    </Dialog>
  );
});

InputSection.displayName = 'InputSection';
