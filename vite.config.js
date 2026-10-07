import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Chemins servis par le backend, relayés par le serveur de dev et par `vite preview`
const BACKEND_PATHS = ['/api', '/static_dj', '/media', '/elasticsearch'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  // Le déploiement sert l'admin sous un sous-chemin (`PUBLIC_URL=/admin/` en CI)
  const base = `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}/`;

  const proxy = env.REACT_APP_API_HOST
    ? Object.fromEntries(BACKEND_PATHS.map(path => [path, {
      target:       env.REACT_APP_API_HOST,
      secure:       false,
      changeOrigin: true,
    }]))
    : undefined;

  return {
    base,
    plugins: [react()],
    envPrefix: 'REACT_APP_',
    define: {
      // Des dépendances écrites pour webpack 4 lisent encore ces globales Node
      global: 'globalThis',
    },
    server: { port: 3000, proxy },
    preview: { proxy },
    build: { outDir: 'build' },
    test: {
      environment: 'jsdom',
      environmentOptions: {
        jsdom: { url: 'http://localhost' },
      },
      globals: true,
      include: ['src/**/*.test.{js,jsx}'],
      setupFiles: ['src/setupTests.js'],
      server: {
        deps: {
          // @mui v7 importe `react/jsx-runtime` sans extension, ce que Node
          // ne résout pas sur React 16 (pas de champ `exports`) : Vite s'en charge
          inline: [/@mui\//],
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text-summary', 'lcov'],
        include: ['src/**/*.{js,jsx}'],
      },
    },
  };
});
