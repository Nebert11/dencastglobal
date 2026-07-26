import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ServiceCardProps {
  name: string;
  description: string;
  slug: string;
  icon: React.ReactNode;
  /** When true, shows a frosted glass style instead of white card */
  glassMorphism?: boolean;
  className?: string;
}

/**
 * Service preview card with hover colour-flip and optional glass morphism variant.
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  slug,
  icon,
  glassMorphism = false,
  className,
}) => {
  if (glassMorphism) {
    return (
      <Link to={`/services/${slug}`} className="block group outline-none">
        <motion.article
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'hover:bg-white/20 hover:border-white/30 transition-colors duration-300',
            className
          )}
        >
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
            {icon}
          </div>

          {/* Name */}
          <h3 className="text-white font-bold text-base leading-snug">{name}</h3>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed flex-1">{description}</p>

          {/* Arrow */}
          <div className="flex items-center gap-1.5 text-[#D3232E] text-sm font-semibold">
            Learn more
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </motion.article>
      </Link>
    );
  }

  return (
    <Link to={`/services/${slug}`} className="block group outline-none">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm',
          'bg-white',
          'group-hover:bg-[#25408F] group-hover:border-[#25408F] group-hover:shadow-xl group-hover:shadow-[#25408F]/20',
          'transition-all duration-300',
          className
        )}
      >
        {/* Icon circle */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300',
            'bg-[#25408F]/10 text-[#25408F]',
            'group-hover:bg-white/15 group-hover:text-white'
          )}
        >
          {icon}
        </div>

        {/* Name */}
        <h3
          className={cn(
            'font-bold text-base leading-snug transition-colors duration-300',
            'text-slate-800',
            'group-hover:text-white'
          )}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className={cn(
            'text-sm leading-relaxed flex-1 transition-colors duration-300',
            'text-slate-500',
            'group-hover:text-white/80'
          )}
        >
          {description}
        </p>

        {/* Arrow CTA */}
        <div
          className={cn(
            'flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300',
            'text-[#25408F]',
            'group-hover:text-[#D3232E]'
          )}
        >
          Learn more
          <ArrowRight
            size={14}
            className={cn(
              'transition-all duration-200',
              'text-[#D3232E]',
              'group-hover:translate-x-1 group-hover:text-[#D3232E]'
            )}
          />
        </div>

        {/* Decorative corner accent */}
        <span
          className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl rounded-tr-2xl bg-gradient-to-br from-[#D3232E]/0 to-[#D3232E]/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300 pointer-events-none"
          aria-hidden
        />
      </motion.article>
    </Link>
  );
};

export default ServiceCard;
