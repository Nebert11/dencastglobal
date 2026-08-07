import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const FEATURED_VIDEO_URL = 'https://www.youtube.com/watch?v=pYOevHo8v7Q';

function getYoutubeVideoId(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim();
    }

    return parsed.searchParams.get('v')?.trim() ?? '';
  } catch {
    return '';
  }
}

const videoId = getYoutubeVideoId(FEATURED_VIDEO_URL);

const embedSrc = videoId
  ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`
  : FEATURED_VIDEO_URL;

const FeaturedVideo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="text-center mb-10">
            <SectionLabel label="Dencast TV" center />
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-[#25408F] tracking-tight">
              Featured Video
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto max-w-6xl"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-[2rem] bg-[#0f172a] p-2 sm:p-3 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.55)] border border-slate-700/40 w-full text-left group"
            >
              <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-video">
                <img
                  src={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/dencast_images/WEBSITE-PHOTO.jpg'}
                  alt="Dencast TV featured video"
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
                <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Dencast TV</p>
                <p className="text-sm sm:text-base font-semibold">Featured Video</p>
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
              src={embedSrc}
              title="Dencast TV featured video"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

export default FeaturedVideo;
