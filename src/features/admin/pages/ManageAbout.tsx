import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { SiteSettings } from '@/types';

function isJsonArray(value: string): boolean {
  if (!value.trim()) return false;
  try {
    return Array.isArray(JSON.parse(value));
  } catch {
    return false;
  }
}

const schema = z.object({
  about_hero_background_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  about_hero_title: z.string().min(1, 'Hero title is required'),
  about_hero_subtitle: z.string().optional(),

  about_mission_title: z.string().min(1, 'Mission title is required'),
  about_mission_body: z.string().min(1, 'Mission body is required'),

  about_story_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  about_story_title: z.string().min(1, 'Story title is required'),
  about_story_body: z.string().min(1, 'Story body is required'),

  about_core_values_title: z.string().min(1, 'Core values title is required'),
  about_core_values_subtitle: z.string().min(1, 'Core values subtitle is required'),
  about_core_values_json: z
    .string()
    .min(2, 'Core values JSON is required')
    .refine(isJsonArray, 'Must be a valid JSON array'),

  about_team_title: z.string().min(1, 'Team title is required'),
  about_team_subtitle: z.string().min(1, 'Team subtitle is required'),

  about_timeline_title: z.string().min(1, 'Timeline title is required'),
  about_timeline_json: z
    .string()
    .min(2, 'Timeline JSON is required')
    .refine(isJsonArray, 'Must be a valid JSON array'),

  about_clients_title: z.string().min(1, 'Clients title is required'),

  about_cta_label: z.string().min(1, 'CTA label is required'),
  about_cta_title: z.string().min(1, 'CTA title is required'),
  about_cta_body: z.string().min(1, 'CTA body is required'),
});

type AboutForm = z.infer<typeof schema>;

const DEFAULT_CORE_VALUES = JSON.stringify(
  [
    {
      title: 'Creativity',
      description:
        'We push creative boundaries to produce media that surprises, moves, and resonates deeply with every audience.',
    },
    {
      title: 'Excellence',
      description:
        'From pre-production planning to final delivery, we hold ourselves to the highest industry standards in every project.',
    },
    {
      title: 'Integrity',
      description:
        'Honest storytelling and transparent partnerships form the bedrock of everything we create and every relationship we build.',
    },
    {
      title: 'Innovation',
      description:
        'We embrace emerging technologies and bold ideas to stay ahead of the curve.',
    },
    {
      title: 'Collaboration',
      description:
        'Great stories emerge from great partnerships. We work closely with clients, talent, and communities.',
    },
    {
      title: 'Impact',
      description:
        'Every frame we craft is engineered to spark conversation and drive outcomes for our clients.',
    },
  ],
  null,
  2
);

const DEFAULT_TIMELINE = JSON.stringify(
  [
    {
      year: '2021',
      title: 'A Journey Rooted in Excellence',
      desc: 'Machio co-founded Michezo Afrika and later launched Bungoma Pictures, building a foundation in powerful visual storytelling.',
    },
    {
      year: '2022',
      title: 'The Evolution: Dencast Global',
      desc: 'Bungoma Pictures evolved into Dencast Global, expanding into full-scale production and creative media services.',
    },
    {
      year: 'Currently',
      title: 'A Legacy of Trust and Excellence',
      desc: 'Dencast Global continues creating high-impact productions for brands across Africa and beyond.',
    },
  ],
  null,
  2
);

