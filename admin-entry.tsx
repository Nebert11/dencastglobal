import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from '@backend/admin/admin/AdminLogin';
import AdminLayout from '@backend/admin/admin/layout/AdminLayout';
import ManageBlogPosts from '@backend/admin/admin/pages/ManageBlogPosts';
import ManageMedia from '@backend/admin/admin/pages/ManageMedia';
import './src/index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

const root = document.getElementById('admin-root');
if (!root) throw new Error('Admin root element not found.');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/blog" element={<ManageBlogPosts />} />
            <Route path="/admin/media" element={<ManageMedia />} />
            <Route path="*" element={<Navigate to="/admin/blog" replace />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
);