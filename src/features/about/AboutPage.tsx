import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Lightbulb, Shield, Star, Zap, Users, TrendingUp,
  Twitter, Linkedin, Instagram, Globe,
  ChevronRight, ArrowRight, Play,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/utils/constants';

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CORE_VALUES = [
  {
    icon: Lightbulb,
    title: 'Creativity',
    description: 'We push creative boundaries to produce media that surprises, moves, and resonates deeply with every audience.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'From pre-production planning to final delivery, we hold ourselves to the highest industry standards in every project.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Honest storytelling and transparent partnerships form the bedrock of everything we create and every relationship we build.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We embrace emerging technologies and bold ideas — drones, AI-enhanced editing, 8K cinema — to stay ahead of the curve.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Great stories emerge from great partnerships. We work closely with clients, talent, and communities to bring visions to life.',
  },
  {
    icon: TrendingUp,
    title: 'Impact',
    description: 'Every frame we craft is engineered to spark conversation, change perception, and drive measurable outcomes for our clients.',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Dennis Osei',
    role: 'CEO & Creative Director',
    bio: 'Award-winning filmmaker with 15+ years crafting stories across Africa and beyond.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { twitter: '#', linkedin: '#', instagram: '#' },
  },
  {
    name: 'Ama Asante',
    role: 'Head of Documentary',
    bio: 'Documentary specialist whose films have screened at TIFF, Sundance, and FESPACO.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: 'Kwame Mensah',
    role: 'Lead Cinematographer',
    bio: 'Master of cinematic visual language, with credits on three internationally distributed films.',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'Abena Korkor',
    role: 'Brand Strategy Lead',
    bio: "Former TBWA creative strategist who now leads brand narratives for Africa's fastest-growing companies.",
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { twitter: '#', linkedin: '#', website: '#' },
  },
  {
    name: 'Nana Yaw Boateng',
    role: 'Post-Production Supervisor',
    bio: 'DaVinci Resolve certified colorist and Avid editor with a decade of broadcast experience.',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { linkedin: '#' },
  },
  {
    name: 'Efua Boateng',
    role: 'Head of Digital Content',
    bio: 'Social media strategist and content creator driving 50M+ organic views across client channels.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    social: { twitter: '#', instagram: '#', linkedin: '#' },
  },
];

const TIMELINE = [
  { year: '2014', title: 'Founded in Accra', desc: "Dencast Global was founded with a single camera and an unstoppable vision to tell Africa's stories to the world." },
  { year: '2016', title: 'First International Documentary', desc: 'Our debut feature documentary premiered at the Africa International Film Festival, earning Best Documentary.' },
  { year: '2018', title: 'Expanded to 5 Countries', desc: 'Opened production offices in Lagos, Nairobi, Johannesburg, and London to serve pan-African clients.' },
  { year: '2020', title: 'Digital & Livestreaming Division', desc: 'Launched our livestreaming and digital content vertical, producing 200+ live events during the pandemic era.' },
  { year: '2022', title: '100+ Global Projects', desc: 'Crossed the milestone of 100 completed productions spanning documentaries, commercials, and brand campaigns.' },
  { year: '2024', title: 'Pan-African Excellence Award', desc: "Recognised as Africa's Most Innovative Media Production Company at the African Media Awards." },
];

