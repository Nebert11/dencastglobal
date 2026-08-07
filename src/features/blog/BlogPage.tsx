import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { Search, ChevronRight, ChevronLeft, Mail, Send } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import BlogCard from '@/components/ui/BlogCard';
import { SITE_NAME } from '@/utils/constants';
import { subscribeNewsletter } from '@/services/data.service';
import { BLOG_ARTICLES, BLOG_CATEGORIES } from './articlesData';

const PAGE_SIZE = 6;

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── Newsletter signup ────────────────────────────────────────────────────────

const NewsletterBlock: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const res = await subscribeNewsletter(email, name || undefined);
    setStatus(res.status === 'success' ? 'success' : 'error');
  };

  return (
    <div className="bg-[#25408F] rounded-2xl p-8">
      <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4">
        <Mail size={22} className="text-white" />
      </div>
      <h3 className="text-white font-black text-xl mb-2">Stories in Your Inbox</h3>
      <p className="text-white/70 text-sm mb-6 leading-relaxed">
        Get our latest articles, insights, and behind-the-scenes content delivered weekly.
      </p>

      {status === 'success' ? (
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-white font-semibold">✓ You're subscribed!</p>
          <p className="text-white/70 text-sm mt-1">Thanks for joining. Check your inbox soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D3232E] hover:bg-[#b71d27] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            <Send size={14} />
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
          {status === 'error' && (
            <p className="text-red-300 text-xs text-center">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
};

// ─── BlogPage ─────────────────────────────────────────────────────────────────

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const featured = BLOG_ARTICLES.find(a => a.featured);
  const regular = BLOG_ARTICLES.filter(a => !a.featured);

  const filtered = useMemo(() => {
    let items = regular;
    if (activeCategory !== 'All') {
      items = items.filter(a => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery, regular]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Stories & Insights | {SITE_NAME}</title>
        <meta name="description" content="Ideas, perspectives and conversations from across industries, communities and everyday life — exploring the issues, innovations, people and stories shaping our world." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex items-center justify-center bg-[#25408F] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/dencast_images/stories.png)', backgroundSize: 'cover', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#25408F]/65" aria-hidden="true" />
        {/* <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Blog</span>
          </motion.nav>
        </div> */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-white"
          >
            Insights &{' '}
            <span className="text-[#D3232E]">Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-white/70 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Ideas, perspectives and conversations from across industries, communities and everyday life — exploring the issues, innovations, people and stories shaping our world.
          </motion.p>
        </div>
        

      </section>

      {/* ── Featured Article ── */}
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <SectionLabel label="Featured Article" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100"
            >
              <Link to={`/blog/${featured.slug}`} className="block relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#D3232E] text-white text-xs font-bold uppercase tracking-widest rounded-md">
                  Featured
                </span>
              </Link>
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-[#25408F]/10 text-[#25408F] text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-fit">
                  {featured.category}
                </span>
                <Link to={`/blog/${featured.slug}`}>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight hover:text-[#25408F] transition-colors mb-4">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-slate-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
                  <span>By {featured.author}</span>
                  <span>·</span>
                  <span>{new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <Link to={`/blog/${featured.slug}`}>
                  <Button variant="primary" size="md" rightIcon={<ChevronRight size={15} />}>
                    Read Article
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Filter bar ── */}
      <section className="py-6 bg-slate-50 border-y border-slate-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#25408F] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#25408F] focus:ring-1 focus:ring-[#25408F] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Article Grid + Sidebar ── */}
      <section ref={gridRef} className="py-16 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Grid */}
            <div className="lg:col-span-2">
              {paginated.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <p className="text-5xl mb-4">📖</p>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
                  <p className="text-slate-500">Try adjusting your search or category filter.</p>
                  <button
                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                    className="mt-6 px-5 py-2.5 bg-[#25408F] text-white rounded-lg text-sm font-semibold hover:bg-[#1f3576] transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  variants={stagger} initial="hidden" animate={gridInView ? 'visible' : 'hidden'}
                  className="grid sm:grid-cols-2 gap-6"
                >
                  {paginated.map((article, i) => (
                    <motion.div key={article.id} custom={i} variants={fadeUp}>
                      <BlogCard
                        title={article.title}
                        excerpt={article.excerpt}
                        category={article.category}
                        coverImage={article.coverImage}
                        slug={article.slug}
                        author={article.author}
                        date={article.date}
                        readTime={article.readTime}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline" size="md"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    leftIcon={<ChevronLeft size={15} />}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline" size="md"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    rightIcon={<ChevronRight size={15} />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <NewsletterBlock />

              {/* Categories sidebar */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Browse Topics</h3>
                <ul className="space-y-2">
                  {BLOG_CATEGORIES.filter(c => c !== 'All').map(cat => {
                    const count = regular.filter(a => a.category === cat).length;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeCategory === cat
                              ? 'bg-[#25408F] text-white font-semibold'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                          <span className={`text-xs ${activeCategory === cat ? 'text-white/80' : 'text-slate-400'}`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Popular posts */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {BLOG_ARTICLES.slice(0, 4).map(a => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="flex items-start gap-3 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={a.coverImage}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#25408F] transition-colors">{a.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{a.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
