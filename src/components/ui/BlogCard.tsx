import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  slug: string;
  author: string;
  /** ISO date string, e.g. "2024-05-20" */
  date: string;
  /** e.g. "5 min read" */
  readTime: string;
  className?: string;
}

// ─── BlogCard ─────────────────────────────────────────────────────────────────

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  category,
  coverImage,
  slug,
  author,
  date,
  readTime,
  className,
}) => {
  const dateCandidate = new Date(date);
  const hasValidDate = !Number.isNaN(dateCandidate.getTime());
  const formattedDate = hasValidDate
    ? dateCandidate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently published';

  return (
    <motion.article
      whileHover={{
        y: -6,
        boxShadow: '0 24px 48px -8px rgba(0,0,0,0.14)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm', className)}
    >
      {/* ── Cover image ── */}
      <Link to={`/blog/${slug}`} className="block relative aspect-video overflow-hidden">
        <motion.img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0056A6] text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-md">
          {category}
        </span>
      </Link>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User size={11} />
            {author}
          </span>
          <span className="text-slate-200">·</span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formattedDate}
          </span>
          <span className="text-slate-200">·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${slug}`}>
          <h3 className="text-slate-800 font-bold text-base leading-snug line-clamp-2 group-hover:text-[#0056A6] transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>

        {/* Read more */}
        <Link
          to={`/blog/${slug}`}
          className="mt-1 inline-flex items-center gap-1.5 text-[#0056A6] text-sm font-semibold hover:gap-2.5 transition-all duration-200 group/link"
        >
          Read More
          <ArrowRight
            size={15}
            className="text-[#D72638] group-hover/link:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
