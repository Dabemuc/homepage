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

Create a `.dev.vars` file (read by the Cloudflare Vite plugin):

```
CLERK_SECRET_KEY=sk_test_...
ADMIN_CLERK_USER_ID=user_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

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

1. Create a D1 database: `npx wrangler d1 create homepage`
2. Update `database_id` in `wrangler.jsonc`
3. Apply migrations to remote: `npx wrangler d1 migrations apply homepage --remote`
4. Deploy: `npm run deploy`
5. Set secrets in Cloudflare dashboard or via wrangler:
   - `npx wrangler secret put CLERK_SECRET_KEY`
   - `npx wrangler secret put ADMIN_CLERK_USER_ID`
   - `npx wrangler secret put VITE_CLERK_PUBLISHABLE_KEY`

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
