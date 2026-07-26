import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Video,
  Camera,
  Music,
  Zap,
  Lightbulb,
  Layers,
  Plane,
  Briefcase,
  Monitor,
  PenTool,
  Menu,
  X,
  ChevronDown,
  LogIn,
  ArrowRight,
  Star,
  FileText,
} from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/utils/cn';

// ─── Featured service pages (dedicated full pages) ────────────────────────────

const FEATURED_SERVICES = [
  {
    name: 'Documentary Production',
    slug: '/services/documentary-production',
    icon: Film,
    description: 'Award-winning cinematic storytelling',
    badge: 'Featured',
  },
  {
    name: 'Livestreaming & Events',
    slug: '/services/livestreaming-events',
    icon: Zap,
    description: 'Professional global broadcast solutions',
    badge: 'Featured',
  },
  {
    name: 'Photography & Videography',
    slug: '/services/photography',
    icon: Camera,
    description: 'Compelling visuals that move audiences',
    badge: 'Featured',
  },
  {
    name: 'Branding & Creative Media',
    slug: '/services/brand-strategy',
    icon: Lightbulb,
    description: 'Strategic brand identity & campaigns',
    badge: 'Featured',
  },
];

// ─── Other service detail pages ───────────────────────────────────────────────

const OTHER_SERVICES = [
  { name: 'Videography',              slug: '/services/videography',              icon: Video    },
  { name: 'Events Management',        slug: '/services/events-management',        icon: Briefcase },
  { name: 'Audio Management & Soundtrack Development', slug: '/services/audio-management-soundtrack-development', icon: Music },
  { name: 'Brand Strategy',           slug: '/services/brand-strategy',           icon: Lightbulb },
  { name: 'Creative Media',           slug: '/services/creative-media',           icon: Layers   },
  { name: 'Drone Services',           slug: '/services/drone-services',           icon: Plane    },
  { name: 'Corporate Communications', slug: '/services/corporate-communications', icon: Briefcase },
  { name: 'Commercial Productions',   slug: '/services/commercial-productions',   icon: Monitor  },
  { name: 'Digital Content Creation', slug: '/services/digital-content-creation', icon: PenTool  },
];

// ─── Top-level nav links ──────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'About',     to: '/about'     },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'News',      to: '/blog'      },
  { label: 'Contact',   to: '/contact'   },
];

// ─── All mobile nav items (flat list) ────────────────────────────────────────

