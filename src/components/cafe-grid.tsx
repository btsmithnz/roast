import Link from "next/link";
import { CafeIcon, Location01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { buttonVariants } from "@/components/ui/button";
import type { CafeView } from "@/lib/data";
import { cn } from "@/lib/utils";

type CafeGridCafe = Pick<
  CafeView,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "location"
  | "avgScore"
  | "coffeeCount"
> & {
  metaLabel?: string | null;
};

export function CafeGrid({
  cafes,
  emptyActionHref = "/account",
  emptyActionLabel = "Add the first cafe",
  emptyCopy = "Once cafe owners add their spaces, they will appear here with coffees, tasting notes, and review averages.",
  emptyTitle = "No cafes yet",
}: {
  cafes: CafeGridCafe[];
  emptyActionHref?: string;
  emptyActionLabel?: string;
  emptyCopy?: string;
  emptyTitle?: string;
}) {
  if (cafes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-950/20 bg-white/70 p-8 text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-lg bg-stone-950 text-white">
          <AppIcon icon={CafeIcon} size={24} />
        </div>
        <h3 className="text-2xl text-stone-950">{emptyTitle}</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
          {emptyCopy}
        </p>
        <Link
          className={cn(buttonVariants({ size: "sm" }), "mt-5")}
          href={emptyActionHref}
        >
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cafes.map((cafe) => (
        <Link
          className="group rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10"
          href={`/cafes/${cafe.slug}`}
          key={cafe.id}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="grid size-14 place-items-center rounded-lg bg-stone-950 text-lg font-bold text-white">
              {cafe.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800">
              {cafe.avgScore ? `${Math.round(cafe.avgScore)}/10` : "new"}
            </span>
          </div>
          <h3 className="text-2xl text-stone-950 group-hover:underline group-hover:underline-offset-4">
            {cafe.name}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
            {cafe.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1">
              <AppIcon icon={Location01Icon} size={14} />
              {cafe.location}
            </span>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-900">
              {cafe.coffeeCount} coffees
            </span>
            {cafe.metaLabel ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-900">
                {cafe.metaLabel}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
