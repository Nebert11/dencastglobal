import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(projectRoot, '../backend');

function adminEntryFallback(): Plugin {
  return {
    name: 'dencast-admin-entry-fallback',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const pathname = request.url?.split('?')[0];
        if (pathname === '/' || pathname === '/admin' || pathname?.startsWith('/admin/')) {
          request.url = '/admin.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: projectRoot,
  plugins: [adminEntryFallback(), react()],
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      '@tanstack/react-query',
      'lucide-react',
      'react-hot-toast',
      'date-fns',
    ],
    alias: [
      { find: '@backend', replacement: backendRoot },
      { find: '@', replacement: path.resolve(projectRoot, 'src') },
    ],
  },
  server: {
    port: 5176,
    strictPort: true,
    fs: { allow: [projectRoot, backendRoot] },
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist-admin',
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(projectRoot, 'admin.html') },
  },
});