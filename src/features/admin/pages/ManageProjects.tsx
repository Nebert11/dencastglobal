import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { getProjectCategories } from '@/services/supabase.service';
import { cn } from '@/utils/cn';
import type { Project, ProjectCategory } from '@/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  tagline: z.string().optional(),
  category_id: z.string().optional(),
  client_name: z.string().optional(),
  cover_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  video_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type ProjectForm = z.infer<typeof schema>;

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: Project | null;
  categories: ProjectCategory[];
  onSaved: () => void;
}

function ProjectModal({ open, onClose, editing, categories, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_featured: false, is_active: true },
  });

  const titleValue = watch('title');

  // Auto-slug
  useEffect(() => {
    if (!editing) {
      setValue('slug', slugify(titleValue ?? ''), { shouldValidate: true });
    }
  }, [titleValue, editing, setValue]);

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          slug: editing.slug,
          tagline: (editing as any).tagline ?? '',
          category_id: editing.category_id ?? '',
          client_name: editing.client_name ?? '',
          cover_image_url: editing.cover_image_url ?? '',
          video_url: editing.video_url ?? '',
          description: editing.description ?? '',
          content: editing.content ?? '',
          is_featured: editing.is_featured,
          is_active: !editing.published_at ? false : true,
        });
      } else {
        reset({ is_featured: false, is_active: true });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: ProjectForm) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        category_id: values.category_id || null,
        cover_image_url: values.cover_image_url || null,
        video_url: values.video_url || null,
        published_at: values.is_active ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await db.from('projects').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Project updated!');
      } else {
        const { error } = await db.from('projects').insert({ ...payload, sort_order: 0 });
        if (error) throw error;
        toast.success('Project created!');
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
          <h3 className="font-bold text-gray-900 text-lg">
            {editing ? 'Edit Project' : 'New Project'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title *" error={errors.title?.message}>
              <input {...register('title')} placeholder="Project title" className={inputClass(!!errors.title)} />
            </Field>
            <Field label="Slug *" error={errors.slug?.message} hint="URL-friendly identifier">
              <input {...register('slug')} placeholder="project-title" className={inputClass(!!errors.slug)} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select {...register('category_id')} className={inputClass()}>
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Client Name">
              <input {...register('client_name')} placeholder="Client name" className={inputClass()} />
            </Field>
          </div>

          <Field label="Tagline">
            <input {...register('tagline')} placeholder="Short tagline" className={inputClass()} />
          </Field>

          <Field label="Cover Image URL" error={errors.cover_image_url?.message}>
            <input {...register('cover_image_url')} placeholder="https://…" className={inputClass(!!errors.cover_image_url)} />
          </Field>

          <Field label="Video URL" error={errors.video_url?.message}>
            <input {...register('video_url')} placeholder="https://…" className={inputClass(!!errors.video_url)} />
          </Field>

          <Field label="Description">
            <textarea {...register('description')} rows={3} placeholder="Project description…" className={inputClass(false, true)} />
          </Field>

          <Field label="Full Content / Case Study">
            <textarea {...register('content')} rows={5} placeholder="Detailed case study…" className={inputClass(false, true)} />
          </Field>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-[#0056A6]" />
              <span className="text-sm text-gray-700">Featured project</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-[#0056A6]" />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving…' : editing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ManageProjects() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const { data: catResult } = useQuery({
    queryKey: ['projectCategories'],
    queryFn: getProjectCategories,
  });
  const categories = catResult?.data ?? [];

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['adminProjects', page, search, categoryFilter],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let q = supabase
        .from('projects')
        .select('*, category:project_categories(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (search) q = q.ilike('title', `%${search}%`);
      if (categoryFilter) q = q.eq('category_id', categoryFilter);

      const { data, count, error } = await q;
      if (error) throw error;
      return { data: (data ?? []) as Project[], total: count ?? 0 };
    },
  });

  const projects = projectsData?.data ?? [];
  const total = projectsData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setModalOpen(true); };

  const handleDelete = async (p: Project) => {
    if (!window.confirm(`Delete project "${p.title}"? This cannot be undone.`)) return;
    const { error } = await db.from('projects').delete().eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Project deleted');
    qc.invalidateQueries({ queryKey: ['adminProjects'] });
  };

  const handleToggleFeatured = async (p: Project) => {
    const { error } = await db
      .from('projects')
      .update({ is_featured: !p.is_featured })
      .eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ['adminProjects'] });
  };

  const handleSaved = () => qc.invalidateQueries({ queryKey: ['adminProjects'] });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Portfolio / Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} total projects</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search projects…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6] bg-gray-50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 bg-gray-50"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Cover</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Client</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Featured</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.cover_image_url ? (
                          <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                      {(p as any).category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                      {p.client_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggleFeatured(p)} title="Toggle featured">
                        <Star
                          size={18}
                          className={cn(p.is_featured ? 'fill-amber-400 text-amber-400' : 'text-gray-300')}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold',
                        p.published_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        {p.published_at ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0056A6] hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#D72638] hover:bg-red-50 transition-colors"
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-700">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        categories={categories}
        onSaved={handleSaved}
      />
    </div>
  );
}
