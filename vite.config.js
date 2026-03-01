import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Use terser for more aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Strip console.error/warn/log in production
        drop_console: true,
        drop_debugger: true,
        // Collapse constant conditions
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy vendor libs in dedicated cacheable chunks
          'vendor-three': ['three'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-supabase': ['@supabase/supabase-js'],
          // Motion/animation lib
          'vendor-motion': ['motion'],
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Gemini API client
          'vendor-genai': ['@google/genai'],
        }
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase reporting threshold since we've split aggressively
    chunkSizeWarningLimit: 500,
  },
})
