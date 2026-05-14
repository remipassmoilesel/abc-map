/**
 * Copyright © 2026 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Used for API, doc, ...
const DefaultProxy = {
  target: 'http://localhost:10082',
  secure: false,
  changeOrigin: true,
  ws: true,
  xfwd: true,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: null,
      registerType: 'prompt',
      strategies: 'generateSW',
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,txt}'],
        navigateFallbackDenylist: [new RegExp('/api.+'), new RegExp('/documentation.+'), new RegExp('/legal-mentions.html')],
        sourcemap: true,
      },
      manifest: {
        short_name: 'Abc-Map',
        name: 'Abc-Map',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0077b6',
        background_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  clearScreen: false,
  server: {
    port: 3005,
    proxy: {
      '/api': DefaultProxy,
      '/documentation': DefaultProxy,
      '/legal-mentions.html': DefaultProxy,
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // FIXME: Split bundles
    chunkSizeWarningLimit: 10 * 1024 * 1024,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['.', 'node_modules'],
      },
    },
  },
});
