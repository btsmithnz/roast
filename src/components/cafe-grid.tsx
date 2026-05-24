import Link from "next/link";
import Image from "next/image";
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
  | "image"
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
      <div className="rounded-2xl border border-dashed bg-card/60 p-8 text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-xl bg-primary text-primary-foreground">
          <AppIcon icon={CafeIcon} size={24} />
        </div>
        <h3 className="text-2xl font-semibold">{emptyTitle}</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
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
          className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
          href={`/cafes/${cafe.slug}`}
          key={cafe.id}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <CafeCardImage image={cafe.image} name={cafe.name} />
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              {cafe.avgScore ? `${Math.round(cafe.avgScore)}/10` : "new"}
            </span>
          </div>
          <h3 className="text-2xl font-semibold group-hover:underline group-hover:underline-offset-4">
            {cafe.name}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {cafe.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
              <AppIcon icon={Location01Icon} size={14} />
              {cafe.location}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              {cafe.coffeeCount} coffees
            </span>
            {cafe.metaLabel ? (
              <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                {cafe.metaLabel}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

function CafeCardImage({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  if (!image) {
    return (
      <div className="grid size-14 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative size-14 overflow-hidden rounded-xl bg-muted">
      <Image
        alt=""
        className="object-cover"
        fill
        sizes="56px"
        src={image}
      />
    </div>
  );
}
