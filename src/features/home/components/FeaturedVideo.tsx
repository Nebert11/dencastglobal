import React from 'react';
import { motion } from 'framer-motion';
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
  return (
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
          <div className="relative rounded-[2rem] bg-[#0f172a] p-2 sm:p-3 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.55)] border border-slate-700/40">
            <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-video">
              <iframe
                src={embedSrc}
                title="Dencast TV featured video"
                className="w-full h-full"
                loading="lazy"
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="absolute left-1/2 -bottom-3 h-3 w-36 -translate-x-1/2 rounded-b-2xl bg-slate-800/90 sm:w-48" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedVideo;
