import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { Search, ChevronRight, ChevronLeft, Mail, Send } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import BlogCard from '@/components/ui/BlogCard';
import { SITE_NAME } from '@/utils/constants';
import { subscribeNewsletter } from '@/services/supabase.service';

// ─── Static articles ──────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Documentary', 'Branding', 'Technology', 'Events', 'Industry', 'Behind the Scenes'];

const PEXELS_IDS = ['3379934', '2873486', '1884577', '3756132', '7034014', '7247399', '3756132', '3866149', '3379932'];

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageId: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'future-of-african-documentary-2024',
    title: 'The Future of African Documentary in the Streaming Age',
    excerpt: 'As Netflix, Prime Video, and Apple TV+ invest billions in African content, what does the streaming era mean for independent documentary filmmakers on the continent? We explore the opportunities and challenges.',
    category: 'Documentary',
    author: 'Dennis Osei',
    date: '2024-05-15',
    readTime: '8 min read',
    imageId: PEXELS_IDS[0],
    featured: true,
  },
  {
    id: '2',
    slug: 'brand-identity-guide-african-startups',
    title: 'A Complete Brand Identity Guide for African Startups',
    excerpt: 'Why your startup needs a cohesive brand identity from day one, and how to build one without breaking the bank. A practical guide from our brand strategy team.',
    category: 'Branding',
    author: 'Abena Korkor',
    date: '2024-05-08',
    readTime: '6 min read',
    imageId: PEXELS_IDS[1],
  },
  {
    id: '3',
    slug: 'drone-cinematography-regulations-africa',
    title: 'Drone Cinematography: Navigating Regulations Across Africa',
    excerpt: 'From Ghana to Kenya, drone regulations vary dramatically. Our licensed aerial team breaks down what filmmakers and brands need to know before flying.',
    category: 'Technology',
    author: 'Kwame Mensah',
    date: '2024-04-30',
    readTime: '5 min read',
    imageId: PEXELS_IDS[2],
  },
  {
    id: '4',
    slug: 'hybrid-events-production-guide',
    title: 'The Ultimate Guide to Hybrid Event Production in 2024',
    excerpt: 'In-person meets digital: how to produce events that deliver an exceptional experience for both your room audience and your global online viewers simultaneously.',
    category: 'Events',
    author: 'Dennis Osei',
    date: '2024-04-22',
    readTime: '10 min read',
    imageId: PEXELS_IDS[3],
  },
  {
    id: '5',
    slug: 'storytelling-commercial-video-roi',
    title: 'How Storytelling Increases Commercial Video ROI by 300%',
    excerpt: 'The data is clear: brands that lead with authentic narrative outperform product-first advertisers across every metric. Here\'s the science and strategy behind it.',
    category: 'Industry',
    author: 'Efua Boateng',
    date: '2024-04-15',
    readTime: '7 min read',
    imageId: PEXELS_IDS[4],
  },
  {
    id: '6',
    slug: 'behind-the-lens-voices-of-the-nile',
    title: 'Behind the Lens: Making Voices of the Nile',
    excerpt: 'Director Dennis Osei shares the six-month journey of embedding with Nile communities — the trust built, the challenges faced, and the moments that changed everything.',
    category: 'Behind the Scenes',
    author: 'Dennis Osei',
    date: '2024-04-08',
    readTime: '12 min read',
    imageId: PEXELS_IDS[5],
  },
  {
    id: '7',
    slug: '4k-vs-8k-production-guide',
    title: '4K vs. 8K: What Resolution Actually Matters for Your Production',
    excerpt: 'Should you invest in 8K cinema for your next project? Our cinematography team gives an honest breakdown of when resolution matters — and when it doesn\'t.',
    category: 'Technology',
    author: 'Kwame Mensah',
    date: '2024-03-28',
    readTime: '6 min read',
    imageId: PEXELS_IDS[6],
  },
  {
    id: '8',
    slug: 'building-pan-african-brand-voice',
    title: 'Building a Pan-African Brand Voice That Resonates Everywhere',
    excerpt: 'A brand voice that works in Lagos may fall flat in Nairobi. Our strategy team shares the framework for developing messaging that resonates across diverse African markets.',
    category: 'Branding',
    author: 'Abena Korkor',
    date: '2024-03-20',
    readTime: '9 min read',
    imageId: PEXELS_IDS[7],
  },
  {
    id: '9',
    slug: 'social-media-video-trends-2024',
    title: 'Social Media Video Trends to Watch in the Second Half of 2024',
    excerpt: 'From vertical long-form to AI-enhanced B-roll — our digital content team identifies the formats and strategies that are driving the highest organic reach on every platform.',
    category: 'Industry',
    author: 'Efua Boateng',
    date: '2024-03-12',
    readTime: '5 min read',
    imageId: PEXELS_IDS[8],
  },
];

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
    <div className="bg-[#0056A6] rounded-2xl p-8">
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D72638] hover:bg-[#b01e2e] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
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

  const featured = ARTICLES.find(a => a.featured);
  const regular = ARTICLES.filter(a => !a.featured);

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
        <meta name="description" content="Articles, insights, and behind-the-scenes stories from Africa's leading creative media production company." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative py-32 bg-[#0056A6] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Blog</span>
          </motion.nav>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-white"
          >
            Stories &{' '}
            <span className="text-[#D72638]">Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-white/70 text-xl max-w-2xl mx-auto"
          >
            Industry insights, creative process stories, and the thinking behind Africa's most powerful media.
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
                  src={`https://images.pexels.com/photos/${featured.imageId}/pexels-photo-${featured.imageId}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#D72638] text-white text-xs font-bold uppercase tracking-widest rounded-md">
                  Featured
                </span>
              </Link>
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-[#0056A6]/10 text-[#0056A6] text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-fit">
                  {featured.category}
                </span>
                <Link to={`/blog/${featured.slug}`}>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight hover:text-[#0056A6] transition-colors mb-4">
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
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#0056A6] text-white shadow-md'
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
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0056A6] focus:ring-1 focus:ring-[#0056A6] transition-colors"
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
                    className="mt-6 px-5 py-2.5 bg-[#0056A6] text-white rounded-lg text-sm font-semibold hover:bg-[#004a8f] transition-colors"
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
                        coverImage={`https://images.pexels.com/photos/${article.imageId}/pexels-photo-${article.imageId}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
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
                  {CATEGORIES.filter(c => c !== 'All').map(cat => {
                    const count = regular.filter(a => a.category === cat).length;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeCategory === cat
                              ? 'bg-[#0056A6] text-white font-semibold'
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
                  {ARTICLES.slice(0, 4).map(a => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="flex items-start gap-3 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={`https://images.pexels.com/photos/${a.imageId}/pexels-photo-${a.imageId}.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2`}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#0056A6] transition-colors">{a.title}</p>
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
