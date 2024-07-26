import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '666 Enquiries',
        short_name: 'PWA App',
        description: 'Enquiries for 666',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pic5.jpg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pic5.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pic5.jpg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
