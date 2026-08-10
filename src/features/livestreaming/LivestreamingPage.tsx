import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Wifi, Monitor, Users, Music, Trophy, Star,
  ChevronRight, ArrowRight, Zap, Radio,
  Youtube, Globe, MessageSquare, Video, X,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/utils/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STREAM_TYPES = [
  { icon: Users, title: 'Conferences & Summits', desc: 'Professional multi-camera coverage with live Q&A capabilities.' },
  { icon: Music, title: 'Concerts & Performances', desc: 'Dynamic live performance broadcasting with high-fidelity audio.' },
  { icon: Trophy, title: 'Sports Events', desc: 'Fast-paced sporting action streamed with broadcast-standard cameras.' },
  { icon: Star, title: 'Award Ceremonies', desc: 'Glamorous productions with branded overlays and live reaction cameras.' },
  { icon: Monitor, title: 'Corporate Events', desc: 'Town halls, product launches, and investor days delivered globally.' },
  { icon: Users, title: 'Weddings & Celebrations', desc: "Capture life's biggest moments and share them with loved ones worldwide." },
];

const TECH_SPECS = [
  { label: 'Production Quality', value: 'Broadcast-Grade Delivery' },
  { label: 'Coverage', value: 'Multi-Camera Direction' },
  { label: 'Audio', value: 'Clear, Professional Sound' },
  { label: 'Visual Identity', value: 'Branded Graphics & Overlays' },
  { label: 'Audience Reach', value: 'Cross-Platform Streaming' },
  { label: 'Reliability', value: 'Redundant Streaming Workflow' },
  { label: 'Experience', value: 'Hybrid & Virtual Event Expertise' },
  { label: 'Support', value: 'End-to-End Technical Team' },
];

const PLATFORMS = [
  { name: 'YouTube Live', color: '#FF0000', icon: Youtube },
  { name: 'Facebook Live', color: '#1877F2', icon: Globe },
  { name: 'Zoom Webinar', color: '#2D8CFF', icon: Video },
  { name: 'MS Teams', color: '#6264A7', icon: MessageSquare },
  { name: 'Twitch', color: '#9146FF', icon: Radio },
  { name: 'Custom RTMP', color: '#25408F', icon: Wifi },
];

const PAST_EVENTS = [
  { title: 'Pan-African Economic Forum', image: '/dencast_images/conference.jpg', summary: 'Large-scale conference livestream and production support.' },
  { title: 'Afropop World Festival', image: '/dencast_images/entertainment.jpg', summary: 'Live concert coverage with dynamic multi-camera direction.' },
  { title: 'Ghana Tech Summit', image: '/dencast_images/events.jpg', summary: 'Hybrid summit stream with branded graphics and reliable delivery.' },
  { title: 'Africa CEO Forum', image: '/dencast_images/MICE.jpg', summary: 'Executive event livestreaming and audience engagement production.' },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── LivestreamingPage ────────────────────────────────────────────────────────

const LivestreamingPage: React.FC = () => {
  const modalRoot = typeof document !== 'undefined' ? document.body : null;
  const [activeEventImage, setActiveEventImage] = useState<{ src: string; title: string } | null>(null);
  const typesRef = useRef(null);
  const techRef = useRef(null);
  const eventsRef = useRef(null);

  const typesInView = useInView(typesRef, { once: true, margin: '-80px' });
  const techInView = useInView(techRef, { once: true, margin: '-80px' });
  const eventsInView = useInView(eventsRef, { once: true, margin: '-80px' });

  return (
    <>
      <Helmet>
        <title>Livestreaming & Events | {SITE_NAME}</title>
        <meta name="description" content="Professional multi-camera livestreaming and event production for conferences, concerts, weddings, and corporate events — delivered flawlessly to any platform." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#001f3f]">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(/dencast_images/liveevent.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/80 via-transparent to-[#001f3f]" />

        {/* Animated "LIVE" badge */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 bg-[#D3232E] px-4 py-2 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-white text-xs font-black uppercase tracking-widest">Live</span>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Livestreaming & Events</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6"
          >
            Live,{' '}
            <span className="text-[#D3232E]">Unfiltered</span>,<br />
            Unforgettable
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="text-white/70 text-xl max-w-2xl mx-auto mb-10"
          >
            Dencast Global delivers reliable, professional, and cost-effective livestreaming
            solutions that help organizations connect with teams, audiences, and stakeholders
            anywhere in the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/portfolio">
              <Button variant="primary" size="lg" leftIcon={<Zap size={16} />} rightIcon={<ArrowRight size={16} />}>
                Explore Our Work
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── What We Stream ── */}
      <section ref={typesRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={typesInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="Event Types" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
              Livestreaming Services
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {STREAM_TYPES.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.title}
                  custom={i} variants={fadeUp} initial="hidden" animate={typesInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -5 }}
                  className="group p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#25408F]/20 transition-all duration-300 bg-white"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#25408F]/10 group-hover:bg-[#25408F] flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon size={24} className="text-[#25408F] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{type.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{type.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Technical Specs ── */}
      <section ref={techRef} className="py-24 bg-[#001f3f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={stagger} initial="hidden" animate={techInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeUp}><SectionLabel label="Tech Specs" light /></motion.div>
              <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-white leading-tight">
                Broadcast-Grade<br /><span className="text-[#D3232E]">Technical Infrastructure</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-white/70 leading-relaxed">
                We produce seamless virtual and hybrid experiences for conferences, corporate
                events, AGMs, launches, panel discussions, and live productions. Through
                high-quality video, clear sound, multi-camera coverage, branded graphics, and
                dependable streaming technology, every event is engaging, accessible, and
                professionally delivered.
              </motion.p>

              {/* Platform logos */}
              <motion.div variants={fadeUp} className="mt-8">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Stream to any platform</p>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map(platform => {
                    const Icon = platform.icon;
                    return (
                      <div
                        key={platform.name}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/10 text-white text-sm font-medium"
                      >
                        <Icon size={14} style={{ color: platform.color }} />
                        {platform.name}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Specs grid */}
            <motion.div
              initial={{ opacity: 0, x: 60 }} animate={techInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {TECH_SPECS.map(spec => (
                <div key={spec.label} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <p className="text-[#D3232E] text-xs font-bold uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="text-white font-bold text-lg">{spec.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Past Events Gallery ── */}
      <section ref={eventsRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={eventsInView ? 'visible' : 'hidden'} className="mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Past Events" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black text-slate-900">Events We've Streamed</motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAST_EVENTS.map((event, i) => (
              <motion.button
                key={event.title}
                type="button"
                onClick={() => setActiveEventImage({ src: event.image, title: event.title })}
                custom={i} variants={fadeUp} initial="hidden" animate={eventsInView ? 'visible' : 'hidden'}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{event.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">{event.summary}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {modalRoot && activeEventImage && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveEventImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[1400px] h-[72vh] sm:w-[80vw] sm:h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <p className="text-sm sm:text-base font-semibold">{activeEventImage.title}</p>
              <button
                type="button"
                onClick={() => setActiveEventImage(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close image viewer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative w-full h-full bg-black">
              <img src={activeEventImage.src} alt={activeEventImage.title} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>,
        modalRoot,
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-[#D3232E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">We Stream Live</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your Next Event — Broadcast Everywhere
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            We have partnered with leading brands and organizations across Kenya to create
            impactful virtual experiences that bring people together, wherever they are.
          </p>
          <Link to="/portfolio">
            <Button variant="ghost" size="lg" rightIcon={<ArrowRight size={16} />}>
              Explore Our Work
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default LivestreamingPage;
