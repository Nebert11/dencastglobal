import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight, Calendar, Tag, User, Share2,
  Twitter, Linkedin, Link as LinkIcon, ArrowRight,
  CheckCircle2, PlayCircle,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import MediaCard from '@/components/ui/MediaCard';
import { SITE_NAME } from '@/utils/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoLink {
  title: string;
  url: string;
}

interface ProjectData {
  slug: string;
  title: string;
  category: string;
  client: string;
  date: string;
  heroImage: string;      // local path e.g. /dencast_images/...
  excerpt: string;        // short card description (1–2 sentences)
  description: string;    // full narrative — use \n\n to separate paragraphs
  videos: VideoLink[];    // YouTube links
  services: string[];
  gallery: string[];      // local image paths (empty = photos coming soon)
  relatedSlugs: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    const id = parsed.searchParams.get('v');
    const t = parsed.searchParams.get('t');
    const start = t ? `?start=${parseInt(t, 10)}` : '';
    return id ? `https://www.youtube.com/embed/${id}${start}` : url;
  } catch {
    return url;
  }
};

// ─── Project Data ─────────────────────────────────────────────────────────────

const PROJECTS: Record<string, ProjectData> = {

  'sasini-sustainability-report': {
    slug: 'sasini-sustainability-report',
    title: 'Sasini Sustainability Report Launch',
    category: 'Corporate',
    client: 'Sasini PLC',
    date: '2021 – Present',
    heroImage: '/dencast_images/sasini_conference.jpg',
    excerpt: 'Four years of capturing Sasini PLC\'s sustainability journey across tea, coffee, macadamia, and avocado plantations.',
    description:
      'For the past four years, we have collaborated closely with Sasini PLC, showcasing their sustainability journey across expansive tea, coffee, macadamia, and avocado plantations. Our team has traversed their farms and processing plants, crafting visually stunning narratives that highlight their commitment to responsible and sustainable agricultural practices.\n\nAs one of Kenya\'s leading agribusinesses, Sasini is at the forefront of sustainability, and we are honoured to help tell their story.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'Sasini Sustainability Report – Video 1', url: 'https://www.youtube.com/watch?v=QnnVSv48PIM' },
      { title: 'Sasini Sustainability Report – Video 2', url: 'https://www.youtube.com/watch?v=WDHIUaR6i-c' },
      { title: 'Sasini Sustainability Report – Video 3', url: 'https://www.youtube.com/watch?v=zeLCnl_wASw' },
      { title: 'Sasini Sustainability Report – Video 4', url: 'https://www.youtube.com/watch?v=2HF4pXkmntk' },
    ],
    services: ['Documentary Production', 'Cinematography', 'Post-Production', 'Corporate Storytelling'],
    gallery: [],
    relatedSlugs: ['elf-africa', 'rhnk-conference', 'documentaries'],
  },

  'elf-africa': {
    slug: 'elf-africa',
    title: 'ELF Africa – Building Leaders Through Story',
    category: 'Corporate',
    client: 'Emerging Leaders Foundation (ELF)',
    date: '2012 – Present',
    heroImage: '/dencast_images/elf.png',
    excerpt: 'Over 12 years as ELF\'s trusted media partner — documentaries, social content, and livestream productions that inspire Africa\'s next generation of leaders.',
    description:
      'For over 12 years, Dencast Global has walked the development journey with the Emerging Leaders Foundation (ELF), helping to showcase their mission of building the next generation of value-driven African leaders.\n\nFrom impactful documentaries to engaging social media content and livestream productions, we have been their trusted media partner in bringing their incredible work to life.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.\n\nHere are some of the inspiring stories we have worked on together. For more, visit ELF\'s official YouTube page.',
    videos: [
      { title: 'ELF Africa – Annual Report', url: 'https://www.youtube.com/watch?v=EgTs8_Bm_RQ' },
      { title: 'ELF Africa – Video 2', url: 'https://www.youtube.com/watch?v=JDr9mvraBjM' },
      { title: 'ELF Africa – Video 3', url: 'https://www.youtube.com/watch?v=oG_IAvExIqM' },
      { title: 'ELF Africa – Video 4', url: 'https://www.youtube.com/watch?v=ZBoB9kyjIw4' },
    ],
    services: ['Documentary Production', 'Social Media Content', 'Livestreaming', 'Post-Production'],
    gallery: [],
    relatedSlugs: ['sasini-sustainability-report', 'documentaries', 'rhnk-conference'],
  },

  'european-union-videos': {
    slug: 'european-union-videos',
    title: 'European Union – Media & Digital',
    category: 'Corporate',
    client: 'European Union Delegation in Kenya',
    date: '2022 – Present',
    heroImage: '/dencast_images/africatalyst.jpg',
    excerpt: 'Supporting the EU Delegation in Kenya with high-quality video productions that amplify their programmes and digital communication strategy.',
    description:
      'Dencast Global has partnered with the European Union Delegation in Kenya to produce a wide range of media content — from event coverage and promotional videos to digital storytelling that communicates the EU\'s development programmes and partnerships across the country.\n\nOur productions span conferences, ceremonies, ambassador events, and key milestones in the EU–Kenya relationship, captured with cinematic precision and delivered to global standards.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'European Union – Video 1', url: 'https://www.youtube.com/watch?v=jIVbFh117dA' },
      { title: 'European Union – Video 2', url: 'https://www.youtube.com/watch?v=JKVNraadnmw' },
      { title: 'European Union – Video 3', url: 'https://www.youtube.com/watch?v=nhfmECVhyRg' },
      { title: 'European Union – Video 4', url: 'https://www.youtube.com/watch?v=p2ydGxuTK5U' },
    ],
    services: ['Event Coverage', 'Videography', 'Digital Content', 'Post-Production'],
    gallery: [],
    relatedSlugs: ['europe-day-football', 'european-investment-bank', 'rhnk-conference'],
  },

  'europe-day-football': {
    slug: 'europe-day-football',
    title: 'Europe Day Football Tournament',
    category: 'Corporate',
    client: 'European Union in Kenya',
    date: '2024',
    heroImage: '/dencast_images/DSC_3798-scaled.jpg',
    excerpt: 'Capturing sportsmanship, unity, and youthful determination at the first-ever EU Europe Day Football Tournament held across five Kenyan counties.',
    description:
      'Sports and culture unite communities, and we were privileged to partner with the European Union in Kenya for their first-ever Europe Day Football Tournament. Held across five counties — Marsabit, Homa Bay, Kilifi, Nairobi, and more — this tournament celebrated resilience, diversity, and the passion for football.\n\nThe event culminated in an exciting grand finale at Ulinzi Sports Complex in Nairobi, bringing together the best teams from all regions for a thrilling showdown. Through our lens, we captured the essence of sportsmanship, unity, and youthful determination.\n\nWe have also played a key role in showcasing their digital transformation journey and livestreaming select events across various regions in Kenya.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'Europe Day Football – Video 1', url: 'https://www.youtube.com/watch?v=YGQ0MSiaEXs' },
      { title: 'Europe Day Football – Video 2', url: 'https://www.youtube.com/watch?v=nQcN6uXbDss' },
      { title: 'Europe Day Football – Video 3', url: 'https://www.youtube.com/watch?v=XAZXVI6bvOo' },
    ],
    services: ['Sports Coverage', 'Event Videography', 'Livestreaming', 'Photography'],
    gallery: [],
    relatedSlugs: ['european-union-videos', 'european-investment-bank', 'rhnk-conference'],
  },

  'european-investment-bank': {
    slug: 'european-investment-bank',
    title: 'European Investment Bank',
    category: 'Corporate',
    client: 'European Investment Bank',
    date: '2023 – Present',
    heroImage: '/dencast_images/event1.jpg',
    excerpt: 'Professional video production for the European Investment Bank, documenting their initiatives and investments across Africa.',
    description:
      'Dencast Global has had the honour of partnering with the European Investment Bank (EIB) to produce compelling video content that documents their investment initiatives, programmes, and partnerships across Africa.\n\nOur productions capture key meetings, project highlights, and the tangible impact of EIB investments on communities and economies — delivered with the highest production standards.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'European Investment Bank – Video 1', url: 'https://www.youtube.com/watch?v=632y28-SHt8' },
      { title: 'European Investment Bank – Video 2', url: 'https://www.youtube.com/watch?v=PxF-Oz5O2xg' },
      { title: 'European Investment Bank – Video 3', url: 'https://www.youtube.com/watch?v=mblSEtbtGD8' },
    ],
    services: ['Corporate Videography', 'Event Coverage', 'Post-Production'],
    gallery: [],
    relatedSlugs: ['european-union-videos', 'europe-day-football', 'sasini-sustainability-report'],
  },

  'amakove-wala-show': {
    slug: 'amakove-wala-show',
    title: 'The Amakove Wala Show',
    category: 'Streaming',
    client: 'Dr. Amakove Wala',
    date: '2023',
    heroImage: '/dencast_images/amakowe.jpg',
    excerpt: 'From ideation to post-production — a fully-produced TV show opening honest conversations on social matters with Dr. Amakove Wala.',
    description:
      'From supporting ideation to pre-production, including scripting, media training, on-screen management, and all the way through to final production and post-production, we were fully immersed in creating an insightful TV show.\n\nWe had the pleasure of partnering with industry leaders, including Dr. Amakove Wala, to bring this beautiful episode to life.\n\nThe Amakove Wala Show seeks to open up a space for honest conversations on social matters to encourage, uplift, cheer and celebrate those who have defied societal pressures to become the truest versions of themselves. The topics range from relationships, career/education, breaking stereotypes, life beyond 40, parenting, friendships and beyond.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'The Amakove Wala Show – Divorce and Separation', url: 'https://www.youtube.com/watch?v=D1QvoiMpK-Q' },
    ],
    services: ['TV Production', 'Scripting & Pre-production', 'Media Training', 'Post-Production'],
    gallery: [],
    relatedSlugs: ['live-streaming', 'documentaries', 'rhnk-conference'],
  },

  'rhnk-conference': {
    slug: 'rhnk-conference',
    title: 'RHNK Pan-African Conference',
    category: 'Events',
    client: 'Reproductive Health Network Kenya (RHNK)',
    date: '2024, 2025, 2026',
    heroImage: '/dencast_images/rhnk.jpg',
    excerpt: '360-degree conference coverage — videography, photography, livestreaming, and breakout recordings for 800+ delegates at RHNK\'s annual Pan-African conference.',
    description:
      'Managing conference coverage that tells a 360-degree story of an event is no small task, but that\'s exactly what we achieved with Reproductive Health Network Kenya (RHNK).\n\nAt the 2024, 2025 and 2026 RHNK Conference held at White Sands Beach Resort & Spa in Mombasa, our team delivered:\n✔ Comprehensive videography and photography covering the entire event\n✔ Livestreaming of key sessions for global audiences\n✔ Breakout room recordings capturing abstract presentations and panel discussions\n\nWith over 800 delegates in attendance, we ensured that every angle of the conference was beautifully captured.\n\nAt Dencast Global, we\'ve got your event coverage covered — so you can focus on the content while we handle the communication.',
    videos: [
      { title: 'RHNK Pan-African Conference 2026', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk' },
      { title: 'RHNK Conference – Video 2', url: 'https://www.youtube.com/watch?v=QPwGbAjNSpc' },
      { title: 'RHNK Pan-African Conference 2025 Highlights', url: 'https://www.youtube.com/watch?v=_0hFwZtRoqU' },
      { title: 'RHNK Conference – Video 4', url: 'https://www.youtube.com/watch?v=kIpukvtuV48' },
    ],
    services: ['Event Videography', 'Photography', 'Livestreaming', 'Breakout Room Recording'],
    gallery: [],
    relatedSlugs: ['sasini-sustainability-report', 'elf-africa', 'live-streaming'],
  },

  'live-streaming': {
    slug: 'live-streaming',
    title: 'Livestreaming Services',
    category: 'Streaming',
    client: 'Various Clients',
    date: '2020 – Present',
    heroImage: '/dencast_images/Virtual-livestreaming-scaled.jpg',
    excerpt: 'Reliable, cost-effective livestreaming systems for AGMs, hybrid conferences, and high-profile meetings — trusted by Kenya\'s leading brands since 2020.',
    description:
      'We have developed reliable yet cost-effective systems to support organisations in reaching out, or handle high profile meetings without any disruptions.\n\nSince the advent of the Covid-19 Pandemic, we have worked closely with leading brands in Kenya to deliver Virtual Annual General meetings and hybrid conferences with ultimate precision at affordable costs.\n\nOur technical livestreaming infrastructure ensures seamless multi-camera broadcasts, professional audio management, and real-time audience engagement for events of any scale.',
    videos: [
      { title: 'Sasini Impact Livestream 1', url: 'https://www.youtube.com/watch?v=F0sANQiiRxE' },
      { title: 'Sasini Impact Livestream 2', url: 'https://www.youtube.com/watch?v=82Ex2fbk96o' },
      { title: 'Sasini Impact Livestream 3', url: 'https://www.youtube.com/watch?v=Mx4MYVYGcnE' },
      { title: 'Sasini Impact Livestream 4', url: 'https://www.youtube.com/watch?v=Q7H3QgmaKp8' },
      { title: 'Sasini Impact Livestream 5', url: 'https://www.youtube.com/watch?v=eVXun6P1x98' },
      { title: 'Sasini Impact Livestream 6', url: 'https://www.youtube.com/watch?v=aMxamcefU8Y' },
      { title: 'Sasini Impact Livestream 7', url: 'https://www.youtube.com/watch?v=ueiIbj_OiV8' },
    ],
    services: ['Livestreaming', 'Virtual AGMs', 'Hybrid Conferences', 'Technical Production'],
    gallery: [],
    relatedSlugs: ['rhnk-conference', 'amakove-wala-show', 'european-union-videos'],
  },

  'documentaries': {
    slug: 'documentaries',
    title: 'Documentary Productions',
    category: 'Documentary',
    client: 'Various Clients',
    date: '2015 – Present',
    heroImage: '/dencast_images/9.png',
    excerpt: 'Award-standard documentary filmmaking — compelling visual narratives that inform, inspire, and engage audiences on topics that matter.',
    description:
      'At Dencast Global, excellence is our watchword in documentary filmmaking. We craft compelling visual narratives that inform, inspire, and engage. Whether capturing real-life events, cultural heritage, corporate milestones, or investigative pieces, we ensure every story is told with authenticity and cinematic brilliance.\n\nOur documentary productions are tailored to meet each client\'s specific interests and objectives. We take a deep dive into research, scripting, and storytelling to create documentaries that resonate with audiences and leave a lasting impact.\n\nWith state-of-the-art equipment and a team of skilled professionals, we handle every aspect of production — from pre-production planning to high-quality filming, post-production editing, and final delivery.\n\nWhether it\'s a short-form feature or an in-depth documentary series, Dencast Global guarantees a polished, high-definition final product that meets global standards.',
    videos: [
      { title: 'Documentary – Sasini Story', url: 'https://www.youtube.com/watch?v=WDHIUaR6i-c' },
      { title: 'Documentary – ELF Leaders', url: 'https://www.youtube.com/watch?v=ZBoB9kyjIw4' },
      { title: 'Documentary – ELF Stories', url: 'https://www.youtube.com/watch?v=oG_IAvExIqM' },
      { title: 'Documentary – Feature 4', url: 'https://www.youtube.com/watch?v=IybO1Rr95ek' },
      { title: 'Documentary – Feature 5', url: 'https://www.youtube.com/watch?v=NgUnE8g_z6I' },
      { title: 'Documentary – Feature 6', url: 'https://www.youtube.com/watch?v=_3NKliaLP-c' },
      { title: 'Documentary – RHNK Story', url: 'https://www.youtube.com/watch?v=q-I1iYGhLPk' },
    ],
    services: ['Documentary Production', 'Cinematography', 'Scripting & Research', 'Post-Production'],
    gallery: [],
    relatedSlugs: ['elf-africa', 'sasini-sustainability-report', 'amakove-wala-show'],
  },
};

