import React from 'react';
import { cn } from '@/utils/cn';

interface SectionLabelProps {
  /** Short uppercase label text (e.g. "Our Services") */
  label: string;
  /** Optional longer subtitle / heading below the label */
  subtitle?: string;
  /** Centre-align the content */
  center?: boolean;
  /** Light variant for use on dark/coloured backgrounds */
  light?: boolean;
  /** Extra class names on the wrapper */
  className?: string;
}

/**
 * Reusable section label with a red accent line + optional blue subtitle.
 *
 * ```tsx
 * <SectionLabel label="Our Services" subtitle="What we do best" center />
 * ```
 */
const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  subtitle,
  center = false,
  light = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        center && 'items-center text-center',
        className
      )}
    >
      {/* Eyebrow */}
      <div className={cn('flex items-center gap-2.5', center && 'justify-center')}>
        {/* Red dot */}
        <span className="inline-block w-2 h-2 rounded-full bg-[#D3232E] flex-shrink-0" />
        {/* Red accent line */}
        <span className="inline-block w-8 h-0.5 bg-[#D3232E] rounded-full flex-shrink-0" />
        {/* Label text */}
        <span
          className={cn(
            'text-xs font-bold tracking-[0.25em] uppercase',
            light ? 'text-[#D3232E]' : 'text-[#D3232E]'
          )}
        >
          {label}
        </span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'text-3xl sm:text-4xl font-black leading-tight tracking-tight',
            light ? 'text-white' : 'text-[#25408F]'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionLabel;
