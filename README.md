# Homepage

A personal portfolio homepage with a fully configurable admin UI, hosted on Cloudflare Pages with D1 (SQLite) database.

## Tech Stack

- **Frontend**: Vite + React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Hosting**: Cloudflare Pages
- **API**: Cloudflare Pages Functions
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Auth**: Clerk (admin-only)
- **Routing**: React Router v6

## Features

- Public homepage with intro, project cards, career timeline
- Fixed socials panel with localStorage collapse state
- Project detail modal with Markdown rendering
- Dark/light mode toggle (next-themes)
- Admin UI for all content (intro, projects, career, socials)
- Clerk-protected admin routes
- Full CRUD admin API endpoints with JWT middleware

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.dev.vars` file for wrangler local dev:

```
CLERK_SECRET_KEY=sk_test_...
ADMIN_CLERK_USER_ID=user_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Create a `.env.local` file for Vite:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 3. Create local D1 database and apply migrations

```bash
# Apply migrations to local D1
wrangler d1 migrations apply homepage --local

# Seed with sample data
wrangler d1 execute homepage --local --file=./db/seed.sql
```

### 4. Run dev server

```bash
# Frontend only (no API)
npm run dev

# With Cloudflare Pages Functions (API + frontend)
npx wrangler pages dev --d1 DB=homepage -- npm run dev
```

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

## Deployment (Cloudflare Pages)

1. Create a D1 database: `wrangler d1 create homepage`
2. Update `database_id` in `wrangler.toml`
3. Apply migrations to remote: `wrangler d1 migrations apply homepage --remote`
4. Connect GitHub repo to Cloudflare Pages (build command: `npm run build`, output dir: `dist`)
5. Set environment variables in Cloudflare Pages dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY` (secret)
   - `ADMIN_CLERK_USER_ID` (secret)
6. Add D1 binding (`DB`) in Pages dashboard

## Project Structure

```
/
├── public/
│   ├── screenshots/          # Project screenshots
│   └── _redirects            # SPA fallback
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
├── functions/
│   └── api/
│       ├── _middleware.ts    # Clerk JWT verification
│       ├── public/           # Public read-only endpoints
│       └── admin/            # Protected CRUD endpoints
├── db/
│   ├── schema.ts             # Drizzle schema
│   ├── migrations/           # Generated SQL migrations
│   └── seed.sql              # Sample data
├── wrangler.toml
└── drizzle.config.ts
```
