import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Lightbulb,
  Shield,
  Star,
  Zap,
  Users,
  TrendingUp,
 
  ArrowRight,
  Play,
  X,
} from 'lucide-react';
// ChevronRight,
import { useQuery } from '@tanstack/react-query';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import PhotoCarousel from '@/components/ui/PhotoCarousel';
import { getClientLogoUrl } from '@/utils/clientLogos';
import { SITE_NAME } from '@/utils/constants';
import {
  getClients,
  getSiteSettings,
} from '@/services/data.service';
import type { Client, SiteSettings } from '@/types';

import backgroundImage from '/dencast_images/about_dencast.png';
import storyImage from '/dencast_images/dennis_machio.jpg';
import teamLeadImage from '/dencast_images/Machio-CEO.png';
import teamMemberOneImage from '/dencast_images/Allan-Odera.jpg';
import teamMemberTwoImage from '/dencast_images/Valentino-Macharia.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const CORE_VALUE_ICONS = [Lightbulb, Star, Shield, Zap, Users, TrendingUp] as const;

type CoreValue = {
  title: string;
  description: string;
};

type TimelineItem = {
  year: string;
  title: string;
  desc: string;
};

type CsrVideo = {
  title: string;
  url: string;
  duration: string;
};

type CsrProgram = {
  title: string;
  description: string[];
  videos: CsrVideo[];
};

type AboutContent = {
  heroBackgroundImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionBody: string;
  storyImageUrl: string;
  storyTitle: string;
  storyBody: string;
  coreValuesTitle: string;
  coreValuesSubtitle: string;
  coreValues: CoreValue[];
  teamTitle: string;
  teamSubtitle: string;
  timelineTitle: string;
  timeline: TimelineItem[];
  clientsTitle: string;
  ctaLabel: string;
  ctaTitle: string;
  ctaBody: string;
};

const DEFAULT_CORE_VALUES: CoreValue[] = [
  {
    title: 'Dedication',
    description:
      'We commit fully to every brief, timeline, and production detail to ensure quality outcomes for every client.',
  },
  {
    title: 'Passion',
    description:
      'Storytelling is at the center of what we do, and our team brings energy and heart to every project from concept to delivery.',
  },
  {
    title: 'Innovation',
    description:
      'We use superior equipment, modern workflows, and forward-thinking ideas to produce communication solutions that stand out.',
  },
  {
    title: 'Creativity',
    description:
      'We transform concepts into memorable visual experiences that connect with audiences and elevate brands.',
  },
];

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    year: 'Origins',
    title: 'A Journey Rooted in Excellence',
    desc: 'Machio’s journey began at Michezo Afrika, Kenya’s leading sports news outlet, where he served as the lead producer and editor. As a co-founder of Michezo Afrika, he played a pivotal role in revolutionizing sports media, blending in-depth analysis with dynamic visuals that captivated audiences. Fueled by a desire to expand the boundaries of storytelling beyond sports, Machio launched Bungoma Pictures—a production company dedicated to documentary filmmaking and visual storytelling. Through Bungoma Pictures, he continued to explore powerful, immersive narratives, shining a light on untold stories and impactful moments.',
  },
  {
    year: 'Growth',
    title: 'The Evolution: Dencast Global',
    desc: 'In 2021, Bungoma Pictures evolved into Dencast Global, a cutting-edge production and creative media agency. This transformation marked a new era—one defined by world-class productions that have garnered regional and global acclaim. Today, Dencast Global stands at the forefront of media innovation, partnering with leading brands across industries to deliver high-impact content that transcends boundaries.',
  },
  {
    year: 'Currently',
    title: 'A Legacy of Trust and Excellence',
    desc: 'Dencast Global’s success is built on trust, creativity, and an unwavering commitment to quality. Our rich portfolio features celebrated brands that have entrusted us to bring their vision to life, ensuring that every frame, every scene, and every moment tells a story that matters. From documentaries and commercials to corporate films and digital campaigns, Dencast Global continues to redefine storytelling—one production at a time.',
  },
];

const DEFAULT_CLIENTS = [
  'Sasini PLC',
  'ELF',
  'KEY',
  'White Beach Palace',
  'Europe Day Kenya',
  'IBAC',
  'Michezo Africa',
  'Afreximbank',
  'Africatalyst',
  'European Union',
  'European Investment Bank',
  'Eleon Inn',
  'CAPA France',
  'IPPF',
];


