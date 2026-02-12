import { Button } from '@/components/ui/button';

interface ItemCountProps {
  count: number;
  onClear: () => void;
  clearLabel: string;
  countLabel: string;
}

export function ItemCount({ count, onClear, clearLabel, countLabel }: ItemCountProps) {
  return (
    <div className="mt-3 md:mt-4 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
      <span>{countLabel.replace('{count}', String(count))}</span>
      {count > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs">
          {clearLabel}
        </Button>
      )}
    </div>
  );
}
