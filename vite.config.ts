import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site
export default defineConfig({
  base: '/archies-herne-hill/',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
})
