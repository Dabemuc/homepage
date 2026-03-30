# Homepage Project Specification

## Overview

A personal portfolio homepage with a fully configurable admin UI. One user (you), publicly visible, hosted on Cloudflare's edge infrastructure.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Vite + React 19 | Lightweight, static-friendly, no adapter complexity |
| Hosting | Cloudflare Pages | Edge CDN, integrates natively with D1, serves static assets |
| Server-side API | Cloudflare Pages Functions (`/functions`) | Workers-based API routes for admin mutations — no separate backend needed |
| Database | Cloudflare D1 (SQLite) | Free, serverless, edge-native |
| ORM | Drizzle ORM | Lightweight, edge-compatible, type-safe, D1 adapter |
| Auth | Clerk (React SDK + Pages Function middleware) | Handles session, redirect, JWT verification |
| UI Components | shadcn/ui | Accessible, composable, dark/light ready |
| Styling | Tailwind CSS v4 | Utility-first, co-located with shadcn |
| Image Storage | `public/screenshots/` in repo | ~10 project images, served as static assets by Cloudflare Pages — no object storage needed |
| Language | TypeScript | Throughout |
| Package Manager | npm | — |

No Next.js, no adapter, no R2, no Docker, no separate API server.

---

## Project Structure

```
/
├── public/
│   ├── screenshots/              # Project screenshots committed to repo
│   └── _redirects                # SPA fallback: /* /index.html 200
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── IntroSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   ├── CareerTimeline.tsx
│   │   │   └── CareerSection.tsx
│   │   ├── ui/                   # shadcn components
│   │   └── SocialsPanel.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminIntro.tsx
│   │       ├── AdminProjects.tsx
│   │       ├── AdminCareer.tsx
│   │       └── AdminSocials.tsx
│   ├── lib/
│   │   └── api.ts                # Typed fetch wrappers for Pages Functions
│   ├── App.tsx                   # React Router setup
│   └── main.tsx
├── functions/
│   └── api/
│       ├── _middleware.ts        # Clerk JWT verification for /api/admin/*
│       ├── public/
│       │   └── homepage.ts       # GET — single endpoint returns all public data
│       └── admin/
│           ├── intro.ts          # GET + PUT
│           ├── projects.ts       # GET + POST + PUT + DELETE
│           ├── career.ts         # GET + POST + PUT + DELETE
│           └── socials.ts        # GET + POST + PUT + DELETE
├── db/
│   ├── schema.ts                 # Drizzle schema
│   └── migrations/               # D1 migration SQL files (applied via wrangler, not at runtime)
├── wrangler.toml
├── vite.config.ts
└── package.json
```

---

## Database Schema

```ts
// site_config: key/value store for section visibility and global settings
site_config {
  key: text PRIMARY KEY,   // "intro_visible", "projects_visible", "career_visible"
  value: text
}

// intro: single row
intro {
  id: integer PRIMARY KEY,
  name: text,
  tagline: text,           // subtitle under name
  bio: text,               // longer paragraph
  avatar_url: text         // path to public/screenshots/ or external URL
}

// projects
projects {
  id: integer PRIMARY KEY,
  title: text,
  short_description: text, // one-liner shown on card
  description: text,       // markdown, shown in modal
  screenshot: text,        // filename in public/screenshots/ (e.g. "myproject.png")
  repo_url: text,
  website_url: text,       // nullable
  tags: text,              // JSON array stored as text e.g. '["Rust","CLI"]'
  display_order: integer,
  visible: boolean         // Drizzle integer({ mode: "boolean" })
}

// career_sections: top-level grouping (e.g. "Dual Studies at X and Y")
career_sections {
  id: integer PRIMARY KEY,
  title: text,
  display_order: integer,
  visible: boolean
}

// career_entries: timestamped nodes within a section
career_entries {
  id: integer PRIMARY KEY,
  section_id: integer REFERENCES career_sections(id) ON DELETE CASCADE,
  timestamp: text,         // display string e.g. "Oct 2021" — not a date type
  title: text,
  description: text,       // markdown
  display_order: integer
}

// social_links
social_links {
  id: integer PRIMARY KEY,
  platform: text,          // "github", "linkedin", etc.
  label: text,
  url: text,
  icon: text,              // lucide icon name
  display_order: integer,
  visible: boolean
}
```

