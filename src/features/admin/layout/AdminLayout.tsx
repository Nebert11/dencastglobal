import { useState, useEffect, useRef } from 'react';
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  Settings,
  Search,
  Globe,
  ChevronDown,
  Menu,
  X,
  Bell,
  LogOut,
  Film,
  Star,
  HelpCircle,
  BookOpen,
  UserCheck,
  BarChart2,
  FolderOpen,
  Link2,
  Shield,
  Info,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { signOut, getCurrentUser, getProfile } from '@/services/auth.service';
import { cn } from '@/utils/cn';
import supabase from '@/lib/supabase';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_SIZE = 18;

function useNavSections(unreadCount: number): NavSection[] {
  return [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { label: 'Hero', href: '/admin/hero', icon: <Film size={ICON_SIZE} /> },
        { label: 'About Us', href: '/admin/about', icon: <Info size={ICON_SIZE} /> },
        { label: 'Statistics', href: '/admin/statistics', icon: <BarChart2 size={ICON_SIZE} /> },
        { label: 'Services', href: '/admin/services', icon: <Briefcase size={ICON_SIZE} /> },
        { label: 'Portfolio', href: '/admin/projects', icon: <FolderOpen size={ICON_SIZE} /> },
        { label: 'Blog Posts', href: '/admin/blog', icon: <BookOpen size={ICON_SIZE} /> },
        { label: 'Team', href: '/admin/team', icon: <Users size={ICON_SIZE} /> },
        { label: 'Clients', href: '/admin/clients', icon: <UserCheck size={ICON_SIZE} /> },
        { label: 'Testimonials', href: '/admin/testimonials', icon: <Star size={ICON_SIZE} /> },
        { label: 'FAQs', href: '/admin/faqs', icon: <HelpCircle size={ICON_SIZE} /> },
      ],
    },
    {
      title: 'MEDIA',
      items: [
        { label: 'Media Library', href: '/admin/media', icon: <Image size={ICON_SIZE} /> },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Site Settings', href: '/admin/settings', icon: <Settings size={ICON_SIZE} /> },
        { label: 'SEO', href: '/admin/seo', icon: <Globe size={ICON_SIZE} /> },
        { label: 'Social Links', href: '/admin/social', icon: <Link2 size={ICON_SIZE} /> },
        { label: 'Contact Messages', href: '/admin/messages', icon: <MessageSquare size={ICON_SIZE} />, badge: unreadCount || undefined },
        { label: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={ICON_SIZE} /> },
      ],
    },
  ];
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
  mobile?: boolean;
  unreadCount: number;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

function Sidebar({ collapsed, onClose, mobile, unreadCount, userName, userRole, onLogout }: SidebarProps) {
  const navSections = useNavSections(unreadCount);

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#0a1628] text-white transition-all duration-300',
        collapsed && !mobile ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0',
        collapsed && !mobile && 'px-4 justify-center'
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#25408F] flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-wider text-white truncate">DENCAST GLOBAL</p>
            <span className="inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#D3232E] text-white leading-tight">
              ADMIN
            </span>
          </div>
        )}
        {mobile && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title}>
            {(!collapsed || mobile) && (
              <p className="text-[10px] font-semibold text-gray-500 tracking-widest mb-2 px-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={mobile ? onClose : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative',
                        collapsed && !mobile ? 'justify-center px-0' : '',
                        isActive
                          ? 'bg-[#25408F] text-white font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/8'
                      )
                    }
                    title={collapsed && !mobile ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {(!collapsed || mobile) && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto flex-shrink-0 text-[10px] font-bold bg-[#D3232E] text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && !mobile && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#D3232E] rounded-full" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={cn(
        'border-t border-white/10 p-4 flex-shrink-0',
        collapsed && !mobile ? 'flex justify-center' : ''
      )}>
        {collapsed && !mobile ? (
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#25408F] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-gray-400 capitalize">{userRole}</p>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Page title map ───────────────────────────────────────────────────────────

function usePageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/hero': 'Manage Hero',
    '/admin/about': 'Manage About Us',
    '/admin/statistics': 'Manage Statistics',
    '/admin/services': 'Manage Services',
    '/admin/projects': 'Manage Portfolio',
    '/admin/blog': 'Manage Blog Posts',
    '/admin/team': 'Manage Team',
    '/admin/clients': 'Manage Clients',
    '/admin/testimonials': 'Manage Testimonials',
    '/admin/faqs': 'Manage FAQs',
    '/admin/media': 'Media Library',
    '/admin/settings': 'Site Settings',
    '/admin/seo': 'SEO Settings',
    '/admin/social': 'Social Links',
    '/admin/messages': 'Contact Messages',
    '/admin/newsletter': 'Newsletter',
  };
  return map[pathname] ?? 'Admin Panel';
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pageTitle = usePageTitle(location.pathname);

  // Auth guard
  const { data: userResult, isLoading: authLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: profileResult } = useQuery({
    queryKey: ['profile', userResult?.data?.id],
    queryFn: () => getProfile(userResult!.data!.id),
    enabled: !!userResult?.data?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Unread messages count
  const { data: unreadData } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: async () => {
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      return count ?? 0;
    },
    refetchInterval: 60_000,
  });

  const unreadCount = unreadData ?? 0;
  const userName = profileResult?.data?.full_name ?? userResult?.data?.email?.split('@')[0] ?? 'Admin';
  const userRole = profileResult?.data?.role ?? 'admin';

  // Close user menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && userResult && userResult.status === 'error') {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, userResult, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#25408F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar
          collapsed={collapsed}
          unreadCount={unreadCount}
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
        />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex lg:hidden">
            <Sidebar
              collapsed={false}
              mobile
              onClose={() => setMobileOpen(false)}
              unreadCount={unreadCount}
              userName={userName}
              userRole={userRole}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center h-16 px-4 lg:px-6 gap-3 flex-shrink-0 z-30">
          {/* Desktop toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex lg:hidden w-9 h-9 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-900 font-semibold text-base truncate">{pageTitle}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Dencast Global · Admin Panel
            </p>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search…"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Notification bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D3232E] rounded-full" />
            )}
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-1.5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#25408F] flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">{userName}</p>
                <p className="text-[11px] text-gray-400 capitalize">{userRole}</p>
              </div>
              <ChevronDown size={14} className={cn('text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-400">{userResult?.data?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
