import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { subscribeNewsletter } from '@/services/supabase.service';

// ─── CallToAction ─────────────────────────────────────────────────────────────

const CallToAction: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await subscribeNewsletter(email.trim());
      if (result.error) {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative py-28 overflow-hidden">
      {/* ── Background gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0056A6] via-[#003d82] to-[#001a3a]" />

      {/* ── Animated motion blobs ── */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#D72638]/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ── Grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#D72638] animate-pulse" />
          <span className="text-[#D72638] text-xs font-bold tracking-[0.3em] uppercase">
            Start a Project
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight"
        >
          Ready to Tell{' '}
          <span className="text-[#D72638]">Your Story?</span>
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-white/70 text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Whether you have a fully-formed brief or just a spark of an idea, our team is ready to
          partner with you and craft something that the world will remember.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/contact">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Start a Project
            </Button>
          </Link>
          <a href="tel:+254700000000">
            <Button variant="ghost" size="lg" leftIcon={<Phone size={16} />}>
              Call Us Now
            </Button>
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
            Or get a quick quote
          </span>
          <div className="flex-1 h-px bg-white/15" />
        </motion.div>

        {/* Email quote form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={status === 'loading' || status === 'success'}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#D72638]/60 backdrop-blur-sm disabled:opacity-60"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={status === 'loading'}
            disabled={status === 'success'}
            className="flex-shrink-0"
          >
            {status === 'success' ? (
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                Sent!
              </span>
            ) : status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </span>
            ) : (
              'Get a Quote'
            )}
          </Button>
        </motion.form>

        {status === 'error' && (
          <p className="mt-2 text-[#ff8a8a] text-xs">{errorMsg}</p>
        )}
        {status === 'success' && (
          <p className="mt-2 text-green-300 text-xs font-semibold">
            ✓ Thanks! We'll be in touch shortly.
          </p>
        )}

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-white/30 text-xs"
        >
          No spam. Unsubscribe anytime. We respond within 24 hours.
        </motion.p>
      </div>
    </section>
  );
};

export default CallToAction;
