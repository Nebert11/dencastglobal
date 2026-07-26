import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { SeoMetadata } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  canonical_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  robots: z.string().optional(),
  keywords: z.string().optional(),
});

type SeoForm = z.infer<typeof schema>;

// ─── Page list ────────────────────────────────────────────────────────────────

const PAGES = [
  { slug: 'home', label: 'Home' },
  { slug: 'about', label: 'About' },
  { slug: 'services', label: 'Services' },
  { slug: 'portfolio', label: 'Portfolio' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'team', label: 'Team' },
  { slug: 'faq', label: 'FAQ' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#25408F]/30 focus:border-[#25408F]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical'
  );
}

function Field({ label, error, children, hint, charCount, charMax }: {
  label: string; error?: string; children: React.ReactNode; hint?: string; charCount?: number; charMax?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {charCount !== undefined && charMax !== undefined && (
          <span className={cn('text-xs font-medium', charCount > charMax ? 'text-red-500' : charCount > charMax * 0.85 ? 'text-amber-500' : 'text-gray-400')}>
            {charCount}/{charMax}
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function seoScore(meta: SeoMetadata | undefined): number {
  if (!meta) return 0;
  let score = 0;
  if (meta.title) score += 30;
  if (meta.description) score += 30;
  if (meta.og_image_url) score += 20;
  if (meta.keywords?.length) score += 10;
  if (meta.canonical_url) score += 10;
  return score;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageSEO() {
  const qc = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: allMeta } = useQuery({
    queryKey: ['adminSeoAll'],
    queryFn: async () => {
      const { data, error } = await supabase.from('seo_metadata').select('*');
      if (error) throw error;
      return (data ?? []) as SeoMetadata[];
    },
  });

  const metaMap = Object.fromEntries((allMeta ?? []).map((m) => [m.page_slug, m]));

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<SeoForm>({
    resolver: zodResolver(schema),
  });

  const titleValue = watch('title') ?? '';
  const descValue = watch('description') ?? '';

  useEffect(() => {
    if (selectedPage) {
      const existing = metaMap[selectedPage];
      reset({
        title: existing?.title ?? '',
        description: existing?.description ?? '',
        og_title: (existing as any)?.og_title ?? '',
        og_description: (existing as any)?.og_description ?? '',
        og_image_url: existing?.og_image_url ?? '',
        canonical_url: existing?.canonical_url ?? '',
        robots: (existing as any)?.robots ?? 'index, follow',
        keywords: existing?.keywords?.join(', ') ?? '',
      });
    }
  }, [selectedPage]);

  const onSubmit = async (values: SeoForm) => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const payload = {
        page_slug: selectedPage,
        title: values.title || null,
        description: values.description || null,
        og_image_url: values.og_image_url || null,
        canonical_url: values.canonical_url || null,
        keywords: values.keywords ? values.keywords.split(',').map((k) => k.trim()).filter(Boolean) : null,
        updated_at: new Date().toISOString(),
      };

      const existing = metaMap[selectedPage];
      if (existing) {
        const { error } = await db.from('seo_metadata').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await db.from('seo_metadata').insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ['adminSeoAll'] });
      toast.success('SEO settings saved!');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage meta tags and open graph settings for each page.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Page list */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pages</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {PAGES.map((page) => {
                const meta = metaMap[page.slug];
                const score = seoScore(meta);
                return (
                  <li key={page.slug}>
                    <button
                      onClick={() => setSelectedPage(page.slug)}
                      className={cn(
                        'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3',
                        selectedPage === page.slug && 'bg-blue-50 border-l-2 border-l-[#25408F]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe size={15} className={cn(selectedPage === page.slug ? 'text-[#25408F]' : 'text-gray-400')} />
                        <div>
                          <p className={cn('text-sm font-semibold', selectedPage === page.slug ? 'text-[#25408F]' : 'text-gray-700')}>
                            {page.label}
                          </p>
                          <p className="text-[10px] text-gray-400">/{page.slug}</p>
                        </div>
                      </div>
                      {meta ? (
                        score >= 70 ? (
                          <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle size={15} className="text-amber-500 flex-shrink-0" />
                        )
                      ) : (
                        <XCircle size={15} className="text-gray-300 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Edit form */}
        {selectedPage ? (
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">
                  SEO — {PAGES.find((p) => p.slug === selectedPage)?.label}
                </h3>

                <Field label="Meta Title" charCount={titleValue.length} charMax={60}
                  hint="Recommended: 50–60 characters" error={errors.title?.message}>
                  <input {...register('title')} placeholder="Page title for search engines" className={inputClass(!!errors.title)} />
                </Field>

                <Field label="Meta Description" charCount={descValue.length} charMax={160}
                  hint="Recommended: 150–160 characters" error={errors.description?.message}>
                  <textarea {...register('description')} rows={3}
                    placeholder="Brief description shown in search results…"
                    className={inputClass(!!errors.description, true)}
                    style={{ minHeight: 72 }}
                  />
                </Field>

                <Field label="Keywords" hint="Comma-separated keywords">
                  <input {...register('keywords')} placeholder="seo, marketing, design…" className={inputClass()} />
                </Field>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Open Graph</h3>

                <Field label="OG Title">
                  <input {...register('og_title')} placeholder="Overrides meta title for social sharing" className={inputClass()} />
                </Field>

                <Field label="OG Description">
                  <textarea {...register('og_description')} rows={2}
                    placeholder="Overrides meta description for social sharing"
                    className={inputClass(false, true)} style={{ minHeight: 64 }}
                  />
                </Field>

                <Field label="OG Image URL" error={errors.og_image_url?.message}>
                  <input {...register('og_image_url')} placeholder="https://…/og-image.jpg (1200x630 recommended)" className={inputClass(!!errors.og_image_url)} />
                </Field>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Advanced</h3>

                <Field label="Canonical URL" error={errors.canonical_url?.message}>
                  <input {...register('canonical_url')} placeholder="https://dencastglobal.com/page" className={inputClass(!!errors.canonical_url)} />
                </Field>

                <Field label="Robots" hint='e.g. "index, follow" or "noindex, nofollow"'>
                  <select {...register('robots')} className={inputClass()}>
                    <option value="index, follow">index, follow (default)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </Field>
              </div>

              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {isDirty ? (
                  <div className="flex items-center gap-2 text-amber-600 text-sm"><AlertCircle size={16} /> Unsaved changes</div>
                ) : (
                  <p className="text-sm text-gray-400">All changes saved</p>
                )}
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25408F] text-white text-sm font-semibold hover:bg-[#1f3576] transition-colors disabled:opacity-70">
                  <Save size={16} /> {saving ? 'Saving…' : 'Save SEO'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
            <div className="text-center py-16">
              <Globe size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Select a page to edit its SEO settings</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
