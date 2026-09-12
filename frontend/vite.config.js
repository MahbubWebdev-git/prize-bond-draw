import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/prizebond_draw/', // Subfolder Deployment এর জন্য অত্যন্ত জরুরি
})