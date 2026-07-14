import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Play, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import type { HeroContent } from '@/types';

const backgroundVideo = '/videos/background.mp4';

// ─── Static fallback ──────────────────────────────────────────────────────────

const FALLBACK: Partial<HeroContent> = {
  headline: 'We Tell Stories That Move the World',
  subheadline: 'Premium Creative Media & Film Production',
  cta_primary_text: 'Explore Our Work',
  cta_primary_url: '/portfolio',
  cta_secondary_text: 'Get In Touch',
  cta_secondary_url: '/contact',
  background_video_url: backgroundVideo,
};

interface HeroProps {
  data?: Partial<HeroContent> | null;
}

// ─── Animated Headline ────────────────────────────────────────────────────────

const AnimatedHeadline: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLSpanElement>('.char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 60, rotateX: -45 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, [text]);

  const words = text.split(' ');

  return (
    <h1
      ref={containerRef}
      className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight text-white"
      style={{ perspective: '800px' }}
    >
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => (
              <span
                key={ci}
                className="char inline-block"
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && (
            <span className="char inline-block">&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </h1>
  );
};

// ─── Floating Shape ───────────────────────────────────────────────────────────

const FloatingShape: React.FC<{
  size: number;
  top: string;
  left?: string;
  right?: string;
  delay?: number;
  color?: string;
  opacity?: number;
}> = ({ size, top, left, right, delay = 0, color = '#0056A6', opacity = 0.15 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      top,
      left,
      right,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
    }}
    animate={{
      y: [0, -20, 0],
      scale: [1, 1.08, 1],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  />
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: React.FC<HeroProps> = ({ data }) => {
  const hero = { ...FALLBACK, ...data };
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const subRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Animate subheadline, desc, and CTA after headline
  useEffect(() => {
    const els = [subRef.current, descRef.current, ctaRef.current].filter(Boolean);
    gsap.fromTo(
      els,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
        delay: 1.2,
      }
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#001a3a]">
      {/* ── Background Video ── */}
      {!videoError && hero.background_video_url && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={hero.background_video_url}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
      )}

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a3a]/90 via-[#0056A6]/50 to-[#001a3a]/80 z-10" />

      {/* ── Scan line texture ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Decorative diagonal stripe ── */}
      <div
        className="absolute -right-32 top-0 w-[500px] h-full z-10 opacity-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 45%, #D72638 45%, #D72638 55%, transparent 55%)',
        }}
      />

      {/* ── Floating shapes ── */}
      <FloatingShape size={400} top="-10%" right="-5%" delay={0} color="#0056A6" opacity={0.12} />
      <FloatingShape size={250} top="60%" left="-5%" delay={2} color="#D72638" opacity={0.08} />
      <FloatingShape size={180} top="30%" right="10%" delay={1.5} color="#ffffff" opacity={0.05} />

      {/* ── Main content ── */}
      <div className="relative z-20 flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-20 pt-28 pb-32">
        <div className="max-w-5xl mx-auto w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#D72638] animate-pulse" />
            <span className="text-[#D72638] text-xs font-bold tracking-[0.3em] uppercase">
              Dencast Global
            </span>
            <span className="h-px w-12 bg-[#D72638]/60" />
          </motion.div>

          {/* Headline */}
          <AnimatedHeadline text={hero.headline ?? 'We Tell Stories That Move the World'} />

          {/* Subheadline */}
          <p
            ref={subRef}
            className="mt-4 text-lg sm:text-xl lg:text-2xl font-semibold text-[#D72638] tracking-wide opacity-0"
          >
            {hero.subheadline ?? 'Premium Creative Media & Film Production'}
          </p>

          {/* Description */}
          <p
            ref={descRef}
            className="mt-4 max-w-2xl text-white/70 text-base sm:text-lg leading-relaxed opacity-0"
          >
            We are a world-class creative media and film production company dedicated to crafting
            cinematic stories that captivate audiences, elevate brands, and leave a lasting
            impression on the global stage.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-10 flex flex-wrap items-center gap-4 opacity-0"
          >
            <Link to={hero.cta_primary_url ?? '/portfolio'}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<Play size={16} className="fill-white" />}
              >
                {hero.cta_primary_text ?? 'Explore Our Work'}
              </Button>
            </Link>
            <Link to={hero.cta_secondary_url ?? '/contact'}>
              <Button variant="ghost" size="lg" rightIcon={<ArrowRight size={16} />}>
                {hero.cta_secondary_text ?? 'Get In Touch'}
              </Button>
            </Link>
          </div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-14 flex flex-wrap items-center gap-6"
          >
            {['500+ Projects', '10+ Years', '200+ Clients', '25+ Countries'].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D72638]" />
                <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                  {stat}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator style="mouse" label="Scroll to explore" />
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-10 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
