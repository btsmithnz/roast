<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Roast Project Notes

Roast is a coffee shop discovery and cafe management app. Public users browse cafes and coffees, compare tasting notes plus body/brightness scores, save favourites, and write reviews. Signed-in cafe owners manage cafe profiles and the coffees they serve.

## Tech Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Server Actions live in `src/app/actions.ts` and back most form mutations.
- Better Auth handles email/password auth through `src/app/api/auth/[...all]/route.ts`.
- Drizzle ORM talks to PostgreSQL using schemas in `src/db/schema/`.
- Tailwind CSS 4, shadcn-style UI primitives, Base UI, Hugeicons, and Recharts shape the UI.
- Package manager: pnpm.

## Important Structure

- `src/app/(public)/`: public browsing shell, home directory, nearby listing, and cafe detail pages.
- `src/app/(auth)/`: sign-in and sign-up routes.
- `src/app/(dash)/`: signed-in account dashboard and cafe management pages.
- `src/app/actions.ts`: sign-in/sign-up/sign-out plus cafe, coffee, review, and favourite mutations.
- `src/lib/data.ts`: query helpers that shape database rows into route-ready view models.
- `src/lib/format.ts`: slug, initials, location, and score formatting helpers.
- `src/lib/postcodes.ts`: nearby sorting helper based on postcode distance.
- `src/components/elements/`: app-specific form components such as score sliders and submit buttons.
- `src/components/ui/`: reusable low-level UI primitives.
- `src/db/schema/public.ts`: cafes, coffees, reviews, and favourites.
- `src/db/schema/better-auth.ts`: Better Auth tables.

## Data And Routing Notes

- Cafe slugs are derived from cafe names with `slugify`; they are not persisted in the database.
- Public cafe reads are cached with Next cache tags such as `cafes` and `cafe:${slug}`. Mutations revalidate affected paths and tags in `src/app/actions.ts`.
- Nearby browsing depends on Vercel's `x-vercel-ip-postal-code` request header and falls back gracefully when unavailable.
- Account and cafe management data must be scoped to the current authenticated user.
- Taste values are expected to be clamped to the 1-10 range.

## Development Commands

- `pnpm dev`: run the development server.
- `pnpm build`: build for production.
- `pnpm start`: run the production server.
- `pnpm lint`: run ESLint.
- `pnpm db:push`: push the Drizzle schema to PostgreSQL.

Environment variables used directly by this repo:

- `DATABASE_URL`: runtime PostgreSQL connection for Drizzle.
- `DATABASE_URL_MIGRATE`: migration/schema-push PostgreSQL connection for Drizzle Kit.

## Working Guidelines

- Before changing Next.js APIs, routing, caching, forms, or config, read the matching guide under `node_modules/next/dist/docs/`.
- Preserve the route-group split between public, auth, and dashboard surfaces unless the feature truly crosses those boundaries.
- Keep user-owned mutations guarded by the current Better Auth session and owner checks.
- Reuse existing UI primitives and form patterns before adding new component styles.
- Keep database schema changes in `src/db/schema/` and update docs when project structure or setup changes.
- There is no test script yet; use `pnpm lint` and, for behavior changes, a local app check as the minimum verification.