---

## Migration Workflow

Migrations are generated locally with `drizzle-kit` and applied to D1 via `wrangler`. They **never run inside the Worker at runtime**.

```bash
# Generate migration SQL after schema changes
npx drizzle-kit generate

# Apply to local D1 (dev)
wrangler d1 migrations apply homepage --local

# Apply to remote D1 (production)
wrangler d1 migrations apply homepage --remote
```

This must be run manually before deploying any schema change. CI does not auto-migrate.

---

## Routing

React Router v6 handles client-side routing. `public/_redirects` contains `/* /index.html 200` so that direct navigation to any route (e.g. `/admin`) does not 404 on Cloudflare Pages.

| Route | Component | Notes |
|---|---|---|
| `/` | `HomePage` | Public, data fetched on mount from `/api/public/homepage` |
| `/admin` | `AdminDashboard` | Clerk-protected |
| `/admin/intro` | `AdminIntro` | |
| `/admin/projects` | `AdminProjects` | |
| `/admin/career` | `AdminCareer` | |
| `/admin/socials` | `AdminSocials` | |

Clerk's `<SignIn />` component handles the auth redirect. The `AdminLayout` component wraps all `/admin/*` routes and calls `useAuth()` — if not signed in, redirects to `/sign-in`.

---

## Pages Functions API

All functions receive a `PagesFunction<Env>` context with `env.DB` bound to D1.

**Public endpoint** (no auth, read-only):
- `GET /api/public/homepage` — returns `{ config, intro, projects, career, socials }` in a single round trip

**Admin endpoints** (Clerk JWT required):
- `GET|PUT /api/admin/intro`
- `GET|POST|PUT|DELETE /api/admin/projects`
- `GET|POST|PUT|DELETE /api/admin/career`
- `GET|POST|PUT|DELETE /api/admin/socials`

### Auth Middleware

`functions/api/_middleware.ts` runs on all `/api/admin/*` requests and:

1. Extracts the `Authorization: Bearer <token>` header
2. Calls Clerk's `verifyToken(token, { secretKey, issuer, audience })` to validate the JWT fully (type, issuer, audience)
3. Checks `userId === ADMIN_CLERK_USER_ID` env var — rejects any other Clerk user

### API Error Response Format

All functions return a consistent shape on error:

```ts
// Success
{ success: true, data: ... }

// Error
{ success: false, error: "PROJECT_NOT_FOUND" }  // uppercase snake_case code
```

HTTP status codes are also set correctly (400, 401, 403, 404, 500).

---

## Public Homepage Layout

```
┌─────────────────────────────────────────┐
│  [IntroSection]                         │
├─────────────────────────────────────────┤
│  [ProjectsSection]  (grid)              │
├─────────────────────────────────────────┤
│  [CareerTimeline]   (vertical)          │
├─────────────────────────────────────────┤
│  [Footer] ©2026, Dabemuc               │
└─────────────────────────────────────────┘
              [SocialsPanel] ← fixed right
```

Data is fetched on mount via `GET /api/public/homepage`. Sections hidden via `site_config` are not rendered.

### Intro Section

- `<h1>` name
- Tagline subtitle
- Bio paragraph
- Optional avatar

### Projects Section

- CSS grid: 3 columns desktop / 2 tablet / 1 mobile
- Each **card**: screenshot (fixed aspect-ratio box), title, short description, tag chips, repo icon link, website icon link (if set)
- Click anywhere on card (except icon links) → opens shadcn `<Dialog>` modal
- **Modal**: full markdown description, screenshot, all links, tags — clean two-column layout on desktop

### Career Timeline

- Full-width vertical center line
- Each `career_section` renders as a labeled block on the timeline
- Inside each section, `career_entries` are nodes on the line: timestamp + title + description
- **Hover effect**: hovering a section brightens its segment and slightly scales its entries; adjacent sections dim. Implemented with Tailwind `group-hover` + `opacity` + `transition`.
- **Top fade**: gradient overlay at the top fades into the background color with "More to come..." text — representing the open future
- **Bottom fade**: same gradient at the bottom entry fades in the beginning of the timeline
- Alternating left/right entry layout on desktop; single-column on mobile

