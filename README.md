# Roast

Roast is a Next.js app for finding coffee shops and tracking the coffees they serve. Visitors can browse cafes, inspect tasting notes, compare body and brightness, read community reviews, and save favourite cafes or coffees. Signed-in cafe owners can manage cafe profiles and coffee lists from their account area.

## What It Does

- Public cafe directory at `/` with ranked cafe summaries.
- Nearby browsing at `/nearby`, sorted from the request postcode supplied by Vercel's `x-vercel-ip-postal-code` header.
- Cafe detail pages at `/cafes/[slug]` with address details, coffees, tasting-note chips, review forms, favourite actions, and body/brightness charts.
- Email/password authentication through Better Auth.
- Account dashboard at `/account` for favourites, reviews, and owned cafes.
- Cafe management at `/account/cafes/[id]` for editing cafe details and adding or updating coffees.

## Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Server Actions in `src/app/actions.ts` for auth, favourites, reviews, cafes, and coffees.
- Better Auth with the Drizzle adapter for authentication tables.
- Drizzle ORM with PostgreSQL for application data.
- Tailwind CSS 4, shadcn-style primitives, Base UI, Hugeicons, and Recharts for the interface.
- Vercel Analytics and Speed Insights in the root layout.

## Project Structure

```text
src/app/
  (auth)/                sign-in and sign-up screens
  (public)/              public browsing routes and shared public header
    cafes/[slug]/        public cafe detail page
    nearby/              postcode-aware nearby listing
  (dash)/                signed-in account and cafe management routes
  api/auth/[...all]/     Better Auth API route
  actions.ts             Server Actions used by forms across the app
  globals.css            Tailwind theme, tokens, and global styles

src/components/
  cafe-grid.tsx          shared cafe listing cards
  coffee-dot-chart.tsx   body/brightness chart
  elements/              app-specific form controls
  ui/                    reusable UI primitives

src/db/
  index.ts               Drizzle client
  schema/                public app schema and Better Auth schema

src/lib/
  auth.ts                Better Auth configuration
  data.ts                query and view-shaping helpers
  format.ts              slug, initials, location, and taste formatting
  countries.ts           country select data
  postcodes.ts           nearby sorting helpers
```

## Data Model

The public app schema centers on cafes, coffees, reviews, and favourites:

- `cafes`: cafe profile, address, country, and owning user.
- `coffees`: coffees attached to a cafe, with notes plus intended body and brightness scores.
- `coffee_reviews`: user reviews with overall score and optional body/brightness impressions.
- `favourite_cafes` and `favourite_coffees`: saved items for signed-in users.

Cafe slugs are currently derived from cafe names with `slugify`; they are not stored as separate database fields.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a local environment file with database connection strings:

```bash
DATABASE_URL=postgres://...
DATABASE_URL_MIGRATE=postgres://...
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Push the current Drizzle schema to the database:

```bash
pnpm db:push
```

## Scripts

- `pnpm dev`: start the Next.js development server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production server.
- `pnpm lint`: run ESLint.
- `pnpm db:push`: push Drizzle schema changes to PostgreSQL.

There is no automated test script in the project yet.
