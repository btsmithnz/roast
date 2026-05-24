import Link from "next/link";
import { Suspense } from "react";
import {
  AiSearchIcon,
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
      <section className="border-b border-stone-950/10">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-950/10 bg-white/70 px-3 py-1 text-sm font-semibold text-stone-700 shadow-sm">
                <AppIcon icon={AiSearchIcon} />
                Explore
              </p>
              <h1 className="text-5xl leading-none text-stone-950 sm:text-6xl">
                Coffee shops
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Browse cafes by atmosphere, coffees, tasting notes, and what
                other coffee people are saying.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950"
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

      <section className="border-b border-stone-950/10 bg-white/55">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
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
    <div className="rounded-lg border border-stone-950/10 bg-white p-5">
      <span className="mb-5 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
        <AppIcon icon={icon} />
      </span>
      <h2 className="text-xl text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
    </div>
  );
}

async function ExploreCafeGrid() {
  const cafes = await getPublicCafeSummaries();
  return <CafeGrid cafes={cafes} />;
}
