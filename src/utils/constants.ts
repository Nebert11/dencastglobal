import type { ServiceEntry, NavLink, SocialPlatformEntry } from '../types';

// ─── Services ─────────────────────────────────────────────────────────────────

export const SERVICES: ServiceEntry[] = [
  {
    id: 'documentary-production',
    name: 'Documentary Production',
    slug: 'documentary-production',
    icon: 'Film',
    tagline: 'Stories that move the world',
    description:
      'From concept to final cut, we craft compelling documentaries that capture authentic narratives, drive social impact, and connect deeply with global audiences.',
  },
  {
    id: 'livestreaming-events',
    name: 'Livestreaming & Events',
    slug: 'livestreaming-events',
    icon: 'Radio',
    tagline: 'Live, unfiltered, unforgettable',
    description:
      'Multi-camera live event production and streaming for conferences, concerts, product launches, and hybrid events — delivered flawlessly to any platform.',
  },
  {
    id: 'photography',
    name: 'Photography',
    slug: 'photography',
    icon: 'Camera',
    tagline: 'One frame, infinite impact',
    description:
      'Professional photography across editorial, commercial, portrait, and event genres. Every image is crafted to tell a story and elevate your brand.',
  },
  {
    id: 'events-management',
    name: 'Events Management',
    slug: 'events-management',
    icon: 'Briefcase',
    tagline: 'Seamless experiences, lasting impressions',
    description:
      'Professional planning, coordination, branding, production, and technical management for conferences, corporate events, launches, award ceremonies, exhibitions, and hybrid experiences.',
  },
  {
    id: 'audio-management-soundtrack-development',
    name: 'Audio Management & Soundtrack Development',
    slug: 'audio-management-soundtrack-development',
    icon: 'Music',
    tagline: 'Sound that connects, music that moves',
    description:
      'Professional live sound management, audio recording, mixing, voice-over production, sound design, and original soundtrack development for events, documentaries, films, commercials, and digital productions.',
  },
  {
    id: 'videography',
    name: 'Videography',
    slug: 'videography',
    icon: 'Video',
    tagline: 'Motion that resonates',
    description:
      'High-production-value video content for brands, campaigns, and narratives — from single-camera shoots to full multi-crew productions.',
  },
  {
    id: 'brand-strategy',
    name: 'Brand & Visual Identity',
    slug: 'brand-strategy',
    icon: 'Target',
    tagline: 'We help brands retain their integrity in a world demanding disruption.',
    description:
      'Strategic brand development that aligns your visual identity, messaging, and positioning to carve a distinct space in the minds of your audience.',
  },
  {
    id: 'creative-media',
    name: 'Motion Graphics and Creative Design',
    slug: 'creative-media',
    icon: 'Palette',
    tagline: 'Imagination made tangible',
    description:
      'Bold, imaginative media concepts executed with precision — motion graphics, animated content, conceptual campaigns, and multimedia storytelling.',
  },
  {
    id: 'drone-services',
    name: 'Drone Services',
    slug: 'drone-services',
    icon: 'Navigation',
    tagline: 'Perspective from above',
    description:
      "Licensed aerial cinematography and photography capturing stunning bird's-eye footage for real estate, events, commercials, and large-scale productions.",
  },
  {
    id: 'corporate-communications',
    name: 'Corporate Communications',
    slug: 'corporate-communications',
    icon: 'Briefcase',
    tagline: 'Clarity at every level',
    description:
      'Executive messaging, internal communications, investor presentations, and corporate video — aligning your voice from boardroom to frontline.',
  },
  {
    id: 'commercial-productions',
    name: 'Commercial Productions',
    slug: 'commercial-productions',
    icon: 'TrendingUp',
    tagline: 'Sell with cinematic power',
    description:
      'TV commercials, online ads, and product films engineered to convert — combining compelling creative with strategic media thinking.',
  },
  {
    id: 'digital-content-creation',
    name: 'Digital Content Creation',
    slug: 'digital-content-creation',
    icon: 'LayoutDashboard',
    tagline: 'Content that performs',
    description:
      'Scroll-stopping digital-first content tailored for social media, OTT platforms, websites, and beyond — optimised for engagement and reach.',
  },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Services',
    href: '/services',
    dropdown: SERVICES.map((s) => ({
      label: s.name,
      href: `/services/${s.slug}`,
      description: s.tagline,
    })),
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

// ─── Social Platforms ─────────────────────────────────────────────────────────

export const SOCIAL_PLATFORMS: SocialPlatformEntry[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    baseUrl: 'https://facebook.com/',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    baseUrl: 'https://instagram.com/',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'Twitter',
    baseUrl: 'https://twitter.com/',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    baseUrl: 'https://linkedin.com/company/',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    baseUrl: 'https://youtube.com/@',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music2',
    baseUrl: 'https://tiktok.com/@',
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: 'Play',
    baseUrl: 'https://vimeo.com/',
  },
];

// ─── Misc Constants ───────────────────────────────────────────────────────────

export const SITE_NAME = 'Dencast Global';
export const SITE_TAGLINE = 'Telling Africa\'s Stories to the World';
export const CONTACT_EMAIL = 'info@dencastglobal.co.ke';
export const DEFAULT_PAGE_SIZE = 9;
export const HERO_VIDEO_FALLBACK = '/assets/hero-poster.jpg';
