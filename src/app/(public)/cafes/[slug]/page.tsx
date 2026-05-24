import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BubbleChatAddIcon,
  CoffeeBeansIcon,
  FavouriteIcon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import {
  createCoffeeReview,
  toggleCafeFavourite,
  toggleCoffeeFavourite,
} from "@/app/actions";
import { AppIcon } from "@/components/app-icon";
import { ScoreSlider } from "@/components/elements/score-slider";
import { CoffeeDotChart } from "@/components/coffee-dot-chart";
import { SkeletonBlock } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  getCafePageData,
  getCurrentSession,
  isCafeFavourited,
  isCoffeeFavourited,
  type CafeView,
  type CoffeeView,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import Form from "next/form";
import { SubmitButton } from "@/components/elements/submit-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cafe = await getCafePageData(slug);

  return {
    title: cafe?.name ?? "Cafe",
    description: cafe?.description ?? "Coffee tasting notes and reviews.",
  };
}

export default function CafePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Suspense fallback={<CafeHeaderSkeleton />}>
        {params.then(({ slug }) => (
          <CafeHeader slug={slug} />
        ))}
      </Suspense>
      <Suspense fallback={<CoffeeListSkeleton />}>
        {params.then(({ slug }) => (
          <CafeCoffees slug={slug} />
        ))}
      </Suspense>
    </main>
  );
}

async function CafeHeader({ slug }: { slug: string }) {
  const cafe = await getCafePageData(slug);

  if (!cafe) {
    notFound();
  }

  return (
    <section className="mb-8 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
      <div className="rounded-lg border border-stone-950/10 bg-white p-6 shadow-sm sm:p-8">
        <Link
          className="mb-6 inline-flex text-sm font-semibold text-stone-600 underline-offset-4 hover:text-stone-950 hover:underline"
          href="/"
        >
          Back to cafes
        </Link>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            <AppIcon icon={Location01Icon} size={15} />
            {cafe.location}
          </span>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800">
            {cafe.coffeeCount} coffees
          </span>
          {cafe.avgScore ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-900">
              {Math.round(cafe.avgScore)}/10 avg
            </span>
          ) : null}
        </div>
        <h1 className="max-w-3xl text-5xl leading-none text-stone-950 sm:text-6xl">
          {cafe.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
          {cafe.description}
        </p>
      </div>
      <div className="rounded-lg border border-stone-950/10 bg-stone-950 p-6 text-stone-50 shadow-xl shadow-stone-950/15 sm:p-8">
        <div className="mb-12 flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-lg bg-white/10">
            <AppIcon icon={CoffeeBeansIcon} size={24} />
          </span>
          <Suspense
            fallback={<SkeletonBlock className="h-10 w-32 bg-white/10" />}
          >
            <CafeFavouriteButton cafe={cafe} />
          </Suspense>
        </div>
        <p className="font-heading text-3xl leading-tight">
          {cafe.addressLine1}
          {cafe.addressLine2 ? (
            <>
              <br />
              {cafe.addressLine2}
            </>
          ) : null}
        </p>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          Coffee pages show the cafe&apos;s intended body and brightness in
          rose, then review averages in blue as the community catches up.
        </p>
      </div>
    </section>
  );
}

async function CafeFavouriteButton({ cafe }: { cafe: CafeView }) {
  const session = await getCurrentSession();
  const favourited = session?.user
    ? await isCafeFavourited(session.user.id, cafe.id)
    : false;

  return (
    <Form action={toggleCafeFavourite}>
      <input name="cafeId" type="hidden" value={cafe.id} />
      <input name="slug" type="hidden" value={cafe.slug} />
      <SubmitButton
        icon={<FavouriteHeart filled={favourited} />}
        className={cn(
          "bg-white text-stone-950 hover:bg-stone-100",
          favourited && "bg-rose-100 text-rose-800 hover:bg-rose-100",
        )}
      >
        {favourited ? "Saved" : "Save cafe"}
      </SubmitButton>
    </Form>
  );
}

