import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import BlogCard from '@/components/ui/BlogCard';
import Button from '@/components/ui/Button';

//Images
import brand from '/dencast_images/Dencast-Crew-27.jpg';
import documentary from '/dencast_images/TEAM.jpg';
import film from '/dencast_images/9-scaled.jpg';

// ─── Static fallback blog posts ───────────────────────────────────────────────

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Art of Visual Storytelling: How to Move Audiences in the First Moments',
    excerpt:
      'In a world of dwindling attention spans, the opening moments of any film or video are everything. We break down the techniques master cinematographers use to hook viewers instantly.',
    category: 'Film Production',
    coverImage: film,
    slug: 'art-of-visual-storytelling',
    author: 'Dencast Machio',
    date: 'recent',
    readTime: 'Quick read',
  },
  {
    id: '2',
    title: "Documentary Filmmaking in Africa: Capturing Authentic Narratives Without Exploitation",
    excerpt:
      "Africa is one of the world's richest storytelling landscapes — but too often, global productions reduce complex communities to tired tropes. Here's how we do it differently.",
    category: 'Documentary',
    coverImage: documentary,
    slug: 'documentary-filmmaking-africa',
    author: 'Dennis Machio',
    date: 'recent',
    readTime: 'In-depth read',
  },
  {
    id: '3',
    title: 'Brand Films vs. Commercials: Which Format Drives Long-Term Brand Equity?',
    excerpt:
      'Traditional TV spots still have their place, but brand films are reshaping how companies build lasting emotional connections with their audiences. We compare the two formats.',
    category: 'Brand Strategy',
    coverImage: brand,
    slug: 'brand-films-vs-commercials',
    author: 'Dennis Machio',
    date: 'recent',
    readTime: 'Featured read',
  },
];

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
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <SectionLabel label="Our Blog" />
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
          {BLOG_POSTS.map((post) => (
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
