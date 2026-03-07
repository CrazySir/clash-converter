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
          className="w-full min-h-11"
          onClick={onClick}
          disabled={disabled}
          size="default"
          title={disabled ? 'Add content to swap formats' : 'Swap input and output formats'}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2 shrink-0" />
          {label}
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
      <Button
        size="default"
        variant="outline"
        className="rounded-full shadow-lg bg-background min-h-10 min-w-10 hover:shadow-xl transition-shadow"
        onClick={onClick}
        title={disabled ? 'Add content to swap formats' : 'Swap input and output formats'}
        disabled={disabled}
        aria-label="Swap formats"
      >
        <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </Button>
    </div>
  );
}
