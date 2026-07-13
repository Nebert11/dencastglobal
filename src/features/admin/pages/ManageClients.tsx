import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, ExternalLink, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { Client } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  logo_url: z.string().url('Enter a valid URL'),
  website_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  industry: z.string().optional(),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

type ClientForm = z.infer<typeof schema>;

function inputClass(error = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
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
  editing: Client | null;
  onSaved: () => void;
}

function ClientModal({ open, onClose, editing, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ClientForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_featured: false, sort_order: 0 },
  });

  const logoUrl = watch('logo_url');

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          name: editing.name,
          logo_url: editing.logo_url,
          website_url: editing.website_url ?? '',
          industry: (editing as any).industry ?? '',
          is_featured: editing.is_featured,
          sort_order: editing.sort_order,
        });
      } else {
        reset({ is_featured: false, sort_order: 0 });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: ClientForm) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        website_url: values.website_url || null,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await db.from('clients').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Client updated!');
      } else {
        const { error } = await db.from('clients').insert(payload);
        if (error) throw error;
        toast.success('Client added!');
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
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Client' : 'Add Client'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <Field label="Company Name *" error={errors.name?.message}>
            <input {...register('name')} placeholder="Acme Corp" className={inputClass(!!errors.name)} />
          </Field>
          <Field label="Logo URL *" error={errors.logo_url?.message}>
            <input {...register('logo_url')} placeholder="https://…/logo.png" className={inputClass(!!errors.logo_url)} />
          </Field>
          {/* Logo preview */}
          {logoUrl && !errors.logo_url && (
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 flex items-center justify-center h-20">
              <img src={logoUrl} alt="Logo preview" className="max-h-12 max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <Field label="Website URL" error={errors.website_url?.message}>
            <input {...register('website_url')} placeholder="https://acme.com" className={inputClass(!!errors.website_url)} />
          </Field>
          <Field label="Industry">
            <input {...register('industry')} placeholder="Technology, Healthcare, etc." className={inputClass()} />
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
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageClients() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data: clients, isLoading } = useQuery({
    queryKey: ['adminClients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Client[];
    },
  });

  const handleDelete = async (c: Client) => {
    if (!window.confirm(`Delete client "${c.name}"?`)) return;
    const { error } = await db.from('clients').delete().eq('id', c.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['adminClients'] });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-500 mt-0.5">{clients?.length ?? 0} clients</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3">
              <div className="w-16 h-12 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (clients ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">No clients yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {(clients ?? []).map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group">
              {/* Logo */}
              <div className="h-14 flex items-center justify-center mb-3 rounded-xl bg-gray-50 overflow-hidden">
                <img
                  src={c.logo_url}
                  alt={c.name}
                  className="max-h-10 max-w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              <div className="flex items-center gap-1 justify-center mb-1">
                <p className="text-xs font-semibold text-gray-700 text-center truncate">{c.name}</p>
                {c.is_featured && <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />}
              </div>
              {(c as any).industry && (
                <p className="text-[10px] text-gray-400 text-center mb-2">{(c as any).industry}</p>
              )}

              <div className="flex items-center justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {c.website_url && (
                  <a href={c.website_url} target="_blank" rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-[#0056A6]">
                    <ExternalLink size={13} />
                  </a>
                )}
                <button onClick={() => { setEditing(c); setModalOpen(true); }}
                  className="p-1 text-gray-400 hover:text-[#0056A6]">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(c)}
                  className="p-1 text-gray-400 hover:text-[#D72638]">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminClients'] })}
      />
    </div>
  );
}
