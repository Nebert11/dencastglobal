import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

type IndicatorStyle = 'mouse' | 'chevron';

interface ScrollIndicatorProps {
  /** Visual style of the indicator */
  style?: IndicatorStyle;
  /** Label beneath the icon */
  label?: string;
  /** Extra Tailwind classes */
  className?: string;
}

// ─── Mouse icon variant ───────────────────────────────────────────────────────

const MouseIndicator: React.FC = () => (
  <div className="relative w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center pt-2">
    <motion.span
      className="w-1 h-2 bg-white/80 rounded-full"
      animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// ─── Chevron stack variant ────────────────────────────────────────────────────

const ChevronIndicator: React.FC = () => (
  <div className="flex flex-col items-center -space-y-3">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ opacity: [0.2, 1, 0.2], y: [0, 5, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown size={20} className="text-white/70" />
      </motion.div>
    ))}
  </div>
);

// ─── ScrollIndicator ──────────────────────────────────────────────────────────

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  style = 'mouse',
  label = 'Scroll to explore',
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
    className={cn('flex flex-col items-center gap-2.5', className)}
  >
    {style === 'mouse' ? <MouseIndicator /> : <ChevronIndicator />}

    {label && (
      <motion.span
        className="text-white/50 text-[10px] font-semibold tracking-[0.25em] uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label}
      </motion.span>
    )}
  </motion.div>
);

export default ScrollIndicator;
