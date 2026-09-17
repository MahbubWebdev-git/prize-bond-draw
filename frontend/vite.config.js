import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/prizebond_draw/', // Subfolder Deployment এর জন্য অত্যন্ত জরুরি
})