import { cacheLife, cacheTag } from "next/cache";
import { headers } from "next/headers";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { clampTaste, formatLocation, slugify } from "@/lib/format";
import { postcodeOffset } from "@/lib/postcodes";
import {
  cafes,
  coffees,
  coffeeReviews,
  favouriteCafes,
  favouriteCoffees,
} from "@/db/schema/public";

type CafeRow = typeof cafes.$inferSelect;
type CoffeeRow = typeof coffees.$inferSelect;
type ReviewRow = typeof coffeeReviews.$inferSelect;

export type CoffeeView = CoffeeRow & {
  avgBody: number | null;
  avgBrightness: number | null;
  avgScore: number | null;
  reviewCount: number;
  reviews: ReviewRow[];
};

export type CafeView = CafeRow & {
  slug: string;
  location: string;
  coffeeCount: number;
  avgScore: number | null;
  coffees: CoffeeView[];
};

export type NearbyCafeView = CafeView & {
  postcodeOffset: number | null;
};

function average(values: Array<number | null | undefined>) {
  const scored = values.filter(
    (value): value is number => typeof value === "number",
  );

  if (scored.length === 0) {
    return null;
  }

  return scored.reduce((total, value) => total + value, 0) / scored.length;
}

function shapeCafes(
  cafeRows: CafeRow[],
  coffeeRows: CoffeeRow[],
  reviewRows: ReviewRow[],
) {
  return cafeRows.map((cafe) => {
    const cafeCoffees = coffeeRows
      .filter((coffee) => coffee.cafe === cafe.id)
      .map((coffee) => {
        const reviews = reviewRows.filter((review) => review.coffeeId === coffee.id);
        return {
          ...coffee,
          avgBody: average(reviews.map((review) => review.body)),
          avgBrightness: average(reviews.map((review) => review.brightness)),
          avgScore: average(reviews.map((review) => review.score)),
          reviewCount: reviews.length,
          reviews,
        };
      });

    return {
      ...cafe,
      slug: slugify(cafe.name),
      location: formatLocation(cafe),
      coffeeCount: cafeCoffees.length,
      avgScore: average(cafeCoffees.map((coffee) => coffee.avgScore)),
      coffees: cafeCoffees,
    };
  });
}

async function readCafeTables() {
  const [cafeRows, coffeeRows, reviewRows] = await Promise.all([
    db.select().from(cafes).orderBy(cafes.name),
    db.select().from(coffees).orderBy(coffees.name),
    db.select().from(coffeeReviews).orderBy(desc(coffeeReviews.id)),
  ]);

  return shapeCafes(cafeRows, coffeeRows, reviewRows);
}

export async function getPublicCafeSummaries() {
  "use cache";
  cacheLife("minutes");
  cacheTag("cafes");

  const cafeViews = await readCafeTables();
  return cafeViews
    .toSorted((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0))
    .slice(0, 9);
}

export async function getNearbyCafeSummaries(postcode: string | null) {
  const cafeViews = await readCafeTables();

  return cafeViews
    .map((cafe) => ({
      ...cafe,
      postcodeOffset: postcodeOffset(cafe.postcode, postcode),
    }))
    .toSorted((a, b) => {
      if (a.postcodeOffset === null && b.postcodeOffset === null) {
        return a.name.localeCompare(b.name);
      }

      if (a.postcodeOffset === null) {
        return 1;
      }

      if (b.postcodeOffset === null) {
        return -1;
      }

      return a.postcodeOffset - b.postcodeOffset || a.name.localeCompare(b.name);
    });
}

export async function getCafePageData(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("cafes", `cafe:${slug}`);

  const cafeViews = await readCafeTables();
  return cafeViews.find((cafe) => cafe.slug === slug) ?? null;
}

export async function getCurrentSession() {
  const requestHeaders = await headers();
  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export async function getAccountData() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const [owned, cafeFavourites, coffeeFavourites, reviews] = await Promise.all([
    db.select().from(cafes).where(eq(cafes.userId, session.user.id)),
    db
      .select({ cafe: cafes })
      .from(favouriteCafes)
      .innerJoin(cafes, eq(favouriteCafes.cafeId, cafes.id))
      .where(eq(favouriteCafes.userId, session.user.id)),
    db
      .select({ coffee: coffees, cafe: cafes })
      .from(favouriteCoffees)
      .innerJoin(coffees, eq(favouriteCoffees.coffeeId, coffees.id))
      .innerJoin(cafes, eq(coffees.cafe, cafes.id))
      .where(eq(favouriteCoffees.userId, session.user.id)),
    db
      .select({ review: coffeeReviews, coffee: coffees, cafe: cafes })
      .from(coffeeReviews)
      .innerJoin(coffees, eq(coffeeReviews.coffeeId, coffees.id))
      .innerJoin(cafes, eq(coffees.cafe, cafes.id))
      .where(eq(coffeeReviews.userId, session.user.id)),
  ]);

  return {
    user: session.user,
    ownedCafes: owned.map((cafe) => ({ ...cafe, slug: slugify(cafe.name) })),
    favouriteCafes: cafeFavourites.map(({ cafe }) => ({
      ...cafe,
      slug: slugify(cafe.name),
    })),
    favouriteCoffees: coffeeFavourites.map(({ coffee, cafe }) => ({
      coffee,
      cafe: { ...cafe, slug: slugify(cafe.name) },
    })),
    reviews: reviews.map(({ review, coffee, cafe }) => ({
      review,
      coffee,
      cafe: { ...cafe, slug: slugify(cafe.name) },
    })),
  };
}

export async function getManagedCafeData(id: number) {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const [ownedCafe] = await db
    .select()
    .from(cafes)
    .where(and(eq(cafes.id, id), eq(cafes.userId, session.user.id)))
    .limit(1);

  if (!ownedCafe) {
    return {
      user: session.user,
      cafe: null,
      coffees: [],
    };
  }

  const cafeCoffees = await db
    .select()
    .from(coffees)
    .where(eq(coffees.cafe, ownedCafe.id))
    .orderBy(coffees.name);

  return {
    user: session.user,
    cafe: { ...ownedCafe, slug: slugify(ownedCafe.name) },
    coffees: cafeCoffees,
  };
}

export async function getCafeSlugsByIds(ids: number[]) {
  if (ids.length === 0) {
    return new Map<number, string>();
  }

  const rows = await db
    .select({ id: cafes.id, name: cafes.name })
    .from(cafes)
    .where(inArray(cafes.id, ids));

  return new Map(rows.map((cafe) => [cafe.id, slugify(cafe.name)]));
}

export async function isCafeFavourited(userId: string, cafeId: number) {
  const rows = await db
    .select({ cafeId: favouriteCafes.cafeId })
    .from(favouriteCafes)
    .where(and(eq(favouriteCafes.userId, userId), eq(favouriteCafes.cafeId, cafeId)))
    .limit(1);

  return rows.length > 0;
}

export async function isCoffeeFavourited(userId: string, coffeeId: number) {
  const rows = await db
    .select({ coffeeId: favouriteCoffees.coffeeId })
    .from(favouriteCoffees)
    .where(
      and(
        eq(favouriteCoffees.userId, userId),
        eq(favouriteCoffees.coffeeId, coffeeId),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

export function tastePercent(value: number | null) {
  const clamped = clampTaste(value);
  return clamped === null ? null : ((clamped - 1) / 9) * 100;
}
