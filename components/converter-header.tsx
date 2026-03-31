import Image from 'next/image';

interface ConverterHeaderProps {
  title: string;
  subtitle: string;
}

export function ConverterHeader({ title, subtitle }: ConverterHeaderProps) {
  return (
    <header className="text-center space-y-3 md:space-y-4 mb-6 md:mb-8">
      {/* Logo with sharp scale transition */}
      <div className="relative inline-block">
        <Image
          src="/clash_converter.svg"
          alt={title}
          width={260}
          height={80}
          className="mx-auto max-w-[180px] md:max-w-[220px] lg:max-w-none transition-transform duration-300 hover:scale-[1.02]"
        />
        {/* Accent underline - structural element */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-neo-foreground/30 dark:bg-white/30 rounded-full" />
      </div>

      {/* Subtitle - refined typography */}
      <p className="text-sm md:text-base text-neo-muted dark:text-neo-mutedLight max-w-xl mx-auto leading-relaxed font-normal tracking-tight">
        {subtitle}
      </p>
    </header>
  );
}