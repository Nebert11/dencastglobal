import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight, Calendar, Tag, User, Share2,
  Twitter, Linkedin, Link as LinkIcon, ArrowRight,
  CheckCircle2, PlayCircle, X, Play,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import MediaCard from '@/components/ui/MediaCard';
import PhotoCarousel from '@/components/ui/PhotoCarousel';
import { SITE_NAME } from '@/utils/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoLink {
  title: string;
  url: string;
}

interface GalleryImage {
  src: string;
  caption?: string;
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
  gallery: GalleryImage[];
  relatedSlugs: string[];
  featuredVideoUrl?: string;
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

const getYoutubeId = (url: string): string => {
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

const YOUTUBE_VIDEO_DURATIONS: Record<string, string> = {
  '2HF4pXkmntk': '19:00',
  '632y28-SHt8': '3:15',
  '82Ex2fbk96o': '4:11:53',
  'D1QvoiMpK-Q': '1:00:00',
  'EgTs8_Bm_RQ': '5:29',
  'F0sANQiiRxE': '3:29',
  'IybO1Rr95ek': '15:08',
  'JDr9mvraBjM': '7:38',
  'JKVNraadnmw': '0:38',
  'Mx4MYVYGcnE': '4:31:05',
  'NgUnE8g_z6I': '3:06',
  'PxF-Oz5O2xg': '5:37',
  'Q7H3QgmaKp8': '2:16:33',
  'QPwGbAjNSpc': '1:46',
  'QnnVSv48PIM': '1:41:19',
  'WDHIUaR6i-c': '21:15',
  'WIWK8EugC1c': '2:19',
  'XAZXVI6bvOo': '1:20',
  'YGQ0MSiaEXs': '2:45',
  'ZBoB9kyjIw4': '17:45',
  '_0hFwZtRoqU': '1:31',
  '_3NKliaLP-c': '16:10',
  'aMxamcefU8Y': '3:19:30',
  'dyRlpkwKuY0': '6:43',
  'eVXun6P1x98': '3:35:44',
  'jIVbFh117dA': '2:04',
  'kIpukvtuV48': '1:46',
  'mblSEtbtGD8': '4:27',
  'nQcN6uXbDss': '1:21',
  'nhfmECVhyRg': '0:38',
  'oG_IAvExIqM': '4:08',
  'p2ydGxuTK5U': '2:19',
  'q-I1iYGhLPk': '2:30',
  'ueiIbj_OiV8': '7:00:27',
  'zeLCnl_wASw': '1:18',
};

const getVideoDurationByUrl = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? YOUTUBE_VIDEO_DURATIONS[id] ?? '' : '';
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
      { title: 'Sasini Sustainability Report Launch – Full Event', url: 'https://www.youtube.com/watch?v=QnnVSv48PIM' },
      { title: 'Sasini Tea, Coffee & Sustainability Documentary', url: 'https://www.youtube.com/watch?v=WDHIUaR6i-c' },
      { title: 'Sasini Sustainability Story', url: 'https://www.youtube.com/watch?v=zeLCnl_wASw' },
      { title: 'Sasini Farms & Plantations Feature', url: 'https://www.youtube.com/watch?v=2HF4pXkmntk' },
    ],
    services: ['Documentary Production', 'Cinematography', 'Post-Production', 'Corporate Storytelling'],
    gallery: [
      { src: '/dencast_images/sasini_conference.jpg', caption: 'Sasini PLC sustainability storytelling across plantation and corporate settings.' },
      { src: '/dencast_images/sasini2.jpg' },
      { src: '/dencast_images/sasini3.jpg' },
      { src: '/dencast_images/sasini4.jpg' },
      { src: '/dencast_images/sasini5.jpg' },
      { src: '/dencast_images/sasini6.jpg' },
      { src: '/dencast_images/sasini7.jpg' },
      { src: '/dencast_images/sasini8.jpg' },
      { src: '/dencast_images/sasini9.jpg' },
    ],
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
      { title: 'ELF Africa Annual Report Film', url: 'https://www.youtube.com/watch?v=EgTs8_Bm_RQ' },
      { title: 'ELF Africa Leadership Stories', url: 'https://www.youtube.com/watch?v=JDr9mvraBjM' },
      { title: "ELF Africa \u2014 Building Africa's Next Generation", url: 'https://www.youtube.com/watch?v=oG_IAvExIqM' },
      { title: 'ELF Africa Documentary Feature', url: 'https://www.youtube.com/watch?v=ZBoB9kyjIw4' },
    ],
    services: ['Documentary Production', 'Social Media Content', 'Livestreaming', 'Post-Production'],
    gallery: [
      { src: '/dencast_images/elf.png', caption: 'ELF Africa brand storytelling and leadership-focused communication.' },
      { src: '/dencast_images/elf1.jpg', caption: 'Behind the scenes of an ELF production session.' },
      { src: '/dencast_images/elf2.jpg' },
      { src: '/dencast_images/elf3.jpg' },
      { src: '/dencast_images/elf4.jpg' },
      { src: '/dencast_images/elf5.jpg' },
      { src: '/dencast_images/elf6.jpg' },
      { src: '/dencast_images/elf7.jpg' },
      { src: '/dencast_images/elf8.jpg' },
      { src: '/dencast_images/elf9.jpg' },
    ],
    relatedSlugs: ['sasini-sustainability-report', 'documentaries', 'rhnk-conference'],
  },

  'european-union-videos': {
    slug: 'european-union-videos',
    title: 'European Union – Media & Digital',
    category: 'Corporate',
    client: 'European Union Delegation in Kenya',
    date: '2022 – Present',
    heroImage: '/dencast_images/eu1.jpg',
    excerpt: 'Supporting the EU Delegation in Kenya with high-quality video productions that amplify their programmes and digital communication strategy.',
    description:
      'Dencast Global has partnered with the European Union Delegation in Kenya to produce a wide range of media content — from event coverage and promotional videos to digital storytelling that communicates the EU\'s development programmes and partnerships across the country.\n\nOur productions span conferences, ceremonies, ambassador events, and key milestones in the EU–Kenya relationship, captured with cinematic precision and delivered to global standards.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'EU Ambassador — Business Forum Kenya', url: 'https://www.youtube.com/watch?v=jIVbFh117dA' },
      { title: 'European Union Kenya Event Highlights', url: 'https://www.youtube.com/watch?v=JKVNraadnmw' },
      { title: 'EU Kenya Digital Campaign', url: 'https://www.youtube.com/watch?v=nhfmECVhyRg' },
      { title: 'EU–Kenya Partnership Feature', url: 'https://www.youtube.com/watch?v=p2ydGxuTK5U' },
    ],
    services: ['Event Coverage', 'Videography', 'Digital Content', 'Post-Production'],
    gallery: [
      { src: '/dencast_images/eu1.jpg', caption: 'European Union delegation event coverage' },
      { src: '/dencast_images/eu2.jpg', caption: 'EU programmes and partnerships in Kenya' },
      { src: '/dencast_images/eu3.jpg', caption: 'EU–Kenya digital and development story' },
    ],
    featuredVideoUrl: 'https://www.youtube.com/watch?v=dyRlpkwKuY0',
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
    heroImage: '/dencast_images/eib.jpg',
    excerpt: 'Professional video production for the European Investment Bank, documenting their initiatives and investments across Africa.',
    description:
      'Dencast Global has had the honour of partnering with the European Investment Bank (EIB) to produce compelling video content that documents their investment initiatives, programmes, and partnerships across Africa.\n\nOur productions capture key meetings, project highlights, and the tangible impact of EIB investments on communities and economies — delivered with the highest production standards.\n\nAt Dencast Global, we believe in the power of visual storytelling to inspire change, engage audiences, and elevate brands. Partner with us, and let\'s bring your vision to life.',
    videos: [
      { title: 'European Investment Bank in Kenya — Impact Story', url: 'https://www.youtube.com/watch?v=632y28-SHt8' },
      { title: 'EIB Kenya Programmes & Investments', url: 'https://www.youtube.com/watch?v=PxF-Oz5O2xg' },
      { title: 'EIB Africa Development Feature', url: 'https://www.youtube.com/watch?v=mblSEtbtGD8' },
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
    gallery: [
      { src: '/dencast_images/amakove1.png', caption: 'The Amakove Wala Show — studio production' },
      { src: '/dencast_images/amakove2.jpg', caption: 'On-set direction and media training' },
      { src: '/dencast_images/amakove3.jpg', caption: 'Behind the scenes of a live studio episode' },
      { src: '/dencast_images/amakove4.jpg', caption: 'In conversation — authentic storytelling' },
      { src: '/dencast_images/amakove5.jpg', caption: 'Production crew at work' },
      { src: '/dencast_images/amakove6.jpg', caption: 'Guest interview setup' },
      { src: '/dencast_images/amakove7.jpg', caption: 'Multi-camera studio operations' },
      { src: '/dencast_images/amakove8.jpg', caption: 'Final edit and post-production' },
    ],
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
      { title: 'RHNK Youth Caravan', url: 'https://www.youtube.com/watch?v=QPwGbAjNSpc' },
      { title: 'RHNK Pan-African Conference 2025 Highlights', url: 'https://www.youtube.com/watch?v=_0hFwZtRoqU' },
      { title: 'RHNK Corporate Video', url: 'https://www.youtube.com/watch?v=kIpukvtuV48' },
    ],
    services: ['Event Videography', 'Photography', 'Livestreaming', 'Breakout Room Recording'],
    gallery: [
      { src: '/dencast_images/rhnk.jpg', caption: 'RHNK pan-African conference coverage across plenaries and parallel sessions.' },
      { src: '/dencast_images/rhnks2024.jpg', caption: 'Delegate engagement and keynote coverage from the RHNK conference series.' },
      { src: '/dencast_images/rhnk1.jpg' },
      { src: '/dencast_images/rhnk3.jpg' },
      { src: '/dencast_images/rhnk4.jpg' },
      { src: '/dencast_images/rhnk5.jpg' },
      { src: '/dencast_images/rhnk6.jpg' },
      { src: '/dencast_images/rhnk7.jpg' },
    ],
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
    gallery: [
      { src: '/dencast_images/doc1.jpg', caption: 'Documentary production — behind the lens' },
      { src: '/dencast_images/doc2.jpg', caption: 'On location filming' },
      { src: '/dencast_images/doc3.jpg', caption: 'Cinematic storytelling in the field' },
      { src: '/dencast_images/doc4.jpg', caption: 'Production and post-production excellence' },
      { src: '/dencast_images/doc5.jpg', caption: 'Documentary craftsmanship at its finest' },
    ],
    relatedSlugs: ['elf-africa', 'sasini-sustainability-report', 'amakove-wala-show'],
  },

  'photography': {
    slug: 'photography',
    title: 'Photography',
    category: 'Photography',
    client: 'Various Clients',
    date: '2015 – Present',
    heroImage: '/dencast_images/WEBSITE-PHOTO.jpg',
    excerpt: 'Professional photography across corporate, events, portrait, and commercial genres — every image crafted to tell a story.',
    description:
      'At Dencast Global, our photography work spans corporate events, portrait sessions, commercial shoots, and editorial assignments. Every frame is composed with intention — to capture the moment, tell the story, and elevate the brand.\n\nOur photography portfolio is currently being updated with our latest work. Check back soon for the full gallery.',
    videos: [],
    services: ['Event Photography', 'Corporate Photography', 'Portrait & Headshots', 'Aerial / Drone Photography'],
    gallery: [],
    relatedSlugs: ['rhnk-conference', 'europe-day-football', 'sasini-sustainability-report'],
  },

  'conference-coverage': {
    slug: 'conference-coverage',
    title: 'Conference Coverage',
    category: 'Events',
    client: 'Various Clients',
    date: '2015 – Present',
    heroImage: '/dencast_images/CONFERENCE.png',
    excerpt: 'End-to-end conference coverage — videography, photography, and livestreaming for events of any scale.',
    description:
      'Dencast Global provides comprehensive conference coverage services, ensuring every keynote, panel, and breakout session is documented with professional precision.\n\nFrom multi-camera video production and photography to real-time livestreaming, we handle all aspects of event media so organisers can focus on the content.\n\nOur conference portfolio is currently being updated with our latest work.',
    videos: [],
    services: ['Event Videography', 'Photography', 'Livestreaming', 'Multi-Camera Production'],
    gallery: [],
    relatedSlugs: ['rhnk-conference', 'european-union-videos', 'live-streaming'],
  },

  'graphics-design': {
    slug: 'graphics-design',
    title: 'Graphics & Creative Design',
    category: 'Graphics Design',
    client: 'Various Clients',
    date: '2015 – Present',
    heroImage: '/dencast_images/graphics/RHNKgraphics.jpg',
    excerpt: 'Creative design solutions — from brand identity and motion graphics to social media visuals and print collateral.',
    description:
      'Our design team at Dencast Global brings visual ideas to life across digital and print mediums. From brand identity systems and social media templates to motion graphics and marketing collateral, we ensure every design communicates clearly and stands out.\n\nOur graphics and design portfolio is currently being updated with our latest work.',
    videos: [],
    services: ['Brand Identity', 'Motion Graphics', 'Social Media Design', 'Print & Collateral'],
    gallery: [
      { src: '/dencast_images/graphics/RHNKgraphics.jpg', caption: 'RHNK conference graphics and visual identity' },
      { src: '/dencast_images/graphics/pan-african.jpg', caption: 'Pan-African conference design system' },
      { src: '/dencast_images/graphics/Flyer1.jpg', caption: 'Event flyer design' },
      { src: '/dencast_images/graphics/Flyers.jpg', caption: 'Marketing flyer and print collateral' },
      { src: '/dencast_images/graphics/stationery.jpg', caption: 'Corporate stationery and brand identity' },
      { src: '/dencast_images/graphics/rhnk-report-cover.jpg', caption: 'Report cover design' },
      { src: '/dencast_images/graphics/rhnk-report1.jpg', caption: 'Report layout and editorial design' },
      { src: '/dencast_images/graphics/new_digital.png', caption: 'Digital content and social media visuals' },
      { src: '/dencast_images/graphics/laptop.jpg', caption: 'Digital design in practice' },
      { src: '/dencast_images/graphics/pencil.jpg', caption: 'Conceptual design and creative process' },
    ],
    relatedSlugs: ['documentaries', 'live-streaming', 'elf-africa'],
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
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoLightboxIndex, setVideoLightboxIndex] = useState<number | null>(null);
  const [featuredVideoOpen, setFeaturedVideoOpen] = useState(false);

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
  const galleryImages = project.gallery;
  const featuredVideoEmbedUrl = project.featuredVideoUrl ? `${toEmbedUrl(project.featuredVideoUrl)}?rel=0&modestbranding=1` : null;
  const featuredVideoId = project.featuredVideoUrl ? getYoutubeId(project.featuredVideoUrl) : '';
  const activeProjectVideo = project.videos[activeVideoIndex] ?? project.videos[0] ?? null;
  const activeProjectVideoEmbedUrl = activeProjectVideo ? `${toEmbedUrl(activeProjectVideo.url)}?rel=0&modestbranding=1&controls=1` : null;
  const activeProjectVideoDuration = activeProjectVideo ? getVideoDurationByUrl(activeProjectVideo.url) : '';
  const activeLightboxVideo = videoLightboxIndex !== null ? project.videos[videoLightboxIndex] : null;
  const activeLightboxVideoEmbedUrl = activeLightboxVideo
    ? `${toEmbedUrl(activeLightboxVideo.url)}?rel=0&modestbranding=1&controls=1&autoplay=1`
    : null;
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  useEffect(() => {
    setActiveVideoIndex(0);
    setVideoLightboxIndex(null);
  }, [slug]);

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

      {/* ── Featured Video ── */}
      {featuredVideoEmbedUrl && (
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <SectionLabel label="Featured Video" />
              <h2 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900">
                Featured EU Project Video
              </h2>
            </div>

            <div className="rounded-[2rem] bg-slate-900 p-2 sm:p-3 shadow-2xl shadow-slate-300/30 border border-slate-200">
              <button
                type="button"
                onClick={() => setFeaturedVideoOpen(true)}
                className="group overflow-hidden rounded-[1.5rem] bg-black aspect-video w-full text-left relative"
              >
                <img
                  src={featuredVideoId ? `https://img.youtube.com/vi/${featuredVideoId}/hqdefault.jpg` : '/dencast_images/WEBSITE-PHOTO.jpg'}
                  alt="European Union project featured video"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Play size={20} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

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
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[2rem] bg-white p-3 sm:p-4 border border-slate-200 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setVideoLightboxIndex(activeVideoIndex)}
                  aria-label={`Open video player for ${activeProjectVideo?.title ?? project.title}`}
                  className="group relative block w-full text-left"
                >
                  <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-black">
                    {activeProjectVideoEmbedUrl && (
                      <iframe
                        src={activeProjectVideoEmbedUrl}
                        title={activeProjectVideo?.title ?? project.title}
                        className="w-full h-full pointer-events-none"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    )}
                  </div>
                  {activeProjectVideoDuration && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-semibold tracking-wide shadow-md">
                      {activeProjectVideoDuration}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-[1.25rem] bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                    <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Play size={20} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                </button>
                <div className="mt-4 px-1">
                  <h3 className="text-sm sm:text-xl font-black text-slate-900 leading-tight">
                    {activeProjectVideo?.title ?? project.title}
                  </h3>
                </div>
              </motion.div>

              <div className="grid gap-4">
                {project.videos.map((video, i) => {
                  const isActive = i === activeVideoIndex;
                  const videoDuration = getVideoDurationByUrl(video.url);
                  return (
                    <motion.button
                      key={video.url}
                      type="button"
                      onClick={() => {
                        setActiveVideoIndex(i);
                        setVideoLightboxIndex(i);
                      }}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`w-full text-left rounded-2xl border p-3 sm:p-4 transition-all duration-300 ${
                        isActive
                          ? 'border-[#25408F] bg-[#25408F]/5 shadow-md'
                          : 'border-slate-200 bg-white hover:border-[#25408F]/30 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="relative w-full aspect-video overflow-hidden rounded-[1.25rem] bg-black">
                          <img
                            src={`https://img.youtube.com/vi/${new URL(toEmbedUrl(video.url)).pathname.split('/').pop() ?? ''}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(event) => {
                              const target = event.currentTarget;
                              target.src = '/dencast_images/WEBSITE-PHOTO.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg">
                              <Play size={18} className="text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          {videoDuration && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold tracking-wide shadow-md">
                              {videoDuration}
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">{video.title}</p>
                          <p className="mt-1 text-xs text-slate-500">Watch directly within the website</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Photo Gallery ── */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel label="Photography" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 mb-10">Project Gallery</h2>
            <PhotoCarousel
              title={`${project.title} gallery`}
              items={galleryImages.map((image, i) => ({
                src: image.src,
                alt: `${project.title} – photo ${i + 1}`,
                caption: image.caption,
              }))}
              variant="showcase"
              showMeta={false}
              imageClickable
              viewerMode="immersive"
              showCardBorder={false}
              aspectClassName="aspect-[4/3]"
              className="rounded-[2rem]"
            />
          </div>
        </section>
      )}

      {/* Video Lightbox */}
      {modalRoot && videoLightboxIndex !== null && activeLightboxVideo && activeLightboxVideoEmbedUrl && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setVideoLightboxIndex(null)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Video Viewer</p>
                <p className="text-sm sm:text-base font-semibold">{activeLightboxVideo.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setVideoLightboxIndex(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="absolute inset-0 bg-black">
              <iframe
                src={activeLightboxVideoEmbedUrl}
                title={activeLightboxVideo.title}
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        modalRoot,
      )}

      {modalRoot && featuredVideoOpen && featuredVideoEmbedUrl && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setFeaturedVideoOpen(false)}
        >
          <div
            className="relative w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-[1400px] max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Featured Video</p>
                <p className="text-sm sm:text-base font-semibold">Featured EU Project Video</p>
              </div>
              <button
                type="button"
                onClick={() => setFeaturedVideoOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video viewer"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src={featuredVideoEmbedUrl}
              title="European Union project featured video"
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
