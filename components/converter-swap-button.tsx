import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'desktop' | 'mobile';
  label?: string;
}

export function SwapButton({ onClick, disabled, variant = 'desktop', label }: SwapButtonProps) {
  if (variant === 'mobile') {
    return (
      <div className="mt-3 md:mt-4 md:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={onClick}
          disabled={disabled}
          size="sm"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          {label}
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
      <Button
        size="sm"
        variant="outline"
        className="rounded-full shadow-lg bg-background"
        onClick={onClick}
        title="Swap formats"
        disabled={disabled}
      >
        <ArrowRightLeft className="w-4 h-4" />
      </Button>
    </div>
  );
}