const DEFAULTS: AboutForm = {
  about_hero_background_image_url: '/dencast_images/CREW.jpg',
  about_hero_title: 'About Dencast Global',
  about_hero_subtitle:
    "Africa's premier creative media production house, telling stories that transcend borders, cultures, and generations.",

  about_mission_title: 'We believe every story deserves to be told with cinematic power.',
  about_mission_body:
    "Dencast Global was born from the conviction that Africa's narratives are among the most compelling on earth and the most underrepresented. Through documentary, brand storytelling, live production, and digital content, we give voice to stories that deserve a world-class platform.",

  about_story_image_url: '/dencast_images/9-scaled.jpg',
  about_story_title: 'A Vision Built on Storytelling Excellence',
  about_story_body:
    'At the heart of Dencast Global is a passion for storytelling. Founded by Dennis Machio, Dencast Global is built on years of dedication to cinematic craft and narrative impact.',

  about_core_values_title: 'What We Stand For',
  about_core_values_subtitle:
    'Six principles that guide every decision, every frame, and every partnership at Dencast Global.',
  about_core_values_json: DEFAULT_CORE_VALUES,

  about_team_title: 'Meet the Storytellers',
  about_team_subtitle:
    'A passionate collective of filmmakers, strategists, and creatives united by a love of powerful storytelling.',

  about_timeline_title: 'A Legacy of Excellence in Visual Storytelling',
  about_timeline_json: DEFAULT_TIMELINE,

  about_clients_title: "Trusted by Africa's Best",

  about_cta_label: 'Get Involved',
  about_cta_title: 'Join Our Story',
  about_cta_body:
    "Whether you're a brand with a vision, a storyteller with a script, or an investor who believes in the power of African media, there's a place for you in this story.",
};

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical min-h-[90px]'
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}

