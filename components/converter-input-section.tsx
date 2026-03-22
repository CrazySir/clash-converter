import { useState, memo } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
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
              title="Click to view supported protocols"
              aria-label={`View supported protocols for ${labels.inputLabel}`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-600 neo-button transition-all duration-300 group-hover:scale-105">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-lavender-600 transition-colors duration-300"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {labels.inputLabel}
              </span>
            </CardTitle>
            <FormatSelector
              value={inputFormat}
              onChange={onFormatChange}
              options={formatOptions}
              infoButton={infoButton}
            />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">
          <PreviewEditor
            value={input}
            language={inputLanguage}
            height="300px"
            placeholder={inputPlaceholder}
            onChange={onInputChange}
            className="flex-1"
          />
          <ItemCount
            count={itemCount}
            onClear={onClear}
            clearLabel={labels.clear}
            countLabel={labels.itemsFound}
          />
        </CardContent>
      </Card>
      <DialogContent className="max-w-md rounded-[2.5rem] border-white/60 bg-lavender-50 neo-card">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-black text-slate-700"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {t('dialog.protocolsTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t('dialog.protocolsDescription')}
          </DialogDescription>
        </DialogHeader>
        <ProtocolCards />
      </DialogContent>
    </Dialog>
  );
});

InputSection.displayName = 'InputSection';