### Socials Panel

- Fixed position, right side, vertically centered
- **Visible state**: icon + label links stacked in a small rounded card, with a collapse button (chevron-right)
- **Hidden state**: a small tab/handle peeks out from the right edge with a left-arrow indicator, suggesting something is off-screen. Clicking it slides the panel back in.
- Slide animation: `translate-x` + `transition-transform` on the panel container
- State persisted in `localStorage`. To avoid a hydration flash, the panel renders nothing until after the first mount (`useState(false)` + `useEffect(() => setMounted(true), [])`), then reads localStorage.

### Footer

```
© 2026, Dabemuc
```

Year computed dynamically from `new Date().getFullYear()`.

---

## Admin UI

Each admin page is a straightforward form-based editor using shadcn form components. No drag-and-drop — up/down reorder buttons are sufficient.

- **`/admin/intro`**: edit name, tagline, bio, avatar URL/path
- **`/admin/projects`**: list projects, add/edit/delete, reorder, toggle visibility. Screenshot field is a text input for the filename in `public/screenshots/` (user drops the file into the repo).
- **`/admin/career`**: list sections, add/edit/delete sections, within each section manage entries with timestamps/title/description
- **`/admin/socials`**: list social links, add/edit/delete, reorder, toggle visibility

---

## Dark / Light Mode

- `next-themes` (works without Next.js — just the npm package) wraps the app in `App.tsx`
- shadcn CSS variables swap automatically
- Toggle button in the top-right of the public page and admin

---

## Cloudflare Setup

### `wrangler.toml`

```toml
name = "homepage"
compatibility_date = "2024-09-23"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "homepage"
database_id = "<id from wrangler d1 create homepage>"
```

### D1 Client in Functions

```ts
import { drizzle } from "drizzle-orm/d1"

export function getDb(env: Env) {
  return drizzle(env.DB)
}
```

### Deployment

Connect the GitHub repo to Cloudflare Pages. Build command: `npm run build`. Output dir: `dist`. D1 binding set in Pages dashboard. Automatic deploy on push to `main`. **Run migrations manually against remote D1 before deploying schema changes.**

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Cloudflare Pages env | Clerk frontend key |
| `CLERK_SECRET_KEY` | Cloudflare Pages env (secret) | Clerk backend JWT verification |
| `ADMIN_CLERK_USER_ID` | Cloudflare Pages env (secret) | Your Clerk user ID — only this user can access admin |

---

## Key Packages

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^6",
    "@clerk/clerk-react": "^5",
    "@clerk/backend": "^1",
    "drizzle-orm": "^0.30",
    "next-themes": "^0.3",
    "react-markdown": "^9",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "vite": "^6",
    "@vitejs/plugin-react": "^4",
    "drizzle-kit": "^0.20",
    "wrangler": "^3",
    "tailwindcss": "^4",
    "@tailwindcss/typography": "^0.5",
    "typescript": "^5"
  }
}
```

`@clerk/backend` provides `verifyToken()` for use inside Pages Functions (Workers runtime).

shadcn components: `Button`, `Dialog`, `Badge`, `Card`, `Input`, `Textarea`, `Switch`, `Separator`

---

## Explicitly Out of Scope

- Analytics
- Contact form
- Multi-language support
- Draft/preview mode
- Image upload through admin UI (screenshots are committed to the repo)
- Any caching layer beyond Cloudflare's edge CDN

---

## Implementation Order

1. Scaffold Vite + React + TypeScript + Tailwind + shadcn
2. Add `public/_redirects` for SPA fallback
3. D1 schema + Drizzle migrations + seed script
4. Apply migrations locally, verify with `wrangler d1 execute --local`
5. Cloudflare Pages Functions skeleton + D1 binding
6. `GET /api/public/homepage` endpoint
7. Public homepage — all three sections with seed data
8. Socials panel with localStorage collapse + mount guard
9. Project modal
10. Career timeline with hover + fade effects
11. Dark/light toggle
12. Clerk setup + admin route guard
13. Admin CRUD pages (intro → projects → career → socials)
14. Admin API endpoints with Clerk JWT middleware (`@clerk/backend` `verifyToken`)
15. Apply migrations to remote D1, deploy to Cloudflare Pages
