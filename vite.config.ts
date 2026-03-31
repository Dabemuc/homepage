import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import path from 'path'
import type { Plugin } from 'vite'

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

// Intercepts and replaces the CSP header set by @cloudflare/vite-plugin.
// Without this, two CSP headers are sent simultaneously — Firefox (spec-compliant)
// applies the intersection of both, keeping the restrictive one from the plugin.
function replaceCspPlugin(): Plugin {
  return {
    name: 'replace-csp',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        const orig = res.setHeader.bind(res);
        res.setHeader = (name: string, value: string | number | readonly string[]) => {
          if (name.toLowerCase() === 'content-security-policy') {
            return orig(name, clerkCsp);
          }
          return orig(name, value);
        };
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    cloudflare(),
    react(),
    tailwindcss(),
    replaceCspPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
