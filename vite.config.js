import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const plugins = [react()];

  if (mode !== 'native') {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['buddy-watercolor/*.webp'],
        manifest: {
          name: 'Task Buddies',
          short_name: 'Task Buddies',
          description: 'Cosy focus companions for kids.',
          theme_color: '#F0A275',
          background_color: '#F6E5CC',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,webp,svg,png,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    );
  }

  return { plugins };
});
