import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import BackToTopButton from '@/components/ui/BackToTopButton';

// ── Public Layout ──────────────────────────────────────────────────────────────
import PublicLayout from '@/components/layout/PublicLayout';

// ── Public Pages ───────────────────────────────────────────────────────────────
import HomePage from '@/features/home/HomePage';
import AboutPage from '@/features/about/AboutPage';
import ServicesPage from '@/features/services/ServicesPage';
import ServiceDetailPage from '@/features/services/ServiceDetailPage';
import PortfolioPage from '@/features/portfolio/PortfolioPage';
import ProjectDetailPage from '@/features/portfolio/ProjectDetailPage';
import DocumentaryPage from '@/features/documentary/DocumentaryPage';
import LivestreamingPage from '@/features/livestreaming/LivestreamingPage';
import PhotographyPage from '@/features/photography/PhotographyPage';
import BrandingPage from '@/features/branding/BrandingPage';
import BlogPage from '@/features/blog/BlogPage';
import BlogPostPage from '@/features/blog/BlogPostPage';
import ContactPage from '@/features/contact/ContactPage';

// ── Admin ──────────────────────────────────────────────────────────────────────
import AdminLogin from '@/features/admin/AdminLogin';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import Dashboard from '@/features/admin/pages/Dashboard';
import ManageHero from '@/features/admin/pages/ManageHero';
import ManageAbout from '@/features/admin/pages/ManageAbout';
import ManageProjects from '@/features/admin/pages/ManageProjects';
import ManageServices from '@/features/admin/pages/ManageServices';
import ManageBlogPosts from '@/features/admin/pages/ManageBlogPosts';
import ManageTestimonials from '@/features/admin/pages/ManageTestimonials';
import ManageTeam from '@/features/admin/pages/ManageTeam';
import ManageClients from '@/features/admin/pages/ManageClients';
import ManageContactMessages from '@/features/admin/pages/ManageContactMessages';
import ManageMedia from '@/features/admin/pages/ManageMedia';
import ManageSiteSettings from '@/features/admin/pages/ManageSiteSettings';
import ManageSEO from '@/features/admin/pages/ManageSEO';
import ManageFAQs from '@/features/admin/pages/ManageFAQs';
import ManageNewsletter from '@/features/admin/pages/ManageNewsletter';
import ManageStatistics from '@/features/admin/pages/ManageStatistics';

// ─── Query Client ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      retry: 1,
    },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* ── Public site ──────────────────────────────── */}
            <Route element={<PublicLayout />}>
              {/* Root → Home */}
              <Route index element={<HomePage />} />

              {/* About */}
              <Route path="/about" element={<AboutPage />} />

              {/* Services */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />

              {/* Dedicated service landing pages */}
              <Route path="/documentary" element={<DocumentaryPage />} />
              <Route path="/livestreaming" element={<LivestreamingPage />} />
              <Route path="/photography" element={<PhotographyPage />} />
              <Route path="/branding" element={<BrandingPage />} />

              {/* Portfolio */}
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />

              {/* Blog */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Contact */}
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* ── Admin auth ───────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Admin protected shell ────────────────────── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="hero" element={<ManageHero />} />
              <Route path="about" element={<ManageAbout />} />
              <Route path="statistics" element={<ManageStatistics />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="blog" element={<ManageBlogPosts />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="clients" element={<ManageClients />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="faqs" element={<ManageFAQs />} />
              <Route path="media" element={<ManageMedia />} />
              <Route path="settings" element={<ManageSiteSettings />} />
              <Route path="seo" element={<ManageSEO />} />
              <Route path="social" element={<ManageSiteSettings />} />
              <Route path="messages" element={<ManageContactMessages />} />
              <Route path="newsletter" element={<ManageNewsletter />} />
            </Route>

            {/* ── 404 → home ───────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BackToTopButton />
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#25408F', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#D3232E', secondary: '#fff' },
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
