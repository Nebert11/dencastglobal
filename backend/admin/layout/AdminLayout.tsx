import { useState, useEffect, useRef } from 'react';
import {
  Outlet,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Image,
  ChevronDown,
  Menu,
  X,
  LogOut,
  BookOpen,
  Shield,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { signOut, getCurrentUser, getProfile } from '@backend/services/auth.service';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_SIZE = 18;

function useNavSections(): NavSection[] {
  return [
    {
      title: 'ARTICLES',
      items: [
        { label: 'Blog Posts', href: '/admin/blog', icon: <BookOpen size={ICON_SIZE} /> },
      ],
    },
    {
      title: 'IMAGES',
      items: [
        { label: 'Article Images', href: '/admin/media', icon: <Image size={ICON_SIZE} /> },
      ],
    },
  ];
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
  mobile?: boolean;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

function Sidebar({ collapsed, onClose, mobile, userName, userRole, onLogout }: SidebarProps) {
  const navSections = useNavSections();

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
                      </>
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
    '/admin/blog': 'Articles',
    '/admin/media': 'Article Images',
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

  useEffect(() => {
    const allowedPaths = ['/admin/blog', '/admin/media'];
    if (!allowedPaths.includes(location.pathname)) {
      navigate('/admin/blog', { replace: true });
    }
  }, [location.pathname, navigate]);

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

  if (!userResult?.data?.id || userResult.status === 'error') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar
          collapsed={collapsed}
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
