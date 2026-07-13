import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Save, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import db from '@/lib/db';
import { getHeroContent } from '@/services/supabase.service';
import { cn } from '@/utils/cn';
import type { HeroContent } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subheadline: z.string().optional(),
  description: z.string().optional(),
  background_video_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  background_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  cta_primary_text: z.string().optional(),
  cta_primary_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  cta_secondary_text: z.string().optional(),
  cta_secondary_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
});

type HeroForm = z.infer<typeof schema>;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />;
}

function FieldSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-24 mb-1.5" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManageHero() {
  const [saving, setSaving] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: heroResult, isLoading, refetch } = useQuery({
    queryKey: ['heroContent'],
    queryFn: getHeroContent,
  });

  const hero = heroResult?.data as (HeroContent & { description?: string }) | null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<HeroForm>({ resolver: zodResolver(schema) });

  const watchedVideoUrl = watch('background_video_url');

  useEffect(() => {
    if (hero) {
      reset({
        headline: hero.headline ?? '',
        subheadline: hero.subheadline ?? '',
        description: (hero as any).description ?? '',
        background_video_url: hero.background_video_url ?? '',
        background_image_url: hero.background_image_url ?? '',
        cta_primary_text: hero.cta_primary_text ?? '',
        cta_primary_url: hero.cta_primary_url ?? '',
        cta_secondary_text: hero.cta_secondary_text ?? '',
        cta_secondary_url: hero.cta_secondary_url ?? '',
      });
      setVideoPreview(hero.background_video_url ?? '');
    }
  }, [hero, reset]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVideoPreview(watchedVideoUrl ?? '');
    }, 800);
    return () => clearTimeout(timeout);
  }, [watchedVideoUrl]);

  const onSubmit = async (values: HeroForm) => {
    setSaving(true);
    try {
      if (hero?.id) {
        const { error } = await db
          .from('hero_content')
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq('id', hero.id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from('hero_content')
          .insert({ ...values, is_active: true });
        if (error) throw error;
      }
      await refetch();
      toast.success('Hero content saved!');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Hero Section</h2>
        <p className="text-sm text-gray-500 mt-0.5">Edit the homepage hero content, video, and call-to-action buttons.</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => <FieldSkeleton key={i} />)}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Main Content</h3>

            <Field label="Headline *" error={errors.headline?.message}>
              <input
                {...register('headline')}
                placeholder="Transform Your Digital Presence"
                className={inputClass(!!errors.headline)}
              />
            </Field>

            <Field label="Subheadline" error={errors.subheadline?.message}>
              <input
                {...register('subheadline')}
                placeholder="Award-Winning Creative Agency"
                className={inputClass(!!errors.subheadline)}
              />
            </Field>

            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="We create digital experiences that drive results..."
                className={inputClass(!!errors.description, true)}
              />
            </Field>
          </div>

          {/* Video & Image */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Background Media</h3>

            <Field label="Background Video URL" error={errors.background_video_url?.message}
              hint="MP4 or WebM. Leave blank to use image instead.">
              <div className="relative">
                <input
                  {...register('background_video_url')}
                  placeholder="https://example.com/hero.mp4"
                  className={inputClass(!!errors.background_video_url)}
                />
                {watchedVideoUrl && (
                  <a href={watchedVideoUrl} target="_blank" rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0056A6]">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </Field>

            {/* Video preview */}
            {videoPreview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                <video
                  ref={videoRef}
                  key={videoPreview}
                  src={videoPreview}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Video preview unavailable
                </video>
              </div>
            )}

            <Field label="Video Poster / Thumbnail URL" error={errors.background_image_url?.message}
              hint="Shown before the video loads, or as fallback.">
              <input
                {...register('background_image_url')}
                placeholder="https://example.com/poster.jpg"
                className={inputClass(!!errors.background_image_url)}
              />
            </Field>
          </div>

          {/* CTA Buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Call-to-Action Buttons</h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Primary Button</p>
                <Field label="Button Text" error={errors.cta_primary_text?.message}>
                  <input {...register('cta_primary_text')} placeholder="Get Started" className={inputClass(!!errors.cta_primary_text)} />
                </Field>
                <Field label="Button URL" error={errors.cta_primary_url?.message}>
                  <input {...register('cta_primary_url')} placeholder="/contact" className={inputClass(!!errors.cta_primary_url)} />
                </Field>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Secondary Button</p>
                <Field label="Button Text" error={errors.cta_secondary_text?.message}>
                  <input {...register('cta_secondary_text')} placeholder="View Our Work" className={inputClass(!!errors.cta_secondary_text)} />
                </Field>
                <Field label="Button URL" error={errors.cta_secondary_url?.message}>
                  <input {...register('cta_secondary_url')} placeholder="/portfolio" className={inputClass(!!errors.cta_secondary_url)} />
                </Field>
              </div>
            </div>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {isDirty ? (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle size={16} />
                You have unsaved changes
              </div>
            ) : (
              <p className="text-sm text-gray-400">All changes saved</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(error: boolean, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical min-h-[80px]'
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
