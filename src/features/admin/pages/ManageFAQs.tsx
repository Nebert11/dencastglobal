import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { FAQ } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FAQForm = z.infer<typeof schema>;

type FAQWithCategory = FAQ & { category?: string };

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical min-h-[100px]'
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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: FAQWithCategory | null;
  categories: string[];
  onSaved: () => void;
  maxOrder: number;
}

function FAQModal({ open, onClose, editing, categories, onSaved, maxOrder }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FAQForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, sort_order: maxOrder + 1 },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          question: editing.question,
          answer: editing.answer,
          category: (editing as any).category ?? '',
          sort_order: editing.sort_order,
          is_active: editing.is_active,
        });
      } else {
        reset({ is_active: true, sort_order: maxOrder + 1 });
      }
    }
  }, [open, editing, reset, maxOrder]);

  const onSubmit = async (values: FAQForm) => {
    setSaving(true);
    try {
      const payload = { ...values, updated_at: new Date().toISOString() };
      if (editing) {
        const { error } = await db.from('faqs').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('FAQ updated!');
      } else {
        const { error } = await db.from('faqs').insert(payload);
        if (error) throw error;
        toast.success('FAQ created!');
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
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit FAQ' : 'New FAQ'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <Field label="Question *" error={errors.question?.message}>
            <input {...register('question')} placeholder="Frequently asked question" className={inputClass(!!errors.question)} />
          </Field>
          <Field label="Answer *" error={errors.answer?.message}>
            <textarea {...register('answer')} rows={5} placeholder="Detailed answer…" className={inputClass(!!errors.answer, true)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <input {...register('category')} placeholder="General, Pricing, etc." list="faq-categories" className={inputClass()} />
              <datalist id="faq-categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="Sort Order">
              <input type="number" {...register('sort_order')} className={inputClass()} />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-[#0056A6]" />
            <span className="text-sm text-gray-700">Active (visible on site)</span>
          </label>
        </form>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70">
            {saving ? 'Saving…' : editing ? 'Update' : 'Create FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

interface FAQItemProps {
  faq: FAQWithCategory;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function FAQItem({ faq, index, total, onEdit, onDelete, onMoveUp, onMoveDown }: FAQItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn('bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md', faq.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60')}>
      <div className="flex items-start gap-3 p-4">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
          <button onClick={onMoveUp} disabled={index === 0}
            className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors">
            <ChevronUp size={16} />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors">
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {faq.category && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0056A6]/10 text-[#0056A6] mb-1.5">
                  {faq.category}
                </span>
              )}
              <button onClick={() => setExpanded((e) => !e)} className="w-full text-left">
                <p className="font-semibold text-gray-900 text-sm leading-relaxed">{faq.question}</p>
              </button>
              {expanded && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!faq.is_active && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">Hidden</span>
              )}
              <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0056A6] hover:bg-blue-50 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-[#D72638] hover:bg-red-50 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageFAQs() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQWithCategory | null>(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['adminFAQs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as FAQWithCategory[];
    },
  });

  const categories = [...new Set((faqs ?? []).map((f) => f.category).filter(Boolean) as string[])];
  const maxOrder = Math.max(0, ...(faqs ?? []).map((f) => f.sort_order));

  // Group by category
  const grouped: Record<string, FAQWithCategory[]> = {};
  (faqs ?? []).forEach((faq) => {
    const cat = faq.category ?? 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(faq);
  });

  const handleDelete = async (faq: FAQWithCategory) => {
    if (!window.confirm(`Delete this FAQ?`)) return;
    const { error } = await db.from('faqs').delete().eq('id', faq.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['adminFAQs'] });
  };

  const handleMove = async (faq: FAQWithCategory, direction: 'up' | 'down') => {
    const list = faqs ?? [];
    const idx = list.findIndex((f) => f.id === faq.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    const swapFaq = list[swapIdx];
    await Promise.all([
      db.from('faqs').update({ sort_order: swapFaq.sort_order }).eq('id', faq.id),
      db.from('faqs').update({ sort_order: faq.sort_order }).eq('id', swapFaq.id),
    ]);
    qc.invalidateQueries({ queryKey: ['adminFAQs'] });
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">FAQs</h2>
          <p className="text-sm text-gray-500 mt-0.5">{faqs?.length ?? 0} questions</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : Object.entries(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">No FAQs yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{category}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((faq, idx) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    index={idx}
                    total={items.length}
                    onEdit={() => { setEditing(faq); setModalOpen(true); }}
                    onDelete={() => handleDelete(faq)}
                    onMoveUp={() => handleMove(faq, 'up')}
                    onMoveDown={() => handleMove(faq, 'down')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <FAQModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        categories={categories}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminFAQs'] })}
        maxOrder={maxOrder}
      />
    </div>
  );
}
