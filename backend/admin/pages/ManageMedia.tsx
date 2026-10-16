import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Search,
  Copy,
  X,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import mysql from '@backend/lib/mysql';
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
        dragging ? 'border-[#25408F] bg-blue-50' : 'border-gray-200 hover:border-[#25408F]/50 hover:bg-gray-50',
        uploading && 'pointer-events-none opacity-70'
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#25408F]/10 flex items-center justify-center">
        <Upload size={22} className="text-[#25408F]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-700">{uploading ? 'Uploading…' : 'Drop files here or click to upload'}</p>
        <p className="text-sm text-gray-400 mt-0.5">JPEG, PNG, GIF, WebP, or AVIF. Max 10 MB per image.</p>
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
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
}

function DetailModal({ file, onClose }: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 truncate pr-4">{file.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 flex items-center justify-center min-h-48 max-h-72 overflow-hidden">
          <img src={file.url} alt={file.alt_text ?? file.name} className="max-w-full max-h-72 object-contain" />
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
              <button onClick={copyUrl} className="flex-shrink-0 text-gray-400 hover:text-[#25408F] transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t border-gray-100">
          <button onClick={copyUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25408F] text-white text-sm font-semibold hover:bg-[#1f3576] transition-colors">
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
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ['adminMedia', search],
    queryFn: async () => {
      let q = mysql
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) q = q.ilike('name', `%${search}%`);
      q = q.ilike('type', 'image/%');

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
        const { error } = await mysql.uploadImage(file);
        if (error) throw error;
        uploadedCount.success++;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Failed to upload ${file.name}`);
        uploadedCount.fail++;
      }
    }

    setUploading(false);
    if (uploadedCount.success > 0) toast.success(`${uploadedCount.success} file(s) uploaded`);
    if (uploadedCount.fail > 0) toast.error(`${uploadedCount.fail} file(s) failed`);
    qc.invalidateQueries({ queryKey: ['adminMedia'] });
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Article Images</h2>
        <p className="text-sm text-gray-500 mt-0.5">{files?.length ?? 0} images</p>
      </div>

      <UploadArea onUpload={handleUpload} uploading={uploading} />

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#25408F]/30 bg-white"
          />
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
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#25408F] transition-all"
            >
              <img src={file.url} alt={file.alt_text ?? file.name} className="w-full h-full object-cover" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <p className="text-white text-xs text-center px-2 line-clamp-2">{file.name}</p>
                <p className="text-white/70 text-[10px]">{formatBytes(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <DetailModal
          file={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
