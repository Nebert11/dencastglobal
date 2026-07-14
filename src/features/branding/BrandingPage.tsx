import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Hexagon, PenTool, BookOpen, Target,
  Share2, FileText, ChevronRight, ArrowRight,
  CheckCircle2, Sparkles, TrendingUp, Users,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/utils/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const BRANDING_SERVICES = [
  { icon: Hexagon, title: 'Brand Identity', desc: 'Logo, colour palette, typography, and visual language that instantly communicates your essence.' },
  { icon: PenTool, title: 'Logo Design', desc: 'Timeless mark-making that balances aesthetics, symbolism, and cross-media versatility.' },
  { icon: BookOpen, title: 'Brand Guidelines', desc: 'Comprehensive documentation that keeps your brand consistent across every touchpoint.' },
  { icon: Target, title: 'Creative Direction', desc: 'Strategic oversight of all visual communications to ensure brand coherence and impact.' },
  { icon: Share2, title: 'Social Media Branding', desc: 'Profile kits, templates, and content frameworks that make your social presence unmistakable.' },
  { icon: FileText, title: 'Marketing Materials', desc: 'Business cards, stationery, brochures, decks, and everything in between — beautifully branded.' },
];

const BRAND_PROCESS = [
  { step: '01', title: 'Discovery & Audit', desc: 'We analyse your current brand, competitors, and target audience to uncover positioning opportunities.' },
  { step: '02', title: 'Strategy', desc: 'Brand purpose, values, positioning statement, and messaging framework development.' },
  { step: '03', title: 'Visual Identity', desc: 'Logo design, colour systems, typography, and the full visual language for your brand.' },
  { step: '04', title: 'Execution', desc: 'Application of the brand system across all touchpoints — print, digital, environmental.' },
  { step: '05', title: 'Handover & Support', desc: 'Complete brand guidelines, asset library delivery, and ongoing brand stewardship.' },
];

const CASE_STUDIES = [
  {
    brand: 'Kasei Finance',
    category: 'FinTech',
    challenge: 'Launch a new fintech brand that builds trust among skeptical African consumers.',
    result: 'Brand reached 500K impressions in 90 days. 40% increase in sign-up conversion.',
    before: '3379934',
    after: '2873486',
    color: '#0056A6',
  },
  {
    brand: 'Nkosuo Farms',
    category: 'AgriTech',
    challenge: 'Reposition an agricultural company as a technology-led precision farming platform.',
    result: 'Secured $2.5M seed funding within 6 months of rebrand. Media coverage in 8 countries.',
    before: '1884577',
    after: '3756132',
    color: '#2e7d32',
  },
  {
    brand: 'Accra Fashion House',
    category: 'Luxury Retail',
    challenge: 'Create a premium brand identity for Africa\'s first fashion conglomerate.',
    result: '3 international stockists signed. Brand featured in Vogue Africa & Forbes.',
    before: '7034014',
    after: '7247399',
    color: '#D72638',
  },
];

const DESIGN_PORTFOLIO = ['3756132', '3866149', '3379932', '2379004', '1181686', '1516680'];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── BrandingPage ─────────────────────────────────────────────────────────────

