import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ArrowLeft01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { CafeGrid } from "@/components/cafe-grid";
import { CafeListSkeleton } from "@/components/skeletons";
import { getNearbyCafeSummaries } from "@/lib/data";

export const metadata = {
  title: "Nearby coffee shops",
};

export default function NearbyPage() {
  return (
    <main>
      <section className="border-b border-stone-950/10">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-950/10 bg-white/70 px-3 py-1 text-sm font-semibold text-stone-700 shadow-sm">
                <AppIcon icon={Location01Icon} />
                Nearby
              </p>
              <h1 className="text-5xl leading-none text-stone-950 sm:text-6xl">
                Coffee shops near you
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                A local view of cafes, lined up from your request postcode.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950"
              href="/"
            >
              <AppIcon icon={ArrowLeft01Icon} />
              Explore all cafes
            </Link>
          </div>

          <Suspense fallback={<CafeListSkeleton />}>
            <NearbyCafeGrid />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function NearbyCafeGrid() {
  const requestHeaders = await headers();
  const userPostcode =
    requestHeaders.get("x-vercel-ip-postal-code")?.trim() || null;
  const cafes = await getNearbyCafeSummaries(userPostcode);
  const cafesWithMeta = cafes.map((cafe) => ({
    ...cafe,
    metaLabel: formatPostcodeOffset(cafe.postcodeOffset),
  }));

  return (
    <div className="grid gap-4">
      <p className="text-sm font-medium text-stone-600">
        {userPostcode
          ? `Detected postcode ${userPostcode}`
          : "Postcode unavailable for this request"}
      </p>
      <CafeGrid
        cafes={cafesWithMeta}
        emptyActionHref="/account"
        emptyActionLabel="Add a cafe"
        emptyCopy="Add cafes with postcodes and they will appear here for nearby browsing."
        emptyTitle="No nearby cafes yet"
      />
    </div>
  );
}

function formatPostcodeOffset(offset: number | null) {
  if (offset === null) {
    return null;
  }

  if (offset === 0) {
    return "same postcode";
  }

  return `${offset} postcode offset`;
}
