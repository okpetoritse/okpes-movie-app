import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Improve Lighthouse scores with better chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libs into separate chunk (better caching)
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons:  ['lucide-react'],
          axios:  ['axios'],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify output
    minify: 'esbuild',
    // Generate source maps for debugging (disable in final prod if needed)
    sourcemap: false,
  },
})