async function CafeCoffees({ slug }: { slug: string }) {
  const cafe = await getCafePageData(slug);

  if (!cafe) {
    notFound();
  }

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
            Coffee list
          </p>
          <h2 className="text-4xl text-stone-950">What they are pouring</h2>
        </div>
      </div>
      <div className="grid gap-5">
        {cafe.coffees.length > 0 ? (
          cafe.coffees.map((coffee) => (
            <CoffeeCard coffee={coffee} key={coffee.id} slug={cafe.slug} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-stone-950/20 bg-white/70 p-8 text-stone-600">
            This cafe has not listed coffees yet.
          </div>
        )}
      </div>
    </section>
  );
}

async function CoffeeCard({
  coffee,
  slug,
}: {
  coffee: CoffeeView;
  slug: string;
}) {
  return (
    <article className="grid gap-6 rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm lg:grid-cols-[1fr_260px] lg:p-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {coffee.notes.map((note) => (
            <span
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-950"
              key={note}
            >
              {note}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-3xl text-stone-950">{coffee.name}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              {coffee.description}
            </p>
          </div>
          <Suspense fallback={<SkeletonBlock className="h-9 w-32" />}>
            <CoffeeFavouriteButton coffeeId={coffee.id} slug={slug} />
          </Suspense>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Form
            action={createCoffeeReview}
            className="rounded-lg border border-stone-950/10 bg-stone-50 p-4"
          >
            <div className="mb-3 flex items-center gap-2 font-semibold text-stone-950">
              <AppIcon icon={BubbleChatAddIcon} />
              Review this coffee
            </div>
            <input name="coffeeId" type="hidden" value={coffee.id} />
            <input name="slug" type="hidden" value={slug} />
            <Field className="mb-3 gap-1">
              <FieldLabel className="sr-only">Review note</FieldLabel>
              <Textarea
                className="min-h-24 resize-y rounded-lg border border-stone-950/10 bg-white p-3 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15"
                name="description"
                placeholder="What did it taste like?"
                required
              />
            </Field>
            <div className="grid gap-5">
              <ScoreSlider
                defaultValue={8}
                fromLabel="Bad"
                label="Score"
                name="score"
                toLabel="Great"
              />
              <ScoreSlider
                defaultValue={coffee.body}
                fromLabel="Light"
                label="Body"
                name="body"
                toLabel="Full"
              />
              <ScoreSlider
                defaultValue={coffee.brightness}
                fromLabel="Mellow/Chocolatey"
                label="Brightness"
                name="brightness"
                toLabel="Fruity/Floral"
              />
            </div>
            <SubmitButton className="mt-3 w-full" size="sm">
              Post review
            </SubmitButton>
          </Form>
          <div className="rounded-lg border border-stone-950/10 bg-stone-50 p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-stone-950">
              <AppIcon icon={StarIcon} />
              Recent notes
            </div>
            <div className="grid gap-3">
              {coffee.reviews.slice(0, 2).map((review) => (
                <blockquote
                  className="rounded-md bg-white p-3 text-sm leading-6 text-stone-600"
                  key={review.id}
                >
                  &quot;{review.description}&quot;
                  <span className="mt-2 block font-semibold text-stone-950">
                    {review.score}/10
                  </span>
                </blockquote>
              ))}
              {coffee.reviews.length === 0 ? (
                <p className="text-sm leading-6 text-stone-600">
                  No reviews yet. A fresh page, waiting for someone opinionated.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <CoffeeDotChart
        avgBody={coffee.avgBody}
        avgBrightness={coffee.avgBrightness}
        body={coffee.body}
        brightness={coffee.brightness}
      />
    </article>
  );
}

async function CoffeeFavouriteButton({
  coffeeId,
  slug,
}: {
  coffeeId: number;
  slug: string;
}) {
  const session = await getCurrentSession();
  const favourited = session?.user
    ? await isCoffeeFavourited(session.user.id, coffeeId)
    : false;

  return (
    <Form action={toggleCoffeeFavourite}>
      <input name="coffeeId" type="hidden" value={coffeeId} />
      <input name="slug" type="hidden" value={slug} />
      <SubmitButton
        icon={<FavouriteHeart filled={favourited} />}
        className={cn(
          favourited &&
            "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100",
        )}
        size="sm"
        variant="outline"
      >
        {favourited ? "Saved" : "Save"}
      </SubmitButton>
    </Form>
  );
}

function FavouriteHeart({ filled }: { filled: boolean }) {
  if (!filled) {
    return <AppIcon icon={FavouriteIcon} />;
  }

  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 21s-7.5-4.6-9.4-9.2C1.2 8.4 3.3 5 6.9 5c2 0 3.4 1.1 4.1 2.1C11.7 6.1 13.1 5 15.1 5c3.6 0 5.7 3.4 4.3 6.8C17.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

function CafeHeaderSkeleton() {
  return (
    <section className="mb-8 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
      <div className="rounded-lg border border-stone-950/10 bg-white p-8">
        <SkeletonBlock className="mb-8 h-8 w-48" />
        <SkeletonBlock className="mb-4 h-16 max-w-2xl" />
        <SkeletonBlock className="h-24 max-w-xl" />
      </div>
      <SkeletonBlock className="min-h-72 rounded-lg bg-stone-300" />
    </section>
  );
}

function CoffeeListSkeleton() {
  return (
    <div className="grid gap-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonBlock className="h-96 rounded-lg" key={index} />
      ))}
    </div>
  );
}
