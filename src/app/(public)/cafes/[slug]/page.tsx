import Link from "next/link";
import Image from "next/image";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  getCafePageData,
  getCafeStaticParams,
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

export async function generateStaticParams() {
  return getCafeStaticParams();
}

export default async function CafePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cafe = await getCafePageData(slug);

  if (!cafe) {
    notFound();
  }

  const jsonLd = getCafeJsonLd(cafe);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <CafeHeader cafe={cafe} />
        <CafeCoffees cafe={cafe} />
      </main>
    </>
  );
}

function getCafeJsonLd(cafe: CafeView) {
  const reviewCount = cafe.coffees.reduce(
    (total, coffee) => total + coffee.reviewCount,
    0,
  );
  const coffeeItems = cafe.coffees.map((coffee) => ({
    "@type": "MenuItem",
    name: coffee.name,
    ...(coffee.description ? { description: coffee.description } : {}),
    ...(coffee.notes.length > 0 ? { keywords: coffee.notes.join(", ") } : {}),
    ...(coffee.avgScore !== null && coffee.reviewCount > 0
      ? { aggregateRating: getAggregateRating(coffee.avgScore, coffee.reviewCount) }
      : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    ...(cafe.description ? { description: cafe.description } : {}),
    ...(cafe.image ? { image: cafe.image } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: [cafe.addressLine1, cafe.addressLine2].filter(Boolean).join(", "),
      addressLocality: cafe.suburb,
      ...(cafe.state ? { addressRegion: cafe.state } : {}),
      postalCode: cafe.postcode,
      addressCountry: cafe.country,
    },
    ...(cafe.avgScore !== null && reviewCount > 0
      ? { aggregateRating: getAggregateRating(cafe.avgScore, reviewCount) }
      : {}),
    ...(coffeeItems.length > 0
      ? {
          hasMenu: {
            "@type": "Menu",
            name: `${cafe.name} coffees`,
            hasMenuSection: {
              "@type": "MenuSection",
              name: "Coffee",
              hasMenuItem: coffeeItems,
            },
          },
        }
      : {}),
  };
}

function getAggregateRating(ratingValue: number, reviewCount: number) {
  return {
    "@type": "AggregateRating",
    ratingValue: Number(ratingValue.toFixed(1)),
    bestRating: 10,
    worstRating: 1,
    reviewCount,
  };
}

function serializeJsonLd(jsonLd: unknown) {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

function CafeHeader({ cafe }: { cafe: CafeView }) {
  return (
    <section className="mb-8 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <Link
          className="mb-6 inline-flex text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          href="/"
        >
          Back to cafes
        </Link>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            <AppIcon icon={Location01Icon} size={15} />
            {cafe.location}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
            {cafe.coffeeCount} coffees
          </span>
          {cafe.avgScore ? (
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              {Math.round(cafe.avgScore)}/10 avg
            </span>
          ) : null}
        </div>
        <h1 className="max-w-3xl text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl">
          {cafe.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {cafe.description}
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-primary text-primary-foreground shadow-xl shadow-primary/20">
        {cafe.image ? (
          <div className="relative min-h-72 bg-primary/80 sm:min-h-80">
            <Image
              alt={`${cafe.name} cafe`}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              src={cafe.image}
            />
          </div>
        ) : null}
        <div className="p-6 sm:p-8">
          <div className="mb-12 flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-foreground/10">
              <AppIcon icon={CoffeeBeansIcon} size={24} />
            </span>
            <Suspense
              fallback={<Skeleton className="h-8 w-32 rounded-full bg-primary-foreground/10" />}
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
          <p className="mt-4 text-sm leading-6 text-primary-foreground/70">
            Coffee pages show the cafe&apos;s intended body and brightness in
            rose, then review averages in blue as the community catches up.
          </p>
        </div>
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
        variant="secondary"
        className={cn(favourited && "bg-accent text-accent-foreground hover:bg-accent/90")}
      >
        {favourited ? "Saved" : "Save cafe"}
      </SubmitButton>
    </Form>
  );
}

function CafeCoffees({ cafe }: { cafe: CafeView }) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Coffee list
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">What they are pouring</h2>
        </div>
      </div>
      <div className="grid gap-5">
        {cafe.coffees.length > 0 ? (
          cafe.coffees.map((coffee) => (
            <CoffeeCard coffee={coffee} key={coffee.id} slug={cafe.slug} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed bg-card/60 p-8 text-muted-foreground">
            This cafe has not listed coffees yet.
          </div>
        )}
      </div>
    </section>
  );
}

function CoffeeCard({
  coffee,
  slug,
}: {
  coffee: CoffeeView;
  slug: string;
}) {
  return (
    <article className="grid gap-6 rounded-2xl border bg-card p-5 shadow-sm lg:grid-cols-[1fr_260px] lg:p-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {coffee.notes.map((note) => (
            <span
              className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground"
              key={note}
            >
              {note}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-3xl font-semibold tracking-tight">{coffee.name}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {coffee.description}
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-8 w-32 rounded-full" />}>
            <CoffeeFavouriteButton coffeeId={coffee.id} slug={slug} />
          </Suspense>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Form
            action={createCoffeeReview}
            className="rounded-2xl border bg-muted/50 p-4"
          >
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <AppIcon icon={BubbleChatAddIcon} />
              Review this coffee
            </div>
            <input name="coffeeId" type="hidden" value={coffee.id} />
            <input name="slug" type="hidden" value={slug} />
            <Field className="mb-3 gap-1.5">
              <FieldLabel className="sr-only">Review note</FieldLabel>
              <Textarea
                className="min-h-24 bg-card"
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
          <div className="rounded-2xl border bg-muted/50 p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <AppIcon icon={StarIcon} />
              Recent notes
            </div>
            <div className="grid gap-3">
              {coffee.reviews.slice(0, 2).map((review) => (
                <blockquote
                  className="rounded-xl bg-card p-3 text-sm leading-6 text-muted-foreground"
                  key={review.id}
                >
                  &quot;{review.description}&quot;
                  <span className="mt-2 block font-semibold text-foreground">
                    {review.score}/10
                  </span>
                </blockquote>
              ))}
              {coffee.reviews.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
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
          favourited && "border-transparent bg-accent text-accent-foreground hover:bg-accent/90",
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
