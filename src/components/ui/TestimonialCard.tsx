import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  rating?: number;
  /** URL to avatar image */
  avatar?: string;
  className?: string;
}

// ─── Star rating ──────────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={cn(
          'transition-colors',
          i < rating ? 'fill-[#D72638] text-[#D72638]' : 'fill-slate-200 text-slate-200'
        )}
      />
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ src?: string; name: string }> = ({ src, name }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-[#0056A6] flex items-center justify-center ring-2 ring-white ring-offset-1">
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="text-white text-sm font-bold">{initials}</span>
      )}
    </div>
  );
};

// ─── TestimonialCard ──────────────────────────────────────────────────────────

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  title,
  company,
  rating = 5,
  avatar,
  className,
}) => (
  <motion.article
    whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)' }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={cn(
      'relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4',
      className
    )}
  >
    {/* Large decorative quote icon */}
    <Quote
      size={40}
      className="absolute top-5 right-6 text-[#0056A6]/10 fill-[#0056A6]/10"
      aria-hidden
    />

    {/* Rating */}
    <StarRating rating={rating} />

    {/* Quote text */}
    <blockquote className="text-slate-600 text-sm leading-relaxed flex-1 relative z-10">
      &ldquo;{quote}&rdquo;
    </blockquote>

    {/* Author row */}
    <footer className="flex items-center gap-3 pt-2 border-t border-slate-100">
      <Avatar src={avatar} name={name} />
      <div>
        <p className="text-slate-800 text-sm font-bold leading-tight">{name}</p>
        <p className="text-slate-500 text-xs mt-0.5">
          {title}
          {company && <>, <span className="text-[#0056A6] font-medium">{company}</span></>}
        </p>
      </div>
    </footer>
  </motion.article>
);

export default TestimonialCard;
