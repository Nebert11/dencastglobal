import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import MediaCard from '@/components/ui/MediaCard';
import { SITE_NAME } from '@/utils/constants';


//Images
import sasiniConference from '/dencast_images/sasini_conference.jpg';
import amakowe from '/dencast_images/amakowe.jpg';
import africatalyst from '/dencast_images/africatalyst.jpg';
import europeday from '/dencast_images/DSC_3798-scaled.jpg';
import elf from '/dencast_images/elf.png';
import event1 from '/dencast_images/event1.jpg';
import rhnk from '/dencast_images/rhnk.jpg';
import liveStreaming from '/dencast_images/Virtual-livestreaming-scaled.jpg';
import whiteBeach from '/dencast_images/White-Beach-Palace.jpg';
import basketball from '/dencast_images/basketball.jpg';
import conference from '/dencast_images/CONFERENCE.png';
import graphics from '/dencast_images/image.png';

// ─── Static portfolio data ────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Corporate', 'Photography', 'Events', 'Streaming', 'Commercial', 'Graphics Design'];

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  featured?: boolean;
}

const PORTFOLIO_VIDEO_LINKS = [
  { title: 'Sasini Report Launch', url: 'https://www.youtube.com/watch?v=QnnVSv48PIM&t=1787s' },
  { title: 'EU Ambassador', url: 'https://www.youtube.com/watch?v=WIWK8EugC1c' },
  { title: 'RHNK Pan-African Conference 2025 Highlights ', url: 'https://www.youtube.com/watch?v=_0hFwZtRoqU' },
  { title: 'ELF-Africa Annual Report ', url: 'https://www.youtube.com/watch?v=EgTs8_Bm_RQ&t=20s' },
  { title: 'THE AMAKOVE WALA SHOW 1 - Divorce and Separation ', url: 'https://www.youtube.com/watch?v=D1QvoiMpK-Q&t=23s' },
  { title: 'RHNK Pan-African Conference 2026 ', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk&t=27s' },
];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: '1', slug: 'voices-of-the-nile', title: 'Sasini Annual Report', category: 'Corporate', image: sasiniConference, featured: true },
  { id: '2', slug: 'mtn-brand-relaunch', title: 'The Amakowe Wala Show', category: 'Streaming', image: amakowe },
  { id: '3', slug: 'accra-fashion-week', title: "Amplifying Africa's Voice", category: 'Events', image: africatalyst },
  { id: '4', slug: 'corporate-summit-2024', title: 'Europe Day Football Kenya', category: 'Corporate', image: europeday },
  { id: '5', slug: 'kasapreko-commercial', title: 'Building Leaders Through Story', category: 'Commercial', image: elf },
  { id: '6', slug: 'golden-stool-portrait-series', title: 'African Development Bank Forum', category: 'Photography', image: event1 },
  { id: '7', slug: 'tech-innovators-doc', title: 'RHNK Conference 2024 ', category: 'Events', image: rhnk },
  { id: '8', slug: 'harvest-time-film', title: 'Live Streaming', category: 'Streaming', image: liveStreaming },
  { id: '9', slug: 'stanbic-investor-day', title: 'Hotel Photography', category: 'Commercial', image: whiteBeach },
  { id: '10', slug: 'ghana-music-awards', title: 'Basketball Event', category: 'Events', image: basketball },
  { id: '11', slug: 'nestle-product-launch', title: 'Conference Coverage', category: 'Events', image: conference },
  { id: '12', slug: 'makola-market-story', title: 'Graphics Design', category: 'Graphics Design', image: graphics },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.08 },
//   }),
// };

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.25 } },
};

// ─── Page sections ────────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => (
  <section className="relative min-h-[55vh] flex items-center justify-center bg-[#001f3f] overflow-hidden">
    <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/dencast_images/portfolio.png)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0056A6]/65" aria-hidden="true" />

    {/* <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28">
      <motion.nav
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
      >
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">Portfolio</span>
      </motion.nav>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
      >
        Our <span className="text-[#D72638]">Portfolio</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed"
      >
        A showcase of our most impactful work — from cinematic documentaries to global brand campaigns.
      </motion.p>
    </div> */}
  </section>
);

// ─── PortfolioPage ────────────────────────────────────────────────────────────

const PAGE_SIZE = 9;

const PortfolioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const filtered = useMemo(() => {
    let items = PORTFOLIO_ITEMS;
    if (activeCategory !== 'All') {
      items = items.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return items;
  }, [activeCategory, searchQuery]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > paginated.length;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Portfolio | {SITE_NAME}</title>
        <meta name="description" content="Explore Dencast Global's portfolio of documentary films, brand campaigns, photography, events coverage, and commercial productions across Africa." />
      </Helmet>

      <HeroBanner />

      {/* ── Portfolio Video Highlights ── */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel label="Featured Videos" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">Portfolio - Some of our best</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_VIDEO_LINKS.map((video) => (
              <a
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-[#0056A6]/40 hover:bg-[#0056A6]/5 transition-all duration-300"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0056A6] transition-colors">
                  {video.title}
                </span>
                <ChevronRight size={16} className="text-[#D72638] flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter & Search ── */}
      <section className="py-12 bg-white border-b border-slate-100 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-slate-400 mr-1" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#0056A6] text-white shadow-md shadow-[#0056A6]/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0056A6] focus:ring-1 focus:ring-[#0056A6] transition-colors"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="mt-3 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <span className="text-[#0056A6] font-semibold">{activeCategory}</span></>}
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section ref={gridRef} className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No projects found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0056A6] text-white rounded-lg text-sm font-semibold hover:bg-[#004a8f] transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${activeCategory}-${searchQuery}`}
                variants={stagger} initial="hidden" animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {paginated.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <MediaCard
                        title={item.title}
                        category={item.category}
                        image={item.image}
                        slug={item.slug}
                        type="project"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                variant="outline" size="lg"
                onClick={() => setPage(p => p + 1)}
                rightIcon={<ChevronDown size={16} />}
              >
                Load More Projects ({filtered.length - paginated.length} remaining)
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0056A6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Work With Us" light center />
          <h2 className="mt-4 text-4xl font-black text-white">
            Ready to Create Something Remarkable?
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            Your project could be the next story in our portfolio. Let's talk.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/portfolio">
              <Button variant="primary" size="lg" rightIcon={<ChevronRight size={16} />}>
                Explore Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioPage;
