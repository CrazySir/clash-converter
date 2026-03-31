import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormatType } from '@/lib/parser';

interface FormatSelectorProps {
  value: FormatType;
  onChange: (value: FormatType) => void;
  options: Array<{ value: FormatType; label: string }>;
  infoButton?: React.ReactNode;
}

export function FormatSelector({ value, onChange, options, infoButton }: FormatSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Select value={value} onValueChange={(val) => onChange(val as FormatType)} aria-label="Select format">
        <SelectTrigger className="w-auto min-w-[130px] max-w-[160px] h-8 rounded-neoMd bg-neo-canvas dark:bg-neo-canvasDark border border-neo-border dark:border-neo-borderDark text-sm font-medium text-neo-foreground dark:text-white transition-all duration-200 hover:border-neo-borderStrong dark:hover:border-neo-borderStrongDark focus:ring-2 focus:ring-neo-borderStrong dark:focus:ring-neo-borderStrongDark">
          <SelectValue className="truncate" />
        </SelectTrigger>
        <SelectContent className="rounded-neoMd border border-neo-border dark:border-neo-borderDark bg-neo-card dark:bg-neo-cardDark">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-neo mb-0.5 font-medium text-neo-foreground dark:text-white hover:bg-neo-border dark:hover:bg-neo-borderDark transition-colors duration-150 last:mb-0"
            >
              <span className="truncate block max-w-[180px]">{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {infoButton}
    </div>
  );
}