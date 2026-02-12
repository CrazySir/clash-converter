import Image from 'next/image';

interface ConverterHeaderProps {
  title: string;
  subtitle: string;
}

export function ConverterHeader({ title, subtitle }: ConverterHeaderProps) {
  return (
    <div className="text-center space-y-1 md:space-y-2">
      <Image src="/clash_converter.svg" alt={title} width={240} height={80} className="mx-auto" />
      <p className="text-sm md:text-base text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
