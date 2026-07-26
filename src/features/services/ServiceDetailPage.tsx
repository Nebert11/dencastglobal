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
  sampleImages?: string[];
  mediaSectionTitle?: string;
  mediaLinks?: { title: string; url: string }[];
  whyUs: { icon: React.ElementType; title: string; desc: string }[];
}

const PHOTOGRAPHY_SAMPLE_IMAGES = [
  '/dencast_images/White-Beach-Palace.jpg',
  '/dencast_images/event1.jpg',
  '/dencast_images/sasini_conference.jpg',
  '/dencast_images/amakowe.jpg',
  '/dencast_images/rhnks2024.jpg',
];

const isYoutubeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be');
  } catch {
    return false;
  }
};

const toYoutubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
};

const SERVICE_CONTENT: Record<string, ServiceRichContent> = {
  'documentary-production': {
    heroImage: '/dencast_images/Dencast-Crew-27.jpg',
    overview: 'Our documentary production team brings decades of combined experience to every project. We handle everything from the initial concept and research phase through principal photography, post-production, and final distribution — ensuring your story reaches the audience it deserves.',
    features: ['4K & 8K Cinema Camera Packages', 'Multi-lingual production capability', 'Archival research & fact-checking', 'Original score composition', 'Festival submission strategy', 'International distribution network', 'Subtitling & localisation'],
    mediaSectionTitle: 'Documentaries',
    mediaLinks: [
      { title: 'Sasini PLC Sustainability Documentary 2023 ', url: 'https://www.youtube.com/watch?v=WDHIUaR6i-c&t=3s' },
      { title: 'Our Genesis. Our Heritage. Our Aspiration.  ', url: 'https://www.youtube.com/watch?v=ZBoB9kyjIw4' },
      { title: 'Buzz Women Inspiration Fellowship', url: 'https://www.youtube.com/watch?v=oG_IAvExIqM&t=37s' },
      { title: 'Tunaweza Impact Documentary ', url: 'https://www.youtube.com/watch?v=IybO1Rr95ek&t=2s' },
      { title: 'Shaping Young Leaders through the Bible ', url: 'https://www.youtube.com/watch?v=NgUnE8g_z6I&t=42s' },
      { title: 'Catalysing Leaders Graduation  ', url: 'https://www.youtube.com/watch?v=_3NKliaLP-c&t=54s' },
      // { title: 'Documentary Feature 7', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk&t=27s' },
    ],
    whyUs: [
      { icon: Eye, title: 'Authentic Storytelling', desc: 'We immerse ourselves in every subject before filming, ensuring authentic and respectful narratives.' },
      { icon: Cpu, title: 'Cutting-Edge Technology', desc: '4K/8K cinema cameras, drone cinematography, and professional post-production suites.' },
      { icon: Layers, title: 'Festival-Ready Quality', desc: 'Our films have premiered at TIFF, Sundance, and FESPACO.' },
    ],
  },
  'livestreaming-events': {
    heroImage: '/dencast_images/Virtual-livestreaming-scaled.jpg',
    overview: 'We deliver flawless live production for events of any scale. Our multi-camera broadcast crews, redundant streaming infrastructure, and experienced technical directors ensure your live event reaches a global audience without a single dropped frame.',
    features: ['Multi-camera live switching', 'Up to 4K streaming resolution', 'Redundant internet connectivity', 'Platform-agnostic delivery', 'Live graphics & lower thirds', 'Real-time audience engagement tools', 'Post-event VOD package'],
    mediaSectionTitle: 'Livestream',
    mediaLinks: [
      { title: 'Sasini Impact Livestream', url: 'https://www.youtube.com/watch?v=F0sANQiiRxE&t=33s' },
      { title: 'Tunaweza project report launch  ', url: 'https://www.youtube.com/watch?v=82Ex2fbk96o&t=3979s' },
      { title: 'Equity Bank 22nd Annual AGM 2026 ', url: 'https://www.youtube.com/watch?v=Mx4MYVYGcnE' },
      { title: "6TH National ECD Stakeholder's Conference", url: 'https://www.youtube.com/watch?v=Q7H3QgmaKp8&t=5075s' },
      { title: 'Empowering Women & Men Through Enhanced Childcare Support System ', url: 'https://www.youtube.com/watch?v=eVXun6P1x98' },
      { title: "6TH National ECD Stakeholder's Conference ", url: 'https://www.youtube.com/watch?v=aMxamcefU8Y&t=5594s' },
      // { title: 'Livestream Session 7', url: 'https://www.youtube.com/watch?v=ueiIbj_OiV8&t=4s' },
    ],
    whyUs: [
      { icon: Eye, title: 'Zero-Downtime Delivery', desc: 'Triple-redundant systems ensure your stream never drops, no matter what.' },
      { icon: Cpu, title: 'Multi-Platform Broadcasting', desc: 'YouTube, Facebook, Zoom, Teams, Twitch — we stream everywhere simultaneously.' },
      { icon: Layers, title: 'Experienced Technical Team', desc: 'Broadcast engineers with years of live TV and event production experience.' },
    ],
  },
  'photography': {
    heroImage: '/dencast_images/White-Beach-Palace.jpg',
    overview: 'Our photography team produces images that transcend documentation — they tell stories. From editorial portraits and commercial product shots to large-scale event coverage and aerial photography, every image is crafted with intention.',
    features: ['Medium format & full-frame cameras', 'Studio & location lighting', 'Aerial / drone photography', 'Retouching & colour grading', 'Same-day delivery available', 'Print-ready high-resolution files', 'Commercial licensing packages'],
    sampleImages: PHOTOGRAPHY_SAMPLE_IMAGES,
    whyUs: [
      { icon: Eye, title: 'Award-Winning Photographers', desc: 'Our photographers have been published in Vogue Africa, Forbes, and National Geographic.' },
      { icon: Cpu, title: 'Studio & Field Ready', desc: 'Fully equipped mobile studio that travels anywhere on the continent.' },
      { icon: Layers, title: 'Fast Turnaround', desc: 'Professionally edited images delivered within 48 hours of shoot.' },
    ],
  },
  'events-management': {
    heroImage: '/dencast_images/CONFERENCE.png',
    overview: 'Dencast Global delivers professionally planned and creatively executed events that bring people, brands, and ideas together. From conferences, corporate functions, launches, award ceremonies, exhibitions, and hybrid events to high-profile public engagements, we manage every detail with precision.',
    features: ['Concept development and event strategy', 'Event branding and visual identity', 'Production coordination and stage management', 'Guest experience and protocol support', 'Technical management and on-site support', 'Integrated photography, videography, and livestreaming', 'Post-event evaluation and reporting'],
    whyUs: [
      { icon: Eye, title: 'End-to-End Coordination', desc: 'From concept to execution, we align every production detail to your event goals.' },
      { icon: Cpu, title: 'Hybrid Event Expertise', desc: 'We combine in-person excellence with dependable virtual and hybrid delivery.' },
      { icon: Layers, title: 'Audience-First Experiences', desc: 'Every touchpoint is designed to communicate clearly and leave a lasting impression.' },
    ],
  },
  'audio-management-soundtrack-development': {
    heroImage: '/dencast_images/band.jpg',
    overview: 'Dencast Global provides professional audio management and original soundtrack development for events, films, documentaries, commercials, and digital productions. From clear conference sound to cinematic scoring, we ensure every word is heard and every moment is felt.',
    features: ['Live sound system setup and engineering', 'Microphone planning and live mixing', 'Audio recording and post-production cleanup', 'Voice-over recording and direction', 'Custom sound design and effects', 'Original music beds and theme development', 'Final mastering for broadcast and digital'],
    whyUs: [
      { icon: Eye, title: 'Clarity and Presence', desc: 'We optimize every environment so speech, music, and ambience are consistently clear.' },
      { icon: Cpu, title: 'Production-Ready Audio', desc: 'Our team covers live, studio, and post workflows with professional-grade tools.' },
      { icon: Layers, title: 'Original Sonic Identity', desc: 'Custom soundtrack work gives your events and productions a memorable signature.' },
    ],
  },
  'videography': {
    heroImage: '/dencast_images/9-scaled.jpg',
    overview: 'High-production-value video content that elevates your brand and drives results. Our videography teams are equipped for everything from intimate interview setups to large multi-camera corporate productions.',
    features: ['Cinema-grade camera packages', 'Professional lighting & grip', 'Colour grading & VFX', 'Motion graphics & animation', 'Multi-format delivery', 'Scripting & storyboarding', '360° video capability'],
    whyUs: [
      { icon: Eye, title: 'Cinematic Quality', desc: 'Every video is crafted with the attention to detail of a feature film production.' },
      { icon: Cpu, title: 'Full Post-Production', desc: 'In-house colour grading, VFX, and audio mixing for end-to-end quality control.' },
      { icon: Layers, title: 'Multi-Format Output', desc: 'Delivered optimised for broadcast, web, social media, and OTT platforms.' },
    ],
  },
  'brand-strategy': {
    heroImage: '/dencast_images/image.png',
    overview: 'Strategic brand development that positions you clearly in a crowded market. We combine deep market research, consumer insight, and creative thinking to build brands that resonate, differentiate, and endure.',
    features: ['Brand audit & competitive analysis', 'Brand positioning & messaging', 'Visual identity systems', 'Brand guidelines documentation', 'Campaign strategy & planning', 'Brand voice & tone development', 'Internal brand activation'],
    mediaSectionTitle: 'Creative branding',
    mediaLinks: [
      { title: 'Creative Branding Showcase', url: 'https://www.youtube.com/watch?v=TZSWsi-XMn8&t=19s' },
      { title: 'RHNK Conference Report', url: 'https://rhnk.org/documents/RHNK%208TH%20Conference_Report%20Final.pdf' },
      { title: 'RHNK Conference', url: 'https://rhnk.org/conference' },
      { title: 'RHNK Conference Resources', url: 'https://rhnk.org/conference/resources#resources-policy-briefs' },
    ],
    whyUs: [
      { icon: Eye, title: 'Data-Driven Strategy', desc: 'Every brand recommendation is backed by market research and consumer insights.' },
      { icon: Cpu, title: 'Creative Execution', desc: 'Strategy and creative execution under one roof for seamless brand development.' },
      { icon: Layers, title: 'Long-Term Partnership', desc: 'We grow with your brand, reviewing and evolving the strategy as you scale.' },
    ],
  },
  'creative-media': {
    heroImage: '/dencast_images/BANNER.png',
    overview: 'Bold, boundary-pushing creative media that captures attention and refuses to be forgotten. We conceptualise and execute multimedia campaigns, motion graphics, and experimental content that makes your audience stop scrolling.',
    features: ['2D & 3D motion graphics', 'Animated explainer videos', 'Interactive digital experiences', 'Conceptual campaign development', 'Mixed media productions', 'Social-first content series', 'Branded entertainment'],
    mediaSectionTitle: 'Digital Campaigns',
    mediaLinks: [
      { title: 'KEPSA CEO - EU Business Forum Promo Video', url: 'https://www.youtube.com/watch?v=xxhgNvMs5i8' },
      { title: 'Embassy of Sweden EU Business Forum Promo Video', url: 'https://www.youtube.com/watch?v=eGKVpdyiBSw' },
      { title: 'EU Shamba Pride', url: 'https://www.youtube.com/watch?v=PxF-Oz5O2xg' },
      // { title: 'Digital Campaign 4', url: 'https://www.youtube.com/watch?v=632y28-SHt8&t=38s' },
    ],
    whyUs: [
      { icon: Eye, title: 'Boundless Creativity', desc: 'No brief is too ambitious — we thrive on creative challenges that others won\'t attempt.' },
      { icon: Cpu, title: 'Multimedia Expertise', desc: 'Animation, VFX, interactive design — our team spans every creative discipline.' },
      { icon: Layers, title: 'Performance-Focused', desc: 'Creative that looks great and delivers measurable engagement results.' },
    ],
  },
  'drone-services': {
    heroImage: '/dencast_images/Drone .jpg',
    overview: 'Licensed aerial cinematography and photography that unlocks perspectives impossible to achieve from the ground. Our drone pilots are CAA-certified and experienced in complex environments from urban cityscapes to remote wilderness.',
    features: ['4K & 6K aerial cinematography', 'CAA-certified pilots', 'Night aerial photography', 'Thermal imaging capability', 'Mapping & survey flights', 'Live aerial streaming', 'Permit handling included'],
    whyUs: [
      { icon: Eye, title: 'CAA-Certified Pilots', desc: 'All our drone pilots hold current aviation authority certifications for commercial operations.' },
      { icon: Cpu, title: 'Premium Drone Fleet', desc: 'DJI Inspire 3, Matrice 350, and Autel Robotics for every project need.' },
      { icon: Layers, title: 'Permit Management', desc: 'We handle all airspace permits and coordination with aviation authorities.' },
    ],
  },
  'corporate-communications': {
    heroImage: '/dencast_images/sasini_conference.jpg',
    overview: 'Clear, compelling corporate communications that align your organisation from the C-suite to the frontline. We produce executive messaging videos, investor presentations, internal communications, and annual reports that speak with one powerful voice.',
    features: ['Executive video messaging', 'Investor presentation production', 'Annual report design & video', 'Internal comms strategy', 'Town hall & AGM production', 'Employee onboarding content', 'Crisis communication support'],
    mediaSectionTitle: 'Corporate Productions',
    mediaLinks: [
      { title: 'Sasini Impact Corporate Film', url: 'https://www.youtube.com/watch?v=F0sANQiiRxE&t=33s' },
      { title: 'Corporate Production 2', url: 'https://www.youtube.com/watch?v=kIpukvtuV48' },
      { title: 'RHNK How to Register, Submit Abstract and Become a Conference Sponsor ', url: 'https://www.youtube.com/watch?v=TZSWsi-XMn8&t=19s' },
      { title: 'Corporate Production 4', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk&t=27s' },
    ],
    whyUs: [
      { icon: Eye, title: 'Board-Level Experience', desc: 'We understand corporate governance and produce content that satisfies all stakeholders.' },
      { icon: Cpu, title: 'Discretion Guaranteed', desc: 'Strict NDAs and confidentiality protocols for all sensitive corporate projects.' },
      { icon: Layers, title: 'Multi-Channel Delivery', desc: 'Content formatted for intranet, broadcast, investor portals, and social media.' },
    ],
  },
  'commercial-productions': {
    heroImage: '/dencast_images/africatalyst.jpg',
    overview: 'TV commercials, online ads, and product films engineered to convert. We combine compelling creative with strategic thinking to produce commercials that build brand equity and drive sales across all media platforms.',
    features: ['TVC production (15s, 30s, 60s)', 'Digital ad formats (pre-roll, stories)', 'Product filming & styling', 'Celebrity & talent management', 'Jingle & audio branding', 'A/B testing creative variants', 'Media buying consultation'],
    whyUs: [
      { icon: Eye, title: 'Broadcast Standard Quality', desc: 'Our commercials meet the technical specifications of every major African broadcaster.' },
      { icon: Cpu, title: 'Creative & Strategy Combined', desc: 'We don\'t just produce great ads — we ensure they work in the media plan.' },
      { icon: Layers, title: 'Talent Network', desc: 'Access to Africa\'s leading on-screen talent, voice artists, and directors.' },
    ],
  },
  'digital-content-creation': {
    heroImage: '/dencast_images/21.png',
    overview: 'Scroll-stopping digital-first content engineered for engagement. We create content series, social media campaigns, and digital experiences that build communities, drive traffic, and convert audiences into loyal customers.',
    features: ['Social media content calendars', 'Short-form video (Reels, TikTok)', 'Podcast production', 'Newsletter content', 'SEO content strategy', 'Influencer campaign management', 'Analytics & performance reporting'],
    mediaSectionTitle: 'Digital Content',
    mediaLinks: [
      { title: 'Dencast Global: Malindi by Day', url: 'https://www.youtube.com/watch?v=pYOevHo8v7Q' },
      { title: 'EU KE Global Gateway - Green Energy', url: 'https://www.youtube.com/watch?v=JKVNraadnmw' },
      { title: 'Sasini plc sustainable development goals', url: 'https://www.youtube.com/watch?v=-NO6J79zJbg&t=5s' },
    ],
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
  const sampleImages = content.sampleImages ?? [];
  const mediaVideos = (content.mediaLinks ?? []).filter((item) => isYoutubeUrl(item.url));
  const mediaResources = (content.mediaLinks ?? []).filter((item) => !isYoutubeUrl(item.url));

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
            className="text-[#D3232E] font-bold text-xl mb-4 italic"
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
                What We <span className="text-[#25408F]">Deliver</span>
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
                    <CheckCircle2 size={20} className="text-[#25408F] mt-0.5 flex-shrink-0" />
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#25408F] text-white font-black text-xl mb-5 shadow-lg shadow-[#25408F]/25">
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

      {/* ── Work Samples ── */}
      {(sampleImages.length > 0 || (content.mediaLinks && content.mediaLinks.length > 0)) && (
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionLabel label="Work Samples" center />
              <h2 className="mt-4 text-4xl font-black text-slate-900">
                {content.mediaSectionTitle ?? 'Videos & Resources'}
              </h2>
            </div>

            {sampleImages.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {sampleImages.map((image, index) => (
                  <article
                    key={image}
                    className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white ${index === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}
                  >
                    <img
                      src={image}
                      alt={`${service.name} sample ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
            )}

            {mediaVideos.length > 0 && (
              <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${sampleImages.length > 0 ? 'mt-8' : ''}`}>
                {mediaVideos.map((video) => (
                  <article
                    key={video.url}
                    className="rounded-xl border border-slate-200 bg-white p-3 hover:border-[#25408F]/40 hover:bg-[#25408F]/5 transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden rounded-lg bg-black">
                      <iframe
                        src={toYoutubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{video.title}</p>
                  </article>
                ))}
              </div>
            )}

            {mediaResources.length > 0 && (
              <div className={mediaVideos.length > 0 ? 'mt-8' : ''}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Resources</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaResources.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-[#25408F]/40 hover:bg-[#25408F]/5 transition-all duration-300"
                    >
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[#25408F] transition-colors">
                        {link.title}
                      </span>
                      <ArrowRight size={16} className="text-[#D3232E] flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section ref={whyRef} className="py-24 bg-[#25408F]">
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
      <section className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#25408F]">
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
