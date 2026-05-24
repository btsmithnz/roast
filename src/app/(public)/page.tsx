import Link from "next/link";
import { Suspense } from "react";
import {
  SearchIcon,
  ArrowRight01Icon,
  CafeIcon,
  CoffeeBeansIcon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { CafeGrid } from "@/components/cafe-grid";
import { CafeListSkeleton } from "@/components/skeletons";
import { getPublicCafeSummaries } from "@/lib/data";

export const metadata = {
  title: "Find your kind of coffee shop",
};

export default function LandingPage() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-semibold text-muted-foreground shadow-sm">
                <AppIcon icon={SearchIcon} />
                Explore
              </p>
              <h1 className="max-w-3xl text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Find your kind of coffee shop.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Browse cafes by atmosphere, coffees, tasting notes, and what
                other coffee people are saying.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
              href="/account"
            >
              Own a cafe?
              <AppIcon icon={ArrowRight01Icon} />
            </Link>
          </div>

          <div id="cafes">
            <Suspense fallback={<CafeListSkeleton />}>
              <ExploreCafeGrid />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3">
          <FeatureCard
            copy="See whether a place is quiet, social, fast, design-heavy, or built for lingering."
            icon={CafeIcon}
            title="Match the room"
          />
          <FeatureCard
            copy="Coffee pages keep tasting notes, descriptions, and review scores in one place."
            icon={CoffeeBeansIcon}
            title="Pick the cup"
          />
          <FeatureCard
            copy="Signed-in users can save cafes, save coffees, and leave reviews after they visit."
            icon={FavouriteIcon}
            title="Remember favourites"
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  copy,
  icon,
}: {
  title: string;
  copy: string;
  icon: typeof CafeIcon;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <span className="mb-5 grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <AppIcon icon={icon} />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}

async function ExploreCafeGrid() {
  const cafes = await getPublicCafeSummaries();
  return <CafeGrid cafes={cafes} />;
}
