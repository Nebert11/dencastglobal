import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Camera, Monitor, Users, Package, Edit3,
  Navigation, Aperture, Video, Film, ChevronRight, ArrowRight, CheckCircle2, Play, X,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import PhotoCarousel from '@/components/ui/PhotoCarousel';
import { SITE_NAME } from '@/utils/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PHOTO_CATEGORIES = [
  { icon: Users, title: 'Portrait Photography', desc: 'Corporate headshots, personal branding portraits, and editorial portraiture that captures authentic character.' },
  { icon: Monitor, title: 'Commercial Photography', desc: 'Product, lifestyle, and brand imagery crafted to convert browsers into buyers.' },
  { icon: Camera, title: 'Event Photography', desc: 'Conferences, galas, launches, and celebrations documented with energy and precision.' },
  { icon: Navigation, title: 'Aerial / Drone', desc: 'Stunning bird\'s-eye perspectives for real estate, events, and landscape projects.' },
  { icon: Package, title: 'Product Photography', desc: 'Clean, compelling product images optimised for e-commerce and advertising.' },
  { icon: Edit3, title: 'Editorial Photography', desc: 'Magazine-quality imagery for publications, campaigns, and brand storytelling.' },
];

const VIDEO_CATEGORIES = [
  { icon: Film, title: 'Corporate Video', desc: 'Company films, executive interviews, and internal communications content.' },
  { icon: Aperture, title: 'Documentary', desc: 'Long-form narrative films that explore subjects with depth and authenticity.' },
  { icon: Monitor, title: 'Commercial / TVC', desc: 'High-impact advertisements designed for broadcast and digital platforms.' },
  { icon: Video, title: 'Social Media', desc: 'Short-form, platform-native content optimised for Reels, TikTok, and YouTube.' },
];

const CAMERAS = [
  { name: 'Sony A7R V', type: 'Photography' },
  { name: 'Phase One XF', type: 'Photography' },
  { name: 'Canon EOS R5', type: 'Photography' },
  { name: 'Hasselblad X2D', type: 'Photography' },
  { name: 'RED V-RAPTOR 8K', type: 'Cinema' },
  { name: 'ARRI Alexa Mini LF', type: 'Cinema' },
  { name: 'Sony Venice 2', type: 'Cinema' },
  { name: 'DJI Inspire 3', type: 'Drone' },
  { name: 'Zeiss Supreme Primes', type: 'Lenses' },
  { name: 'Cooke S7/i Set', type: 'Lenses' },
  { name: 'ARRI Orion Anamorphics', type: 'Lenses' },
  { name: 'Profoto B10X Plus', type: 'Lighting' },
];

const GALLERY_IMAGES = [
  {
    src: '/dencast_images/White-Beach-Palace.jpg',
    alt: 'Resort lifestyle photography at White Beach Palace',
    caption: 'White Beach Palace',
    description: 'Hospitality lifestyle visuals crafted to highlight atmosphere, architecture, and guest experience.',
  },
  {
    src: '/dencast_images/sasini_conference.jpg',
    alt: 'Corporate conference visual coverage by Dencast Global',
    caption: 'Corporate Conference Coverage',
    description: 'Executive-level event storytelling with clean composition and brand-focused detail.',
  },
  {
    src: '/dencast_images/event1.jpg',
    alt: 'Event photography capturing keynote moments',
    caption: 'Keynote Moments',
    description: 'High-impact conference imagery that captures speakers, delegates, and audience energy.',
  },
  {
    src: '/dencast_images/1U9A9541-scaled.jpg',
    alt: 'High-energy crowd and stage event coverage',
    caption: 'Live Stage Energy',
    description: 'Dynamic crowd and performance shots designed for campaigns, press, and social media.',
  },
  {
    src: '/dencast_images/DSC_3903-scaled.jpg',
    alt: 'Editorial outdoor portrait session in natural light',
    caption: 'Editorial Portrait Session',
    description: 'Natural-light portraiture with a cinematic editorial approach and polished finishing.',
  },
  {
    src: '/dencast_images/IMG-20170922-WA0020.jpg',
    alt: 'Lifestyle and storytelling photography composition',
    caption: 'Lifestyle Storytelling',
    description: 'Human-centered lifestyle frames that blend narrative context with strong visual identity.',
  },
  {
    src: '/dencast_images/DSC_5424-scaled.jpg',
    alt: 'Commercial brand photography scene setup',
    caption: 'Commercial Brand Visuals',
    description: 'Product and brand-directed imagery planned for consistency across digital campaigns.',
  },
  {
    src: '/dencast_images/1U9A0278-scaled.jpg',
    alt: 'Cinematic still image with dramatic composition',
    caption: 'Cinematic Composition',
    description: 'Dramatic framing and tonal depth built for premium storytelling and visual impact.',
  },
  {
    src: '/photography/photography1.jpg',
    alt: 'Cinematic still image with dramatic composition',
    caption: 'Cinematic Composition',
    description: 'Dramatic framing and tonal depth built for premium storytelling and visual impact.',
  },
];

