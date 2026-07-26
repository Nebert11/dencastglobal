import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

// ─── CVA definition ───────────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        /** Solid red – primary call-to-action */
        primary: [
          'bg-[#D3232E] text-white shadow-md shadow-[#D3232E]/25',
          'hover:bg-[#b71d27] hover:shadow-lg hover:shadow-[#D3232E]/30',
          'focus-visible:ring-[#D3232E]',
          'active:scale-[0.97]',
        ],
        /** Solid blue – secondary action */
        secondary: [
          'bg-[#25408F] text-white shadow-md shadow-[#25408F]/20',
          'hover:bg-[#1f3576] hover:shadow-lg hover:shadow-[#25408F]/25',
          'focus-visible:ring-[#25408F]',
          'active:scale-[0.97]',
        ],
        /** Outlined – neutral / tertiary */
        outline: [
          'border-2 border-[#25408F] text-[#25408F] bg-transparent',
          'hover:bg-[#25408F] hover:text-white',
          'focus-visible:ring-[#25408F]',
          'active:scale-[0.97]',
        ],
        /** Ghost white – for use on dark / image backgrounds */
        ghost: [
          'bg-white/10 border border-white/30 text-white backdrop-blur-sm',
          'hover:bg-white/20 hover:border-white/50',
          'focus-visible:ring-white',
          'active:scale-[0.97]',
        ],
        /** Icon-only round button */
        icon: [
          'rounded-full bg-white/10 border border-white/20 text-white',
          'hover:bg-[#25408F] hover:border-[#25408F]',
          'focus-visible:ring-[#25408F]',
          'active:scale-[0.95]',
        ],
      },
      size: {
        sm: 'text-xs px-3.5 py-1.5',
        md: 'text-sm px-5 py-2.5',
        lg: 'text-base px-7 py-3.5',
      },
    },
    compoundVariants: [
      // Icon variant needs equal padding regardless of size
      { variant: 'icon', size: 'sm', class: 'p-2' },
      { variant: 'icon', size: 'md', class: 'p-2.5' },
      { variant: 'icon', size: 'lg', class: 'p-3' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Lucide icon or any React node rendered before the label */
  leftIcon?: React.ReactNode;
  /** Lucide icon or any React node rendered after the label */
  rightIcon?: React.ReactNode;
  /** Show a subtle press animation */
  animate?: boolean;
  /** Loading state – disables button and shows spinner */
  loading?: boolean;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ─── Button ───────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      className,
      children,
      leftIcon,
      rightIcon,
      animate = true,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = animate ? motion.button : 'button';

    const motionProps = animate
      ? {
          whileTap: { scale: 0.96 },
          whileHover: { scale: 1.02 },
          transition: { type: 'spring', stiffness: 400, damping: 20 },
        }
      : {};

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...(motionProps as object)}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
export default Button;
