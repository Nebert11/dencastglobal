import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MediaCardProps {
  title: string;
  category: string;
  image: string;
  slug: string;
  type?: 'project' | 'service';
  hoverEffect?: boolean;
  className?: string;
}

/**
 * Cinematic media card with overlay reveal on hover.
 */
const MediaCard: React.FC<MediaCardProps> = ({
  title,
  category,
  image,
  slug,
  type = 'project',
  hoverEffect = true,
  className,
}) => {
  const href = type === 'service' ? `/services/${slug}` : `/portfolio/${slug}`;
  const cta  = type === 'service' ? 'View Service' : 'View Project';

  // Handle both local images and Pexels IDs
  const imageUrl = image.includes('/') || image.includes('.')
    ? image
    : `https://images.pexels.com/photos/${image}/pexels-photo-${image}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;

  return (
    <Link to={href} className={cn('block group outline-none', className)}>
      <motion.article
        whileHover={hoverEffect ? { y: -4 } : undefined}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg shadow-black/10"
      >
        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={hoverEffect ? { scale: 1.06 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />

          {/* Gradient overlay – always present, deepens on hover */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-400',
            hoverEffect && 'group-hover:opacity-100'
          )} />

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#25408F]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-md">
            {category}
          </span>

          {/* CTA reveal */}
          {hoverEffect && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <span className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-semibold shadow-lg">
                {cta}
                <ArrowUpRight size={15} />
              </span>
            </motion.div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-4 bg-white">
          <p className="text-xs text-[#D3232E] font-semibold uppercase tracking-widest mb-1">{category}</p>
          <h3 className="text-slate-800 font-bold text-base leading-snug line-clamp-2 group-hover:text-[#25408F] transition-colors duration-200">
            {title}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-[#25408F] text-xs font-semibold">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">{cta}</span>
            <motion.span
              className="ml-auto"
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
            >
              <ArrowUpRight size={14} className="text-[#D3232E]" />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default MediaCard;