const CLIENTS = [
  'MTN Group', 'Nestlé Africa', 'Vodafone Ghana', 'GCB Bank', 'Ghana Tourism', 'UNICEF',
  'Accra City Hotel', 'Stanbic Bank', 'Kasapreko', 'British Council',
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => (
  <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-[#0056A6]">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
    />
    {/* Diagonal red accent */}
    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-[#D72638]/15 clip-diagonal pointer-events-none" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">About</span>
      </motion.nav>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
      >
        About{' '}
        <span className="relative inline-block">
          <span className="relative z-10">Dencast</span>
          <motion.span
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="absolute -bottom-2 left-0 right-0 h-1.5 bg-[#D72638] rounded-full origin-left"
          />
        </span>{' '}
        Global
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed"
      >
        Africa's premier creative media production house — telling stories that transcend borders, cultures, and generations.
      </motion.p>
    </div>
  </section>
);

// ─── Section: Mission ─────────────────────────────────────────────────────────

const MissionSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Mission" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            We believe every story{' '}
            <span className="text-[#0056A6]">deserves</span> to be told with{' '}
            <span className="text-[#D72638]">cinematic power</span>.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-8 text-slate-600 text-lg leading-relaxed">
            Dencast Global was born from the conviction that Africa's narratives are among the most compelling on earth — and the most underrepresented. We exist to change that. Through documentary, brand storytelling, live production, and digital content, we give voice to individuals, communities, and brands that deserve a world-class platform.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Partner With Us
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" leftIcon={<Play size={16} />}>
                View Our Work
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Section: Story (split image) ────────────────────────────────────────────

const StorySection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Dencast Global team at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0056A6]/30 to-transparent" />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0056A6]">10+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Years</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#D72638]">100+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Projects</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0056A6]">5</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Countries</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="lg:pl-4"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel label="Our Story" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900 leading-tight">
              From a Single Camera to a<span className="text-[#0056A6]"> Continental Voice</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-slate-600 leading-relaxed">
              In 2014, founder Dennis Osei set up a camera in a modest Accra studio and filmed a short documentary about the life of a Makola Market trader. That film — watched by over a million people online — became the spark that ignited Dencast Global.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-slate-600 leading-relaxed">
              A decade later, we are a full-service creative media company with offices in five countries, a roster of 30+ creatives, and a portfolio spanning Netflix-commissioned documentaries, Fortune 500 brand campaigns, and grassroots community storytelling projects.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-slate-600 leading-relaxed">
              Every project — regardless of budget or scale — is approached with the same commitment: to create something that makes people feel, think, and act.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link to="/contact">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Let's Work Together
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: Core Values ─────────────────────────────────────────────────────

const CoreValuesSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Core Values" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
            What We Stand For
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            Six principles that guide every decision, every frame, and every partnership at Dencast Global.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CORE_VALUES.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                custom={i} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-[#0056A6]/20 hover:bg-[#0056A6]/[0.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0056A6]/10 group-hover:bg-[#0056A6] flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon size={24} className="text-[#0056A6] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{val.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Team ────────────────────────────────────────────────────────────

const TeamSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}><SectionLabel label="The Team" center /></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
            Meet the Storytellers
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            A passionate collective of filmmakers, strategists, and creatives united by a love of powerful storytelling.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Social overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-3 group-hover:translate-y-0">
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#0056A6] transition-colors">
                      <Twitter size={15} />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#0056A6] transition-colors">
                      <Linkedin size={15} />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a href={member.social.instagram} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#0056A6] transition-colors">
                      <Instagram size={15} />
                    </a>
                  )}
                  {member.social.website && (
                    <a href={member.social.website} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#0056A6] transition-colors">
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{member.name}</h3>
                <p className="text-[#D72638] text-sm font-semibold mt-0.5">{member.role}</p>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Timeline ────────────────────────────────────────────────────────

const TimelineSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#0056A6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}><SectionLabel label="Our Journey" light center /></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white">
            A Decade of Impact
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 hidden lg:block" />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                custom={i} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className={`lg:flex items-center gap-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className={`inline-flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <span className="text-4xl font-black text-[#D72638]">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>

                {/* Center dot */}
                <div className="hidden lg:flex flex-shrink-0 w-5 h-5 rounded-full bg-[#D72638] ring-4 ring-white/20 relative z-10" />

                {/* Spacer */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: Clients ─────────────────────────────────────────────────────────

const ClientsSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp}><SectionLabel label="Our Clients" center /></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black text-slate-900">
            Trusted by Africa's Best
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {CLIENTS.map((client, i) => (
            <motion.div
              key={client}
              custom={i} variants={fadeUp}
              whileHover={{ y: -4, scale: 1.03 }}
              className="flex items-center justify-center h-20 bg-slate-50 hover:bg-[#0056A6]/5 rounded-xl border border-slate-100 hover:border-[#0056A6]/20 transition-all duration-300 px-4"
            >
              <span className="text-slate-600 font-bold text-sm text-center leading-tight">{client}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Section: CTA ─────────────────────────────────────────────────────────────

const CTASection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#0056A6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp}><SectionLabel label="Get Involved" light center /></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            Join Our Story
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/70 text-lg max-w-2xl mx-auto">
            Whether you're a brand with a vision, a storyteller with a script, or an investor who believes in the power of African media — there's a place for you in this story.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Start a Conversation
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg">
                Explore Our Portfolio
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage: React.FC = () => (
  <>
    <Helmet>
      <title>About Us | {SITE_NAME}</title>
      <meta name="description" content="Learn about Dencast Global — Africa's premier creative media production company with 10+ years of storytelling excellence across documentary, photography, branding and live events." />
      <meta property="og:title" content={`About Us | ${SITE_NAME}`} />
      <meta property="og:type" content="website" />
    </Helmet>

    <HeroBanner />
    <MissionSection />
    <StorySection />
    <CoreValuesSection />
    <TeamSection />
    <TimelineSection />
    <ClientsSection />
    <CTASection />
  </>
);

export default AboutPage;
