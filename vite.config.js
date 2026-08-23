import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // '/EMD_Web-site/' uniquement pour les déploiements GitHub Pages (Actions), sinon '/'
  base: mode === 'production' && process.env.GITHUB_ACTIONS === 'true' ? '/EMD_Web-site/' : '/',
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Sépare les librairies stables pour un meilleur cache navigateur
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-axios': ['axios'],
        },
      },
    },
  },
}))
