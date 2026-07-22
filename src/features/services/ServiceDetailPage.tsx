import React, { useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Film, Radio, Camera, Video, Target, Palette, Music,
  Navigation, Briefcase, TrendingUp, LayoutDashboard,
  ChevronRight, ArrowRight, CheckCircle2, Search,
  Layers, Eye, Cpu,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import ServiceCard from '@/components/ui/ServiceCard';
import { SERVICES, SITE_NAME } from '@/utils/constants';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Film, Radio, Camera, Video, Target, Palette, Music,
  Navigation, Briefcase, TrendingUp, LayoutDashboard,
};

// ─── Per-service rich content ─────────────────────────────────────────────────

interface ServiceRichContent {
  heroImage: string;
  overview: string;
  features: string[];
  galleryImages: string[];
  whyUs: { icon: React.ElementType; title: string; desc: string }[];
}

const SERVICE_CONTENT: Record<string, ServiceRichContent> = {
  'documentary-production': {
    heroImage: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Our documentary production team brings decades of combined experience to every project. We handle everything from the initial concept and research phase through principal photography, post-production, and final distribution — ensuring your story reaches the audience it deserves.',
    features: ['4K & 8K Cinema Camera Packages', 'Multi-lingual production capability', 'Archival research & fact-checking', 'Original score composition', 'Festival submission strategy', 'International distribution network', 'Subtitling & localisation'],
    galleryImages: ['3379934', '2873486', '1884577', '3756132', '7034014', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Authentic Storytelling', desc: 'We immerse ourselves in every subject before filming, ensuring authentic and respectful narratives.' },
      { icon: Cpu, title: 'Cutting-Edge Technology', desc: '4K/8K cinema cameras, drone cinematography, and professional post-production suites.' },
      { icon: Layers, title: 'Festival-Ready Quality', desc: 'Our films have premiered at TIFF, Sundance, and FESPACO.' },
    ],
  },
  'livestreaming-events': {
    heroImage: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'We deliver flawless live production for events of any scale. Our multi-camera broadcast crews, redundant streaming infrastructure, and experienced technical directors ensure your live event reaches a global audience without a single dropped frame.',
    features: ['Multi-camera live switching', 'Up to 4K streaming resolution', 'Redundant internet connectivity', 'Platform-agnostic delivery', 'Live graphics & lower thirds', 'Real-time audience engagement tools', 'Post-event VOD package'],
    galleryImages: ['2873486', '3379934', '1884577', '3756132', '7034014', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Zero-Downtime Delivery', desc: 'Triple-redundant systems ensure your stream never drops, no matter what.' },
      { icon: Cpu, title: 'Multi-Platform Broadcasting', desc: 'YouTube, Facebook, Zoom, Teams, Twitch — we stream everywhere simultaneously.' },
      { icon: Layers, title: 'Experienced Technical Team', desc: 'Broadcast engineers with years of live TV and event production experience.' },
    ],
  },
  'photography': {
    heroImage: 'https://images.pexels.com/photos/1884577/pexels-photo-1884577.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Our photography team produces images that transcend documentation — they tell stories. From editorial portraits and commercial product shots to large-scale event coverage and aerial photography, every image is crafted with intention.',
    features: ['Medium format & full-frame cameras', 'Studio & location lighting', 'Aerial / drone photography', 'Retouching & colour grading', 'Same-day delivery available', 'Print-ready high-resolution files', 'Commercial licensing packages'],
    galleryImages: ['1884577', '3379934', '2873486', '3756132', '7034014', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Award-Winning Photographers', desc: 'Our photographers have been published in Vogue Africa, Forbes, and National Geographic.' },
      { icon: Cpu, title: 'Studio & Field Ready', desc: 'Fully equipped mobile studio that travels anywhere on the continent.' },
      { icon: Layers, title: 'Fast Turnaround', desc: 'Professionally edited images delivered within 48 hours of shoot.' },
    ],
  },
  'events-management': {
    heroImage: 'https://images.pexels.com/photos/7034014/pexels-photo-7034014.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Dencast Global delivers professionally planned and creatively executed events that bring people, brands, and ideas together. From conferences, corporate functions, launches, award ceremonies, exhibitions, and hybrid events to high-profile public engagements, we manage every detail with precision.',
    features: ['Concept development and event strategy', 'Event branding and visual identity', 'Production coordination and stage management', 'Guest experience and protocol support', 'Technical management and on-site support', 'Integrated photography, videography, and livestreaming', 'Post-event evaluation and reporting'],
    galleryImages: ['7034014', '3379934', '2873486', '1884577', '3756132', '7247399'],
    whyUs: [
      { icon: Eye, title: 'End-to-End Coordination', desc: 'From concept to execution, we align every production detail to your event goals.' },
      { icon: Cpu, title: 'Hybrid Event Expertise', desc: 'We combine in-person excellence with dependable virtual and hybrid delivery.' },
      { icon: Layers, title: 'Audience-First Experiences', desc: 'Every touchpoint is designed to communicate clearly and leave a lasting impression.' },
    ],
  },
  'audio-management-soundtrack-development': {
    heroImage: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Dencast Global provides professional audio management and original soundtrack development for events, films, documentaries, commercials, and digital productions. From clear conference sound to cinematic scoring, we ensure every word is heard and every moment is felt.',
    features: ['Live sound system setup and engineering', 'Microphone planning and live mixing', 'Audio recording and post-production cleanup', 'Voice-over recording and direction', 'Custom sound design and effects', 'Original music beds and theme development', 'Final mastering for broadcast and digital'],
    galleryImages: ['164938', '3379934', '1884577', '2873486', '3756132', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Clarity and Presence', desc: 'We optimize every environment so speech, music, and ambience are consistently clear.' },
      { icon: Cpu, title: 'Production-Ready Audio', desc: 'Our team covers live, studio, and post workflows with professional-grade tools.' },
      { icon: Layers, title: 'Original Sonic Identity', desc: 'Custom soundtrack work gives your events and productions a memorable signature.' },
    ],
  },
  'videography': {
    heroImage: 'https://images.pexels.com/photos/3756132/pexels-photo-3756132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'High-production-value video content that elevates your brand and drives results. Our videography teams are equipped for everything from intimate interview setups to large multi-camera corporate productions.',
    features: ['Cinema-grade camera packages', 'Professional lighting & grip', 'Colour grading & VFX', 'Motion graphics & animation', 'Multi-format delivery', 'Scripting & storyboarding', '360° video capability'],
    galleryImages: ['3756132', '3379934', '2873486', '1884577', '7034014', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Cinematic Quality', desc: 'Every video is crafted with the attention to detail of a feature film production.' },
      { icon: Cpu, title: 'Full Post-Production', desc: 'In-house colour grading, VFX, and audio mixing for end-to-end quality control.' },
      { icon: Layers, title: 'Multi-Format Output', desc: 'Delivered optimised for broadcast, web, social media, and OTT platforms.' },
    ],
  },
  'brand-strategy': {
    heroImage: 'https://images.pexels.com/photos/7034014/pexels-photo-7034014.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Strategic brand development that positions you clearly in a crowded market. We combine deep market research, consumer insight, and creative thinking to build brands that resonate, differentiate, and endure.',
    features: ['Brand audit & competitive analysis', 'Brand positioning & messaging', 'Visual identity systems', 'Brand guidelines documentation', 'Campaign strategy & planning', 'Brand voice & tone development', 'Internal brand activation'],
    galleryImages: ['7034014', '3379934', '2873486', '1884577', '3756132', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Data-Driven Strategy', desc: 'Every brand recommendation is backed by market research and consumer insights.' },
      { icon: Cpu, title: 'Creative Execution', desc: 'Strategy and creative execution under one roof for seamless brand development.' },
      { icon: Layers, title: 'Long-Term Partnership', desc: 'We grow with your brand, reviewing and evolving the strategy as you scale.' },
    ],
  },
  'creative-media': {
    heroImage: 'https://images.pexels.com/photos/7247399/pexels-photo-7247399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Bold, boundary-pushing creative media that captures attention and refuses to be forgotten. We conceptualise and execute multimedia campaigns, motion graphics, and experimental content that makes your audience stop scrolling.',
    features: ['2D & 3D motion graphics', 'Animated explainer videos', 'Interactive digital experiences', 'Conceptual campaign development', 'Mixed media productions', 'Social-first content series', 'Branded entertainment'],
    galleryImages: ['7247399', '3379934', '2873486', '1884577', '3756132', '7034014'],
    whyUs: [
      { icon: Eye, title: 'Boundless Creativity', desc: 'No brief is too ambitious — we thrive on creative challenges that others won\'t attempt.' },
      { icon: Cpu, title: 'Multimedia Expertise', desc: 'Animation, VFX, interactive design — our team spans every creative discipline.' },
      { icon: Layers, title: 'Performance-Focused', desc: 'Creative that looks great and delivers measurable engagement results.' },
    ],
  },
  'drone-services': {
    heroImage: 'https://images.pexels.com/photos/3756132/pexels-photo-3756132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Licensed aerial cinematography and photography that unlocks perspectives impossible to achieve from the ground. Our drone pilots are CAA-certified and experienced in complex environments from urban cityscapes to remote wilderness.',
    features: ['4K & 6K aerial cinematography', 'CAA-certified pilots', 'Night aerial photography', 'Thermal imaging capability', 'Mapping & survey flights', 'Live aerial streaming', 'Permit handling included'],
    galleryImages: ['3756132', '3379934', '2873486', '1884577', '3756132', '7034014'],
    whyUs: [
      { icon: Eye, title: 'CAA-Certified Pilots', desc: 'All our drone pilots hold current aviation authority certifications for commercial operations.' },
      { icon: Cpu, title: 'Premium Drone Fleet', desc: 'DJI Inspire 3, Matrice 350, and Autel Robotics for every project need.' },
      { icon: Layers, title: 'Permit Management', desc: 'We handle all airspace permits and coordination with aviation authorities.' },
    ],
  },
  'corporate-communications': {
    heroImage: 'https://images.pexels.com/photos/3866149/pexels-photo-3866149.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Clear, compelling corporate communications that align your organisation from the C-suite to the frontline. We produce executive messaging videos, investor presentations, internal communications, and annual reports that speak with one powerful voice.',
    features: ['Executive video messaging', 'Investor presentation production', 'Annual report design & video', 'Internal comms strategy', 'Town hall & AGM production', 'Employee onboarding content', 'Crisis communication support'],
    galleryImages: ['3866149', '3379934', '2873486', '1884577', '3756132', '7034014'],
    whyUs: [
      { icon: Eye, title: 'Board-Level Experience', desc: 'We understand corporate governance and produce content that satisfies all stakeholders.' },
      { icon: Cpu, title: 'Discretion Guaranteed', desc: 'Strict NDAs and confidentiality protocols for all sensitive corporate projects.' },
      { icon: Layers, title: 'Multi-Channel Delivery', desc: 'Content formatted for intranet, broadcast, investor portals, and social media.' },
    ],
  },
  'commercial-productions': {
    heroImage: 'https://images.pexels.com/photos/3379932/pexels-photo-3379932.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'TV commercials, online ads, and product films engineered to convert. We combine compelling creative with strategic thinking to produce commercials that build brand equity and drive sales across all media platforms.',
    features: ['TVC production (15s, 30s, 60s)', 'Digital ad formats (pre-roll, stories)', 'Product filming & styling', 'Celebrity & talent management', 'Jingle & audio branding', 'A/B testing creative variants', 'Media buying consultation'],
    galleryImages: ['3379932', '3379934', '2873486', '1884577', '3756132', '7034014'],
    whyUs: [
      { icon: Eye, title: 'Broadcast Standard Quality', desc: 'Our commercials meet the technical specifications of every major African broadcaster.' },
      { icon: Cpu, title: 'Creative & Strategy Combined', desc: 'We don\'t just produce great ads — we ensure they work in the media plan.' },
      { icon: Layers, title: 'Talent Network', desc: 'Access to Africa\'s leading on-screen talent, voice artists, and directors.' },
    ],
  },
  'digital-content-creation': {
    heroImage: 'https://images.pexels.com/photos/7034014/pexels-photo-7034014.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
    overview: 'Scroll-stopping digital-first content engineered for engagement. We create content series, social media campaigns, and digital experiences that build communities, drive traffic, and convert audiences into loyal customers.',
    features: ['Social media content calendars', 'Short-form video (Reels, TikTok)', 'Podcast production', 'Newsletter content', 'SEO content strategy', 'Influencer campaign management', 'Analytics & performance reporting'],
    galleryImages: ['7034014', '3379934', '2873486', '1884577', '3756132', '7247399'],
    whyUs: [
      { icon: Eye, title: 'Platform-Native Expertise', desc: 'Our team lives and breathes Instagram, TikTok, YouTube, and LinkedIn algorithms.' },
      { icon: Cpu, title: 'Data-Driven Creation', desc: 'Every content decision is informed by analytics and performance data.' },
      { icon: Layers, title: 'Consistency at Scale', desc: 'We produce content in volume without sacrificing quality or brand consistency.' },
    ],
  },
};

