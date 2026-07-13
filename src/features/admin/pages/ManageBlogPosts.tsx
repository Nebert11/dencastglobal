import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { getBlogCategories } from '@/services/supabase.service';
import { cn } from '@/utils/cn';
import type { BlogPost, BlogCategory } from '@/types';
import { format } from 'date-fns';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphens only'),
  category_id: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type BlogForm = z.infer<typeof schema>;

const PAGE_SIZE = 10;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inputClass(error = false, textarea = false) {
  return cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors bg-gray-50',
    'focus:bg-white focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
    error ? 'border-red-400 bg-red-50' : 'border-gray-200',
    textarea && 'resize-vertical'
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

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-500',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editing: BlogPost | null;
  categories: BlogCategory[];
  onSaved: () => void;
}

function BlogModal({ open, onClose, editing, categories, onSaved }: ModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BlogForm>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', is_featured: false },
  });

  const titleValue = watch('title');
  const contentValue = watch('content') ?? '';
  const wc = wordCount(contentValue);
  const readTime = Math.max(1, Math.ceil(wc / 200));

  useEffect(() => {
    if (!editing) setValue('slug', slugify(titleValue ?? ''));
  }, [titleValue, editing, setValue]);

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          slug: editing.slug,
          category_id: editing.category_id ?? '',
          excerpt: editing.excerpt ?? '',
          content: editing.content ?? '',
          cover_image_url: editing.cover_image_url ?? '',
          tags: '',
          status: editing.is_published ? 'published' : 'draft',
          is_featured: editing.is_featured,
          meta_title: '',
          meta_description: '',
        });
      } else {
        reset({ status: 'draft', is_featured: false });
      }
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: BlogForm) => {
    setSaving(true);
    try {
      const isPublished = values.status === 'published';
      const payload = {
        title: values.title,
        slug: values.slug,
        category_id: values.category_id || null,
        excerpt: values.excerpt || null,
        content: values.content || null,
        cover_image_url: values.cover_image_url || null,
        is_featured: values.is_featured,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await db.from('blog_posts').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Post updated!');
      } else {
        const { error } = await db.from('blog_posts').insert({ ...payload, views: 0 });
        if (error) throw error;
        toast.success('Post created!');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title *" error={errors.title?.message}>
              <input {...register('title')} placeholder="Post title" className={inputClass(!!errors.title)} />
            </Field>
            <Field label="Slug *" error={errors.slug?.message}>
              <input {...register('slug')} placeholder="post-slug" className={inputClass(!!errors.slug)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category">
              <select {...register('category_id')} className={inputClass()}>
                <option value="">— Select —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select {...register('status')} className={inputClass()}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Cover Image URL" error={errors.cover_image_url?.message}>
              <input {...register('cover_image_url')} placeholder="https://…" className={inputClass(!!errors.cover_image_url)} />
            </Field>
          </div>
          <Field label="Excerpt">
            <textarea {...register('excerpt')} rows={2} placeholder="Brief description…" className={inputClass(false, true)} style={{ minHeight: 64 }} />
          </Field>
          <Field label="Content">
            <textarea {...register('content')} rows={10} placeholder="Write your post content here…" className={inputClass(false, true)} style={{ minHeight: 200 }} />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-400">{wc} words</p>
              <p className="text-xs text-gray-400">~{readTime} min read</p>
            </div>
          </Field>
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <p className="text-sm font-semibold text-gray-700">SEO Settings</p>
            <Field label="Meta Title">
              <input {...register('meta_title')} placeholder="Override page title for SEO" className={inputClass()} />
            </Field>
            <Field label="Meta Description">
              <textarea {...register('meta_description')} rows={2} placeholder="SEO description (150-160 chars)" className={inputClass(false, true)} style={{ minHeight: 64 }} />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-[#0056A6]" />
              <span className="text-sm text-gray-700">Featured post</span>
            </label>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70">
            {saving ? 'Saving…' : editing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageBlogPosts() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const { data: catResult } = useQuery({ queryKey: ['blogCategories'], queryFn: getBlogCategories });
  const categories = catResult?.data ?? [];

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['adminBlogPosts', page, search, statusFilter],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let q = supabase
        .from('blog_posts')
        .select('*, category:blog_categories(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (search) q = q.ilike('title', `%${search}%`);
      if (statusFilter === 'published') q = q.eq('is_published', true);
      else if (statusFilter === 'draft') q = q.eq('is_published', false);

      const { data, count, error } = await q;
      if (error) throw error;
      return { data: (data ?? []) as BlogPost[], total: count ?? 0 };
    },
  });

  const posts = postsData?.data ?? [];
  const total = postsData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (p: BlogPost) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    const { error } = await db.from('blog_posts').delete().eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Post deleted');
    qc.invalidateQueries({ queryKey: ['adminBlogPosts'] });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} total posts</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 bg-gray-50" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 bg-gray-50">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Cover</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Views</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="animate-pulse bg-gray-200 h-4 rounded" /></td>)}</tr>
                ))
              ) : posts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No posts found</td></tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {p.cover_image_url ? (
                          <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {p.is_featured && <Star size={12} className="fill-amber-400 text-amber-400 flex-shrink-0" />}
                        <div>
                          <p className="font-semibold text-gray-900">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{(p as any).category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-semibold', p.is_published ? statusStyles.published : statusStyles.draft)}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-600">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs hidden sm:table-cell">
                      {p.published_at ? format(new Date(p.published_at), 'MMM d, yyyy') : format(new Date(p.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(p); setModalOpen(true); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0056A6] hover:bg-blue-50 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#D72638] hover:bg-red-50 transition-colors">
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-700">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <BlogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        categories={categories}
        onSaved={() => qc.invalidateQueries({ queryKey: ['adminBlogPosts'] })}
      />
    </div>
  );
}
