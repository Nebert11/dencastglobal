import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import MediaCard from '@/components/ui/MediaCard';
import Button from '@/components/ui/Button';

// ─── Static portfolio data ────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  slug: string;
  featured?: boolean;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Voices of the Rift Valley — Feature Documentary',
    category: 'Documentary',
    categorySlug: 'documentary',
    image:
      'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'voices-of-the-rift-valley',
    featured: true,
  },
  {
    id: '2',
    title: 'Safaricom Annual Report Campaign',
    category: 'Corporate',
    categorySlug: 'corporate',
    image:
      'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
    slug: 'safaricom-annual-report',
  },
  {
    id: '3',
    title: 'Heritage Threads — Brand Identity',
    category: 'Branding',
    categorySlug: 'branding',
    image:
      'https://images.pexels.com/photos/1884577/pexels-photo-1884577.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
    slug: 'heritage-threads-brand',
  },
  {
    id: '4',
    title: 'East Africa Wildlife Portrait Series',
    category: 'Photography',
    categorySlug: 'photography',
    image:
      'https://images.pexels.com/photos/3785170/pexels-photo-3785170.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
    slug: 'ea-wildlife-portrait-series',
  },
  {
    id: '5',
    title: 'Nairobi Fashion Week 2024 Coverage',
    category: 'Photography',
    categorySlug: 'photography',
    image:
      'https://images.pexels.com/photos/7034014/pexels-photo-7034014.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
    slug: 'nairobi-fashion-week-2024',
  },
  {
    id: '6',
    title: 'UN Habitat Conference — Live Production',
    category: 'Corporate',
    categorySlug: 'corporate',
    image:
      'https://images.pexels.com/photos/7247399/pexels-photo-7247399.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
    slug: 'un-habitat-conference',
  },
];

const FILTER_TABS = ['All', 'Documentary', 'Corporate', 'Photography', 'Branding'];

// ─── FeaturedPortfolio ────────────────────────────────────────────────────────

const FeaturedPortfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((p) => p.category === activeFilter);

  const featuredItem = filtered.find((p) => p.featured) ?? filtered[0];
  const gridItems = filtered.filter((p) => p.id !== featuredItem?.id).slice(0, 4);

  return (
    <section className="py-24 bg-[#f0f6ff]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <SectionLabel label="Our Work" />
            <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#0056A6] leading-tight tracking-tight">
              Cinematic Stories,{' '}
              <span className="text-[#D72638]">Real Results</span>
            </h2>
          </div>
          <Link to="/portfolio">
            <Button variant="outline" size="md" rightIcon={<ArrowRight size={16} />}>
              View Full Portfolio
            </Button>
          </Link>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === tab
                  ? 'bg-[#0056A6] text-white shadow-md shadow-[#0056A6]/30'
                  : 'bg-white text-slate-600 hover:bg-[#0056A6]/10 hover:text-[#0056A6] border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Portfolio grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left: featured large card */}
            {featuredItem && (
              <div className="lg:row-span-2">
                <div className="h-full">
                  <Link to={`/portfolio/${featuredItem.slug}`} className="block h-full group">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg h-full min-h-[400px]"
                    >
                      <img
                        src={featuredItem.image}
                        alt={featuredItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#D72638] text-white text-xs font-bold uppercase tracking-widest rounded-md">
                        Featured
                      </span>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[#D72638] text-xs font-bold uppercase tracking-widest">
                          {featuredItem.category}
                        </span>
                        <h3 className="text-white font-bold text-xl mt-1 leading-snug">
                          {featuredItem.title}
                        </h3>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </div>
            )}

            {/* Right: 4 smaller cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gridItems.map((item) => (
                <MediaCard
                  key={item.id}
                  title={item.title}
                  category={item.category}
                  image={item.image}
                  slug={item.slug}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedPortfolio;
