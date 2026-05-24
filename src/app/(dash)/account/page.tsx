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
import { SkeletonBlock } from "@/components/skeletons";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAccountData } from "@/lib/data";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import Form from "next/form";
import { SubmitButton } from "@/components/elements/submit-button";

export const metadata = {
  title: "Your account",
};

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="mb-8 rounded-lg border border-stone-950/10 bg-stone-950 p-6 text-stone-50 shadow-xl shadow-stone-950/15 sm:p-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">
          Your coffee desk
        </p>
        <h1 className="max-w-3xl text-5xl leading-none sm:text-6xl">
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
        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              {initials(data.user.name)}
            </div>
            <div>
              <h2 className="text-2xl text-stone-950">{data.user.name}</h2>
              <p className="text-sm text-stone-600">{data.user.email}</p>
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

        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AppIcon icon={FavouriteIcon} />
            <h2 className="text-2xl text-stone-950">Favourites</h2>
          </div>
          <div className="grid gap-3">
            {data.favouriteCafes.map((cafe) => (
              <Link
                className="rounded-md border border-stone-950/10 p-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href={`/cafes/${cafe.slug}`}
                key={cafe.id}
              >
                {cafe.name}
              </Link>
            ))}
            {data.favouriteCoffees.map(({ coffee, cafe }) => (
              <Link
                className="rounded-md border border-stone-950/10 p-3 text-sm text-stone-700 transition hover:bg-stone-50"
                href={`/cafes/${cafe.slug}`}
                key={coffee.id}
              >
                <span className="block font-semibold text-stone-950">
                  {coffee.name}
                </span>
                {cafe.name}
              </Link>
            ))}
            {data.favouriteCafes.length === 0 &&
            data.favouriteCoffees.length === 0 ? (
              <p className="rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-600">
                No favourites yet. Browse cafes and save what sounds like your
                next good decision.
              </p>
            ) : null}
          </div>
        </section>
      </aside>

      <div className="grid gap-6">
        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl text-stone-950">Create a cafe</h2>
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
            <Field className="gap-1 md:col-span-2">
              <FieldLabel className="text-stone-700">Description</FieldLabel>
              <Textarea
                className="min-h-24 rounded-lg border border-stone-950/10 bg-stone-50 p-3 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15"
                name="description"
                required
              />
            </Field>
            <SubmitButton
              icon={<AppIcon icon={Add01Icon} />}
              className="md:col-span-2"
            >
              Create cafe
            </SubmitButton>
          </Form>
        </section>

        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl text-stone-950">Managed cafes</h2>
          </div>
          <div className="grid gap-4">
            {data.ownedCafes.map((cafe) => (
              <article
                className="flex flex-col justify-between gap-4 rounded-lg border border-stone-950/10 bg-stone-50 p-4 sm:flex-row sm:items-center"
                key={cafe.id}
              >
                <div>
                  <h3 className="text-2xl text-stone-950">{cafe.name}</h3>
                  <p className="text-sm text-stone-600">
                    {cafe.suburb}
                    {cafe.state ? `, ${cafe.state}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-950 underline-offset-4 hover:underline"
                    href={`/account/cafes/${cafe.id}`}
                  >
                    Manage
                    <AppIcon icon={ArrowRight01Icon} size={15} />
                  </Link>
                  <Link
                    className="text-sm font-semibold text-stone-600 underline-offset-4 hover:text-stone-950 hover:underline"
                    href={`/cafes/${cafe.slug}`}
                  >
                    View page
                  </Link>
                </div>
              </article>
            ))}
            {data.ownedCafes.length === 0 ? (
              <p className="rounded-md bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                Create your first cafe above, then manage its coffees from here.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={StarIcon} />
            <h2 className="text-2xl text-stone-950">Your reviews</h2>
          </div>
          <div className="grid gap-3">
            {data.reviews.map(({ review, coffee, cafe }) => (
              <Link
                className="rounded-md border border-stone-950/10 p-4 transition hover:bg-stone-50"
                href={`/cafes/${cafe.slug}`}
                key={review.id}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-semibold text-stone-950">
                    {coffee.name}
                  </span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
                    {review.score}/10
                  </span>
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  {review.description}
                </p>
              </Link>
            ))}
            {data.reviews.length === 0 ? (
              <p className="rounded-md bg-stone-50 p-4 text-sm leading-6 text-stone-600">
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
    <div className="rounded-md bg-stone-50 px-3 py-4">
      <span className="block font-heading text-2xl text-stone-950">
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </span>
    </div>
  );
}

function TextField({
  label,
  name,
  required,
  type = "text",
  value,
  min,
  max,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  value?: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <Field className={cn("gap-1", className)}>
      <FieldLabel className="text-stone-700">{label}</FieldLabel>
      <Input
        defaultValue={value}
        max={max}
        min={min}
        name={name}
        required={required}
        type={type}
      />
    </Field>
  );
}

function AccountSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
      <SkeletonBlock className="h-[520px] rounded-lg" />
      <div className="grid gap-6">
        <SkeletonBlock className="h-80 rounded-lg" />
        <SkeletonBlock className="h-96 rounded-lg" />
      </div>
    </div>
  );
}
