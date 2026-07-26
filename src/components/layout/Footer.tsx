import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  // Film,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ChevronRight,
  LogIn,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES_LINKS = [
  { label: 'Documentary Production',   to: '/services/documentary-production' },
  { label: 'Livestreaming & Events',   to: '/services/livestreaming-events' },
  { label: 'Photography',              to: '/services/photography' },
  { label: 'Events Management',        to: '/services/events-management' },
  { label: 'Audio Management',         to: '/services/audio-management-soundtrack-development' },
  { label: 'Videography',              to: '/services/videography' },
  { label: 'Brand Strategy',           to: '/services/brand-strategy' },
  { label: 'Creative Media',           to: '/services/creative-media' },
  { label: 'Drone Services',           to: '/services/drone-services' },
  { label: 'Corporate Communications', to: '/services/corporate-communications' },
  { label: 'Commercial Productions',   to: '/services/commercial-productions' },
  { label: 'Digital Content Creation', to: '/services/digital-content-creation' },
];

const COMPANY_LINKS = [
  { label: 'About Us',  to: '/about' },
  { label: 'Our Team',  to: '/about' },
  { label: 'Careers',   to: '/careers' },
  { label: 'News',      to: '/blog' },
];

const PORTFOLIO_LINKS = [
  { label: 'Documentary',    to: '/portfolio/documentary' },
  { label: 'Corporate Film', to: '/portfolio/corporate-film' },
  { label: 'Photography',    to: '/portfolio/photography' },
  { label: 'Events',         to: '/portfolio/events' },
  { label: 'Branding',       to: '/portfolio/branding' },
];

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/dencastglobal/' },
  { icon: Facebook,  label: 'Facebook',  href: 'https://www.facebook.com/dencastglobal' },
  { icon: Twitter,   label: 'Twitter/X', href: 'https://x.com/DencastL' },
  { icon: Linkedin,  label: 'LinkedIn',  href: 'https://ke.linkedin.com/in/dencast-global-976b66224' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://www.youtube.com/@dencastglobal3672' },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.55, ease: 'easeOut' } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FooterLinkItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors duration-200 group"
    >
      <ChevronRight
        size={12}
        className="text-[#D3232E] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
      />
      {label}
    </Link>
  </li>
);

const FooterHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
    <span className="inline-block w-5 h-0.5 bg-[#D3232E] rounded-full" />
    {children}
  </h3>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001f3f] text-slate-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
      >
        {/* ── Top section ─────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Col 1: Brand ── */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <img
                  src="/dencast_new_logo/Dencast Logo_Full.png"
                  alt="Dencast Global"
                  className="h-14 w-auto object-contain"
                />
              </Link>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                Award-winning creative media production company delivering cinematic excellence across documentary, commercial, and digital content globally.
              </p>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 border-white text-white hover:bg-[#D3232E] hover:text-white hover:border-[#D3232E]"
              >
                <LogIn size={10} /> Login
              </Link>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#25408F] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2: Company ── */}
            <div>
              <FooterHeading>Company</FooterHeading>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map(l => <FooterLinkItem key={`${l.to}-${l.label}`} {...l} />)}
              </ul>
            </div>

            {/* ── Col 3: Services ── */}
            <div>
              <FooterHeading>Services</FooterHeading>
              <ul className="space-y-2.5">
                {SERVICES_LINKS.map(l => <FooterLinkItem key={l.to} {...l} />)}
              </ul>
            </div>

            {/* ── Col 4: Portfolio + Contact ── */}
            <div className="space-y-8">
              <div>
                <FooterHeading>Portfolio</FooterHeading>
                <ul className="space-y-2.5">
                  {PORTFOLIO_LINKS.map(l => <FooterLinkItem key={l.to} {...l} />)}
                </ul>
              </div>

              <div>
                <FooterHeading>Contact</FooterHeading>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:info@dencastglobal.co.ke" className="flex items-start gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                      <Mail size={14} className="mt-0.5 flex-shrink-0 text-[#25408F]" />
                      info@dencastglobal.co.ke
                    </a>
                  </li>
                  <li>
                    <a href="tel:+254721710397" className="flex items-start gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                      <Phone size={14} className="mt-0.5 flex-shrink-0 text-[#25408F]" />
                      +254 721 710 397
                    </a>
                  </li>
                  <li>
                    <span className="flex items-start gap-2.5 text-slate-400 text-sm">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#25408F]" />
                      P.O Box 18895-00100, Nairobi | ParkView Suites, Room 101, Nyerere Road
                    </span>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/254721710397"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors duration-200"
                    >
                      <MessageCircle size={13} />
                      Chat on WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Newsletter ───────────────────────────────────────── */}
        {/* <Newsletter /> */}

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="border-t border-white/10 py-5"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {currentYear} Dencast Global. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms"          className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link to="/sitemap"        className="hover:text-slate-300 transition-colors">Sitemap</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
