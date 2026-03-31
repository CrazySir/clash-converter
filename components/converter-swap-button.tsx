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
      <div className="mt-2 lg:hidden">
        <Button
          variant="outline"
          className="w-full h-11 rounded-neoMd bg-neo-card dark:bg-neo-cardDark text-neo-foreground dark:text-white font-medium border border-neo-border dark:border-neo-borderDark transition-all duration-200 hover:border-neo-borderStrong dark:hover:border-neo-borderStrongDark disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onClick}
          disabled={disabled}
          size="default"
          title={disabled ? 'Add content to swap formats' : 'Swap input and output formats'}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2 shrink-0" />
          {label || 'Swap Formats'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="default"
      variant="outline"
      className="group relative w-12 h-12 rounded-neoMd bg-neo-card dark:bg-neo-cardDark text-neo-foreground dark:text-white border border-neo-border dark:border-neo-borderDark transition-all duration-200 hover:border-neo-borderStrong dark:hover:border-neo-borderStrongDark hover:bg-neo-canvas dark:hover:bg-neo-canvasDark disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={onClick}
      title={disabled ? 'Add content to swap formats' : 'Swap input and output formats'}
      disabled={disabled}
      aria-label="Swap formats"
    >
      <ArrowRightLeft className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
    </Button>
  );
}