// Fallback for unrecognised slugs
const DEFAULT_PROJECT = PROJECTS['sasini-sustainability-report'];

// Related card lookup
const RELATED_LOOKUP: Record<string, { title: string; category: string; image: string }> = {
  'sasini-sustainability-report': { title: 'Sasini Sustainability Report', category: 'Corporate', image: '/dencast_images/sasini_conference.jpg' },
  'elf-africa':                   { title: 'ELF Africa', category: 'Corporate', image: '/dencast_images/elf.png' },
  'european-union-videos':        { title: 'European Union', category: 'Corporate', image: '/dencast_images/africatalyst.jpg' },
  'europe-day-football':          { title: 'Europe Day Football', category: 'Corporate', image: '/dencast_images/DSC_3798-scaled.jpg' },
  'european-investment-bank':     { title: 'European Investment Bank', category: 'Corporate', image: '/dencast_images/event1.jpg' },
  'amakove-wala-show':            { title: 'The Amakove Wala Show', category: 'Streaming', image: '/dencast_images/amakowe.jpg' },
  'rhnk-conference':              { title: 'RHNK Conference', category: 'Events', image: '/dencast_images/rhnk.jpg' },
  'live-streaming':               { title: 'Livestreaming Services', category: 'Streaming', image: '/dencast_images/Virtual-livestreaming-scaled.jpg' },
  'documentaries':                { title: 'Documentary Productions', category: 'Documentary', image: '/dencast_images/9.png' },
};