const BrandingPage: React.FC = () => {
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const caseRef = useRef(null);
  const portfolioRef = useRef(null);

  const servicesInView = useInView(servicesRef, { once: true, margin: '-80px' });
  const processInView = useInView(processRef, { once: true, margin: '-80px' });
  const caseInView = useInView(caseRef, { once: true, margin: '-80px' });
  const portfolioInView = useInView(portfolioRef, { once: true, margin: '-80px' });

  return (
    <>
      <Helmet>
        <title>Branding & Creative Media | {SITE_NAME}</title>
        <meta name="description" content="Strategic branding and creative media services: brand identity, logo design, brand guidelines, creative direction, and marketing materials for African brands." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/7034014/pexels-photo-7034014.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)' }}
        />
        {/* Animated gradient */}
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 8 }}
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, #0056A6 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #D72638 0%, transparent 60%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Branding & Creative Media</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles size={12} className="text-[#D72638]" />
            Imagination Made Tangible
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6"
          >
            Branding &<br /><span className="text-[#D72638]">Creative</span> Media
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="text-white/70 text-xl max-w-2xl mx-auto mb-10"
          >
            We build brands that resonate, differentiate, and endure — combining strategic thinking with bold creative execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Build Your Brand
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section ref={servicesRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={servicesInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="What We Offer" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              End-to-End Brand Services
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BRANDING_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  custom={i} variants={fadeUp} initial="hidden" animate={servicesInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -5 }}
                  className="group p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:border-[#0056A6]/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0056A6]/10 group-hover:bg-[#0056A6] flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon size={24} className="text-[#0056A6] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{svc.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{svc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Brand Process ── */}
      <section ref={processRef} className="py-24 bg-[#0056A6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={processInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="Our Process" light center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-white">
              Five Stages to Brand Excellence
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Line */}
            <div className="absolute top-8 left-8 right-8 h-px bg-white/20 hidden lg:block" />
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {BRAND_PROCESS.map((step, i) => (
                <motion.div
                  key={step.step}
                  custom={i} variants={fadeUp} initial="hidden" animate={processInView ? 'visible' : 'hidden'}
                  className="relative text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-[#0056A6] font-black text-xl mb-5 shadow-lg relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section ref={caseRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={caseInView ? 'visible' : 'hidden'} className="mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Case Studies" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Brand Transformations
            </motion.h2>
          </motion.div>

          <div className="space-y-12">
            {CASE_STUDIES.map((study, i) => (
              <motion.div
                key={study.brand}
                custom={i} variants={fadeUp} initial="hidden" animate={caseInView ? 'visible' : 'hidden'}
                className={`grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl ${i % 2 !== 0 ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`relative ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/3]">
                    <img
                      src={`https://images.pexels.com/photos/${study.after}/pexels-photo-${study.after}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                      alt={study.brand}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div
                  className={`p-10 flex flex-col justify-center ${i % 2 !== 0 ? 'lg:order-1 bg-slate-900' : 'bg-white'}`}
                  style={i % 2 !== 0 ? {} : { borderTop: `4px solid ${study.color}` }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-flex w-fit mb-4"
                    style={{ backgroundColor: `${study.color}20`, color: study.color }}
                  >
                    {study.category}
                  </span>
                  <h3 className={`text-3xl font-black mb-4 ${i % 2 !== 0 ? 'text-white' : 'text-slate-900'}`}>
                    {study.brand}
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${i % 2 !== 0 ? 'text-white/40' : 'text-slate-400'}`}>Challenge</p>
                      <p className={`text-sm leading-relaxed ${i % 2 !== 0 ? 'text-white/80' : 'text-slate-600'}`}>{study.challenge}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${i % 2 !== 0 ? 'text-[#D72638]' : 'text-[#0056A6]'}`}>Results</p>
                      <p className={`text-sm leading-relaxed ${i % 2 !== 0 ? 'text-white/80' : 'text-slate-600'}`}>{study.result}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: study.color }} />
                    <span className="text-sm font-semibold" style={{ color: study.color }}>Measurable Impact</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Design Portfolio Grid ── */}
      <section ref={portfolioRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={portfolioInView ? 'visible' : 'hidden'} className="text-center mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Design Portfolio" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Visual Work
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {DESIGN_PORTFOLIO.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }} animate={portfolioInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl aspect-square group"
              >
                <img
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={`Branding portfolio ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-white" />
                    <span className="text-white text-sm font-semibold">Brand Project</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-[#001f3f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Start Your Brand Journey" light center />
          <h2 className="mt-4 text-4xl font-black text-white">
            Ready to Build Something <span className="text-[#D72638]">Iconic</span>?
          </h2>
          <p className="mt-4 text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're launching a new brand or transforming an existing one, we have the strategy and creativity to make it exceptional.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Build Your Brand
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg">
                <CheckCircle2 size={16} className="mr-2" />
                See Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandingPage;
