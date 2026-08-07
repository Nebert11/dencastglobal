import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, Filter, Play, X } from 'lucide-react';
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
  { title: 'Sasini Sustainability Report Launch — Full Event', url: 'https://www.youtube.com/watch?v=QnnVSv48PIM&t=1787s' },
  { title: 'EU Ambassador — EU Business Forum Kenya', url: 'https://www.youtube.com/watch?v=WIWK8EugC1c' },
  { title: 'RHNK Pan-African Conference 2025 Highlights', url: 'https://www.youtube.com/watch?v=_0hFwZtRoqU' },
  { title: 'ELF Africa Annual Report Film', url: 'https://www.youtube.com/watch?v=EgTs8_Bm_RQ&t=20s' },
  { title: 'The Amakove Wala Show — Divorce and Separation', url: 'https://www.youtube.com/watch?v=D1QvoiMpK-Q&t=23s' },
  { title: 'RHNK Pan-African Conference 2026', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk&t=27s' },
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

const getYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim();
    }

    return parsed.searchParams.get('v') ?? '';
  } catch {
    return '';
  }
};

const YOUTUBE_VIDEO_DURATIONS: Record<string, string> = {
  '2HF4pXkmntk': '19:00',
  '632y28-SHt8': '3:15',
  '82Ex2fbk96o': '4:11:53',
  'D1QvoiMpK-Q': '1:00:00',
  'EgTs8_Bm_RQ': '5:29',
  'F0sANQiiRxE': '3:29',
  'IybO1Rr95ek': '15:08',
  'JDr9mvraBjM': '7:38',
  'JKVNraadnmw': '0:38',
  'Mx4MYVYGcnE': '4:31:05',
  'NgUnE8g_z6I': '3:06',
  'PxF-Oz5O2xg': '5:37',
  'Q7H3QgmaKp8': '2:16:33',
  'QPwGbAjNSpc': '1:46',
  'QnnVSv48PIM': '1:41:19',
  'WDHIUaR6i-c': '21:15',
  'WIWK8EugC1c': '2:19',
  'XAZXVI6bvOo': '1:20',
  'YGQ0MSiaEXs': '2:45',
  'ZBoB9kyjIw4': '17:45',
  '_0hFwZtRoqU': '1:31',
  '_3NKliaLP-c': '16:10',
  'aMxamcefU8Y': '3:19:30',
  'dyRlpkwKuY0': '6:43',
  'eVXun6P1x98': '3:35:44',
  'jIVbFh117dA': '2:04',
  'kIpukvtuV48': '1:46',
  'mblSEtbtGD8': '4:27',
  'nQcN6uXbDss': '1:21',
  'nhfmECVhyRg': '0:38',
  'oG_IAvExIqM': '4:08',
  'p2ydGxuTK5U': '2:19',
  'q-I1iYGhLPk': '2:30',
  'ueiIbj_OiV8': '7:00:27',
  'zeLCnl_wASw': '1:18',
};

const getVideoDurationByUrl = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? YOUTUBE_VIDEO_DURATIONS[id] ?? '' : '';
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: '1',  slug: 'sasini-sustainability-report', title: 'Sasini Sustainability Report Launch', category: 'Corporate',   image: sasiniConference, featured: true },
  { id: '3',  slug: 'european-union-videos',         title: 'European Union Ambassador — EU Business Forum', category: 'Corporate',   image: africatalyst, featured: true },
  { id: '2',  slug: 'elf-africa',                   title: 'ELF Africa',                         category: 'Corporate',   image: elf },
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
  const [activeFeaturedVideoIndex, setActiveFeaturedVideoIndex] = useState<number | null>(null);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

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

  useEffect(() => {
    setActiveFeaturedVideoIndex(null);
  }, []);

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
            {PORTFOLIO_VIDEO_LINKS.map((video, index) => {
              const videoId = getYoutubeId(video.url);
              const thumbnailSrc = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : '/dencast_images/WEBSITE-PHOTO.jpg';
              const duration = getVideoDurationByUrl(video.url);

              return (
              <button
                key={video.url}
                type="button"
                onClick={() => setActiveFeaturedVideoIndex(index)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-[#25408F]/40 hover:bg-[#25408F]/5 transition-all duration-300 text-left group"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                  <img
                    src={thumbnailSrc}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Play size={20} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                  {duration && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-semibold tracking-wide shadow-md">
                      {duration}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">{video.title}</p>
              </button>
              );
            })}
          </div>
        </div>
      </section>

      {modalRoot && activeFeaturedVideoIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveFeaturedVideoIndex(null)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Featured Video</p>
                <p className="text-sm sm:text-base font-semibold">{PORTFOLIO_VIDEO_LINKS[activeFeaturedVideoIndex].title}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFeaturedVideoIndex(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src={`${toYoutubeEmbedUrl(PORTFOLIO_VIDEO_LINKS[activeFeaturedVideoIndex].url)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={PORTFOLIO_VIDEO_LINKS[activeFeaturedVideoIndex].title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>,
        modalRoot,
      )}

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
