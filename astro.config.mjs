// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function skipBrokenPublicFiles() {
  return {
    name: 'skip-broken-public-files',
    apply: 'build',
    buildStart() {
      const origCopyFileSync = globalThis._origCopyFileSync;
      if (!origCopyFileSync) {
        const fs = require('fs');
        globalThis._origCopyFileSync = fs.copyFileSync;
        fs.copyFileSync = function(src, dest, ...args) {
          try {
            return globalThis._origCopyFileSync(src, dest, ...args);
          } catch (e) {
            if (e.code === 'EAGAIN') return;
            throw e;
          }
        };
      }
    },
  };
}

export default defineConfig({
  output: 'static',
  site: 'https://www.lekkageexpert.nl',
  integrations: [
    react(),
    tailwind({ configFile: './tailwind.config.mjs' }),
    sitemap(),
  ],
  vite: {
    plugins: [skipBrokenPublicFiles()],
  },
});
