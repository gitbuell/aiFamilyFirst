import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo SPA for aiFamilyFirst (Phase 1). Built to static assets, served by nginx.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000 },
})
