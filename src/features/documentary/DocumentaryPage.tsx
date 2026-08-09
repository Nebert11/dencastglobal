import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Search, FileText, Film, Camera, Monitor, Globe,
  ChevronRight, ArrowRight, Users, Tv,
  CheckCircle2, Play, X,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/utils/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { icon: Search, step: '01', title: 'Research', desc: 'Deep immersion in the subject matter — archival research, stakeholder interviews, and field observation to establish authentic narrative foundations.' },
  { icon: FileText, step: '02', title: 'Development', desc: 'Story treatment, character identification, and narrative arc development. We write a detailed production bible before a single camera rolls.' },
  { icon: Film, step: '03', title: 'Pre-Production', desc: 'Location scouting, crew assembly, equipment specification, scheduling, rights clearance, and logistics planning for any environment on earth.' },
  { icon: Camera, step: '04', title: 'Principal Photography', desc: 'Cinema-grade production with our experienced crews embedded in communities, events, and environments — capturing authentic, unguarded moments.' },
  { icon: Monitor, step: '05', title: 'Post-Production', desc: 'Offline and online editing, colour grading, original score composition, sound design, and VFX to achieve the cinematic finish your story deserves.' },
  { icon: Globe, step: '06', title: 'Distribution', desc: 'Festival strategy, broadcaster pitching, streaming platform delivery, community screening programmes, and digital distribution to maximise reach.' },
];

