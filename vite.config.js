import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        shopAll: resolve(__dirname, 'shop-all.html'),
        story: resolve(__dirname, 'our-story.html'),
        collection: resolve(__dirname, 'nova-trekking-collection.html'),
        keepClimbingProduct: resolve(__dirname, 'keep-climbing-mountain-tee.html'),
        mountainsWaitProduct: resolve(__dirname, 'mountains-wait-we-dont-tee.html'),
        defined: resolve(__dirname, 'defined.html'),
        focusTee: resolve(__dirname, 'focus-tee.html'),
        growthTee: resolve(__dirname, 'growth-tee.html'),
        disciplineCrew: resolve(__dirname, 'discipline-crew.html'),
        resilienceHoodie: resolve(__dirname, 'resilience-hoodie.html'),
        defindRedirect: resolve(__dirname, 'defind.html'),
      },
    },
  },
});
