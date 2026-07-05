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
        keepClimbingCap: resolve(__dirname, 'keep-climbing-baseball-cap.html'),
        keepClimbingSweatShorts: resolve(__dirname, 'keep-climbing-sweat-shorts.html'),
        keepClimbingProduct: resolve(__dirname, 'keep-climbing-mountain-tee.html'),
        trailMountainTee: resolve(__dirname, 'trail-mountain-tee.html'),
        mountainsWaitProduct: resolve(__dirname, 'mountains-wait-we-dont-tee.html'),
        novaResetProduct: resolve(__dirname, 'nova-reset-tee.html'),
        defined: resolve(__dirname, 'defined.html'),
        focusTee: resolve(__dirname, 'focus-tee.html'),
        growthTee: resolve(__dirname, 'growth-tee.html'),
        growthDefinitionTee: resolve(__dirname, 'growth-definition-tee.html'),
        disciplineCrew: resolve(__dirname, 'discipline-crew.html'),
        resilienceHoodie: resolve(__dirname, 'resilience-hoodie.html'),
        resilienceTee: resolve(__dirname, 'resilience-tee.html'),
        defindRedirect: resolve(__dirname, 'defind.html'),
      },
    },
  },
});