export default function ManageAbout() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: settingsResult, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return (data ?? []) as SiteSettings[];
    },
  });

  const settingsMap = useMemo(() => {
    const map: Record<string, string> = {};
    (settingsResult ?? []).forEach((s) => {
      map[s.key] = String(s.value ?? '');
    });
    return map;
  }, [settingsResult]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AboutForm>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (!settingsResult) return;

    reset({
      about_hero_background_image_url:
        settingsMap.about_hero_background_image_url || DEFAULTS.about_hero_background_image_url,
      about_hero_title: settingsMap.about_hero_title || DEFAULTS.about_hero_title,
      about_hero_subtitle: settingsMap.about_hero_subtitle || DEFAULTS.about_hero_subtitle,

      about_mission_title: settingsMap.about_mission_title || DEFAULTS.about_mission_title,
      about_mission_body: settingsMap.about_mission_body || DEFAULTS.about_mission_body,

      about_story_image_url: settingsMap.about_story_image_url || DEFAULTS.about_story_image_url,
      about_story_title: settingsMap.about_story_title || DEFAULTS.about_story_title,
      about_story_body: settingsMap.about_story_body || DEFAULTS.about_story_body,

      about_core_values_title: settingsMap.about_core_values_title || DEFAULTS.about_core_values_title,
      about_core_values_subtitle:
        settingsMap.about_core_values_subtitle || DEFAULTS.about_core_values_subtitle,
      about_core_values_json: settingsMap.about_core_values_json || DEFAULTS.about_core_values_json,

      about_team_title: settingsMap.about_team_title || DEFAULTS.about_team_title,
      about_team_subtitle: settingsMap.about_team_subtitle || DEFAULTS.about_team_subtitle,

      about_timeline_title: settingsMap.about_timeline_title || DEFAULTS.about_timeline_title,
      about_timeline_json: settingsMap.about_timeline_json || DEFAULTS.about_timeline_json,

      about_clients_title: settingsMap.about_clients_title || DEFAULTS.about_clients_title,

      about_cta_label: settingsMap.about_cta_label || DEFAULTS.about_cta_label,
      about_cta_title: settingsMap.about_cta_title || DEFAULTS.about_cta_title,
      about_cta_body: settingsMap.about_cta_body || DEFAULTS.about_cta_body,
    });
  }, [settingsResult, settingsMap, reset]);

  const onSubmit = async (values: AboutForm) => {
    setSaving(true);
    try {
      const entries = Object.entries(values).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const entry of entries) {
        const { error } = await db.from('site_settings').upsert(entry, { onConflict: 'key' });
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('About content saved!');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-6 h-44" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">About Us Content</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage About page text, images, and section data from backend settings.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Hero Section">
          <Field
            label="Background Image URL"
            error={errors.about_hero_background_image_url?.message}
            hint="Use full URL or public path like /dencast_images/CREW.jpg"
          >
            <input
              {...register('about_hero_background_image_url')}
              className={inputClass(!!errors.about_hero_background_image_url)}
            />
          </Field>
          <Field label="Title" error={errors.about_hero_title?.message}>
            <input {...register('about_hero_title')} className={inputClass(!!errors.about_hero_title)} />
          </Field>
          <Field label="Subtitle" error={errors.about_hero_subtitle?.message}>
            <textarea
              {...register('about_hero_subtitle')}
              rows={3}
              className={inputClass(!!errors.about_hero_subtitle, true)}
            />
          </Field>
        </Section>

        <Section title="Mission Section">
          <Field label="Mission Title" error={errors.about_mission_title?.message}>
            <input {...register('about_mission_title')} className={inputClass(!!errors.about_mission_title)} />
          </Field>
          <Field label="Mission Body" error={errors.about_mission_body?.message}>
            <textarea
              {...register('about_mission_body')}
              rows={5}
              className={inputClass(!!errors.about_mission_body, true)}
            />
          </Field>
        </Section>

        <Section title="Our Story Section">
          <Field
            label="Story Image URL"
            error={errors.about_story_image_url?.message}
            hint="Use full URL or public path like /dencast_images/9-scaled.jpg"
          >
            <input {...register('about_story_image_url')} className={inputClass(!!errors.about_story_image_url)} />
          </Field>
          <Field label="Story Title" error={errors.about_story_title?.message}>
            <input {...register('about_story_title')} className={inputClass(!!errors.about_story_title)} />
          </Field>
          <Field
            label="Story Body"
            error={errors.about_story_body?.message}
            hint="Use blank lines to create multiple paragraphs on the page."
          >
            <textarea
              {...register('about_story_body')}
              rows={6}
              className={inputClass(!!errors.about_story_body, true)}
            />
          </Field>
        </Section>

        <Section title="Core Values Section">
          <Field label="Section Title" error={errors.about_core_values_title?.message}>
            <input
              {...register('about_core_values_title')}
              className={inputClass(!!errors.about_core_values_title)}
            />
          </Field>
          <Field label="Section Subtitle" error={errors.about_core_values_subtitle?.message}>
            <textarea
              {...register('about_core_values_subtitle')}
              rows={3}
              className={inputClass(!!errors.about_core_values_subtitle, true)}
            />
          </Field>
          <Field
            label="Core Values JSON"
            error={errors.about_core_values_json?.message}
            hint="JSON array. Each item should include title and description."
          >
            <textarea
              {...register('about_core_values_json')}
              rows={12}
              className={inputClass(!!errors.about_core_values_json, true)}
            />
          </Field>
        </Section>

        <Section title="Team Section">
          <Field label="Section Title" error={errors.about_team_title?.message}>
            <input {...register('about_team_title')} className={inputClass(!!errors.about_team_title)} />
          </Field>
          <Field label="Section Subtitle" error={errors.about_team_subtitle?.message}>
            <textarea
              {...register('about_team_subtitle')}
              rows={3}
              className={inputClass(!!errors.about_team_subtitle, true)}
            />
          </Field>
        </Section>

        <Section title="Timeline Section">
          <Field label="Section Title" error={errors.about_timeline_title?.message}>
            <input {...register('about_timeline_title')} className={inputClass(!!errors.about_timeline_title)} />
          </Field>
          <Field
            label="Timeline JSON"
            error={errors.about_timeline_json?.message}
            hint="JSON array. Each item should include year, title, and desc."
          >
            <textarea
              {...register('about_timeline_json')}
              rows={10}
              className={inputClass(!!errors.about_timeline_json, true)}
            />
          </Field>
        </Section>

        <Section title="Clients & CTA Section">
          <Field label="Clients Section Title" error={errors.about_clients_title?.message}>
            <input {...register('about_clients_title')} className={inputClass(!!errors.about_clients_title)} />
          </Field>
          <Field label="CTA Label" error={errors.about_cta_label?.message}>
            <input {...register('about_cta_label')} className={inputClass(!!errors.about_cta_label)} />
          </Field>
          <Field label="CTA Title" error={errors.about_cta_title?.message}>
            <input {...register('about_cta_title')} className={inputClass(!!errors.about_cta_title)} />
          </Field>
          <Field label="CTA Body" error={errors.about_cta_body?.message}>
            <textarea
              {...register('about_cta_body')}
              rows={4}
              className={inputClass(!!errors.about_cta_body, true)}
            />
          </Field>
        </Section>

        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {isDirty ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertCircle size={16} /> Unsaved changes
            </div>
          ) : (
            <p className="text-sm text-gray-400">All changes saved</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
