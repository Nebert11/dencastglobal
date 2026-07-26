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
          i < rating ? 'fill-[#D3232E] text-[#D3232E]' : 'fill-slate-200 text-slate-200'
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
    <div className="w-full h-56 md:h-full overflow-hidden flex-shrink-0 bg-[#25408F] flex items-center justify-center">
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="text-white text-2xl font-bold">{initials}</span>
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
      'relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm',
      className
    )}
  >
    {/* Large decorative quote icon */}
    <Quote
      size={40}
      className="absolute top-5 right-6 text-[#25408F]/10 fill-[#25408F]/10"
      aria-hidden
    />

    <div className="relative z-10 flex flex-col md:min-h-[320px] md:flex-row">
      <div className="md:w-64 md:flex-shrink-0">
        <Avatar src={avatar} name={name} />
      </div>

      <div className="flex-1 flex flex-col gap-4 p-6 md:p-8">
        <StarRating rating={rating} />
        <div>
          <p className="text-slate-800 text-base font-bold leading-tight">{name}</p>
          <p className="text-slate-500 text-sm mt-1 leading-snug">
            {title}
            {company && <>, <span className="text-[#25408F] font-medium">{company}</span></>}
          </p>
        </div>
        <blockquote className="text-slate-600 text-sm leading-relaxed flex-1">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>
    </div>
  </motion.article>
);

export default TestimonialCard;
