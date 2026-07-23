import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { Testimonial } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  client_name: z.string().min(1, 'Name is required'),
  client_title: z.string().optional(),
  client_company: z.string().optional(),
  client_avatar_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.coerce.number().min(1).max(5).default(5),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

type TestimonialForm = z.infer<typeof schema>;

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical min-h-[80px]'
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── Star Rating Display ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number | null }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(i < (rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')}
        />
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: Testimonial | null;
  onSaved: () => void;
}

function TestimonialModal({ open, onClose, editing, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TestimonialForm>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, is_featured: false, sort_order: 0 },
  });
  const ratingValue = watch('rating');

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          client_name: editing.client_name,
          client_title: editing.client_title ?? '',
          client_company: editing.client_company ?? '',
          client_avatar_url: editing.client_avatar_url ?? '',
          content: editing.content,
          rating: editing.rating ?? 5,
          is_featured: editing.is_featured,
          sort_order: editing.sort_order,
        });
      } else {
        reset({ rating: 5, is_featured: false, sort_order: 0 });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: TestimonialForm) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        client_avatar_url: values.client_avatar_url || null,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await db.from('testimonials').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Updated!');
      } else {
        const { error } = await db.from('testimonials').insert(payload);
        if (error) throw error;
        toast.success('Created!');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <Field label="Client Name *" error={errors.client_name?.message}>
            <input {...register('client_name')} placeholder="John Doe" className={inputClass(!!errors.client_name)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title / Position">
              <input {...register('client_title')} placeholder="CEO" className={inputClass()} />
            </Field>
            <Field label="Company">
              <input {...register('client_company')} placeholder="Acme Corp" className={inputClass()} />
            </Field>
          </div>
          <Field label="Client Image URL" error={errors.client_avatar_url?.message}>
            <input {...register('client_avatar_url')} placeholder="https://..." className={inputClass(!!errors.client_avatar_url)} />
          </Field>
          <Field label="Testimonial Content *" error={errors.content?.message}>
            <textarea {...register('content')} rows={4} placeholder="What they said…" className={inputClass(!!errors.content, true)} />
          </Field>
          <Field label="Rating (1–5)" error={errors.rating?.message}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} step={1} {...register('rating')} className="flex-1 accent-[#0056A6]" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-900">{ratingValue}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={cn(i < Number(ratingValue) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                  ))}
                </div>
              </div>
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" {...register('sort_order')} className={inputClass()} />
            </Field>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-[#0056A6]" />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70">
            {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageTestimonials() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Delete testimonial from "${t.client_name}"?`)) return;
    const { error } = await db.from('testimonials').delete().eq('id', t.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['adminTestimonials'] });
  };

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-sm text-gray-500 mt-0.5">{testimonials?.length ?? 0} testimonials</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : testimonials?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No testimonials yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(testimonials ?? []).map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.client_avatar_url ? (
                    <img src={t.client_avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0056A6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {initials(t.client_name)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.client_name}</p>
                    <p className="text-xs text-gray-400">
                      {[t.client_title, t.client_company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
                {t.is_featured && (
                  <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>
              <StarRating rating={t.rating} />
              <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { setEditing(t); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#0056A6] hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#D72638] hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminTestimonials'] })}
      />
    </div>
  );
}
