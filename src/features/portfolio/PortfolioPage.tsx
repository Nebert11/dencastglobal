import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, Filter, ArrowRight, Play } from 'lucide-react';
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
import conference from '/dencast_images/CONFERENCE.png';
import graphics from '/dencast_images/image.png';
import ladonaWithCamera from '/dencast_images/9.png';

// ─── Static portfolio data ────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Corporate', 'Events', 'Streaming', 'Documentary', 'Photography', 'Graphics Design'];

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

const toYoutubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: '1',  slug: 'sasini-sustainability-report', title: 'Sasini Sustainability Report',       category: 'Corporate',   image: sasiniConference, featured: true },
  { id: '2',  slug: 'elf-africa',                   title: 'ELF Africa',                         category: 'Corporate',   image: elf },
  { id: '3',  slug: 'european-union-videos',         title: 'European Union – Media & Digital',   category: 'Corporate',   image: africatalyst },
  { id: '4',  slug: 'europe-day-football',           title: 'Europe Day Football Tournament',      category: 'Corporate',   image: europeday },
  { id: '5',  slug: 'european-investment-bank',      title: 'European Investment Bank',           category: 'Corporate',   image: event1 },
  { id: '6',  slug: 'amakove-wala-show',             title: 'The Amakove Wala Show',              category: 'Streaming',   image: amakowe },
  { id: '7',  slug: 'rhnk-conference',               title: 'RHNK Pan-African Conference',        category: 'Events',      image: rhnk },
  { id: '8',  slug: 'live-streaming',                title: 'Livestreaming Services',             category: 'Streaming',   image: liveStreaming },
  { id: '9',  slug: 'documentaries',                 title: 'Documentary Productions',            category: 'Documentary', image: ladonaWithCamera },
  { id: '10', slug: 'photography',                   title: 'Photography',                        category: 'Photography', image: whiteBeach },
  { id: '11', slug: 'conference-coverage',           title: 'Conference Coverage',                category: 'Events',      image: conference },
  { id: '12', slug: 'graphics-design',               title: 'Graphics & Creative Design',         category: 'Graphics Design', image: graphics },
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

// ─── Portfolio Intro ──────────────────────────────────────────────────────────

const PortfolioIntro: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Text side ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <SectionLabel label="Where Our Story Becomes Our Mission" />

            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Cinematic Stories,{' '}
              <span className="text-[#D3232E]">Real Results</span>
            </h2>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
              Dencast Global is a leading production and creative agency founded in 2015,
              specializing in crafting stories that connect brands with audiences across Africa
              and beyond. From award-winning documentaries and live broadcast solutions to
              brand campaigns and commercial productions — every frame we deliver is built
              to inspire and drive impact.
            </p>

            <p className="mt-4 text-slate-500 leading-relaxed">
              Explore our portfolio of work below. Click any project to dive into
              the full story behind each production.
            </p>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <Link to="/contact">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Start a Project
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" leftIcon={<Play size={16} />}>
                  Our Services
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            {/* <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              {[
                { value: '10+', label: 'Years of Excellence' },
                { value: '200+', label: 'Projects Delivered' },
                { value: '50+', label: 'Clients Served' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-[#25408F]">{value}</p>
                  <p className="mt-1 text-xs text-slate-500 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div> */}
          </motion.div>

          {/* ── Ladona photo side ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.15 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Decorative background blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#25408F]/8 via-transparent to-[#D3232E]/8 rounded-3xl" />

            <div className="relative z-10 bg-gradient-to-b from-slate-100 to-slate-50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/60 w-full">
              {/* Coloured top bar */}
              <div className="h-2 bg-gradient-to-r from-[#25408F] to-[#D3232E]" />

              <div className="px-6 pt-4 pb-0">
                <img
                  src={ladonaWithCamera}
                  alt="Dencast Global camera operator in action"
                  className="w-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Caption strip */}
              <div className="bg-[#25408F] px-6 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-bold">Dencast Global</span>
                <span className="text-white/70 text-xs">Production Crew</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// ─── Page sections ────────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => (
  <section className="relative min-h-[55vh] flex items-center justify-center bg-[#001f3f] overflow-hidden">
    <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/dencast_images/portfolio.png)', backgroundSize: 'cover', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#25408F]/65" aria-hidden="true" />

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
        Our <span className="text-[#D3232E]">Portfolio</span>
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
      <PortfolioIntro />

      {/* ── Portfolio Video Highlights ── */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel label="Featured Videos" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">Portfolio - Featured Videos</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_VIDEO_LINKS.map((video) => (
              <article
                key={video.url}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-[#25408F]/40 hover:bg-[#25408F]/5 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={toYoutubeEmbedUrl(video.url)}
                    title={video.title}
                    className="w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">{video.title}</p>
              </article>
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
                      ? 'bg-[#25408F] text-white shadow-md shadow-[#25408F]/25'
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#25408F] focus:ring-1 focus:ring-[#25408F] transition-colors"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="mt-3 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <span className="text-[#25408F] font-semibold">{activeCategory}</span></>}
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
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25408F] text-white rounded-lg text-sm font-semibold hover:bg-[#1f3576] transition-colors"
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
      <section className="py-20 bg-[#25408F]">
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
