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
    resolve: {
      alias: {
        // Le build ES de react-virtualized (via react-sortable-tree) importe un
        // export qui n'existe pas : le pré-bundle du serveur de dev échoue dessus
        'react-virtualized': 'react-virtualized/dist/commonjs',
      },
    },
    envPrefix: 'REACT_APP_',
    define: {
      // Des dépendances écrites pour webpack 4 lisent encore ces globales Node
      global: 'globalThis',
    },
    server: { port: 3000, proxy },
    preview: { proxy },
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          // Le worker de maplibre est un `.mjs`, extension que le `mime.types`
          // de nginx ignore : servi en application/octet-stream, le navigateur
          // refuse de le lancer et les couches vectorielles ne s'affichent pas
          assetFileNames: ({ names }) => (names?.[0]?.endsWith('.mjs')
            ? 'assets/[name]-[hash].js'
            : 'assets/[name]-[hash][extname]'),
        },
      },
    },
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
