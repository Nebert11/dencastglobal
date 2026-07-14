import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, AlertCircle, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { SiteSettings, SocialLink } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical min-h-[80px]'
  );
}

function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
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

// ─── Settings form schema ─────────────────────────────────────────────────────

const settingsSchema = z.object({
  site_name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  contact_email: z.string().email('Enter a valid email').or(z.literal('')).optional(),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  whatsapp_number: z.string().optional(),
  google_maps_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  business_hours: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

// ─── Social link row ──────────────────────────────────────────────────────────

interface SocialRowProps {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
  onToggle: (link: SocialLink) => void;
}

function SocialRow({ link, onEdit, onDelete, onToggle }: SocialRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
      <div className="w-8 h-8 rounded-lg bg-[#0056A6]/10 flex items-center justify-center flex-shrink-0">
        <Link2 size={14} className="text-[#0056A6]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 capitalize">{link.platform}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 truncate block hover:text-[#0056A6]">{link.url}</a>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onToggle(link)}
          className={cn('text-xs px-2 py-0.5 rounded-full font-semibold transition-colors', link.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}
        >
          {link.is_active ? 'Active' : 'Inactive'}
        </button>
        <button onClick={() => onEdit(link)} className="p-1.5 text-gray-400 hover:text-[#0056A6] hover:bg-blue-50 rounded-lg transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
        <button onClick={() => onDelete(link.id)} className="p-1.5 text-gray-400 hover:text-[#D72638] hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageSiteSettings() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [addingSocial, setAddingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  const { data: settingsResult, isLoading: loadingSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return (data ?? []) as SiteSettings[];
    },
  });

  const { data: socialLinks, isLoading: loadingSocial } = useQuery({
    queryKey: ['adminSocialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_links').select('*').order('sort_order');
      if (error) throw error;
      return (data ?? []) as SocialLink[];
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  // Build form from key-value settings
  useEffect(() => {
    if (settingsResult) {
      const map: Record<string, string> = {};
      settingsResult.forEach((s) => { map[s.key] = String(s.value ?? ''); });
      reset({
        site_name: map['site_name'] ?? 'Dencast Global',
        tagline: map['tagline'] ?? '',
        description: map['description'] ?? '',
        contact_email: map['contact_email'] ?? '',
        contact_phone: map['contact_phone'] ?? '',
        contact_address: map['contact_address'] ?? '',
        whatsapp_number: map['whatsapp_number'] ?? '',
        google_maps_url: map['google_maps_url'] ?? '',
        business_hours: map['business_hours'] ?? '',
      });
    }
  }, [settingsResult, reset]);

  const onSubmit = async (values: SettingsForm) => {
    setSaving(true);
    try {
      const entries = Object.entries(values).map(([key, value]) => ({ key, value: value ?? '' }));
      for (const entry of entries) {
        await db
          .from('site_settings')
          .upsert({ key: entry.key, value: entry.value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      }
      await qc.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Settings saved!');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = async () => {
    if (!newSocial.platform || !newSocial.url) { toast.error('Fill platform and URL'); return; }
    const { error } = await db.from('social_links').insert({
      platform: newSocial.platform,
      url: newSocial.url,
      is_active: true,
      sort_order: (socialLinks?.length ?? 0) + 1,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Social link added');
    setNewSocial({ platform: '', url: '' });
    setAddingSocial(false);
    qc.invalidateQueries({ queryKey: ['adminSocialLinks'] });
  };

  const handleDeleteSocial = async (id: string) => {
    if (!window.confirm('Delete this social link?')) return;
    await db.from('social_links').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['adminSocialLinks'] });
    toast.success('Deleted');
  };

  const handleToggleSocial = async (link: SocialLink) => {
    await db.from('social_links').update({ is_active: !link.is_active }).eq('id', link.id);
    qc.invalidateQueries({ queryKey: ['adminSocialLinks'] });
  };

  const handleEditSocial = async () => {
    if (!editingSocial) return;
    const { error } = await db.from('social_links').update({ platform: editingSocial.platform, url: editingSocial.url }).eq('id', editingSocial.id);
    if (error) { toast.error(error.message); return; }
    setEditingSocial(null);
    qc.invalidateQueries({ queryKey: ['adminSocialLinks'] });
    toast.success('Updated');
  };

  if (loadingSettings) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-6 h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure your website's global settings.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="General">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Site Name *" error={errors.site_name?.message}>
              <input {...register('site_name')} className={inputClass(!!errors.site_name)} />
            </Field>
            <Field label="Tagline">
              <input {...register('tagline')} placeholder="Your creative partner" className={inputClass()} />
            </Field>
          </div>
          <Field label="Description">
            <textarea {...register('description')} rows={3} placeholder="Brief site description…" className={inputClass(false, true)} />
          </Field>
        </Section>

        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Contact Email" error={errors.contact_email?.message}>
              <input {...register('contact_email')} placeholder="info@dencastglobal.co.ke" className={inputClass(!!errors.contact_email)} />
            </Field>
            <Field label="Contact Phone">
              <input {...register('contact_phone')} placeholder="+254-721-710-3970" className={inputClass()} />
            </Field>
            <Field label="WhatsApp Number">
              <input {...register('whatsapp_number')} placeholder="+1234567890 (E.164 format)" className={inputClass()} />
            </Field>
          </div>
          <Field label="Address">
            <textarea {...register('contact_address')} rows={2} placeholder="123 Main Street, City, Country" className={inputClass(false, true)} style={{ minHeight: 60 }} />
          </Field>
        </Section>

        <Section title="Location & Hours">
          <Field label="Google Maps Embed URL" error={errors.google_maps_url?.message}>
            <input {...register('google_maps_url')} placeholder="https://maps.google.com/…" className={inputClass(!!errors.google_maps_url)} />
          </Field>
          <Field label="Business Hours">
            <textarea {...register('business_hours')} rows={3} placeholder="Mon-Fri: 9am–6pm&#10;Sat: 10am–4pm&#10;Sun: Closed" className={inputClass(false, true)} />
          </Field>
        </Section>

        {/* Save */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {isDirty ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertCircle size={16} /> Unsaved changes
            </div>
          ) : (
            <p className="text-sm text-gray-400">All changes saved</p>
          )}
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Social Links */}
      <Section title="Social Links">
        {loadingSocial ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 animate-pulse bg-gray-100 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {(socialLinks ?? []).map((link) =>
              editingSocial?.id === link.id ? (
                <div key={link.id} className="flex gap-2 p-3 rounded-xl border border-[#0056A6]/30 bg-blue-50">
                  <input
                    value={editingSocial.platform}
                    onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none"
                    placeholder="Platform"
                  />
                  <input
                    value={editingSocial.url}
                    onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                    className="flex-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none"
                    placeholder="URL"
                  />
                  <button onClick={handleEditSocial} className="px-3 py-1.5 rounded-lg bg-[#0056A6] text-white text-xs font-semibold">Save</button>
                  <button onClick={() => setEditingSocial(null)} className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold">Cancel</button>
                </div>
              ) : (
                <SocialRow
                  key={link.id}
                  link={link}
                  onEdit={setEditingSocial}
                  onDelete={handleDeleteSocial}
                  onToggle={handleToggleSocial}
                />
              )
            )}

            {addingSocial ? (
              <div className="flex gap-2 mt-2">
                <input
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                  placeholder="Platform (e.g. Instagram)"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30"
                />
                <input
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  placeholder="https://…"
                  className="flex-2 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30"
                />
                <button onClick={handleAddSocial} className="px-4 py-2 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f]">Add</button>
                <button onClick={() => setAddingSocial(false)} className="px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setAddingSocial(true)}
                className="flex items-center gap-2 mt-2 text-sm font-semibold text-[#0056A6] hover:underline">
                <Plus size={15} /> Add Social Link
              </button>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
