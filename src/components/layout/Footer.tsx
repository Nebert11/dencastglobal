import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Film,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES_LINKS = [
  { label: 'Documentary Production',   to: '/services/documentary-production' },
  { label: 'Livestreaming & Events',   to: '/services/livestreaming-events' },
  { label: 'Photography',              to: '/services/photography' },
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
  { label: 'Our Team',  to: '/team' },
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
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/dencastglobal' },
  { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com/dencastglobal' },
  { icon: Twitter,   label: 'Twitter/X', href: 'https://twitter.com/dencastglobal' },
  { icon: Linkedin,  label: 'LinkedIn',  href: 'https://linkedin.com/company/dencastglobal' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com/@dencastglobal' },
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
        className="text-[#D72638] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
      />
      {label}
    </Link>
  </li>
);

const FooterHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
    <span className="inline-block w-5 h-0.5 bg-[#D72638] rounded-full" />
    {children}
  </h3>
);

// ─── Newsletter signup ────────────────────────────────────────────────────────

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Replace with real subscription logic
    await new Promise(r => setTimeout(r, 1000));
    setStatus('success');
    setEmail('');
  };

  return (
    <motion.div variants={fadeUp} className="border-t border-white/10 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h4 className="text-white font-bold text-lg">Stay in the loop</h4>
            <p className="text-slate-400 text-sm mt-1">Get the latest news, projects and insights from Dencast Global.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0056A6] focus:ring-1 focus:ring-[#0056A6] transition-colors disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0',
                status === 'success'
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-[#D72638] text-white hover:bg-[#b01e2e] disabled:opacity-60'
              )}
            >
              {status === 'success' ? (
                <>✓ Subscribed</>
              ) : (
                <>
                  <Send size={14} />
                  Subscribe
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

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
                <Film size={26} className="text-[#0056A6]" />
                <span className="leading-none">
                  <span className="block text-lg font-black tracking-[0.12em] uppercase text-white">DENCAST</span>
                  <span className="block text-[10px] font-semibold tracking-[0.28em] uppercase text-[#D72638]">GLOBAL</span>
                </span>
              </Link>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                Award-winning creative media production company delivering cinematic excellence across documentary, commercial, and digital content globally.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#0056A6] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105"
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
                {COMPANY_LINKS.map(l => <FooterLinkItem key={l.to} {...l} />)}
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
                    <a href="mailto:hello@dencastglobal.com" className="flex items-start gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                      <Mail size={14} className="mt-0.5 flex-shrink-0 text-[#0056A6]" />
                      hello@dencastglobal.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="flex items-start gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                      <Phone size={14} className="mt-0.5 flex-shrink-0 text-[#0056A6]" />
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li>
                    <span className="flex items-start gap-2.5 text-slate-400 text-sm">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#0056A6]" />
                      123 Creative Ave, Media District, CA 90210
                    </span>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/1234567890"
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
        <Newsletter />

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
