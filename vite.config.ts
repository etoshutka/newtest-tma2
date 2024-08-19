import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/weedton_tma/',
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  publicDir: './public',
  server: {
    host: true,
  },
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});