import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { getServiceCategories } from '@/services/supabase.service';
import { cn } from '@/utils/cn';
import type { Service, ServiceCategory } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphens only'),
  tagline: z.string().optional(),
  category_id: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  cover_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});

type ServiceForm = z.infer<typeof schema>;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#25408F]/30 focus:border-[#25408F]',
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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: Service | null;
  categories: ServiceCategory[];
  onSaved: () => void;
}

function ServiceModal({ open, onClose, editing, categories, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_featured: false, is_active: true, sort_order: 0 },
  });

  const nameValue = watch('name');

  useEffect(() => {
    if (!editing) setValue('slug', slugify(nameValue ?? ''));
  }, [nameValue, editing, setValue]);

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          name: editing.name,
          slug: editing.slug,
          tagline: editing.tagline ?? '',
          category_id: editing.category_id ?? '',
          description: editing.description ?? '',
          icon: editing.icon ?? '',
          cover_image_url: editing.cover_image_url ?? '',
          is_featured: editing.is_featured,
          is_active: true,
          sort_order: editing.sort_order,
        });
      } else {
        reset({ is_featured: false, is_active: true, sort_order: 0 });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: ServiceForm) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        category_id: values.category_id || null,
        cover_image_url: values.cover_image_url || null,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await db.from('services').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Service updated!');
      } else {
        const { error } = await db.from('services').insert(payload);
        if (error) throw error;
        toast.success('Service created!');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Service' : 'New Service'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *" error={errors.name?.message}>
              <input {...register('name')} placeholder="Service name" className={inputClass(!!errors.name)} />
            </Field>
            <Field label="Slug *" error={errors.slug?.message}>
              <input {...register('slug')} placeholder="service-name" className={inputClass(!!errors.slug)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select {...register('category_id')} className={inputClass()}>
                <option value="">— Select category —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Icon (name)">
              <input {...register('icon')} placeholder="e.g. Briefcase" className={inputClass()} />
            </Field>
          </div>
          <Field label="Tagline">
            <input {...register('tagline')} placeholder="Short tagline" className={inputClass()} />
          </Field>
          <Field label="Description">
            <textarea {...register('description')} rows={4} placeholder="Service description…" className={inputClass(false, true)} />
          </Field>
          <Field label="Cover Image URL" error={errors.cover_image_url?.message}>
            <input {...register('cover_image_url')} placeholder="https://…" className={inputClass(!!errors.cover_image_url)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" {...register('sort_order')} className={inputClass()} />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-[#25408F]" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-[#25408F]" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#25408F] text-white text-sm font-semibold hover:bg-[#1f3576] transition-colors disabled:opacity-70">
            {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageServices() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const { data: catResult } = useQuery({ queryKey: ['serviceCategories'], queryFn: getServiceCategories });
  const categories = catResult?.data ?? [];

  const { data: services, isLoading } = useQuery({
    queryKey: ['adminServices', search],
    queryFn: async () => {
      let q = supabase
        .from('services')
        .select('*, category:service_categories(*)')
        .order('sort_order', { ascending: true });
      if (search) q = q.ilike('name', `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`Delete service "${s.name}"?`)) return;
    const { error } = await db.from('services').delete().eq('id', s.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['adminServices'] });
  };

  const handleToggle = async (s: Service, field: 'is_featured') => {
    const { error } = await db.from('services').update({ [field]: !s[field] }).eq('id', s.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ['adminServices'] });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Services</h2>
          <p className="text-sm text-gray-500 mt-0.5">{services?.length ?? 0} services</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25408F] text-white text-sm font-semibold hover:bg-[#1f3576] transition-colors">
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#25408F]/30 focus:border-[#25408F] bg-gray-50" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Featured</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : (services ?? []).length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No services found</td></tr>
              ) : (
                (services ?? []).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#25408F]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#25408F]">{s.icon ? s.icon.charAt(0).toUpperCase() : s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400 hidden sm:block">{s.tagline ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500 font-mono text-xs">{s.slug}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{(s as any).category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggle(s, 'is_featured')}>
                        <Star size={18} className={cn(s.is_featured ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(s); setModalOpen(true); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#25408F] hover:bg-blue-50 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(s)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#D3232E] hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        categories={categories}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminServices'] })}
      />
    </div>
  );
}
