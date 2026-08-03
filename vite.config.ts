import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Deployed to GitHub Pages at https://akashbsp1997-bot.github.io/VIDHANOS/, so the app is served
// from a subpath rather than the domain root. Manifest start_url/scope/icons use relative paths
// (no leading slash) so they resolve correctly under that subpath.
const base = '/VIDHANOS/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'VIDHANOS — Legal Case Manager',
        short_name: 'VIDHANOS',
        description: 'Offline-first legal case management',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#0B1F3A',
        theme_color: '#0B1F3A',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        // tesseract.js's OCR engine (~15MB WASM core + trained data) is fetched from its
        // default CDN on first use (src/services/ocr/extractImageText.ts). Cache-first since
        // these assets are immutable once fetched — this is what makes OCR work fully offline
        // after the first successful run.
        runtimeCaching: [
          {
            urlPattern: ({ url }: { url: URL }) => /unpkg\.com|jsdelivr\.net|cdn\.jsdelivr/.test(url.hostname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ocr-engine-cdn',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
