"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, revalidatePath, revalidateTag } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { start } from "workflow/api";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import type { CountryCode } from "@/lib/countries";
import { getCafeSlugsByIds, getCurrentSession } from "@/lib/data";
import { slugify } from "@/lib/format";
import { sendWelcomeEmailAfterSignup } from "@/workflows/welcome-email";
import {
  cafes,
  coffees,
  coffeeReviews,
  favouriteCafes,
  favouriteCoffees,
} from "@/db/schema/public";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readInt(formData: FormData, key: string, fallback = 0) {
  const parsed = Number.parseInt(readString(formData, key), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readTaste(formData: FormData, key: string) {
  return Math.min(10, Math.max(1, readInt(formData, key, 5)));
}

function readNotes(formData: FormData) {
  return readString(formData, "notes")
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
}

function authErrorPath(pathname: string, message: string) {
  const params = new URLSearchParams({ error: message });
  return `${pathname}?${params.toString()}`;
}

function sameSitePath(value: string, fallback = "/") {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://roast.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

function revalidateCafePath(slug: string) {
  if (slug) {
    revalidatePath(`/cafes/${slug}`);
    revalidateTag(`cafe:${slug}`, "max");
  }
}

function revalidateManagedCafePath(cafeId: number) {
  if (cafeId > 0) {
    revalidatePath(`/account/cafes/${cafeId}`);
  }
}

async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}

async function createUniqueCafeSlug(name: string, excludeCafeId?: number) {
  const baseSlug = slugify(name) || "cafe";
  const rows = excludeCafeId
    ? await db
        .select({ id: cafes.id, slug: cafes.slug })
        .from(cafes)
        .where(ne(cafes.id, excludeCafeId))
    : await db.select({ id: cafes.id, slug: cafes.slug }).from(cafes);
  const usedSlugs = new Set(rows.map((cafe) => cafe.slug));

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${baseSlug}-${suffix}`;
    if (!usedSlugs.has(candidate)) {
      return candidate;
    }
  }
}

export async function signInWithEmail(formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const next = sameSitePath(readString(formData, "next"), "/account");

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch {
    redirect(authErrorPath("/sign-in", "We could not sign you in with those details."));
  }

  redirect(next);
}

export async function signUpWithEmail(formData: FormData) {
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
  } catch {
    redirect(authErrorPath("/sign-up", "That account could not be created."));
  }

  try {
    await start(sendWelcomeEmailAfterSignup, [{ name, email }]);
  } catch (error) {
    console.error("Failed to start welcome email workflow", error);
  }

  redirect("/account");
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}

export async function toggleCafeFavourite(formData: FormData) {
  const user = await requireUser();
  const cafeId = readInt(formData, "cafeId");

  const existing = await db
    .select({ cafeId: favouriteCafes.cafeId })
    .from(favouriteCafes)
    .where(and(eq(favouriteCafes.userId, user.id), eq(favouriteCafes.cafeId, cafeId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(favouriteCafes)
      .where(and(eq(favouriteCafes.userId, user.id), eq(favouriteCafes.cafeId, cafeId)));
  } else {
    await db.insert(favouriteCafes).values({ userId: user.id, cafeId });
  }

  revalidatePath("/account");
  refresh();
}

export async function toggleCoffeeFavourite(formData: FormData) {
  const user = await requireUser();
  const coffeeId = readInt(formData, "coffeeId");
  const [coffee] = await db
    .select({ cafeId: coffees.cafe })
    .from(coffees)
    .where(eq(coffees.id, coffeeId))
    .limit(1);

  if (!coffee) {
    redirect("/account");
  }

  const existing = await db
    .select({ coffeeId: favouriteCoffees.coffeeId })
    .from(favouriteCoffees)
    .where(
      and(
        eq(favouriteCoffees.userId, user.id),
        eq(favouriteCoffees.coffeeId, coffeeId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(favouriteCoffees)
      .where(
        and(
          eq(favouriteCoffees.userId, user.id),
          eq(favouriteCoffees.coffeeId, coffeeId),
        ),
      );
  } else {
    await db.insert(favouriteCoffees).values({ userId: user.id, coffeeId });
  }

  revalidatePath("/account");
  refresh();
}

export async function createCoffeeReview(formData: FormData) {
  const user = await requireUser();
  const coffeeId = readInt(formData, "coffeeId");
  const [coffee] = await db
    .select({ cafeId: coffees.cafe })
    .from(coffees)
    .where(eq(coffees.id, coffeeId))
    .limit(1);

  if (!coffee) {
    redirect("/account");
  }

  await db.insert(coffeeReviews).values({
    coffeeId,
    userId: user.id,
    description: readString(formData, "description"),
    score: Math.min(10, Math.max(1, readInt(formData, "score", 8))),
    body: readTaste(formData, "body"),
    brightness: readTaste(formData, "brightness"),
  });

  const slugs = await getCafeSlugsByIds([coffee.cafeId]);

  revalidatePath("/account");
  revalidateCafePath(slugs.get(coffee.cafeId) ?? "");
  revalidateTag("cafes", "max");
}

export async function createCafe(formData: FormData) {
  const user = await requireUser();
  const name = readString(formData, "name");
  const slug = await createUniqueCafeSlug(name);

  const [created] = await db
    .insert(cafes)
    .values({
      name,
      slug,
      description: readString(formData, "description"),
      image: readString(formData, "image") || null,
      addressLine1: readString(formData, "addressLine1"),
      addressLine2: readString(formData, "addressLine2") || null,
      suburb: readString(formData, "suburb"),
      state: readString(formData, "state") || null,
      postcode: readString(formData, "postcode"),
      country: readString(formData, "country") as CountryCode,
      userId: user.id,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/account");
  revalidateTag("cafes", "max");

  redirect(`/account/cafes/${created.id}`);
}

export async function updateCafe(formData: FormData) {
  const user = await requireUser();
  const cafeId = readInt(formData, "cafeId");
  const [ownedCafe] = await db
    .select({ id: cafes.id, slug: cafes.slug })
    .from(cafes)
    .where(and(eq(cafes.id, cafeId), eq(cafes.userId, user.id)))
    .limit(1);

  if (!ownedCafe) {
    redirect("/account");
  }

  const name = readString(formData, "name");
  const slug = await createUniqueCafeSlug(name, cafeId);

  await db
    .update(cafes)
    .set({
      name,
      slug,
      description: readString(formData, "description"),
      image: readString(formData, "image") || null,
      addressLine1: readString(formData, "addressLine1"),
      addressLine2: readString(formData, "addressLine2") || null,
      suburb: readString(formData, "suburb"),
      state: readString(formData, "state") || null,
      postcode: readString(formData, "postcode"),
      country: readString(formData, "country") as CountryCode,
    })
    .where(and(eq(cafes.id, cafeId), eq(cafes.userId, user.id)));

  revalidatePath("/");
  revalidatePath("/account");
  revalidateManagedCafePath(cafeId);
  revalidateCafePath(ownedCafe.slug);
  revalidateCafePath(slug);
  revalidateTag("cafes", "max");
}

export async function createCoffee(formData: FormData) {
  const user = await requireUser();
  const cafeId = readInt(formData, "cafeId");
  const [ownedCafe] = await db
    .select({ id: cafes.id, slug: cafes.slug })
    .from(cafes)
    .where(and(eq(cafes.id, cafeId), eq(cafes.userId, user.id)))
    .limit(1);

  if (!ownedCafe) {
    redirect("/account");
  }

  await db.insert(coffees).values({
    name: readString(formData, "name"),
    description: readString(formData, "description"),
    notes: readNotes(formData),
    cafe: cafeId,
    body: readTaste(formData, "body"),
    brightness: readTaste(formData, "brightness"),
  });

  revalidatePath("/account");
  revalidateManagedCafePath(cafeId);
  revalidateCafePath(ownedCafe.slug);
  revalidateTag("cafes", "max");

  redirect(`/account/cafes/${cafeId}`);
}

export async function updateCoffee(formData: FormData) {
  const user = await requireUser();
  const coffeeId = readInt(formData, "coffeeId");
  const cafeId = readInt(formData, "cafeId");
  const [ownedCafe] = await db
    .select({ id: cafes.id, slug: cafes.slug })
    .from(cafes)
    .innerJoin(coffees, eq(coffees.cafe, cafes.id))
    .where(
      and(
        eq(coffees.id, coffeeId),
        eq(cafes.id, cafeId),
        eq(cafes.userId, user.id),
      ),
    )
    .limit(1);

  if (!ownedCafe) {
    redirect("/account");
  }

  await db
    .update(coffees)
    .set({
      name: readString(formData, "name"),
      description: readString(formData, "description"),
      notes: readNotes(formData),
      body: readTaste(formData, "body"),
      brightness: readTaste(formData, "brightness"),
    })
    .where(eq(coffees.id, coffeeId));

  revalidatePath("/account");
  revalidateManagedCafePath(cafeId);
  revalidateCafePath(ownedCafe.slug);
  revalidateTag("cafes", "max");
}