//heroSubtitle: Shaping Brands. Telling Stories. Inspiring Audiences.
//heroTitle: 'Where Your Story Becomes Our Mission'
const DEFAULT_CONTENT: AboutContent = {
  heroBackgroundImageUrl: backgroundImage,
  heroTitle: '',
  heroSubtitle:
    '',
  missionTitle: 'Shaping Brands. Telling Stories. Inspiring Audiences.',
  missionBody:
    'Dencast Global Limited is a leading production and creative agency founded in 2015. We specialize in developing meticulously crafted media products and end-to-end production services across branding experiences, digital content, commercials, niche cinematography, corporate productions, social media campaigns, and docu-style marketing.\n\nOur Vision: To be global pacesetters in cinematographic works.\n\nOur Mission: To use technology, superior equipment, and innovation through creative efforts to provide inimitable communication, marketing, and digital solutions for all our clients.',
  storyImageUrl: storyImage,
  storyTitle: 'About Dencast Global',
  storyBody:
    'At Dencast Global, every project is more than a deliverable. It is a story, a vision, and a brand brought vividly to life. By combining creativity, technology, and strategy, we provide communication and knowledge-management solutions that connect with audiences and deliver measurable impact.\n\nOur creative consultants, communication strategists, copywriters, photographers, videographers, event managers, and printers work in synergy to ensure your brand, your story, and your vision shine across every platform.\n\nFrom concept to execution, our people transform ideas into powerful experiences that help your story not just be told, but truly stand out.',
  coreValuesTitle: 'What We Stand For',
  coreValuesSubtitle:
    'The four pillars that shape our culture and every project we deliver: Dedication, Passion, Innovation, and Creativity.',
  coreValues: DEFAULT_CORE_VALUES,
  teamTitle: 'Our Team',
  teamSubtitle:
    'A passionate collective of filmmakers, strategists, and creatives.',
  timelineTitle: 'A Legacy of Excellence in Visual Storytelling',
  timeline: DEFAULT_TIMELINE,
  clientsTitle: "Trusted by Africa's Best",
  ctaLabel: 'Get Involved',
  ctaTitle: 'Join Our Story',
  ctaBody:
    "Whether you are building a brand, launching a campaign, or producing a signature event, Dencast Global is ready to bring your vision to life.",
};

const JOURNEY_IMAGES = [
  { src: '/dencast_images/journey1.jpg', objectPosition: 'center 110%' },
  { src: '/dencast_images/journey2.jpg', objectPosition: 'center 15%' },
  { src: '/dencast_images/journey3.jpg', objectPosition: 'center' },
];

const ABOUT_VIDEO_URL = 'https://www.youtube.com/watch?v=C4XULlXngGM';

function getYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    return url;
  } catch {
    return url;
  }
}

const ABOUT_VIDEO_EMBED_URL = `${getYoutubeEmbedUrl(ABOUT_VIDEO_URL)}?rel=0&modestbranding=1&playsinline=1`;

const getYoutubeVideoId = (url: string): string => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim();
    }

    return parsed.searchParams.get('v') ?? '';
  } catch {
    return '';
  }
};