// ─── Process steps ────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { number: '01', title: 'Discovery', desc: 'We start by understanding your goals, audience, and brand essence through in-depth conversations and research.' },
  { number: '02', title: 'Planning', desc: 'Detailed pre-production planning: scripting, storyboarding, scheduling, casting, and location scouting.' },
  { number: '03', title: 'Production', desc: 'Our expert crew brings the vision to life with precision, creativity, and professional-grade equipment.' },
  { number: '04', title: 'Delivery', desc: 'Final deliverables are formatted for all required channels and handed over with full asset packages.' },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── ServiceDetailPage ────────────────────────────────────────────────────────

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const whyRef = useRef(null);
  const relatedRef = useRef(null);

  const processInView = useInView(processRef, { once: true, margin: '-80px' });
  const whyInView = useInView(whyRef, { once: true, margin: '-80px' });
  const relatedInView = useInView(relatedRef, { once: true, margin: '-80px' });

  // Find service from constants
  const service = SERVICES.find(s => s.slug === slug);
  if (!service) return <Navigate to="/services" replace />;

  const content = SERVICE_CONTENT[slug ?? ''] ?? SERVICE_CONTENT['documentary-production'];
  const Icon = ICON_MAP[service.icon] ?? Film;

  // Related services (3 different ones)
  const relatedServices = SERVICES.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{service.name} | {SITE_NAME}</title>
        <meta name="description" content={service.description} />
        <meta property="og:title" content={`${service.name} | ${SITE_NAME}`} />
        <meta property="og:image" content={content.heroImage} />
      </Helmet>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{service.name}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6 border border-white/20"
          >
            <Icon size={28} className="text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-4"
          >
            {service.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-[#D72638] font-bold text-xl mb-4 italic"
          >
            "{service.tagline}"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            {service.description}
          </motion.p>
        </div>
      </section>

      {/* ── Service Overview ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel label="Service Overview" />
              <h2 className="mt-4 text-4xl font-black text-slate-900 leading-tight">
                What We <span className="text-[#0056A6]">Deliver</span>
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed text-lg">{content.overview}</p>
              <div className="mt-8">
                <Link to="/portfolio">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                    Explore Our Work
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-xl mb-6">Key Features & Deliverables</h3>
              <ul className="space-y-3">
                {content.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#0056A6] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section ref={processRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={processInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Our Process" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              How We Work
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i} variants={fadeUp} initial="hidden" animate={processInView ? 'visible' : 'hidden'}
                className="relative"
              >
                {/* Connector line */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-slate-200 -translate-x-4 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0056A6] text-white font-black text-xl mb-5 shadow-lg shadow-[#0056A6]/25">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionLabel label="Gallery" center />
            <h2 className="mt-4 text-4xl font-black text-slate-900">Work Samples</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {content.galleryImages.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'}`}
              >
                <img
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={`${service.name} sample ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section ref={whyRef} className="py-24 bg-[#0056A6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={whyInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Why Choose Us" light center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-white">
              Why Dencast for {service.name}?
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.whyUs.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i} variants={fadeUp} initial="hidden" animate={whyInView ? 'visible' : 'hidden'}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-5">
                    <ItemIcon size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Related Services ── */}
      <section ref={relatedRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={relatedInView ? 'visible' : 'hidden'}
            className="mb-12"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Related Services" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black text-slate-900">
              You Might Also Need
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((related, i) => {
              const RelIcon = ICON_MAP[related.icon] ?? Search;
              return (
                <motion.div
                  key={related.id}
                  custom={i} variants={fadeUp} initial="hidden" animate={relatedInView ? 'visible' : 'hidden'}
                >
                  <ServiceCard
                    name={related.name}
                    description={related.description}
                    slug={related.slug}
                    icon={<RelIcon size={20} />}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#0056A6]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Get Started" light center />
          <h2 className="mt-4 text-4xl font-black text-white">
            Explore Our Work
          </h2>
          <p className="mt-5 text-white/70 text-lg">
            Discover how our {service.name.toLowerCase()} projects are crafted from concept to delivery.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/portfolio">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Explore Our Work
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg">
                See Our Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
