import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

// ─── Contact items ────────────────────────────────────────────────────────────

const contactItems = [
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+254 721 710 397',
    href: 'tel:+254721710397',
    color: '#0056A6',
    sublabel: 'Mon – Fri, 8am – 6pm EAT',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@dencastglobal.co.ke',
    href: 'mailto:info@dencastglobal.co.ke',
    color: '#D72638',
    sublabel: 'We respond within 24 hours',
  },
  {
    icon: MapPin,
    label: 'Our Location',
    value: 'Nairobi, Kenya',
    href: 'https://maps.google.com/?q=Nairobi+Kenya',
    color: '#0056A6',
    sublabel: 'Kenya ParkView Suites Nyerere Road Nairobi.',
  },
];

// ─── ContactPreview ───────────────────────────────────────────────────────────

const ContactPreview: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactItems.map(({ icon: Icon, label, value, href, color, sublabel }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(0,0,0,0.1)' }}
              className="group flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-[#0056A6]/20 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 w-13 h-13 w-14 h-14 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={24} style={{ color }} />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  {label}
                </p>
                <p
                  className="font-bold text-slate-800 text-sm truncate group-hover:transition-colors duration-200"
                  style={{ ['--hover-color' as string]: color }}
                >
                  <span className="group-hover:text-[#0056A6] transition-colors duration-200">
                    {value}
                  </span>
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{sublabel}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;