const MOBILE_ALL_LINKS = [
  { label: 'Home',                      to: '/',             group: 'main'     },
  { label: 'About',                     to: '/about',        group: 'main'     },
  { label: 'Portfolio',                 to: '/portfolio',    group: 'main'     },
  { label: 'News',                      to: '/blog',         group: 'main'     },
  { label: 'Contact',                   to: '/contact',      group: 'main'     },
  { label: 'All Services',              to: '/services',     group: 'services' },
  { label: 'Documentary Production',    to: '/services/documentary-production',  group: 'services' },
  { label: 'Livestreaming & Events',    to: '/services/livestreaming-events',    group: 'services' },
  { label: 'Photography & Videography', to: '/services/photography',             group: 'services' },
  { label: 'Branding & Creative Media', to: '/services/brand-strategy',          group: 'services' },
  { label: 'Videography',               to: '/services/videography',              group: 'services' },
  { label: 'Events Management',         to: '/services/events-management',        group: 'services' },
  { label: 'Audio Management & Soundtrack Development', to: '/services/audio-management-soundtrack-development', group: 'services' },
  { label: 'Brand Strategy',            to: '/services/brand-strategy',           group: 'services' },
  { label: 'Creative Media',            to: '/services/creative-media',           group: 'services' },
  { label: 'Drone Services',            to: '/services/drone-services',           group: 'services' },
  { label: 'Corporate Communications',  to: '/services/corporate-communications', group: 'services' },
  { label: 'Commercial Productions',    to: '/services/commercial-productions',   group: 'services' },
  { label: 'Digital Content Creation',  to: '/services/digital-content-creation', group: 'services' },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const dropdownVariants = {
  hidden:  { opacity: 0, y: -10, scale: 0.97 },
  visible: { opacity: 1, y: 0,   scale: 1,   transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8,  scale: 0.97, transition: { duration: 0.15, ease: 'easeIn'  } },
};

const drawerVariants = {
  hidden:  { x: '100%' },
  visible: { x: 0, transition: { type: 'tween' as const, duration: 0.3, ease: 'easeOut' } },
  exit:    { x: '100%', transition: { type: 'tween' as const, duration: 0.22, ease: 'easeIn'  } },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo: React.FC<{ scrolled: boolean }> = ({ scrolled }) => (
  <Link to="/" className="flex items-center gap-2.5 select-none flex-shrink-0">
    <img
      src={scrolled ? '/dencast_new_logo/Dencast Logo_Full.png' : '/dencast_new_logo/Dencast Logo_ Full White.png'}
      alt="Dencast Global"
      className="h-12 w-auto object-contain transition-all duration-300"
    />
  </Link>
);

// ─── Services Mega Dropdown ───────────────────────────────────────────────────

const ServicesMegaDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const isActive = location.pathname.startsWith('/services');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors duration-200 py-1 relative group',
          isScrolled ? 'text-slate-700 hover:text-[#25408F]' : 'text-white/90 hover:text-white',
          isActive && (isScrolled ? 'text-[#25408F]' : 'text-white')
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Services
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
        {/* Active indicator */}
        <span className={cn(
          'absolute -bottom-1 left-0 h-0.5 bg-[#D3232E] rounded-full transition-all duration-200',
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        )} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25408F] to-[#1f3576] px-6 py-3 flex items-center justify-between">
              <span className="text-white text-xs font-bold tracking-widest uppercase">Our Services</span>
              <Link
                to="/services"
                onClick={() => setOpen(false)}
                className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {/* Featured service pages */}
            <div className="p-4 border-b border-slate-100">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                <Star size={10} className="text-[#D3232E]" /> Featured Pages
              </p>
              <div className="grid grid-cols-2 gap-1">
                {FEATURED_SERVICES.map(svc => {
                  const Icon = svc.icon;
                  return (
                    <Link
                      key={svc.slug}
                      to={svc.slug}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl group hover:bg-[#25408F]/5 transition-colors duration-150 border border-transparent hover:border-[#25408F]/15"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-[#25408F]/10 group-hover:bg-[#25408F] flex items-center justify-center transition-colors duration-200">
                        <Icon size={16} className="text-[#25408F] group-hover:text-white transition-colors duration-200" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-800 group-hover:text-[#25408F] transition-colors duration-200 leading-tight">{svc.name}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{svc.description}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other services */}
            <div className="p-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 px-2 mb-2">
                All Services
              </p>
              <div className="grid grid-cols-2 gap-0.5">
                {OTHER_SERVICES.map(svc => {
                  const Icon = svc.icon;
                  return (
                    <Link
                      key={svc.slug}
                      to={svc.slug}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg group hover:bg-slate-50 transition-colors duration-150"
                    >
                      <Icon size={13} className="text-slate-400 group-hover:text-[#25408F] flex-shrink-0 transition-colors" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{svc.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Not sure where to start?</span>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D3232E] hover:text-[#b71d27] transition-colors"
              >
                Get a free consultation <ArrowRight size={11} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => { onClose(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const mainLinks = MOBILE_ALL_LINKS.filter(l => l.group === 'main');
  const serviceLinks = MOBILE_ALL_LINKS.filter(l => l.group === 'services');

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            variants={drawerVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <Logo scrolled />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5">
              {/* Main links */}
              {mainLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                    location.pathname === to
                      ? 'bg-[#25408F]/10 text-[#25408F]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#25408F]'
                  )}
                >
                  {label}
                </Link>
              ))}

              <a
                href="/dencast_profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#25408F] transition-colors"
              >
                <FileText size={14} />
                Profile
              </a>

              {/* Services accordion */}
              <div className="pt-1">
                <button
                  onClick={() => setServicesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#25408F] transition-colors"
                >
                  <span>Services</span>
                  <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      key="services-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      {/* Featured heading */}
                      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 pt-2 pb-1 flex items-center gap-1.5">
                        <Star size={9} className="text-[#D3232E]" /> Featured
                      </p>
                      {serviceLinks.slice(0, 5).map(({ label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          className={cn(
                            'flex items-center gap-2 pl-6 pr-3 py-2 rounded-lg text-sm transition-colors',
                            location.pathname === to
                              ? 'text-[#25408F] font-semibold bg-[#25408F]/5'
                              : 'text-slate-600 hover:text-[#25408F] hover:bg-slate-50 font-medium'
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25408F]/40 flex-shrink-0" />
                          {label}
                        </Link>
                      ))}

                      {/* All services heading */}
                      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-3 pt-3 pb-1">
                        All Services
                      </p>
                      {serviceLinks.slice(5).map(({ label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          className={cn(
                            'flex items-center gap-2 pl-6 pr-3 py-2 rounded-lg text-sm transition-colors',
                            location.pathname === to
                              ? 'text-[#25408F] font-semibold bg-[#25408F]/5'
                              : 'text-slate-600 hover:text-[#25408F] hover:bg-slate-50 font-medium'
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Footer CTAs */}
            <div className="px-4 py-4 border-t border-slate-100 space-y-2.5 flex-shrink-0">
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-[#D3232E] text-[#D3232E] text-sm font-bold hover:bg-[#D3232E] hover:text-white transition-all duration-200"
              >
                <LogIn size={14} /> Admin Login
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#25408F] text-white text-sm font-bold hover:bg-[#1f3576] transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md shadow-slate-200/50 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Logo scrolled={isScrolled} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'text-sm font-semibold tracking-wide transition-colors duration-200 relative group py-1',
                    isScrolled
                      ? 'text-slate-700 hover:text-[#25408F]'
                      : 'text-white/90 hover:text-white',
                    active && (isScrolled ? 'text-[#25408F]' : 'text-white')
                  )}
                >
                  {label}
                  <span className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-[#D3232E] rounded-full transition-all duration-200',
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  )} />
                </Link>
              );
            })}
            <ServicesMegaDropdown />
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <a
              href="/dencast_profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200',
                isScrolled
                  ? 'border-[#25408F] text-[#25408F] hover:bg-[#25408F] hover:text-white'
                  : 'border-white/50 text-white hover:bg-white/10 hover:border-white'
              )}
            >
              <FileText size={12} /> Profile
            </a>
            {/* <Link
              to="/admin/login"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200',
                isScrolled
                  ? 'border-[#D3232E] text-[#D3232E] hover:bg-[#D3232E] hover:text-white'
                  : 'border-white/50 text-white hover:bg-white/10 hover:border-white'
              )}
            >
              <LogIn size={12} /> Admin
            </Link> */}
            <Link
              to="/contact"
              className="px-5 py-2 rounded-lg bg-[#D3232E] text-white text-sm font-bold hover:bg-[#b71d27] transition-colors shadow-lg shadow-[#D3232E]/25"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className={cn(
              'lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
              isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            )}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
