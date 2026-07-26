import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { cn } from '@/utils/cn';

interface AnimatedCounterProps {
  /** Numeric target value (accepts strings like "500") */
  value: string | number;
  /** Text appended after the number, e.g. "+" or "k" */
  suffix?: string;
  /** Text shown above the number */
  label: string;
  /** Longer description below the label */
  description?: string;
  /** Lucide icon component or emoji/text fallback */
  icon?: React.ReactNode;
  /** Extra class names on the wrapper */
  className?: string;
}

/**
 * Animated counter that counts from 0 → target when it enters the viewport.
 *
 * ```tsx
 * <AnimatedCounter value="500" suffix="+" label="Projects Completed" description="Across 30+ countries" />
 * ```
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  label,
  description,
  icon,
  className,
}) => {
  const target = typeof value === 'string'
    ? (parseInt(value.replace(/\D/g, ''), 10) || 0)
    : (value ?? 0);

  const { currentValue, ref } = useAnimatedCounter({ target, duration: 2200 });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center text-center p-6 rounded-2xl',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 w-12 h-12 rounded-xl bg-[#25408F]/10 flex items-center justify-center text-[#25408F]">
          {icon}
        </div>
      )}

      {/* Number */}
      <div className="flex items-end gap-0.5 leading-none mb-2">
        <span className="text-4xl sm:text-5xl font-black text-[#25408F] tabular-nums">
          {currentValue.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-2xl sm:text-3xl font-black text-[#D3232E] mb-0.5">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-1">{label}</p>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 leading-relaxed max-w-[14rem]">{description}</p>
      )}
    </motion.div>
  );
};

export default AnimatedCounter;
