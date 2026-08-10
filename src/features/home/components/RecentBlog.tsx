import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import BlogCard from '@/components/ui/BlogCard';
import Button from '@/components/ui/Button';
import { BLOG_ARTICLES } from '@/features/blog/articlesData';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── RecentBlog ───────────────────────────────────────────────────────────────

const RecentBlog: React.FC = () => {
  const latestPosts = useMemo(() => {
    // Prefer the featured article first (if present), then fill with most recent posts.
    const featured = BLOG_ARTICLES.find((a) => a.featured);
    const recent = [...BLOG_ARTICLES]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((a) => !featured || a.slug !== featured.slug);

    if (featured) return [featured, ...recent.slice(0, 2)];
    return recent.slice(0, 3);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <SectionLabel label="News" />
            <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#25408F] leading-tight tracking-tight">
              Insights &{' '}
              <span className="text-[#D3232E]">Stories</span>
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-lg leading-relaxed">
              Perspectives on film, brand storytelling, visual culture, and the craft of creative
              media from the Dencast team.
            </p>
          </div>
          <Link to="/blog" className="flex-shrink-0">
            <Button variant="outline" size="md" rightIcon={<ArrowRight size={16} />}>
              View All Articles
            </Button>
          </Link>
        </div>

        {/* ── Blog cards grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {latestPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <BlogCard
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                coverImage={post.coverImage}
                slug={post.slug}
                author={post.author}
                date={post.date}
                readTime={post.readTime}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Newsletter micro-callout ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 p-8 rounded-2xl bg-[#f0f6ff] border border-[#25408F]/10 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-slate-800 font-bold text-lg">
              Get creative insights in your inbox
            </h4>
            <p className="text-slate-500 text-sm mt-1">
              Monthly dispatches on film, brand storytelling, and creative excellence.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#25408F]/30 bg-white min-w-[220px]"
            />
            <Button variant="secondary" size="md">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentBlog;


