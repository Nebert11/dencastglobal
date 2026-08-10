import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Camera, Monitor, Users, Package, Edit3, Navigation, ArrowRight, Play, X,
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

// const CAMERAS = [
//   { name: 'Sony A7R V', type: 'Photography' },
//   { name: 'Phase One XF', type: 'Photography' },
//   { name: 'Canon EOS R5', type: 'Photography' },
//   { name: 'Hasselblad X2D', type: 'Photography' },
//   { name: 'DJI Inspire 3', type: 'Drone' },
//   { name: 'Sony FE 24-70mm GM II', type: 'Lenses' },
//   { name: 'Sony FE 70-200mm GM OSS II', type: 'Lenses' },
//   { name: 'Sigma Art Prime Set', type: 'Lenses' },
//   { name: 'Profoto B10X Plus', type: 'Lighting' },
// ];

const GALLERY_IMAGES = [
  { src: '/dencast_images/photography/photo1.jpg',  alt: 'Photography portfolio image 1',  caption: 'Professional Photography', description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo2.jpg',  alt: 'Photography portfolio image 2',  caption: 'Event Coverage',           description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo3.jpg',  alt: 'Photography portfolio image 3',  caption: 'Portrait Session',         description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo4.jpg',  alt: 'Photography portfolio image 4',  caption: 'Corporate Photography',    description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo5.jpg',  alt: 'Photography portfolio image 5',  caption: 'On Location',              description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo6.jpg',  alt: 'Photography portfolio image 6',  caption: 'Editorial Frame',          description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo7.jpg',  alt: 'Photography portfolio image 7',  caption: 'Visual Storytelling',      description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo8.jpg',  alt: 'Photography portfolio image 8',  caption: 'Conference Coverage',      description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo9.jpg',  alt: 'Photography portfolio image 9',  caption: 'Live Event Capture',       description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo10.jpg', alt: 'Photography portfolio image 10', caption: 'Brand Visuals',            description: '', objectPosition: 'center top' },
  // { src: '/dencast_images/photography/photo11.jpg', alt: 'Photography portfolio image 11', caption: 'Documentary Still',        description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo12.jpg', alt: 'Photography portfolio image 12', caption: 'Behind the Lens',          description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo13.jpg', alt: 'Photography portfolio image 13', caption: 'Candid Moments',           description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo14.jpg', alt: 'Photography portfolio image 14', caption: 'Stage & Performance',      description: '', objectPosition: 'center top' },
  { src: '/dencast_images/photography/photo15.jpg', alt: 'Photography portfolio image 15', caption: 'Creative Composition',     description: '', objectPosition: 'center top' },
  // { src: '/dencast_images/photography/photo16.jpg', alt: 'Photography portfolio image 16', caption: 'Premium Imagery',          description: '', objectPosition: 'center top' },
];

const PROPERTY_GALLERY = [
  { src: '/dencast_images/photography/products_photography/prod.jpg',  alt: 'Product photography — featured item' },
  { src: '/dencast_images/photography/products_photography/prod1.jpg', alt: 'Property photography showcase' },
  { src: '/dencast_images/photography/products_photography/prod2.jpg', alt: 'Product detail and quality photography' },
  { src: '/dencast_images/photography/products_photography/prod3.jpg', alt: 'Commercial product photography' },
  { src: '/dencast_images/photography/products_photography/prod4.jpg', alt: 'Retail and branded merchandise photography' },
  { src: '/dencast_images/photography/products_photography/prod5.jpg', alt: 'Food and lifestyle product photography' },
  { src: '/dencast_images/photography/products_photography/prod6.jpg', alt: 'Equipment and corporate product photography' },
  { src: '/dencast_images/photography/products_photography/prod7.jpg', alt: 'Property and space photography' },
];

const PROPERTY_VIDEOS = [
  { title: 'Coffee Garden Hotel Bungoma', url: 'https://www.youtube.com/watch?v=wTgeV-koD7k' },
  { title: 'White Beach Palace', url: 'https://www.youtube.com/watch?v=Gp1GfcrdY_w' },
];

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

const getYoutubeId = (url: string) => {
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

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── PhotographyPage ──────────────────────────────────────────────────────────

const PhotographyPage: React.FC = () => {
  const photoRef = useRef(null);
  const galleryRef = useRef(null);
  // const equipRef = useRef(null);
  const propertyRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);

  const photoInView = useInView(photoRef, { once: true, margin: '-80px' });
  const galleryInView = useInView(galleryRef, { once: true, margin: '-80px' });
  // const equipInView = useInView(equipRef, { once: true, margin: '-80px' });
  const propertyInView = useInView(propertyRef, { once: true, margin: '-80px' });
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      <Helmet>
        <title>Photography | {SITE_NAME}</title>
        <meta name="description" content="Professional photography services — portrait, commercial, event, aerial, and product photography across Africa." />
      </Helmet>

      {/* ── Cinematic Hero ── */}
      <section className="relative min-h-[60vh] sm:min-h-[90vh] flex items-center justify-start overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/dencast_images/WEBSITE-PHOTO.jpg)', backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left pl-6 sm:pl-12 lg:pl-20 py-32">
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            {/* <ChevronRight size={14} /> */}
            <Link to="/services" className="hover:text-white">Services</Link>
            {/* <ChevronRight size={14} /> */}
            <span className="text-white">Photography</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-4 text-left"
          >
            One Frame.{' '}
            <span className="text-[#D3232E]">Infinite</span>
            <br />Impact.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="text-white/70 text-xl max-w-2xl mb-10"
          >
            Professional photography that tells your story across every format, from medium-format portraits to commercial visual campaigns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center justify-start gap-4 flex-wrap"
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

      {/* ── Property and Product Photography ── */}
      <section ref={propertyRef} className="bg-slate-50 border-t border-slate-100">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <motion.div variants={stagger} initial="hidden" animate={propertyInView ? 'visible' : 'hidden'}>
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <PhotoCarousel
            title="Property and Product Photography"
            items={PROPERTY_GALLERY.map((image) => ({
              src: image.src,
              alt: image.alt,
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div variants={stagger} initial="hidden" animate={propertyInView ? 'visible' : 'hidden'}>
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-5">Featured Videos</motion.p>
            <div className="grid sm:grid-cols-2 gap-4">
              {PROPERTY_VIDEOS.map((video, i) => (
                <motion.button
                  key={video.url}
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  custom={i}
                  variants={fadeUp}
                  className="rounded-xl border border-slate-200 bg-white p-3 hover:border-[#25408F]/40 hover:bg-[#25408F]/5 transition-all duration-300 text-left"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                    <img
                      src={getYoutubeId(video.url) ? `https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg` : '/dencast_images/WEBSITE-PHOTO.jpg'}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg">
                        <Play size={20} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{video.title}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Featured Video</p>
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
              src={`${toYoutubeEmbedUrl(activeVideo.url)}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
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

      {/* ── Photography Portfolio ── */}
      <section ref={galleryRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={galleryInView ? 'visible' : 'hidden'} className="text-center mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Portfolio" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">Photography Portfolio</motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Browse our latest photography highlights. Click any image to open it in a larger view.
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
                objectPosition: image.objectPosition,
              }))}
              variant="showcase"
              showMeta={false}
              imageClickable
              viewerMode="immersive"
              showCardBorder={false}
              aspectClassName="aspect-[3/4]"
              className="rounded-[2rem]"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Equipment ── */}
      {/* <section ref={equipRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate={equipInView ? 'visible' : 'hidden'} className="text-center mb-12">
            <motion.div variants={fadeUp}><SectionLabel label="Equipment" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900">
              Photography Gear
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
      </section> */}

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#25408F] to-[#001f3f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel label="Book a Shoot" light center />
          <h2 className="mt-4 text-4xl font-black text-white">
            Ready for Stunning Visuals?
          </h2>
          <p className="mt-4 text-white/70 text-lg mb-10">
            Let's create imagery that elevates your brand and tells your story.
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