const PROPERTY_VIDEOS = [
  { title: 'Coffee Garden Hotel Bungoma', url: 'https://www.youtube.com/watch?v=wTgeV-koD7k' },
  { title: 'White Beach Palace', url: 'https://www.youtube.com/watch?v=Gp1GfcrdY_w' },
];

const PROPERTY_GALLERY = [
  { src: '/dencast_images/White-Beach-Palace.jpg', alt: 'White Beach Palace property photography' },
  { src: '/dencast_images/event1.jpg', alt: 'Property and product visual' },
];

function getPropertyYoutubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace('/', '').trim();
    return parsed.searchParams.get('v') ?? '';
  } catch { return ''; }
}

function getPropertyEmbedUrl(url: string): string {
  const id = getPropertyYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1` : url;
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── PhotographyPage ──────────────────────────────────────────────────────────

const PhotographyPage: React.FC = () => {
  const photoRef = useRef(null);
  const videoRef = useRef(null);
  const galleryRef = useRef(null);
  const equipRef = useRef(null);
  const propertyRef = useRef(null);
  const [activePropertyVideo, setActivePropertyVideo] = useState<{ title: string; url: string } | null>(null);
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  const photoInView = useInView(photoRef, { once: true, margin: '-80px' });
  const videoInView = useInView(videoRef, { once: true, margin: '-80px' });
  const galleryInView = useInView(galleryRef, { once: true, margin: '-80px' });
  const equipInView = useInView(equipRef, { once: true, margin: '-80px' });
  const propertyInView = useInView(propertyRef, { once: true, margin: '-80px' });

  return (
    <>
      <Helmet>
        <title>Photography & Videography | {SITE_NAME}</title>
        <meta name="description" content="Professional photography and videography services — portrait, commercial, event, aerial, and cinematic video production across Africa." />
      </Helmet>

      {/* ── Cinematic Hero ── */}
      <section className="relative min-h-[60vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/dencast_images/WEBSITE-PHOTO.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Photography & Videography</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-4"
          >
            One Frame.{' '}
            <span className="text-[#D3232E]">Infinite</span>
            <br />Impact.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="text-white/70 text-xl max-w-2xl mx-auto mb-10"
          >
            Professional photography and videography that tells your story across every format — from medium-format portraits to cinema-grade films.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Book a Shoot
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="ghost" size="lg">
                View Portfolio
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Photography Categories ── */}
      <section ref={photoRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={photoInView ? 'visible' : 'hidden'} className="mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="Photography" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
              Still Images that <span className="text-[#25408F]">Speak Volumes</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl">
              Every great brand, story, and moment deserves a photographer who can capture its true essence. Our team works across six photographic disciplines.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PHOTO_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  custom={i} variants={fadeUp} initial="hidden" animate={photoInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -5 }}
                  className="group p-8 rounded-2xl border border-slate-100 hover:border-[#25408F]/20 hover:shadow-xl bg-white transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#25408F]/10 group-hover:bg-[#25408F] flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon size={24} className="text-[#25408F] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{cat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Videography Categories ── */}
      <section ref={videoRef} className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={videoInView ? 'visible' : 'hidden'} className="mb-16">
            <motion.div variants={fadeUp}><SectionLabel label="Videography" light /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white">
              Motion that <span className="text-[#D3232E]">Resonates</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-white/60 text-lg max-w-2xl">
              Cinema-grade video production from intimate single-camera shoots to full multi-crew feature productions.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VIDEO_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  custom={i} variants={fadeUp} initial="hidden" animate={videoInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#D3232E]/40 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D3232E]/20 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-[#D3232E]" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{cat.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Property and Product Photography ── */}
      <section ref={propertyRef} className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={propertyInView ? 'visible' : 'hidden'} className="mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Property & Product" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-slate-900">
              Property and Product Photography
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-slate-600 text-lg leading-relaxed max-w-3xl">
              We create high-quality property and product images that highlight detail, quality and visual appeal. From residential and commercial spaces to retail products, food, equipment and branded merchandise, every photograph is carefully composed, professionally lit and edited to present your offering at its best.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-slate-500 leading-relaxed max-w-3xl">
              Our photography is ideal for websites, property listings, catalogues, advertising campaigns, social media and corporate profiles, helping your brand attract attention, build credibility and inspire customers to take action.
            </motion.p>
          </motion.div>

          {/* Gallery */}
          <motion.div
            variants={stagger} initial="hidden" animate={propertyInView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 gap-6 mb-10"
          >
            {PROPERTY_GALLERY.map((img, i) => (
              <motion.div key={img.src} custom={i} variants={fadeUp} className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </motion.div>

          {/* Videos */}
          <motion.div variants={stagger} initial="hidden" animate={propertyInView ? 'visible' : 'hidden'}>
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-5">Featured Videos</motion.p>
            <div className="grid sm:grid-cols-2 gap-6">
              {PROPERTY_VIDEOS.map((video, i) => (
                <motion.button
                  key={video.url}
                  custom={i} variants={fadeUp}
                  type="button"
                  onClick={() => setActivePropertyVideo(video)}
                  className="group rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-md text-left"
                >
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${getPropertyYoutubeId(video.url)}/hqdefault.jpg`}
                      alt={video.title}
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
                  <div className="px-4 py-3 bg-white">
                    <p className="text-sm font-semibold text-slate-700">{video.title}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Video modal */}
        {modalRoot && activePropertyVideo && createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActivePropertyVideo(null)}
          >
            <div
              className="relative w-full sm:w-[80vw] h-auto max-w-[1200px] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setActivePropertyVideo(null)}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={getPropertyEmbedUrl(activePropertyVideo.url)}
                  title={activePropertyVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          modalRoot,
        )}
      </section>

      {/* ── Responsive Carousel Gallery ── */}
      <section ref={galleryRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={galleryInView ? 'visible' : 'hidden'} className="text-center mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Portfolio" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">Visual Portfolio</motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Browse our latest photography highlights. Use the arrows to move through the gallery.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <PhotoCarousel
              title="Photography Portfolio"
              items={GALLERY_IMAGES.map((image) => ({
                src: image.src,
                alt: image.alt,
                caption: image.caption,
                description: image.description,
              }))}
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

      {/* ── Equipment ── */}
      <section ref={equipRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={equipInView ? 'visible' : 'hidden'} className="text-center mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Equipment" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Cinema-Grade Arsenal
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={equipInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {CAMERAS.map(cam => (
              <div key={cam.name} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#25408F] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{cam.name}</p>
                  <p className="text-xs text-[#D3232E] font-medium mt-0.5">{cam.type}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#25408F] to-[#001f3f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Book a Shoot" light center />
          <h2 className="mt-4 text-4xl font-black text-white">
            Ready for Stunning Visuals?
          </h2>
          <p className="mt-4 text-white/70 text-lg mb-10">
            Let's create imagery and footage that elevates your brand and tells your story.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default PhotographyPage;
