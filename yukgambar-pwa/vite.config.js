import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: { enabled: true },
      manifest: {
        name: 'YukGambar',
        short_name: 'YukGambar',
        description: 'Papan tulis digital: gambar, simpan, lanjutkan.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f6f4ff',
        theme_color: '#5b46e5',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        runtimeCaching: [
          {
            // Daftar project/template tetap bisa dibuka dari cache saat offline
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') || url.href.includes('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'yukgambar-api', networkTimeoutSeconds: 6 },
          },
        ],
      },
    }),
  ],
});
