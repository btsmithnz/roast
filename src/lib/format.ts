import { getCountryName } from "@/lib/countries";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function clampTaste(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.min(10, Math.max(1, value));
}

export function formatLocation({
  suburb,
  state,
  postcode,
  country,
}: {
  suburb: string;
  state: string | null;
  postcode?: string | null;
  country: string;
}) {
  return [suburb, state, postcode, getCountryName(country)]
    .filter(Boolean)
    .join(", ");
}
