# Homepage

A personal portfolio homepage with a fully configurable admin UI, hosted on Cloudflare Workers with D1 (SQLite) database.

## Tech Stack

- **Frontend**: Vite + React 19, TypeScript, Tailwind CSS v4, shadcn/ui (admin)
- **Fonts**: Barlow Condensed + Space Mono, self-hosted via Fontsource (the CSP only allows `font-src 'self'`)
- **Hosting**: Cloudflare Workers
- **API**: Cloudflare Worker (`worker/index.ts`)
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Auth**: Clerk (admin-only)
- **Routing**: React Router v6

## Features

- Public homepage in the "Last Transmission" design (radio-station theme, fixed light palette):
  - **Top bar** — station label (`<Station name> — <Frequency> MHZ`, editable on the admin Intro page) + section nav; below `md` the nav collapses into a burger that slides in a sidebar
  - **Hero** — station illustration, headline, tagline and a `LIVE — DAY n` counter (days since the intro's *On air since* date)
  - **Operator profile** — a QSL card "issued" to each visitor, the bio, and a two-column skills grid
    - The card carries a visitor number (`QSL NO. 000042`): on a browser's first visit the page calls `POST /api/public/visit`, which increments `site_config.visitor_count` atomically (obvious bots are skipped by user agent); the number is then kept in `localStorage` so returning visitors keep theirs
  - **Broadcasts** — projects as `TX-00n` rows; clicking one opens a detail modal with screenshot, links and Markdown description
  - **Station log** — career sections as logbook sessions (the one marked *On air* is highlighted as the current position)
  - **Respond** — footer with the `mailto:` social as the main call to action (its address is shown below it) plus the other social links
- Admin UI for all content (intro, projects, career, skills, socials)
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

> **Note:** `0001` adds the `skills` table, `career_sections.active` and `intro.on_air_since`; `0002` adds `intro.station_name` and `intro.station_frequency`. Apply them to the remote D1 before deploying the new homepage design.

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
│   │   ├── sections/         # HomePage sections (Hero, Operator, Broadcasts, Log, Respond)
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Markdown.tsx      # Markdown renderer styled for the homepage
│   │   └── SiteHeader.tsx    # Homepage top bar + mobile slide-in nav
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── admin/            # Admin pages (Clerk-protected)
│   ├── lib/
│   │   ├── api.ts            # Typed API fetch wrappers
│   │   └── station.ts        # Fixed homepage copy (station name, frequency, QTH…) + helpers
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
