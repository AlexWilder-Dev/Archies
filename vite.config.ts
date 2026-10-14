import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths: with hash routing the document is always the site
// root, so the build works on GitHub Pages whatever the repository is called.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
})
