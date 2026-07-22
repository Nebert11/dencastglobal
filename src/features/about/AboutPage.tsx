import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Lightbulb,
  Shield,
  Star,
  Zap,
  Users,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Play,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/utils/constants';
import {
  getClients,
  getSiteSettings,
} from '@/services/supabase.service';
import type { Client, SiteSettings } from '@/types';

import backgroundImage from '/dencast_images/CREW.jpg';
import teamImage from '/dencast_images/9-scaled.jpg';

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
    title: 'Creativity',
    description:
      'We push creative boundaries to produce media that surprises, moves, and resonates deeply with every audience.',
  },
  {
    title: 'Excellence',
    description:
      'From pre-production planning to final delivery, we hold ourselves to the highest industry standards in every project.',
  },
  {
    title: 'Integrity',
    description:
      'Honest storytelling and transparent partnerships form the bedrock of everything we create and every relationship we build.',
  },
  {
    title: 'Innovation',
    description:
      'We embrace emerging technologies and bold ideas to stay ahead of the curve.',
  },
  {
    title: 'Collaboration',
    description:
      'Great stories emerge from great partnerships. We work closely with clients, talent, and communities.',
  },
  {
    title: 'Impact',
    description:
      'Every frame we craft is engineered to spark conversation and drive measurable outcomes for our clients.',
  },
];

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    year: 'Origins',
    title: 'A Journey Rooted in Excellence',
    desc: 'Machio co-founded Michezo Afrika and later launched Bungoma Pictures, building a foundation in powerful visual storytelling.',
  },
  {
    year: 'Growth',
    title: 'The Evolution: Dencast Global',
    desc: 'Bungoma Pictures evolved into Dencast Global, expanding into full-scale production and creative media services.',
  },
  {
    year: 'Currently',
    title: 'A Legacy of Trust and Excellence',
    desc: 'Dencast Global continues creating high-impact productions for brands across Africa and beyond.',
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
];

const DEFAULT_CONTENT: AboutContent = {
  heroBackgroundImageUrl: backgroundImage,
  heroTitle: 'We Tell Stories That Move the World',
  heroSubtitle:
    'Creative Stories. Cinematic Productions. Brands That Stand Out.',
  missionTitle: 'Creative Stories. Cinematic Productions. Brands That Stand Out.',
  missionBody:
    'Dencast Global is a world-class creative media, branding, and audiovisual production company committed to transforming ideas into powerful visual experiences.\n\nWe craft cinematic stories that connect with audiences, strengthen brands, and create lasting impact. From concept development and creative direction to filming, photography, sound, post-production, and brand communication, we deliver premium content designed for today\'s global audience.\n\nAt Dencast Global, we do more than produce content, we capture moments, tell meaningful stories, and build brands that deserve to be seen and remembered.',
  storyImageUrl: teamImage,
  storyTitle: 'Years of Captivating Storytelling',
  storyBody:
    'Dencast Global is a premier creative media and film production company built on the belief that powerful storytelling can shape perspectives, inspire action, and create lasting impact.\n\nHeadquartered in Nairobi and working across diverse markets, we partner with brands, governments, NGOs, institutions, and visionary leaders to produce cinematic content that connects with audiences and stands the test of time.\n\nFrom feature-length documentaries and corporate films to commercial campaigns, branded content, and digital productions, our team of directors, cinematographers, editors, producers, and creative strategists brings exceptional skill, originality, and passion to every project.',
  coreValuesTitle: 'What We Stand For',
  coreValuesSubtitle:
    'Six principles that guide every decision, every frame, and every partnership at Dencast Global.',
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
    "Whether you're a brand with a vision, a storyteller with a script, or an investor who believes in the power of African media, there's a place for you in this story.",
};

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
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${content.heroBackgroundImageUrl})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-[#0056A6]/65" aria-hidden="true" />
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-[#D72638]/15 clip-diagonal pointer-events-none" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28">
      <motion.nav
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
      </motion.nav>

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

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel label="Our Mission" center />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight"
          >
            {content.missionTitle}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-8 text-slate-600 text-lg leading-relaxed">
            {content.missionBody}
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

const StorySection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const paragraphs = content.storyBody
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section ref={ref} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                src={content.storyImageUrl}
                alt="Dencast Global team at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0056A6]/30 to-transparent" />
            </div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="lg:pl-4">
            <motion.div variants={fadeUp}>
              <SectionLabel label="Our Story" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900 leading-tight">
              {content.storyTitle}
            </motion.h2>
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={`${paragraph.slice(0, 16)}-${index}`}
                variants={fadeUp}
                className={`text-slate-600 leading-relaxed ${index === 0 ? 'mt-5' : 'mt-4'}`}
              >
                {paragraph}
              </motion.p>
            ))}
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

const TimelineSection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#0056A6] overflow-hidden">
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
            {content.timeline.map((item, i) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`lg:flex items-center gap-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className={`inline-flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <span className="text-4xl font-black text-[#D72638]">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>

                <div className="hidden lg:flex flex-shrink-0 w-5 h-5 rounded-full bg-[#D72638] ring-4 ring-white/20 relative z-10" />
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
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
          {clientNames.map((client, i) => (
            <motion.div
              key={`${client}-${i}`}
              custom={i}
              variants={fadeUp}
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

const CTASection: React.FC<{ content: AboutContent }> = ({ content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 via-[#001f3f] to-[#0056A6]">
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
    const fromBackend = (clientsResponse?.data?.data ?? [])
      .map((client: Client) => client.name)
      .filter(Boolean);
    return fromBackend.length > 0 ? fromBackend : DEFAULT_CLIENTS;
  }, [clientsResponse?.data?.data]);

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
      <CoreValuesSection content={content} />
      <TimelineSection content={content} />
      <ClientsSection clientNames={clientNames} content={content} />
      <CTASection content={content} />
    </>
  );
};

export default AboutPage;
