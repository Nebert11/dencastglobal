import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Wifi, Monitor, Users, Music, Trophy, Star,
  ChevronRight, ArrowRight, CheckCircle2, Zap, Radio,
  Youtube, Globe, MessageSquare, Video,
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
  { label: 'Max Resolution', value: '4K / 2160p' },
  { label: 'Bit Rate', value: 'Up to 80 Mbps' },
  { label: 'Frame Rates', value: '24 / 30 / 60 fps' },
  { label: 'Latency', value: '< 3 seconds' },
  { label: 'Simultaneous Streams', value: 'Up to 12 platforms' },
  { label: 'Backup Connectivity', value: 'Triple redundant' },
  { label: 'Max Cameras', value: '16 simultaneous' },
  { label: 'Replay System', value: 'Yes – multi-angle' },
];

const PLATFORMS = [
  { name: 'YouTube Live', color: '#FF0000', icon: Youtube },
  { name: 'Facebook Live', color: '#1877F2', icon: Globe },
  { name: 'Zoom Webinar', color: '#2D8CFF', icon: Video },
  { name: 'MS Teams', color: '#6264A7', icon: MessageSquare },
  { name: 'Twitch', color: '#9146FF', icon: Radio },
  { name: 'Custom RTMP', color: '#0056A6', icon: Wifi },
];

const PACKAGES = [
  {
    name: 'Basic Stream',
    price: '$1,200',
    color: 'border-slate-200',
    headerBg: 'bg-slate-50',
    features: [
      '1 Camera operator',
      '1080p streaming',
      'Single platform delivery',
      '4-hour event coverage',
      'Basic graphics package',
      'Event recording included',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Professional',
    price: '$3,500',
    color: 'border-[#0056A6]',
    headerBg: 'bg-[#0056A6]',
    popular: true,
    features: [
      '3 Camera operators',
      '4K streaming',
      'Up to 4 platforms simultaneously',
      '8-hour event coverage',
      'Custom branded overlays',
      'Live graphics & lower thirds',
      'Replay highlights package',
      'Technical director on-site',
    ],
    cta: 'Most Popular',
  },
  {
    name: 'Premium Broadcast',
    price: '$8,000+',
    color: 'border-[#D72638]',
    headerBg: 'bg-gradient-to-br from-[#D72638] to-[#0056A6]',
    features: [
      'Up to 8 Camera operators',
      '4K / Multi-bitrate delivery',
      'Unlimited platform delivery',
      'Full day + eve coverage',
      'Full broadcast graphics suite',
      'Live scoreboards / data overlays',
      'Multiple replay angles',
      'Dedicated broadcast team',
      'Post-event VOD package',
      'Audience analytics report',
    ],
    cta: 'Contact for Quote',
  },
];

const PAST_EVENTS = [
  { title: 'Pan-African Economic Forum 2024', image: '2873486', attendees: '5,000+', views: '220K' },
  { title: 'Afropop World Festival', image: '1884577', attendees: '15,000', views: '1.2M' },
  { title: 'Ghana Tech Summit', image: '3756132', attendees: '2,500', views: '85K' },
  { title: 'Africa CEO Forum', image: '7034014', attendees: '1,800', views: '340K' },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── LivestreamingPage ────────────────────────────────────────────────────────

const LivestreamingPage: React.FC = () => {
  const typesRef = useRef(null);
  const techRef = useRef(null);
  const packagesRef = useRef(null);
  const eventsRef = useRef(null);

  const typesInView = useInView(typesRef, { once: true, margin: '-80px' });
  const techInView = useInView(techRef, { once: true, margin: '-80px' });
  const packagesInView = useInView(packagesRef, { once: true, margin: '-80px' });
  const eventsInView = useInView(eventsRef, { once: true, margin: '-80px' });

  return (
    <>
      <Helmet>
        <title>Livestreaming & Events | {SITE_NAME}</title>
        <meta name="description" content="Professional multi-camera livestreaming and event production for conferences, concerts, weddings, and corporate events — delivered flawlessly to any platform." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#001f3f]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/80 via-transparent to-[#001f3f]" />

        {/* Animated "LIVE" badge */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 bg-[#D72638] px-4 py-2 rounded-full"
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
            <span className="text-[#D72638]">Unfiltered</span>,<br />
            Unforgettable
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="text-white/70 text-xl max-w-2xl mx-auto mb-10"
          >
            Multi-camera live event production and streaming for conferences, concerts, product launches, and hybrid events — delivered flawlessly to any platform on earth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/contact">
              <Button variant="primary" size="lg" leftIcon={<Zap size={16} />} rightIcon={<ArrowRight size={16} />}>
                Book Your Stream
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
              What We Stream
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
                  className="group p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#0056A6]/20 transition-all duration-300 bg-white"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0056A6]/10 group-hover:bg-[#0056A6] flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon size={24} className="text-[#0056A6] group-hover:text-white transition-colors duration-300" />
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
                Broadcast-Grade<br /><span className="text-[#D72638]">Technical Infrastructure</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-white/70 leading-relaxed">
                Our production infrastructure is engineered for zero-downtime delivery. Triple-redundant internet connections, broadcast-grade encoders, and experienced technical directors ensure your stream never drops.
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
                  <p className="text-[#D72638] text-xs font-bold uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="text-white font-bold text-lg">{spec.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section ref={packagesRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={packagesInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="Pricing" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">Event Packages</motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-slate-500 max-w-xl mx-auto">Choose the package that fits your event. All packages include pre-event tech check and post-event recording.</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                custom={i} variants={fadeUp} initial="hidden" animate={packagesInView ? 'visible' : 'hidden'}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${pkg.color}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-[#D72638] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`${pkg.headerBg} p-8 ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                  <h3 className="text-xl font-black mb-1">{pkg.name}</h3>
                  <p className={`text-3xl font-black ${pkg.popular ? 'text-white' : 'text-[#0056A6]'}`}>{pkg.price}</p>
                  <p className={`text-sm mt-0.5 ${pkg.popular ? 'text-white/70' : 'text-slate-500'}`}>starting price</p>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-[#0056A6] mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/contact">
                      <Button
                        variant={pkg.popular ? 'primary' : 'outline'}
                        size="md" className="w-full justify-center"
                      >
                        {pkg.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <motion.div
                key={event.title}
                custom={i} variants={fadeUp} initial="hidden" animate={eventsInView ? 'visible' : 'hidden'}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/${event.image}/pexels-photo-${event.image}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-[#D72638] rounded text-white text-[10px] font-bold">{event.views} views</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{event.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">{event.attendees} attendees</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#D72638]">
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
            From intimate 50-person webinars to 50,000-audience concerts — we deliver your event live, everywhere.
          </p>
          <Link to="/contact">
            <Button variant="ghost" size="lg" rightIcon={<ArrowRight size={16} />}>
              Book a Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default LivestreamingPage;
