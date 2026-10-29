import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' ensures universal compatibility on Netlify, GitHub Pages, Vercel, and custom domains
export default defineConfig({
  plugins: [react()],
  base: './',
})
