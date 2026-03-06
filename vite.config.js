import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Weather-App-Full-Stack-MERN-/',
  plugins: [react()],
})