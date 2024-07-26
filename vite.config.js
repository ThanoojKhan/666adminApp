import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import image from './src/assets/pic5.jpg'

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
            src: {image},
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: {image},
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: {image},
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
