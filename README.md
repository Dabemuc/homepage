# Homepage

A personal portfolio homepage with a fully configurable admin UI, hosted on Cloudflare Workers with D1 (SQLite) database.

## Tech Stack

- **Frontend**: Vite + React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Hosting**: Cloudflare Workers
- **API**: Cloudflare Worker (`worker/index.ts`)
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Auth**: Clerk (admin-only)
- **Routing**: React Router v6

## Features

- Public homepage with intro, project cards, career timeline
- Project detail modal with Markdown rendering
- Admin UI for all content (intro, projects, career, socials)
- Clerk-protected admin routes
- Full CRUD admin API endpoints with JWT middleware

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example files and fill in your Clerk **test** keys:

```bash
cp .dev.vars.example .dev.vars
cp .env.local.example .env.local
```

- `.dev.vars` — Worker secrets (`CLERK_SECRET_KEY`, `ADMIN_CLERK_USER_ID`), loaded by wrangler automatically
- `.env.local` — frontend env vars (`VITE_CLERK_PUBLISHABLE_KEY`), loaded by Vite automatically

### 3. Apply migrations and seed

```bash
npx wrangler d1 migrations apply homepage --local
npx wrangler d1 execute homepage --local --file=./db/seed.sql
```

### 4. Run dev server

```bash
npm run dev
```

The `@cloudflare/vite-plugin` integrates D1 bindings and the Worker directly into Vite's dev server — no separate wrangler process needed.

## Database Migrations

After changing `db/schema.ts`:

```bash
# Generate migration
npx drizzle-kit generate

# Apply to local D1
wrangler d1 migrations apply homepage --local

# Apply to remote D1 (production)
wrangler d1 migrations apply homepage --remote
```

## Seeding

```bash
wrangler d1 execute homepage --local --file=./db/seed.sql
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deployment (Cloudflare Workers)

### 1. Set up production environment variables

Copy the example file and fill in your Clerk **live** keys:

```bash
cp .env.production.example .env.production
```

`.env.production` is used by Vite at build time — `VITE_CLERK_PUBLISHABLE_KEY` gets bundled into the frontend assets.

Worker secrets are set directly in Cloudflare (not in any file):

```bash
npx wrangler secret put CLERK_SECRET_KEY       # sk_live_...
npx wrangler secret put ADMIN_CLERK_USER_ID    # user_...
```

### 2. First-time setup

1. Create a D1 database: `npx wrangler d1 create homepage`
2. Update `database_id` in `wrangler.jsonc`
3. Apply migrations to remote: `npx wrangler d1 migrations apply homepage --remote`

### 3. Deploy

```bash
npm run deploy
```

Wrangler builds the Vite app (using `.env.production`) and deploys the Worker + static assets together.

## Regenerate Worker Types

After changing `wrangler.jsonc` bindings:

```bash
npm run cf-typegen
```

## Project Structure

```
/
├── public/
│   └── screenshots/          # Project screenshots
├── src/
│   ├── components/
│   │   ├── sections/         # HomePage section components
│   │   ├── ui/               # shadcn/ui components
│   │   └── SocialsPanel.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── admin/            # Admin pages (Clerk-protected)
│   ├── lib/
│   │   └── api.ts            # Typed API fetch wrappers
│   ├── App.tsx
│   └── main.tsx
├── worker/
│   └── index.ts              # Cloudflare Worker (API routes + auth)
├── db/
│   ├── schema.ts             # Drizzle schema
│   ├── migrations/           # Generated SQL migrations
│   └── seed.sql              # Sample data
├── wrangler.jsonc
└── drizzle.config.ts
```

## Disclaimer

This Project was "vibe-coded" (heavy use of AI)
