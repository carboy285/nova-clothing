import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'our-story.html'),
        collection: resolve(__dirname, 'nova-trekking-collection.html'),
        product: resolve(__dirname, 'keep-climbing-mountain-tee.html'),
        defined: resolve(__dirname, 'defind.html'),
      },
    },
  },
});