const EQUIPMENT = [
  { category: 'Cinema Cameras', items: ['ARRI Alexa Mini LF', 'RED V-RAPTOR 8K', 'Sony Venice 2', 'Blackmagic URSA Mini Pro 12K'] },
  { category: 'Lenses', items: ['Zeiss Supreme Prime set', 'Cooke S7/i full frame', 'ARRI Signature Primes', 'Canon CN-E Cinema Primes'] },
  { category: 'Drones', items: ['DJI Inspire 3', 'DJI Matrice 350 RTK', 'Autel EVO II Pro', 'Custom FPV rigs'] },
  { category: 'Support & Lighting', items: ['ARRI SkyPanel S360-C', 'DJI RS 3 Pro', 'Ronin 4D', 'Movi Pro & Steadicam'] },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── Documentary Page ─────────────────────────────────────────────────────────

const DocumentaryPage: React.FC = () => {
  const powerRef = useRef(null);
  const processRef = useRef(null);
  const caseRef = useRef(null);
  const equipRef = useRef(null);
  const [activeCaseStudyVideo, setActiveCaseStudyVideo] = useState<{ title: string; url: string } | null>(null);

  const powerInView = useInView(powerRef, { once: true, margin: '-80px' });
  const processInView = useInView(processRef, { once: true, margin: '-80px' });
  const caseInView = useInView(caseRef, { once: true, margin: '-80px' });
  const equipInView = useInView(equipRef, { once: true, margin: '-80px' });
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      <Helmet>
        <title>Documentary Production | {SITE_NAME}</title>
        <meta name="description" content="Award-winning documentary production — from concept to global distribution. Dencast Global tells Africa's most important stories with cinematic excellence." />
      </Helmet>

      {/* ── Cinematic Hero ── */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/dencast_images/doc3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Documentary Production</span>
          </motion.nav>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-[#D3232E] font-bold uppercase tracking-widest text-sm mb-4"
          >
            Stories that move the world
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-8"
          >
            Documentary<br />
            <span className="text-[#D3232E]">Production</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white/70 text-xl max-w-2xl mx-auto mb-10"
          >
            From concept to global distribution — we craft documentaries that capture authentic narratives, drive social impact, and connect deeply with audiences worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Pitch Your Documentary
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg" leftIcon={<Play size={16} />}>
                Watch Our Films
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-white/30"
          />
        </motion.div>
      </section>

      {/* ── Power of Documentary ── */}
      <section ref={powerRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={stagger} initial="hidden" animate={powerInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeUp}><SectionLabel label="Our Philosophy" /></motion.div>
              <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                The Power of Documentary <span className="text-[#25408F]">Storytelling</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-slate-600 text-lg leading-relaxed">
                A great documentary doesn't just document reality — it illuminates hidden truths, challenges assumptions, and moves audiences from passive witnesses to active participants in the stories that shape our world.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-slate-600 leading-relaxed">
                At Dencast Global, we approach every documentary with journalistic rigour, cinematic ambition, and deep respect for the subjects we represent. Our films have screened at TIFF, Sundance, FESPACO, and Carthage — and more importantly, they've sparked real change.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4">
                {[
                  // { icon: Award, val: '12+', lbl: 'Festival Awards' },
                  { icon: Tv, val: '8', lbl: 'Broadcast Deals' },
                  { icon: Users, val: '50M+', lbl: 'Lives Touched' },
                ].map(({ icon: Icon, val, lbl }) => (
                  <div key={lbl} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Icon size={20} className="text-[#D3232E] mx-auto mb-2" />
                    <p className="text-2xl font-black text-[#25408F]">{val}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{lbl}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }} animate={powerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/dencast_images/doc3.jpg"
                  alt="Documentary filming"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#D3232E] rounded-2xl p-6 text-white shadow-xl">
                <p className="text-3xl font-black">30+</p>
                <p className="text-sm font-semibold mt-0.5 opacity-90">Documentaries<br />Produced</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section ref={processRef} className="py-24 bg-[#001f3f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={processInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Production Process" light center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white">
              Six Stages to a<br /><span className="text-[#D3232E]">Masterpiece</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  custom={i} variants={fadeUp} initial="hidden" animate={processInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#D3232E]/40 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-5xl font-black text-white/10 leading-none">{step.step}</span>
                    <div className="w-12 h-12 rounded-xl bg-[#D3232E]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-[#D3232E]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Case Study ── */}
      <section ref={caseRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={caseInView ? 'visible' : 'hidden'}
            className="mb-12"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Featured Film" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Case Study Highlight
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={caseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActiveCaseStudyVideo({
                title: 'Sasini PLC Sustainability Documentary 2023',
                url: 'https://www.youtube.com/watch?v=WDHIUaR6i-c',
              })}
              className="relative aspect-[4/3] lg:aspect-auto w-full text-left group"
            >
              <div className="w-full h-full bg-black">
                <img
                  src="https://img.youtube.com/vi/WDHIUaR6i-c/hqdefault.jpg"
                  alt="Sasini PLC Sustainability Documentary 2023"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Play size={20} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            </button>
            <div className="bg-[#25408F] p-10 flex flex-col justify-center">
              <span className="text-[#D3232E] text-xs font-bold uppercase tracking-widest mb-3">Featured Documentary</span>
              <h3 className="text-3xl font-black text-white mb-4">Sasini PLC Sustainability Documentary 2023</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                This documentary highlights Sasini PLC's sustainability journey across responsible farming, environmental stewardship, and community impact. The film was crafted to communicate long-term value, transparency, and measurable progress to stakeholders.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[['Client', 'Sasini PLC'], ['Format', 'Sustainability Documentary'], ['Platform', 'YouTube Release'], ['Focus', 'ESG & Community Impact']].map(([val, lbl]) => (
                  <div key={lbl} className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-black text-xl">{val}</p>
                    <p className="text-white/60 text-xs mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
              <a href="https://www.youtube.com/watch?v=WDHIUaR6i-c" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
                  Watch Documentary
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {modalRoot && activeCaseStudyVideo && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveCaseStudyVideo(null)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Case Study Video</p>
                <p className="text-sm sm:text-base font-semibold">{activeCaseStudyVideo.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCaseStudyVideo(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src="https://www.youtube.com/embed/WDHIUaR6i-c?rel=0&modestbranding=1&playsinline=1&autoplay=1"
              title={activeCaseStudyVideo.title}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>,
        modalRoot,
      )}

      {/* ── Equipment ── */}
      <section ref={equipRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={equipInView ? 'visible' : 'hidden'}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Our Arsenal" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Cinema-Grade Equipment
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EQUIPMENT.map((cat, i) => (
              <motion.div
                key={cat.category}
                custom={i} variants={fadeUp} initial="hidden" animate={equipInView ? 'visible' : 'hidden'}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <h3 className="font-bold text-[#25408F] text-sm uppercase tracking-wider mb-4">{cat.category}</h3>
                <ul className="space-y-2.5">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-[#D3232E] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#25408F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Get Started" light center />
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white">
            Have a Story Worth Telling?
          </h2>
          <p className="mt-5 text-white/70 text-lg">
            Whether it's a social justice film, a corporate documentary, or an epic nature study — we have the vision and the skills to bring it to life.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Pitch Your Documentary
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg">
                Watch Our Films
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default DocumentaryPage;
