import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Add01Icon,
  ArrowRight01Icon,
  CafeIcon,
  FavouriteIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { createCafe } from "@/app/actions";
import { AppIcon } from "@/components/app-icon";
import { CountrySelect } from "@/components/elements/country-select";
import { SubmitButton } from "@/components/elements/submit-button";
import { TextareaField, TextField } from "@/components/elements/text-field";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccountData } from "@/lib/data";
import { initials } from "@/lib/format";
import Form from "next/form";

export const metadata = {
  title: "Your account",
};

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="mb-8 rounded-2xl border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
          Your coffee desk
        </p>
        <h1 className="max-w-3xl text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
          Favourites, reviews, and cafes you manage.
        </h1>
      </section>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </main>
  );
}

async function AccountContent() {
  const data = await getAccountData();

  if (!data) {
    redirect("/sign-in?next=/account");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
      <aside className="grid content-start gap-6">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              {initials(data.user.name)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{data.user.name}</h2>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Metric label="Cafes" value={data.ownedCafes.length} />
            <Metric
              label="Saved"
              value={data.favouriteCafes.length + data.favouriteCoffees.length}
            />
            <Metric label="Reviews" value={data.reviews.length} />
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AppIcon icon={FavouriteIcon} />
            <h2 className="text-2xl font-semibold">Favourites</h2>
          </div>
          <div className="grid gap-3">
            {data.favouriteCafes.map((cafe) => (
              <Link
                className="rounded-xl border p-3 text-sm font-semibold transition-colors hover:bg-muted"
                href={`/cafes/${cafe.slug}`}
                key={cafe.id}
              >
                {cafe.name}
              </Link>
            ))}
            {data.favouriteCoffees.map(({ coffee, cafe }) => (
              <Link
                className="rounded-xl border p-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
                href={`/cafes/${cafe.slug}`}
                key={coffee.id}
              >
                <span className="block font-semibold text-foreground">
                  {coffee.name}
                </span>
                {cafe.name}
              </Link>
            ))}
            {data.favouriteCafes.length === 0 &&
            data.favouriteCoffees.length === 0 ? (
              <p className="rounded-xl bg-muted p-3 text-sm leading-6 text-muted-foreground">
                No favourites yet. Browse cafes and save what sounds like your
                next good decision.
              </p>
            ) : null}
          </div>
        </section>
      </aside>

      <div className="grid gap-6">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl font-semibold">Create a cafe</h2>
          </div>
          <Form action={createCafe} className="grid gap-3 md:grid-cols-2">
            <TextField label="Cafe name" name="name" required />
            <TextField label="Address line 1" name="addressLine1" required />
            <TextField label="Address line 2" name="addressLine2" />
            <TextField label="Suburb" name="suburb" required />
            <TextField label="State" name="state" />
            <TextField label="Postcode" name="postcode" required />
            <CountrySelect required />
            <TextField
              label="Image src"
              name="image"
              className="md:col-span-2"
            />
            <TextareaField
              className="md:col-span-2"
              label="Description"
              name="description"
              required
            />
            <SubmitButton
              icon={<AppIcon icon={Add01Icon} />}
              className="md:col-span-2"
            >
              Create cafe
            </SubmitButton>
          </Form>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl font-semibold">Managed cafes</h2>
          </div>
          <div className="grid gap-4">
            {data.ownedCafes.map((cafe) => (
              <article
                className="flex flex-col justify-between gap-4 rounded-xl border bg-muted/50 p-4 sm:flex-row sm:items-center"
                key={cafe.id}
              >
                <div>
                  <h3 className="text-2xl font-semibold">{cafe.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cafe.suburb}
                    {cafe.state ? `, ${cafe.state}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                    href={`/account/cafes/${cafe.id}`}
                  >
                    Manage
                    <AppIcon icon={ArrowRight01Icon} size={15} />
                  </Link>
                  <Link
                    className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    href={`/cafes/${cafe.slug}`}
                  >
                    View page
                  </Link>
                </div>
              </article>
            ))}
            {data.ownedCafes.length === 0 ? (
              <p className="rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
                Create your first cafe above, then manage its coffees from here.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={StarIcon} />
            <h2 className="text-2xl font-semibold">Your reviews</h2>
          </div>
          <div className="grid gap-3">
            {data.reviews.map(({ review, coffee, cafe }) => (
              <Link
                className="rounded-xl border p-4 transition-colors hover:bg-muted"
                href={`/cafes/${cafe.slug}`}
                key={review.id}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-semibold">{coffee.name}</span>
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    {review.score}/10
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {review.description}
                </p>
              </Link>
            ))}
            {data.reviews.length === 0 ? (
              <p className="rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
                Your coffee reviews will appear here after you post one from a
                cafe page.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-4">
      <span className="block font-heading text-2xl font-semibold">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
      <Skeleton className="h-[520px]" />
      <div className="grid gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
