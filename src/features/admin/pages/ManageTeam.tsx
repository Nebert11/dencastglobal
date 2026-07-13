import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { TeamMember } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  avatar_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  email: z.string().email('Enter a valid email').or(z.literal('')).optional(),
  linkedin: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  twitter: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  is_leadership: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});

type TeamForm = z.infer<typeof schema>;

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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: TeamMember | null;
  onSaved: () => void;
}

function TeamModal({ open, onClose, editing, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeamForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_leadership: false, is_active: true, sort_order: 0 },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          name: editing.name,
          role: editing.role,
          bio: editing.bio ?? '',
          avatar_url: editing.avatar_url ?? '',
          email: '',
          linkedin: editing.social_links?.linkedin ?? '',
          twitter: editing.social_links?.twitter ?? '',
          is_leadership: (editing as any).is_leadership ?? false,
          is_active: editing.is_active,
          sort_order: editing.sort_order,
        });
      } else {
        reset({ is_leadership: false, is_active: true, sort_order: 0 });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: TeamForm) => {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        role: values.role,
        bio: values.bio || null,
        avatar_url: values.avatar_url || null,
        social_links: {
          linkedin: values.linkedin || undefined,
          twitter: values.twitter || undefined,
        },
        is_leadership: values.is_leadership,
        is_active: values.is_active,
        sort_order: values.sort_order,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await db.from('team_members').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Team member updated!');
      } else {
        const { error } = await db.from('team_members').insert(payload);
        if (error) throw error;
        toast.success('Team member added!');
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
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Member' : 'New Member'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name *" error={errors.name?.message}>
              <input {...register('name')} placeholder="Jane Smith" className={inputClass(!!errors.name)} />
            </Field>
            <Field label="Role / Title *" error={errors.role?.message}>
              <input {...register('role')} placeholder="Creative Director" className={inputClass(!!errors.role)} />
            </Field>
          </div>
          <Field label="Avatar URL" error={errors.avatar_url?.message}>
            <input {...register('avatar_url')} placeholder="https://…" className={inputClass(!!errors.avatar_url)} />
          </Field>
          <Field label="Bio">
            <textarea {...register('bio')} rows={3} placeholder="Short bio…" className={inputClass(false, true)} />
          </Field>
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Social Links</p>
            <Field label="LinkedIn URL" error={errors.linkedin?.message}>
              <input {...register('linkedin')} placeholder="https://linkedin.com/in/…" className={inputClass(!!errors.linkedin)} />
            </Field>
            <Field label="Twitter / X URL" error={errors.twitter?.message}>
              <input {...register('twitter')} placeholder="https://twitter.com/…" className={inputClass(!!errors.twitter)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" {...register('sort_order')} className={inputClass()} />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_leadership')} className="w-4 h-4 rounded accent-[#0056A6]" />
              <span className="text-sm text-gray-700">Leadership team</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-[#0056A6]" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70">
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors',
        checked ? 'bg-[#0056A6]' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-4' : 'translate-x-0.5'
      )} />
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageTeam() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ['adminTeam'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as TeamMember[];
    },
  });

  const handleDelete = async (m: TeamMember) => {
    if (!window.confirm(`Remove "${m.name}" from the team?`)) return;
    const { error } = await db.from('team_members').delete().eq('id', m.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Removed');
    qc.invalidateQueries({ queryKey: ['adminTeam'] });
  };

  const handleToggleActive = async (m: TeamMember) => {
    const { error } = await db.from('team_members').update({ is_active: !m.is_active }).eq('id', m.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ['adminTeam'] });
  };

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-0.5">{members?.length ?? 0} members</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (members ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">No team members yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(members ?? []).map((m) => (
            <div key={m.id} className={cn(
              'bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow text-center',
              m.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'
            )}>
              {/* Avatar */}
              <div className="relative mx-auto w-16 h-16 mb-3">
                {m.avatar_url ? (
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0056A6] flex items-center justify-center text-white text-lg font-bold">
                    {initials(m.name)}
                  </div>
                )}
                {(m as any).is_leadership && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <Crown size={11} className="text-white" />
                  </div>
                )}
              </div>

              <p className="font-semibold text-gray-900">{m.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.role}</p>

              {/* Active toggle */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <Toggle checked={m.is_active} onChange={() => handleToggleActive(m)} />
                <span className="text-xs text-gray-500">{m.is_active ? 'Active' : 'Inactive'}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => { setEditing(m); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#0056A6] hover:bg-blue-50 transition-colors">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(m)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-[#D72638] hover:bg-red-50 transition-colors">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminTeam'] })}
      />
    </div>
  );
}