// ─── ProjectDetailPage ────────────────────────────────────────────────────────

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = (slug && PROJECTS[slug]) ? PROJECTS[slug] : DEFAULT_PROJECT;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paragraphs = project.description
    .split(/\n\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{project.title} | Portfolio | {SITE_NAME}</title>
        <meta name="description" content={project.excerpt} />
        <meta property="og:title" content={`${project.title} | ${SITE_NAME}`} />
        <meta property="og:image" content={project.heroImage} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] sm:min-h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${project.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium line-clamp-1">{project.title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-3 py-1 bg-[#D3232E] text-white text-xs font-bold uppercase tracking-widest rounded-md mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-4xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><User size={14} /> {project.client}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {project.date}</span>
              <span className="flex items-center gap-1.5"><Tag size={14} /> {project.category}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Share / Back Bar ── */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Share2 size={14} /> Share:
            </p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg text-xs font-semibold hover:bg-[#1DA1F2] hover:text-white transition-all"
            >
              <Twitter size={13} /> Twitter
            </a>
            <a
              href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B5]/10 text-[#0077B5] rounded-lg text-xs font-semibold hover:bg-[#0077B5] hover:text-white transition-all"
            >
              <Linkedin size={13} /> LinkedIn
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all"
            >
              <LinkIcon size={13} /> {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <Link to="/portfolio" className="text-sm text-[#25408F] font-semibold hover:underline">
            ← Back to Portfolio
          </Link>
        </div>
      </div>

      {/* ── Description + Details ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16 items-start">

            {/* Description */}
            <div className="lg:col-span-2">
              <SectionLabel label="About This Project" />
              <div className="mt-6 space-y-5">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Project details card */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Project Details</h3>
              <dl className="space-y-4">
                {[
                  { label: 'Client', value: project.client },
                  { label: 'Category', value: project.category },
                  { label: 'Period', value: project.date },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <dt className="text-sm font-semibold text-slate-500 w-24 flex-shrink-0">{label}</dt>
                    <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-sm font-semibold text-slate-500 mb-3">Services</dt>
                  <dd className="flex flex-wrap gap-2">
                    {project.services.map(svc => (
                      <span key={svc} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25408F]/10 text-[#25408F] rounded-full text-xs font-semibold">
                        <CheckCircle2 size={11} />
                        {svc}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
              <div className="mt-8">
                <Link to="/contact">
                  <Button variant="primary" size="md" className="w-full justify-center" rightIcon={<ArrowRight size={15} />}>
                    Start a Similar Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Videos ── */}
      {project.videos.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel label="Video Production" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
              <PlayCircle size={30} className="text-[#D3232E]" />
              Watch the Work
            </h2>
            <div className={`grid gap-6 ${
              project.videos.length === 1
                ? 'max-w-3xl mx-auto'
                : project.videos.length === 2
                ? 'sm:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {project.videos.map((video, i) => (
                <motion.article
                  key={video.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded-xl border border-slate-200 bg-white p-3 hover:border-[#25408F]/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden rounded-lg bg-black">
                    <iframe
                      src={toEmbedUrl(video.url)}
                      title={video.title}
                      className="w-full h-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 px-1 text-sm font-semibold text-slate-700">{video.title}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Photo Gallery ── */}
      {project.gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel label="Photography" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 mb-10">Project Gallery</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((src, i) => (
                <motion.button
                  key={src}
                  onClick={() => setLightboxIndex(i)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`relative overflow-hidden rounded-xl group text-left ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                >
                  <img
                    src={src}
                    alt={`${project.title} – photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && project.gallery.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={project.gallery[lightboxIndex]}
            alt={`${project.title} – photo ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Related Projects ── */}
      {project.relatedSlugs.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel label="More Work" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 mb-10">Related Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.relatedSlugs.slice(0, 3).map(relSlug => {
                const rel = RELATED_LOOKUP[relSlug];
                if (!rel) return null;
                return (
                  <MediaCard
                    key={relSlug}
                    title={rel.title}
                    category={rel.category}
                    image={rel.image}
                    slug={relSlug}
                    type="project"
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectDetailPage;
