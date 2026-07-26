import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, X, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { Statistic } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.coerce.number().min(0, 'Value must be positive'),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type StatForm = z.infer<typeof schema>;

type StatWithDesc = Statistic & { description?: string };

function inputClass(error = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#25408F]/30 focus:border-[#25408F]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200'
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
  editing: StatWithDesc | null;
  onSaved: () => void;
}

function StatModal({ open, onClose, editing, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StatForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, sort_order: 0 },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          label: editing.label,
          value: editing.value,
          suffix: editing.suffix ?? '',
          prefix: editing.prefix ?? '',
          description: editing.description ?? '',
          sort_order: editing.sort_order,
          is_active: editing.is_active,
        });
      } else {
        reset({ is_active: true, sort_order: 0 });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: StatForm) => {
    setSaving(true);
    try {
      const payload = { ...values, suffix: values.suffix || null, prefix: values.prefix || null, updated_at: new Date().toISOString() };
      if (editing) {
        const { error } = await db.from('statistics').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Statistic updated!');
      } else {
        const { error } = await db.from('statistics').insert(payload);
        if (error) throw error;
        toast.success('Statistic created!');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Statistic' : 'New Statistic'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <Field label="Label *" error={errors.label?.message}>
            <input {...register('label')} placeholder="Projects Completed" className={inputClass(!!errors.label)} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Prefix">
              <input {...register('prefix')} placeholder="$" className={inputClass()} />
            </Field>
            <Field label="Value *" error={errors.value?.message}>
              <input type="number" {...register('value')} placeholder="500" className={inputClass(!!errors.value)} />
            </Field>
            <Field label="Suffix">
              <input {...register('suffix')} placeholder="+" className={inputClass()} />
            </Field>
          </div>
          <Field label="Description">
            <input {...register('description')} placeholder="Short description" className={inputClass()} />
          </Field>
          <Field label="Sort Order">
            <input type="number" {...register('sort_order')} className={inputClass()} />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-[#25408F]" />
            <span className="text-sm text-gray-700">Active (visible on site)</span>
          </label>
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

// ─── Inline edit card ─────────────────────────────────────────────────────────

interface StatCardProps {
  stat: StatWithDesc;
  onEdit: () => void;
}

function StatCard({ stat, onEdit }: StatCardProps) {
  const displayValue = `${stat.prefix ?? ''}${stat.value.toLocaleString()}${stat.suffix ?? ''}`;

  return (
    <div className={cn(
      'relative bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow',
      stat.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'
    )}>
      <button
        onClick={onEdit}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-[#25408F] hover:bg-blue-50 transition-colors"
      >
        <Pencil size={14} />
      </button>

      <div className="w-10 h-10 rounded-xl bg-[#25408F]/10 flex items-center justify-center mb-4">
        <TrendingUp size={20} className="text-[#25408F]" />
      </div>

      <p className="text-3xl font-bold text-gray-900 mb-1">{displayValue}</p>
      <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
      {stat.description && <p className="text-xs text-gray-400 mt-1">{stat.description}</p>}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <span className={cn(
          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
          stat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        )}>
          {stat.is_active ? 'Active' : 'Hidden'}
        </span>
        <span className="text-[10px] text-gray-400">Sort: {stat.sort_order}</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageStatistics() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StatWithDesc | null>(null);

  const { data: statistics, isLoading } = useQuery({
    queryKey: ['adminStatistics'],
    queryFn: async () => {
      const { data, error } = await supabase.from('statistics').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as StatWithDesc[];
    },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Homepage Statistics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Edit the stats shown on the homepage (e.g. "500+ Projects")</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25408F] text-white text-sm font-semibold hover:bg-[#1f3576] transition-colors">
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      {/* Preview banner */}
      <div className="bg-gradient-to-r from-[#25408F] to-[#1f3576] rounded-2xl p-5 mb-6 text-white">
        <p className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-3">Live Preview</p>
        {isLoading ? (
          <div className="flex gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-16 bg-white/20 rounded mb-1" />
                <div className="h-3 w-20 bg-white/20 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-8">
            {(statistics ?? []).filter((s) => s.is_active).map((s) => (
              <div key={s.id}>
                <p className="text-3xl font-bold text-white">
                  {s.prefix ?? ''}{s.value.toLocaleString()}{s.suffix ?? ''}
                </p>
                <p className="text-sm text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-6 h-40" />
          ))}
        </div>
      ) : (statistics ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <TrendingUp size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No statistics yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(statistics ?? []).map((s) => (
            <StatCard
              key={s.id}
              stat={s}
              onEdit={() => { setEditing(s); setModalOpen(true); }}
            />
          ))}
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#25408F]/50 hover:bg-blue-50/50 transition-colors text-gray-400 hover:text-[#25408F] gap-2"
          >
            <Plus size={24} />
            <span className="text-sm font-semibold">Add new</span>
          </button>
        </div>
      )}

      <StatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminStatistics'] })}
      />
    </div>
  );
}
