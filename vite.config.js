import { fileURLToPath, URL } from "url"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"



export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', 
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor_firebase';
            }
            if (id.includes('framer-motion')) {
              return 'vendor_framer-motion';
            }
            // Regrouper le reste des vendors dans un seul fichier
            return 'vendor_others';
          }
        }
      }
    }
  }
})