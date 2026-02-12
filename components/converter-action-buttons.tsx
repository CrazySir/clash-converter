import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';

interface ActionButtonsProps {
  onDownload: () => void;
  onCopy: () => void;
  disabled?: boolean;
  downloadLabel: string;
  copyLabel: string;
}

export function ActionButtons({ onDownload, onCopy, disabled, downloadLabel, copyLabel }: ActionButtonsProps) {
  return (
    <div className="mt-3 md:mt-4 flex gap-2">
      <Button
        onClick={onDownload}
        disabled={disabled}
        className="flex-1 text-sm"
        size="sm"
      >
        <Download className="w-4 h-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">{downloadLabel}</span>
      </Button>
      <Button
        variant="outline"
        onClick={onCopy}
        disabled={disabled}
        size="sm"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden md:inline ml-1 md:ml-2">{copyLabel}</span>
      </Button>
    </div>
  );
}
