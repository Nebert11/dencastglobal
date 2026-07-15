import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Phone, Mail, MapPin, MessageCircle, Clock,
  ChevronRight, Instagram, Facebook, Twitter,
  Linkedin, Youtube, ChevronDown,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ContactForm from './components/ContactForm';
import { SITE_NAME, CONTACT_EMAIL } from '@/utils/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How long does a typical documentary production take?',
    a: 'Documentary timelines vary greatly depending on scope. A short-form branded documentary can be completed in 4–6 weeks. A feature documentary typically requires 6–18 months from development through delivery.',
  },
  {
    q: 'Do you work with clients outside Africa?',
    a: 'Absolutely. While we specialise in African stories and have production infrastructure across 5 African countries, we work with international clients worldwide and have produced content on four continents.',
  },
  {
    q: 'What information do you need to provide a quote?',
    a: 'We need to understand your project goals, target audience, desired deliverables, timeline, and approximate budget range. The more detail you can provide, the more accurate and useful our proposal will be.',
  },
];

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/dencastglobal', color: '#E1306C' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/dencastglobal', color: '#1877F2' },
  { icon: Twitter, label: 'Twitter/X', href: 'https://twitter.com/dencastglobal', color: '#1DA1F2' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/dencastglobal', color: '#0077B5' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@dencastglobal', color: '#FF0000' },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

interface FAQItemProps { q: string; a: string; index: number }

const FAQItem: React.FC<FAQItemProps> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      custom={index} variants={fadeUp}
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 pr-4">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} className="text-slate-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-slate-600 leading-relaxed text-sm">{a}</p>
      </motion.div>
    </motion.div>
  );
};

// ─── ContactPage ──────────────────────────────────────────────────────────────

const ContactPage: React.FC = () => {
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);

  const formInView = useInView(formRef, { once: true, margin: '-80px' });
  const infoInView = useInView(infoRef, { once: true, margin: '-80px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-80px' });

  return (
    <>
      <Helmet>
        <title>Contact Us | {SITE_NAME}</title>
        <meta name="description" content="Get in touch with Dencast Global — Africa's leading creative media production company. Let's create something extraordinary together." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative py-32 bg-[#0056A6] overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px), radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        {/* Red diagonal */}
        <div className="absolute top-0 right-0 w-1/3 h-full"
          style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(215,38,56,0.15) 50%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Contact</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-6"
          >
            Let's Create{' '}
            <span className="text-[#D72638]">Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/70 text-xl max-w-2xl mx-auto"
          >
            Have a project in mind? Ready to tell your story? We'd love to hear from you.
          </motion.p>

          {/* Quick stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 inline-flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20"
          >
            {[['24h', 'Response Time'], ['Free', 'Consultation'], ['20', 'Countries']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-white/60 text-xs mt-0.5">{lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main two-column layout ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* ── Left: Contact Form ── */}
            <motion.div
              ref={formRef}
              variants={stagger} initial="hidden" animate={formInView ? 'visible' : 'hidden'}
              className="lg:col-span-3"
            >
              <motion.div variants={fadeUp}>
                <SectionLabel label="Send a Message" />
                <h2 className="mt-4 text-3xl font-black text-slate-900 mb-2">
                  Tell Us About Your Project
                </h2>
                <p className="text-slate-500 mb-8">
                  Fill in the form below and one of our team members will get back to you within 24 hours.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <ContactForm />
              </motion.div>
            </motion.div>

            {/* ── Right: Contact Info ── */}
            <motion.div
              ref={infoRef}
              variants={stagger} initial="hidden" animate={infoInView ? 'visible' : 'hidden'}
              className="lg:col-span-2 space-y-6"
            >
              {/* Info card */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Get in Touch</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0056A6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-[#0056A6]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                      <a href="tel:++254721710397" className="text-slate-800 font-semibold hover:text-[#0056A6] transition-colors">
                        +254-721-710-397
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0056A6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-[#0056A6]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-800 font-semibold hover:text-[#0056A6] transition-colors">
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">WhatsApp</p>
                      <a
                        href="https://wa.me/+254721710397"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        <MessageCircle size={14} />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0056A6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-[#0056A6]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Office</p>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        ParkView Suites Nyerere<br />
                        Road Nairobi, Kenya
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0056A6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-[#0056A6]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Business Hours</p>
                      <p className="text-slate-700 text-sm">Monday – Friday: 8:00 AM – 6:00 PM GMT</p>
                      <p className="text-slate-500 text-xs mt-0.5">Saturday: 10:00 AM – 2:00 PM GMT</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Social links */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Follow Us</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank" rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:text-white transition-all duration-200 hover:scale-110"
                      style={{ '--hover-bg': color } as React.CSSProperties}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = color; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                    >
                      <Icon size={18} className="text-slate-600 hover:text-white" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Google Maps ── */}
      <section className="h-80 bg-slate-200 relative overflow-hidden">
        <iframe
          title="Dencast Global Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127340.50432752424!2d-0.26953855!3d5.6036988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* ── FAQ Section ── */}
      <section ref={faqRef} className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate={faqInView ? 'visible' : 'hidden'}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}><SectionLabel label="FAQ" center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-slate-500">
              Quick answers to common questions. Have more?{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0056A6] font-semibold hover:underline">
                Just ask us.
              </a>
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" animate={faqInView ? 'visible' : 'hidden'}
            className="space-y-4"
          >
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
