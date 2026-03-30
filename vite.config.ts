import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import path from 'path'

const clerkCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.dev",
  "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev wss://*.clerk.accounts.dev",
  "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev",
  "img-src 'self' data: blob: https://img.clerk.com https:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
].join("; ");

export default defineConfig({
  plugins: [
    cloudflare(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": clerkCsp,
    },
  },
})
