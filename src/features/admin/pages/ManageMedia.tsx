import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  X,
  Image as ImageIcon,
  Film,
  FileText,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { MediaFile } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <ImageIcon size={20} className="text-blue-500" />;
  if (type.startsWith('video/')) return <Film size={20} className="text-purple-500" />;
  return <FileText size={20} className="text-gray-500" />;
}

type FilterType = 'all' | 'image' | 'video' | 'document';

// ─── Upload area ──────────────────────────────────────────────────────────────

interface UploadAreaProps {
  onUpload: (files: FileList) => void;
  uploading: boolean;
}

function UploadArea({ onUpload, uploading }: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files); }}
      onClick={() => fileRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
        dragging ? 'border-[#0056A6] bg-blue-50' : 'border-gray-200 hover:border-[#0056A6]/50 hover:bg-gray-50',
        uploading && 'pointer-events-none opacity-70'
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#0056A6]/10 flex items-center justify-center">
        <Upload size={22} className="text-[#0056A6]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-700">{uploading ? 'Uploading…' : 'Drop files here or click to upload'}</p>
        <p className="text-sm text-gray-400 mt-0.5">Images, videos, PDFs. Max 50 MB per file.</p>
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
      />
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  file: MediaFile;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function DetailModal({ file, onClose, onDelete }: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied!');
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 truncate pr-4">{file.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 flex items-center justify-center min-h-48 max-h-72 overflow-hidden">
          {isImage ? (
            <img src={file.url} alt={file.alt_text ?? file.name} className="max-w-full max-h-72 object-contain" />
          ) : isVideo ? (
            <video src={file.url} controls className="max-w-full max-h-72" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
              {getFileIcon(file.type)}
              <p className="text-sm">{file.name}</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">File type</p>
              <p className="text-gray-900">{file.type}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">File size</p>
              <p className="text-gray-900">{formatBytes(file.size)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Uploaded</p>
              <p className="text-gray-900">{new Date(file.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* URL */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">File URL</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <p className="text-xs text-gray-600 flex-1 truncate font-mono">{file.url}</p>
              <button onClick={copyUrl} className="flex-shrink-0 text-gray-400 hover:text-[#0056A6] transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <button
            onClick={() => { onDelete(file.id); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#D72638] hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={copyUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageMedia() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ['adminMedia', search, typeFilter],
    queryFn: async () => {
      let q = supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) q = q.ilike('name', `%${search}%`);
      if (typeFilter !== 'all') {
        const typePrefix = typeFilter === 'image' ? 'image/' : typeFilter === 'video' ? 'video/' : 'application/';
        q = q.ilike('type', `${typePrefix}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as MediaFile[];
    },
  });

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    const uploadedCount = { success: 0, fail: 0 };

    for (const file of Array.from(fileList)) {
      try {
        // For Cloudinary-style integration, just record the URL.
        // Here we simulate with a fake URL and store in media_files.
        // In production, replace with actual upload logic.
        const fakeUrl = URL.createObjectURL(file);

        const { error } = await db.from('media_files').insert({
          name: file.name,
          // New schema columns
          url: fakeUrl,
          type: file.type,
          size: file.size,
          // Legacy schema columns kept in some environments
          file_url: fakeUrl,
          file_type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
              ? 'video'
              : 'document',
          file_size: file.size,
          mime_type: file.type,
          original_name: file.name,
          alt_text: null,
          uploaded_by: null,
        });

        if (error) throw error;
        uploadedCount.success++;
      } catch {
        uploadedCount.fail++;
      }
    }

    setUploading(false);
    if (uploadedCount.success > 0) toast.success(`${uploadedCount.success} file(s) uploaded`);
    if (uploadedCount.fail > 0) toast.error(`${uploadedCount.fail} file(s) failed`);
    qc.invalidateQueries({ queryKey: ['adminMedia'] });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this file permanently?')) return;
    const { error } = await db.from('media_files').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['adminMedia'] });
  };

  const FILTER_TABS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Images', value: 'image' },
    { label: 'Videos', value: 'video' },
    { label: 'Documents', value: 'document' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
        <p className="text-sm text-gray-500 mt-0.5">{files?.length ?? 0} files</p>
      </div>

      <UploadArea onUpload={handleUpload} uploading={uploading} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 bg-white"
          />
        </div>
        <div className="flex gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTypeFilter(tab.value)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-semibold transition-colors',
                typeFilter === tab.value ? 'bg-[#0056A6] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl aspect-square" />
          ))}
        </div>
      ) : (files ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-3 text-gray-400">
          <ImageIcon size={48} className="text-gray-200" />
          <p className="text-sm">No files found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {(files ?? []).map((file) => (
            <div
              key={file.id}
              onClick={() => setSelected(file)}
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#0056A6] transition-all"
            >
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.alt_text ?? file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50">
                  {getFileIcon(file.type)}
                  <p className="text-[10px] text-gray-400 text-center px-1 line-clamp-2">{file.name}</p>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <p className="text-white text-xs text-center px-2 line-clamp-2">{file.name}</p>
                <p className="text-white/70 text-[10px]">{formatBytes(file.size)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                  className="mt-1 p-1.5 rounded-lg bg-[#D72638]/80 text-white hover:bg-[#D72638] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <DetailModal
          file={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
