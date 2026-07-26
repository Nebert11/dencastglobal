import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  /** When `false`, the loading screen fades out. */
  isLoading: boolean;
  /** Minimum visible duration in ms (default: 1600) */
  minDuration?: number;
}

// ─── Film perforations ────────────────────────────────────────────────────────

const FilmStrip: React.FC = () => (
  <div className="flex items-center gap-0 mb-8">
    {/* Left perforations */}
    <div className="flex flex-col gap-1.5 mr-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="block w-2 h-3 rounded-sm bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>

    {/* Center frame */}
    <motion.div
      className="relative w-40 h-24 bg-white/5 border border-white/10 rounded-md overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-[#25408F]/60"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <span className="text-white/20 text-4xl font-black tracking-widest select-none">DC</span>
    </motion.div>

    {/* Right perforations */}
    <div className="flex flex-col gap-1.5 ml-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="block w-2 h-3 rounded-sm bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 + 0.1 }}
        />
      ))}
    </div>
  </div>
);

// ─── Animated logo text ───────────────────────────────────────────────────────

const chars = 'DENCAST GLOBAL'.split('');

const LogoText: React.FC = () => (
  <div className="flex items-baseline gap-0 mb-2 overflow-hidden">
    {chars.map((char, i) => (
      <motion.span
        key={i}
        className={char === ' '
          ? 'inline-block w-5'
          : 'inline-block text-3xl sm:text-4xl font-black tracking-[0.05em] text-white select-none'
        }
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 + i * 0.04, ease: 'easeOut' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-64 sm:w-80 mt-8">
    <div className="h-[3px] rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#D3232E] to-[#ff4d5e] rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
    <motion.p
      className="text-slate-500 text-xs tracking-widest mt-2 text-right"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {progress.toFixed(0)}%
    </motion.p>
  </div>
);

// ─── LoadingScreen ────────────────────────────────────────────────────────────

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  minDuration = 1600,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  // Animate progress bar
  useEffect(() => {
    const startTime = Date.now();
    let rafId: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const naturalProgress = Math.min((elapsed / minDuration) * 90, 90);

      if (!isLoading) {
        setProgress(100);
      } else {
        setProgress(naturalProgress);
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isLoading, minDuration]);

  // Hide after fade-out
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {(isLoading || progress < 100) && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#000d1f] flex flex-col items-center justify-center"
        >
          {/* Subtle grid bg */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center">
            <FilmStrip />
            <LogoText />

            <motion.p
              className="text-slate-500 text-xs tracking-[0.3em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Cinematic Excellence
            </motion.p>

            <ProgressBar progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