const CSR_PROGRAMS: CsrProgram[] = [
  {
    title: 'Magharibi Michezo Awards',
    description: [
      'The Magharibi Michezo Awards is an annual sports recognition event established in 2015. It celebrates the achievements and contributions of sportsmen, sportswomen, coaches, teams and stakeholders from Western Kenya.',
      'The awards honour excellence while encouraging greater investment, participation and development in regional sports. Through this initiative, we continue to recognise sporting heroes, inspire young talent and highlight the important role of sport in community development.',
    ],
    videos: [
      { title: 'Magharibi Michezo Awards 1', url: 'https://www.youtube.com/watch?v=SwCPD7KRX0M', duration: '4:15' },
      { title: 'Magharibi Michezo Awards 2', url: 'https://www.youtube.com/watch?v=Gx5VT0ysbCw', duration: '1:45' },
    ],
  },
  {
    title: 'Magharibi Festival',
    description: [
      'The Magharibi Festival is a vibrant celebration of the music, sports, culture and creative talent of Western Kenya. The festival provides a platform for artists, athletes and cultural practitioners from Bungoma, Busia, Kakamega, Vihiga and Trans Nzoia, while also creating connections with neighbouring communities in Uganda and the Nyanza region.',
      'Through the festival, Dencast Global seeks to preserve regional identity, promote emerging talent and create opportunities for collaboration, visibility and growth within the creative and sporting industries.',
    ],
    videos: [
      { title: 'Magharibi Festival', url: 'https://www.youtube.com/watch?v=-vNPv6jrRx4', duration: '4:00' },
    ],
  },
  {
    title: 'Music Development and Artist Support',
    description: [
      'Since 2012, we have worked closely with stakeholders in the entertainment and sports sectors to identify industry gaps, strengthen capacity and create meaningful opportunities for artists, athletes and other industry players.',
      'Our support includes talent identification, music production, creative direction, content development, promotion and mentorship. We have contributed to the development and production of culturally inspired songs that blend tradition with modern sounds.',
      'One of these productions, “Mbe Omukhasi” by Steve, has attracted more than 2.4 million views on YouTube, demonstrating the power of authentic regional stories and music to reach wider audiences.',
    ],
    videos: [
      {
        title: 'Music Development and Artist Support 1',
        url: 'https://www.youtube.com/watch?v=PJ4HC7318h4&list=RDPJ4HC7318h4&start_radio=1',
        duration: '6:36',
      },
      { title: 'Music Development and Artist Support 2', url: 'https://www.youtube.com/watch?v=LOL6DHHFLmE', duration: '3:55' },
    ],
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Dennis Machio',
    role: 'Producer & Lead Director',
    image: teamLeadImage,
    subtitle: 'Film Producer. Creative Director. Media Strategist. Storyteller.',
    paragraphs: [
      'Dennis Machio is a Nairobi-based Film Producer, Creative Director, Media Strategist, and Founder of Dencast Global Limited. For more than a decade, he has worked with organizations across Africa to create documentaries, corporate films, live productions, digital campaigns, and strategic visual content that communicates clearly and connects deeply.',
      'His work sits at the intersection of storytelling, strategy, production, and impact.',
      'Every organization has a story. Our role is to help shape that story into content that people can understand, believe in, and act on.',
      'From international conferences and boardroom communications to wildlife conservancies, community projects, sports platforms, and development programs, we lead productions that turn complex messages into meaningful visual experiences.',
    ],
  },
  {
    name: 'Allan Odera',
    role: 'Creative Production',
    image: teamMemberOneImage,
    subtitle: 'The Creative Force Behind the Screen',
    paragraphs: [
      'A master of visual storytelling, Allan Odera is a versatile Video and Graphics Editor whose work brings ideas to life with precision, creativity, and flair. An alumnus of Multimedia University Kenya, Allan has honed his craft in graphics and motion design, blending artistic innovation with technical expertise.',
      'With extensive industry experience, he is more than just an editor — he is a visual architect, crafting compelling motion graphics and seamless edits that elevate every project. His keen eye for detail and collaborative spirit make him an invaluable part of the Dencast Global team, ensuring that every production is not just polished, but powerfully engaging.',
      'With Allan at the controls, every frame tells a story, every transition has purpose, and every project becomes a masterpiece.',
    ],
  },
  {
    name: 'Valentino Macharia',
    role: 'Visual Storytelling',
    image: teamMemberTwoImage,
    subtitle: 'The Visionary Behind The Live Broadcasts',
    paragraphs: [
      'With decades of experience in live broadcasting and television production, Valentino Macharia is a name synonymous with excellence, precision, and innovation. As a seasoned Television Director and studio operator, he has played a pivotal role in shaping the landscape of broadcast media.',
      "Macharia's career has seen him work with world-renowned media giants, including Kenya Television Network (KTN), China Global Television Network (CGTN), and the British Broadcasting Corporation (BBC). His keen eye for detail and mastery of live directing have positioned him among the best in the industry.",
      'At Dencast Global, Macharia brings more than just experience — he brings a relentless pursuit of perfection. A firm believer that every frame should tell a compelling story, he ensures that our productions capture, engage, and inspire.',
      "With Valentino Macharia at the Director's console, your live story isn't just told — it's brought to life with unmatched visual brilliance.",
    ],
  },
];

const TEAM_CAROUSEL_IMAGES = [
  { src: '/dencast_images/crew1.jpg', alt: 'Dencast team at work 1' },
  { src: '/dencast_images/crew2.jpg', alt: 'Dencast team at work 2' },
  { src: '/dencast_images/crew3.jpg', alt: 'Dencast team at work 3' },
  { src: '/dencast_images/crew4.jpg', alt: 'Dencast team at work 4' },
  { src: '/dencast_images/crew6.jpg', alt: 'Dencast team at work 5' },
];

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function buildSettingsMap(settings: SiteSettings[] | null | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  (settings ?? []).forEach((item) => {
    map[item.key] = String(item.value ?? '');
  });
  return map;
}

