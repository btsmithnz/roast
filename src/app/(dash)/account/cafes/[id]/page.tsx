import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  CafeIcon,
  Coffee01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { createCoffee, updateCafe, updateCoffee } from "@/app/actions";
import { AppIcon } from "@/components/app-icon";
import { CountrySelect } from "@/components/elements/country-select";
import { ScoreSlider } from "@/components/elements/score-slider";
import { SubmitButton } from "@/components/elements/submit-button";
import { TextareaField, TextField } from "@/components/elements/text-field";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getManagedCafeData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Form from "next/form";

export const metadata = {
  title: "Manage cafe",
};

export default function ManagedCafePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Suspense fallback={<ManagedCafeSkeleton />}>
        {params.then(({ id }) => (
          <ManagedCafeContent id={id} />
        ))}
      </Suspense>
    </main>
  );
}

async function ManagedCafeContent({ id }: { id: string }) {
  const cafeId = Number.parseInt(id, 10);

  if (!Number.isFinite(cafeId)) {
    notFound();
  }

  const data = await getManagedCafeData(cafeId);

  if (!data) {
    redirect(`/sign-in?next=/account/cafes/${cafeId}`);
  }

  if (!data.cafe) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8">
        <Link
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/70 underline-offset-4 hover:text-primary-foreground hover:underline"
          href="/account"
        >
          <AppIcon icon={ArrowLeft01Icon} size={16} />
          Account
        </Link>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
              Cafe management
            </p>
            <h1 className="text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
              {data.cafe.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/70">
              Edit the cafe profile and keep its coffee list current.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "self-start lg:self-end",
            )}
            href={`/cafes/${data.cafe.slug}`}
          >
            <AppIcon icon={ViewIcon} />
            View public page
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl font-semibold">Cafe profile</h2>
          </div>
          <Form action={updateCafe} className="grid gap-3 md:grid-cols-2">
            <input name="cafeId" type="hidden" value={data.cafe.id} />
            <TextField
              label="Cafe name"
              name="name"
              required
              value={data.cafe.name}
            />
            <TextField
              label="Address line 1"
              name="addressLine1"
              required
              value={data.cafe.addressLine1}
            />
            <TextField
              label="Address line 2"
              name="addressLine2"
              value={data.cafe.addressLine2 ?? ""}
            />
            <TextField
              label="Suburb"
              name="suburb"
              required
              value={data.cafe.suburb}
            />
            <TextField
              label="State"
              name="state"
              value={data.cafe.state ?? ""}
            />
            <TextField
              label="Postcode"
              name="postcode"
              required
              value={data.cafe.postcode ?? ""}
            />
            <CountrySelect required value={data.cafe.country} />
            <TextField
              className="md:col-span-2"
              label="Image src"
              name="image"
              value={data.cafe.image ?? ""}
            />
            <TextareaField
              className="md:col-span-2"
              label="Description"
              name="description"
              required
              value={data.cafe.description ?? ""}
            />
            <SubmitButton className="md:col-span-2">Save cafe</SubmitButton>
          </Form>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={Add01Icon} />
            <h2 className="text-2xl font-semibold">Add coffee</h2>
          </div>
          <CoffeeForm cafeId={data.cafe.id} mode="create" />
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <AppIcon icon={Coffee01Icon} />
          <h2 className="text-2xl font-semibold">Coffees</h2>
        </div>
        <div className="grid gap-4">
          {data.coffees.map((coffee) => (
            <article
              className="rounded-xl border bg-muted/50 p-4"
              key={coffee.id}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold">{coffee.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {coffee.notes.length > 0
                    ? coffee.notes.join(", ")
                    : "No tasting notes yet"}
                </p>
              </div>
              <CoffeeForm cafeId={data.cafe.id} coffee={coffee} mode="edit" />
            </article>
          ))}
          {data.coffees.length === 0 ? (
            <p className="rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
              No coffees listed yet. Add the first one above.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CoffeeForm({
  cafeId,
  coffee,
  mode,
}: {
  cafeId: number;
  coffee?: {
    id: number;
    name: string;
    description: string | null;
    notes: string[];
    body: number;
    brightness: number;
  };
  mode: "create" | "edit";
}) {
  return (
    <Form
      action={mode === "create" ? createCoffee : updateCoffee}
      className="grid gap-3 md:grid-cols-2"
    >
      <input name="cafeId" type="hidden" value={cafeId} />
      {coffee ? (
        <input name="coffeeId" type="hidden" value={coffee.id} />
      ) : null}
      <TextField
        label="Coffee name"
        name="name"
        required
        value={coffee?.name}
      />
      <TextField
        label="Notes (comma-separated)"
        name="notes"
        required
        value={coffee?.notes.join(", ")}
      />
      <TextareaField
        className="md:col-span-2"
        label="Description"
        name="description"
        required
        value={coffee?.description ?? ""}
      />
      <div className="grid gap-5 rounded-xl border bg-card p-4 md:col-span-2 md:grid-cols-2">
        <ScoreSlider
          defaultValue={coffee?.body ?? 5}
          fromLabel="Light"
          label="Body"
          name="body"
          toLabel="Full"
        />
        <ScoreSlider
          defaultValue={coffee?.brightness ?? 5}
          fromLabel="Mellow/Chocolatey"
          label="Brightness"
          name="brightness"
          toLabel="Fruity/Floral"
        />
      </div>
      <SubmitButton className="md:col-span-2" size="sm">
        {mode === "create" ? "Add coffee" : "Save coffee"}
      </SubmitButton>
    </Form>
  );
}

function ManagedCafeSkeleton() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-64" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
      <Skeleton className="h-[420px]" />
    </div>
  );
}
