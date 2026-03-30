Longer-term fix: upgrade to wrangler 4 (npm install --save-dev wrangler@4) which has proper proxy support. Or use @cloudflare/vite-plugin which integrates D1 bindings directly into
Vite's dev server so you can just run npm run dev. But let's get it working first.