function getValue(map: Record<string, string>, key: string, fallback: string): string {
  const value = map[key];
  return value && value.trim() ? value : fallback;
}

const HeroBanner: React.FC<{ content: AboutContent }> = ({ content }) => (
  <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0"
      style={{ backgroundImage: `url(${content.heroBackgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-[#25408F]/20" aria-hidden="true" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28">
      {/* <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">About</span>
      </motion.nav> */}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
      >
        {content.heroTitle}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed"
      >
        {content.heroSubtitle}
      </motion.p>
    </div>
  </section>
);

const MissionSection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const missionParagraphs = content.missionBody
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section id="mission" ref={ref} className="py-28 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Mission" center />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight"
          >
            {content.missionTitle}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-10 space-y-6 text-slate-600 text-xl leading-relaxed max-w-4xl mx-auto">
            {missionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-4">
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

const StorySection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const paragraphs = content.storyBody
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section id="vision" ref={ref} className="py-28 lg:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[16/11] shadow-[0_40px_100px_-35px_rgba(15,23,42,0.55)]">
              <img
                src={content.storyImageUrl}
                alt="Dencast Global team at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#25408F]/30 to-transparent" />
            </div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="lg:pl-4 max-w-2xl">
            <motion.div variants={fadeUp}>
              <SectionLabel label="Our Story" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-5xl sm:text-6xl font-black text-slate-900 leading-tight">
              {content.storyTitle}
            </motion.h2>
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={`${paragraph.slice(0, 16)}-${index}`}
                variants={fadeUp}
                className={`text-slate-600 text-lg sm:text-xl leading-relaxed ${index === 0 ? 'mt-6' : 'mt-5'}`}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AboutVideoSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [open, setOpen] = useState(false);
  const modalRoot = typeof document !== 'undefined' ? document.body : null;
  const aboutVideoId = getYoutubeVideoId(ABOUT_VIDEO_URL);

  return (
    <>
      <section ref={ref} className="py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-center mb-10"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel label="Dencast Global" center />
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-black text-slate-900">
              About Us
            </motion.h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-[2rem] bg-[#0f172a] p-2 sm:p-3 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.55)] border border-slate-700/40 w-full text-left group"
            >
              <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-video">
                <img
                  src={aboutVideoId ? `https://img.youtube.com/vi/${aboutVideoId}/hqdefault.jpg` : '/dencast_images/WEBSITE-PHOTO.jpg'}
                  alt="About Dencast Global"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Play size={20} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 -bottom-3 h-3 w-36 -translate-x-1/2 rounded-b-2xl bg-slate-800/90 sm:w-48" />
            </button>
          </motion.div>
        </div>
      </section>

      {modalRoot && open && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Dencast Global</p>
                <p className="text-sm sm:text-base font-semibold">About Us</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src={ABOUT_VIDEO_EMBED_URL}
              title="About Dencast Global"
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
    </>
  );
};

const CsrSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeVideo, setActiveVideo] = useState<CsrVideo | null>(null);
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <section id="csr" ref={ref} className="py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Corporate Social Responsibility" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
            CSR
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our CSR work supports sport, culture and creative development across Western Kenya, with projects that create visibility, opportunities and community pride.
          </motion.p>
        </motion.div>

        <div className="space-y-10">
          {CSR_PROGRAMS.map((program, index) => (
            <motion.article
              key={program.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={index}
              className="rounded-[2rem] border border-slate-100 bg-slate-50/70 shadow-sm overflow-hidden"
            >
              <div className="p-7 sm:p-10 lg:p-12">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#25408F]/10 text-[#25408F] text-xs font-bold uppercase tracking-widest">
                  CSR Initiative
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {program.title}
                </h3>
                <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
                  {program.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="px-7 pb-7 sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
                <div className={`grid gap-4 ${program.videos.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {program.videos.map((video) => (
                    <button
                      key={video.url}
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="group rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-md text-left"
                    >
                      <div className="relative aspect-video bg-black">
                        <img
                          src={getYoutubeVideoId(video.url)
                            ? `https://img.youtube.com/vi/${getYoutubeVideoId(video.url)}/hqdefault.jpg`
                            : '/dencast_images/WEBSITE-PHOTO.jpg'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <Play size={20} className="text-white fill-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-semibold tracking-wide shadow-md">
                          {video.duration}
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-white">
                        <p className="text-sm font-semibold text-slate-700 leading-snug">{video.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {modalRoot && activeVideo && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">CSR Video</p>
                <p className="text-sm sm:text-base font-semibold">{activeVideo.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src={`${getYoutubeEmbedUrl(activeVideo.url)}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
              title={activeVideo.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>,
        modalRoot,
      )}
    </section>
  );
};

const CoreValuesSection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Core Values" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
            {content.coreValuesTitle}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            {content.coreValuesSubtitle}
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.coreValues.map((val, i) => {
            const Icon = CORE_VALUE_ICONS[i % CORE_VALUE_ICONS.length];
            return (
              <motion.div
                key={`${val.title}-${i}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-[#25408F]/20 hover:bg-[#25408F]/[0.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#25408F]/10 group-hover:bg-[#25408F] flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon size={24} className="text-[#25408F] group-hover:text-white transition-colors duration-300" />
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

const TimelineSection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#25408F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Journey" light center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-black text-white">
            {content.timelineTitle}
          </motion.h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 hidden lg:block" />

          <div className="space-y-12">
            {content.timeline.map((item, i) => {
              const journeyImage = JOURNEY_IMAGES[i % JOURNEY_IMAGES.length];

              return (
              <motion.div
                key={`${item.year}-${item.title}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`lg:flex items-center gap-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="mb-5 rounded-2xl overflow-hidden border border-white/20">
                    <img
                      src={journeyImage.src}
                      alt={`${item.title} milestone`}
                      className="w-full h-56 sm:h-64 object-cover"
                      style={{ objectPosition: journeyImage.objectPosition }}
                      loading="lazy"
                    />
                  </div>
                  <div className={`inline-flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <span className="text-4xl font-black text-[#D3232E]">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>

                <div className="hidden lg:flex flex-shrink-0 w-5 h-5 rounded-full bg-[#D3232E] ring-4 ring-white/20 relative z-10" />
                <div className="flex-1 hidden lg:block" />
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Individual team card with expand/collapse ────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  image: string;
  subtitle: string;
  paragraphs: string[];
}

const TeamMemberCard: React.FC<{
  member: TeamMember;
  index: number;
  inView: boolean;
}> = ({ member, index, inView }) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = member.paragraphs.length > 1;

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm flex flex-col"
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-80 object-cover"
        loading="lazy"
      />
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
        <p className="text-sm text-[#25408F] mt-1 font-semibold">{member.role}</p>
        <p className="mt-2 text-xs font-semibold text-[#D3232E] italic leading-snug">{member.subtitle}</p>

        {/* First paragraph always visible */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {member.paragraphs[0]}
        </p>

        {/* Expandable remaining paragraphs */}
        {hasMore && (
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={!expanded}
          >
            <div className="space-y-3">
              {member.paragraphs.slice(1).map((para, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Read More / See Less toggle */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#25408F] hover:text-[#D3232E] transition-colors duration-200"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>See Less <span className="text-base leading-none">↑</span></>
              ) : (
                <>Read More <span className="text-base leading-none">↓</span></>
              )}
            </button>
          )}

          {/* Dennis: link to personal website */}
          {member.name === 'Dennis Machio' && (
            <a
              href="https://dennismachio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#25408F] transition-colors duration-200 border-l border-slate-200 pl-4"
            >
              Dennis Profile <ArrowRight size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const TeamSection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="team" ref={ref} className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label={content.teamTitle || 'Our Team'} center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-black text-slate-900">
            Meet the People Behind the Stories
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {content.teamSubtitle}
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamMemberCard
              key={member.name}
              member={member}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamCarouselSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Crew" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-black text-slate-900">
            Behind the Scenes
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <PhotoCarousel
            title="Dencast Crew"
            items={TEAM_CAROUSEL_IMAGES}
            variant="showcase"
            showMeta={false}
            imageClickable={false}
            showCardBorder={false}
            aspectClassName="aspect-[4/3]"
            className="rounded-[2rem]"
          />
        </motion.div>
      </div>
    </section>
  );
};

const ClientsSection: React.FC<{ clientNames: string[]; content: AboutContent }> = ({
  clientNames,
  content,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Clients" center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black text-slate-900">
            {content.clientsTitle}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {clientNames.map((client, i) => {
            const logoUrl = getClientLogoUrl(client);

            return (
              <motion.div
                key={`${client}-${i}`}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex items-center justify-center h-32 bg-slate-50 hover:bg-[#25408F]/5 rounded-xl border border-slate-100 hover:border-[#25408F]/20 transition-all duration-300 px-5"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${client} logo`}
                    className="max-h-20 max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-slate-600 font-bold text-sm text-center leading-tight">{client}</span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const CTASection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#25408F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp}>
            <SectionLabel label={content.ctaLabel} light center />
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            {content.ctaTitle}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/70 text-lg max-w-2xl mx-auto">
            {content.ctaBody}
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

const AboutPage: React.FC = () => {
  const location = useLocation();
  const { data: settingsResponse } = useQuery({
    queryKey: ['siteSettingsPublic'],
    queryFn: getSiteSettings,
  });

  const { data: clientsResponse } = useQuery({
    queryKey: ['aboutClients'],
    queryFn: () => getClients(true),
  });

  const content = useMemo<AboutContent>(() => {
    const map = buildSettingsMap(settingsResponse?.data);
    return {
      heroBackgroundImageUrl: getValue(
        map,
        'about_hero_background_image_url',
        DEFAULT_CONTENT.heroBackgroundImageUrl
      ),
      heroTitle: getValue(map, 'about_hero_title', DEFAULT_CONTENT.heroTitle),
      heroSubtitle: getValue(map, 'about_hero_subtitle', DEFAULT_CONTENT.heroSubtitle),
      missionTitle: getValue(map, 'about_mission_title', DEFAULT_CONTENT.missionTitle),
      missionBody: getValue(map, 'about_mission_body', DEFAULT_CONTENT.missionBody),
      storyImageUrl: getValue(map, 'about_story_image_url', DEFAULT_CONTENT.storyImageUrl),
      storyTitle: getValue(map, 'about_story_title', DEFAULT_CONTENT.storyTitle),
      storyBody: getValue(map, 'about_story_body', DEFAULT_CONTENT.storyBody),
      coreValuesTitle: getValue(map, 'about_core_values_title', DEFAULT_CONTENT.coreValuesTitle),
      coreValuesSubtitle: getValue(map, 'about_core_values_subtitle', DEFAULT_CONTENT.coreValuesSubtitle),
      coreValues: parseJsonArray<CoreValue>(map.about_core_values_json, DEFAULT_CONTENT.coreValues),
      teamTitle: getValue(map, 'about_team_title', DEFAULT_CONTENT.teamTitle),
      teamSubtitle: getValue(map, 'about_team_subtitle', DEFAULT_CONTENT.teamSubtitle),
      timelineTitle: getValue(map, 'about_timeline_title', DEFAULT_CONTENT.timelineTitle),
      timeline: parseJsonArray<TimelineItem>(map.about_timeline_json, DEFAULT_CONTENT.timeline),
      clientsTitle: getValue(map, 'about_clients_title', DEFAULT_CONTENT.clientsTitle),
      ctaLabel: getValue(map, 'about_cta_label', DEFAULT_CONTENT.ctaLabel),
      ctaTitle: getValue(map, 'about_cta_title', DEFAULT_CONTENT.ctaTitle),
      ctaBody: getValue(map, 'about_cta_body', DEFAULT_CONTENT.ctaBody),
    };
  }, [settingsResponse?.data]);

  const clientNames = useMemo<string[]>(() => {
    const fromBackend = (clientsResponse?.data ?? [])
      .map((client: Client) => client.name)
      .filter(Boolean);
    return fromBackend.length > 0 ? fromBackend : DEFAULT_CLIENTS;
  }, [clientsResponse?.data]);

  // Scroll to hash section after page renders
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const attempt = (retries: number) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (retries > 0) {
        setTimeout(() => attempt(retries - 1), 200);
      }
    };
    setTimeout(() => attempt(5), 300);
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>About Us | {SITE_NAME}</title>
        <meta
          name="description"
          content="Learn about Dencast Global — Africa's premier creative media production company with years of storytelling excellence across documentary, photography, branding and live events."
        />
        <meta property="og:title" content={`About Us | ${SITE_NAME}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroBanner content={content} />
      <MissionSection content={content} />
      <StorySection content={content} />
      <AboutVideoSection />
      <TeamSection content={content} />
      <TeamCarouselSection />
      <CsrSection />
      <CoreValuesSection content={content} />
      <TimelineSection content={content} />
      <ClientsSection clientNames={clientNames} content={content} />
      <CTASection content={content} />
    </>
  );
};

export default AboutPage;
