import React from 'react';
import { Film, Users, Globe, FolderOpen } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

// ─── Stats data ───────────────────────────────────────────────────────────────

const stats = [
  {
    value: '500',
    suffix: '+',
    label: 'Projects Completed',
    description: 'Across film, photography, branding, and events',
    icon: <FolderOpen size={22} />,
  },
  {
    value: '10',
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Serving clients since 2013 with unmatched quality',
    icon: <Film size={22} />,
  },
  {
    value: '200',
    suffix: '+',
    label: 'Happy Clients',
    description: 'From startups to Fortune 500 companies globally',
    icon: <Users size={22} />,
  },
  {
    value: '25',
    suffix: '+',
    label: 'Countries Reached',
    description: 'Global production experience across five continents',
    icon: <Globe size={22} />,
  },
];

// ─── Statistics ───────────────────────────────────────────────────────────────

const Statistics: React.FC = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* ── Diagonal accent shape ── */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#0056A6]/5"
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#D72638]/5"
        />
        {/* Diagonal stripe accent */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #0056A6, #0056A6 1px, transparent 1px, transparent 40px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Section heading ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D72638]" />
            <span className="inline-block w-8 h-0.5 bg-[#D72638] rounded-full" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#D72638]">
              By The Numbers
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0056A6] leading-tight">
            Our Impact in Numbers
          </h2>
          <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
            A decade of consistent excellence, measurable results, and stories that have shaped
            brands and moved audiences globally.
          </p>
        </div>

        {/* ── Counters grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#0056A6]/20 transition-all duration-300"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom tagline ── */}
        <div className="mt-14 text-center">
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Numbers don't tell the whole story —{' '}
            <span className="text-[#0056A6] font-semibold">ours do.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
