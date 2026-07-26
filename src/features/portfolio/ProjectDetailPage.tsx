import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight, Calendar, Tag, User, Share2,
  Twitter, Linkedin, Link as LinkIcon, ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import MediaCard from '@/components/ui/MediaCard';
import { SITE_NAME } from '@/utils/constants';

// ─── Static project data ──────────────────────────────────────────────────────

interface TabContent {
  heading: string;
  body: string;
}

interface ProjectData {
  slug: string;
  title: string;
  category: string;
  client: string;
  date: string;
  heroImage: string;
  videoId: string;
  services: string[];
  challenge: TabContent;
  solution: TabContent;
  results: TabContent;
  gallery: string[];
  relatedSlugs: string[];
}

const PROJECTS: Record<string, ProjectData> = {
  'voices-of-the-nile': {
    slug: 'voices-of-the-nile',
    title: 'Voices of the Nile',
    category: 'Documentary',
    client: 'Africa Documentary Fund',
    date: 'March 2024',
    heroImage: '3379934',
    videoId: '2HF4pXkmntk',
    services: ['Documentary Production', 'Cinematography', 'Post-Production', 'Distribution'],
    challenge: { heading: 'The Challenge', body: 'The client needed a feature documentary that would bring international attention to water scarcity along the Nile Basin while humanising the 400 million people whose livelihoods depend on it. Existing coverage was either overly academic or sensationalised, failing to connect with global audiences.' },
    solution: { heading: 'Our Solution', body: 'We embedded a small crew in three communities over six months — Ethiopia, Sudan, and Egypt — building deep trust and capturing intimate, nuanced stories. We used a hybrid observational-participatory approach, allowing subjects to hold cameras and narrate their own experiences. The result is a film that is both politically substantive and deeply human.' },
    results: { heading: 'The Results', body: 'The film premiered at the Carthage Film Festival and was acquired by Al Jazeera English. It has since been screened in 22 countries, sparked two parliamentary debates on trans-boundary water policy, and won the Best African Documentary award at FESPACO 2024. Digital distribution generated 2.3M views in the first 90 days.' },
    gallery: ['3379934', '2873486', '1884577', '3756132', '7034014', '7247399'],
    relatedSlugs: ['tech-innovators-doc', 'harvest-time-film', 'mtn-brand-relaunch'],
  },
  'mtn-brand-relaunch': {
    slug: 'mtn-brand-relaunch',
    title: 'MTN Brand Relaunch Campaign',
    category: 'Branding',
    client: 'MTN Group',
    date: 'January 2024',
    heroImage: '2873486',
    videoId: '2HF4pXkmntk',
    services: ['Brand Strategy', 'TVC Production', 'Photography', 'Digital Content'],
    challenge: { heading: 'The Challenge', body: 'MTN needed a pan-African brand refresh that would resonate across 21 markets while maintaining brand consistency. Previous campaigns had failed to connect emotionally with younger demographics, resulting in declining brand affinity scores among 18–35 year olds.' },
    solution: { heading: 'Our Solution', body: 'We developed a pan-African brand narrative anchored in the concept of Bright Futures — celebrating African excellence and ambition. We produced a flagship 60-second TVC, 100+ social assets, and a brand photography library featuring real people from across the continent.' },
    results: { heading: 'The Results', body: 'Brand affinity among the 18–35 segment increased by 34% in tracked markets. The TVC achieved 45M views in its first month across digital platforms. The campaign won the Pan-African Marketing Excellence Award and was shortlisted at Cannes Lions.' },
    gallery: ['2873486', '3379934', '1884577', '3756132', '7034014', '7247399'],
    relatedSlugs: ['kasapreko-commercial', 'stanbic-investor-day', 'voices-of-the-nile'],
  },
};

// Fallback for unrecognised slugs
const DEFAULT_PROJECT = PROJECTS['voices-of-the-nile'];

// Related items lookup
const RELATED_LOOKUP: Record<string, { title: string; category: string; image: string }> = {
  'voices-of-the-nile':    { title: 'Voices of the Nile', category: 'Documentary', image: '3379934' },
  'mtn-brand-relaunch':    { title: 'MTN Brand Relaunch', category: 'Branding', image: '2873486' },
  'tech-innovators-doc':   { title: 'Africa Tech Innovators', category: 'Documentary', image: '3756132' },
  'harvest-time-film':     { title: 'Harvest Time', category: 'Documentary', image: '3866149' },
  'kasapreko-commercial':  { title: 'Kasapreko TVC', category: 'Commercial', image: '7034014' },
  'stanbic-investor-day':  { title: 'Stanbic Investor Day', category: 'Corporate', image: '3379932' },
};

// ─── ProjectDetailPage ────────────────────────────────────────────────────────

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'challenge' | 'solution' | 'results'>('challenge');
  const [copied, setCopied] = useState(false);

  const project = (slug && PROJECTS[slug]) ? PROJECTS[slug] : DEFAULT_PROJECT;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'challenge' as const, label: 'Challenge' },
    { id: 'solution' as const, label: 'Solution' },
    { id: 'results' as const, label: 'Results' },
  ];

  return (
    <>
      <Helmet>
        <title>{project.title} | Portfolio | {SITE_NAME}</title>
        <meta name="description" content={project.challenge.body.slice(0, 155)} />
        <meta property="og:title" content={`${project.title} | ${SITE_NAME}`} />
        <meta property="og:image" content={`https://images.pexels.com/photos/${project.heroImage}/pexels-photo-${project.heroImage}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.pexels.com/photos/${project.heroImage}/pexels-photo-${project.heroImage}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium line-clamp-1">{project.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-[#D3232E] text-white text-xs font-bold uppercase tracking-widest rounded-md mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-3xl">
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

      {/* ── Share Bar ── */}
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

      {/* ── Challenge / Solution / Results Tabs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Tabs */}
            <div>
              <div className="flex gap-2 mb-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#25408F] text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-3xl font-black text-slate-900 mb-4">
                  {project[activeTab].heading}
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {project[activeTab].body}
                </p>
              </motion.div>
            </div>

            {/* Project info */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Project Details</h3>
              <dl className="space-y-4">
                {[
                  { label: 'Client', value: project.client },
                  { label: 'Category', value: project.category },
                  { label: 'Date', value: project.date },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <dt className="text-sm font-semibold text-slate-500 w-24 flex-shrink-0">{label}</dt>
                    <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-sm font-semibold text-slate-500 mb-3">Services Used</dt>
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

      {/* ── Gallery ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel label="Gallery" />
          <h2 className="mt-4 text-3xl font-black text-slate-900 mb-10">Project Images</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
              >
                <img
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={`${project.title} image ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Embed ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel label="Film Preview" center />
            <h2 className="mt-4 text-3xl font-black text-slate-900">Watch the Film</h2>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
            <iframe
              src={`https://www.youtube.com/embed/${project.videoId}?rel=0&modestbranding=1`}
              title={project.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── Related Projects ── */}
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
                  image={`https://images.pexels.com/photos/${rel.image}/pexels-photo-${rel.image}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  slug={relSlug}
                  type="project"
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;
