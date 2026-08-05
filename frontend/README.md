# Nomadic Ventures

Public site and admin CMS for a Sri Lanka / Maldives luxury travel agency — resort and tour listings, promotional offers, a chatbot widget, and a full content-management dashboard for staff.

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Database:** Supabase Postgres, accessed via Prisma ORM
- **Images:** Cloudinary (signed direct-to-Cloudinary uploads from the admin dashboard)
- **Auth:** Custom JWT-based admin auth (`admin_token` HTTP-only cookie), verified at the edge in `middleware.ts`
- **Styling:** Tailwind CSS

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with the following variables:
   - `DATABASE_URL`, `DIRECT_URL` — Supabase Postgres connection strings (used by Prisma)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — used for the admin login/session lookup
   - `JWT_SECRET` — required; the app will throw on startup if this is missing
   - `JWT_EXPIRES_IN` — admin session token lifetime
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_WHATSAPP_DISPLAY`
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run start` | Serve a production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  app/                 # App Router routes (public pages, /admin-dashboard, /api)
  components/          # Shared UI components
  components/admin/    # Admin-only components (wizards, dashboard chrome)
  lib/                 # Prisma/Supabase/Cloudinary clients, auth helpers, shared utilities
  hooks/                # Client-side hooks (e.g. admin auth state)
  middleware.ts         # Edge auth guard for /admin-dashboard and /api/admin routes
prisma/
  schema.prisma        # Source of truth for the database schema
```

Database schema changes are applied directly against Supabase with `npx prisma db push` (this project does not use versioned Prisma migrations).

## Deployment notes

This app uses SSR, middleware, and API routes, so it requires a Node.js-capable host (e.g. Hostinger's Node.js hosting tier, or a VPS) — it will not run on classic static/PHP shared hosting.
