import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Archive,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import supabase from '@/lib/supabase';
import { getCurrentUser, getProfile } from '@/services/auth.service';
import { cn } from '@/utils/cn';
import type { ContactMessage, Project } from '@/types';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  badge?: number;
  loading?: boolean;
}

function StatCard({ label, value, icon, color, badge, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <Skeleton className="w-10 h-10 mb-4 rounded-xl" />
        <Skeleton className="h-7 w-20 mb-2" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', color)}>
        {icon}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {badge !== undefined && badge > 0 && (
          <span className="mb-0.5 text-xs font-bold px-2 py-0.5 bg-[#D3232E] text-white rounded-full">
            {badge} new
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickAction({ label, icon, href, color }: QuickActionProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all hover:shadow-sm hover:border-solid',
        color
      )}
    >
      <div className="text-current">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  new: <Clock size={11} />,
  read: <Eye size={11} />,
  replied: <CheckCircle size={11} />,
  archived: <Archive size={11} />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: userResult } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const { data: profileResult } = useQuery({
    queryKey: ['profile', userResult?.data?.id],
    queryFn: () => getProfile(userResult!.data!.id),
    enabled: !!userResult?.data?.id,
  });

  const userName = profileResult?.data?.full_name ?? userResult?.data?.email?.split('@')[0] ?? 'Admin';

  // ── Stats ──────────────────────────────────────────────────────────────────

  const { data: projectCount, isLoading: loadingProjects } = useQuery({
    queryKey: ['dashboardProjectCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: blogCount, isLoading: loadingBlog } = useQuery({
    queryKey: ['dashboardBlogCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['dashboardMessages'],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });
      const { count: unread } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      return { total: total ?? 0, unread: unread ?? 0 };
    },
  });

  const { data: mediaCount, isLoading: loadingMedia } = useQuery({
    queryKey: ['dashboardMediaCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('media_files')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  // ── Recent messages ────────────────────────────────────────────────────────

  const { data: recentMessages } = useQuery({
    queryKey: ['dashboardRecentMessages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return (data ?? []) as ContactMessage[];
    },
  });

  // ── Recent projects ────────────────────────────────────────────────────────

  const { data: recentProjects } = useQuery({
    queryKey: ['dashboardRecentProjects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('*, category:project_categories(*)')
        .order('created_at', { ascending: false })
        .limit(4);
      return (data ?? []) as Project[];
    },
  });

  const statsLoading = loadingProjects || loadingBlog || loadingMessages || loadingMedia;

  return (
    <div className="p-6 space-y-6">
      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#25408F]/10 text-[#25408F] px-4 py-2 rounded-xl">
          <TrendingUp size={16} />
          <span className="text-sm font-semibold">Dencast Global CMS</span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={projectCount ?? 0}
          icon={<FolderOpen size={20} className="text-blue-600" />}
          color="bg-blue-50"
          loading={statsLoading}
        />
        <StatCard
          label="Blog Posts"
          value={blogCount ?? 0}
          icon={<BookOpen size={20} className="text-purple-600" />}
          color="bg-purple-50"
          loading={statsLoading}
        />
        <StatCard
          label="Contact Messages"
          value={messagesData?.total ?? 0}
          badge={messagesData?.unread}
          icon={<MessageSquare size={20} className="text-[#D3232E]" />}
          color="bg-red-50"
          loading={statsLoading}
        />
        <StatCard
          label="Media Files"
          value={mediaCount ?? 0}
          icon={<ImageIcon size={20} className="text-emerald-600" />}
          color="bg-emerald-50"
          loading={statsLoading}
        />
      </div>

      {/* ── Quick actions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction
            label="New Project"
            icon={<FolderOpen size={22} />}
            href="/admin/projects"
            color="text-[#25408F] border-blue-200 hover:bg-blue-50 hover:border-blue-400"
          />
          <QuickAction
            label="New Blog Post"
            icon={<BookOpen size={22} />}
            href="/admin/blog"
            color="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-400"
          />
          <QuickAction
            label="Upload Media"
            icon={<ImageIcon size={22} />}
            href="/admin/media"
            color="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
          />
          <QuickAction
            label="View Messages"
            icon={<MessageSquare size={22} />}
            href="/admin/messages"
            color="text-[#D3232E] border-red-200 hover:bg-red-50 hover:border-red-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Recent messages ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-xs text-[#25408F] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate('/admin/messages')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#25408F]/10 flex items-center justify-center flex-shrink-0 text-[#25408F] font-bold text-sm">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{msg.name}</p>
                    <p className="text-xs text-gray-400 truncate">{msg.subject ?? msg.message.slice(0, 50)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', statusStyles[msg.status])}>
                      {statusIcons[msg.status]}
                      {msg.status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(msg.created_at), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-6 text-center">No messages yet</p>
          )}
        </div>

        {/* ── Recent projects ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Projects</h3>
            <button
              onClick={() => navigate('/admin/projects')}
              className="text-xs text-[#25408F] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {recentProjects && recentProjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate('/admin/projects')}
                  className="group rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="h-28 bg-gray-100 relative overflow-hidden">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#25408F]/10 to-[#25408F]/30">
                        <FolderOpen size={28} className="text-[#25408F]/40" />
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold bg-[#D3232E] text-white px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{project.title}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {(project as any).category?.name ?? project.client_name ?? '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-3">
              <FolderOpen size={32} className="text-gray-300" />
              <p className="text-sm text-gray-400">No projects yet</p>
              <button
                onClick={() => navigate('/admin/projects')}
                className="flex items-center gap-1.5 text-sm text-[#25408F] font-semibold hover:underline"
              >
                <Plus size={15} /> Add your first project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content overview bars ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Content Overview</h3>
        <div className="space-y-3">
          {[
            { label: 'Projects', value: projectCount ?? 0, max: 50, color: 'bg-[#25408F]' },
            { label: 'Blog Posts', value: blogCount ?? 0, max: 100, color: 'bg-purple-500' },
            { label: 'Messages', value: messagesData?.total ?? 0, max: 200, color: 'bg-[#D3232E]' },
            { label: 'Media Files', value: mediaCount ?? 0, max: 500, color: 'bg-emerald-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-24 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', item.color)}
                  style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
